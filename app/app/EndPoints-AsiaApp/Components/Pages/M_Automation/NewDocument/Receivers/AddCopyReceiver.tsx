"use client";
import { useList } from "@/app/Application-AsiaApp/M_Automation/NewDocument/fetchReceiversName";
import { useReceiveTypes } from "@/app/Application-AsiaApp/M_Automation/NewDocument/fetchReceiveTypes";
import { GetReceiversModel } from "@/app/Domain/M_Automation/NewDocument/Receivers";
import CustomAsyncSelect from "@/app/EndPoints-AsiaApp/Components/Shared/AsyncSelect";
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { ActionMeta, MultiValue } from "react-select";
import { ReceiversType } from "../NewDocument-MainContainer";
import { useNewDocumentDataContext } from "../useNewDocumentDataContext";
import { ReceiverType } from "./types/receiver";

const AddCopyReceiver = () => {
  const { fetchReceiveTypes } = useReceiveTypes();
  const [defaultReceiveType, setDefaultReceiveType] =
    useState<ReceiverType | null>(null);
  const { docTypeId, setReceivers, receivers } = useNewDocumentDataContext();
  const { fetchReceiversList } = useList();
  let recieversTimeOut: any;

  useEffect(() => {
    async function calculateDefaultReciver() {
      const receivers = await fetchReceiveTypes(docTypeId);
      if (receivers && Array.isArray(receivers)) {
        const temp = receivers.find((receiver) => receiver.isDefault);
        setDefaultReceiveType(temp!);
      }
    }
    calculateDefaultReciver();
  }, [docTypeId]);

  const loadCopyReceiverList = (
    searchKey: string,
    callback: (options: GetReceiversModel[] | undefined) => void
  ) => {
    clearTimeout(recieversTimeOut);
    recieversTimeOut = setTimeout(async () => {
      const result = await fetchReceiversList(
        searchKey,
        docTypeId == "1" ? 2 : 23
      )!;
      if (Array.isArray(result)) {
        callback(result);
      } else {
        callback(undefined); // Ensure callback is called with undefined if result is not an array
      }
    }, 1000);
  };
  if (!defaultReceiveType) {
    return <Skeleton height={30} width={200} />;
  }
  return (
    <CustomAsyncSelect
      className="z-[999999999999]"
      cacheOptions={true}
      defaultOptions={true}
      placeholder="گیرندگان رونوشت"
      loadOptions={loadCopyReceiverList}
      onChange={(
        option: MultiValue<GetReceiversModel>,
        actionMeta: ActionMeta<GetReceiversModel>
      ) => {
        setReceivers((prev: ReceiversType) => {
          const newReceivers = option
            .filter(
              (opt) =>
                !prev.copyReceivers.some((prevOpt) => prevOpt.Id === opt.value)
            )
            .map((item) => {
              return {
                ActionId: defaultReceiveType.id,
                ActionName: "جهت اقدام",
                Description: null,
                EnValue: item.EnValue,
                Id: item.Id,
                Level: item.Level,
                Value: item.Value,
              };
            });
          return {
            ...prev,
            copyReceivers: [...prev.copyReceivers, ...newReceivers],
          };
        });
      }}
    />
  );
};

export default AddCopyReceiver;
