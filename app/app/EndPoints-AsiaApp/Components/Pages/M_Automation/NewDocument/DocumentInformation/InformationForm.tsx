"use client";
import { useFields } from "@/app/Application-AsiaApp/M_Automation/NewDocument/fetchFieldRepository";
import { initialStateFielsRepo } from "@/app/Application-AsiaApp/Utils/M_Automation/NewDocument/data";
import {
  GetFieldRepositoryModel,
  InitialStateRepoModel,
} from "@/app/Domain/M_Automation/NewDocument/DocumentInformation";
import {
  GetDocumentDataModel,
  InitializeStateModel,
} from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import { LoadingModel } from "@/app/Domain/shared";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import DateCardNewDocument from "@/app/EndPoints-AsiaApp/Components/Shared/NewDocumentDate";
import SelectOption from "@/app/EndPoints-AsiaApp/Components/Shared/SelectOption";
import useStore from "@/app/hooks/useStore";
import themeStore from "@/app/zustandData/theme.zustand";
import { Card } from "@material-tailwind/react";
import { TextField } from "@mui/material";
import moment from "jalali-moment";
import { use, useEffect, useState } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_en from "react-date-object/locales/persian_en";
import { DateObject } from "react-multi-date-picker";
import { ActionMeta, SingleValue } from "react-select";
import { useNewDocumentDataContext } from "../useNewDocumentDataContext";

const InformationForm = () => {
  const { docTypeId, state, setState, setLoadings } =
    useNewDocumentDataContext();
  const themeMode = useStore(themeStore, (state) => state);
  const { fetchFieldRepository } = useFields();
  const [fieldRepo, setFieldRepo] = useState<InitialStateRepoModel>(
    initialStateFielsRepo
  );

  useEffect(() => {
    const fieldRepo = [12, 11, 8, 9];
    const loadInitialList = async () => {
      setLoadings((state: LoadingModel) => ({ ...state, response: true }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const promises = fieldRepo.map(async (id) => {
        const result = await fetchFieldRepository(id);
        if (result) {
          setLoadings((state: LoadingModel) => ({ ...state, response: false }));
          if (Array.isArray(result)) {
            if (id == 9) {
              setFieldRepo((prevState) => ({
                ...prevState,
                classification: result.map((item) => ({
                  Id: item.Id,
                  label: item.Value,
                  Value: item.Value,
                  value: item.Id,
                })),
              }));
            } else if (id == 8) {
              setFieldRepo((prevState) => ({
                ...prevState,
                priority: result.map((item) => ({
                  Id: item.Id,
                  label: item.Value,
                  Value: item.Value,
                  value: item.Id,
                })),
              }));
            } else if (id == 11) {
              setFieldRepo((prevState) => ({
                ...prevState,
                flowType: result.map((item) => ({
                  Id: item.Id,
                  label: item.Value,
                  Value: item.Value,
                  value: item.Id,
                })),
              }));
            } else {
              setFieldRepo((prevState) => ({
                ...prevState,
                hasAttachment: result.map((item) => ({
                  Id: item.Id,
                  label: item.Value,
                  Value: item.Value,
                  value: item.Id,
                })),
              }));
            }
          }
        }
      });
    };
    loadInitialList();
  }, []);

  const ConvertOptin = (fieldName: string, fieldValue: any) => {
    let optionSelect = state?.documentData?.find(
      (option: GetDocumentDataModel) => option.fieldName === fieldName
    )!;
    let index = state?.documentData?.indexOf(optionSelect) ?? 0;
    let data: GetDocumentDataModel[] = state?.documentData ?? [];
    let newOption: GetDocumentDataModel = {
      fieldId: optionSelect.fieldId,
      fieldName: optionSelect.fieldName,
      fieldValue:
        fieldName !== "SubmitDate"
          ? fieldValue
          : new DateObject(fieldValue)
              .convert(gregorian, gregorian_en)
              .format(),
      isUpdatable: optionSelect!.isUpdatable,
      recordId: optionSelect!.recordId,
    };
    data.splice(index, 1, newOption);
    setState((prev: InitializeStateModel) => ({
      ...prev,
      getDocumentData: data,
    }));
  };

  return (
    <MyCustomComponent>
      <Card
        shadow
        className={`${
          !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
        } w-[99%] mx-auto p-4 `}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <section
          dir="rtl"
          className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-y-1.5 "
        >
          <div className="p-1">
            <TextField
              autoComplete="off"
              size="small"
              dir="rtl"
              focused={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) => item.fieldName === "Indicator"
                )?.fieldValue !== null
                  ? true
                  : false
              }
              defaultValue={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) => item.fieldName === "Indicator"
                )?.fieldValue ?? ""
              }
              label="شماره مدرک"
              className={`${
                !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
              } no-caret`}
              sx={{ width: "100%", color: "#607d8b" }}
              InputLabelProps={{
                style: { color: "#607d8b" },
              }}
              InputProps={{
                style: {
                  color:
                    !themeMode || themeMode?.stateMode ? "white" : "#463b2f",
                  background: "#607d8b10",
                },
              }}
            />
          </div>
          <div className="p-1 grid grid-cols-1">
            <DateCardNewDocument
              disabled={true}
              valueTextField={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) =>
                    item.fieldName === "CreateDate"
                )?.fieldValue ?? ""
              }
              valueDatePickare={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) =>
                    item.fieldName === "CreateDate"
                )?.fieldValue
                  ? new DateObject(
                      state.documentData!.find(
                        (item: GetDocumentDataModel) =>
                          item.fieldName === "CreateDate"
                      )?.fieldValue!
                    )
                      .convert(persian, persian_en)
                      .format("YYYY/MM/DD HH:mm:ss")
                  : null
              }
              labelTextField="تاریخ ایجاد میلادی"
              labelDatePickare="تاریخ ایجاد شمسی"
              onfocus={(e: any) => e.target.blur()}
              focused={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) =>
                    item.fieldName === "CreateDate"
                )?.fieldValue
                  ? true
                  : false
              }
            />
          </div>
          <div className="p-1 md:col-span-2">
            <TextField
              autoComplete="off"
              size="small"
              dir="rtl"
              focused={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) => item.fieldName === "Subject"
                )?.fieldValue !== null
                  ? true
                  : false
              }
              onBlur={(e) => ConvertOptin("Subject", e.target.value)}
              defaultValue={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) => item.fieldName === "Subject"
                )?.fieldValue ?? ""
              }
              className={`${
                !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
              }`}
              label="موضوع"
              sx={{ width: "100%", color: "#607d8b" }}
              InputLabelProps={{
                style: { color: "#607d8b" },
              }}
              InputProps={{
                style: {
                  color:
                    !themeMode || themeMode?.stateMode ? "white" : "#463b2f",
                  background: "transparent",
                },
              }}
            />
          </div>
          <div className="p-1 ">
            <TextField
              autoComplete="off"
              size="small"
              dir="rtl"
              focused={
                state?.documentData?.find((item: GetDocumentDataModel) =>
                  docTypeId === "1" || docTypeId === "5"
                    ? item.fieldName === "SubmitIndicatorNumber"
                    : item.fieldName === "SubmitNo"
                )?.fieldValue !== null
                  ? true
                  : false
              }
              onChange={(e) =>
                docTypeId == "4" && ConvertOptin("SubmitNo", e.target.value)
              }
              value={
                state?.documentData?.find((item: GetDocumentDataModel) =>
                  docTypeId === "1" || docTypeId === "5"
                    ? item.fieldName === "SubmitIndicatorNumber"
                    : item.fieldName === "SubmitNo"
                )?.fieldValue ?? ""
              }
              className={`${
                !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
              }`}
              label="شماره صادره"
              sx={{ width: "100%", color: "#607d8b", textAlign: "right" }}
              InputLabelProps={{
                style: { color: "#607d8b" },
                sx: {
                  input: {
                    textAlign: "right",
                  },
                },
              }}
              InputProps={{
                style: {
                  color:
                    !themeMode || themeMode?.stateMode ? "white" : "#463b2f",
                  background: docTypeId == "1" ? "#607d8b10" : "transparent",
                  textAlign: "right",
                },
                sx: {
                  input: {
                    textAlign: "left",
                  },
                },
              }}
            />
          </div>
          <div className="p-1 grid grid-cols-1">
            <DateCardNewDocument
              disabled={docTypeId == "1" ? true : false}
              valueTextField={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) =>
                    item.fieldName === "SubmitDate"
                )?.fieldValue ?? ""
              }
              valueDatePickare={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) =>
                    item.fieldName === "SubmitDate"
                )?.fieldValue
                  ? moment(
                      state?.documentData?.find(
                        (item: GetDocumentDataModel) =>
                          item.fieldName === "SubmitDate"
                      )?.fieldValue
                    ).format("jYYYY/jMM/jDD HH:mm:ss")
                  : null
              }
              labelTextField="تاریخ صادره میلادی"
              labelDatePickare="تاریخ صادره شمسی"
              // onfocus={(e: any) => e.target.blur()}
              convertDate={(date: DateObject) =>
                ConvertOptin("SubmitDate", {
                  date: date,
                  format: "YYYY/MM/DD HH:mm:ss",
                })
              }
              focused={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) =>
                    item.fieldName === "SubmitDate"
                )?.fieldValue
                  ? true
                  : false
              }
            />
          </div>
          <div className="p-1 ">
            <TextField
              autoComplete="off"
              size="small"
              dir="rtl"
              focused={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) => item.fieldName === "Creator"
                )?.fieldValue !== null
                  ? true
                  : false
              }
              value={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) => item.fieldName === "Creator"
                )?.fieldValue ?? ""
              }
              className={`${
                !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
              }`}
              label="ایجاد کننده"
              sx={{ width: "100%", color: "#607d8b" }}
              InputLabelProps={{
                style: { color: "#607d8b" },
              }}
              InputProps={{
                style: {
                  color:
                    !themeMode || themeMode?.stateMode ? "white" : "#463b2f",
                  background: "#607d8b10",
                },
              }}
            />
          </div>
          <div className="p-1 grid grid-cols-1">
            <DateCardNewDocument
              disabled={true}
              valueTextField={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) => item.fieldName === "SignDate"
                )?.fieldValue ?? ""
              }
              valueDatePickare={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) => item.fieldName === "SignDate"
                )?.fieldValue
                  ? new DateObject(
                      state?.documentData?.find(
                        (item: GetDocumentDataModel) =>
                          item.fieldName === "SignDate"
                      )?.fieldValue!
                    )
                      .convert(persian, persian_en)
                      .format("YYYY/MM/DD HH:mm:ss")
                  : null
              }
              labelTextField="تاریخ امضاء میلادی"
              labelDatePickare="تاریخ امضاء شمسی"
              onfocus={(e: any) => e.target.blur()}
              focused={
                state?.documentData?.find(
                  (item: GetDocumentDataModel) => item.fieldName === "SignDate"
                )?.fieldValue
                  ? true
                  : false
              }
            />
          </div>
          <div className="p-1 md:col-span-2 md:grid md:grid-cols-2 lg:grid-cols-4 ">
            <div className="w-full grid grid-cols-4">
              <span
                className={`w-full h-full flex items-center justify-center text-sm ${
                  !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                }`}
              >
                محرمانگی
              </span>
              <div className="col-span-3">
                <SelectOption
                  isRtl={false}
                  placeholder={"محرمانگی"}
                  loading={fieldRepo.classification != undefined ? false : true}
                  value={
                    fieldRepo.classification == undefined
                      ? null
                      : fieldRepo.classification!.find(
                          (item: GetFieldRepositoryModel) =>
                            item.Id ==
                            Number(
                              (state?.documentData ?? []).find(
                                (item: GetDocumentDataModel) =>
                                  item.fieldName === "Classification"
                              )?.fieldValue
                            )
                        )
                      ? fieldRepo.classification!.find(
                          (item: GetFieldRepositoryModel) =>
                            String(item.Id) ==
                            state.documentData!.find(
                              (item: GetDocumentDataModel) =>
                                item.fieldName === "Classification"
                            )?.fieldValue
                        )
                      : null
                  }
                  onChange={(
                    option: SingleValue<GetFieldRepositoryModel>,
                    actionMeta: ActionMeta<GetFieldRepositoryModel>
                  ) => {
                    ConvertOptin("Classification", option!.Id.toString());
                  }}
                  menuPlacement={"top"}
                  maxHeight={150}
                  options={
                    fieldRepo.classification == undefined
                      ? [
                          {
                            Id: 0,
                            value: 0,
                            label: "no option found",
                            Value: "no option found",
                          },
                        ]
                      : fieldRepo.classification
                  }
                />
              </div>
            </div>
            {(docTypeId == "1" || docTypeId == "5") && (
              <div className="w-full grid grid-cols-4">
                <span
                  className={`w-full h-full flex items-center justify-center text-sm ${
                    !themeMode || themeMode?.stateMode
                      ? "lightText"
                      : "darkText"
                  }`}
                >
                  نوع مدرک
                </span>
                <div className="col-span-3">
                  <SelectOption
                    isRtl={false}
                    maxHeight={150}
                    menuPlacement={"top"}
                    placeholder={"نوع مدرک"}
                    loading={fieldRepo.flowType != undefined ? false : true}
                    value={
                      fieldRepo.flowType == undefined
                        ? null
                        : fieldRepo.flowType!.find(
                            (item: GetFieldRepositoryModel) =>
                              String(item.Id) ==
                              state?.documentData?.find(
                                (item: GetDocumentDataModel) =>
                                  item.fieldName === "FlowType"
                              )?.fieldValue
                          )
                        ? fieldRepo.flowType!.find(
                            (item: GetFieldRepositoryModel) =>
                              String(item.Id) ==
                              state.documentData!.find(
                                (item: GetDocumentDataModel) =>
                                  item.fieldName === "FlowType"
                              )?.fieldValue
                          )
                        : fieldRepo.flowType!.find(
                            (item: GetFieldRepositoryModel) => item.Id == 1
                          )
                    }
                    onChange={(
                      option: SingleValue<GetFieldRepositoryModel>,
                      actionMeta: ActionMeta<GetFieldRepositoryModel>
                    ) => {
                      ConvertOptin("FlowType", option!.Id.toString());
                    }}
                    options={
                      fieldRepo.flowType == undefined
                        ? [
                            {
                              Id: 0,
                              value: 0,
                              label: "no option found",
                              Value: "no option found",
                            },
                          ]
                        : fieldRepo.flowType
                    }
                  />
                </div>
              </div>
            )}
            <div className="w-full grid grid-cols-4">
              <span
                className={`w-full h-full flex items-center justify-center text-sm ${
                  !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                }`}
              >
                پیوست
              </span>
              <div className="col-span-3">
                <SelectOption
                  isRtl={false}
                  menuPlacement={"top"}
                  maxHeight={150}
                  placeholder={"پیوست"}
                  loading={fieldRepo.hasAttachment != undefined ? false : true}
                  value={
                    fieldRepo.hasAttachment == undefined
                      ? null
                      : fieldRepo.hasAttachment!.find(
                          (item: GetFieldRepositoryModel) =>
                            String(item.Id) ==
                            state?.documentData?.find(
                              (item: GetDocumentDataModel) =>
                                item.fieldName === "HasAttachments"
                            )?.fieldValue
                        )
                      ? fieldRepo.hasAttachment!.find(
                          (item: GetFieldRepositoryModel) =>
                            String(item.Id) ==
                            state.documentData!.find(
                              (item: GetDocumentDataModel) =>
                                item.fieldName === "HasAttachments"
                            )?.fieldValue
                        )
                      : null
                  }
                  onChange={(
                    option: SingleValue<GetFieldRepositoryModel>,
                    actionMeta: ActionMeta<GetFieldRepositoryModel>
                  ) => {
                    ConvertOptin("HasAttachments", option!.Id.toString());
                  }}
                  options={
                    fieldRepo.hasAttachment == undefined
                      ? [
                          {
                            Id: 0,
                            value: 0,
                            label: "no option found",
                            Value: "no option found",
                          },
                        ]
                      : fieldRepo.hasAttachment
                  }
                />
              </div>
            </div>
            <div className="w-full grid grid-cols-4">
              <span
                className={`w-full h-full flex items-center justify-center text-sm ${
                  !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                }`}
              >
                اولویت
              </span>
              <div className="col-span-3">
                <SelectOption
                  isRtl={false}
                  maxHeight={150}
                  menuPlacement={"top"}
                  placeholder={"اولویت"}
                  loading={fieldRepo.priority != undefined ? false : true}
                  value={
                    fieldRepo.priority == undefined
                      ? null
                      : fieldRepo.priority!.find(
                          (item: GetFieldRepositoryModel) =>
                            String(item.Id) ==
                            state?.documentData?.find(
                              (item: GetDocumentDataModel) =>
                                item.fieldName === "Priority"
                            )?.fieldValue
                        )
                      ? fieldRepo.priority!.find(
                          (item: GetFieldRepositoryModel) =>
                            String(item.Id) ==
                            state.documentData!.find(
                              (item: GetDocumentDataModel) =>
                                item.fieldName === "Priority"
                            )?.fieldValue
                        )
                      : null
                  }
                  onChange={(
                    option: SingleValue<GetFieldRepositoryModel>,
                    actionMeta: ActionMeta<GetFieldRepositoryModel>
                  ) => {
                    ConvertOptin("Priority", option!.Id.toString());
                  }}
                  options={
                    fieldRepo.priority == undefined
                      ? [
                          {
                            Id: 0,
                            value: 0,
                            label: "no option found",
                            Value: "no option found",
                          },
                        ]
                      : fieldRepo.priority
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </Card>
    </MyCustomComponent>
  );
};

export default InformationForm;
