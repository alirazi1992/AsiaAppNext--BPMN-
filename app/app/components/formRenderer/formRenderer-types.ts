import { CheckboxProps, SelectProps, TextFieldProps } from "@mui/material";

type DefaultFieldValue = Record<string, string>;

export const InputTypes = {
  text: "text",
  // autocomplete: "autocomplete",
  checkbox: "checkbox",
  select: "select",
  date: "date",
  custom: "custom",
} as const;

export type FormInputType = keyof typeof InputTypes;
export type MuiGridSizes = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

interface FormBaseInput<T = DefaultFieldValue> {
  label: string;
  name: keyof T;
  gridSize?: MuiGridSizes;
}

export interface FormTextFieldInput<T = DefaultFieldValue>
  extends FormBaseInput<T> {
  inputType: typeof InputTypes.text;
  fieldProps?: {
    inputProps?: TextFieldProps;
  };
}

export type SelectOption = {
  value: string | number;
  title: React.ReactNode;
};

type StatusType = "pending" | "resolved" | "reject";

export interface FormSelectInput<T = DefaultFieldValue>
  extends FormBaseInput<T> {
  inputType: typeof InputTypes.select;
  fieldProps: {
    inputProps?: SelectProps;
    options: SelectOption[];
    status?: StatusType;
    refetch?: () => void;
  };
}

export interface FormCheckboxInput<T = DefaultFieldValue>
  extends FormBaseInput<T> {
  inputType: typeof InputTypes.checkbox;
  fieldProps: {
    inputProps?: CheckboxProps;
  };
}

export interface IDate<T = DefaultFieldValue> extends FormBaseInput<T> {
  inputType: typeof InputTypes.date;
  fieldProps?: { value: string };
}
export interface ICustomInput<T = DefaultFieldValue> extends FormBaseInput<T> {
  inputType: typeof InputTypes.custom;
  fieldProps?: {
    value: string;
  };
  render: React.ReactElement;
}

export type FormFieldInput<T = DefaultFieldValue> =
  | FormTextFieldInput<T>
  | FormSelectInput<T>
  | IDate<T>
  | FormCheckboxInput<T>;
//   | ICustomInput<T>;

// type IRenderFormInput<T = FieldValue> = IRenderInput<T> & {
//   errors: FieldErrors<T>;
//   control: any;
//   // control: ControllerRenderProps<FieldValues, string>;
//   setValue?: UseFormSetValue<T>;
//   gridProps?: Grid2Props;
// };

// ====================================
