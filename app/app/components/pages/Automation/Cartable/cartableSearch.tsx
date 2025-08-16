"use client";
import useAxios from "@/app/hooks/useAxios";
import {
  AttachmentsModel,
  CartableAutomationGetInbox,
  CartableAutomationGetOutboxItems,
  CartableAutomationMainReceiversName,
  CartableAutomationOutboxTableItems,
  GetInboxListTableDocList,
  GetOutboxListTable,
  InitialStateModel,
  LoadingModel,
  Response,
  Select2OptionsModel,
  ViewAttachmentModel,
} from "@/app/models/Automation/CartableAutomationModel";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import {
  Button,
  CardBody,
  Checkbox,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  ListItemSuffix,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Select2, { ActionMeta, SingleValue } from "react-select";
// ***icon
import b64toBlob from "@/app/Utils/Automation/convertImageToBlob";
import AcsPdfViewer from "@/app/components/pdfViewer/AcsPdfViewer";
import ButtonComponent from "@/app/components/shared/ButtonComponent";
import IframeSkeleton from "@/app/components/shared/IframeSkeleton";
import InputSkeleton from "@/app/components/shared/InputSkeleton";
import TableSkeleton from "@/app/components/shared/TableSkeleton";
import TitleComponent from "@/app/components/shared/TitleComponent";
import ResLoading from "@/app/components/shared/loadingResponse";
import useStore from "@/app/hooks/useStore";
import activeStore from "@/app/zustandData/activate.zustand";
import useLoginUserInfoStore from "@/app/zustandData/useLoginUserInfo";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DraftsIcon from "@mui/icons-material/Drafts";
import InfoIcon from "@mui/icons-material/Info";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import LogoutIcon from "@mui/icons-material/Logout";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RedoIcon from "@mui/icons-material/Redo";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Pagination, Stack } from "@mui/material";
import moment from "jalali-moment";
import Image from "next/image";
import Swal from "sweetalert2";

const CartableSearch = () => {
  const activeState = activeStore();
  const userInformation = useLoginUserInfoStore();
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const [type, setType] = useState<string>("inbox");
  const [open, setOpen] = useState<boolean>(false);
  const [openAttachment, setOpenAttachment] = useState<boolean>(false);
  const handleOpenAttachment = () => setOpen(!open);
  const handleViewAttachment = () => setOpenAttachment(!openAttachment);
  const [selectedRecieveType, setSelectedRecieveType] =
    useState<CartableAutomationGetInbox>();
  const [selectedState, setSelectedState] = useState<string>("Done");
  const [title, setTitle] = useState<string>("");
  const [activeId, setActiveId] = useState<number>(1);
  const [outboxItem, setOutboxItem] = useState<number>();
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  const handleViewVideoAttachment = () => setOpenVideo(!openVideo);
  const { AxiosRequest } = useAxios();
  let loading = {
    loadingResponse: false,
    loadingInboxList: false,
    loadingOutInboxList: false,
    loadingIframe: false,
    loadingInbox: false,
    loadingOutInbox: false,
  };
  const [loadings, setLoadings] = useState<LoadingModel>(loading);
  let initialState = {
    getInbox: [],
    paginationCount: 0,
    outBoxPaginationCount: 0,
    docTypeId: 0,
    checkedDocumentInbox: [],
    checkedDocumentOutbox: [],
    getOutbox: [],
    getInboxList: undefined,
    outboxState: 0,
    getOutboxList: undefined,
    attachment: [],
    attachmentImg: "",
    file: null,
  };

  const VideoTypes: string[] = [
    "video/ogg",
    "video/mp4",
    "video/x-matroska",
    "video/webm",
    "audio/mp4",
    "audio/mpeg",
    "audio/aac",
    "audio/x-caf",
    "audio/flac",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
    "application/x-mpegURL",
  ];

  let videoRef = useRef(null) as MutableRefObject<AttachmentsModel | null>;

  const [cartableAutomationState, setCartableAutomationState] =
    useState<InitialStateModel>(initialState);
  const [activateInbox, setActivateInbox] =
    useState<CartableAutomationGetInbox | null>(null);
  const [activate, setActivate] = useState<string>(
    cartableAutomationState.getInbox != null &&
      cartableAutomationState.getInbox.length > 0
      ? cartableAutomationState.getInbox[0]!.receiveTypeTitle!
      : "انجام شده"
  );

  async function GetInbox() {
    setLoadings((state) => ({ ...state, loadingInbox: true }));
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getinbox`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<CartableAutomationGetInbox[]>> =
      await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      setLoadings((state) => ({ ...state, loadingInbox: false }));
      if (response?.data.status && response.data.data != null) {
        setCartableAutomationState((state: any) => ({
          ...state,
          getInbox: response.data.data,
        }));
        setSelectedRecieveType(response.data.data[0]);
        setActivate(
          activate != "" ? activate : response.data.data[0]!.receiveTypeTitle!
        );
        setActivateInbox(
          activateInbox != null ? activateInbox : response.data.data[0]!
        );
        response.data.data.length &&
          setTitle(response.data.data[0].receiveTypeTitle);
      }
    }
  }

  async function GetOutBox() {
    setLoadings((state) => ({ ...state, loadingOutInbox: true }));
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getoutbox`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<CartableAutomationGetOutboxItems[]>> =
      await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      setLoadings((state) => ({ ...state, loadingOutInbox: false }));
      if (response?.data.status && response.data.data != null) {
        //GetOutboxListTable(response.data.data[0]!.title, 1);
        setCartableAutomationState((state: any) => ({
          ...state,
          getOutbox: response.data.data,
        }));
      }
    }
  }

  const GetInboxListTableByDocTypeId = useCallback(
    async (pageNumber: number) => {
      setLoadings((state) => ({ ...state, loadingInboxList: true }));
      let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getlistbyreceiveTypeanddocType?ReceiveTypeId=${activateInbox?.receiveTypeId}&DocTypeId=${cartableAutomationState.docTypeId}&ReceiveTypeName=${activateInbox?.receiveTypeTitle}&PageNo=${pageNumber}&Count=10`;
      let method = "get";
      let data = {};
      let response: AxiosResponse<Response<any>> = await AxiosRequest({
        url,
        method,
        data,
        credentials: true,
      });
      if (response) {
        setLoadings((state) => ({ ...state, loadingInboxList: false }));
        if (response.data.status == true && response.data.data != null) {
          setCartableAutomationState((state: any) => ({
            ...state,
            getInboxList: response.data.data,
          }));
          let countPagination = Math.ceil(
            Number(response.data.data.totalCount) / Number(10)
          );
          setCartableAutomationState((state: any) => ({
            ...state,
            paginationCount: countPagination,
          }));
          return;
        }
      }
    },
    [cartableAutomationState.docTypeId, activateInbox]
  );

  const GetOutboxListTable = async (optionState: string, page: number) => {
    setLoadings((state) => ({ ...state, loadingOutInboxList: true }));
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getstatedoclist`;
    let method = "post";
    let data = {
      page: page,
      count: 10,
      state: optionState,
    };
    let response: AxiosResponse<Response<CartableAutomationOutboxTableItems>> =
      await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      setLoadings((state) => ({ ...state, loadingOutInboxList: false }));
      if (
        response &&
        response?.data.data != null &&
        response?.data.status == true
      ) {
        setCartableAutomationState((state: any) => ({
          ...state,
          getOutboxList: response.data.data,
        }));
        let countPagination = Math.ceil(
          Number(response.data.data.totalCount) / Number(10)
        );
        setCartableAutomationState((state: any) => ({
          ...state,
          outBoxPaginationCount: countPagination,
        }));
        return;
      }
    }
  };

  useEffect(() => {
    type == "inbox" ? GetInbox() : GetOutBox();
  }, [type, userInformation.userInfo?.activeRole]);

  useEffect(() => {
    activateInbox?.receiveTypeId != null &&
      activateInbox?.receiveTypeId != undefined &&
      GetInboxListTableByDocTypeId(1);
  }, [
    cartableAutomationState.docTypeId,
    activateInbox,
    GetInboxListTableByDocTypeId,
  ]);

  useEffect(() => {
    selectedState != null || selectedState != undefined
      ? GetOutboxListTable(selectedState, 1)
      : null;
  }, [selectedState]);

  const ViewAttachment = async (itemAttachment: AttachmentsModel) => {
    setLoadings((state) => ({ ...state, loadingIframe: true }));
    handleOpenAttachment();
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/downloadattachment?id=${itemAttachment.attachmentId}&attachmentType=2`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<ViewAttachmentModel>> =
      await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      setLoadings((state) => ({ ...state, loadingIframe: false }));
      if (response.data.data != null && response.data.status == true) {
        let blob = b64toBlob({
          b64Data: response.data.data.file.substring(
            response.data.data.file.lastIndexOf(",") + 1
          ),
          contentType: response.data.data.fileType,
          sliceSize: 512,
        });
        let blobUrl = URL.createObjectURL(blob);
        const base64String = `data:${response.data.data.fileType};base64,${response.data.data.file}`;
        setCartableAutomationState((state: any) => ({
          ...state,
          attachmentImg: blobUrl,
          file: {
            file: base64String,
            fileName: response.data.data.fileName,
            fileType: response.data.data.fileType,
          },
        }));
        handleViewAttachment();
      } else {
        Swal.fire({
          background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
          color: themeMode?.stateMode == true ? "white" : "#463b2f",
          allowOutsideClick: false,
          title: "Reference attachments!",
          text: response.data.message,
          icon: response.data.status == false ? "error" : "warning",
          confirmButtonColor: "#22c55e",
          confirmButtonText: "OK!",
        });
      }
    }
  };

  const ExitDocumentFromCartable = async (responseNumber: number) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/exitdocfromcartable`;
    let method = "put";
    let data = {
      forwardIds: cartableAutomationState.checkedDocumentInbox.map(
        (i: GetInboxListTableDocList) => i.forwardParentId
      ),
      response: responseNumber,
    };
    Swal.fire({
      background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "خروج مدرک از کارتابل",
      text: "آیا از خروج مدرک اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }));
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({
          url,
          method,
          data,
          credentials: true,
        });
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }));
          if (response.data.status == true && response.data.data == true) {
            let doclist: GetInboxListTableDocList[] | undefined =
              cartableAutomationState.getInboxList?.docList?.filter(
                (item: GetInboxListTableDocList) =>
                  !cartableAutomationState.checkedDocumentInbox
                    .map((i) => i.forwardParentId)
                    .includes(item.forwardParentId)
              );
            if (doclist != null && doclist.length != 0) {
              setCartableAutomationState((state) => ({
                ...state,
                getInboxList: {
                  count: doclist!.length,
                  docList: doclist!,
                  page: state.getInboxList!.page,
                  totalCount:
                    state.getInboxList!.totalCount -
                    cartableAutomationState.checkedDocumentInbox.length,
                },
                checkedDocumentInbox: [],
                getInbox:
                  doclist!.length > 0
                    ? state.getInbox?.map((i: CartableAutomationGetInbox) => {
                        if (i.receiveTypeId == activeId) {
                          return {
                            ...i,
                            count:
                              cartableAutomationState.getInboxList
                                ?.totalCount! -
                              cartableAutomationState.checkedDocumentInbox
                                .length,
                          };
                        } else {
                          return i;
                        }
                      })
                    : state.getInbox!.filter(
                        (i: CartableAutomationGetInbox) =>
                          i.receiveTypeId != activeId
                      ),
              }));
              GetInbox();
            } else {
              GetInbox();
              GetInboxListTableByDocTypeId(1);
            }
          } else {
            Swal.fire({
              background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "خروج مدرک از کارتابل",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
              text: response.data.message,
              icon: response.data.status ? "warning" : "error",
            });
          }
        }
      }
    });
  };

  const ExitDocumentFromCarableOutInbox = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/exitfocfromstatecartable`;
    let method = "put";
    let data = (
      cartableAutomationState.checkedDocumentOutbox as GetOutboxListTable[]
    ).map((p) => p.forwardSourceId);
    Swal.fire({
      background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "خروج مدرک از کارتابل",
      text: "آیا از خروج مدرک اطمینان دارید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }));
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({
          url,
          method,
          data,
          credentials: true,
        });
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }));
          if (response.data.data == true && response.data.status == true) {
            let doclist: GetOutboxListTable[] | undefined =
              cartableAutomationState.getOutboxList?.docList?.filter(
                (item: GetOutboxListTable) =>
                  !cartableAutomationState.checkedDocumentOutbox
                    .map((i) => i.forwardParentId)
                    .includes(item.forwardParentId)
              );
            if (doclist != null && doclist.length != 0) {
              setCartableAutomationState((state) => ({
                ...state,
                getOutboxList: {
                  count: doclist!.length,
                  docList: doclist!,
                  page: state.getOutboxList!.page,
                  totalCount:
                    state.getOutboxList!.totalCount -
                    cartableAutomationState.checkedDocumentOutbox.length,
                },
                checkedDocumentOutbox: [],
              }));
              GetOutBox();
            } else {
              GetOutBox();
              GetOutboxListTable(selectedState, 1);
            }
          } else {
            Swal.fire({
              background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "خروج مدرک از کارتابل",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
              text: response.data.message,
              icon: response.data.status ? "warning" : "error",
            });
          }
        }
      }
    });
  };
  const router = useRouter();

  const ViewNewDocument = (documentOption: GetOutboxListTable) => {
    if (router) {
      activeStore.setState((state) => ({
        ...state,
        activeSubLink: "New Document",
      })),
        window.open(
          `/Home/NewDocument?docheapid=${documentOption.docHeapId}&doctypeid=${documentOption.docTypeId}&forwardparentid=${documentOption.forwardParentId}`
        );
    }
  };
  const ViewNewDocumentInbox = (documentOption: GetInboxListTableDocList) => {
    if (router) {
      activeStore.setState((state) => ({
        ...state,
        activeSubLink: "New Document",
      })),
        window.open(
          `/Home/NewDocument?docheapid=${documentOption.docHeapId}&doctypeid=${documentOption.docTypeId}&forwardparentid=${documentOption.forwardParentId}`
        );
    }
  };
  const SelectCheckboxInbox = (option: GetInboxListTableDocList) => {
    if (
      cartableAutomationState.checkedDocumentInbox.some(
        (p: GetInboxListTableDocList) =>
          p.forwardParentId == option.forwardParentId
      )
    ) {
      let newChecked = cartableAutomationState.checkedDocumentInbox.filter(
        (p: GetInboxListTableDocList) =>
          p.forwardParentId != option.forwardParentId
      );
      setCartableAutomationState((state: InitialStateModel) => ({
        ...state,
        checkedDocumentInbox: newChecked,
      }));
    } else {
      if (cartableAutomationState.checkedDocumentInbox == null) {
        setCartableAutomationState((state: InitialStateModel) => ({
          ...state,
          checkedDocumentInbox: [option],
        }));
      } else {
        cartableAutomationState.checkedDocumentInbox.push(option);
        setCartableAutomationState((state: InitialStateModel) => ({
          ...state,
          checkedDocumentInbox: [
            ...cartableAutomationState.checkedDocumentInbox,
          ],
        }));
      }
    }
  };
  const SelectCheckboxOutbox = (option: GetOutboxListTable) => {
    if (
      cartableAutomationState.checkedDocumentOutbox.some(
        (p: GetOutboxListTable) => p.docHeapId == option.docHeapId
      )
    ) {
      let newChecked = cartableAutomationState.checkedDocumentOutbox.filter(
        (p: GetOutboxListTable) => p.docHeapId != option.docHeapId
      );
      setCartableAutomationState((state: InitialStateModel) => ({
        ...state,
        checkedDocumentOutbox: newChecked,
      }));
    } else {
      if (cartableAutomationState.checkedDocumentOutbox.length == null) {
        setCartableAutomationState((state: InitialStateModel) => ({
          ...state,
          checkedDocumentOutbox: [option],
        }));
      } else {
        cartableAutomationState.checkedDocumentOutbox.push(option);
        setCartableAutomationState((state: InitialStateModel) => ({
          ...state,
          checkedDocumentOutbox: [
            ...cartableAutomationState.checkedDocumentOutbox,
          ],
        }));
      }
    }
  };
  const Select2Options: Select2OptionsModel[] = [
    {
      Title: "همه",
      label: "همه",
      Id: 0,
      value: 0,
    },
    {
      Title: "نامه اداری",
      label: "نامه اداری",
      Id: 1,
      value: 1,
    },
    {
      Title: "نامه وارده",
      label: "نامه وارده",
      Id: 4,
      value: 4,
    },
    {
      Title: "کاور لتر",
      label: "کاور لتر",
      Id: 5,
      value: 5,
    },
  ];

  return (
    <>
      {loadings.loadingResponse == true && <ResLoading />}
      <section className="w-full my-2 flex items-center justify-evenly flex-col">
        <div className="w-[100%] mx-auto">
          <Tabs value="inbox" className="w-full">
            <section className="w-[99%] mx-auto flex flex-col items-center px-3 justify-evenly md:justify-end md:flex-row  ">
              {type == "inbox" &&
                cartableAutomationState.getInbox!.length > 0 && (
                  <div className=" w-[99%] md:w-[50%] flex justify-center md:justify-start">
                    <Select2
                      isRtl
                      className={`${
                        themeMode?.stateMode ? "lightText" : "darkText"
                      } w-full md:w-[300px] z-[10] my-3 md:my-0`}
                      placeholder="نوع مدرک"
                      options={Select2Options}
                      onChange={(
                        option: SingleValue<Select2OptionsModel>,
                        actionMeta: ActionMeta<Select2OptionsModel>
                      ) => {
                        setCartableAutomationState((state: any) => ({
                          ...state,
                          docTypeId: option?.value,
                        }));
                      }}
                      defaultValue={Select2Options.find(
                        (item) => item.label == "همه" && item.value == 0
                      )}
                      value={Select2Options.find((item) => {
                        item.Id == cartableAutomationState.docTypeId,
                          item.value == cartableAutomationState.docTypeId;
                      })}
                      theme={(theme) => ({
                        ...theme,
                        height: 10,
                        borderRadius: 5,
                        colors: {
                          ...theme.colors,
                          color: "#607d8b",
                          neutral10: `${color?.color}`,
                          primary25: `${color?.color}`,
                          primary: "#607d8b",
                          neutral0: `${
                            themeMode?.stateMode ? "#1b2b39" : "#ded6ce"
                          }`,
                          neutral80: `${
                            themeMode?.stateMode ? "white" : "#463b2f"
                          }`,
                        },
                      })}
                    />
                  </div>
                )}

              <section className="order-first md:order-last w-[98%] md:w-[50%] flex justify-end ">
                <TabsHeader
                  className={`${
                    themeMode?.stateMode ? "contentDark" : "contentLight"
                  } w-full flex flex-row`}
                  indicatorProps={{
                    style: {
                      background: color?.color,
                    },
                    className: `shadow !text-gray-900`,
                  }}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Tab
                    className="w-full whitespace-nowrap"
                    value="outInbox"
                    onClick={() => {
                      setActiveId(1),
                        setType("outInbox"),
                        setActivate("انجام شده"),
                        setCartableAutomationState((state) => ({
                          ...state,
                          checkedDocumentOutbox: [],
                        }));
                    }}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <Typography
                      variant="h6"
                      className={`${
                        themeMode?.stateMode ? "lightText" : "darkText"
                      } text-[13px] md:whitespace-nowrap px-4`}
                      style={{ color: `${type == "outInbox" ? "white" : ""}` }}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      پیگیری ارسالی ها
                    </Typography>
                  </Tab>
                  <Tab
                    className="w-full whitespace-nowrap"
                    value="inbox"
                    onClick={() => {
                      setType("inbox"),
                        setActivate(
                          cartableAutomationState.getInbox != null &&
                            cartableAutomationState.getInbox.length > 0
                            ? cartableAutomationState.getInbox![0]
                                .receiveTypeTitle!
                            : cartableAutomationState.getOutbox![0].title!
                        ),
                        setCartableAutomationState((state) => ({
                          ...state,
                          checkedDocumentInbox: [],
                        }));
                    }}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <Typography
                      variant="h6"
                      className={`${
                        themeMode?.stateMode ? "lightText" : "darkText"
                      } text-[13px] md:whitespace-nowrap px-4`}
                      style={{ color: `${type == "inbox" ? "white" : ""}` }}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      صندوق دریافت
                    </Typography>
                  </Tab>
                </TabsHeader>
              </section>
            </section>
            <TabsBody
              className="w-full"
              animate={{
                initial: { y: 100, cssTransition: "0.4s" },
                mount: { y: 0, cssTransition: "0.4s" },
                unmount: { y: 100, cssTransition: "0.4s" },
              }}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <CardBody
                className="w-full p-0 m-0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <section className="w-full flex items-center justify-center p-0 ">
                  <TabPanel value="inbox" className="w-full mx-0 px-1">
                    {cartableAutomationState.getInbox != null &&
                      cartableAutomationState.getInbox.length > 0 && (
                        <Tabs
                          value={
                            cartableAutomationState.getInbox[0].receiveTypeTitle
                          }
                          dir="rtl"
                          className="w-full px-2"
                        >
                          {loadings.loadingInbox == false ? (
                            <TabsHeader
                              className={`${
                                themeMode?.stateMode
                                  ? "contentDark"
                                  : "contentLight"
                              } flex flex-col md:flex-row w-full`}
                              indicatorProps={{
                                style: {
                                  background: color?.color,
                                },
                                className: `shadow !text-gray-900`,
                              }}
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              {cartableAutomationState.getInbox!.map(
                                (
                                  inbox: CartableAutomationGetInbox,
                                  index: number
                                ) => {
                                  return (
                                    <Tab
                                      className="md:max-w-max"
                                      key={index + "getInboxxxx" + index}
                                      onClick={() => {
                                        setActivateInbox(inbox!),
                                          setActivate(inbox.receiveTypeTitle),
                                          setCartableAutomationState(
                                            (state) => ({
                                              ...state,
                                              checkedDocumentInbox: [],
                                              docTypeId: 0,
                                            })
                                          );
                                      }}
                                      value={inbox.receiveTypeTitle}
                                      placeholder={undefined}
                                      onPointerEnterCapture={undefined}
                                      onPointerLeaveCapture={undefined}
                                    >
                                      <div
                                        className={`${
                                          themeMode?.stateMode
                                            ? "lightText"
                                            : "darkText"
                                        } flex md:px-1  justify-around text-[13px] font-thin`}
                                        style={{
                                          color: `${
                                            activate == inbox.receiveTypeTitle
                                              ? "white"
                                              : ""
                                          }`,
                                        }}
                                      >
                                        {inbox.receiveTypeTitle}
                                        <ListItemSuffix
                                          placeholder={undefined}
                                          onPointerEnterCapture={undefined}
                                          onPointerLeaveCapture={undefined}
                                        >
                                          <Chip
                                            value={inbox.count}
                                            variant="ghost"
                                            size="sm"
                                            style={{
                                              color: `${
                                                activate ==
                                                inbox.receiveTypeTitle
                                                  ? "white"
                                                  : color?.color
                                              }`,
                                            }}
                                            className={`${
                                              themeMode?.stateMode
                                                ? "lightText"
                                                : "darkText"
                                            } rounded-full `}
                                          />
                                        </ListItemSuffix>
                                      </div>
                                    </Tab>
                                  );
                                }
                              )}
                            </TabsHeader>
                          ) : (
                            <InputSkeleton />
                          )}
                          <TabsBody
                            className="w-full p-0 m-0"
                            animate={{
                              initial: { cssTransition: "0.5s" },
                              mount: { cssTransition: "0.5s" },
                              unmount: { cssTransition: "0.5s" },
                            }}
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {cartableAutomationState.getInbox?.map(
                              (
                                item: CartableAutomationGetInbox,
                                index: number
                              ) => {
                                return (
                                  <TabPanel
                                    className="px-2"
                                    key={index + "getInboxxxxx"}
                                    value={item.receiveTypeTitle}
                                  >
                                    <CardBody
                                      className="relative rounded-lg overflow-auto p-0"
                                      placeholder={undefined}
                                      onPointerEnterCapture={undefined}
                                      onPointerLeaveCapture={undefined}
                                    >
                                      <section className="flex flex-row justify-around items-center">
                                        <div className="w-full md:w-[50%]">
                                          <TitleComponent>
                                            {item?.receiveTypeTitle}
                                          </TitleComponent>
                                        </div>
                                        <div className="w-full md:w-[50%] flex flex-col items-end justify-between md:flex-row md:items-center md:justify-around my-3">
                                          <div className="w-[100%] flex flex-row justify-end">
                                            <Tooltip
                                              content="تائید مدرک"
                                              className={
                                                themeMode?.stateMode
                                                  ? "cardDark lightText"
                                                  : "cardLight darkText"
                                              }
                                            >
                                              <Button
                                                onClick={() => {
                                                  ExitDocumentFromCartable(4);
                                                }}
                                                size="sm"
                                                className="p-1 mx-1"
                                                style={{
                                                  background: color?.color,
                                                }}
                                                placeholder={undefined}
                                                onPointerEnterCapture={
                                                  undefined
                                                }
                                                onPointerLeaveCapture={
                                                  undefined
                                                }
                                              >
                                                <CheckCircleIcon
                                                  fontSize="small"
                                                  className="p-1"
                                                  onMouseEnter={(
                                                    event: React.MouseEvent<any>
                                                  ) =>
                                                    event.currentTarget.classList.add(
                                                      "menuIconStyle"
                                                    )
                                                  }
                                                  onMouseLeave={(
                                                    event: React.MouseEvent<any>
                                                  ) =>
                                                    event.currentTarget.classList.remove(
                                                      "menuIconStyle"
                                                    )
                                                  }
                                                />
                                              </Button>
                                            </Tooltip>
                                            <Tooltip
                                              content="رد مدرک"
                                              className={
                                                themeMode?.stateMode
                                                  ? "cardDark lightText"
                                                  : "cardLight darkText"
                                              }
                                            >
                                              <Button
                                                onClick={() => {
                                                  ExitDocumentFromCartable(6);
                                                }}
                                                size="sm"
                                                className="p-1 mx-1"
                                                style={{
                                                  background: color?.color,
                                                }}
                                                placeholder={undefined}
                                                onPointerEnterCapture={
                                                  undefined
                                                }
                                                onPointerLeaveCapture={
                                                  undefined
                                                }
                                              >
                                                <CancelIcon
                                                  fontSize="small"
                                                  className="p-1"
                                                  onMouseEnter={(
                                                    event: React.MouseEvent<any>
                                                  ) =>
                                                    event.currentTarget.classList.add(
                                                      "menuIconStyle"
                                                    )
                                                  }
                                                  onMouseLeave={(
                                                    event: React.MouseEvent<any>
                                                  ) =>
                                                    event.currentTarget.classList.remove(
                                                      "menuIconStyle"
                                                    )
                                                  }
                                                />
                                              </Button>
                                            </Tooltip>
                                            <Tooltip
                                              content="بازگشت به فرستنده"
                                              className={
                                                themeMode?.stateMode
                                                  ? "cardDark lightText"
                                                  : "cardLight darkText"
                                              }
                                            >
                                              <Button
                                                onClick={() => {
                                                  ExitDocumentFromCartable(5);
                                                }}
                                                size="sm"
                                                className="p-1 mx-1"
                                                style={{
                                                  background: color?.color,
                                                }}
                                                placeholder={undefined}
                                                onPointerEnterCapture={
                                                  undefined
                                                }
                                                onPointerLeaveCapture={
                                                  undefined
                                                }
                                              >
                                                <RedoIcon
                                                  fontSize="small"
                                                  className="p-1"
                                                  onMouseEnter={(
                                                    event: React.MouseEvent<any>
                                                  ) =>
                                                    event.currentTarget.classList.add(
                                                      "menuIconStyle"
                                                    )
                                                  }
                                                  onMouseLeave={(
                                                    event: React.MouseEvent<any>
                                                  ) =>
                                                    event.currentTarget.classList.remove(
                                                      "menuIconStyle"
                                                    )
                                                  }
                                                />
                                              </Button>
                                            </Tooltip>
                                          </div>
                                        </div>
                                      </section>
                                      <CardBody
                                        className="mx-0 relative h-[550px] rounded-lg overflow-auto p-0 my-3 "
                                        placeholder={undefined}
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined}
                                      >
                                        {loadings.loadingInboxList == false ? (
                                          <table
                                            dir="rtl"
                                            className={`${
                                              themeMode?.stateMode
                                                ? "tableDark"
                                                : "tableLight"
                                            } w-full relative text-center max-h-[500px] `}
                                          >
                                            <thead className="sticky border-b-2 z-[9999] top-0 left-0 w-full">
                                              <tr
                                                className={
                                                  themeMode?.stateMode
                                                    ? "themeDark"
                                                    : "themeLight"
                                                }
                                              >
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                      themeMode?.stateMode
                                                        ? "lightText"
                                                        : "darkText"
                                                    }`}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={
                                                      undefined
                                                    }
                                                    onPointerLeaveCapture={
                                                      undefined
                                                    }
                                                  >
                                                    #
                                                  </Typography>
                                                </th>
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                      themeMode?.stateMode
                                                        ? "lightText"
                                                        : "darkText"
                                                    }`}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={
                                                      undefined
                                                    }
                                                    onPointerLeaveCapture={
                                                      undefined
                                                    }
                                                  >
                                                    وضعیت
                                                  </Typography>
                                                </th>
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                      themeMode?.stateMode
                                                        ? "lightText"
                                                        : "darkText"
                                                    }`}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={
                                                      undefined
                                                    }
                                                    onPointerLeaveCapture={
                                                      undefined
                                                    }
                                                  >
                                                    نوع
                                                  </Typography>
                                                </th>
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                      themeMode?.stateMode
                                                        ? "lightText"
                                                        : "darkText"
                                                    }`}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={
                                                      undefined
                                                    }
                                                    onPointerLeaveCapture={
                                                      undefined
                                                    }
                                                  >
                                                    ارجاع دهنده
                                                  </Typography>
                                                </th>
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                      themeMode?.stateMode
                                                        ? "lightText"
                                                        : "darkText"
                                                    }`}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={
                                                      undefined
                                                    }
                                                    onPointerLeaveCapture={
                                                      undefined
                                                    }
                                                  >
                                                    آرشیو
                                                  </Typography>
                                                </th>
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                      themeMode?.stateMode
                                                        ? "lightText"
                                                        : "darkText"
                                                    }`}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={
                                                      undefined
                                                    }
                                                    onPointerLeaveCapture={
                                                      undefined
                                                    }
                                                  >
                                                    گیرنده/ فرستنده
                                                  </Typography>
                                                </th>
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                      themeMode?.stateMode
                                                        ? "lightText"
                                                        : "darkText"
                                                    }`}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={
                                                      undefined
                                                    }
                                                    onPointerLeaveCapture={
                                                      undefined
                                                    }
                                                  >
                                                    شماره
                                                  </Typography>
                                                </th>
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`${
                                                      themeMode?.stateMode
                                                        ? "lightText"
                                                        : "darkText"
                                                    } font-[700] text-[10px] p-1.5 leading-none`}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={
                                                      undefined
                                                    }
                                                    onPointerLeaveCapture={
                                                      undefined
                                                    }
                                                  >
                                                    شماره وارده / صادره
                                                  </Typography>
                                                </th>
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                      themeMode?.stateMode
                                                        ? "lightText"
                                                        : "darkText"
                                                    }`}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={
                                                      undefined
                                                    }
                                                    onPointerLeaveCapture={
                                                      undefined
                                                    }
                                                  >
                                                    تاریخ ایجاد
                                                  </Typography>
                                                </th>
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                      themeMode?.stateMode
                                                        ? "lightText"
                                                        : "darkText"
                                                    }`}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={
                                                      undefined
                                                    }
                                                    onPointerLeaveCapture={
                                                      undefined
                                                    }
                                                  >
                                                    موضوع
                                                  </Typography>
                                                </th>
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                      themeMode?.stateMode
                                                        ? "lightText"
                                                        : "darkText"
                                                    }`}
                                                    placeholder={undefined}
                                                    onPointerEnterCapture={
                                                      undefined
                                                    }
                                                    onPointerLeaveCapture={
                                                      undefined
                                                    }
                                                  >
                                                    عملیات
                                                  </Typography>
                                                </th>
                                                <th
                                                  style={{
                                                    borderBottomColor:
                                                      color?.color,
                                                  }}
                                                  className={`${
                                                    themeMode?.stateMode
                                                      ? "themeDark"
                                                      : "themeLight"
                                                  } p-3 sticky top-0 border-b-2 `}
                                                >
                                                  <Tooltip
                                                    content="انتخاب تمام موارد"
                                                    className={
                                                      themeMode?.stateMode
                                                        ? "cardDark lightText"
                                                        : "cardLight darkText"
                                                    }
                                                  >
                                                    <Checkbox
                                                      onChange={(e) =>
                                                        setCartableAutomationState(
                                                          (state) => ({
                                                            ...state,
                                                            checkedDocumentInbox:
                                                              e.target.checked
                                                                ? cartableAutomationState.getInboxList!
                                                                    .docList!
                                                                    .length >
                                                                    0 &&
                                                                  cartableAutomationState.getInboxList!
                                                                    .docList! !=
                                                                    null
                                                                  ? [
                                                                      ...cartableAutomationState.getInboxList!
                                                                        .docList,
                                                                    ]
                                                                  : []
                                                                : [],
                                                          })
                                                        )
                                                      }
                                                      crossOrigin=""
                                                      color="blue-gray"
                                                      className="mx-1"
                                                      onPointerEnterCapture={
                                                        undefined
                                                      }
                                                      onPointerLeaveCapture={
                                                        undefined
                                                      }
                                                    />
                                                  </Tooltip>
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody
                                              className={`divide-y divide-${
                                                themeMode?.stateMode
                                                  ? "themeDark"
                                                  : "themeLight"
                                              }`}
                                            >
                                              {cartableAutomationState
                                                .getInboxList?.totalCount! >
                                                0 &&
                                                cartableAutomationState.getInboxList!.docList?.map(
                                                  (
                                                    option: GetInboxListTableDocList,
                                                    index: number
                                                  ) => {
                                                    return (
                                                      <tr
                                                        style={{
                                                          height:
                                                            "40px !important",
                                                        }}
                                                        key={
                                                          option.forwardParentId +
                                                          "getInboxList"
                                                        }
                                                        className={`${
                                                          index % 2
                                                            ? themeMode?.stateMode
                                                              ? "breadDark"
                                                              : "breadLight"
                                                            : themeMode?.stateMode
                                                            ? "tableDark"
                                                            : "tableLight"
                                                        }  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}
                                                      >
                                                        <td
                                                          style={{
                                                            width: "3%",
                                                          }}
                                                          className="px-1"
                                                        >
                                                          <Typography
                                                            variant="paragraph"
                                                            color="blue-gray"
                                                            className={`${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            } font-[700] text-[12px] px-0.5`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            {Number(index + 1)}
                                                          </Typography>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "3%",
                                                          }}
                                                          className="px-1"
                                                        >
                                                          <div className="container-fluid mx-auto px-0.5">
                                                            <div className="flex flex-row justify-evenly">
                                                              <Button
                                                                size="sm"
                                                                className="p-1"
                                                                style={{
                                                                  background:
                                                                    color?.color,
                                                                }}
                                                                placeholder={
                                                                  undefined
                                                                }
                                                                onPointerEnterCapture={
                                                                  undefined
                                                                }
                                                                onPointerLeaveCapture={
                                                                  undefined
                                                                }
                                                              >
                                                                {option.seenState ==
                                                                false ? (
                                                                  <LocalPostOfficeIcon fontSize="small" />
                                                                ) : (
                                                                  <DraftsIcon fontSize="small" />
                                                                )}
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "3%",
                                                          }}
                                                          className="px-3"
                                                        >
                                                          <Typography
                                                            variant="paragraph"
                                                            color="blue-gray"
                                                            className={`font-[500] text-[12px] px-1.5 leading-none ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            {
                                                              option.docTypeTitle
                                                            }
                                                          </Typography>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "15%",
                                                          }}
                                                          className="px-1"
                                                        >
                                                          <Typography
                                                            variant="paragraph"
                                                            color="blue-gray"
                                                            className={`font-[500] text-[12px] px-0.5 ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            {
                                                              option.forwardSenderName
                                                            }
                                                          </Typography>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "3%",
                                                          }}
                                                          className="px-3 "
                                                        >
                                                          <Typography
                                                            variant="paragraph"
                                                            color="blue-gray"
                                                            className={`font-[500] text-[12px] px-1.5 leading-none ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            <Button
                                                              size="sm"
                                                              className="p-1"
                                                              style={{
                                                                background:
                                                                  color?.color,
                                                              }}
                                                              placeholder={
                                                                undefined
                                                              }
                                                              onPointerEnterCapture={
                                                                undefined
                                                              }
                                                              onPointerLeaveCapture={
                                                                undefined
                                                              }
                                                            >
                                                              {option.isArchived ==
                                                              "آرشیو شده" ? (
                                                                <Tooltip
                                                                  content={
                                                                    option.isArchived
                                                                  }
                                                                  className={
                                                                    themeMode?.stateMode
                                                                      ? "cardDark lightText"
                                                                      : "cardLight darkText"
                                                                  }
                                                                >
                                                                  <CheckBoxIcon fontSize="small" />
                                                                </Tooltip>
                                                              ) : (
                                                                <Tooltip
                                                                  content={
                                                                    option.isArchived
                                                                  }
                                                                  className={
                                                                    themeMode?.stateMode
                                                                      ? "cardDark lightText"
                                                                      : "cardLight darkText"
                                                                  }
                                                                >
                                                                  <CheckBoxOutlineBlankIcon fontSize="small" />
                                                                </Tooltip>
                                                              )}
                                                            </Button>
                                                          </Typography>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "15%",
                                                          }}
                                                          className="px-1"
                                                        >
                                                          <Typography
                                                            variant="paragraph"
                                                            color="blue-gray"
                                                            className={`font-[500] text-[12px] px-0.5 ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            {option.isImport ==
                                                            true
                                                              ? option.sendersName &&
                                                                option.sendersName !=
                                                                  null &&
                                                                option
                                                                  .sendersName
                                                                  .length > 0 &&
                                                                option
                                                                  .sendersName[0]!
                                                                  .faName
                                                              : option.mainReceiversName &&
                                                                option.mainReceiversName !=
                                                                  null &&
                                                                option
                                                                  .mainReceiversName
                                                                  .length > 0 &&
                                                                option
                                                                  .mainReceiversName[0]!
                                                                  .faName}
                                                          </Typography>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "7%",
                                                          }}
                                                          className="px-1"
                                                        >
                                                          <Typography
                                                            variant="paragraph"
                                                            color="blue-gray"
                                                            className={`font-[500] text-[12px] px-0.5 ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            {option.docNumber}
                                                          </Typography>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "7%",
                                                          }}
                                                          className="px-1"
                                                        >
                                                          <Typography
                                                            variant="paragraph"
                                                            color="blue-gray"
                                                            className={`${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            } font-[500] text-[12px] px-0.5`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            {option.submitNumber
                                                              ? option.submitNumber
                                                              : "-"}
                                                          </Typography>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "10%",
                                                          }}
                                                          className="px-1"
                                                        >
                                                          <Typography
                                                            variant="paragraph"
                                                            color="blue-gray"
                                                            className={`font-[500] text-[12px] px-0.5 ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            {option.creationDate !==
                                                            ""
                                                              ? moment(
                                                                  option.creationDate,
                                                                  "YYYY/MM/DD HH:mm:SS"
                                                                ).format(
                                                                  "jYYYY/jMM/jDD HH:mm:SS"
                                                                )
                                                              : ""}
                                                          </Typography>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "15%",
                                                          }}
                                                          className="px-1"
                                                        >
                                                          <Typography
                                                            variant="paragraph"
                                                            color="blue-gray"
                                                            className={`font-[500] text-[12px] px-0.5 ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            {option.subject}
                                                          </Typography>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: `${
                                                              option.attachments
                                                                .length > 0
                                                                ? "7%"
                                                                : "4%"
                                                            }`,
                                                          }}
                                                          className="px-1"
                                                        >
                                                          <div className="container-fluid mx-auto px-0.5">
                                                            <div className="flex flex-row justify-evenly">
                                                              <Button
                                                                size="sm"
                                                                className="p-1 mx-1"
                                                                style={{
                                                                  background:
                                                                    color?.color,
                                                                }}
                                                                onClick={() => {
                                                                  ViewNewDocumentInbox(
                                                                    option
                                                                  );
                                                                }}
                                                                placeholder={
                                                                  undefined
                                                                }
                                                                onPointerEnterCapture={
                                                                  undefined
                                                                }
                                                                onPointerLeaveCapture={
                                                                  undefined
                                                                }
                                                              >
                                                                <VisibilityIcon
                                                                  fontSize="small"
                                                                  className="p-1"
                                                                  onMouseEnter={(
                                                                    event: React.MouseEvent<any>
                                                                  ) =>
                                                                    event.currentTarget.classList.add(
                                                                      "menuIconStyle"
                                                                    )
                                                                  }
                                                                  onMouseLeave={(
                                                                    event: React.MouseEvent<any>
                                                                  ) =>
                                                                    event.currentTarget.classList.remove(
                                                                      "menuIconStyle"
                                                                    )
                                                                  }
                                                                />
                                                              </Button>
                                                              {option
                                                                .attachments
                                                                .length > 0 && (
                                                                <Button
                                                                  onClick={() => {
                                                                    handleOpenAttachment(),
                                                                      setCartableAutomationState(
                                                                        (
                                                                          state
                                                                        ) => ({
                                                                          ...state,
                                                                          attachment:
                                                                            option.attachments,
                                                                        })
                                                                      );
                                                                  }}
                                                                  size="sm"
                                                                  className="p-1 mx-1"
                                                                  style={{
                                                                    background:
                                                                      color?.color,
                                                                    padding:
                                                                      "0.2rem",
                                                                  }}
                                                                  placeholder={
                                                                    undefined
                                                                  }
                                                                  onPointerEnterCapture={
                                                                    undefined
                                                                  }
                                                                  onPointerLeaveCapture={
                                                                    undefined
                                                                  }
                                                                >
                                                                  <AttachFileIcon
                                                                    fontSize="small"
                                                                    className="p-1"
                                                                    onMouseEnter={(
                                                                      event: React.MouseEvent<any>
                                                                    ) =>
                                                                      event.currentTarget.classList.add(
                                                                        "menuIconStyle"
                                                                      )
                                                                    }
                                                                    onMouseLeave={(
                                                                      event: React.MouseEvent<any>
                                                                    ) =>
                                                                      event.currentTarget.classList.remove(
                                                                        "menuIconStyle"
                                                                      )
                                                                    }
                                                                  />
                                                                </Button>
                                                              )}
                                                              <Popover placement="bottom">
                                                                <PopoverHandler>
                                                                  <Button
                                                                    size="sm"
                                                                    className="p-1 mx-1"
                                                                    style={{
                                                                      background:
                                                                        color?.color,
                                                                    }}
                                                                    placeholder={
                                                                      undefined
                                                                    }
                                                                    onPointerEnterCapture={
                                                                      undefined
                                                                    }
                                                                    onPointerLeaveCapture={
                                                                      undefined
                                                                    }
                                                                  >
                                                                    <Tooltip
                                                                      content="اطلاعات تکمیلی"
                                                                      className={
                                                                        themeMode?.stateMode
                                                                          ? "cardDark lightText"
                                                                          : "cardLight darkText"
                                                                      }
                                                                    >
                                                                      <InfoIcon
                                                                        fontSize="small"
                                                                        className="p-1"
                                                                        onMouseEnter={(
                                                                          event: React.MouseEvent<any>
                                                                        ) =>
                                                                          event.currentTarget.classList.add(
                                                                            "menuIconStyle"
                                                                          )
                                                                        }
                                                                        onMouseLeave={(
                                                                          event: React.MouseEvent<any>
                                                                        ) =>
                                                                          event.currentTarget.classList.remove(
                                                                            "menuIconStyle"
                                                                          )
                                                                        }
                                                                      />
                                                                    </Tooltip>
                                                                  </Button>
                                                                </PopoverHandler>
                                                                <PopoverContent
                                                                  className="z-[9999] border-none py-[10px] bg-blue-gray-600 text-white"
                                                                  dir="rtl"
                                                                  placeholder={
                                                                    undefined
                                                                  }
                                                                  onPointerEnterCapture={
                                                                    undefined
                                                                  }
                                                                  onPointerLeaveCapture={
                                                                    undefined
                                                                  }
                                                                >
                                                                  فرستنده :{" "}
                                                                  {option.isImport ==
                                                                  true ? (
                                                                    option.sendersName !=
                                                                      null &&
                                                                    option
                                                                      .sendersName
                                                                      .length >
                                                                      0 &&
                                                                    option.sendersName!.map(
                                                                      (
                                                                        item: CartableAutomationMainReceiversName,
                                                                        num: number
                                                                      ) => {
                                                                        return (
                                                                          <p
                                                                            key={
                                                                              num +
                                                                              "sendersName" +
                                                                              num
                                                                            }
                                                                            dir="rtl"
                                                                          >
                                                                            {
                                                                              item.faName
                                                                            }
                                                                            ,{" "}
                                                                          </p>
                                                                        );
                                                                      }
                                                                    )
                                                                  ) : (
                                                                    <br></br>
                                                                  )}
                                                                  گیرندگان :{" "}
                                                                  {option.mainReceiversName &&
                                                                  option.mainReceiversName !=
                                                                    null &&
                                                                  option
                                                                    .mainReceiversName
                                                                    .length >
                                                                    0 ? (
                                                                    option.mainReceiversName?.map(
                                                                      (
                                                                        item: CartableAutomationMainReceiversName,
                                                                        num: number
                                                                      ) => {
                                                                        return (
                                                                          <p
                                                                            key={
                                                                              num +
                                                                              "mainReceiversName" +
                                                                              num
                                                                            }
                                                                            dir="rtl"
                                                                          >
                                                                            {
                                                                              item.faName
                                                                            }
                                                                            ,{" "}
                                                                          </p>
                                                                        );
                                                                      }
                                                                    )
                                                                  ) : (
                                                                    <br></br>
                                                                  )}
                                                                  محل بایگانی :{" "}
                                                                  {option.archiveDirectoriesString &&
                                                                  option.archiveDirectoriesString !=
                                                                    null &&
                                                                  option
                                                                    .archiveDirectoriesString
                                                                    .length >
                                                                    0 ? (
                                                                    option.archiveDirectoriesString?.map(
                                                                      (
                                                                        item: string,
                                                                        num: number
                                                                      ) => {
                                                                        return (
                                                                          <p
                                                                            key={
                                                                              num +
                                                                              "item"
                                                                            }
                                                                            dir="rtl"
                                                                          >
                                                                            {
                                                                              item
                                                                            }
                                                                            ,{" "}
                                                                          </p>
                                                                        );
                                                                      }
                                                                    )
                                                                  ) : (
                                                                    <br></br>
                                                                  )}
                                                                </PopoverContent>
                                                              </Popover>
                                                            </div>
                                                          </div>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "5%",
                                                          }}
                                                          className="p-1"
                                                        >
                                                          <div className="container-fluid mx-auto p-0.5">
                                                            <div className="flex flex-row justify-evenly">
                                                              <Checkbox
                                                                crossOrigin=""
                                                                color="blue-gray"
                                                                className="mx-1"
                                                                checked={
                                                                  cartableAutomationState.checkedDocumentInbox.indexOf(
                                                                    option
                                                                  ) != -1
                                                                    ? true
                                                                    : false
                                                                }
                                                                onChange={() => {
                                                                  SelectCheckboxInbox(
                                                                    option
                                                                  );
                                                                }}
                                                                onPointerEnterCapture={
                                                                  undefined
                                                                }
                                                                onPointerLeaveCapture={
                                                                  undefined
                                                                }
                                                              />
                                                            </div>
                                                          </div>
                                                        </td>
                                                      </tr>
                                                    );
                                                  }
                                                )}
                                            </tbody>
                                          </table>
                                        ) : (
                                          <TableSkeleton />
                                        )}
                                      </CardBody>

                                      <section className="flex justify-center mb-0 mt-3">
                                        {cartableAutomationState.paginationCount >
                                          1 && (
                                          <Stack
                                            onClick={(e: any) =>
                                              GetInboxListTableByDocTypeId(
                                                e.target.innerText
                                              )
                                            }
                                            spacing={1}
                                          >
                                            <Pagination
                                              hidePrevButton
                                              hideNextButton
                                              count={
                                                cartableAutomationState.paginationCount
                                              }
                                              variant="outlined"
                                              size="small"
                                              shape="rounded"
                                            />
                                          </Stack>
                                        )}
                                      </section>
                                    </CardBody>
                                  </TabPanel>
                                );
                              }
                            )}
                          </TabsBody>
                        </Tabs>
                      )}
                  </TabPanel>
                  <TabPanel className="w-full mx-0 px-1" value="outInbox">
                    <Tabs dir="rtl" value="انجام شده" className="w-full px-2">
                      {loadings.loadingOutInbox == false ? (
                        cartableAutomationState.getOutbox.length > 0 && (
                          <>
                            <TabsHeader
                              className={`${
                                themeMode?.stateMode
                                  ? "contentDark"
                                  : "contentLight"
                              } flex flex-col md:flex-row`}
                              indicatorProps={{
                                style: {
                                  background: color?.color,
                                },
                                className: `shadow !text-gray-900`,
                              }}
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              {cartableAutomationState.getOutbox.map(
                                (
                                  item: CartableAutomationGetOutboxItems,
                                  index: number
                                ) => {
                                  return (
                                    <Tab
                                      key={"getOutbox" + index + "getOutbox"}
                                      value={item.title}
                                      onClick={() => {
                                        setActiveId(item.state),
                                          setSelectedState(item.enTitle),
                                          setActivate(item.title),
                                          setOutboxItem(item.state),
                                          setCartableAutomationState(
                                            (state) => ({
                                              ...state,
                                              checkedDocumentOutbox: [],
                                            })
                                          );
                                      }}
                                      placeholder={undefined}
                                      onPointerEnterCapture={undefined}
                                      onPointerLeaveCapture={undefined}
                                    >
                                      <div
                                        className={`${
                                          themeMode?.stateMode
                                            ? "lightText"
                                            : "darkText"
                                        } flex justify-around text-[13px] font-thin`}
                                        style={{
                                          color: `${
                                            activate == item.title
                                              ? "white"
                                              : ""
                                          }`,
                                        }}
                                      >
                                        {item.title}
                                        <ListItemSuffix
                                          placeholder={undefined}
                                          onPointerEnterCapture={undefined}
                                          onPointerLeaveCapture={undefined}
                                        >
                                          <Chip
                                            value={item.count}
                                            variant="ghost"
                                            size="sm"
                                            style={{
                                              color: ` ${
                                                activate == item.title
                                                  ? "white"
                                                  : color?.color
                                              }`,
                                            }}
                                            className={`${
                                              themeMode?.stateMode
                                                ? "lightText"
                                                : "darkText"
                                            } rounded-full `}
                                          />
                                        </ListItemSuffix>
                                      </div>
                                    </Tab>
                                  );
                                }
                              )}
                            </TabsHeader>
                            <TabsBody
                              className="w-full p-0 m-0"
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              {cartableAutomationState.getOutbox.length > 0 &&
                                cartableAutomationState.getOutbox.map(
                                  (
                                    item: CartableAutomationGetOutboxItems,
                                    index: number
                                  ) => {
                                    return (
                                      <TabPanel
                                        className="px-2"
                                        value={item.title}
                                        key={"getOutbox" + index + "getOutbox"}
                                      >
                                        <CardBody
                                          className="relative rounded-lg overflow-auto p-0"
                                          placeholder={undefined}
                                          onPointerEnterCapture={undefined}
                                          onPointerLeaveCapture={undefined}
                                        >
                                          {item.count != 0 && (
                                            <>
                                              <section className="flex flex-row justify-around items-center">
                                                <div className="w-full md:w-[50%]">
                                                  <TitleComponent>
                                                    {item.title}
                                                  </TitleComponent>
                                                </div>
                                                <div className="w-full md:w-[50%] flex flex-col items-end justify-between md:flex-row md:items-center md:justify-around my-3">
                                                  <div className="w-[100%] flex flex-row justify-end">
                                                    <Tooltip
                                                      content="خروج از کاتابل"
                                                      className={
                                                        themeMode?.stateMode
                                                          ? "cardDark lightText"
                                                          : "cardLight darkText"
                                                      }
                                                    >
                                                      <Button
                                                        onClick={
                                                          ExitDocumentFromCarableOutInbox
                                                        }
                                                        size="sm"
                                                        className="p-1 mx-1"
                                                        style={{
                                                          background:
                                                            color?.color,
                                                        }}
                                                        placeholder={undefined}
                                                        onPointerEnterCapture={
                                                          undefined
                                                        }
                                                        onPointerLeaveCapture={
                                                          undefined
                                                        }
                                                      >
                                                        <LogoutIcon
                                                          fontSize="small"
                                                          className="p-1"
                                                          onMouseEnter={(
                                                            event: React.MouseEvent<any>
                                                          ) =>
                                                            event.currentTarget.classList.add(
                                                              "menuIconStyle"
                                                            )
                                                          }
                                                          onMouseLeave={(
                                                            event: React.MouseEvent<any>
                                                          ) =>
                                                            event.currentTarget.classList.remove(
                                                              "menuIconStyle"
                                                            )
                                                          }
                                                        />
                                                      </Button>
                                                    </Tooltip>
                                                  </div>
                                                </div>
                                              </section>
                                              <CardBody
                                                className=" mx-auto h-[600px] relative rounded-lg overflow-auto p-0 my-3"
                                                placeholder={undefined}
                                                onPointerEnterCapture={
                                                  undefined
                                                }
                                                onPointerLeaveCapture={
                                                  undefined
                                                }
                                              >
                                                {loadings.loadingOutInboxList ==
                                                false ? (
                                                  <table
                                                    dir="rtl"
                                                    className={`${
                                                      themeMode?.stateMode
                                                        ? "tableDark"
                                                        : "tableLight"
                                                    } w-full relative text-center max-h-[500px] `}
                                                  >
                                                    <thead className="sticky border-b-2 z-[9999] top-0 left-0 w-full">
                                                      <tr
                                                        className={
                                                          themeMode?.stateMode
                                                            ? "themeDark"
                                                            : "themeLight"
                                                        }
                                                      >
                                                        <th
                                                          style={{
                                                            borderBottomColor:
                                                              color?.color,
                                                          }}
                                                          className={`${
                                                            themeMode?.stateMode
                                                              ? "themeDark"
                                                              : "themeLight"
                                                          } p-3 sticky top-0 border-b-2 `}
                                                        >
                                                          <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            #
                                                          </Typography>
                                                        </th>
                                                        <th
                                                          style={{
                                                            borderBottomColor:
                                                              color?.color,
                                                          }}
                                                          className={`${
                                                            themeMode?.stateMode
                                                              ? "themeDark"
                                                              : "themeLight"
                                                          } p-3 sticky top-0 border-b-2 `}
                                                        >
                                                          <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            نوع
                                                          </Typography>
                                                        </th>
                                                        <th
                                                          style={{
                                                            borderBottomColor:
                                                              color?.color,
                                                          }}
                                                          className={`${
                                                            themeMode?.stateMode
                                                              ? "themeDark"
                                                              : "themeLight"
                                                          } p-3 sticky top-0 border-b-2 `}
                                                        >
                                                          <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            گیرنده ی ارجاع
                                                          </Typography>
                                                        </th>
                                                        <th
                                                          style={{
                                                            borderBottomColor:
                                                              color?.color,
                                                          }}
                                                          className={`${
                                                            themeMode?.stateMode
                                                              ? "themeDark"
                                                              : "themeLight"
                                                          } p-3 sticky top-0 border-b-2 `}
                                                        >
                                                          <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            شماره
                                                          </Typography>
                                                        </th>
                                                        <th
                                                          style={{
                                                            borderBottomColor:
                                                              color?.color,
                                                          }}
                                                          className={`${
                                                            themeMode?.stateMode
                                                              ? "themeDark"
                                                              : "themeLight"
                                                          } p-3 sticky top-0 border-b-2 `}
                                                        >
                                                          <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            شماره صادره
                                                          </Typography>
                                                        </th>
                                                        <th
                                                          style={{
                                                            borderBottomColor:
                                                              color?.color,
                                                          }}
                                                          className={`${
                                                            themeMode?.stateMode
                                                              ? "themeDark"
                                                              : "themeLight"
                                                          } p-3 sticky top-0 border-b-2 `}
                                                        >
                                                          <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            گیرنده / فرستنده
                                                          </Typography>
                                                        </th>
                                                        <th
                                                          style={{
                                                            borderBottomColor:
                                                              color?.color,
                                                          }}
                                                          className={`${
                                                            themeMode?.stateMode
                                                              ? "themeDark"
                                                              : "themeLight"
                                                          } p-3 sticky top-0 border-b-2 `}
                                                        >
                                                          <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            تاریخ ایجاد
                                                          </Typography>
                                                        </th>
                                                        <th
                                                          style={{
                                                            borderBottomColor:
                                                              color?.color,
                                                          }}
                                                          className={`${
                                                            themeMode?.stateMode
                                                              ? "themeDark"
                                                              : "themeLight"
                                                          } p-3 sticky top-0 border-b-2 `}
                                                        >
                                                          <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            موضوع
                                                          </Typography>
                                                        </th>
                                                        <th
                                                          style={{
                                                            borderBottomColor:
                                                              color?.color,
                                                          }}
                                                          className={`${
                                                            themeMode?.stateMode
                                                              ? "themeDark"
                                                              : "themeLight"
                                                          } p-3 sticky top-0 border-b-2 `}
                                                        >
                                                          <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[700] text-[12px] p-1.5 leading-none ${
                                                              themeMode?.stateMode
                                                                ? "lightText"
                                                                : "darkText"
                                                            }`}
                                                            placeholder={
                                                              undefined
                                                            }
                                                            onPointerEnterCapture={
                                                              undefined
                                                            }
                                                            onPointerLeaveCapture={
                                                              undefined
                                                            }
                                                          >
                                                            عملیات
                                                          </Typography>
                                                        </th>
                                                        <th
                                                          style={{
                                                            borderBottomColor:
                                                              color?.color,
                                                          }}
                                                          className={`${
                                                            themeMode?.stateMode
                                                              ? "themeDark"
                                                              : "themeLight"
                                                          } p-3 sticky top-0 border-b-2 `}
                                                        >
                                                          <Tooltip
                                                            content="انتخاب تمام موارد"
                                                            className={
                                                              themeMode?.stateMode
                                                                ? "cardDark lightText"
                                                                : "cardLight darkText"
                                                            }
                                                          >
                                                            <Checkbox
                                                              onChange={(e) =>
                                                                setCartableAutomationState(
                                                                  (state) => ({
                                                                    ...state,
                                                                    checkedDocumentOutbox:
                                                                      e.target
                                                                        .checked
                                                                        ? [
                                                                            ...cartableAutomationState.getOutboxList!
                                                                              .docList!,
                                                                          ]
                                                                        : [],
                                                                  })
                                                                )
                                                              }
                                                              crossOrigin=""
                                                              color="blue-gray"
                                                              className="mx-1"
                                                              onPointerEnterCapture={
                                                                undefined
                                                              }
                                                              onPointerLeaveCapture={
                                                                undefined
                                                              }
                                                            />
                                                          </Tooltip>
                                                        </th>
                                                      </tr>
                                                    </thead>
                                                    <tbody
                                                      className={`divide-y divide-${
                                                        themeMode?.stateMode
                                                          ? "themeDark"
                                                          : "themeLight"
                                                      }`}
                                                    >
                                                      {cartableAutomationState.getOutboxList!.docList?.map(
                                                        (
                                                          option: GetOutboxListTable,
                                                          index: number
                                                        ) => {
                                                          return (
                                                            <tr
                                                              style={{
                                                                height:
                                                                  "40px !important",
                                                              }}
                                                              key={
                                                                "getOutboxList" +
                                                                option.forwardSourceId +
                                                                "getOutboxList"
                                                              }
                                                              className={`${
                                                                index % 2
                                                                  ? themeMode?.stateMode
                                                                    ? "breadDark"
                                                                    : "breadLight"
                                                                  : themeMode?.stateMode
                                                                  ? "tableDark"
                                                                  : "tableLight"
                                                              }  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}
                                                            >
                                                              <td
                                                                style={{
                                                                  width: "3%",
                                                                }}
                                                                className="px-1"
                                                              >
                                                                <Typography
                                                                  variant="small"
                                                                  color="blue-gray"
                                                                  className={`${
                                                                    themeMode?.stateMode
                                                                      ? "lightText"
                                                                      : "darkText"
                                                                  } font-[700] text-[13px] px-0.5`}
                                                                  placeholder={
                                                                    undefined
                                                                  }
                                                                  onPointerEnterCapture={
                                                                    undefined
                                                                  }
                                                                  onPointerLeaveCapture={
                                                                    undefined
                                                                  }
                                                                >
                                                                  {Number(
                                                                    index + 1
                                                                  )}
                                                                </Typography>
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width: "3%",
                                                                }}
                                                                className="px-3"
                                                              >
                                                                <Typography
                                                                  variant="small"
                                                                  color="blue-gray"
                                                                  className={`font-[500] text-[13px] px-1.5 leading-none ${
                                                                    themeMode?.stateMode
                                                                      ? "lightText"
                                                                      : "darkText"
                                                                  }`}
                                                                  placeholder={
                                                                    undefined
                                                                  }
                                                                  onPointerEnterCapture={
                                                                    undefined
                                                                  }
                                                                  onPointerLeaveCapture={
                                                                    undefined
                                                                  }
                                                                >
                                                                  {
                                                                    option.docTypeTitle
                                                                  }
                                                                </Typography>
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width: "15%",
                                                                }}
                                                                className="px-1"
                                                              >
                                                                <Typography
                                                                  variant="small"
                                                                  color="blue-gray"
                                                                  className={`font-[500] text-[13px] px-0.5 ${
                                                                    themeMode?.stateMode
                                                                      ? "lightText"
                                                                      : "darkText"
                                                                  }`}
                                                                  placeholder={
                                                                    undefined
                                                                  }
                                                                  onPointerEnterCapture={
                                                                    undefined
                                                                  }
                                                                  onPointerLeaveCapture={
                                                                    undefined
                                                                  }
                                                                >
                                                                  {option.forwardReceiver !=
                                                                    null &&
                                                                    option
                                                                      .forwardReceiver
                                                                      .length >
                                                                      0 &&
                                                                    option
                                                                      .forwardReceiver[0]}
                                                                </Typography>
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width: "7%",
                                                                }}
                                                                className="px-1"
                                                              >
                                                                <Typography
                                                                  variant="small"
                                                                  color="blue-gray"
                                                                  className={`font-[500] text-[13px] px-0.5 ${
                                                                    themeMode?.stateMode
                                                                      ? "lightText"
                                                                      : "darkText"
                                                                  }`}
                                                                  placeholder={
                                                                    undefined
                                                                  }
                                                                  onPointerEnterCapture={
                                                                    undefined
                                                                  }
                                                                  onPointerLeaveCapture={
                                                                    undefined
                                                                  }
                                                                >
                                                                  {
                                                                    option.docNumber
                                                                  }
                                                                </Typography>
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width: "10%",
                                                                }}
                                                                className="px-1"
                                                              >
                                                                <Typography
                                                                  variant="small"
                                                                  color="blue-gray"
                                                                  className={`font-[500] text-[13px] px-0.5 ${
                                                                    themeMode?.stateMode
                                                                      ? "lightText"
                                                                      : "darkText"
                                                                  }`}
                                                                  placeholder={
                                                                    undefined
                                                                  }
                                                                  onPointerEnterCapture={
                                                                    undefined
                                                                  }
                                                                  onPointerLeaveCapture={
                                                                    undefined
                                                                  }
                                                                >
                                                                  {option.submitNumber
                                                                    ? option.submitNumber
                                                                    : "-"}
                                                                </Typography>
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width: "15%",
                                                                }}
                                                                className="px-1"
                                                              >
                                                                <Typography
                                                                  variant="small"
                                                                  color="blue-gray"
                                                                  className={`font-[500] text-[13px] px-0.5 ${
                                                                    themeMode?.stateMode
                                                                      ? "lightText"
                                                                      : "darkText"
                                                                  }`}
                                                                  placeholder={
                                                                    undefined
                                                                  }
                                                                  onPointerEnterCapture={
                                                                    undefined
                                                                  }
                                                                  onPointerLeaveCapture={
                                                                    undefined
                                                                  }
                                                                >
                                                                  {option.isImport
                                                                    ? option.sendersName !=
                                                                        null &&
                                                                      option
                                                                        .sendersName[0]
                                                                        .faName
                                                                    : option.mainReceiversName !=
                                                                        null &&
                                                                      option
                                                                        .mainReceiversName[0]
                                                                        .faName}
                                                                </Typography>
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width: "7%",
                                                                }}
                                                                className="px-1"
                                                              >
                                                                <Typography
                                                                  variant="small"
                                                                  color="blue-gray"
                                                                  className={`font-[500] text-[13px] px-0.5 ${
                                                                    themeMode?.stateMode
                                                                      ? "lightText"
                                                                      : "darkText"
                                                                  }`}
                                                                  placeholder={
                                                                    undefined
                                                                  }
                                                                  onPointerEnterCapture={
                                                                    undefined
                                                                  }
                                                                  onPointerLeaveCapture={
                                                                    undefined
                                                                  }
                                                                >
                                                                  {option.creationDate !==
                                                                  ""
                                                                    ? moment(
                                                                        option.creationDate,
                                                                        "YYYY/MM/DD HH:mm:SS"
                                                                      ).format(
                                                                        "jYYYY/jMM/jDD HH:mm:SS"
                                                                      )
                                                                    : ""}
                                                                </Typography>
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width: "20%",
                                                                }}
                                                                className="px-1"
                                                              >
                                                                <Typography
                                                                  variant="small"
                                                                  color="blue-gray"
                                                                  className={`font-[500] text-[13px] px-0.5 ${
                                                                    themeMode?.stateMode
                                                                      ? "lightText"
                                                                      : "darkText"
                                                                  }`}
                                                                  placeholder={
                                                                    undefined
                                                                  }
                                                                  onPointerEnterCapture={
                                                                    undefined
                                                                  }
                                                                  onPointerLeaveCapture={
                                                                    undefined
                                                                  }
                                                                >
                                                                  {
                                                                    option.subject
                                                                  }
                                                                </Typography>
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width: `${
                                                                    option
                                                                      .attachments
                                                                      .length >
                                                                    0
                                                                      ? "7%"
                                                                      : "3%"
                                                                  }`,
                                                                }}
                                                                className="p-1"
                                                              >
                                                                <div className="container-fluid mx-auto px-0.5">
                                                                  <div className="flex flex-row justify-evenly">
                                                                    <Button
                                                                      size="sm"
                                                                      className="p-1 mx-1"
                                                                      style={{
                                                                        background:
                                                                          color?.color,
                                                                      }}
                                                                      onClick={() => {
                                                                        ViewNewDocument(
                                                                          option
                                                                        );
                                                                      }}
                                                                      placeholder={
                                                                        undefined
                                                                      }
                                                                      onPointerEnterCapture={
                                                                        undefined
                                                                      }
                                                                      onPointerLeaveCapture={
                                                                        undefined
                                                                      }
                                                                    >
                                                                      <VisibilityIcon
                                                                        fontSize="small"
                                                                        className="p-1"
                                                                        onMouseEnter={(
                                                                          event: React.MouseEvent<any>
                                                                        ) =>
                                                                          event.currentTarget.classList.add(
                                                                            "menuIconStyle"
                                                                          )
                                                                        }
                                                                        onMouseLeave={(
                                                                          event: React.MouseEvent<any>
                                                                        ) =>
                                                                          event.currentTarget.classList.remove(
                                                                            "menuIconStyle"
                                                                          )
                                                                        }
                                                                      />
                                                                    </Button>
                                                                    {option
                                                                      .attachments
                                                                      .length >
                                                                      0 && (
                                                                      <Button
                                                                        onClick={() => {
                                                                          handleOpenAttachment(),
                                                                            setCartableAutomationState(
                                                                              (
                                                                                state
                                                                              ) => ({
                                                                                ...state,
                                                                                attachment:
                                                                                  option.attachments,
                                                                              })
                                                                            );
                                                                        }}
                                                                        size="sm"
                                                                        className="p-1 mx-1"
                                                                        style={{
                                                                          background:
                                                                            color?.color,
                                                                        }}
                                                                        placeholder={
                                                                          undefined
                                                                        }
                                                                        onPointerEnterCapture={
                                                                          undefined
                                                                        }
                                                                        onPointerLeaveCapture={
                                                                          undefined
                                                                        }
                                                                      >
                                                                        <AttachFileIcon
                                                                          fontSize="small"
                                                                          className="p-1"
                                                                          onMouseEnter={(
                                                                            event: React.MouseEvent<any>
                                                                          ) =>
                                                                            event.currentTarget.classList.add(
                                                                              "menuIconStyle"
                                                                            )
                                                                          }
                                                                          onMouseLeave={(
                                                                            event: React.MouseEvent<any>
                                                                          ) =>
                                                                            event.currentTarget.classList.remove(
                                                                              "menuIconStyle"
                                                                            )
                                                                          }
                                                                        />
                                                                      </Button>
                                                                    )}
                                                                    <Popover placement="bottom">
                                                                      <PopoverHandler>
                                                                        <Button
                                                                          size="sm"
                                                                          className="p-1 mx-1"
                                                                          style={{
                                                                            background:
                                                                              color?.color,
                                                                          }}
                                                                          placeholder={
                                                                            undefined
                                                                          }
                                                                          onPointerEnterCapture={
                                                                            undefined
                                                                          }
                                                                          onPointerLeaveCapture={
                                                                            undefined
                                                                          }
                                                                        >
                                                                          <Tooltip
                                                                            content="اطلاعات تکمیلی"
                                                                            className={
                                                                              themeMode?.stateMode
                                                                                ? "cardDark lightText"
                                                                                : "cardLight darkText"
                                                                            }
                                                                          >
                                                                            <InfoIcon
                                                                              fontSize="small"
                                                                              className="p-1"
                                                                              onMouseEnter={(
                                                                                event: React.MouseEvent<any>
                                                                              ) =>
                                                                                event.currentTarget.classList.add(
                                                                                  "menuIconStyle"
                                                                                )
                                                                              }
                                                                              onMouseLeave={(
                                                                                event: React.MouseEvent<any>
                                                                              ) =>
                                                                                event.currentTarget.classList.remove(
                                                                                  "menuIconStyle"
                                                                                )
                                                                              }
                                                                            />
                                                                          </Tooltip>
                                                                        </Button>
                                                                      </PopoverHandler>
                                                                      <PopoverContent
                                                                        className="z-[9999] border-none py-[10px] bg-blue-gray-600 text-white"
                                                                        dir="rtl"
                                                                        placeholder={
                                                                          undefined
                                                                        }
                                                                        onPointerEnterCapture={
                                                                          undefined
                                                                        }
                                                                        onPointerLeaveCapture={
                                                                          undefined
                                                                        }
                                                                      >
                                                                        فرستنده
                                                                        :{" "}
                                                                        {option.isImport ==
                                                                        true ? (
                                                                          option.sendersName !=
                                                                            null &&
                                                                          option
                                                                            .sendersName
                                                                            .length >
                                                                            0 &&
                                                                          option.sendersName!.map(
                                                                            (
                                                                              item: CartableAutomationMainReceiversName,
                                                                              num: number
                                                                            ) => {
                                                                              return (
                                                                                <p
                                                                                  key={
                                                                                    num +
                                                                                    "sendersName" +
                                                                                    num
                                                                                  }
                                                                                  dir="rtl"
                                                                                >
                                                                                  {
                                                                                    item.faName
                                                                                  }

                                                                                  ,{" "}
                                                                                </p>
                                                                              );
                                                                            }
                                                                          )
                                                                        ) : (
                                                                          <br></br>
                                                                        )}
                                                                        گیرندگان
                                                                        :{" "}
                                                                        {option.mainReceiversName &&
                                                                        option.mainReceiversName !=
                                                                          null &&
                                                                        option
                                                                          .mainReceiversName
                                                                          .length >
                                                                          0
                                                                          ? option.mainReceiversName?.map(
                                                                              (
                                                                                item: CartableAutomationMainReceiversName,
                                                                                num: number
                                                                              ) => {
                                                                                return (
                                                                                  <p
                                                                                    key={
                                                                                      num +
                                                                                      "sendersName" +
                                                                                      num
                                                                                    }
                                                                                    dir="rtl"
                                                                                  >
                                                                                    {
                                                                                      item.faName
                                                                                    }

                                                                                    ,{" "}
                                                                                  </p>
                                                                                );
                                                                              }
                                                                            )
                                                                          : "-"}
                                                                        ارجاع
                                                                        دهنده :{" "}
                                                                        {option.forwardReceiver.map(
                                                                          (
                                                                            item: any,
                                                                            index: number
                                                                          ) => {
                                                                            return (
                                                                              <p
                                                                                dir="rtl"
                                                                                key={
                                                                                  "forwardReceiver" +
                                                                                  index +
                                                                                  "forwardReceiver"
                                                                                }
                                                                                className="w-full"
                                                                              >
                                                                                {
                                                                                  item
                                                                                }

                                                                                ,{" "}
                                                                              </p>
                                                                            );
                                                                          }
                                                                        )}
                                                                      </PopoverContent>
                                                                    </Popover>
                                                                  </div>
                                                                </div>
                                                              </td>

                                                              <td
                                                                style={{
                                                                  width: "4%",
                                                                }}
                                                                className="px-1"
                                                              >
                                                                <div className="container-fluid mx-auto px-0.5">
                                                                  <div className="flex flex-row justify-evenly">
                                                                    <Checkbox
                                                                      crossOrigin=""
                                                                      color="blue-gray"
                                                                      className="mx-1"
                                                                      checked={
                                                                        cartableAutomationState.checkedDocumentOutbox.indexOf(
                                                                          option
                                                                        ) != -1
                                                                          ? true
                                                                          : false
                                                                      }
                                                                      onChange={() => {
                                                                        SelectCheckboxOutbox(
                                                                          option
                                                                        );
                                                                      }}
                                                                      onPointerEnterCapture={
                                                                        undefined
                                                                      }
                                                                      onPointerLeaveCapture={
                                                                        undefined
                                                                      }
                                                                    />
                                                                  </div>
                                                                </div>
                                                              </td>
                                                            </tr>
                                                          );
                                                        }
                                                      )}
                                                    </tbody>
                                                  </table>
                                                ) : (
                                                  <TableSkeleton />
                                                )}
                                              </CardBody>
                                              <section className="flex justify-center mb-0 mt-3">
                                                {cartableAutomationState.outBoxPaginationCount >
                                                  1 && (
                                                  <Stack
                                                    onClick={(e: any) =>
                                                      GetOutboxListTable(
                                                        selectedState,
                                                        e.target.innerText
                                                      )
                                                    }
                                                    spacing={1}
                                                  >
                                                    <Pagination
                                                      hidePrevButton
                                                      hideNextButton
                                                      count={
                                                        cartableAutomationState.outBoxPaginationCount
                                                      }
                                                      variant="outlined"
                                                      size="small"
                                                      shape="rounded"
                                                    />
                                                  </Stack>
                                                )}
                                              </section>
                                            </>
                                          )}
                                        </CardBody>
                                      </TabPanel>
                                    );
                                  }
                                )}
                            </TabsBody>
                          </>
                        )
                      ) : (
                        <InputSkeleton />
                      )}
                    </Tabs>
                  </TabPanel>
                </section>
                <Dialog
                  size="md"
                  className={`absolute top-0 ' ${
                    themeMode?.stateMode ? "cardDark" : "cardLight"
                  }`}
                  open={open}
                  handler={handleOpenAttachment}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <DialogHeader
                    dir="rtl"
                    className={`${
                      themeMode?.stateMode ? "lightText" : "darkText"
                    } text-[25px]`}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    ضمائم ارجاع
                  </DialogHeader>
                  <DialogBody
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <table
                      dir="rtl"
                      className={`${
                        themeMode?.stateMode ? "tableDark" : "tableLight"
                      } w-[95%] max-h-[450px] md:w-[90%] mx-auto relative text-center`}
                    >
                      <thead>
                        <tr
                          className={
                            themeMode?.stateMode ? "themeDark" : "themeLight"
                          }
                        >
                          <th
                            style={{ borderBottomColor: color?.color }}
                            className={`${
                              themeMode?.stateMode ? "themeDark" : "themeLight"
                            } p-3 sticky top-0 border-b-2 `}
                          >
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className={`font-[700] text-[12px] p-1.5 leading-none ${
                                themeMode?.stateMode ? "lightText" : "darkText"
                              }`}
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              #
                            </Typography>
                          </th>
                          <th
                            style={{ borderBottomColor: color?.color }}
                            className={`${
                              themeMode?.stateMode ? "themeDark" : "themeLight"
                            } p-3 sticky top-0 border-b-2 `}
                          >
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className={`font-[700] text-[12px] p-1.5 leading-none ${
                                themeMode?.stateMode ? "lightText" : "darkText"
                              }`}
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              عنوان
                            </Typography>
                          </th>
                          <th
                            style={{ borderBottomColor: color?.color }}
                            className={`${
                              themeMode?.stateMode ? "themeDark" : "themeLight"
                            } p-3 sticky top-0 border-b-2 `}
                          >
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className={`font-[700] text-[12px] p-1.5 leading-none ${
                                themeMode?.stateMode ? "lightText" : "darkText"
                              }`}
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              موضوع
                            </Typography>
                          </th>
                          <th
                            style={{ borderBottomColor: color?.color }}
                            className={`${
                              themeMode?.stateMode ? "themeDark" : "themeLight"
                            } p-3 sticky top-0 border-b-2 `}
                          >
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className={`font-[700] text-[12px] p-1.5 leading-none ${
                                themeMode?.stateMode ? "lightText" : "darkText"
                              }`}
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              عملیات
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        className={`divide-y divide-${
                          themeMode?.stateMode ? "themeDark" : "themeLight"
                        }`}
                      >
                        {cartableAutomationState.attachment?.map(
                          (item: AttachmentsModel, index: number) => {
                            return (
                              <tr
                                key={index + "attachment"}
                                className={`${
                                  index % 2
                                    ? themeMode?.stateMode
                                      ? "breadDark"
                                      : "breadLight"
                                    : themeMode?.stateMode
                                    ? "tableDark"
                                    : "tableLight"
                                }  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}
                              >
                                <td style={{ width: "3%" }} className="p-1">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-center text-[13px] p-0.5 ${
                                      themeMode?.stateMode
                                        ? "lightText"
                                        : "darkText"
                                    }`}
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    {Number(index + 1)}
                                  </Typography>
                                </td>
                                <td style={{ width: "47%" }} className="p-1">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[500] text-center text-[13px] p-0.5 ${
                                      themeMode?.stateMode
                                        ? "lightText"
                                        : "darkText"
                                    }`}
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    {item.attachmentTitle ?? "-"}
                                  </Typography>
                                </td>
                                <td style={{ width: "47%" }} className="p-1">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[500] text-center text-[13px] p-0.5  ${
                                      themeMode?.stateMode
                                        ? "lightText"
                                        : "darkText"
                                    }`}
                                    placeholder={undefined}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                  >
                                    {item.attachmentDesc ?? "-"}
                                  </Typography>
                                </td>
                                <td style={{ width: "3%" }} className="p-1">
                                  <div className="container-fluid mx-auto p-0.5">
                                    <div className="flex flex-row justify-evenly">
                                      {VideoTypes.includes(item.fileType) ? (
                                        <Button
                                          size="sm"
                                          className="p-1 mx-1"
                                          style={{ background: color?.color }}
                                          onClick={() => {
                                            (videoRef.current = item),
                                              handleViewVideoAttachment();
                                          }}
                                          placeholder={undefined}
                                          onPointerEnterCapture={undefined}
                                          onPointerLeaveCapture={undefined}
                                        >
                                          <PlayArrowIcon
                                            fontSize="small"
                                            className="p-1"
                                            onMouseEnter={(
                                              event: React.MouseEvent<any>
                                            ) =>
                                              event.currentTarget.classList.add(
                                                "menuIconStyle"
                                              )
                                            }
                                            onMouseLeave={(
                                              event: React.MouseEvent<any>
                                            ) =>
                                              event.currentTarget.classList.remove(
                                                "menuIconStyle"
                                              )
                                            }
                                          />
                                        </Button>
                                      ) : (
                                        <Button
                                          size="sm"
                                          className="p-1 mx-1"
                                          style={{ background: color?.color }}
                                          onClick={() => {
                                            ViewAttachment(item);
                                          }}
                                          placeholder={undefined}
                                          onPointerEnterCapture={undefined}
                                          onPointerLeaveCapture={undefined}
                                        >
                                          <VisibilityIcon
                                            fontSize="small"
                                            className="p-1"
                                            onMouseEnter={(
                                              event: React.MouseEvent<any>
                                            ) =>
                                              event.currentTarget.classList.add(
                                                "menuIconStyle"
                                              )
                                            }
                                            onMouseLeave={(
                                              event: React.MouseEvent<any>
                                            ) =>
                                              event.currentTarget.classList.remove(
                                                "menuIconStyle"
                                              )
                                            }
                                          />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </DialogBody>
                  <DialogFooter
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <ButtonComponent onClick={handleOpenAttachment}>
                      بستن
                    </ButtonComponent>
                  </DialogFooter>
                </Dialog>
                <Dialog
                  className={` ${
                    themeMode?.stateMode ? "cardDark" : "cardLight"
                  } overflow-x-auto m-auto`}
                  size="xxl"
                  open={openAttachment}
                  handler={handleViewAttachment}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <figure className="h-full w-full">
                    {loadings.loadingIframe == false ? (
                      cartableAutomationState.file != null &&
                      cartableAutomationState.file!.fileType == "image/jpg" ? (
                        <Image
                          className="w-full h-full"
                          src={cartableAutomationState.attachmentImg}
                          alt="view-attachment"
                          width={100}
                          height={100}
                        />
                      ) : (
                        <section className="w-full h-fit p-2">
                          <div style={{ height: "100vh", width: "100%" }}>
                            <AcsPdfViewer
                              base64={cartableAutomationState.attachmentImg}
                            />
                          </div>
                        </section>
                      )
                    ) : (
                      <IframeSkeleton />
                    )}
                  </figure>
                  <DialogFooter
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <ButtonComponent onClick={handleViewAttachment}>
                      بستن
                    </ButtonComponent>
                  </DialogFooter>
                </Dialog>
                <Dialog
                  className={`${
                    themeMode?.stateMode ? "cardDark" : "cardLight"
                  } overflow-x-auto m-auto flex justify-center items-center`}
                  size="xxl"
                  open={openVideo}
                  handler={handleViewVideoAttachment}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <video
                    width="960"
                    height="640"
                    autoPlay={true}
                    controls={true}
                  >
                    <source
                      src={`${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getappendixvideostream?Id=${videoRef.current?.attachmentId}&AttachmentType=${videoRef.current?.attachmentTypeId}`}
                      type="video/mp4"
                    />
                  </video>
                  <DialogFooter
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <ButtonComponent onClick={handleViewVideoAttachment}>
                      بستن
                    </ButtonComponent>
                  </DialogFooter>
                </Dialog>
              </CardBody>
            </TabsBody>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default CartableSearch;
