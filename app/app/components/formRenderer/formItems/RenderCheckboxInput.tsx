import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
} from "@mui/material";
import { useController, useFormContext } from "react-hook-form";
import { FormCheckboxInput } from "../formRenderer-types";

const RenderCheckboxInput = ({
  label,
  name,
  fieldProps,
  gridSize,
}: FormCheckboxInput) => {
  const sizes = gridSize ?? {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 4,
    xl: 3,
  };

  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error: rhfError },
  } = useController({
    name: name as string,
    control,
  });

  const error = rhfError?.message;
  const hasError = Boolean(error);

  return (
    <Grid item {...sizes}>
      <FormControlLabel
        control={
          <Checkbox
            checked={value}
            onChange={onChange}
            name={name}
            {...fieldProps.inputProps}
          />
        }
        label={label}
      />
      {hasError && <FormHelperText>{error}</FormHelperText>}
    </Grid>
  );
};

export default RenderCheckboxInput;
