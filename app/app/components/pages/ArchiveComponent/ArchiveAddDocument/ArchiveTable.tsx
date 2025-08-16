'use client';
import React, { useEffect, useState } from 'react';
import { Button, CardBody, Typography } from '@material-tailwind/react';
import themeStore from './../../../../zustandData/theme.zustand';
import useStore from "./../../../../hooks/useStore";
import colorStore from './../../../../zustandData/color.zustand';
import useAxios from '../../../../hooks/useAxios';
import { LoadingModel, Response, UnArchiveDocumentModel } from '@/app/models/Archive/AddDocumentUnArchiveTable';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import ArchiveJobFilterStore from '@/app/zustandData/ArchiveJobFilter.zustand';
import { AxiosResponse } from 'axios';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import activeStore from '@/app/zustandData/activate.zustand';


const ArchiveTable = ({ sendLoadingState }: any) => {
  const { AxiosRequest } = useAxios()
  const activeState = activeStore();
  const router = useRouter();
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state)
  const ArchiveJobFilterData = ArchiveJobFilterStore.getState();
  const CategoryId = ArchiveJobFilterStore.getState().CategoryId;
  const [unArchiveTableDocument, setUnArchiveTableDocument] = useState<UnArchiveDocumentModel[]>([]);

  let initialLoading = {
    loadingTable: false
  }



  const [loading, setLoading] = useState<LoadingModel>(initialLoading)
  const GetUnArchiveTable = async () => {
    setLoading((state) => ({ ...state, loadingTable: true }))
    const url = `${process.env.NEXT_PUBLIC_API_URL}/archive/manage/unarchived`;
    let method = 'get';
    let data = {}
    let response: AxiosResponse<Response<UnArchiveDocumentModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
    if (response) {
      setLoading((state) => ({ ...state, loadingTable: false }))
      if (response.data.status && Array.isArray(response.data.data)) {
        setUnArchiveTableDocument(response?.data.data && response.data.data.map((item: UnArchiveDocumentModel) => {
          return {
            docHeapId: item.docHeapId,
            subject: item.subject,
            docTypeId: item.docTypeId,
            docIndicatorId: item.docIndicatorId
          }
        }
        ))
        return
      }
    }
  }
  useEffect(() => {
    unArchiveTableDocument?.length === 0 ? GetUnArchiveTable() : null
  }, [unArchiveTableDocument])

  const ViewDocument = (option: UnArchiveDocumentModel) => {
    if (router) {
      activeStore.setState((state) => ({ ...state, activeSubLink: "New Document" }))
      window.open(`/Home/NewDocument?doctypeid=${option.docTypeId}&docheapid=${option.docHeapId}`)
    }
  }

  const ArchiveDocument = async (option: UnArchiveDocumentModel, index: number) => {
    if (ArchiveJobFilterStore.getState().CategoryId != 0 && ArchiveJobFilterStore.getState().WorkOrderId != 0 && ArchiveJobFilterStore.getState().JobId != 0) {
      const { value: ExtraInfo } = await Swal.fire({
        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
        title: "Archive Document!",
        input: "text",
        inputLabel: ArchiveJobFilterStore.getState().CategoryId != 7 ? "اطلاعات تکمیلی" : 'شماره صورت حساب',
        inputAttributes: {
          dir: 'rtl'
        },
        showCancelButton: true,
        icon: "info",
        confirmButtonColor: "#21af5a",
        cancelButtonColor: "#b53535",
      });
      sendLoadingState(true)
      let url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/putdoc`;
      let method = "put";
      let data = {
        "actorId": 0,
        "docHeapId": option.docHeapId,
        "archiveCategoryId": ArchiveJobFilterStore.getState().CategoryId,
        "isFile": false,
        "name": option.docIndicatorId,
        "title": option.subject,
        "workOrderId": ArchiveJobFilterStore.getState().WorkOrderId,
        "jobId": ArchiveJobFilterStore.getState().JobId,
        "docTypeId": option.docTypeId,
        "extraInfo": ExtraInfo
      }
      let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
      if (response) {
        sendLoadingState(false)
        if (typeof response.data.data == 'boolean' && response.data.data == false) {
          Swal.fire({
            confirmButtonColor: "#22c55e",
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Archive Document!",
            text: response.data.message,
            confirmButtonText: "OK!",
            icon: response.data.status ? "warning" : "error",
          })
        }
        let index = unArchiveTableDocument.indexOf(option);
        if (index !== -1) {
          let Array = [...unArchiveTableDocument]
          Array.splice(index, 1)
          setUnArchiveTableDocument([...Array])
        }
      }
    } else {
      Swal.fire({
        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
        allowOutsideClick: false,
        title: "Archive Document!",
        text: 'Try again after filling the mandatory fields',
        icon: "warning",
        confirmButtonColor: "#22c55e",
        confirmButtonText: "OK!",
      })
    }
  }
  return (
    <CardBody className='w-[98%] h-[400px] md:w-[96%] mx-auto relative rounded-lg overflow-auto p-0' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      {loading.loadingTable == false ?
        (unArchiveTableDocument != null) && (
          <table dir="rtl" className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[420px] `}>
            <thead>
              <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    #
                  </Typography>
                </th>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    شماره مدرک
                  </Typography>
                </th>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    عنوان
                  </Typography>
                </th>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    عملیات
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
              {unArchiveTableDocument?.map((option: UnArchiveDocumentModel, index: number) => {
                return (
                  <tr key={'unArchiveTableDocument' + index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                    <td style={{ width: '3%' }} className='p-1'>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {Number(index) + Number(1)}
                      </Typography>
                    </td>
                    <td style={{ width: "20%" }} className='p-1'>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {option.docIndicatorId}
                      </Typography>
                    </td>
                    <td style={{ width: "70%" }} className='p-1'>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {option.subject}
                      </Typography>
                    </td>
                    <td style={{ width: '7%' }} className='p-1'>
                      <div className='container-fluid mx-auto p-0.5'>
                        <div className="flex flex-row justify-evenly">
                          <Button
                            onClick={() => ArchiveDocument(option, index)}
                            size="sm"
                            className="p-1 mx-1"
                            style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                          >
                            <InsertDriveFileIcon fontSize='small'
                              className='p-1'
                              onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                              onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            />
                          </Button>
                          <Button
                            onClick={() => ViewDocument(option)}
                            size="sm"
                            className="p-1 mx-1"
                            style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                          >
                            <VisibilityIcon
                              fontSize='small'
                              className='p-1'
                              onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                              onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            />
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <TableSkeleton className="md:px-4" />
        )
      }

    </CardBody>
  )
}
export default ArchiveTable;