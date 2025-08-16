import React from "react";
import { FormSelectInput } from "../formRenderer-types";
import StatusHandler from "../../statusHandler/StatusHandler";
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useController, useFormContext } from "react-hook-form";

const RenderSelectInput = ({
  label,
  name,
  fieldProps,
  gridSize,
}: FormSelectInput) => {
  const sizes = gridSize ?? {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 4,
    xl: 3,
  };

  const { control, setValue } = useFormContext();
  const {
    field: { value },
    fieldState: { error: rhfError },
  } = useController({
    name: name as string,
    control,
  });
  const { options = [], status = "resolved", refetch } = fieldProps || {};
  const error = rhfError?.message;
  const hasError = Boolean(error);
  return (
    <Grid item {...sizes}>
      <StatusHandler status={status} refetch={refetch}>
        <FormControl fullWidth error={hasError}>
          <InputLabel id={`renderSelectInput-${name}`}>{label}</InputLabel>
          <Select
            labelId={`renderSelectInput-${name}`}
            name={name}
            size="small"
            fullWidth
            {...fieldProps?.inputProps}
            value={value ?? ""}
            onChange={(event) => {
              setValue(name, event.target.value);
            }}
          >
            {options.map((option) => (
              <MenuItem key={String(option.value)} value={option.value}>
                {option.title}
              </MenuItem>
            ))}
          </Select>
          {hasError && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      </StatusHandler>
    </Grid>
  );
};

export default RenderSelectInput;
