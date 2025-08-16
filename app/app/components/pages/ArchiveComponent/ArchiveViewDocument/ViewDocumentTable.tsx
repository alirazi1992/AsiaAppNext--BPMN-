"use client";
import useAxios from "@/app/hooks/useAxios";
import useStore from "@/app/hooks/useStore";
import { CategoriesProps } from "@/app/models/Archive/ViewDocumentFormModels";
import {
  Response,
  TransferDocument,
  ViewDocumentDownloadFile,
  ViewDocumentListTableModel,
  viewDocumentTableDataModel,
} from "@/app/models/Archive/ViewDocumentListTable";
import ArchiveJobFilterStore from "@/app/zustandData/ArchiveJobFilter.zustand";
import colorStore from "@/app/zustandData/color.zustand";
import themeStore from "@/app/zustandData/theme.zustand";
import {
  Button,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { AxiosResponse } from "axios";
import Image from "next/image";
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import Select, { ActionMeta, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";
import {
  CustomerOptionProps,
  CustomerProps,
  JobOptionProps,
  JobsProps,
  WorkOrderOptionProps,
  WorkOrderProps,
} from "../../../../models/Archive/ViewDocumentFormModels";
// ***icons
import b64toBlob from "@/app/Utils/Automation/convertImageToBlob";
import AcsPdfViewer from "@/app/components/pdfViewer/AcsPdfViewer";
import ButtonComponent from "@/app/components/shared/ButtonComponent";
import IframeSkeleton from "@/app/components/shared/IframeSkeleton";
import Loading from "@/app/components/shared/loadingResponse";
import activeStore from "@/app/zustandData/activate.zustand";
import { yupResolver } from "@hookform/resolvers/yup";
import CloudDownload from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkIcon from "@mui/icons-material/Work";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import moment from "jalali-moment";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useArchiveDocumentInfo } from "./ArchiveDocumentInfoContext";
import { createKeyForSwrRequest, isAllowedImageType } from "./utilityFunctions";
import useSWR, { mutate } from "swr";
import serverCall from "@/app/Utils/serverCall";
import EditItemButton from "./EditItemButton";

const ViewDocumentTable = ({ searchTerm }: any) => {
  const { AxiosRequest } = useAxios();

  const themeMode = useStore(themeStore, (state) => state);
  const themeIsNotActive = !themeMode || themeMode?.stateMode;
  const color = useStore(colorStore, (state) => state);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const ArchiveFilterStore = ArchiveJobFilterStore.getState();
  const [getList, setGetList] = useState(ArchiveJobFilterStore((state) => state.ViewDocumentList));
  const { activeTabId, setActiveTabId } = useArchiveDocumentInfo();
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  const [openTransfer, setOpenTransfer] = useState<boolean>(false);
  const handleOpenTransfer = () => setOpenTransfer(!openTransfer);
  const handleViewVideoAttachment = () => setOpenVideo(!openVideo);
  const [searchBased, setSearchBased] = useState<string>("Customer");
  const [selectStates, setSelectStates] = useState<{
    orgs: any;
    jobs: any;
    workOrders: any;
    orgId: number;
    jobId: number;
    workOrderId: number;
  }>({
    orgs: [],
    jobs: [],
    workOrders: [],
    orgId: 0,
    jobId: 0,
    workOrderId: 0,
  });

  const { data, isLoading } = useSWR<ServerResponse<CategoriesProps[]>, Error, string>(
    "categories",
    () => serverCall("archive/Manage/Categories"),
    {
      revalidateOnFocus: false, // don't revalidate on window focus
      revalidateOnReconnect: false, // don't revalidate when reconnecting
      refreshInterval: 0, // don't poll the server
      dedupingInterval: 1000 * 60 * 60 * 24, // cache for 24 hours
    }
  );

  useEffect(() => {
    // update list if ArchiveFilterStore (provider) changes
    // ability to update table from other components
    setGetList(ArchiveFilterStore?.ViewDocumentList);
  }, [ArchiveFilterStore.ViewDocumentList]);

  let loading: {
    loadingResponse: boolean;
    loadingTable: boolean;
    loadingIframe: boolean;
  } = {
    loadingResponse: false,
    loadingTable: false,
    loadingIframe: false,
  };
  const [loadings, setLoadings] = useState(loading);
  let initialTableState = {
    activateTab: 1,
    categories: [],
    jobId: undefined,
    workOrderId: undefined,
    img: "",
    file: {
      file: "",
      fileName: "",
      fileType: "",
    },
  };
  const { handleSubmit, setValue, getValues, formState, reset, watch } = useForm<TransferDocument>({
    defaultValues: {
      Transfer: {
        itemId: 0,
        archiveJobId: 0,
        archiveWorkOrderId: 0,
        transferJobId: 0,
        transferWorkOrderId: 0,
      },
    },
    mode: "all",
    resolver: yupResolver(schema),
  });
  const [viewDocumentTableState, setViewDocumentTableState] = useState<viewDocumentTableDataModel>(initialTableState);
  async function GetCategories() {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/Categories`;
    let method = "get";
    let data = {};
    let resCategories: AxiosResponse<Response<CategoriesProps[]>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    if (resCategories.data.data != null && resCategories.data.status) {
      setViewDocumentTableState((state) => ({
        ...state,
        categories: resCategories?.data.data.map((item: CategoriesProps, index: number) => {
          return {
            id: item.id,
            title: item.title,
            faTitle: item.faTitle,
          };
        }),
      }));
    }
    const firstTabIndex = resCategories?.data.data[0].id;
    setActiveTabId(firstTabIndex);
    setValue("Transfer.categoryId", firstTabIndex);
  }

  useEffect(() => {
    GetCategories();
  }, []);

  const errors = formState.errors;
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
  let videoRef = useRef(null) as MutableRefObject<ViewDocumentListTableModel | null>;
  const DeleteItemTable = async (
    isFile: boolean,
    docHeapIdId: number,
    jobId: number,
    workOrderId: number,
    id: number,
    target: Element
  ) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/delete`;
    let method = "delete";
    let data = { docId: id, workOrderId: workOrderId, jobId: jobId };
    Swal.fire({
      background: themeIsNotActive ? "#22303c" : "#eee3d7",
      color: themeIsNotActive ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Delete Document!",
      text: "Are you sure you want to delete this document?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }));
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }));
          if (response.data.data == true && response.data.status == true) {
            let index = getList.indexOf(getList.find((p) => p.id == id)!);
            if (index !== -1) {
              let Array = [...getList];
              Array.splice(index, 1);
              setGetList([...Array]);
            }
          } else {
            Swal.fire({
              background: themeIsNotActive ? "#22303c" : "#eee3d7",
              color: themeIsNotActive ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Delete Document!",
              text: response.data.message,
              icon: response.data.status == true ? "warning" : "error",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
            });
          }
        }
      }
    });
  };

  const ViewFileDocument = async (id: number) => {
    setLoadings((state) => ({ ...state, loadingIframe: true }));
    let url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/download?Id=${id}&WorkOrderId=${
      ArchiveFilterStore.WorkOrderId ?? 0
    }&JobId=${ArchiveFilterStore.JobId}&AttachmentType=7`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<ViewDocumentDownloadFile>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    if (response) {
      setLoadings((state) => ({ ...state, loadingIframe: false }));
      if (response.data.data != null && response.data.status == true) {
        let blob = b64toBlob({
          b64Data: response.data.data.file.substring(response.data.data.file.lastIndexOf(",") + 1),
          contentType: response.data.data.fileType,
          sliceSize: 512,
        });
        let blobUrl = URL.createObjectURL(blob);
        setViewDocumentTableState((state) => ({
          ...state,
          img: blobUrl,
          file: {
            fileType: response.data.data.fileType,
            fileName: response.data.data.fileName,
            file: blobUrl,
          },
        }));
        handleOpen();
      } else {
        Swal.fire({
          background: themeIsNotActive ? "#22303c" : "#eee3d7",
          color: themeIsNotActive ? "white" : "#463b2f",
          allowOutsideClick: false,
          title: "View Document!",
          text: response.data.message,
          icon: response.data.status == false ? "error" : "warning",
          confirmButtonColor: "#22c55e",
          confirmButtonText: "OK!",
        });
      }
    }
  };

  const DownLoadFileDocument = async (option: any) => {
    Swal.fire({
      background: themeIsNotActive ? "#22303c" : "#eee3d7",
      color: themeIsNotActive ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Download Document!",
      text: "Are you sure you want to download this document?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, download it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }));
        let url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/download?Id=${option.id}&WorkOrderId=${
          ArchiveFilterStore.WorkOrderId ?? 0
        }&JobId=${ArchiveFilterStore.JobId}&AttachmentType=7`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<ViewDocumentDownloadFile>> = await AxiosRequest({
          url,
          method,
          data,
          credentials: true,
        });
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }));
          if (response.data.data != null && response.data.status == true) {
            const base64String = `data:${response.data.data.fileType};base64,${response.data.data.file}`;
            setViewDocumentTableState((state) => ({
              ...state,
              file: {
                file: base64String,
                fileName: response.data.data.fileName,
                fileType: response.data.data.fileType,
              },
            }));
            if (response.data.data != null && response.data.status) {
              let blob = b64toBlob({
                b64Data: response.data.data.file.substring(response.data.data.file.lastIndexOf(",") + 1),
                contentType: response.data.data.fileType,
                sliceSize: 512,
              });
              let blobUrl = URL.createObjectURL(blob);
              var fileDownload = require("js-file-download");
              fileDownload(blob, response.data.data.fileName);
            }
          } else {
            Swal.fire({
              background: themeIsNotActive ? "#22303c" : "#eee3d7",
              color: themeIsNotActive ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Download Document!",
              text: response.data.message,
              icon: response.data.status && response.data.data == null ? "warning" : "error",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
            });
          }
        }
      }
    });
  };

  const OnSubmit = async () => {
    Swal.fire({
      background: themeIsNotActive ? "#22303c" : "#eee3d7",
      color: themeIsNotActive ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Transfer Document!",
      text: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let url: string;
        let method: string = "post";
        let data: any;
        setLoadings((state) => ({ ...state, loadingResponse: true }));
        if (getValues("Transfer.archiveWorkOrderId") != 0) {
          if (getValues("Transfer.transferWorkOrderId") != 0) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/TransferWorkOrderToWorkOrder`;
            data = {
              archiveId: getValues("Transfer.itemId"),
              workOrderId: getValues("Transfer.transferWorkOrderId"),
              categoryId: getValues("Transfer.categoryId"),
            };
          } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/TransferWorkOrderToJob`;
            data = {
              archiveId: getValues("Transfer.itemId"),
              jobId: getValues("Transfer.transferJobId"),
              categoryId: getValues("Transfer.categoryId"),
            };
          }
        } else {
          if (getValues("Transfer.transferWorkOrderId") != 0) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/TransferJobToWorkorder`;
            data = {
              archiveId: getValues("Transfer.itemId"),
              workOrderId: getValues("Transfer.transferWorkOrderId"),
              categoryId: getValues("Transfer.categoryId"),
            };
          } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/TransferJobToJob`;
            data = {
              archiveId: getValues("Transfer.itemId"),
              jobId: getValues("Transfer.transferJobId"),
              categoryId: getValues("Transfer.categoryId"),
            };
          }
        }
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }));
          if (response.data.status && response.data.data) {
            let newItem = getList.filter((item) => item.id !== getValues("Transfer.itemId"));
            setGetList([...newItem]);
            handleOpenTransfer();

            //================================UPDATE TABLE=============================================
            const requestKey = createKeyForSwrRequest(selectStates.jobId, selectStates.workOrderId);
            const response = await mutate(
              requestKey,
              serverCall<ViewDocumentListTableModel[]>(requestKey, {
                method: "GET",
                withCredentials: true,
              }),
              true
            );
            if (response) {
              // update ArchiveJobFilterStore with new Data
              ArchiveJobFilterStore.setState((state) => ({
                ...state,
                ViewDocumentList: response.data.map((item: ViewDocumentListTableModel) => {
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
            }
            //=============================
            reset();
          } else {
            Swal.fire({
              background: themeIsNotActive ? "#22303c" : "#eee3d7",
              color: themeIsNotActive ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Transfer Document!",
              text: response.data.message,
              icon: response.data.status ? "warning" : "error",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
            });
            handleOpenTransfer();
            reset();
          }
        }
      }
    });
  };
  let SelectJobsRef = useRef() as any;
  let SelectCustomerRef = useRef() as any;
  let SelectWorkOrderRef = useRef() as any;
  let customerTimeOut: any;
  let jobTimeOut: any;
  const filterSearchCustomers = async (searchinputValue: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/searchCustomers?searchkey=${searchinputValue}`;
    let method = "get";
    let data = {};
    if (searchinputValue && searchinputValue != null && searchinputValue.trim() != "") {
      let res: AxiosResponse<Response<CustomerProps[]>> =
        searchinputValue != "" &&
        searchinputValue != null &&
        (await AxiosRequest({ url, method, data, credentials: true }));
      let options: CustomerOptionProps[] =
        res.data.data != null
          ? res.data.data?.map((item: CustomerProps, index: number) => {
              return {
                value: item.id,
                label: item.faName + ` _ ` + item.nationalCode,
                name: item.name,
                faName: item.faName,
                nationalCode: item.nationalCode,
                id: item.id,
              };
            })
          : [];
      return options.filter((i: CustomerOptionProps) => i.label.toLowerCase().includes(searchinputValue.toLowerCase()));
    } else {
      return [];
    }
  };
  const loadSearchedCustomerOptions = (
    searchinputValue: string,
    callback: (options: CustomerOptionProps[]) => void
  ) => {
    clearTimeout(customerTimeOut);
    customerTimeOut = setTimeout(async () => {
      callback(await filterSearchCustomers(searchinputValue));
    }, 1000);
  };

  const filterGetJobs = useCallback(async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetJobs?orgId=${selectStates.orgId}`;
    let method = "get";
    let data = {};
    let resLoadJobs: AxiosResponse<Response<JobsProps[]>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    if (resLoadJobs.data.data != null && resLoadJobs.data.data.length > 0 && resLoadJobs.data.status == true) {
      setSelectStates((state) => ({
        ...state,
        jobs: resLoadJobs.data.data.map((item: JobsProps, index: number) => {
          return {
            value: item.id,
            label: item.isActive ? item.faTitle : "غیر فعال - " + item.faTitle,
            organizationId: item.organizationId,
            createDate: item.createDate,
            subJob: item.subJob,
            relatedJob: item.relatedJob,
            faTitle: item.faTitle,
            title: item.title,
            isActive: item.isActive,
          };
        }),
      }));
    }
  }, [selectStates.orgId]);

  const filterGetWorkOrder = useCallback(async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetWorkOrders?jobId=${selectStates.jobId}`;
    let method = "get";
    let data = {};
    let resLoadWorkOrder: AxiosResponse<Response<WorkOrderProps[]>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    if (resLoadWorkOrder && resLoadWorkOrder.data.status == true) {
      setSelectStates((state) => ({
        ...state,
        workOrders:
          resLoadWorkOrder.data.data && resLoadWorkOrder.data.data.length > 0
            ? resLoadWorkOrder.data.data.map((item: WorkOrderProps) => {
                return {
                  value: item.id,
                  label: item.faTitle,
                  createDate: item.createDate,
                  faTitle: item.faTitle,
                  jobId: item.jobId,
                  title: item.title,
                };
              })
            : [],
      }));
    }
  }, [selectStates.jobId]);
  // **********search Jobs
  const filterSearchJobs = async (searchinputValue: string) => {
    setSelectStates((state) => ({ ...state, jobs: [], workOrders: [] }));
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/SearchJobs?searchKey=${searchinputValue}`;
    let method = "get";
    let data = {};
    if (searchinputValue && searchinputValue != null && searchinputValue.trim() != "") {
      let resJobs: AxiosResponse<Response<JobsProps[]>> = await AxiosRequest({ url, method, data, credentials: true });
      let options: JobOptionProps[] = resJobs.data.data.map((item: JobsProps, index: number) => {
        return {
          value: item.id,
          label: item.isActive ? item.faTitle : "غیر فعال - " + item.faTitle,
          organizationId: item.organizationId,
          createDate: item.createDate,
          subJob: item.subJob,
          relatedJob: item.relatedJob,
          faTitle: item.faTitle,
          title: item.title,
          isActive: item.isActive,
        };
      });
      return options.filter((i: JobOptionProps) => i.label.toLowerCase().includes(searchinputValue.toLowerCase()));
    } else {
      return [];
    }
  };
  const loadSearchedJobsOptions = (searchinputValue: string, callback: (options: JobOptionProps[]) => void) => {
    clearTimeout(jobTimeOut);
    jobTimeOut = setTimeout(async () => {
      callback(await filterSearchJobs(searchinputValue));
    }, 1000);
  };

  const filterGetOrganizaion = useCallback(async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/searchorganizations?jobId=${selectStates.jobId}`;
    let method = "get";
    let data = {};
    let resLoadOrganizaton: AxiosResponse<Response<CustomerProps>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    setSelectStates((state) => ({
      ...state,
      orgs: resLoadOrganizaton.data.data
        ? {
            value: resLoadOrganizaton.data.data.id,
            label: resLoadOrganizaton.data.data.faName + "ـ" + resLoadOrganizaton.data.data.nationalCode,
            nationalCode: resLoadOrganizaton.data.data.nationalCode,
            name: resLoadOrganizaton.data.data.name,
            faName: resLoadOrganizaton.data.data.faName,
            id: resLoadOrganizaton.data.data.id,
          }
        : undefined,
    }));
  }, [selectStates.jobId]);

  useEffect(() => {
    selectStates.jobId && selectStates.jobId != null
      ? (searchBased == "Customer" ? filterGetWorkOrder() : filterGetOrganizaion(), filterGetWorkOrder())
      : null;
  }, [selectStates.jobId, filterGetOrganizaion, filterGetWorkOrder, searchBased, selectStates.workOrderId]);

  useEffect(() => {
    if (typeof window !== "undefined" && initialTableState.file.file && initialTableState.file.file != "") {
      var fileDownload = require("js-file-download");
      fileDownload(initialTableState.file.file, initialTableState.file.fileName);
    }
  }, [initialTableState.file]);

  useEffect(() => {
    selectStates.orgId && selectStates.orgId != null ? filterGetJobs() : null;
  }, [selectStates.orgId, filterGetJobs]);

  const filteredData = getList?.filter((row: any) => {
    if (!searchTerm.trim()) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      row.name?.toLowerCase().includes(lowerSearch) ||
      row.title?.toLowerCase().includes(lowerSearch) ||
      row.extraInfo?.toLowerCase()?.includes(lowerSearch)
    );
  });

  if (viewDocumentTableState.categories) {
    return (
      <>
        {loadings.loadingResponse == true && <Loading />}
        <CardBody
          className="w-[98%] h-full md:w-[96%] mx-auto relative rounded-lg overflow-auto p-0"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Tabs dir="rtl" value={activeTabId} className=" mb-3 h-5/6 overflow-auto">
            {viewDocumentTableState.categories.length != 0 && (
              <TabsHeader
                className={` ${
                  themeIsNotActive ? "contentDark" : "contentLight"
                } z-[0] flex flex-col md:flex-row text-white`}
                indicatorProps={{
                  style: {
                    background: color?.color,
                  },
                  className: "shadow text-white",
                }}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {viewDocumentTableState.categories?.map((item: CategoriesProps, index: number) => {
                  return (
                    <Tab
                      onClick={() => setActiveTabId(item.id)}
                      key={"viewDocumentTableState" + index}
                      value={item.id}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      <Typography
                        variant="h6"
                        style={{ color: `${activeTabId == item.id ? "white" : ""}` }}
                        className={`${
                          themeIsNotActive ? "lightText" : "darkText"
                        } text-[13px] font-[700] whitespace-nowrap`}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {item.faTitle}
                      </Typography>
                    </Tab>
                  );
                })}
              </TabsHeader>
            )}
            <TabsBody
              className="w-full my-3 relative"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {viewDocumentTableState.categories?.map((item: CategoriesProps, i: number) => {
                return (
                  <TabPanel key={"ITEM" + i} value={item.id} className="overflow-auto relative h-full">
                    <CardBody
                      className="h-full relative rounded-lg overflow-auto p-0"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      <table
                        dir="rtl"
                        className={`${
                          themeIsNotActive ? "tableDark" : "tableLight"
                        } w-full relative text-center max-h-[280px]`}
                      >
                        <thead>
                          <tr className={themeIsNotActive ? "themeDark" : "themeLight"}>
                            <th
                              style={{ borderBottomColor: color?.color }}
                              className={`${
                                themeIsNotActive ? "themeDark" : "themeLight"
                              } p-3 sticky top-0 border-b-2 `}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[500] p-1.5 leading-none opacity-70 `}
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
                                themeIsNotActive ? "themeDark" : "themeLight"
                              } p-3 sticky top-0 border-b-2 `}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[500] p-1.5 leading-none opacity-70 ${
                                  themeIsNotActive ? "lightText" : "darkText"
                                }`}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                نام
                              </Typography>
                            </th>
                            <th
                              style={{ borderBottomColor: color?.color }}
                              className={`${
                                themeIsNotActive ? "themeDark" : "themeLight"
                              } p-3 sticky top-0 border-b-2 `}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[500] p-1.5 leading-none opacity-70 ${
                                  themeIsNotActive ? "lightText" : "darkText"
                                }`}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                عنوان / توضیحات
                              </Typography>
                            </th>
                            <th
                              style={{ borderBottomColor: color?.color }}
                              className={`${
                                themeIsNotActive ? "themeDark" : "themeLight"
                              } p-3 sticky top-0 border-b-2 `}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[500] p-1.5 leading-none opacity-70 ${
                                  themeIsNotActive ? "lightText" : "darkText"
                                }`}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {item.id == 7 ? "شماره صورت حساب" : "اطلاعات تکمیلی"}
                              </Typography>
                            </th>
                            <th
                              style={{ borderBottomColor: color?.color }}
                              className={`${
                                themeIsNotActive ? "themeDark" : "themeLight"
                              } p-3 sticky top-0 border-b-2 `}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[500] p-1.5 leading-none opacity-70 ${
                                  themeIsNotActive ? "lightText" : "darkText"
                                }`}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                آرشیو کننده
                              </Typography>
                            </th>
                            <th
                              style={{ borderBottomColor: color?.color }}
                              className={`${
                                themeIsNotActive ? "themeDark" : "themeLight"
                              } p-3 sticky top-0 border-b-2 `}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[500] p-1.5 leading-none opacity-70 ${
                                  themeIsNotActive ? "lightText" : "darkText"
                                }`}
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                تاریخ
                              </Typography>
                            </th>
                            <th
                              style={{ borderBottomColor: color?.color }}
                              className={`${
                                themeIsNotActive ? "themeDark" : "themeLight"
                              } p-3 sticky top-0 border-b-2 `}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[500] p-1.5 leading-none opacity-70 ${
                                  themeIsNotActive ? "lightText" : "darkText"
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
                        <tbody className={`divide-y divide-${themeIsNotActive ? "themeDark" : "themeLight"}`}>
                          {filteredData
                            ?.filter(
                              (option: ViewDocumentListTableModel) =>
                                parseInt(option.archiveCategoryId) == item.id && option
                            )
                            .map((option: ViewDocumentListTableModel, num: number) => {
                              return (
                                <tr
                                  key={"OPTION" + num}
                                  id={option.id.toString()}
                                  className={`${
                                    num % 2
                                      ? themeIsNotActive
                                        ? "braedDark"
                                        : "breadLight"
                                      : themeIsNotActive
                                      ? "tableDark"
                                      : "tableLight"
                                  }  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}
                                >
                                  <td style={{ width: "3%" }} className="p-1">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className={`${themeIsNotActive ? "lightText" : "darkText"} font-[700] p-0.5`}
                                      placeholder={undefined}
                                      onPointerEnterCapture={undefined}
                                      onPointerLeaveCapture={undefined}
                                    >
                                      {Number(num) + Number(1)}
                                    </Typography>
                                  </td>
                                  <td style={{ width: "15%" }} className="p-1">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className={`font-normal p-0.5 ${themeIsNotActive ? "lightText" : "darkText"}`}
                                      placeholder={undefined}
                                      onPointerEnterCapture={undefined}
                                      onPointerLeaveCapture={undefined}
                                    >
                                      {option.name}
                                    </Typography>
                                  </td>
                                  <td style={{ width: "30%" }} className="p-1">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className={`font-normal p-0.5 ${themeIsNotActive ? "lightText" : "darkText"} `}
                                      placeholder={undefined}
                                      onPointerEnterCapture={undefined}
                                      onPointerLeaveCapture={undefined}
                                    >
                                      {option.title}
                                    </Typography>
                                  </td>
                                  <td style={{ width: "30%" }} className="p-1">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className={`font-normal p-0.5 ${themeIsNotActive ? "lightText" : "darkText"} `}
                                      placeholder={undefined}
                                      onPointerEnterCapture={undefined}
                                      onPointerLeaveCapture={undefined}
                                    >
                                      {option.extraInfo !== null ? option.extraInfo : "-"}
                                    </Typography>
                                  </td>
                                  <td style={{ width: "30%" }} className="p-1">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className={`font-normal p-0.5 ${themeIsNotActive ? "lightText" : "darkText"}`}
                                      placeholder={undefined}
                                      onPointerEnterCapture={undefined}
                                      onPointerLeaveCapture={undefined}
                                    >
                                      {option.attacher}
                                    </Typography>
                                  </td>
                                  <td style={{ width: "10%" }} className="p-1">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className={`font-normal p-0.5 ${themeIsNotActive ? "lightText" : "darkText"}`}
                                      placeholder={undefined}
                                      onPointerEnterCapture={undefined}
                                      onPointerLeaveCapture={undefined}
                                    >
                                      {option.createDate &&
                                        moment(option.createDate, "YYYY-MM-DD HH:mm:ss")
                                          .locale("fa")
                                          .format("jYYYY/jMM/jDD HH:mm:ss")}
                                    </Typography>
                                  </td>
                                  <td style={{ width: "7%" }} className="p-1">
                                    <div className="container-fluid mx-auto p-0.5">
                                      <div className="flex flex-row justify-evenly">
                                        {option.type == "application/pdf" || isAllowedImageType(option.type) ? (
                                          <Button
                                            onClick={() => ViewFileDocument(option.id)}
                                            size="sm"
                                            className="p-1 mx-1"
                                            style={{ background: color?.color }}
                                            placeholder={undefined}
                                            onPointerEnterCapture={undefined}
                                            onPointerLeaveCapture={undefined}
                                          >
                                            <VisibilityIcon
                                              fontSize="small"
                                              className="p-1"
                                              onMouseEnter={(event: React.MouseEvent<any>) =>
                                                event.currentTarget.classList.add("menuIconStyle")
                                              }
                                              onMouseLeave={(event: React.MouseEvent<any>) =>
                                                event.currentTarget.classList.remove("menuIconStyle")
                                              }
                                            />
                                          </Button>
                                        ) : (
                                          option?.isFile == false && (
                                            <Button
                                              onClick={() => {
                                                activeStore.setState((state) => ({
                                                  ...state,
                                                  activeSubLink: "New Document",
                                                })),
                                                  window.open(
                                                    `/Home/NewDocument?docheapid=${option.docHeapId}&doctypeid=${option.type}`
                                                  );
                                              }}
                                              size="sm"
                                              className="p-1 mx-1"
                                              style={{ background: color?.color }}
                                              placeholder={undefined}
                                              onPointerEnterCapture={undefined}
                                              onPointerLeaveCapture={undefined}
                                            >
                                              <VisibilityIcon
                                                fontSize="small"
                                                className="p-1"
                                                onMouseEnter={(event: React.MouseEvent<any>) =>
                                                  event.currentTarget.classList.add("menuIconStyle")
                                                }
                                                onMouseLeave={(event: React.MouseEvent<any>) =>
                                                  event.currentTarget.classList.remove("menuIconStyle")
                                                }
                                              />
                                            </Button>
                                          )
                                        )}
                                        {VideoTypes.includes(option.type) && (
                                          <Button
                                            size="sm"
                                            className="p-1 mx-1"
                                            style={{ background: color?.color }}
                                            onClick={() => {
                                              (videoRef.current = option), handleViewVideoAttachment();
                                            }}
                                            placeholder={undefined}
                                            onPointerEnterCapture={undefined}
                                            onPointerLeaveCapture={undefined}
                                          >
                                            <PlayArrowIcon
                                              fontSize="small"
                                              className="p-1"
                                              onMouseEnter={(event: React.MouseEvent<any>) =>
                                                event.currentTarget.classList.add("menuIconStyle")
                                              }
                                              onMouseLeave={(event: React.MouseEvent<any>) =>
                                                event.currentTarget.classList.remove("menuIconStyle")
                                              }
                                            />
                                          </Button>
                                        )}
                                        {option.isFile == true ? (
                                          <Button
                                            onClick={() => DownLoadFileDocument(option)}
                                            size="sm"
                                            className="p-1 mx-1"
                                            style={{ background: color?.color }}
                                            placeholder={undefined}
                                            onPointerEnterCapture={undefined}
                                            onPointerLeaveCapture={undefined}
                                          >
                                            <CloudDownload
                                              fontSize="small"
                                              className="p-1"
                                              onMouseEnter={(event: React.MouseEvent<any>) =>
                                                event.currentTarget.classList.add("menuIconStyle")
                                              }
                                              onMouseLeave={(event: React.MouseEvent<any>) =>
                                                event.currentTarget.classList.remove("menuIconStyle")
                                              }
                                            />
                                          </Button>
                                        ) : (
                                          ""
                                        )}
                                        <Button
                                          onClick={() => {
                                            setValue("Transfer.itemId", option.id),
                                              setValue("Transfer.archiveJobId", option.jobId),
                                              setValue("Transfer.archiveWorkOrderId", option.workOrderId),
                                              handleOpenTransfer();
                                          }}
                                          size="sm"
                                          className="p-1 mx-1"
                                          style={{ background: color?.color }}
                                          placeholder={undefined}
                                          onPointerEnterCapture={undefined}
                                          onPointerLeaveCapture={undefined}
                                        >
                                          <SyncAltIcon
                                            fontSize="small"
                                            className="p-1"
                                            onMouseEnter={(event: React.MouseEvent<any>) =>
                                              event.currentTarget.classList.add("menuIconStyle")
                                            }
                                            onMouseLeave={(event: React.MouseEvent<any>) =>
                                              event.currentTarget.classList.remove("menuIconStyle")
                                            }
                                          />
                                        </Button>
                                        <Button
                                          onClick={(e) =>
                                            DeleteItemTable(
                                              option.isFile,
                                              option.docHeapId,
                                              option.jobId,
                                              option.workOrderId,
                                              option.id,
                                              e.currentTarget
                                            )
                                          }
                                          size="sm"
                                          className="p-1 mx-1"
                                          style={{ background: color?.color }}
                                          placeholder={undefined}
                                          onPointerEnterCapture={undefined}
                                          onPointerLeaveCapture={undefined}
                                        >
                                          <DeleteIcon
                                            fontSize="small"
                                            className="p-1"
                                            onMouseEnter={(event: React.MouseEvent<any>) =>
                                              event.currentTarget.classList.add("menuIconStyle")
                                            }
                                            onMouseLeave={(event: React.MouseEvent<any>) =>
                                              event.currentTarget.classList.remove("menuIconStyle")
                                            }
                                          />
                                        </Button>
                                        <EditItemButton item={option} />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </CardBody>
                  </TabPanel>
                );
              })}
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
                className={`${themeIsNotActive ? "cardDark" : "cardLight"} absolute top-0 bottom-0 overflow-auto`}
                size="xl"
                open={open}
                handler={handleOpen}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <DialogHeader
                  dir="rtl"
                  className={`${
                    themeIsNotActive ? "cardDark lightText" : "cardLight darkText"
                  } flex justify-between z-[100] sticky top-0 left-0 `}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => {
                      handleOpen();
                    }}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </IconButton>
                </DialogHeader>
                <figure className="w-full h-full">
                  {loadings.loadingIframe == false ? (
                    isAllowedImageType(viewDocumentTableState.file.fileType) ? (
                      <Image
                        className="h-full w-auto m-auto"
                        src={viewDocumentTableState.img}
                        alt="viewDoc"
                        width={80}
                        height={100}
                      />
                    ) : (
                      <section className="w-full h-fit p-2">
                        <div style={{ height: "100vh", width: "100%" }}>
                          <AcsPdfViewer base64={viewDocumentTableState.img} />
                        </div>
                      </section>
                    )
                  ) : (
                    <IframeSkeleton />
                  )}
                </figure>
              </Dialog>
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
                className={`${
                  themeIsNotActive ? "cardDark" : "cardLight"
                } absolute top-0 overflow-y-auto min-h-[600px] `}
                size="md"
                open={openTransfer}
                handler={handleOpenTransfer}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <DialogHeader
                  dir="rtl"
                  className={`${
                    themeIsNotActive ? "cardDark lightText" : "cardLight darkText"
                  } flex justify-between z-[100] sticky top-0 left-0 `}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => {
                      handleOpenTransfer();
                    }}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </IconButton>
                </DialogHeader>
                <DialogBody
                  className="w-full"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <form dir="rtl" onSubmit={handleSubmit(OnSubmit)} className="relative z-[10]">
                    <div className="w-max ">
                      <Tooltip
                        className={themeIsNotActive ? "cardDark lightText" : "cardLight darkText"}
                        content="Save Certificates"
                        placement="top"
                      >
                        <Button
                          type="submit"
                          size="sm"
                          style={{ background: color?.color }}
                          className="text-white capitalize p-1"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          <SaveIcon className="p-1" />
                        </Button>
                      </Tooltip>
                    </div>
                    <Tabs dir="ltr" value="Customer" className="mb-3">
                      <TabsHeader
                        className={`${themeIsNotActive ? "contentDark" : "contentLight"} max-w-[100px]`}
                        indicatorProps={{
                          style: {
                            background: color?.color,
                            color: "white",
                          },
                          className: `shadow !text-gray-900`,
                        }}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <Tab
                          onClick={() => {
                            setSearchBased("Customer"),
                              setSelectStates({
                                jobId: 0,
                                jobs: [],
                                orgId: 0,
                                orgs: [],
                                workOrderId: 0,
                                workOrders: [],
                              });
                          }}
                          value="Customer"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          <Tooltip
                            className={themeIsNotActive ? "cardDark" : "cardLight"}
                            content="جستجو براساس مشتریان"
                            placement="top"
                          >
                            <PeopleIcon
                              className={`${themeIsNotActive ? "lightText" : "darkText"}`}
                              style={{ color: `${searchBased == "Customer" ? "white" : ""}` }}
                            />
                          </Tooltip>
                        </Tab>
                        <Tab
                          onClick={() => {
                            setSearchBased("Job"),
                              setSelectStates({
                                jobId: 0,
                                jobs: [],
                                orgId: 0,
                                orgs: [],
                                workOrderId: 0,
                                workOrders: [],
                              });
                          }}
                          value="Job"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          <Tooltip
                            className={themeIsNotActive ? "cardDark" : "cardLight"}
                            content="جستجو براساس کارها"
                            placement="top"
                          >
                            <WorkIcon
                              className={`${themeIsNotActive ? "lightText" : "darkText"}`}
                              style={{ color: `${searchBased == "Job" ? "white" : ""}` }}
                            />
                          </Tooltip>
                        </Tab>
                      </TabsHeader>
                    </Tabs>
                    <section dir="rtl" className="grid grid-cols-1 gap-y-3 gap-x-1">
                      {searchBased == "Customer" ? (
                        <AsyncSelect
                          maxMenuHeight={250}
                          isRtl
                          className={`${themeIsNotActive ? "lightText" : "darkText"} w-[100%] z-[900]`}
                          cacheOptions
                          defaultOptions
                          placeholder="مشتریان"
                          loadOptions={loadSearchedCustomerOptions}
                          onChange={(
                            option: SingleValue<CustomerOptionProps>,
                            actionMeta: ActionMeta<CustomerOptionProps>
                          ) => {
                            setSelectStates((state) => ({ ...state, orgId: option!.value }));
                          }}
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
                              neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                              neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                            },
                          })}
                        />
                      ) : (
                        <Select
                          isRtl
                          isSearchable
                          maxMenuHeight={220}
                          className={`${
                            themeIsNotActive ? "lightText" : "darkText"
                          } w-[100%] disabled:opacity-5 z-[900]`}
                          placeholder="مشتریان"
                          value={selectStates.orgs}
                          //   ref={SelectCustomerRef}
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
                              neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                              neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                            },
                          })}
                        />
                      )}
                      {searchBased == "Customer" ? (
                        <Select
                          isRtl
                          id="JobsInput"
                          isSearchable
                          //   ref={SelectJobsRef}
                          maxMenuHeight={220}
                          className={`${themeIsNotActive ? "lightText" : "darkText"} w-[100%] z-[700]`}
                          placeholder="کارها"
                          options={selectStates.jobs}
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
                              neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                              neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                            },
                          })}
                          onChange={(option: JobOptionProps | null, actionMeta: ActionMeta<JobOptionProps>) => {
                            {
                              setSelectStates((state) => ({ ...state, jobId: option!.value })),
                                setValue("Transfer.transferJobId", option!.value);
                            }
                          }}
                        />
                      ) : (
                        <AsyncSelect
                          isRtl
                          className={`${themeIsNotActive ? "lightText" : "darkText"} w-[100%] z-[700]`}
                          cacheOptions
                          defaultOptions
                          placeholder="کارها"
                          loadOptions={loadSearchedJobsOptions}
                          maxMenuHeight={250}
                          onChange={(option: SingleValue<JobOptionProps>, actionMeta: ActionMeta<JobOptionProps>) => {
                            setSelectStates((state) => ({ ...state, jobId: option!.value })),
                              setValue("Transfer.transferJobId", option!.value);
                          }}
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
                              neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                              neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                            },
                          })}
                        />
                      )}
                      <Select
                        isRtl
                        isClearable
                        maxMenuHeight={220}
                        ref={SelectWorkOrderRef}
                        className={`${themeIsNotActive ? "lightText" : "darkText"} w-[100%] z-[201]`}
                        placeholder="خدمات"
                        options={selectStates.workOrders}
                        onChange={(
                          option: SingleValue<WorkOrderOptionProps>,
                          actionMeta: ActionMeta<WorkOrderOptionProps>
                        ) => {
                          setSelectStates((state) => ({ ...state, workOrderId: option!.value })),
                            setValue("Transfer.transferWorkOrderId", option!.value);
                        }}
                        theme={(theme) => ({
                          ...theme,
                          height: 5,
                          borderRadius: 5,
                          colors: {
                            ...theme.colors,
                            color: "#607d8b",
                            neutral10: `${color?.color}`,
                            primary25: `${color?.color}`,
                            primary: "#607d8b",
                            neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                            neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                          },
                        })}
                      />
                      <Select
                        isRtl
                        isClearable={false}
                        maxMenuHeight={220}
                        className={`${themeIsNotActive ? "lightText" : "darkText"} w-[100%] z-[200]`}
                        placeholder="دسته بندی"
                        options={data?.data ? [...data.data] : []}
                        isLoading={isLoading}
                        getOptionLabel={(option) => option.faTitle}
                        value={data?.data?.find((option) => option.id === watch("Transfer.categoryId"))}
                        onChange={(option: SingleValue<CategoriesProps>, actionMeta: ActionMeta<CategoriesProps>) => {
                          setValue("Transfer.categoryId", option?.id!);
                        }}
                        isOptionSelected={(option) => option.id === watch("Transfer.categoryId")}
                        theme={(theme) => ({
                          ...theme,
                          height: 5,
                          borderRadius: 5,
                          colors: {
                            ...theme.colors,
                            color: "#607d8b",
                            neutral10: `${color?.color}`,
                            primary25: `${color?.color}`,
                            primary: "#607d8b",
                            neutral0: `${themeIsNotActive ? "#1b2b39" : "#ded6ce"}`,
                            neutral80: `${themeIsNotActive ? "white" : "#463b2f"}`,
                          },
                        })}
                        required
                      />
                    </section>
                  </form>
                </DialogBody>
              </Dialog>
              <Dialog
                className={`${
                  themeIsNotActive ? "cardDark" : "cardLight"
                } absolute top-0 bottom-0 overflow-x-auto m-auto flex justify-center items-center`}
                size="xl"
                open={openVideo}
                handler={handleViewVideoAttachment}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <DialogHeader
                  dir="rtl"
                  className={`${
                    themeIsNotActive ? "cardDark lightText" : "cardLight darkText"
                  } flex justify-between z-[100] sticky top-0 left-0 `}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => {
                      handleViewVideoAttachment();
                    }}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </IconButton>
                </DialogHeader>
                <video width="960" height="640" autoPlay={true} controls={true}>
                  <source
                    src={`${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/streamvideo?Id=${videoRef.current?.id}&WorkOrderId=${videoRef.current?.workOrderId}&JobId=${videoRef.current?.jobId}&AttachmentType=${videoRef.current?.attachmentTypeId}`}
                    type="video/mp4"
                  />
                </video>
                <DialogFooter
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <ButtonComponent onClick={handleViewVideoAttachment}>بستن</ButtonComponent>
                </DialogFooter>
              </Dialog>
            </TabsBody>
          </Tabs>
        </CardBody>
      </>
    );
  }
};
export default ViewDocumentTable;

const schema = yup.object({
  Transfer: yup
    .object()
    .shape({
      itemId: yup.number().required("اجباری"),
      archiveJobId: yup.number().required("اجباری"),
      archiveWorkOrderId: yup.number().required("اجباری"),
      transferJobId: yup.number().required("اجباری"),
      transferWorkOrderId: yup.number().required("اجباری"),
    })
    .required(),
});
