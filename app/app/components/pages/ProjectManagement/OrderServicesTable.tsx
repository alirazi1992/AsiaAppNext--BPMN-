'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Typography } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import initialProjectStore from '@/app/zustandData/InitialProject.zustand';
import archiveStore from '@/app/zustandData/ArchiveJobFilter.zustand'
import EditIcon from '@mui/icons-material/Edit';
import TitleComponent from '@/app/components/shared/TitleComponent';
import { WorkOrderOptionProps, Response, EditWorkOrderResponse } from '@/app/models/ProjectManagement/InitialProjectModels';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import Swal from 'sweetalert2';
import useStore from "@/app/hooks/useStore";
// icons**
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonComponent from '../../shared/ButtonComponent';
import moment from 'jalali-moment';
import TableSkeleton from '@/app/components/shared/TableSkeleton';

const OrderServicesTable = ({ loadingJobs }: any) => {
  const { AxiosRequest } = useAxios()
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state)
  const archive = archiveStore()
  const initialProject = initialProjectStore();
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const handleEdit = () => setEditOpen(!editOpen)
  const [loadingTable, setLoadingTable] = useState<boolean>(false)
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrderOptionProps>({
    createDate: "",
    faTitle: "",
    id: 0,
    jobId: 0,
    title: ""
  })
  interface updateWorkOrde {
    title: string,
    faTitle: string
  }
  const [updateWorkOrder, setUpdateWorkOrder] = useState<updateWorkOrde>({
    title: "",
    faTitle: ""
  })


  const GetWorkOrders = useCallback(async () => {
    setLoadingTable(true)
    let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetJobWorkOrders?jobId=${initialProject.SelectedJobId}`;
    let data = {};
    let method = "Get";
    var response: AxiosResponse<Response<WorkOrderOptionProps[]>> = await AxiosRequest({ data: data, method: method, credentials: true, url: url });
    if (response) {
      setLoadingTable(false)
      if (response.data.status && response.data.data.length > 0) {
        initialProject.setState({ RelatedWorkOrders: response.data.data })
      } else {
        initialProject.setState({ RelatedWorkOrders: [] })
        Swal.fire({
          background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
          color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
          allowOutsideClick: false,
          title: "لیست سفارش خدمتها",
          text: "موردی یافت نشد",
          icon: "warning",
          confirmButtonColor: "#22c55e",
          confirmButtonText: "OK",
        })
      }
    }
  }, [initialProject.SelectedJobId])

  const DeleteWorkOrder = async (workOrderId: number) => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Delete WorkOrder!",
      text: "Are you sure about deleting the work order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#21af5a",
      cancelButtonColor: "#b53535",
      confirmButtonText: "Yes,delete it!"
    }).then(async (result) => {
      if (result) {
        loadingJobs(true)
        let data = {}
        let method = "delete";
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/DeleteWorkOrder?workOrderId=${workOrderId}`
        let res: AxiosResponse<Response<number>> = await AxiosRequest({ credentials: true, data: data, method: method, url: url });
        if (res) {
          loadingJobs(false)
          if (res.data.data == 0) {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Delete WorkOrder!",
              text: res.data.message,
              icon: res.data.status ? "warning" : "error",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK",
            })
          }
          if (res.data.status && res.data.data) {
            let workOrders: WorkOrderOptionProps[] = initialProject.RelatedWorkOrders;
            let selected: WorkOrderOptionProps = workOrders.find((workOrder) => workOrder.id == workOrderId)!
            let index: number = workOrders.indexOf(selected);
            workOrders.splice(index, 1);
            initialProject.setState({ RelatedWorkOrders: workOrders })
          }
        }
      }
    })
  }

  const EditWorkOrder = async () => {
    Swal.fire({
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Update WorkOrder!",
      text: "Are you sure about editing the work order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#21af5a",
      cancelButtonColor: "#b53535",
      confirmButtonText: "Yes,Update it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        loadingJobs(true)
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/UpdateWorkOrder`
        let method = "patch"
        let data = {
          "faTitle": updateWorkOrder.faTitle,
          "title": updateWorkOrder.title,
          "id": selectedWorkOrder.id,
          "jobId": selectedWorkOrder.jobId
        }
        if (data.faTitle != "" && data.title != "") {
          let response: AxiosResponse<Response<EditWorkOrderResponse>> = await AxiosRequest({ url, method, data, credentials: true })
          if (response) {
            loadingJobs(false)
            if (response.data.data != null && response.data.status == true) {
              let workOrders: WorkOrderOptionProps[] = initialProject.RelatedWorkOrders;
              let selected: WorkOrderOptionProps = workOrders.find((workOrder) => workOrder.id == selectedWorkOrder.id)!
              let newOption: WorkOrderOptionProps = {
                createDate: selectedWorkOrder.createDate,
                faTitle: data.faTitle,
                title: data.title,
                id: selectedWorkOrder.id,
                jobId: selectedWorkOrder.jobId
              }
              let index: number = workOrders.indexOf(selected);
              workOrders.splice(index, 1, newOption);
              initialProject.setState({ RelatedWorkOrders: workOrders })
            } else {
              Swal.fire({
                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "Edit WorkOrder!",
                text: response.data.message,
                icon: response.data.status ? "warning" : "error",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK",
              })
            }
            setSelectedWorkOrder({
              createDate: "",
              faTitle: "",
              id: 0,
              jobId: 0,
              title: ""
            })
            handleEdit()
          }
        } else {
          Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Edit WorkOrder!",
            text: ".فیلد های مربوطه را پرکنید",
            icon: "warning",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "OK",
          })
        }
      }
    })
  }

  useEffect(() => {
    initialProject.SelectedJobId && initialProject.SelectedJobId != 0 ? GetWorkOrders() : null
  }, [GetWorkOrders, initialProject.SelectedJobId])
  return (
    <>
      <Typography dir='rtl' variant="h6" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} px-6 mt-3 text-right font-[600] whitespace-nowrap`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        سفارش خدمت ها
      </Typography>
      <CardBody className=' mx-auto h-[23vh] relative rounded-lg overflow-auto p-0 my-2'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        {loadingTable == false ? (<table dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full mx-h-[24vh] relative text-center`}>
          <thead >
            <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
              <th style={{ borderBottomColor: color?.color }}
                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  #
                </Typography>
              </th>
              <th style={{ borderBottomColor: color?.color }}
                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  نام
                </Typography>
              </th>
              <th style={{ borderBottomColor: color?.color }}
                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  نام انگلیسی
                </Typography>
              </th>
              <th style={{ borderBottomColor: color?.color }}
                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  تاریخ ساخت
                </Typography>
              </th>
              <th style={{ borderBottomColor: color?.color }}
                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  عملیات
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
            {initialProject.RelatedWorkOrders && initialProject.RelatedWorkOrders.map((item: WorkOrderOptionProps, index: number) => {
              return (
                <tr style={{ height: "40px" }} key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                  <td style={{ width: '3%' }} className='p-1'>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      {initialProject.RelatedWorkOrders.indexOf(item) + 1}
                    </Typography>
                  </td>
                  <td className='p-1'>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal whitespace-nowrap p-0.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      {item.faTitle}
                    </Typography>
                  </td>
                  <td className='p-1'>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal whitespace-nowrap p-0.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      {item.title}
                    </Typography>
                  </td>
                  <td style={{ width: '15%' }} className='p-1'>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal  p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      {item.createDate !== '' ? moment(item.createDate, "YYYY/MM/DD HH:mm:SS").format("jYYYY/jMM/jDD HH:mm:SS") : ''}
                    </Typography>
                  </td>
                  <td style={{ width: '5%' }} className='p-1'>
                    <div className='container-fluid mx-auto p-0.5'>
                      <div className="flex flex-row justify-evenly">
                        <Button
                          size="sm"
                          onClick={() => { DeleteWorkOrder(item.id); } }
                          style={{ background: color?.color }}
                          className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          <DeleteIcon
                            fontSize='small'
                            className='p-1'
                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                        </Button>
                        <Button
                          onClick={() => { setSelectedWorkOrder(item), handleEdit(); } }
                          style={{ background: color?.color }}
                          size="sm"
                          className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          <EditIcon
                            fontSize='small'
                            className='p-1'
                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                        </Button>

                      </div>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>) : (< TableSkeleton className={"w-full relative"} />)}
      </CardBody>
      <Dialog size='sm' className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={editOpen} handler={handleEdit}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >ویرایش سفارش خدمت</DialogHeader>
        <DialogBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex flex-col gap-6'>
            <Input dir="ltr" crossOrigin="" size="md" defaultValue={selectedWorkOrder.title} onBlur={(e: any) => setUpdateWorkOrder((state) => ({ ...state, title: e.target.value }))} label="Title" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            <Input dir="rtl" crossOrigin="" size="md" defaultValue={selectedWorkOrder.faTitle} onBlur={(e: any) => setUpdateWorkOrder((state) => ({ ...state, faTitle: e.target.value }))} label="عنوان" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          </section>
        </DialogBody>
        <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex justify-center'>
            <ButtonComponent onClick={handleEdit}>انصراف</ButtonComponent>
          </section>
          <section className='flex justify-center'>
            <ButtonComponent onClick={() => EditWorkOrder()}>تائید</ButtonComponent>
          </section>
        </DialogFooter>
      </Dialog >
    </>
  )
};
export default OrderServicesTable;