"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  CustomerProps,
  Response,
  JobsProps,
  CustomerOptionProps,
  JobOptionProps,
  WorkOrderOptionProps,
  WorkOrderProps,
  viewDocumentFormDataModel,
} from "../../../../models/Archive/ViewDocumentFormModels";
import { CardBody, Input, Tab, Tabs, TabsHeader, Tooltip } from "@material-tailwind/react";
import AsyncSelect from "react-select/async";
import { ActionMeta, SingleValue } from "react-select";
import Select from "react-select";
import useAxios from "../../../../hooks/useAxios";
import themeStore from "../../../../zustandData/theme.zustand";
import useStore from "./../../../../hooks/useStore";
import colorStore from "../../../../zustandData/color.zustand";
import { AxiosResponse } from "axios";
import ArchiveJobFilterStore from "../../../../zustandData/ArchiveJobFilter.zustand";
// ***icons
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";

const ViewDocumentForm = () => {
  const { AxiosRequest } = useAxios();
  const themeMode = useStore(themeStore, (state) => state);
  const ArchiveFilterStore = ArchiveJobFilterStore.getState();
  const color = useStore(colorStore, (state) => state);
  let customerTimeOut: any;
  let jobTimeOut: any;

  let initialState = {
    searchBased: "Customer",
    workOrder: [],
    orgId: undefined,
    jobId: undefined,
    workOrderId: undefined,
    jobs: [],
    orgs: {
      value: 0,
      label: "",
      faName: "",
      name: "",
      nationalCode: "",
      id: 0,
    },
    subJob: "",
    relatedJob: "",
    docType: false,
  };

  const [viewDocumentState, setViewDocumentState] = useState<viewDocumentFormDataModel>(initialState);

  let SelectJobsRef = useRef() as any;
  let SelectCustomerRef = useRef() as any;
  let SelectWorkOrderRef = useRef() as any;
  let SelectRelatedJobRef = useRef() as any;
  let SelectSubJobRef = useRef() as any;

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
      const result = await filterSearchCustomers(searchinputValue);
      if (Array.isArray(result)) {
        callback(result);
      } else {
        callback([]);
      }
    }, 1000);
  };

  const filterGetJobs = useCallback(async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetJobs?orgId=${viewDocumentState.orgId}`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<JobsProps[]>> = await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      if (Array.isArray(response.data.data) && response.data.data.length > 0 && response.data.status == true) {
        setViewDocumentState((state) => ({
          ...state,
          jobs: response.data.data.map((item: JobsProps, index: number) => {
            return {
              value: item.id,
              label: item.isActive == true ? item.faTitle : "غیرفعال - " + item.faTitle,
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
      } else {
        setViewDocumentState((state) => ({
          ...state,
          jobs: [],
        }));
      }
    }
  }, [viewDocumentState.orgId]);

  const filterGetWorkOrder = useCallback(async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetWorkOrders?jobId=${viewDocumentState.jobId}`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<WorkOrderProps[]>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    if (response) {
      if (Array.isArray(response.data.data) && response.data.status == true) {
        setViewDocumentState((state) => ({
          ...state,
          workOrder:
            response.data.data.length > 0
              ? response.data.data.map((item: WorkOrderProps) => {
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
      } else {
        setViewDocumentState((state) => ({
          ...state,
          workOrder: [],
        }));
      }
    }
  }, [viewDocumentState.jobId]);

  // **********search Jobs
  const filterSearchJobs = async (searchinputValue: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/SearchJobs?searchKey=${searchinputValue}`;
    let method = "get";
    let data = {};
    if (searchinputValue && searchinputValue != null && searchinputValue.trim() != "") {
      let response: AxiosResponse<Response<JobsProps[]>> = await AxiosRequest({ url, method, data, credentials: true });
      let options: JobOptionProps[] = response.data.data.map((item: JobsProps, index: number) => {
        return {
          value: item.id,
          label: item.isActive == true ? item.faTitle : "غیرفعال - " + item.faTitle,
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
      const result = await filterSearchJobs(searchinputValue);
      if (Array.isArray(result)) {
        callback(result);
      } else {
        callback([]); // Ensure callback is called with undefined if result is not an array
      }
    }, 1000);
  };

  const filterGetOrganizaion = useCallback(async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/searchorganizations?jobId=${viewDocumentState.jobId}`;
    let method = "get";
    let data = {};
    let resLoadOrganizaton: AxiosResponse<Response<CustomerProps>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    setViewDocumentState((state) => ({
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
  }, [viewDocumentState.jobId]);

  useEffect(
    (archiveFilterStore = ArchiveJobFilterStore) => {
      archiveFilterStore.setState((state: any) => ({
        ...state,
        JobId: viewDocumentState.jobId,
        WorkOrderId: viewDocumentState.workOrderId,
      })),
        viewDocumentState.jobId && viewDocumentState.jobId != null
          ? (viewDocumentState.searchBased == "Customer" ? filterGetWorkOrder() : filterGetOrganizaion(),
            filterGetWorkOrder())
          : null;
    },
    [
      viewDocumentState.jobId,
      filterGetOrganizaion,
      filterGetWorkOrder,
      viewDocumentState.searchBased,
      viewDocumentState.workOrderId,
    ]
  );

  useEffect(() => {
    ArchiveJobFilterStore.setState((state) => ({ ...state, WorkOrderId: viewDocumentState.workOrderId }));
  }, [viewDocumentState.workOrderId]);
  useEffect(() => {
    viewDocumentState.orgId && viewDocumentState.orgId != null ? filterGetJobs() : null;
  }, [viewDocumentState.orgId, filterGetJobs]);

  return (
    <CardBody
      className={`${
        !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
      } shadow-md rounded-lg w-[98%] md:w-[96%] mx-auto `}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <Tabs dir="rtl" value="Customer" className="max-w-[100px] mb-3">
        <TabsHeader
          className={`${!themeMode || themeMode?.stateMode ? "contentDark" : "contentLight"}`}
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
              SelectJobsRef.current != null ? SelectJobsRef.current.clearValue() : null,
                SelectWorkOrderRef.current != null ? SelectWorkOrderRef.current.clearValue() : null,
                setViewDocumentState((state) => ({
                  ...state,
                  searchBased: "Customer",
                  workOrder: [],
                  jobs: [],
                  subJob: " ",
                  relatedJob: " ",
                })),
                ArchiveJobFilterStore.setState((state) => ({ ...state, ViewDocumentList: [] }));
            }}
            value="Customer"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Tooltip
              className={!themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"}
              content="جستجو براساس مشتریان"
              placement="top"
            >
              <PeopleIcon
                className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                style={{ color: `${viewDocumentState.searchBased == "Customer" ? "white" : ""}` }}
              />
            </Tooltip>
          </Tab>
          <Tab
            onClick={() => {
              SelectCustomerRef.current != null ? SelectCustomerRef.current.clearValue() : null,
                SelectWorkOrderRef.current != null ? SelectWorkOrderRef.current.clearValue() : null,
                setViewDocumentState((state) => ({
                  ...state,
                  searchBased: "Job",
                  workOrder: [],
                  jobs: [],
                  subJob: " ",
                  relatedJob: " ",
                })),
                ArchiveJobFilterStore.setState((state) => ({ ...state, ViewDocumentList: [] }));
            }}
            value="Job"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Tooltip
              className={!themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"}
              content="جستجو براساس کارها"
              placement="top"
            >
              <WorkIcon
                className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                style={{ color: `${viewDocumentState.searchBased == "Job" ? "white" : ""}` }}
              />
            </Tooltip>
          </Tab>
        </TabsHeader>
      </Tabs>
      <form className="w-full">
        <div className="mb-1 w-full flex flex-col justify-center gap-6 ">
          <section className="w-full">
            <div className="container-fluid">
              <div className="flex flex-row flex-wrap md:flex-nowrap justify-around items-center gap-5">
                {viewDocumentState.searchBased == "Customer" ? (
                  <Select
                    isRtl
                    id="JobsInput"
                    isSearchable
                    ref={SelectJobsRef}
                    maxMenuHeight={220}
                    className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"} w-[100%] md:w-2/4 `}
                    placeholder="کارها"
                    options={viewDocumentState.jobs}
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
                        neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                        neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                      },
                    })}
                    onChange={(option: JobOptionProps | null, actionMeta: ActionMeta<JobOptionProps>) => {
                      {
                        ArchiveJobFilterStore.setState((state) => ({ ...state, ViewDocumentList: [] })),
                          setViewDocumentState((state) => ({
                            ...state,
                            jobId: option?.value,
                            subJob: option?.subJob ? option.subJob.faTitle : " ",
                            relatedJob: option?.relatedJob ? option.relatedJob.faTitle : " ",
                          }));
                      }
                    }}
                  />
                ) : (
                  <AsyncSelect
                    isRtl
                    className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"} w-[100%] md:w-2/4`}
                    cacheOptions
                    defaultOptions
                    placeholder="کارها"
                    loadOptions={loadSearchedJobsOptions}
                    maxMenuHeight={250}
                    onChange={(option: SingleValue<JobOptionProps>, actionMeta: ActionMeta<JobOptionProps>) => {
                      SelectWorkOrderRef.current.clearValue(),
                        setViewDocumentState((state) => ({
                          ...state,
                          jobId: option?.value,
                          subJob: option?.subJob ? option.subJob.faTitle : " ",
                          relatedJob: option?.relatedJob ? option.relatedJob.faTitle : " ",
                        })),
                        ArchiveJobFilterStore.setState((state) => ({ ...state, ViewDocumentList: [] }));
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
                        neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                        neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                      },
                    })}
                  />
                )}
                {viewDocumentState.searchBased == "Customer" ? (
                  <AsyncSelect
                    maxMenuHeight={250}
                    isRtl
                    className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"} w-[100%] md:w-2/4`}
                    cacheOptions
                    defaultOptions
                    placeholder="مشتریان"
                    loadOptions={loadSearchedCustomerOptions}
                    onChange={(
                      option: SingleValue<CustomerOptionProps>,
                      actionMeta: ActionMeta<CustomerOptionProps>
                    ) => {
                      SelectJobsRef.current.clearValue(),
                        SelectWorkOrderRef.current.clearValue(),
                        ArchiveJobFilterStore.setState((state) => ({ ...state, ViewDocumentList: [] }));
                      setViewDocumentState({ ...initialState, orgId: option?.value, jobs: [] });
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
                        neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                        neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                      },
                    })}
                  />
                ) : (
                  <Select
                    isRtl
                    isSearchable
                    maxMenuHeight={220}
                    className={`${
                      !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                    } w-[100%] md:w-2/4 disabled:opacity-5`}
                    placeholder="مشتریان"
                    value={viewDocumentState.orgs}
                    ref={SelectCustomerRef}
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
                        neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                        neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                      },
                    })}
                  />
                )}
              </div>
            </div>
          </section>
          <section className="w-full">
            <div className="conatiner-fluid">
              <div className="flex flex-row flex-wrap md:flex-nowrap justify-around items-center gap-3">
                <Input
                  dir="rtl"
                  crossOrigin=""
                  ref={SelectRelatedJobRef}
                  readOnly
                  value={viewDocumentState.relatedJob}
                  size="md"
                  label="زیرآرشیو"
                  style={{ color: `${!themeMode || themeMode?.stateMode ? "white" : ""}` }}
                  color="blue-gray"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <Input
                  dir="rtl"
                  crossOrigin=""
                  ref={SelectSubJobRef}
                  readOnly
                  value={viewDocumentState.subJob}
                  size="md"
                  label="سابقه"
                  style={{ color: `${!themeMode || themeMode?.stateMode ? "white" : ""}` }}
                  color="blue-gray"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <Select
                  isRtl
                  isClearable
                  maxMenuHeight={220}
                  ref={SelectWorkOrderRef}
                  className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"} w-[100%] md:w-2/4`}
                  placeholder="خدمات"
                  options={viewDocumentState.workOrder}
                  onChange={(
                    option: SingleValue<WorkOrderOptionProps>,
                    actionMeta: ActionMeta<WorkOrderOptionProps>
                  ) => {
                    setViewDocumentState((state) => ({ ...state, workOrderId: option?.value }));
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
                      neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                      neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                    },
                  })}
                />
              </div>
            </div>
          </section>
        </div>
      </form>
    </CardBody>
  );
};

export default ViewDocumentForm;
