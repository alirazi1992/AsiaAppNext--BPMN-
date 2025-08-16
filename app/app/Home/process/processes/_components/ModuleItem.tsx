"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  index: number;
  register: UseFormRegister<any>;
  onRemove: () => void;
  errors: FieldErrors<{
    modules: {
      title: string;
      owner: string;
    }[];
  }>;
}

export default function ModuleItem({ index, register, onRemove, errors }: Props) {
  const moduleErrors = errors.modules?.[index];

  return (
    <div className="flex flex-col md:flex-row gap-2 mb-2 border p-3 rounded bg-gray-50 shadow-sm relative">
      <div className="w-full md:w-1/2">
        <label className="text-sm font-semibold">عنوان ماژول:</label>
        <input {...register(`modules.${index}.title`)} className="w-full border rounded p-2 mt-1" />
        {moduleErrors?.title?.message && (
          <p className="text-red-600 text-xs mt-1">{moduleErrors.title.message as string}</p>
        )}
      </div>

      <div className="w-full md:w-1/2">
        <label className="text-sm font-semibold">نام مسئول:</label>
        <input {...register(`modules.${index}.owner`)} className="w-full border rounded p-2 mt-1" />
        {moduleErrors?.owner?.message && (
          <p className="text-red-600 text-xs mt-1">{moduleErrors.owner.message as string}</p>
        )}
      </div>

      <button type="button" onClick={onRemove} className="absolute top-2 left-2 text-red-600 text-sm">
        حذف
      </button>
    </div>
  );
}
