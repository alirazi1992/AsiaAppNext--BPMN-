"use client";
import { useDocTypes } from "@/app/Application-AsiaApp/M_Automation/NewDocument/fetchDocType";
import { useDocumentData } from "@/app/Application-AsiaApp/M_Automation/NewDocument/fetchDocumentData";
import { useDocumentImage } from "@/app/Application-AsiaApp/M_Automation/NewDocument/fetchDocumentImage";
import { useNewDocumentData } from "@/app/Application-AsiaApp/M_Automation/NewDocument/fetchNewDocumentData";
import { forwardSeen } from "@/app/Application-AsiaApp/M_Automation/NewDocument/SetForwardSeenState";
import { initializeState } from "@/app/Application-AsiaApp/Utils/M_Automation/NewDocument/data";
import { loading } from "@/app/Application-AsiaApp/Utils/shared";
import Loading from "@/app/components/shared/loadingGetData";
import { GetForwardsListModel } from "@/app/Domain/M_Automation/NewDocument/Forwards";
import { GetDocumentDataModel, InitializeStateModel } from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import { GetMainReceiver } from "@/app/Domain/M_Automation/NewDocument/Receivers";
import { LoadingModel } from "@/app/Domain/shared";
import useStore from "@/app/hooks/useStore";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import { Chip, ListItemSuffix, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react";
import { useSearchParams } from "next/navigation";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import CustomTab from "../../../Shared/CustomTab";
import Attachments from "./Attachments/MainContainer";
import DocumentImage from "./documentImage";
import DocumentInfo from "./DocumentInformation/MainContainer";
import ForwardsList from "./Forwards/Forwards-MainContainer";
import ImportImageMainContainer from "./ImportImage/MainContainer";
import Keywords from "./Keyword-RelatedDocuments/MainContainers";
import LetterContent from "./letterContent";
import NewDocumentToolbar from "./NewDocument-Toolbar";
import Paraphs from "./Paraphes/Paraphs-MainContainer";
import Receivers from "./Receivers/Receivers-MainContainer";
import Senders from "./Sender/Senders-MainContainer";

export type ReceiversType = {
  mainReceivers: GetMainReceiver[];
  copyReceivers: GetMainReceiver[];
  senders?: GetMainReceiver[];
};

export type NewDocumentMainContainerDataContextType = {
  forwardsList: GetForwardsListModel[];
  setForwardsList: Dispatch<React.SetStateAction<GetForwardsListModel[]>>;
  setDocHeapId: Dispatch<React.SetStateAction<string | null>>;
  activate: string;
  receivers: ReceiversType;
  setReceivers: Dispatch<React.SetStateAction<ReceiversType>>;
  setParaphLength: Dispatch<React.SetStateAction<number>>;
  state: InitializeStateModel;

  setState: Dispatch<React.SetStateAction<InitializeStateModel>>;
  loadings: LoadingModel;
  setLoadings: Dispatch<React.SetStateAction<LoadingModel>>;
  templateId: string | null;
  docheapId: string | null;
  docTypeId: string | null;
  forwardParentId: string | null;
  AllData: GetDocumentDataModel[] | undefined;
};

export const DataContext = React.createContext<NewDocumentMainContainerDataContextType | any>(null);
const NewDocumentMainContainer = () => {
  const { fetchDocumentData } = useDocumentData();
  const { fetchNewDocumentData } = useNewDocumentData();
  const [loadings, setLoadings] = useState<LoadingModel>(loading);
  const [forwardsList, setForwardsList] = useState<GetForwardsListModel[]>([]);
  const { fetchGetTypes } = useDocTypes();
  const { fetchPdf } = useDocumentImage();
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state);
  const searchParams = useSearchParams();
  const docTypeId = useRef<string | null>(searchParams.get("doctypeid"));
  const layoutType = useRef<string | null>(searchParams.get("layoutsize"));
  const draftId = useRef<string | null>(searchParams.get("id"));
  const [receivers, setReceivers] = useState<ReceiversType>({
    mainReceivers: [],
    copyReceivers: [],
    senders: docTypeId.current == "1" || docTypeId.current == "5" ? undefined : [],
  });
  const ImageRef = useRef<{ setItems: (item: string) => void }>(null);
  const forwardParentId = useRef<string | null>(searchParams.get("forwardparentid"));
  const templateId = searchParams.get("templateId");
  const [docHeapId, setDocHeapId] = useState<string | null>(searchParams.get("docheapid"));
  const [activate, setActivate] = useState<string>(
    docTypeId.current == "1" || docTypeId.current == "5" ? "documentResult" : "documentInfo"
  );
  const [state, setState] = useState<InitializeStateModel>(initializeState);
  const [paraphLength, setParaphLength] = useState<number>(0);
  const { ForwardState } = forwardSeen();
  const loadInitialDocumentData = async () => {
    setLoadings((prev) => ({ ...prev, response: true }));
    try {
      let result: GetDocumentDataModel[] | any;
      if (docHeapId !== null) {
        result = await fetchDocumentData(docHeapId, docTypeId!.current!);
        setState((prev) => ({
          ...prev,
          signers: result?.find((item: GetDocumentDataModel) => item.fieldName === "signers-container")
            ? JSON.parse(
                result?.find((item: GetDocumentDataModel) => item.fieldName === "signers-container")?.fieldValue
              )
            : [],
        }));
        if (result) {
          if (searchParams.get("forwardparentid")) {
            const res = await ForwardState(docHeapId, Number(forwardParentId!.current!));
          }
        }
      } else {
        result = await fetchNewDocumentData(docTypeId!.current!, draftId.current!, layoutType.current!);
      }
      setState((prev) => ({
        ...prev,
        documentData: Array.isArray(result) ? result : [],
      }));
      setLoadings((prev) => ({ ...prev, response: false }));
    } catch (error) {
      // setLoadings((prev) => ({ ...prev, response: false }));
      console.error("Error loading document data:", error);
    }
  };
  useEffect(() => {
    loadInitialDocumentData();
  }, [searchParams, docHeapId]);

  useEffect(() => {
    setState({ ...state, documentData: [], documentImage: "", layoutId: 0 });
    setDocHeapId(searchParams.get("docheapid"));
    docTypeId.current = searchParams.get("doctypeid");
    forwardParentId.current = searchParams.get("forwardparentid");
    layoutType.current = searchParams.get("layoutsize");
    draftId.current = searchParams.get("id");
    forwardParentId.current = searchParams.get("forwardparentid");
    loadInitialDocumentData();
  }, [searchParams]);

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadInitialDocumentImage = async () => {
      setLoadings((prev) => ({ ...prev, iframeLoading: true }));
      const res = await fetchPdf(
        docHeapId!,
        Number(state.documentData?.find((item: GetDocumentDataModel) => item.fieldName === "TemplateId")?.fieldValue!)
      );
      if (res) {
        if (typeof res == "string" && ImageRef.current) {
          ImageRef.current.setItems(res);
        }
      }
      setLoadings((prev) => ({ ...prev, iframeLoading: false }));
    };
    if (
      !imageLoaded &&
      state.documentData !== undefined &&
      state.documentData.length > 0 &&
      docHeapId &&
      (docTypeId.current == "1" || docTypeId.current == "5") &&
      Number(state.documentData?.find((item: GetDocumentDataModel) => item.fieldName === "TemplateId")?.fieldValue!) !=
        0 &&
      activate == "documentResult"
    ) {
      loadInitialDocumentImage();
      setImageLoaded(true);
    }
  }, [activate, docHeapId, fetchPdf, state.documentData, imageLoaded]);

  useEffect(() => {
    setReceivers((prev: ReceiversType) => ({
      ...prev,
      mainReceivers: state?.documentData?.find((item: GetDocumentDataModel) => item.fieldName === "MainReceiver")
        ? JSON.parse(
            state.documentData.find((item: GetDocumentDataModel) => item.fieldName === "MainReceiver")!.fieldValue
          ).Selected.map((i: any) => {
            return i.Actor;
          })
        : [],
      copyReceivers: state?.documentData?.find((item: GetDocumentDataModel) => item.fieldName === "CopyReceiver")
        ? JSON.parse(
            state.documentData.find((item: GetDocumentDataModel) => item.fieldName === "CopyReceiver")!.fieldValue
          ).Selected.map((i: any) => {
            return i.Actor;
          })
        : [],
      senders:
        docTypeId.current == "4" &&
        state?.documentData?.find((item: GetDocumentDataModel) => item.fieldName === "Sender")
          ? JSON.parse(
              state.documentData.find((item: GetDocumentDataModel) => item.fieldName === "Sender")!.fieldValue
            ).Selected.map((i: any) => {
              return i.Actor;
            })
          : [],
    }));
  }, [state.documentData]);

  useEffect(() => {
    const GetDocTypes = async () => {
      const res = await fetchGetTypes(docHeapId, docTypeId!.current!).then((res) => {
        if (res) {
          if (typeof res == "object" && res !== null) {
            setState((prev) => ({ ...prev, docTypes: res }));
          }
        }
      });
    };
    GetDocTypes();
  }, [docHeapId, docTypeId, fetchGetTypes]);

  return (
    <>
      <DataContext.Provider
        value={{
          forwardsList,
          setForwardsList,
          setDocHeapId,
          activate,
          receivers,
          setReceivers,
          setParaphLength,
          state,
          setState,
          loadings,
          setLoadings,
          templateId: templateId,
          docheapId: docHeapId,
          docTypeId: docTypeId.current,
          forwardParentId: forwardParentId.current,
          AllData: state.documentData,
        }}
      >
        <Tabs
          value={
            (docTypeId.current == "1" || docTypeId.current == "5") && docHeapId ? "documentResult" : "documentInfo"
          }
          className="flex flex-col overflow-auto p-2/4 h-full"
        >
          <TabsHeader
            dir="rtl"
            className={`${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"} w-full  bg-white z-10`}
            indicatorProps={{
              style: { background: color?.color },
              className: `shadow !text-gray-900`,
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <section className="flex flex-col md:h-[35px] md:flex-row w-full">
              {(docTypeId.current == "1" || docTypeId.current == "5") && docHeapId && (
                <CustomTab
                  value="documentResult"
                  label="تصویر مدرک"
                  isActive={activate === "documentResult"}
                  onClick={() => {
                    setActivate("documentResult"), setImageLoaded(false);
                  }}
                />
              )}
              <CustomTab
                value="documentInfo"
                label="اطلاعات مدرک"
                isActive={activate === "documentInfo"}
                onClick={() => setActivate("documentInfo")}
              />
              <CustomTab
                value="recievers"
                label="گیرندگان"
                isActive={activate === "recievers"}
                onClick={() => setActivate("recievers")}
              />
              {docHeapId != null && (
                <CustomTab
                  value="paraph"
                  isActive={activate === "paraph"}
                  onClick={() => setActivate("paraph")}
                  label={
                    <>
                      <ListItemSuffix
                        className="flex"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        پاراف ها
                        <Chip
                          value={paraphLength ?? 0}
                          variant="ghost"
                          size="sm"
                          style={{
                            color: `${activate == "paraph" ? "white" : color?.color}`,
                          }}
                          className={`rounded-full ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                        />
                      </ListItemSuffix>
                    </>
                  }
                />
              )}

              {docTypeId.current == "4" && (
                <CustomTab
                  value="sender"
                  label="فرستنده"
                  isActive={activate === "sender"}
                  onClick={() => setActivate("sender")}
                />
              )}
              {docHeapId != null && (
                <CustomTab
                  value="appendices"
                  label="ضمائم"
                  isActive={activate === "appendices"}
                  onClick={() => {
                    setActivate("appendices");
                    if (ImageRef.current) {
                      ImageRef.current.setItems("");
                    }
                  }}
                />
              )}
              {docHeapId != null && (
                <CustomTab
                  value="relatedDocument"
                  label="کلیدواژه و اسناد مرتبط"
                  isActive={activate === "relatedDocument"}
                  onClick={() => setActivate("relatedDocument")}
                />
              )}
              {docHeapId != null && (
                <CustomTab
                  value="Forwards"
                  label="ارجاعات"
                  isActive={activate === "Forwards"}
                  onClick={() => setActivate("Forwards")}
                />
              )}
              {(docTypeId.current == "1" || docTypeId.current == "5") && (
                <CustomTab
                  value="letterContent"
                  label="متن نامه"
                  isActive={activate === "letterContent"}
                  onClick={() => setActivate("letterContent")}
                />
              )}
              {state.docTypes?.isImportType == true && docTypeId.current == "4" && docHeapId && (
                <CustomTab
                  value="letterImage"
                  label="تصویر نامه"
                  isActive={activate === "letterImage"}
                  onClick={() => setActivate("letterImage")}
                />
              )}
            </section>
          </TabsHeader>
          <div className="mt-2">
            <NewDocumentToolbar />
          </div>
          <div className="w-full mt-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
            {" "}
            {/* Adjust maxHeight as needed */}
            {
              <>
                {loadings.response == true && <Loading />}
                <TabsBody
                  className="min-h-[500px] m-0 p-0"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <TabPanel className="h-full w-full" value="documentInfo">
                    {
                      <>
                        {state.documentData == undefined && <Loading />}
                        <DocumentInfo />
                      </>
                    }
                  </TabPanel>
                  {docHeapId != null && (
                    <TabPanel className="h-full w-full" value="relatedDocument">
                      <Keywords />
                    </TabPanel>
                  )}
                  <TabPanel className="h-full w-full m-0 p-0" value="recievers">
                    <Receivers />
                  </TabPanel>
                  <TabPanel className="h-full w-full" value="documentResult">
                    <DocumentImage ref={ImageRef} />
                  </TabPanel>
                  {docHeapId != null && (
                    <TabPanel className="h-full w-full" value="appendices">
                      <Attachments />
                    </TabPanel>
                  )}
                  {docHeapId != null && (
                    <TabPanel className="h-full w-full p-0 m-0" value="paraph">
                      <Paraphs />
                    </TabPanel>
                  )}
                  {docTypeId.current == "4" && (
                    <TabPanel className="h-full w-full p-0 m-0" value="sender">
                      <Senders />
                    </TabPanel>
                  )}
                  {docHeapId != null && (
                    <TabPanel className="h-full w-full" value="Forwards">
                      <ForwardsList />
                    </TabPanel>
                  )}
                  <TabPanel className="h-full w-full" value="letterContent">
                    <LetterContent
                      content={
                        state.documentData !== undefined &&
                        state.documentData.length > 0 &&
                        state.documentData.find((item) => item.fieldName == "Passage") &&
                        JSON.parse(state.documentData.find((item) => item.fieldName == "Passage")!.fieldValue as string)
                          ?.WordDocUrlDto.Urlsrc!
                      }
                    />
                  </TabPanel>
                  {state.docTypes?.isImportType == true && docTypeId.current == "4" && docHeapId && (
                    <TabPanel className="h-full w-full" value="letterImage">
                      <ImportImageMainContainer />
                    </TabPanel>
                  )}
                </TabsBody>
              </>
            }
          </div>
        </Tabs>
      </DataContext.Provider>
    </>
  );
};
export default NewDocumentMainContainer;
