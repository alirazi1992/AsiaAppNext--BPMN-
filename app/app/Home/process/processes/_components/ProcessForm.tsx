"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { Process } from "../types/processes.types";
import ModuleItem from "./ModuleItem";

interface Props {
  onAdd: (newProcess: Process) => void;
}

const schema = yup.object().shape({
  name: yup.string().required("نام فرآیند الزامی است"),
  description: yup.string().required("توضیحات الزامی است"),
  modules: yup.array().of(
    yup.object().shape({
      title: yup.string().required("عنوان ماژول الزامی است"),
      owner: yup.string().required("نام مسئول الزامی است"),
    })
  ),
});

export default function ProcessForm({ onAdd }: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      name: "",
      description: "",
      modules: [{ title: "", owner: "" }],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "modules",
  });

  const onSubmit = (data: any) => {
    const newProcess: Process = {
      id: uuidv4(),
      ...data,
    };
    onAdd(newProcess);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-5 rounded shadow-md">
      {/* Process Name */}
      <div>
        <label className="block mb-1 font-semibold">نام فرآیند:</label>
        <input {...register("name")} className="w-full border p-2 rounded" />
        <p className="text-red-500 text-sm mt-1">{(errors.name?.message as string) || ""}</p>
      </div>

      {/* Process Description */}
      <div>
        <label className="block mb-1 font-semibold">توضیحات:</label>
        <textarea {...register("description")} className="w-full border p-2 rounded" />
        <p className="text-red-500 text-sm mt-1">{(errors.description?.message as string) || ""}</p>
      </div>

      {/* Modules Section */}
      <div>
        <label className="block mb-2 font-semibold">ماژول‌ها:</label>
        {fields.map((field, index) => (
          <ModuleItem key={field.id} index={index} register={register} onRemove={() => remove(index)} errors={errors} />
        ))}
        <button type="button" onClick={() => append({ title: "", owner: "" })} className="mt-2 text-blue-600 text-sm">
          ➕ افزودن ماژول جدید
        </button>
      </div>

      {/* Submit Button */}
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        ثبت فرآیند
      </button>
    </form>
  );
}
