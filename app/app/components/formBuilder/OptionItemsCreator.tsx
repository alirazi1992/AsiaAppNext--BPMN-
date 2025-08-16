import React from "react";
import { FormItem } from "./formBuilder-types";
import { SelectOption } from "../formRenderer/formRenderer-types";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { IconButton, TextField, Typography } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

type Props = {
  //   handleSuccess: (data: FormItem) => void;
  //   options: SelectOption[];
};

type FormDataType = { options: SelectOption[] };

const OptionItemsCreator = ({}: Props) => {
  const { control, handleSubmit, watch, register } = useFormContext<FormItem>();
  const { append, remove, update } = useFieldArray({
    control,
    name: "fieldProps.options",
  });
  function onSubmit({ options }: FormDataType) {}
  return (
    <div
      //   onSubmit={handleSubmit(onSubmit)}
      className="mt-2 border border-gray-500 bg-gray-200 rounded-md p-2"
    >
      <Typography variant="body2" sx={{ mb: 1, mt: 0.5 }}>
        گزینه ها
      </Typography>
      <div className="flex flex-col gap-2">
        {watch("fieldProps.options")?.map((_: SelectOption, index: number) => (
          <div key={index} className="flex gap-2">
            <IconButton color="error" onClick={() => remove(index)}>
              <RemoveCircleOutlineIcon />
            </IconButton>
            <TextField
              {...register(`fieldProps.options.${index}.title`)}
              label="عنوان"
              size="small"
            />
            <TextField
              {...register(`fieldProps.options.${index}.value`)}
              label="مقدار"
              size="small"
            />
          </div>
        ))}
      </div>
      <IconButton
        color="success"
        onClick={() => append({ value: "", title: "" })}
      >
        <AddCircle />
      </IconButton>
    </div>
  );
};

export default OptionItemsCreator;
