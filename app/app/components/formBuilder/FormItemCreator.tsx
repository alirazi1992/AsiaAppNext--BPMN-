import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputTypes } from "../formRenderer/formRenderer-types";
import RenderFormItem from "../formRenderer/RenderFormItem";
import { FormItem } from "./formBuilder-types";
import useFormItemCreatorFields, {
  useFormItemCreatorGridSizesFields,
} from "./useFormItemCreatorFields";
import OptionItemsCreator from "./OptionItemsCreator";

type Props = {
  item?: FormItem;
  handleSuccess: (data: FormItem) => void;
};

const FormItemCreator = ({ item, handleSuccess }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const methods = useForm<FormItem>({
    defaultValues: item,
  });
  const items = useFormItemCreatorFields(!isEditMode);
  const gridSizeItems = useFormItemCreatorGridSizesFields(!isEditMode);
  const { handleSubmit, setValue, watch } = methods;

  function onSubmit(data: FormItem) {
    handleSuccess(data);
    setIsEditMode(false);
  }

  function resetValues() {
    setValue("name", item?.name ?? "");
    setValue("label", item?.label ?? "");
    setValue("inputType", item?.inputType ?? InputTypes.text);
    setValue("fieldProps", item?.inputType ?? {});
    setValue(
      "gridSize",
      item?.gridSize ?? {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 4,
        xl: 4,
      }
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-blue-800 rounded-md p-3"
      >
        <Grid container spacing={1}>
          {items?.map((item) => (
            <RenderFormItem key={item.name} {...item} />
          ))}
        </Grid>
        <div>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1, mt: 0.5 }}>
            اندازه در صفحات مختلف
          </Typography>
          <Grid container spacing={1}>
            {gridSizeItems?.map((item) => (
              <RenderFormItem key={item.name} {...item} />
            ))}
          </Grid>
        </div>
        {watch("inputType") === InputTypes.select && (
          <OptionItemsCreator
          // handleSuccess={(data) => {
          //   setValue("fieldProps", {
          //     options: data,
          //   });
          // }}
          // options={watch("fieldProps")?.options ?? []}
          />
        )}
        <div className="flex justify-center items-center gap-1">
          {isEditMode ? (
            <>
              <Button
                variant="outlined"
                color="warning"
                size="small"
                sx={{ mt: 1, maxWidth: 200 }}
                endIcon={<HighlightOffIcon />}
                onClick={() => {
                  setIsEditMode(false);
                  resetValues();
                }}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="small"
                sx={{ mt: 1, maxWidth: 200 }}
                endIcon={<CheckCircleIcon />}
              >
                ثبت
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="info"
              size="small"
              sx={{ mt: 1, maxWidth: 200 }}
              endIcon={<HighlightOffIcon />}
              onClick={() => {
                setIsEditMode(true);
              }}
            >
              ویرایش
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default FormItemCreator;
