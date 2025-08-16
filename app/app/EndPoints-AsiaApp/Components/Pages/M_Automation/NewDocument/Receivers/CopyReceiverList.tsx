"use client";
import { useReceiveTypes } from "@/app/Application-AsiaApp/M_Automation/NewDocument/fetchReceiveTypes";
import { GetRecieveTypesModel } from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import { GetMainReceiver } from "@/app/Domain/M_Automation/NewDocument/Receivers";
import SelectOption from "@/app/EndPoints-AsiaApp/Components/Shared/SelectOption";
import {
  ActionButton,
  Icon,
  Td,
  Th,
} from "@/app/EndPoints-AsiaApp/Components/Shared/TableComponent";
import useStore from "@/app/hooks/useStore";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import { CardBody } from "@material-tailwind/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { ActionMeta, SingleValue } from "react-select";
import { ReceiversType } from "../NewDocument-MainContainer";
import { useNewDocumentDataContext } from "../useNewDocumentDataContext";

const MainReceiverList = () => {
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state);
  const [receiveTypes, setReceiveTypes] = useState<GetRecieveTypesModel[]>([]);
  const { fetchReceiveTypes } = useReceiveTypes();
  const { docTypeId, receivers, setReceivers } = useNewDocumentDataContext();

  useEffect(() => {
    const loadInitialReceiveTypes = async () => {
      const result = await fetchReceiveTypes(docTypeId);
      if (result) {
        if (Array.isArray(result) && result.length > 0) {
          setReceiveTypes(result);
        }
      }
    };
    loadInitialReceiveTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docTypeId]);

  const DeleteReceiverItem = (receiver: any) => {
    setReceivers((prev: ReceiversType) => ({
      ...prev,
      copyReceivers: [
        ...prev.copyReceivers.filter((item) => item.Id !== receiver.Id),
      ],
    }));
  };

  const ConvertReceiveType = (
    item: GetRecieveTypesModel,
    option: GetMainReceiver
  ) => {
    let index = receivers.copyReceivers?.indexOf(option);
    if (index !== -1) {
      let newOption: GetMainReceiver = {
        ...option,
        ActionId: item!.id,
        ActionName: item.faTitle,
      };
      const updatedReceivers = [...receivers.copyReceivers];
      updatedReceivers[index] = newOption;
      setReceivers((prev: ReceiversType) => ({
        ...prev,
        copyReceivers: updatedReceivers,
      }));
    }
  };
  const ConvertReceiversDesc = (desc: string, option: GetMainReceiver) => {
    let index = receivers.copyReceivers?.indexOf(option);
    if (index !== -1) {
      let newOption: GetMainReceiver = {
        ...option,
        Description: desc,
      };
      const updatedReceivers = [...receivers.copyReceivers];
      updatedReceivers[index] = newOption;
      setReceivers((prev: ReceiversType) => ({
        ...prev,
        copyReceivers: updatedReceivers,
      }));
    }
  };
  return (
    <CardBody
      className={
        "h-[50vh] m-0 p-0 md:my-3  mx-auto relative rounded-lg overflow-y-scroll "
      }
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <table
        dir="rtl"
        className={`w-full relative text-center max-h-[55vh] ${
          !themeMode || themeMode?.stateMode ? "tableDark" : "tableLight"
        }`}
      >
        <thead className=" border-b-2 z-[999] top-0 left-0 w-full">
          <tr
            className={
              !themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"
            }
          >
            <Th value="#" />
            <Th value="عنوان" />
            <Th value="جهت" />
            <Th value="توضیحات" />
            <Th value="عملیات" />
          </tr>
        </thead>
        <tbody
          className={`divide-y divide-${
            !themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"
          }`}
        >
          {receivers.copyReceivers.map((option: any, index: number) => {
            return (
              <>
                <tr
                  style={{ height: "40px" }}
                  key={index}
                  className={`${
                    index % 2
                      ? !themeMode || themeMode?.stateMode
                        ? "breadDark"
                        : "breadLight"
                      : !themeMode || themeMode?.stateMode
                      ? "tableDark"
                      : "tableLight"
                  } border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}
                >
                  <Td style={{ width: "3%" }} value={Number(index + 1)} />
                  <Td value={option.Value} />
                  <Td
                    style={{ minWidth: "200px", width: "25%" }}
                    value={
                      <>
                        <SelectOption
                          isRtl
                          placeholder={"جهت"}
                          loading={receiveTypes != undefined ? false : true}
                          className={`z-[${(index + 1) * 11}]`}
                          maxMenuHeight={300}
                          value={
                            receiveTypes == undefined
                              ? null
                              : receiveTypes!.find(
                                  (item: GetRecieveTypesModel) =>
                                    item.value == option.ActionId
                                )
                              ? receiveTypes!.find(
                                  (item: GetRecieveTypesModel) =>
                                    item.value == option.ActionId
                                )
                              : receiveTypes!.find(
                                  (item: GetRecieveTypesModel) =>
                                    item.value == 5
                                )
                          }
                          onChange={(
                            item: SingleValue<GetRecieveTypesModel>,
                            actionMeta: ActionMeta<GetRecieveTypesModel>
                          ) => {
                            ConvertReceiveType(item!, option);
                          }}
                          options={
                            receiveTypes == undefined
                              ? [
                                  {
                                    id: 0,
                                    value: 0,
                                    label: "no option found",
                                    faName: "no option found",
                                    name: "no option found",
                                  },
                                ]
                              : receiveTypes
                          }
                        />
                      </>
                    }
                  />
                  <Td
                    style={{ minWidth: "200px", width: "25%" }}
                    value={
                      <>
                        <input
                          type="text"
                          autoComplete="off"
                          defaultValue={option.Description}
                          onChange={(event) => {
                            ConvertReceiversDesc(event.target.value, option);
                          }}
                          className={`${
                            !themeMode || themeMode?.stateMode
                              ? "lightText"
                              : "darkText"
                          } border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-sm rinng-0 outline-none shadow-none bg-inherit focused`}
                        />
                      </>
                    }
                  />
                  <Td
                    style={{ width: "4%" }}
                    value={
                      <>
                        <div className="container-fluid mx-auto p-0.5">
                          <div className="flex flex-row justify-evenly">
                            <ActionButton
                              onClick={() => DeleteReceiverItem(option)}
                            >
                              <Icon Name={DeleteIcon} />
                            </ActionButton>
                          </div>
                        </div>
                      </>
                    }
                  />
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </CardBody>
  );
};

export default MainReceiverList;
