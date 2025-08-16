import React from "react";
import { FormFieldInput, InputTypes } from "./formRenderer-types";
import RenderTextInput from "./formItems/RenderTextInput";
import RenderSelectInput from "./formItems/RenderSelectInput";
import RenderCheckboxInput from "./formItems/RenderCheckboxInput";

const RenderFormItem = (props: FormFieldInput) => {
  switch (props.inputType) {
    case InputTypes.text:
      return <RenderTextInput {...props} />;
    case InputTypes.select:
      return <RenderSelectInput {...props} />;
    case InputTypes.checkbox:
      return <RenderCheckboxInput {...props} />;
    // case "date":
    //   return <CustomDatePicker {...props} />;
  }

  return <span>unsupported input type</span>;
};

export default RenderFormItem;
