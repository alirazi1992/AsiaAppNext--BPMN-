'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Typography, Checkbox, Tooltip } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import ButtonComponent from '@/app/components/shared/ButtonComponent';
import initialProjectStore from '@/app/zustandData/InitialProject.zustand';
import {
  JobOptionProps,
  Response,
  SelectJobProps,
  JobsProps,
  UpdateJobModel,
  AddingWorkOrder,
  AddWorkOrderModel,
  AddWorkOrderResultModel,
  ResponseAddPartner,
  PartnersItemsList,
  CustomerProps,
  CustomerOptionProps
} from '@/app/models/ProjectManagement/InitialProjectModels';
import useAxios from '@/app/hooks/useAxios';
import { AxiosResponse } from 'axios';
import AsyncSelect from 'react-select/async';
import { SingleValue } from "react-select"
import Swal from 'sweetalert2';
import useStore from "@/app/hooks/useStore";
import moment from 'jalali-moment';
// icons
import EditIcon from '@mui/icons-material/Edit';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PartnersTable from './PartnersTable';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import SearchIcon from '@mui/icons-material/Search';
import ResLoading from '@/app/components/shared/loadingResponse';

const JobsTable = ({ loadingJobs }: any) => {
  const { AxiosRequest } = useAxios()
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state)
  const initialProject = initialProjectStore()
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [relatedJobs, setRelatedJobs] = useState<JobOptionProps[]>([]);
  const editHandleOpen = () => setEditOpen(!editOpen);
  const [partnersList, setPartnersList] = useState<PartnersItemsList[]>([]);
  const [openPartnerTable, setOpenPartnerTable] = useState<boolean>(false);
  const [openEditPartner, setOpenEditPartner] = useState<boolean>(false);
  const handlepartnersList = () => setOpenPartnerTable(!openPartnerTable);
  const handleEditpartnersList = () => setOpenEditPartner(!openEditPartner);
  const [addingWorkorderState, setAddingWorkorderState] = useState<AddingWorkOrder>({ FaTitle: null, Title: null });
  const [selecteJob, setSelecteJob] = useState<number>();
  const [updatingJob, setUpdatingJob] = useState<JobOptionProps>({ title: "", faTitle: "", id: 0, organizationId: 0, createDate: "", isActive: true, relatedJob: null, subJob: null })
  let SelectedAddpartner = useRef() as any;

  const [selectedJob, setSelectedJob] = useState<JobOptionProps | null>(null)
  let relatedJobTimeOut: any;
  const [searchJob, setSearachJob] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingTable, setLoadingTable] = useState<boolean>(false)

  let SelectCustomerRef = useRef() as any;

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
  let customerTimeOut: any;
  const loadSearchedCustomerOptions = (
    searchinputValue: string,
    callback: (options: CustomerOptionProps[]) => void
  ) => {
    clearTimeout(customerTimeOut);
    customerTimeOut = setTimeout(async () => {
      callback(await filterSearchCustomers(searchinputValue));
    }, 1000);
  };

  let recieversTimeOut: any;
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



  const UpdateJob = async () => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Update Job!",
      text: "Are you sure about updating this job?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#21af5a",
      cancelButtonColor: "#b53535",
      confirmButtonText: "Yes,Update it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        loadingJobs(true)
        let data: UpdateJobModel = {
          faTitle: updatingJob.faTitle,
          isActive: updatingJob.isActive,
          orgId: updatingJob.organizationId!,
          relatedJobId: updatingJob.relatedJob != null ? updatingJob.relatedJob.id : null,
          title: updatingJob.title, id: updatingJob?.id!
        }
        let method = "Patch";
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/UpdateJob`;
        let res: AxiosResponse<Response<JobOptionProps>> = await AxiosRequest({ url, method, data, credentials: true });
        if (res) {
          loadingJobs(false)
          if (res.data.status && res.data.data) {
            let jobs: JobOptionProps[] = initialProject.RelatedJobs;
            let selected: JobOptionProps = jobs.find((job) => job.id == updatingJob.id!)!
            let index: number = jobs.indexOf(selected);
            jobs.splice(index, 1, {
              createDate: updatingJob.createDate,
              faTitle: res.data.data.faTitle,
              id: updatingJob.id,
              isActive: res.data.data.isActive,
              organizationId: res.data.data.organizationId,
              relatedJob: res.data.data.relatedJob,
              subJob: res.data.data.subJob,
              title: res.data.data.title
            });
            initialProject.setState({ RelatedJobs: jobs })
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Update Job!",
              text: res.data.message,
              icon: res.data.status ? "warning" : "error",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK",
            })
          }

        }
      }
    })
  }
  const DeleteJob = async (jobId: number) => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Delete Job!",
      text: "Are you sure about deleting this job?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#21af5a",
      cancelButtonColor: "#b53535",
      confirmButtonText: "Yes,Delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        loadingJobs(true)
        let data = {}
        let method = "Delete";
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/deletejob?jobId=${jobId}`
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ credentials: true, data: data, method: method, url: url });
        if (response) {
          loadingJobs(false)

          if (response.data.status && response.data.data != 0) {
            let jobs: JobOptionProps[] = initialProject.RelatedJobs;
            let selected: JobOptionProps = jobs.find((job) => job.id == jobId!)!
            let index: number = jobs.indexOf(selected);
            jobs.splice(index, 1);
            initialProject.setState({ RelatedJobs: jobs })
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Delete Job!",
              text: response.data.message.toString(),
              icon: response.data.status ? "warning" : "error",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK",
            })
          }
        }
      }
    })
  }

  const AddWorkOrder = async () => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Add WorkOrder!",
      text: "Are you sure about adding work order to job?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#21af5a",
      cancelButtonColor: "#b53535",
      confirmButtonText: "Yes,Add it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        loadingJobs(true)
        let data: AddWorkOrderModel = { Title: addingWorkorderState!.Title, FaTitle: addingWorkorderState!.FaTitle, JobId: selecteJob! }
        let method = "Put";
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/AddWorkOrder`
        let res: AxiosResponse<Response<AddWorkOrderResultModel>> = await AxiosRequest({ credentials: true, data: data, method: method, url: url });
        if (res) {
          loadingJobs(false)
          if (res.data.status && res.data.data) {
            initialProject.setState({
              RelatedWorkOrders: [...initialProject.RelatedWorkOrders, {
                createDate: res.data.data.createDate, faTitle: res.data.data.faTitle, id: res.data.data.id, jobId: res.data.data.jobId, title: res.data.data.title
              }]
            })
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Add WorkOrder!",
              text: res.data.message,
              icon: res.data.status ? "warning" : "error",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK",
            })
          }
        }
      }
    })
  }


  const GetPartners = async (option: JobOptionProps) => {
    setSelectedJob(option)
    let url = `${process.env.NEXT_PUBLIC_API_URL}/projectmanagement/manage/GetPartnersList?jobId=${option.id}`;
    let method = "get";
    let data = {};
    let response: AxiosResponse<Response<PartnersItemsList[]>> = await AxiosRequest({ url, method, data, credentials: true });
    if (response.data.status && response.data.data != null) {
      setPartnersList(response.data.data)
    }
  }

  const AddPartner = async () => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Add Partner!",
      text: "Are you sure about adding partner?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#21af5a",
      cancelButtonColor: "#b53535",
      confirmButtonText: "Yes,Add it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/projectmanagement/manage/AddPartners`;
        let method = "PUT"
        !partnersList.find((p: PartnersItemsList) => p.isOrginalOwner == true) ?
          partnersList.push({
            "id": null,
            "title": initialProject.SelectedCustomer!.name,
            "sharePercent": 0,
            "isOrginalOwner": true,
            "organizationId": initialProject.SelectedCustomer!.id
          }) : null
        let data = {
          "partners":
            partnersList,
          "jobId": selectedJob!.id
        }
        let response: AxiosResponse<Response<ResponseAddPartner[]>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
          if (response.data.status && response.data.data) {
            response.data.data.map((p) => { partnersList.find((i) => i.organizationId == p.orgId)!.organizationId = p.orgId })
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Add Partner!",
              text: response.data.message,
              icon: response.data.status ? "warning" : "error",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK",
            })
          }
        }
      }
    })
  }

  const ChangeSharePercent = (partner: PartnersItemsList, partners: PartnersItemsList[] = partnersList, sharePercent: number) => {
    let isExist = partners.find(p => p.organizationId == partner.organizationId)
    if (isExist && isExist != null) {
      let newPartner = {
        id: partner.id,
        isOrginalOwner: partner.isOrginalOwner,
        organizationId: partner.organizationId,
        sharePercent: sharePercent,
        title: partner.title
      };
      if (sharePercent > 0 && sharePercent < 100) {
        let index = partners.indexOf(isExist);
        if (isExist.organizationId == partner.organizationId) {
          partners.splice(index, 1, newPartner);
          return;
        }
        partners.splice(index, 1);
        setPartnersList(partners);
      }
      Swal.fire({
        background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
        allowOutsideClick: false,
        title: "Add Partner!",
        text: "مجموع سهام باید 100 درصد باشد",
        icon: "warning",
        confirmButtonColor: "#22c55e",
        confirmButtonText: "OK",
      })
    }
  }

  const UpdatePartners = async () => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Update Partner!",
      text: "Are you sure about Updating partner?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#21af5a",
      cancelButtonColor: "#b53535",
      confirmButtonText: "Yes,Update it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        loadingJobs(true)
        let url = `${process.env.NEXT_PUBLIC_API_URL}/projectmanagement/manage/UpdatePartnersCuts`;
        let method = "patch";
        let data = {
          "partners":
            partnersList.map((partner: PartnersItemsList) => {
              return {
                "id": partner.id,
                "sharePercent": partner.sharePercent,
                "isOrginalOwner": partner.isOrginalOwner
              }
            })
          ,
          "jobId": selectedJob!.id
        };
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        response && loadingJobs(false)
        if (response.data.data == false) {
          Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Update Partner!",
            text: response.data.message,
            icon: response.data.status ? "warning" : "error",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "OK",
          })
        }
      }
    })
  }

  const RemovePartner = async (partner: PartnersItemsList) => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Remove partner!",
      text: "Are you sure about remove partner?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#21af5a",
      cancelButtonColor: "#b53535",
      confirmButtonText: "Yes,Remove it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        loadingJobs(true)
        let url = `${process.env.NEXT_PUBLIC_API_URL}/projectmanagement/manage/RemovePartner`;
        let method = "delete";
        let data = {
          "jobId": selectedJob!.id,
          "id": partner.id
        }
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
        response && loadingJobs(false)
        if (response.data.data == false) {
          Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Remove partner!",
            text: response.data.message,
            icon: response.data.status ? "warning" : "error",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "OK",
          })
        }
      }
    })
  }

  const PartnersList =
    <CardBody className='w-full mx-auto h-auto relative rounded-lg overflow-scroll p-0 my-3'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <table dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative max-auto text-center `}>
        <thead>
          <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
            <th style={{ borderBottomColor: color?.color }}
              className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
            >
              <Typography
                variant="small"
                color="blue-gray"
                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}              >
                #
              </Typography>
            </th>
            <th style={{ borderBottomColor: color?.color }}
              className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
            >
              <Typography
                variant="small"
                color="blue-gray"
                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}              >
                نام مشتری
              </Typography>
            </th>
            <th style={{ borderBottomColor: color?.color }}
              className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
            >
              <Typography
                variant="small"
                color="blue-gray"
                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}              >
                درصد سهم
              </Typography>
            </th>
            <th style={{ borderBottomColor: color?.color }}
              className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
            >
              <Typography
                variant="small"
                color="blue-gray"
                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}              >
                عملیات
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
          {partnersList.length > 0 && partnersList.filter((item: PartnersItemsList) => item.isOrginalOwner == false).map((partner: PartnersItemsList, index: number) => {
            return (
              <tr key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                <td style={{ width: '3%' }} className='p-1'>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    {Number(index + 1)}
                  </Typography>
                </td>
                <td className='p-1'>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal whitespace-nowrap  p-0.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    {partner.title}
                  </Typography>
                </td>
                <td style={{ width: "10%" }} className='p-1'>
                  <Input
                    pattern="^\d*(\.\d{0,2})?$"
                    className="!border !border-gray-500 bg-inherit disabled:bg-inherit ring-0 ring-transparent focus:!border-gray-500 focus:!border-t-gray-500 focus:ring-gray-900/10"
                    defaultValue={partner.sharePercent}
                    disabled={openEditPartner == true ? false : (partner.id != null ? true : false)}
                    style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
                    onBlur={(e) => { ChangeSharePercent(partner, partnersList, Number(e.target.value)); } }
                    size='md'
                    crossOrigin=""
                    type="number"
                    labelProps={{
                      className: "hidden",
                    }}
                    containerProps={{ className: "min-w-[100px]" }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  />
                </td>
                <td style={{ width: '3%' }} className='p-1'>
                  <div className='container-fluid mx-auto p-0.5'>
                    <div className="flex flex-row justify-evenly">
                      {openEditPartner == true && (<Button
                        onClick={() => RemovePartner(partner)}
                        style={{ background: color?.color }}
                        size="sm"
                        className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <DeleteIcon
                          fontSize='small'
                          className='p-1'
                          onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                          onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                      </Button>)}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </CardBody>

  const GetJobs = async () => {
    setLoadingTable(true)
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetCustomerJobs?orgId=${initialProject.SelectedCustomerId}`;
    let data = {};
    let method = "Get";
    let response: AxiosResponse<Response<JobOptionProps[]>> = await AxiosRequest({ url, method, data, credentials: true });
    if (response) {
      setLoadingTable(false)
      if (response.data.status && response.data.data != null) {
        response.data.data.length > 0 ? initialProject.setState({ RelatedJobs: response.data.data })
          : (initialProject.setState({ RelatedJobs: [] })
          )
      }
    }
  }
  useEffect(() => {
    initialProject.SelectedCustomerId && initialProject.SelectedCustomerId != 0 ? GetJobs() : null
  }, [initialProject.SelectedCustomerId])

  useEffect(() => {
    setRelatedJobs(initialProject.RelatedJobs)
  }, [initialProject.RelatedJobs])

  let resultData: any[] = []
  const [showJobs, setShowJobs] = useState<JobOptionProps[] | null>(null)
  const SearchJobs = () => {
    initialProject.RelatedJobs.forEach((jobs: JobOptionProps) => {
      if (jobs.title.includes(searchJob) || jobs.faTitle.includes(searchJob)) {
        resultData.push(jobs)
      }
    })
  }

  return (
    <>
      <section className='md:flex md:justify-between md:items-center'>
        <div className="relative md:order-1 w-[98%] md:w-[50%] flex">
          <Input
            dir='ltr'
            crossOrigin=""
            style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
            type="text"
            label="search"
            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} pr-10 p-2`}
            containerProps={{
              className: !themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'
            }}
            onBlur={(e: any) => { setSearachJob(e.target.value), e.target.value.toString().trim() == "" && setShowJobs(null); } } onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          />
          <Button
            size="sm"
            className="!absolute right-1 top-1 rounded p-1"
            style={{ background: color?.color }}
            onClick={() => { SearchJobs(), setShowJobs(resultData); } }  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            <SearchIcon
              className='p-1'
              onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
              onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
          </Button>
        </div>
        <Typography dir='rtl' variant="h6" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} md:order-2 px-6 text-right font-[600] whitespace-nowrap`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          کارها
        </Typography>

      </section>
      <CardBody className=' mx-auto h-[27vh] relative rounded-lg overflow-auto p-0 mt-2'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        {loadingTable == false ?
          (<table dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative max-h-[28vh] text-center`}>
            <thead>
              <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    #
                  </Typography>
                </th>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    نام
                  </Typography>
                </th>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    نام انگلیسی
                  </Typography>
                </th>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    سابقه کار
                  </Typography>
                </th>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}

                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    تاریخ ساخت
                  </Typography>
                </th>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    عملیات
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
              {showJobs == null ? ((relatedJobs != null && relatedJobs.length > 0) && relatedJobs.map((job: JobOptionProps, index: number) => {
                return (
                  <tr style={{ height: "40px !important" }} key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                    <td style={{ width: '3%' }} className='p-1'>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {Number(index + 1)}
                      </Typography>
                    </td>
                    <td style={{ width: "21%" }} className='p-1'>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal  p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {job.faTitle}
                      </Typography>
                    </td>
                    <td style={{ width: "21%" }} className='p-1'>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal  p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {job.title}
                      </Typography>
                    </td>
                    <td style={{ width: "21%" }} className='p-1'>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal  p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {job.relatedJob?.faTitle ?? "-"}
                      </Typography>
                    </td>
                    <td style={{ width: '21%' }} className='p-1'>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {job.createDate !== '' ? moment(job.createDate, 'YYYY/MM/DD HH:mm:SS').format("jYYYY/jMM/jDD HH:mm:SS") : ''}
                      </Typography>
                    </td>
                    <td style={{ width: '8%' }} className='p-1'>
                      <div className='container-fluid mx-auto p-0.5'>
                        <div className="flex flex-row justify-evenly">
                          <Button
                            onClick={() => { DeleteJob(job.id); } }
                            style={{ background: color?.color }}
                            size="sm"
                            className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <DeleteIcon
                              fontSize='small'
                              className='p-1'
                              onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                              onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            />

                          </Button>
                          <Button onClick={() => { setUpdatingJob(job), editHandleOpen(); } }
                          style={{ background: color?.color }}
                          size="sm"
                          className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <EditIcon
                              fontSize='small'
                              className='p-1'
                              onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                              onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                          </Button>
                          <Button onClick={() => { setSelecteJob(job.id), handleOpen(); } }
                          style={{ background: color?.color }} size="sm"
                          className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <AddIcon
                              fontSize='small'
                              className='p-1'
                              onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                              onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                          </Button>
                          <Button onClick={() => initialProject.setState({ SelectedJobId: job.id })}
                          style={{ background: color?.color }} size="sm"
                          className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <ArrowDownwardIcon
                              fontSize='small'
                              className='p-1'
                              onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                              onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                          </Button>
                          <Tooltip content="افزودن شریک" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                            <Button onClick={() => { handlepartnersList(), GetPartners(job); } }
                            style={{ background: color?.color }} size="sm"
                            className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              <GroupAddIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                            </Button>
                          </Tooltip>
                          <Tooltip content="ویرایش شرکاء" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                            <Button onClick={() => { handleEditpartnersList(), GetPartners(job); } }
                            style={{ background: color?.color }} size="sm"
                            className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              <ManageAccountsIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                            </Button>
                          </Tooltip>

                        </div>
                      </div>
                    </td>
                  </tr>
                )
              }))
                :
                showJobs.map((job: JobOptionProps, index: number) => {
                  return (
                    <tr style={{ height: "40px !important" }} key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                      <td style={{ width: '3%' }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {Number(index + 1)}
                        </Typography>
                      </td>
                      <td style={{ width: "21%" }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal  p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {job.faTitle}
                        </Typography>
                      </td>
                      <td style={{ width: "21%" }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal  p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {job.title}
                        </Typography>
                      </td>
                      <td style={{ width: "21%" }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal  p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {job.relatedJob?.faTitle ?? "-"}
                        </Typography>
                      </td>
                      <td style={{ width: '21%' }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {job.createDate !== '' ? moment(job.createDate, 'YYYY/MM/DD HH:mm:SS').format("jYYYY/jMM/jDD HH:mm:SS") : ""}
                        </Typography>
                      </td>
                      <td style={{ width: '8%' }} className='p-1'>
                        <div className='container-fluid mx-auto p-0.5'>
                          <div className="flex flex-row justify-evenly">
                            <Button
                              onClick={() => { DeleteJob(job.id); } }
                              style={{ background: color?.color }}
                              size="sm"
                              className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              <DeleteIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />

                            </Button>
                            <Button onClick={() => { setUpdatingJob(job), editHandleOpen(); } }
                            style={{ background: color?.color }}
                            size="sm"
                            className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              <EditIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                            </Button>
                            <Button onClick={() => { setSelecteJob(job.id), handleOpen(); } }
                            style={{ background: color?.color }} size="sm"
                            className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              <AddIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                            </Button>
                            <Button onClick={() => initialProject.setState({ SelectedJobId: job.id })}
                            style={{ background: color?.color }} size="sm"
                            className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              <ArrowDownwardIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                            </Button>
                            <Tooltip content="افزودن شریک" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                              <Button onClick={() => { handlepartnersList(), GetPartners(job); } }
                              style={{ background: color?.color }} size="sm"
                              className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <GroupAddIcon
                                  fontSize='small'
                                  className='p-1'
                                  onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                  onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                              </Button>
                            </Tooltip>
                            <Tooltip content="ویرایش شرکاء" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                              <Button onClick={() => { handleEditpartnersList(), GetPartners(job); } }
                              style={{ background: color?.color }} size="sm"
                              className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <ManageAccountsIcon
                                  fontSize='small'
                                  className='p-1'
                                  onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                  onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                              </Button>
                            </Tooltip>

                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>) : (<TableSkeleton className={"w-full relative"} />)}
      </CardBody>
      <Dialog size='sm' className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >افزودن سفارش خدمت</DialogHeader>
        <DialogBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex flex-col gap-6'>
            <Input dir="ltr" onBlur={(e) => { let value = e.currentTarget.value; setAddingWorkorderState((state: AddingWorkOrder) => ({ ...state, Title: value })); } } crossOrigin="" size="md" label="Title" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            <Input dir="rtl" onBlur={(e) => { let value = e.currentTarget.value; setAddingWorkorderState((state: AddingWorkOrder) => ({ ...state, FaTitle: value })); } } crossOrigin="" size="md" label="عنوان" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          </section>
        </DialogBody>
        <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex justify-center'>
            <ButtonComponent onClick={() => handleOpen()}>انصراف</ButtonComponent>
          </section>
          <section className='flex justify-center'>
            <ButtonComponent onClick={() => { AddWorkOrder(), handleOpen() }}>تائید</ButtonComponent>
          </section>
        </DialogFooter>
      </Dialog >
      <Dialog className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={editOpen} handler={editHandleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>به روزرسانی کار</DialogHeader>
        <DialogBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex flex-col items-end gap-6'>
            <Input dir="ltr" onBlur={(e) => { let value = e.currentTarget.value; setUpdatingJob((state: JobOptionProps) => ({ ...state, title: value })); } } defaultValue={updatingJob?.title} crossOrigin="" size="md" label="Title" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            <Input dir="rtl" onBlur={(e) => { let value = e.currentTarget.value; setUpdatingJob((state: JobOptionProps) => ({ ...state, faTitle: value })); } } defaultValue={updatingJob?.faTitle} crossOrigin="" size="md" label="عنوان" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            <AsyncSelect isClearable isRtl className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} cacheOptions defaultOptions placeholder="کارها" loadOptions={loadSearchedJobOptions}
              onChange={(option: SingleValue<SelectJobProps>) => {
                setUpdatingJob((state: JobOptionProps) => ({ ...state, relatedJob: option != null ? { id: option!.Id, faTitle: option!.FaTitle, label: option!.label, value: option!.value } : null }))
              }}
              defaultValue={updatingJob.relatedJob != null ? {
                Title: "",
                FaTitle: updatingJob.relatedJob!.faTitle,
                SubJob: null,
                RelatedJob: null,
                Id: updatingJob.relatedJob!.id,
                label: updatingJob.relatedJob!.faTitle,
                value: updatingJob.relatedJob!.id
              } : null}
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
                  neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                  neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
                },
              })}
            />
            <Checkbox color='blue-gray' crossOrigin={""} label="فعال" checked={updatingJob.isActive} onChange={(e) => setUpdatingJob((state: JobOptionProps) => ({ ...state, isActive: e.target.checked }))} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          </section>
        </DialogBody>
        <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex justify-center'>
            <ButtonComponent onClick={() => editHandleOpen()}>انصراف</ButtonComponent>
          </section>
          <section className='flex justify-center'>
            <ButtonComponent onClick={UpdateJob}>تائید</ButtonComponent>
          </section>
        </DialogFooter>
      </Dialog>
      <Dialog size='xxl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} absolute top-0 `} open={openPartnerTable} handler={handlepartnersList}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>افزودن شریک</DialogHeader>
        <DialogBody className='overflow-y-scroll'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex flex-col items-end gap-6'>
            <div className="w-full flex flex-col md:flex-row justify-end md:justify-between items-center">
              <AsyncSelect
                maxMenuHeight={250}
                isRtl className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} ref={SelectedAddpartner} cacheOptions defaultOptions placeholder="شرکاء" loadOptions={loadSearchedCustomerOptions}
                onChange={(option: SingleValue<CustomerOptionProps>) => {
                  if (!partnersList.find((p: PartnersItemsList) => p.organizationId == option?.value)) {
                    setPartnersList((state) => ([...state, {
                      id: null,
                      isOrginalOwner: false,
                      organizationId: option!.value,
                      sharePercent: 0,
                      title: option!.label
                    }]))
                  } else {
                    Swal.fire({
                      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                      allowOutsideClick: false,
                      title: "Add Partner!",
                      text: "شخص مورد نظر در لیست شرکاء وجود دارد",
                      icon: "warning",
                      confirmButtonColor: "#22c55e",
                      confirmButtonText: "OK",
                    })
                  }
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
                    neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
                  },
                })}
              />
            </div>
            <section className='w-full'>
              {PartnersList}
            </section>
          </section>
        </DialogBody>
        <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex justify-center'>
            <ButtonComponent onClick={handlepartnersList}>بستن</ButtonComponent>
          </section>
          <section className='flex justify-center'>
            <ButtonComponent onClick={() => AddPartner()}>تائید</ButtonComponent>
          </section>
        </DialogFooter>
      </Dialog>
      <Dialog size='xxl' className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openEditPartner} handler={handleEditpartnersList}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>ویرایش شرکاء</DialogHeader>
        <DialogBody className='overflow-y-scroll'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex flex-col items-end gap-6'>
            <section className='w-full'>
              {PartnersList}
            </section>
          </section>
        </DialogBody>
        <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex justify-center'>
            <ButtonComponent onClick={handleEditpartnersList}>بستن</ButtonComponent>
          </section>
          <section className='flex justify-center'>
            <ButtonComponent onClick={() => UpdatePartners()}>تائید</ButtonComponent>
          </section>
        </DialogFooter>
      </Dialog>
    </>
  )
}
export default JobsTable;