"use client";
import React, { useState } from "react";
import { FormFieldInput } from "./formRenderer-types";
import RenderFormItem from "./RenderFormItem";
import { FormProvider, useForm } from "react-hook-form";
import { Grid, Tab, Tabs } from "@mui/material";
import AcsTabPanel from "./AcsTabPanel";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import { FormStructure } from "../formBuilder/formBuilder-types";

type Props = {
  formObject?: FormStructure;
};

const FormRenderer = ({ formObject }: Props) => {
  const methods = useForm();
  const formStructure = formObject ?? formSchema;
  const [activeTab, setActiveTab] = useState(1);
  function onSubmit(data: any) {
    console.log(data);
  }
  return (
    <div dir="rtl" className="p-2">
      <MyCustomComponent>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className={formStructure.containerClassName}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              aria-label="basic tabs example"
            >
              {formStructure.tabs.map((tab) => {
                return <Tab key={tab.name} label={tab.name} />;
              })}
            </Tabs>

            {formStructure.tabs.map((tab, index) => {
              return (
                <AcsTabPanel
                  key={"tabPanel-" + tab.name}
                  index={index}
                  value={activeTab}
                  className={tab.className}
                >
                  <Grid container spacing={1}>
                    {tab.items?.map((item) => (
                      <RenderFormItem key={item.name} {...item} />
                    ))}
                  </Grid>
                </AcsTabPanel>
              );
            })}

            <button type="submit">submit</button>
          </form>
        </FormProvider>
      </MyCustomComponent>
    </div>
  );
};

export default FormRenderer;

const formItems: FormFieldInput<Test>[] = [
  {
    inputType: "text",
    name: "name",
    label: "test",
    fieldProps: {
      inputProps: {
        disabled: false,
      },
    },
  },
  {
    inputType: "select",
    name: "family",
    label: "test",
    fieldProps: {
      inputProps: {
        disabled: false,
      },
      options: [
        {
          title: "none",
          value: 1,
        },
        {
          title: "none2",
          value: 2,
        },
        {
          title: "none3",
          value: 3,
        },
      ],
    },
  },
  {
    inputType: "checkbox",
    name: "checkbox",
    label: "حضوری",
    fieldProps: {
      inputProps: {},
    },
  },
];
const formItems2: FormFieldInput<Test>[] = [
  {
    inputType: "text",
    name: "name",
    label: "test",
    fieldProps: {
      inputProps: {
        disabled: false,
      },
    },
  },
  {
    inputType: "checkbox",
    name: "checkbox",
    label: "مشمول",
    fieldProps: {
      inputProps: {},
    },
  },
];

type Test = {
  name: string;
  age: string;
  family: string;
  checkbox: string[];
};

const formSchema: FormStructure = {
  tabs: [
    {
      items: formItems,
      name: "فرم اولیه",
      className: "bg-blue-100 p-2",
    },
    {
      items: formItems2,
      name: "فرم ثاونیه",
      className: "bg-green-50 p-2",
    },
  ],
  containerClassName: "p-10 bg-red-100 max-w-3xl mx-auto",
};
