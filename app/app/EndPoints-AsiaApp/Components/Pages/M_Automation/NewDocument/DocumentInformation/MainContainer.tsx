"use client";
import { useSignDocument } from "@/app/Application-AsiaApp/M_Automation/NewDocument/SigneDocument";
import ButtonComponent from "@/app/components/shared/ButtonComp";
import {
  GetDocumentDataModel,
  InitializeStateModel,
} from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import { LoadingModel } from "@/app/Domain/shared";
import useStore from "@/app/hooks/useStore";
import themeStore from "@/app/zustandData/theme.zustand";
import { Checkbox, Typography } from "@material-tailwind/react";
import { useNewDocumentDataContext } from "../useNewDocumentDataContext";
import InformationForm from "./InformationForm";
import SignersList from "./SignersList";

const MainContainer = () => {
  const { SignDoc } = useSignDocument();
  const {
    docTypeId,
    docheapId,
    forwardParentId,
    setLoadings,
    state,
    setState,
  } = useNewDocumentDataContext();
  const themeMode = useStore(themeStore, (state) => state);

  const SignDocument = async () => {
    setLoadings((state: LoadingModel) => ({ ...state, response: true }));
    const res = await SignDoc(
      docheapId!,
      docTypeId!,
      Number(forwardParentId)
    ).then((res) => {
      if (res) {
        setLoadings((state: LoadingModel) => ({ ...state, response: false }));
        if (typeof res == "object" && "signatureId" in res) {
          setState((prev: InitializeStateModel) => ({
            ...prev,
            signers: [
              ...(prev.signers.length > 0
                ? [
                    ...prev.signers,
                    {
                      Id: res!.signatureId,
                      SignDate: res!.signDate,
                      SignerName: res!.signer,
                    },
                  ]
                : [
                    {
                      Id: res!.signatureId,
                      SignDate: res!.signDate,
                      SignerName: res!.signer,
                    },
                  ]),
            ],
          }));
        }
      }
    });
  };

  return (
    <>
      <InformationForm />
      {docheapId != null && (
        <>
          {(docTypeId == "1" || docTypeId == "5") && (
            <ButtonComponent
              disabled={state.signers.length == 2 ? true : false}
              onClick={() => SignDocument()}
            >
              امضاء مدرک
            </ButtonComponent>
          )}
          {(docTypeId == "1" || docTypeId == "5") &&
            state.signers.length > 0 && <SignersList />}
          <section className="h-[80px] w-[99%] mx-auto flex justify-end items-center py-3">
            <Checkbox
              checked={
                state?.documentData
                  ?.find(
                    (item: GetDocumentDataModel) =>
                      item.fieldName == "IsRevoked"
                  )
                  ?.fieldValue!.toLowerCase() == "true"
              }
              crossOrigin=""
              name="type"
              color="blue-gray"
              className="p-0 transition-all hover:before:opacity-0"
              label={
                <Typography
                  className={`font-normal`}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  وضعیت ابطال
                </Typography>
              }
              labelProps={{
                className:
                  !themeMode || themeMode?.stateMode ? "lightText" : "darkText",
              }}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </section>
        </>
      )}
    </>
  );
};

export default MainContainer;
