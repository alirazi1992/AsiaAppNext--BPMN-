"use client";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import { CloseIcon } from "@/app/EndPoints-AsiaApp/Components/Shared/IconComponent";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import React, { createContext, forwardRef, useContext, useImperativeHandle, useState } from "react";
import themeStore from "@/app/zustandData/theme.zustand";
import useStore from "@/app/hooks/useStore";
import ReceiversMainContainer from "./ReceiversGroups/MainContainer";
import ButtonComponent from "@/app/components/shared/ButtonComponent";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddForwardReceiver } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import { DataContext } from "../../NewDocument-MainContainer";
import { LoadingModel } from "@/app/Domain/shared";
import { GetDocumentDataModel } from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import {
  useConfirmForwardDocument,
  useDocument,
} from "@/app/Application-AsiaApp/M_Automation/NewDocument/ForwardDocument";
import Loading from "@/app/components/shared/loadingGetData";
import { GetForwardsListModel } from "@/app/Domain/M_Automation/NewDocument/Forwards";

export const ForwrdDocumentContext = createContext<any>(null);
const ForwardMainContainer = forwardRef((props: any, ref) => {
  const themeMode = useStore(themeStore, (state) => state);
  const { AllData, forwardParentId, docheapId, setLoadings, loadings, forwardsList, setForwardsList, docTypeId } =
    useContext(DataContext);
  const [open, setOpen] = useState<boolean>(false);
  const [item, setItem] = useState<number>(1);
  const handleOpen = () => setOpen(!open);
  const schema = yup.object().shape({
    Forward: yup.object().shape({
      AddReceiver: yup
        .array(
          yup.object().shape({
            receiverActorId: yup.number().required(),
            title: yup.string().required(),
            receiveTypeId: yup.number().required(),
            personalDesc: yup.string().optional(),
            isHidden: yup.boolean().optional(),
          })
        )
        .required()
        .min(1, "حداقل یک گیرنده باید وجود داشته باشد"),
    }),
  });

  const { register, handleSubmit, setValue, reset, getValues, control, trigger, formState } =
    useForm<AddForwardReceiver>({
      defaultValues: {
        Forward: {
          AddReceiver: [],
          forwardDesc: "",
          files: [],
        },
      },
      mode: "all",
      resolver: yupResolver(schema),
    });
  const ReceiversState = useFieldArray({
    name: "Forward.AddReceiver",
    control,
  });

  const FileState = useFieldArray({
    name: "Forward.files",
    control,
  });
  const errors = formState.errors;
  useImperativeHandle(ref, () => ({
    handleOpenForward: () => {
      handleOpen();
    },
    getItem: (value: number) => {
      setItem(value);
    },
  }));
  const { Forward } = useDocument();
  const { ConfirmForward } = useConfirmForwardDocument();

  const OnSubmit = async (data: AddForwardReceiver) => {
    handleOpen();
    // if (!errors.Forward) {
    setLoadings((prev: LoadingModel) => ({ ...prev, response: true }));
    const res =
      item == 1
        ? await Forward(
            data,
            docheapId,
            AllData.find((item: GetDocumentDataModel) => item.fieldName === "Subject")!.fieldValue,
            forwardParentId,
            AllData.find((item: GetDocumentDataModel) => item.fieldName === "Indicator")!.fieldValue,
            docTypeId
          ).then((result) => {
            if (result) {
              reset();
              if (typeof result == "object" && "id" in result) {
                setForwardsList((prev: GetForwardsListModel[]) => [
                  ...prev,
                  {
                    id: result!.id,
                    createDate: result.createDate,
                    forwardAttachments: result.forwardAttachments,
                    desc: result.desc,
                    forwardTarget: result.forwardTarget,
                    fromActorId: result.fromActorId,
                    senderFaName: result.senderFaName,
                    senderName: result.senderName,
                    senderFaRoleName: result.senderFaRoleName,
                    senderRoleName: result.senderRoleName,
                  },
                ]);
              }
              setLoadings((prev: LoadingModel) => ({ ...prev, response: false }));
            }
          })
        : console.log();
    await ConfirmForward(
      data,
      docheapId,
      AllData.find((item: GetDocumentDataModel) => item.fieldName === "Subject")!.fieldValue,
      forwardParentId,
      AllData.find((item: GetDocumentDataModel) => item.fieldName === "Indicator")!.fieldValue,
      docTypeId
    ).then((result) => {
      if (result) {
        handleOpen();
        setLoadings((prev: LoadingModel) => ({ ...prev, response: false }));
        if (typeof result == "object" && "id" in result) {
          forwardsList.length > 0
            ? setForwardsList((prev: GetForwardsListModel[]) => [
                ...prev,
                {
                  id: result!.id,
                  createDate: result.createDate,
                  forwardAttachments: result.forwardAttachments,
                  desc: result.desc,
                  forwardTarget: result.forwardTarget,
                  fromActorId: result.fromActorId,
                  senderFaName: result.senderFaName,
                  senderName: result.senderName,
                  senderFaRoleName: result.senderFaRoleName,
                  senderRoleName: result.senderRoleName,
                },
              ])
            : setForwardsList([
                {
                  id: result!.id,
                  createDate: result.createDate,
                  forwardAttachments: result.forwardAttachments,
                  desc: result.desc,
                  forwardTarget: result.forwardTarget,
                  fromActorId: result.fromActorId,
                  senderFaName: result.senderFaName,
                  senderName: result.senderName,
                  senderFaRoleName: result.senderFaRoleName,
                  senderRoleName: result.senderRoleName,
                },
              ]);
        }
      }
    });
    // }
  };

  return (
    <MyCustomComponent>
      <>
        <ForwrdDocumentContext.Provider value={{ setValue, register, FileState, ReceiversState, trigger, getValues }}>
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
            size="xl"
            className={`absolute top-0 bottom-0 overflow-y-scroll  ${
              !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
            }`}
            open={open}
            handler={handleOpen}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {loadings.response == true && <Loading />}
            <form dir="rtl" onSubmit={handleSubmit(OnSubmit)} className="relative z-[10]">
              <DialogHeader
                dir="rtl"
                className={` flex justify-between sticky top-0 left-0 z-[85858585858] ${
                  !themeMode || themeMode?.stateMode ? "lightText cardDark" : "darkText cardLight"
                } `}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {item == 1 ? " ارجاع مدرک" : "تائید و ارجاع مدرک"}
                <CloseIcon onClick={() => handleOpen()} />
              </DialogHeader>
              <DialogBody
                className="w-full overflow-y-auto"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <ReceiversMainContainer />
              </DialogBody>
              <DialogFooter
                className={`flex flex-col sticky bottom-0 left-0 z-[8998989889889989] + ${
                  !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
                }`}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <label className="text-[10px] flex w-full absolute top-[100%] left-0 justify-start font-[FaBold] text-start text-red-400">
                  {errors?.Forward && errors?.Forward.AddReceiver?.message}
                </label>
                <ButtonComponent type="submit">تائید</ButtonComponent>
              </DialogFooter>
            </form>
          </Dialog>
        </ForwrdDocumentContext.Provider>
      </>
    </MyCustomComponent>
  );
});
ForwardMainContainer.displayName = "ForwardMainContainer";
export default ForwardMainContainer;
