"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import colorStore from "@/app/zustandData/color.zustand";
import useStore from "@/app/hooks/useStore";
import SaveIcon from "@mui/icons-material/Save";
import CustomButton from "../../../Shared/CustomButton";
import { GetToolbarResultModel } from "@/app/Domain/M_Automation/NewDocument/DocumentInformation";
import { useToolbars } from "@/app/Application-AsiaApp/M_Automation/NewDocument/fetchToolbars";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ReplyIcon from "@mui/icons-material/Reply";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RedoIcon from "@mui/icons-material/Redo";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import InventoryIcon from "@mui/icons-material/Inventory";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DataContext } from "./NewDocument-MainContainer";
import PrintDocument from "./Toolbars/PrintDocument";
import SaveDraft from "./Toolbars/SaveDraft";
import SubmitDocument from "./Toolbars/SubmitDocument";
import RevokeDocument from "./Toolbars/RevokeDocument";
import ReplyDocument from "./Toolbars/ReplyDocument";
import ForwardDocument from "./Toolbars/ForwardDocument/Forward-MainContainer";
import ExistDocuments from "./Toolbars/DuplicateSubmitNo/mainContainer";
import ForwardHierarchy from "@/app/EndPoints-AsiaApp/Components/Pages/M_Automation/NewDocument/Toolbars/ForwardHierarchy/MainContainer";
import { UpdateDocs } from "@/app/Application-AsiaApp/M_Automation/NewDocument/UpdateDocument";
import {
  GetDocumentDataModel,
  InitializeStateModel,
  PassageModel,
} from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import { GetCSharpDateType } from "@/app/Application-AsiaApp/M_Automation/NewDocument/GetCSharpDateType";
import { LoadingModel } from "@/app/Domain/shared";
import { SaveDocs } from "@/app/Application-AsiaApp/M_Automation/NewDocument/SaveLetterDocument";
import { useRouter } from "next/navigation";
import ArchiveHierarchy from "./Toolbars/ArchiveHierarchy";
import Swal from "sweetalert2";
import themeStore from "@/app/zustandData/theme.zustand";
import { useExist } from "@/app/Application-AsiaApp/M_Automation/NewDocument/fetchIssameImportExist";
import { ExistDocListModel } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import { useNewDocumentDataContext } from "./useNewDocumentDataContext";

export const ToolbarContext = createContext<any>(null);
const NewDocumentToolbar = () => {
  const router = useRouter();
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state);
  const { fetchToolbars } = useToolbars();
  const {
    forwardParentId,
    docheapId,
    docTypeId,
    state,
    receivers,
    setState,
    setLoadings,
    templateId,
    setDocHeapId,
  } = useNewDocumentDataContext();
  const [toolbars, setToolbars] = useState<GetToolbarResultModel | null>(null);
  const PrintRef = useRef<{ handleOpenPrint: () => void }>(null);
  const DarftRef = useRef<{ handleOpen: () => void }>(null);
  const SubmitRef = useRef<{ handleOpenSubmit: () => void }>(null);
  const RevokeRef = useRef<{ handleOpenRevoke: () => void }>(null);
  // const [docs, setDocs] = useState<ExistDocListModel[]>([])
  const ForwardRef = useRef<{
    handleOpenForward: () => void;
    getItem: (value: number) => void;
  }>(null);
  const HierarchyRef = useRef<{ handleOpen: () => void }>(null);
  const ConfirmForwardRef = useRef<{ handleOpenConfirmForward: () => void }>(
    null
  );
  const ArchiveRef = useRef<{ handleOpenArchives: () => void }>(null);
  const ExistRef = useRef<{
    handleOpenExist: () => void;
    setItems: (items: ExistDocListModel[]) => void;
  }>(null);
  const ReplyRef = useRef<{
    handleOpenReply: () => void;
    setItems: (title: string, stateId: number) => void;
  }>(null);
  const { UpdateDocuments } = UpdateDocs();
  const { SaveDocuments } = SaveDocs();
  const { fetchIssameImportExist } = useExist();

  useEffect(() => {
    const loadInitialToolbar = async () => {
      const res = await fetchToolbars(docTypeId!).then((res) => {
        if (res) {
          if (typeof res == "object") {
            setToolbars(res);
          } else {
            setToolbars(null);
          }
        }
      });
    };
    loadInitialToolbar();
  }, [docTypeId]);

  const Update = async () => {
    setLoadings((prev: LoadingModel) => ({ ...prev, response: true }));
    if (!state.docTypes!.isImportType) {
      state.documentData
        ?.filter((item: GetDocumentDataModel) => item.fieldName == "Passage")
        ?.map((option: GetDocumentDataModel) => {
          let passage: PassageModel = JSON.parse(option.fieldValue);
          passage.SaveDate = GetCSharpDateType(new Date());
          option.fieldValue = JSON.stringify(passage);
          let index = state.documentData?.indexOf(option) || 0;
          let data = state.documentData;
          state!.documentData![index] = option;
          setState((prev: InitializeStateModel) => ({
            ...prev,
            documentData: data,
          }));
        });
    }
    const indicator =
      state?.documentData?.find(
        (item: GetDocumentDataModel) => item.fieldName === "Indicator"
      )?.fieldValue || "";
    const res = await UpdateDocuments(
      receivers,
      state?.documentData?.filter(
        (item: GetDocumentDataModel) => item.isUpdatable
      )!,
      docheapId!,
      docTypeId!,
      indicator
    );
    if (indicator) {
      setLoadings((prev: LoadingModel) => ({ ...prev, response: false }));
    }
  };

  const SaveLetterDoc = async () => {
    setLoadings((prev: LoadingModel) => ({ ...prev, response: true }));
    state?.documentData
      ?.filter((item: GetDocumentDataModel) => item.fieldName == "Passage")
      ?.map((option: GetDocumentDataModel) => {
        let passage: PassageModel = JSON.parse(option.fieldValue);
        passage.SaveDate = GetCSharpDateType(new Date());
        option.fieldValue = JSON.stringify(passage);
        let index = state?.documentData?.indexOf(option);
        state?.documentData?.splice(index!, 1);
        state?.documentData?.push(option);
      });
    const res = await SaveDocuments(
      receivers,
      state?.documentData?.filter(
        (item: GetDocumentDataModel) => item.isUpdatable
      ) ?? [],
      docTypeId ?? "",
      templateId ?? ""
    );
    if (res) {
      setLoadings((prev: LoadingModel) => ({ ...prev, response: false }));
      if (typeof res == "number") {
        setDocHeapId(String(res));
        router.push(
          `/Home/NewDocument?doctypeid=${docTypeId}&docheapid=${res}`,
          { scroll: false }
        );
      }
    }
  };

  const SaveImportType = async () => {
    let subject = state?.documentData?.find(
      (item: GetDocumentDataModel) => item.fieldName == "Subject"
    )?.fieldValue;
    let submitNo = state?.documentData?.find(
      (item: GetDocumentDataModel) => item.fieldName == "SubmitNo"
    )?.fieldValue;
    let submitDate = state?.documentData?.find(
      (item: GetDocumentDataModel) => item.fieldName == "SubmitDate"
    )?.fieldValue;
    if (
      submitNo == null ||
      submitNo == "" ||
      subject == null ||
      subject == "" ||
      submitDate == "" ||
      submitDate == null
    ) {
      Swal.fire({
        background:
          !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
        allowOutsideClick: false,
        title: "ذخیره مدرک",
        text: `${
          subject == null || subject == ""
            ? "موضوع نامه نمیتواند خالی باشد"
            : submitNo == null || submitNo == ""
            ? "شماره صادره نامه وارده نمیتواند خالی باشد"
            : (submitDate == null || submitDate == "") &&
              "تاریخ صادره نامه وارده نمیتواند خالی باشد"
        }`,
        icon: "warning",
        confirmButtonColor: "#22c55e",
        confirmButtonText: "OK!",
      });
    } else {
      setLoadings((prev: LoadingModel) => ({ ...prev, response: true }));
      const res = await fetchIssameImportExist(
        state?.documentData?.find(
          (item: GetDocumentDataModel) => item.fieldName == "SubmitNo"
        )?.fieldValue ?? ""
      );
      if (res) {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: false }));
        if (typeof res == "object" && "isExists" in res) {
          res.isExists == true
            ? ExistRef.current
              ? (ExistRef.current.handleOpenExist(),
                ExistRef.current.setItems(res.docsList))
              : undefined
            : SaveImportDocument();
        }
      }
    }
  };

  const SaveImportDocument = async () => {
    setLoadings((prev: LoadingModel) => ({ ...prev, response: true }));
    let optionSelect = state?.documentData?.find(
      (option: GetDocumentDataModel) => option.fieldName === "SubmitDate"
    )!;
    let index = state?.documentData?.indexOf(optionSelect);
    let data: GetDocumentDataModel[] = state.documentData ?? [];
    let newOption: GetDocumentDataModel = {
      fieldId: optionSelect.fieldId,
      fieldName: optionSelect.fieldName,
      fieldValue:
        state?.documentData?.find(
          (item: GetDocumentDataModel) => item.fieldName == "SubmitDate"
        )?.fieldValue ?? "",
      isUpdatable: optionSelect!.isUpdatable,
      recordId: optionSelect!.recordId,
    };
    data.splice(index!, 1);
    data.push(newOption);
    setState((state: InitializeStateModel) => ({
      ...state,
      documentData: [...data],
    }));

    const res = await SaveDocuments(
      receivers,
      state?.documentData?.filter(
        (item: GetDocumentDataModel) => item.isUpdatable
      ) ?? [],
      docTypeId!,
      templateId!
    );
    if (res) {
      setLoadings((prev: LoadingModel) => ({ ...prev, response: false }));
      if (typeof res == "number") {
        setDocHeapId(String(res));
        router.push(`/Home/NewDocument?doctypeid=4&docheapid=${res}`, {
          scroll: false,
        });
      }
    }
  };

  return (
    <ToolbarContext.Provider
      value={{ ForwardRef, ConfirmForwardRef, SaveImportDocument }}
    >
      <section
        dir="rtl"
        className="w-[100%] overflow-x-scroll whitespace-nowrap flex flex-row justify-start"
      >
        <CustomButton
          tooltipContent="ذخیره"
          onClick={() =>
            docheapId
              ? Update()
              : docTypeId == "4"
              ? SaveImportType()
              : SaveLetterDoc()
          }
          backgroundColor={color?.color}
          IconComponent={SaveIcon}
        />
        {toolbars !== null && toolbars!.forwardTree && docheapId && (
          <CustomButton
            tooltipContent="درخت ارجاعات"
            onClick={() => {
              if (HierarchyRef.current) {
                HierarchyRef.current.handleOpen();
              }
            }}
            backgroundColor={color?.color}
            IconComponent={AccountTreeIcon}
          />
        )}
        {toolbars !== null && toolbars!.forward && docheapId && (
          <CustomButton
            tooltipContent="ارجاع"
            onClick={() => {
              if (ForwardRef.current) {
                ForwardRef.current?.handleOpenForward(),
                  ForwardRef.current?.getItem(1);
              }
            }}
            backgroundColor={color?.color}
            IconComponent={ReplyIcon}
          />
        )}
        {toolbars !== null &&
          toolbars!.confirmForward &&
          docheapId &&
          forwardParentId && (
            <CustomButton
              tooltipContent="تائید و ارجاع"
              onClick={() => {
                if (ForwardRef.current) {
                  ForwardRef.current?.handleOpenForward(),
                    ForwardRef.current?.getItem(2);
                }
              }}
              backgroundColor={color?.color}
              IconComponent={ReplyAllIcon}
            />
          )}
        {toolbars !== null &&
          toolbars!.confirm &&
          docheapId &&
          forwardParentId && (
            <CustomButton
              tooltipContent="تائید مدرک"
              onClick={() => {
                if (ReplyRef.current) {
                  ReplyRef.current.handleOpenReply(),
                    ReplyRef.current.setItems("تائید مدرک", 4);
                }
              }}
              backgroundColor={color?.color}
              IconComponent={CheckCircleIcon}
            />
          )}
        {toolbars !== null &&
          toolbars!.deny &&
          docheapId &&
          forwardParentId && (
            <CustomButton
              tooltipContent="رد مدرک"
              onClick={() => {
                if (ReplyRef.current) {
                  ReplyRef.current.handleOpenReply(),
                    ReplyRef.current.setItems("رد مدرک", 6);
                }
              }}
              backgroundColor={color?.color}
              IconComponent={CancelIcon}
            />
          )}
        {toolbars !== null &&
          toolbars!.return &&
          docheapId &&
          forwardParentId && (
            <CustomButton
              tooltipContent="بازگشت به فرستنده"
              onClick={() => {
                if (ReplyRef.current) {
                  ReplyRef.current.handleOpenReply(),
                    ReplyRef.current.setItems("بازگشت به فرستنده", 5);
                }
              }}
              backgroundColor={color?.color}
              IconComponent={RedoIcon}
            />
          )}
        {toolbars !== null && toolbars!.pdfExport && docheapId && (
          <CustomButton
            tooltipContent="Pdf خروجی"
            onClick={() => {
              if (PrintRef.current) {
                PrintRef.current.handleOpenPrint();
              }
            }}
            backgroundColor={color?.color}
            IconComponent={PictureAsPdfIcon}
          />
        )}
        {toolbars !== null && toolbars!.print && docheapId && (
          <CustomButton
            tooltipContent="چاپ"
            onClick={() => {
              if (PrintRef.current) {
                PrintRef.current.handleOpenPrint();
              }
            }}
            backgroundColor={color?.color}
            IconComponent={PrintIcon}
          />
        )}
        {toolbars !== null && toolbars!.archive && docheapId && (
          <CustomButton
            tooltipContent="بایگانی"
            onClick={() => {
              if (ArchiveRef.current) {
                ArchiveRef.current.handleOpenArchives();
              }
            }}
            backgroundColor={color?.color}
            IconComponent={InventoryIcon}
          />
        )}
        {toolbars !== null && toolbars!.secretariateExport && docheapId && (
          <CustomButton
            tooltipContent="ثبت صادره مدرک"
            onClick={() => {
              if (SubmitRef.current) {
                SubmitRef.current.handleOpenSubmit();
              }
            }}
            backgroundColor={color?.color}
            IconComponent={ExitToAppIcon}
          />
        )}
        {(docTypeId == "1" || docTypeId == "5") && (
          <CustomButton
            tooltipContent="ذخیره پیش نویس"
            onClick={() => {
              if (DarftRef.current) {
                DarftRef.current.handleOpen();
              }
            }}
            backgroundColor={color?.color}
            IconComponent={ContentCopyIcon}
          />
        )}
        {docheapId && (
          <CustomButton
            tooltipContent="ابطال نامه"
            onClick={() => {
              if (RevokeRef.current) {
                RevokeRef.current.handleOpenRevoke();
              }
            }}
            backgroundColor="#912329"
            IconComponent={DeleteForeverIcon}
          />
        )}
      </section>
      {toolbars !== null && toolbars!.pdfExport && docheapId && (
        <PrintDocument ref={PrintRef} />
      )}
      {(docTypeId == "1" || docTypeId == "5") && <SaveDraft ref={DarftRef} />}
      {toolbars !== null && toolbars!.secretariateExport && docheapId && (
        <SubmitDocument ref={SubmitRef} />
      )}
      {docheapId && <RevokeDocument ref={RevokeRef} />}
      {toolbars !== null &&
        toolbars!.return &&
        docheapId &&
        forwardParentId && <ReplyDocument ref={ReplyRef} />}
      {toolbars !== null && toolbars!.forward && docheapId && (
        <ForwardDocument ref={ForwardRef} />
      )}
      {toolbars !== null && toolbars!.forwardTree && docheapId && (
        <ForwardHierarchy ref={HierarchyRef} />
      )}
      {toolbars !== null && toolbars!.archive && docheapId && (
        <ArchiveHierarchy ref={ArchiveRef} />
      )}
      {docTypeId == "4" && <ExistDocuments ref={ExistRef} />}
    </ToolbarContext.Provider>
  );
};

export default NewDocumentToolbar;
