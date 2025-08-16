import React, { useMemo } from "react";
import { FormFieldInput, InputTypes } from "../formRenderer/formRenderer-types";
import { FormItem } from "./formBuilder-types";

const useFormItemCreatorFields = (isDisabled: boolean) => {
  const items = useMemo(
    (): FormFieldInput<FormItem>[] => [
      {
        inputType: "select",
        name: "inputType",
        label: "نوع",
        gridSize: {
          xs: 12,
          sm: 6,
          md: 4,
          lg: 4,
          xl: 4,
        },
        fieldProps: {
          inputProps: {
            disabled: isDisabled,
          },
          options: Object.values(InputTypes).map((type) => ({
            title: type,
            value: type,
          })),
        },
      },
      {
        inputType: "text",
        name: "name",
        label: "نام",
        gridSize: {
          xs: 12,
          sm: 6,
          md: 4,
          lg: 4,
          xl: 4,
        },
        fieldProps: {
          inputProps: {
            disabled: isDisabled,
          },
        },
      },
      {
        inputType: "text",
        name: "label",
        label: "عنوان",
        gridSize: {
          xs: 12,
          sm: 6,
          md: 4,
          lg: 4,
          xl: 4,
        },
        fieldProps: {
          inputProps: {
            disabled: isDisabled,
          },
        },
      },
    ],
    [isDisabled]
  );
  return items;
};

export default useFormItemCreatorFields;

export const useFormItemCreatorGridSizesFields = (isDisabled: boolean) => {
  const items = useMemo(
    (): FormFieldInput<FormItem>[] => [
      //   grid sizes
      {
        inputType: "text",
        name: "gridSize.xs" as keyof FormItem,
        // label: "خیلی کوچک",
        label: "xs",
        gridSize: {
          xs: 12,
          sm: 6,
          md: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
        fieldProps: {
          inputProps: {
            disabled: isDisabled,
            //@ts-expect-error - this is a temporary fix to allow number input
            type: "number",
            inputMode: "numeric",
            min: 1,
            max: 12,
          },
        },
      },
      {
        inputType: "text",
        name: "gridSize.sm" as keyof FormItem,
        // label: "کوچک",
        label: "sm",
        gridSize: {
          xs: 12,
          sm: 6,
          md: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
        fieldProps: {
          inputProps: {
            disabled: isDisabled,
            //@ts-expect-error - this is a temporary fix to allow number input
            type: "number",
            inputMode: "numeric",
            min: 1,
            max: 12,
          },
        },
      },
      {
        inputType: "text",
        name: "gridSize.md" as keyof FormItem,
        // label: "متوسط",
        label: "md",
        gridSize: {
          xs: 12,
          sm: 6,
          md: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
        fieldProps: {
          inputProps: {
            disabled: isDisabled,
            //@ts-expect-error - this is a temporary fix to allow number input
            type: "number",
            inputMode: "numeric",
            min: 1,
            max: 12,
          },
        },
      },
      {
        inputType: "text",
        name: "gridSize.lg" as keyof FormItem,
        // label: "بزرگ",
        label: "lg",
        gridSize: {
          xs: 12,
          sm: 6,
          md: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
        fieldProps: {
          inputProps: {
            disabled: isDisabled,
            //@ts-expect-error - this is a temporary fix to allow number input
            type: "number",
            inputMode: "numeric",
            min: 1,
            max: 12,
          },
        },
      },
      {
        inputType: "text",
        name: "gridSize.xl" as keyof FormItem,
        // label: "خیلی بزرگ",
        label: "xl",
        gridSize: {
          xs: 12,
          sm: 6,
          md: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
        fieldProps: {
          inputProps: {
            disabled: isDisabled,
            //@ts-expect-error - this is a temporary fix to allow number input
            type: "number",
            inputMode: "numeric",
            min: 1,
            max: 12,
          },
        },
      },
    ],
    [isDisabled]
  );
  return items;
};
