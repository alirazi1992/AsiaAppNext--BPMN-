"use client";
import { Douments } from "@/app/Application-AsiaApp/M_Automation/NewDocument/SubmitDocument";
import ButtonComponent from "@/app/components/shared/ButtonComponent";
import { GetDocumentDataModel } from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import { LoadingModel } from "@/app/Domain/shared";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import DateCard from "@/app/EndPoints-AsiaApp/Components/Shared/DateCard";
import { CloseIcon } from "@/app/EndPoints-AsiaApp/Components/Shared/IconComponent";
import useStore from "@/app/hooks/useStore";
import themeStore from "@/app/zustandData/theme.zustand";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_en from "react-date-object/locales/persian_en";
import { useForm } from "react-hook-form";
import { DateObject } from "react-multi-date-picker";
import * as yup from "yup";
import { useNewDocumentDataContext } from "../useNewDocumentDataContext";

const SubmitDocumentComponent = forwardRef((props: any, ref) => {
  const themeMode = useStore(themeStore, (state) => state);
  const [open, setOpen] = useState<boolean>(false);
  const { docheapId, state, setLoadings, loadings, setState, docTypeId } =
    useNewDocumentDataContext();
  const handleOpen = () => setOpen(!open);
  const { SubmitDocuments } = Douments();

  useImperativeHandle(ref, () => ({
    handleOpenSubmit: () => {
      handleOpen();
    },
  }));
  const schema = yup.object().shape({
    submitDate: yup.string().required(),
  });

  const { register, handleSubmit, reset, watch, trigger, setValue, formState } =
    useForm<{ submitDate: string }>({
      defaultValues: {
        submitDate: new DateObject(new Date())
          .convert(gregorian, gregorian_en)
          .format("HH:mm:ss YYYY/MM/DD"),
      },
      mode: "all",
      resolver: yupResolver(schema),
    });
  const errors = formState.errors;

  const [date, setDate] = useState<{
    format: string;
    gregorian?: string;
    persian?: string;
    date?: DateObject | null;
  }>({
    date: new DateObject(new Date()),
    format: "HH:mm:ss YYYY/MM/DD",
    persian: new DateObject(new Date().toISOString())
      .convert(persian, persian_en)
      .format(),
    gregorian: new DateObject(new Date().toISOString())
      .convert(gregorian, gregorian_en)
      .format(),
  });

  const convert = (date: DateObject) => {
    let object = { date, format: "HH:mm:ss YYYY/MM/DD" };
    setValue(
      "submitDate",
      new DateObject(object).convert(gregorian, gregorian_en).format()
    );
    trigger("submitDate");
    setDate({
      gregorian: new DateObject(object).format(),
      persian: new DateObject(object).convert(persian, persian_en).format(),

      ...object,
    });
  };

  const OnSubmit = async (data: { submitDate: string }) => {
    handleOpen();
    setLoadings((prev: LoadingModel) => ({ ...prev, response: true }));
    const res = await SubmitDocuments(docheapId ?? "", data.submitDate);
    if (res) {
      let submitNo = state?.documentData?.find((item: GetDocumentDataModel) =>
        docTypeId === "1"
          ? item.fieldName === "SubmitIndicatorNumber"
          : item.fieldName === "SubmitNo"
      );
      let submitDate = state?.documentData?.find(
        (item: GetDocumentDataModel) => item.fieldName === "SubmitDate"
      );
      let indexSubmitNo = state?.documentData?.indexOf(submitNo!);
      let indexSubmitDate = state?.documentData?.indexOf(submitDate!) ?? -1;

      submitNo
        ? state?.documentData?.splice(indexSubmitNo!, 1, {
            ...submitNo,
            fieldValue: res,
          })
        : state?.documentData?.push({
            fieldId: 0,
            fieldName: docTypeId === "1" ? "SubmitIndicatorNumber" : "SubmitNo",
            fieldValue: res,
            isUpdatable: false,
            recordId: 0,
          });

      submitDate
        ? state?.documentData?.splice(indexSubmitDate, 1, {
            ...submitDate,
            fieldValue: data.submitDate,
          })
        : state.documentData?.push({
            fieldId: 0,
            fieldName: "SubmitDate",
            fieldValue: data.submitDate,
            isUpdatable: false,
            recordId: 0,
          });
      reset();
      setLoadings((prev: LoadingModel) => ({ ...prev, response: false }));
    }
  };

  return (
    <MyCustomComponent>
      <>
        <Dialog
          dismiss={{
            escapeKey: true,
            referencePress: true,
            referencePressEvent: "click",
            outsidePress: false,
            outsidePressEvent: "click",
            ancestorScroll: false,
            bubbles: true,
          }}
          size="sm"
          className={`absolute top-0  ${
            !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
          }`}
          open={open}
          handler={handleOpen}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <DialogHeader
            dir="rtl"
            className={` flex justify-between sticky top-0 left-0 z-[10] ${
              !themeMode || themeMode?.stateMode
                ? "lightText cardDark"
                : "darkText cardLight"
            }`}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            ثبت صادره
            <CloseIcon onClick={() => handleOpen()} />
          </DialogHeader>
          <DialogBody
            className="w-full overflow-y-auto"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <form
              dir="rtl"
              onSubmit={handleSubmit(OnSubmit)}
              className="relative z-[10]"
            >
              <div className="p-1 relative">
                <DateCard
                  {...register(`submitDate`)}
                  valueTextField={
                    watch("submitDate")
                      ? watch("submitDate")
                      : new Date().toString()
                  }
                  valueDatePickare={date.date}
                  clearValue={() => {
                    if (watch("submitDate")) {
                      setValue("submitDate", "");
                      setDate((prev) => ({ ...prev, date: null }));
                    }
                  }}
                  labelTextField="تاریخ میلادی بعد از"
                  labelDatePickare="تاریخ شمسی بعد از"
                  error={errors?.submitDate && true}
                  convertDate={(date: DateObject) => convert(date)}
                  focused={watch("submitDate") ? true : false}
                />
                <label className="absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400">
                  {errors?.submitDate && errors?.submitDate?.message}
                </label>
              </div>
              <ButtonComponent type="submit">تائید</ButtonComponent>
            </form>
          </DialogBody>
        </Dialog>
      </>
    </MyCustomComponent>
  );
});

SubmitDocumentComponent.displayName = "SubmitDocumentComponent";
export default SubmitDocumentComponent;
