import React from "react";
import { FormFieldInput } from "../../formRenderer/formRenderer-types";
import { BpmsFormItems } from "../Bpms-types";
import { alpha, Box, Button, Container, Grid } from "@mui/material";
import RenderFormItem from "../../formRenderer/RenderFormItem";
import { FormProvider, useForm } from "react-hook-form";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import { Typography } from "@material-tailwind/react";
import BpmsNumberFormatting from "./BpmsNumberFormatting";
import useBpmsFormItems from "./useBpmsFormItems";

const BpmsForm = () => {
  const methods = useForm<BpmsFormItems>({
    defaultValues: {
      IsImportType: false,
      Yearly: false,
      FaTitle: "",
      Title: "",
      NumberingFmt: "",
      Submitable: false,
    },
  });
  const { handleSubmit } = methods;

  const items = useBpmsFormItems();

  function onSubmit(params: BpmsFormItems) {
    console.log(params);
  }
  return (
    <Box
      component="div"
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FormProvider {...methods}>
        <Container maxWidth="lg">
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            dir="rtl"
            sx={{
              py: 1.5,
              px: 1,
              background: (t) => alpha(t.palette.primary.main, 0.1),
              borderRadius: 1,
              border: (t) => `1px solid ${t.palette.primary.dark}`,
            }}
          >
            <MyCustomComponent>
              <Typography variant="h6" className="mb-3">
                ایجاد فرم
              </Typography>
              <Grid container spacing={1}>
                {items?.map((item) => (
                  <RenderFormItem key={item.name} {...item} />
                ))}
                <Grid item sm={12} md={8} lg={9} xl={9}>
                  <BpmsNumberFormatting />
                </Grid>
              </Grid>
              <Button type="submit">تایید</Button>
            </MyCustomComponent>
          </Box>
        </Container>
      </FormProvider>
    </Box>
  );
};

export default BpmsForm;
