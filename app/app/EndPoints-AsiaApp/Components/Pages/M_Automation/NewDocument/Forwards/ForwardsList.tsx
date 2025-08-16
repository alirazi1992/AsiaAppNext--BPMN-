"use client";
import { RemovingForwards } from "@/app/Application-AsiaApp/M_Automation/NewDocument/RemoveForwards";
import { ForwardTargetModel, GetForwardsListModel } from "@/app/Domain/M_Automation/NewDocument/Forwards";
import { LoadingModel } from "@/app/Domain/shared";
import { ActionButton, Icon, Td, Th } from "@/app/EndPoints-AsiaApp/Components/Shared/TableComponent";
import useStore from "@/app/hooks/useStore";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import {
  Button,
  CardBody,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import moment from "jalali-moment";
import React, { useContext, useRef } from "react";
import { DataContext } from "../NewDocument-MainContainer";
import { ForwardContext } from "./Forwards-MainContainer";

const ForwardsList: React.FC = () => {
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state);
  const { setLoadings, forwardsList } = useContext(DataContext);
  const { AttachmentsRef } = useContext(ForwardContext);
  const { RemoveForwradsFromList } = RemovingForwards();
  const DialogRef = useRef<{ handleOpen: () => void }>(null);

  const RemoveForwars = async (id: number) => {
    setLoadings((state: LoadingModel) => ({ ...state, response: true }));
    let index = forwardsList!.indexOf(forwardsList.find((item: GetForwardsListModel) => item.id == id)!);
    const res = await RemoveForwradsFromList(id).then((res) => {
      if (res) {
        setLoadings((state: LoadingModel) => ({ ...state, response: false }));
        if (typeof res == "object" && "sourceId" in res) {
          index != -1 && forwardsList?.splice(index, 1);
        }
      }
    });
  };

  return (
    <>
      <CardBody
        className={"h-full mx-auto relative rounded-lg p-0 overflow-auto "}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <table
          dir="rtl"
          className={`${
            !themeMode || themeMode?.stateMode ? "tableDark" : "tableLight"
          } h-full w-full relative text-center `}
        >
          <thead>
            <tr className={!themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"}>
              <Th value="#" />
              <Th value="تاریخ" />
              <Th value="فرستنده" />
              <Th value="گیرنده" />
              <Th value="عملیات" />
            </tr>
          </thead>
          <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"}`}>
            {forwardsList.length > 0 &&
              forwardsList.map((item: GetForwardsListModel, index: number) => {
                return (
                  <>
                    <tr
                      style={{ height: "40px" }}
                      key={index}
                      className={
                        (index % 2
                          ? !themeMode || themeMode?.stateMode
                            ? "breadDark"
                            : "breadLight"
                          : !themeMode || themeMode?.stateMode
                          ? "tableDark"
                          : "tableLight") + " border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75"
                      }
                    >
                      <Td value={Number(index + 1)} />
                      <Td
                        style={{ width: "15%" }}
                        value={
                          item.createDate !== ""
                            ? moment(item.createDate, "YYYY/MM/DD HH:mm:ss").format("jYYYY/jMM/jDD HH:mm:ss")
                            : ""
                        }
                      />
                      <Td value={item.senderFaName} />
                      <Td
                        value={
                          item.forwardTarget.length > 0
                            ? item.forwardTarget.map((option: ForwardTargetModel, num: number) => {
                                return num == item.forwardTarget.length - 1
                                  ? option.receiverFaName
                                  : option.receiverFaName + "  ,  ";
                              })
                            : "-"
                        }
                      />
                      <Td
                        style={{ width: "10%" }}
                        value={
                          <>
                            <div className="container-fluid mx-auto p-0.5">
                              <div className="flex flex-row justify-evenly">
                                {item.forwardAttachments && item.forwardAttachments.length != 0 && (
                                  <ActionButton
                                    onClick={() => {
                                      if (AttachmentsRef.current) {
                                        AttachmentsRef.current.SetAttachments(item.forwardAttachments),
                                          AttachmentsRef.current.handleOpenAttachment();
                                      }
                                    }}
                                  >
                                    <Icon Name={AttachFileIcon} />
                                  </ActionButton>
                                )}
                                <ActionButton onClick={() => RemoveForwars(item.id)}>
                                  <Icon Name={DeleteIcon} />
                                </ActionButton>
                                <Popover placement="bottom">
                                  <PopoverHandler>
                                    <Button
                                      size="sm"
                                      className="p-1 mx-1"
                                      style={{ background: color?.color }}
                                      placeholder={undefined}
                                      onPointerEnterCapture={undefined}
                                      onPointerLeaveCapture={undefined}
                                    >
                                      <Tooltip
                                        content="اطلاعات تکمیلی"
                                        className={
                                          !themeMode || themeMode?.stateMode
                                            ? "lightText cardDark"
                                            : "cardLight darkText"
                                        }
                                      >
                                        <Icon Name={InfoIcon} />
                                      </Tooltip>
                                    </Button>
                                  </PopoverHandler>
                                  <PopoverContent
                                    className={`${
                                      !themeMode || themeMode?.stateMode ? "lightText cardDark" : "cardLight darkText"
                                    } flex-col z-[9999] border-none py-[10px]`}
                                    dir="rtl"
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    <Typography
                                      className="w-full text-sm opacity-90 font-body"
                                      placeholder={undefined}
                                      onPointerEnterCapture={undefined}
                                      onPointerLeaveCapture={undefined}
                                    >
                                      توضیحات : {item.desc ?? "-"}
                                    </Typography>
                                  </PopoverContent>
                                </Popover>
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
    </>
  );
};

export default ForwardsList;
