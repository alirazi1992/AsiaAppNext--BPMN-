"use client";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button, TextField } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import FormRenderer from "../formRenderer/FormRenderer";
import { InputTypes } from "../formRenderer/formRenderer-types";
import FormItemCreator from "./FormItemCreator";
import { FormStructure } from "./formBuilder-types";

type Props = {};

const AcsFormBuilder = (props: Props) => {
  const { control, watch } = useForm<FormStructure>({
    defaultValues: {
      tabs: [
        {
          name: "اولین صفحه",
          items: [],
          id: "1", //TODO: create a UUID
        },
      ],
    },
  });
  const { append, update } = useFieldArray({
    control,
    name: "tabs",
  });
  return (
    <div dir="rtl" className="w-full h-full">
      <MyCustomComponent>
        <div className="flex w-full h-full overflow-auto">
          <div className="w-1/4 overflow-auto p-2">
            <div className="flex flex-col gap-2 mb-3">
              {watch("tabs").map((tab, index) => (
                <div
                  key={tab.id}
                  className="flex flex-col gap-2 border border-blue-500 rounded-lg p-2 bg-blue-50"
                >
                  <TextField
                    label="عنوان صفحه"
                    value={tab.name}
                    onChange={(e) =>
                      update(index, { ...tab, name: e.target.value })
                    }
                    size="small"
                  />
                  <TextField
                    label="Taiwlind classes"
                    value={tab.className}
                    onChange={(e) =>
                      update(index, { ...tab, className: e.target.value })
                    }
                    size="small"
                  />
                  {tab.items?.map((tabItem, index) => (
                    <div key={tabItem.name + index}>
                      <FormItemCreator
                        item={tabItem}
                        handleSuccess={(data) => {
                          const tempItems = [...tab.items];
                          tempItems[index] = data;
                          update(index, {
                            ...tab,
                            items: tempItems,
                          });
                        }}
                      />
                    </div>
                  ))}
                  <div>
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={() => {
                        update(index, {
                          ...tab,
                          items: [
                            ...tab.items,
                            {
                              inputType: InputTypes.text,
                              label: "آیتم",
                              name: "text-field",
                              gridSize: {
                                lg: 12,
                                md: 12,
                                xs: 12,
                                xl: 12,
                                sm: 12,
                              },
                            },
                          ],
                        });
                      }}
                      endIcon={<AddCircleIcon />}
                    >
                      فیلد جدید
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              color="success"
              variant="outlined"
              onClick={() =>
                append({
                  name: "صفحه جدید",
                  items: [],
                  id: String(new Date().getTime()), //TODO: create a uuid
                })
              }
            >
              اضافه کردن صفحه
            </Button>
          </div>
          <div className="w-full p-2 bg-gray-300">
            <FormRenderer
              formObject={{
                tabs: watch("tabs"),
              }}
            />
          </div>
        </div>
      </MyCustomComponent>
    </div>
  );
};

export default AcsFormBuilder;
