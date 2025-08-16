import React from "react";
import { FormTextFieldInput } from "../formRenderer-types";
import { Grid, TextField } from "@mui/material";
import { useController, useFormContext } from "react-hook-form";

const RenderTextInput = ({
  name,
  label,
  fieldProps,
  gridSize,
}: FormTextFieldInput) => {
  const sizes = gridSize ?? {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 4,
    xl: 3,
  };
  const { control } = useFormContext();
  const {
    field: { value, onChange, ref },
    fieldState: { error: rhfError },
  } = useController({
    name: name as string,
    control,
  });
  const error = rhfError?.message;
  return (
    <Grid item {...sizes}>
      <TextField
        name={name}
        label={label}
        helperText={error}
        error={Boolean(error)}
        {...fieldProps?.inputProps}
        value={value ?? ""}
        onChange={onChange}
        inputRef={ref}
        size="small"
        fullWidth
      />
    </Grid>
  );
};

export default RenderTextInput;
