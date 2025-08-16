'use client';
import { CardBody, Select, Option, Input, Tab, Tabs, TabsHeader, Tooltip } from '@material-tailwind/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { ActionMeta, SingleValue } from 'react-select';
import Select2 from 'react-select';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import colorStore from '@/app/zustandData/color.zustand';
import useAxios from '@/app/hooks/useAxios';
import { CategoriesOptionProps, Response, CategoriesProps, CustomerOptionProps, CustomerProps, JobOptionProps, JobsProps, WorkOrderOptionProps, WorkOrderProps } from '@/app/models/Archive/ViewDocumentFormModels';
import { AxiosResponse } from 'axios';
import { DocumentType, addDocumentDataModel } from '@/app/models/Archive/AddDocumentUnArchiveTable';
import ArchiveJobFilterStore from '@/app/zustandData/ArchiveJobFilter.zustand';
// ***icons
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import InputSkeleton from '@/app/components/shared/InputSkeleton';

const AddDocumentForm = () => {
  const { AxiosRequest } = useAxios()
  const [loadingWorkOrder, setLoadingWorkOrder] = useState<boolean>(false)
  const [loadingCat, setLoadingCat] = useState<boolean>(false)
  // const [loadingWorkOrder, setLoadingWorkOrder] = useState<boolean>(false)
  const themeMode = useStore(themeStore, (state) => state)
  const color = useStore(colorStore, (state) => state)
  let customerTimeOut: any;
  let jobTimeOut: any;
  let initialState = {
    searchBased: 'Customer',
    jobs: [],
    workOrder: [],
    categories: [],
    workOrderId: undefined,
    orgs: {
      value: 0,
      label: "",
      faName: "",
      name: "",
      nationalCode: "",
      id: 0
    },
    orgId: undefined,
    jobId: undefined,
    docType: false,
  };

  const [addDocumentState, setAddDocumentState] = useState<addDocumentDataModel>(initialState);

  let SelectJobsRef = useRef() as any;
  let SelectCustomerRef = useRef() as any;
  let SelectWorkOrderRef = useRef() as any;

  // ****searchedByCustomer
  const filterSearchCustomers = async (searchinputValue: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/searchCustomers?searchkey=${searchinputValue}`;
    let method = 'get';
    let data = {};
    if (searchinputValue && searchinputValue != null && searchinputValue.trim() != '') {
      let res: AxiosResponse<Response<CustomerProps[]>> = await AxiosRequest({ url, method, data, credentials: true })
      let options: CustomerOptionProps[] =
        (res.data.data != null) ? res.data.data.map((item: CustomerProps, index: number) => {
          return { value: item.id, label: item.faName + ` _ ` + item.nationalCode, name: item.name, faName: item.faName, nationalCode: item.nationalCode, id: item.id }
        }) : [];
      return options.filter((i: CustomerOptionProps) =>
        i.label.toLowerCase().includes(searchinputValue.toLowerCase())
      );
    } else {
      return []
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
        callback([]); // Ensure callback is called with undefined if result is not an array
      }
    }, 1000);
  };

  const filterGetJobs = useCallback(async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetJobs?orgId=${addDocumentState.orgId}`;
    let method = 'get';
    let data = {};
    let response: AxiosResponse<Response<JobsProps[]>> = await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      setAddDocumentState(state => ({
        ...state, jobs:
          response.data.data.map((item: JobsProps, index: number) => {
            return {
              value: item.id,
              faTitle: item.faTitle,
              organizationId: item.organizationId,
              createDate: item.createDate,
              label: item.isActive == true ? item.faTitle : 'غیر فعال -' + item.faTitle,
              title: item.title,
              isActive: item.isActive
            }
          })
      }))
    }

  }, [addDocumentState.orgId])

  const filterGetWorkOrder = useCallback(async () => {
    setLoadingWorkOrder(true)
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetWorkOrders?jobId=${addDocumentState.jobId}`;
    let method = 'get';
    let data = {};
    let response: AxiosResponse<Response<WorkOrderProps[]>> = await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      setLoadingWorkOrder(false)
      if (response.data.status == true && response.data.data != null) {
        setAddDocumentState(state => ({
          ...state, workOrder:
            response.data.data && response.data.data.map((item: WorkOrderProps, index: number) => {
              return {
                value: item.id,
                label: item.faTitle,
                createDate: item.createDate,
                faTitle: item.faTitle,
                jobId: item.jobId,
                title: item.title
              }
            })
        }))
      } else {
        setAddDocumentState(state => ({
          ...state, workOrder: []
        }))
      }
    }
  }, [addDocumentState.jobId])

  // **********search Jobs
  const filterSearchJobs = async (searchinputValue: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/SearchActiveJobs?searchKey=${searchinputValue}`;
    let method = 'get';
    let data = {};
    if (searchinputValue && searchinputValue != null && searchinputValue.trim() != '') {
      let response: AxiosResponse<Response<JobsProps[]>> = await AxiosRequest({ url, method, data, credentials: true });
      let options: JobOptionProps[] = (response.data.data != null) ? response.data.data.map((item: JobsProps, index: number) => {
        return {
          value: item.id,
          label: item.faTitle,
          organizationId: item.organizationId,
          title: item.title,
          faTitle: item.faTitle,
          createDate: item.createDate,
          isActive: item.isActive
        }
      }) : [];
      return options
    } else {
      return []
    }
  };
  const loadSearchedJobsOptions = (
    searchinputValue: string,
    callback: (options: JobOptionProps[]) => void
  ) => {
    clearTimeout(jobTimeOut);
    jobTimeOut = setTimeout(async () => {
      callback(await filterSearchJobs(searchinputValue));
    }, 1000);
  };

  const filterGetOrganizaion = useCallback(async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/searchorganizations?jobId=${addDocumentState.jobId}`;
    let method = 'get';
    let data = {};
    let resLoadOrganizaton: AxiosResponse<Response<CustomerProps>> = await AxiosRequest({ url, method, data, credentials: true });
    if (resLoadOrganizaton.data.data != null && resLoadOrganizaton.data.status == true) {
      setAddDocumentState(state => ({
        ...state, orgs: (resLoadOrganizaton.data.data) ? {
          value: resLoadOrganizaton.data.data.id,
          label: resLoadOrganizaton.data.data.faName + 'ـ' + resLoadOrganizaton.data.data.nationalCode,
          nationalCode: resLoadOrganizaton.data.data.nationalCode,
          name: resLoadOrganizaton.data.data.name,
          faName: resLoadOrganizaton.data.data.faName,
          id: resLoadOrganizaton.data.data.id,
        } : undefined
      }))
    }
  }, [addDocumentState.jobId])

  async function GetCategories() {
    setLoadingCat(true)
    let url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/Categories`;
    let method = 'get';
    let data = {};
    let response: AxiosResponse<Response<CategoriesProps[]>> = await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      if (Array.isArray(response.data.data)) {
        setLoadingCat(false)
        setAddDocumentState(state => ({
          ...state, categories:
            response?.data.data.map((item: CategoriesProps, index: number) => {
              return new CategoriesOptionProps(item.id, item.faTitle, item.title);
            })
        }))

      }
    }
  }

  useEffect(() => {
    ArchiveJobFilterStore.setState(state => ({ ...state, JobId: addDocumentState.jobId })),
      (addDocumentState.jobId && addDocumentState.jobId != null) ? (addDocumentState.searchBased == "Customer" ? filterGetWorkOrder() : filterGetOrganizaion(), filterGetWorkOrder()) : null
  }, [filterGetOrganizaion, filterGetWorkOrder, addDocumentState.searchBased, addDocumentState.jobId])
  useEffect(() => {
    ArchiveJobFilterStore.setState(state => ({ ...state, WorkOrderId: addDocumentState.workOrderId }))
  }, [addDocumentState.workOrderId])
  useEffect(() => {
    (addDocumentState.orgId && addDocumentState.orgId != null) ? filterGetJobs() : null;
  }, [addDocumentState.orgId, filterGetJobs]);

  useEffect(() => {
    ArchiveJobFilterStore.setState(state => ({ ...state, DocType: addDocumentState.docType }))
  }, [addDocumentState.docType])

  useEffect(() => {
    GetCategories()
  }, [])

  return (
    <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} shadow-md rounded-lg w-[98%] md:w-[96%] mx-auto `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <Tabs dir="rtl" value="Customer" className="max-w-[100px] mb-3">
        <TabsHeader
          className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'}`}
          indicatorProps={{
            style: {
              background: color?.color,
              color: "white",
            },
            className: `shadow !text-gray-900`,
          }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          <Tab onClick={() => {
            setAddDocumentState(state => ({ ...state, searchBased: "Customer" }))
              , (SelectJobsRef.current != null) ? SelectJobsRef.current.clearValue() : null
              , (SelectWorkOrderRef.current != null) ? SelectWorkOrderRef.current.clearValue() : null;
            setAddDocumentState(state => ({ ...state, workOrder: [], jobs: [] }));
          }} value="Customer" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content="جستجو براساس مشتریان" placement="top">
              < PeopleIcon className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${addDocumentState.searchBased == "Customer" ? "white" : ""}` }} />
            </Tooltip>
          </Tab>
          <Tab onClick={() => {
            setAddDocumentState(state => ({ ...state, searchBased: "Job" }))
              , (SelectCustomerRef.current != null) ? SelectCustomerRef.current.clearValue() : null
              , (SelectWorkOrderRef.current != null) ? SelectWorkOrderRef.current.clearValue() : null
              , setAddDocumentState(state => ({ ...state, workOrder: [] }));
          }} value="Job" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content="جستجو براساس کارها" placement="top">
              <WorkIcon className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${addDocumentState.searchBased == "Job" ? "white" : ""}` }} />
            </Tooltip>
          </Tab>
        </TabsHeader>
      </Tabs>
      <form className="w-full">
        <div className="mb-1 w-full flex flex-col justify-center gap-6 ">
          <section className="w-full">
            <div className="container-fluid">
              <div className="flex flex-row flex-wrap md:flex-nowrap justify-around items-center gap-5">
                {addDocumentState.searchBased == "Customer" ?
                  <Select2 isRtl isSearchable
                    maxMenuHeight={220}
                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] md:w-2/4`} placeholder="کارها" ref={SelectJobsRef} options={addDocumentState.jobs}
                    theme={(theme) => ({
                      ...theme,
                      height: 10,
                      borderRadius: 5,
                      colors: {
                        ...theme.colors,
                        color: '#607d8b',
                        neutral10: `${color?.color}`,
                        primary25: `${color?.color}`,
                        primary: '#607d8b',
                        neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                        neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`
                      },
                    })}
                    onChange={(option: SingleValue<JobOptionProps> | null, actionMeta: ActionMeta<JobOptionProps>) => { setAddDocumentState(state => ({ ...state, jobId: option?.value })) }}
                  /> :
                  <AsyncSelect isRtl className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] md:w-2/4`} ref={SelectJobsRef} cacheOptions defaultOptions placeholder="کارها"
                    loadOptions={loadSearchedJobsOptions}
                    onChange={(option: SingleValue<JobOptionProps>, actionMeta: ActionMeta<JobOptionProps>) => {
                      setAddDocumentState(state => ({ ...state, jobId: option?.value })),
                        (SelectCustomerRef.current != null) ? SelectCustomerRef.current.clearValue() : null,
                        (SelectWorkOrderRef.current != null) ? SelectWorkOrderRef.current.clearValue() : null
                    }}
                    theme={(theme) => ({
                      ...theme,
                      height: 10,
                      borderRadius: 5,
                      colors: {
                        ...theme.colors,
                        color: '#607d8b',
                        neutral10: `${color?.color}`,
                        primary25: `${color?.color}`,
                        primary: '#607d8b',
                        neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                        neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`
                      },
                    })}
                  />
                }
                {addDocumentState.searchBased == "Customer" ?
                  <AsyncSelect isRtl className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] md:w-2/4`} ref={SelectCustomerRef} cacheOptions defaultOptions placeholder="مشتریان" loadOptions={loadSearchedCustomerOptions}
                    onChange={(option: SingleValue<CustomerOptionProps>, actionMeta: ActionMeta<CustomerOptionProps>) => {
                      setAddDocumentState(state => ({ ...state, orgId: option?.value })),
                        (SelectCustomerRef != null) ? SelectJobsRef.current.clearValue() : null,
                        (SelectWorkOrderRef != null) ? SelectWorkOrderRef.current.clearValue() : null
                    }}
                    theme={(theme) => ({
                      ...theme,
                      height: 10,
                      borderRadius: 5,
                      colors: {
                        ...theme.colors,
                        color: '#607d8b',
                        neutral10: `${color?.color}`,
                        primary25: `${color?.color}`,
                        primary: '#607d8b',
                        neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                        neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`
                      },
                    })}
                  /> :
                  <Select2 isRtl isSearchable ref={SelectCustomerRef}
                    maxMenuHeight={220}
                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] md:w-2/4  disabled:opacity-[5px]`} placeholder="مشتریان" value={addDocumentState.orgs}
                    theme={(theme) => ({
                      ...theme,
                      height: 10,
                      borderRadius: 5,
                      colors: {
                        ...theme.colors,
                        color: '#607d8b',
                        neutral10: `${color?.color}`,
                        primary25: `${color?.color}`,
                        primary: '#607d8b',
                        neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                        neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`
                      },
                    })}
                    onChange={(option: SingleValue<CustomerOptionProps> | null, actionMeta: ActionMeta<CustomerOptionProps>) => { setAddDocumentState(state => ({ ...state, orgId: option?.value })) }}
                  />
                }
              </div>
            </div>
          </section>
          <section className="w-full">
            <div className="conatiner-fluid">
              <div className="flex flex-row flex-wrap md:flex-nowrap justify-around items-center gap-3">
                {loadingWorkOrder == false ? <Select2 isRtl
                  maxMenuHeight={220}
                  className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] md:w-2/4`} ref={SelectWorkOrderRef} placeholder="خدمات"
                  options={addDocumentState.workOrder}
                  onChange={(option: SingleValue<WorkOrderOptionProps>, actionMeta: ActionMeta<WorkOrderOptionProps>) => { setAddDocumentState(state => ({ ...state, workOrderId: option?.value })) }}
                  theme={(theme) => ({
                    ...theme,
                    height: 10,
                    borderRadius: 5,
                    colors: {
                      ...theme.colors,
                      color: '#607d8b',
                      neutral10: `${color?.color}`,
                      primary25: `${color?.color}`,
                      primary: '#607d8b',
                      neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                      neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`
                    },
                  })}
                /> : <InputSkeleton />}
                {loadingCat == false ? <Select2 isRtl
                  maxMenuHeight={220}
                  className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] md:w-2/4`} id='searchCategories' placeholder="دسته بندی ها" options={addDocumentState.categories}
                  onChange={(option: SingleValue<CategoriesOptionProps>, actionMeta: ActionMeta<CategoriesOptionProps>) => { ArchiveJobFilterStore.setState(state => ({ ...state, CategoryId: option?.value })) }}
                  theme={(theme) => ({
                    ...theme,
                    height: 10,
                    borderRadius: 5,
                    colors: {
                      ...theme.colors,
                      color: '#607d8b',
                      neutral10: `${color?.color}`,
                      primary25: `${color?.color}`,
                      primary: '#607d8b',
                      neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                      neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`
                    },
                  })}
                /> : <InputSkeleton />}
                <Select2 isRtl
                  maxMenuHeight={220}
                  className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] md:w-2/4`} placeholder="نوع مدرک" options={[{ label: "فایل", isFile: true }, { label: "دیجیتالی", isFile: false }]}
                  onChange={(option: SingleValue<{ label: string, isFile: boolean }>, actionMeta: ActionMeta<{ label: string, isFile: boolean }>) => { ArchiveJobFilterStore.setState(state => ({ ...state, DocType: option?.isFile })) }}
                  theme={(theme) => ({
                    ...theme,
                    height: 10,
                    borderRadius: 5,
                    colors: {
                      ...theme.colors,
                      color: '#607d8b',
                      neutral10: `${color?.color}`,
                      primary25: `${color?.color}`,
                      primary: '#607d8b',
                      neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                      neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`
                    },
                  })}
                />
              </div>
            </div>
          </section>
        </div>
      </form>
    </CardBody>
  )
}

export default AddDocumentForm; 