import useServerCall from "@/app/hooks/useServerCall";
import { useMemo } from "react";
import useSWR from "swr";
import { FormFieldInput } from "../../formRenderer/formRenderer-types";
import { BpmsFormItems } from "../Bpms-types";

type Modules = {
  id: number;
  title: string;
};

const useBpmsFormItems = () => {
  const fetchData = useServerCall();
  const { data, error, isLoading } = useSWR<Modules[]>("/api/users", () =>
    fetchData({ method: "GET", entity: "Audit/report/GetModules" })
  );
  const items = useMemo(
    (): FormFieldInput<BpmsFormItems>[] => [
      {
        inputType: "text",
        name: "Title",
        label: "عنوان",
        gridSize: {
          xs: 12,
          sm: 12,
          md: 4,
          lg: 3,
          xl: 3,
        },
      },
      {
        inputType: "text",
        name: "FaTitle",
        label: "عنوان فارسی",
        gridSize: {
          xs: 12,
          sm: 12,
          md: 4,
          lg: 3,
          xl: 3,
        },
      },
      {
        inputType: "text",
        name: "IndexStart",
        label: "عدد شروع ایندکس",
        gridSize: {
          xs: 6,
          sm: 6,
          md: 3,
          lg: 2,
          xl: 2,
        },
      },
      {
        inputType: "checkbox",
        name: "Yearly",
        label: "ایندکس گذاری سالانه",
        fieldProps: {
          inputProps: {},
        },
        gridSize: {
          xs: 6,
          sm: 6,
          md: 3,
          lg: 2,
          xl: 2,
        },
      },

      {
        inputType: "checkbox",
        name: "Submitable",
        label: "امکان ثبت صادره",
        fieldProps: {
          inputProps: {},
        },
        gridSize: {
          xs: 12,
          sm: 12,
          md: 4,
          lg: 2,
          xl: 2,
        },
      },
      {
        inputType: "checkbox",
        name: "IsImportType",
        label: "امکان وارد کردن",
        fieldProps: {
          inputProps: {},
        },
        gridSize: {
          xs: 12,
          sm: 12,
          md: 4,
          lg: 3,
          xl: 3,
        },
      },
      {
        inputType: "select",
        name: "ModuleId",
        label: "ماژول",
        fieldProps: {
          inputProps: {},
          options: data
            ? data.map((option) => ({
                title: option.title,
                value: option.id,
              }))
            : [],
          status: isLoading
            ? "pending"
            : Boolean(error)
            ? "reject"
            : "resolved",
        },

        gridSize: {
          xs: 12,
          sm: 12,
          md: 4,
          lg: 3,
          xl: 3,
        },
      },
    ],
    [data, error, isLoading]
  );

  return items;
};

export default useBpmsFormItems;
