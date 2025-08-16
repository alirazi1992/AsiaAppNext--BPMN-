"use client";
import AsyncTextSearch from "@/app/components/shared/AsyncTextSearch";
import ButtonComp from "@/app/components/shared/ButtonComp";
import TableSkeleton from "@/app/components/shared/TableSkeleton";
import TitleComponent from "@/app/components/shared/TitleComponent";
import TypographySkeleton from "@/app/components/shared/TypographySkeleton";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import useStore from "@/app/hooks/useStore";
import { ViewDocumentListTableModel } from "@/app/models/Archive/ViewDocumentListTable";
import serverCall from "@/app/Utils/serverCall";
import { colorStore } from "@/app/zustandData";
import ArchiveJobFilterStore from "@/app/zustandData/ArchiveJobFilter.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useSWR, { mutate } from "swr";
import { ArchiveDocumentInfoProvider } from "./ArchiveDocumentInfoContext";
import TransferAllListDialog from "./TransferAllListDialog";
import { createKeyForSwrRequest } from "./utilityFunctions";
import ViewDocumentForm from "./ViewDocumentForm";
import ArchiveTable from "./ViewDocumentTable";

const ViewArchiveComponent = () => {
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const State = ArchiveJobFilterStore((state) => state);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTransferAllDialog, setShowTransferAllDialog] = useState(false);
  const requestKey = createKeyForSwrRequest(State.JobId, State.WorkOrderId);

  const { isLoading } = useSWR(requestKey, null);

  useEffect(() => {
    ArchiveJobFilterStore.setState((state) => ({
      ...state,
      ViewDocumentList: [],
    }));
  }, []);

  const ViewDocumentListTable = async () => {
    const entity = requestKey; // request key is the same as entity => `archive/Manage/list?JobId=${jobId}&WorkOrderId=${workOrderId}`
    if (State.JobId >= 0) {
      const response = await mutate(
        requestKey,
        serverCall<ViewDocumentListTableModel[]>(entity, {
          method: "GET",
          withCredentials: true,
        }),
        true
      );
      if (response) {
        if (Array.isArray(response?.data) && response.data.length > 0) {
          ArchiveJobFilterStore.setState((state) => ({
            ...state,
            ViewDocumentList: response.data.map((item: ViewDocumentListTableModel, index: number) => {
              return {
                id: item.id,
                title: item.title,
                name: item.name,
                isFile: item.isFile,
                attacher: item.attacher,
                archiveCategoryId: item.archiveCategoryId,
                createDate: item.createDate,
                type: item.type,
                docHeapId: item.docHeapId,
                workOrderId: item.workOrderId,
                jobId: item.jobId,
                attachmentTypeId: item.attachmentTypeId,
                extraInfo: item.extraInfo,
              };
            }),
          }));
        } else {
          Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "جستجو آرشیو",
            text: "مدرکی آرشیو نشده است",
            icon: "warning",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "OK!",
          });
        }
      }
    } else {
      Swal.fire({
        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
        allowOutsideClick: false,
        title: "جستجو آرشیو",
        text: "لطفا فیلد های مربوطه را پر کنید",
        icon: "warning",
        confirmButtonColor: "#22c55e",
        confirmButtonText: "OK!",
      });
    }
  };
  return (
    <ArchiveDocumentInfoProvider>
      <>
        {showTransferAllDialog && (
          <TransferAllListDialog open={showTransferAllDialog} handleOpen={() => setShowTransferAllDialog(false)} />
        )}
        <TitleComponent>جستجوی مدارک</TitleComponent>
        <ViewDocumentForm />
        <ButtonComp
          onClick={() => {
            ViewDocumentListTable();
          }}
        >
          جستجو
        </ButtonComp>
        {State.ViewDocumentList?.length > 0 &&
          (isLoading ? (
            <section className="w-[95%] md:w-[90%] mx-auto">
              <TypographySkeleton />
              <TableSkeleton />
            </section>
          ) : (
            <>
              <div className="flex flex-col-reverse justify-center  md:flex-row  flex-wrap md:justify-between w-[97%] m-auto">
                <div className="w-[100%] md:w-[200px] py-4 px-2 text-right">
                  <AsyncTextSearch value={searchTerm} onChange={(option) => setSearchTerm(option)} />
                </div>
                <div className=" w-[100%] md:w-[200px] flex items-center gap-2">
                  <div className="w-20 h-20 flex items-center">
                    <MyCustomComponent>
                      <Tooltip title="انتقال همه">
                        <IconButton
                          onClick={() => setShowTransferAllDialog(true)}
                          sx={{
                            color: color?.color,
                            border: `1px solid ${color?.color}`,
                          }}
                        >
                          <SyncAltIcon />
                        </IconButton>
                      </Tooltip>
                    </MyCustomComponent>
                  </div>
                  <TitleComponent>آرشیو های مرتبط</TitleComponent>
                </div>
              </div>

              <ArchiveTable searchTerm={searchTerm} />
            </>
          ))}
      </>
    </ArchiveDocumentInfoProvider>
  );
};

export default ViewArchiveComponent;
