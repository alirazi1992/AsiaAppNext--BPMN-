'use client';
import { CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Typography, Checkbox } from '@material-tailwind/react';
import React, { useState, useRef } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from "@/app/hooks/useStore";
import { SingleValue } from "react-select"
import AsyncSelect from 'react-select/async';
import { CustomerOptionProps, Response, CustomerProps, InitialProjectModel, SelectJobProps, JobsProps, AddJobParamsModel, AddJobModel, JobOptionProps, LoadingModel } from '@/app/models/ProjectManagement/InitialProjectModels';
import useAxios from '@/app/hooks/useAxios';
import { AxiosResponse } from 'axios';
import initialProjectStore from '@/app/zustandData/InitialProject.zustand';
import Swal from 'sweetalert2';
import ButtonComponent from '@/app/components/shared/ButtonComp';

const CustomerSearchComponent = ({ loadingState }: any) => {
  const { AxiosRequest } = useAxios()
  const themeMode = useStore(themeStore, (state) => state)
  const color = useStore(colorStore, (state) => state)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  let customerTimeOut: any;
  let SelectCustomerRef = useRef() as any;
  const initialProject = initialProjectStore()
  let relatedJobTimeOut: any;
  let SelectRelatedJobRef = useRef() as any;
  const [addJobParams, setaddJobsParam] = useState<AddJobParamsModel>({ FaTitle: "", IsActive: true, Title: "", RelatedJobId: null })

  const loadSearchedJobOptions = (
    searchinputValue: string,
    callback: (options: SelectJobProps[]) => void
  ) => {
    clearTimeout(relatedJobTimeOut);
    relatedJobTimeOut = setTimeout(async () => {
      callback(await filterSearchJobs(searchinputValue));
    }, 1000);
  };
  const filterSearchJobs = async (searchinputValue: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/SearchJobs?searchKey=${searchinputValue}`;
    let method = 'get';
    let data = {};
    if (searchinputValue && searchinputValue != null && searchinputValue.trim() != '') {
      let res: AxiosResponse<Response<JobsProps[]>> = await AxiosRequest({ url, method, data, credentials: true });
      let options: SelectJobProps[] = res.data.data.map((item: JobsProps) => ({
        Title: item.title,
        FaTitle: item.faTitle,
        SubJob: item.subJob ? {
          value: item.subJob.id,
          label: item.subJob.faTitle,
          faTitle: item.subJob.faTitle,
          id: item.subJob.id
        } : null,
        RelatedJob: item.relatedJob ? {
          value: item.relatedJob.id,
          label: item.relatedJob.faTitle,
          faTitle: item.relatedJob.faTitle,
          id: item.relatedJob.id
        } : null,
        Id: item.id,
        value: item.id,
        label: item.faTitle
      }));
      return options;
    } else {
      return []
    }
  };

  // ****searchedByCustomer
  const filterSearchCustomers = async (searchinputValue: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/searchCustomers?searchkey=${searchinputValue}`;
    let method = 'get';
    let data = {};
    if (searchinputValue && searchinputValue != null && searchinputValue.trim() != '') {
      let res: AxiosResponse<Response<CustomerProps[]>> = await AxiosRequest({ url, method, data, credentials: true });
      let options: CustomerOptionProps[] = res.data.data != null ? res.data.data.map((item: CustomerProps, index: number) => {
        return { value: item.id, label: item.faName + ` _ ` + item.nationalCode, name: item.name, faName: item.faName, nationalCode: item.nationalCode, id: item.id }
      }) : [];
      return options != undefined ? options.filter((i: CustomerOptionProps) =>
        i.label.toLowerCase().includes(searchinputValue.toLowerCase())
      ) : []
    }
    else {
      return []
    }
  }

  const loadSearchedCustomerOptions = (
    searchinputValue: string,
    callback: (options: CustomerOptionProps[]) => void
  ) => {
    clearTimeout(customerTimeOut);
    customerTimeOut = setTimeout(async () => {
      callback(await filterSearchCustomers(searchinputValue));
    }, 1000);
  };

  const SaveJob = () => {
    if (initialProject.SelectedCustomerId == null || initialProject.SelectedCustomerId == 0) {
      Swal.fire({
        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
        allowOutsideClick: false,
        title: "Create Job!",
        text: ".ابتدا مشتری را در صفحه اصلی انتخاب نمایید",
        icon: "warning",
        confirmButtonColor: "#22c55e",
        confirmButtonText: "OK",
      })
    }
    else {
      Swal.fire({
        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
        allowOutsideClick: false,
        title: "Create Job!",
        text: "Are you sure about creating this job?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#21af5a",
        cancelButtonColor: "#b53535",
        confirmButtonText: "Yes,Create it!"
      }).then((result) => {
        if (result) {
          loadingState(true)
          let data: AddJobModel = { faTitle: addJobParams.FaTitle, isActive: addJobParams.IsActive, orgId: initialProject.SelectedCustomerId!, relatedJobId: addJobParams.RelatedJobId ?? null, title: addJobParams.Title }
          let method = "Put";
          let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/AddJob`;
          (addJobParams.FaTitle != null && addJobParams.Title != null) ?
            (
              AxiosRequest({ credentials: true, data: data, method: method, url: url }).then((result: AxiosResponse<Response<JobOptionProps>>) => {
                loadingState(false);
                if (result.data.data == null) {
                  Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Create Job!",
                    text: result.data.message,
                    icon: result.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "OK",
                  })
                }
                if (result.data.status) {
                  loadingState(false);
                  let job: JobOptionProps[] = initialProject.RelatedJobs;
                  job.push({
                    createDate: result.data.data.createDate,
                    faTitle: result.data.data.faTitle,
                    id: result.data.data.id,
                    isActive: result.data.data.isActive,
                    organizationId: result.data.data.organizationId,
                    title: result.data.data.title,
                    relatedJob: result.data.data.relatedJob != null ? {
                      id: result.data.data.relatedJob.id,
                      faTitle: result.data.data.relatedJob.faTitle,
                      value: result.data.data.relatedJob.id,
                      label: result.data.data.relatedJob.faTitle
                    } : null,
                    subJob: result.data.data.subJob != null ? {
                      faTitle: result.data.data.subJob.faTitle,
                      id: result.data.data.subJob.id,
                      label: result.data.data.subJob.label,
                      value: result.data.data.subJob.value
                    } : null
                  });
                  initialProject.setState({ RelatedJobs: job })
                }
              })) :
            Swal.fire({
              background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Create Job!",
              text: "لطفا فیلد های مربوطه را پرکنید",
              icon: "warning",
              confirmButtonText: "OK",
              confirmButtonColor: "#22c55e",
            })
            ;
        }
      })
    }
  }

  return (
    <>
      <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} rounded-lg shadow-md w-[98%] md:w-[96%] mt-2 mx-auto `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <div className="w-full">
          <div className="container-fluid mx-auto">
            <div className="flex flex-col md:flex-row justify-end md:justify-between items-center">
              <AsyncSelect
                maxMenuHeight={250}
                isRtl className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} ref={SelectCustomerRef} cacheOptions defaultOptions placeholder="مشتریان" loadOptions={loadSearchedCustomerOptions}
                onChange={(option: SingleValue<CustomerOptionProps>) => {
                  initialProject.setState({ SelectedCustomerId: option!.id, RelatedWorkOrders: [], SelectedCustomer: option! })
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
              <div className='w-full flex justify-end my-2 md:my-0'>
                <IconButton onClick={handleOpen} style={{ background: color?.color }} size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><i className=" bi bi-plus-lg"></i>
                </IconButton>
                <Typography dir='rtl' variant="h5" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-right mx-3 font-[600]`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  مشتریان
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      <Dialog size='sm' className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>افزودن کارها</DialogHeader>
        <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex items-end flex-col gap-6'>
            <Input dir="ltr" onBlur={(e) => { let value = e.currentTarget.value; setaddJobsParam((state) => ({ ...state, Title: value })); }} crossOrigin="" size="md" label="Title" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            <Input dir="rtl" onBlur={(e) => { let value = e.currentTarget.value; setaddJobsParam((state) => ({ ...state, FaTitle: value })); }} crossOrigin="" size="md" label="عنوان" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            <AsyncSelect isRtl className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} ref={SelectRelatedJobRef} cacheOptions defaultOptions placeholder="کارها" loadOptions={loadSearchedJobOptions}
              onChange={(option: SingleValue<SelectJobProps>) => {
                setaddJobsParam((state) => ({ ...state, RelatedJobId: option!.Id }))
              }}
              maxMenuHeight={220}
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
            <Checkbox crossOrigin={""} color='blue-gray' label="فعال" checked={addJobParams.IsActive} onChange={(e) => setaddJobsParam((state) => ({ ...state, IsActive: e.target.checked }))} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          </section>
        </DialogBody>
        <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex justify-center'>
            <ButtonComponent onClick={() => handleOpen()}>انصراف</ButtonComponent>
          </section>
          <section className='flex justify-center'>
            <ButtonComponent onClick={SaveJob}>تائید</ButtonComponent>
          </section>
        </DialogFooter>
      </Dialog>


    </>
  )
}
export default CustomerSearchComponent; 