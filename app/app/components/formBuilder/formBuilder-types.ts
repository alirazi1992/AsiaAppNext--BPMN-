import {
  FormInputType,
  MuiGridSizes,
} from "../formRenderer/formRenderer-types";

export type FormStructure = {
  tabs: FormTab[];
  containerClassName?: string;
};

export type FormTab = {
  id: string;
  name: string;
  icon?: string;
  items: FormItem[];
  className?: string;
};

export type FormItem = {
  name: string;
  label: string;
  gridSize?: MuiGridSizes;
  inputType: FormInputType;
  fieldProps?: any;
};
