'use client';
import { Button, CardBody, Dialog, DialogBody, DialogHeader, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react';
import React, { useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import colorStore from '@/app/zustandData/color.zustand';
import TitleComponent from '@/app/components/shared/TitleComponent';
import ArchiveForm from './ArchiveForm';
import ArchiveTable from './ArchiveTable';
import ButtonComponent from '@/app/components/shared/ButtonComponent';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import ArchiveJobFilterStore from '@/app/zustandData/ArchiveJobFilter.zustand'
import { Response, UnArchiveSraechDocs, UnArchiveDocList, AcceptedFileModel } from
  '@/app/models/Archive/AddDocumentUnArchiveTable';
import { Pagination, Stack } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import Loading from '@/app/components/shared/loadingResponse';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import activeStore from '@/app/zustandData/activate.zustand';

const ArchiveComponent = () => {
  const { AxiosRequest } = useAxios()
  const activeState = activeStore();
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state);
  const [open, setOpen] = useState(false);
  const [openExtraInfo, setOpenExtraInfo] = useState<boolean>(false)
  const handleExtraInfo = () => setOpenExtraInfo(!openExtraInfo);
  const handleOpen = () => setOpen(!open);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchDocTable, setSearchDocTable] = useState<UnArchiveDocList[]>();
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingTable, setLoadingTable] = useState<boolean>(false)
  const ArchiveJobFilterData = ArchiveJobFilterStore((state) => state);
  const SearchDocument = async (pageNo: number) => {
    setLoadingTable(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/SearchDocs?searchKey=${searchValue}&pageNo=${pageNo}&count=10`;
    let method = "get";
    let data = {}
    if (searchValue != null) {
      let response: AxiosResponse<Response<UnArchiveSraechDocs>> = await AxiosRequest({ url, method, data, credentials: true });
      if (response) {
        setLoadingTable(false)
        if (typeof response.data.data == 'object' && response.data.data !== null) {
          if (response.data.status == true && response.data.data != null && response.data.data.docList.length > 0) {
            setSearchDocTable(response.data.data?.docList);
            let paginationCount = Math.ceil(Number(response.data.data?.totalCount) / Number(10));
            setCount(paginationCount)
            return
          }
        } else {
          Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "جستجوی مدرک",
            text: response.data.status ? "موردی یافت نشد" : response.data.message,
            icon: response.data.status ? "warning" : "error",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Ok!"
          })
        }
      }
    }
  }

  const CategoryId = ArchiveJobFilterStore.getState().CategoryId;
  const JobId = ArchiveJobFilterStore.getState().JobId;
  const WorkOrderId = ArchiveJobFilterStore.getState().WorkOrderId;
  const [files, setFiles] = useState<AcceptedFileModel[]>([]);
  const [fileName, setFileName] = useState("");
  const [fileTitle, setFileTitle] = useState<string>("")
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[], rejectedFiles: any) => {
      setFiles(acceptedFiles.map((file: any) => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      setFileName(acceptedFiles[0].name);
    }
  });

  const UploadFileDocument = async (file: any) => {
    const { value: ExtraInfo, isConfirmed } = await Swal.fire({
      background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      title: "آپلود فایل",
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
    if (isConfirmed) {
      setLoading(true)
      let fileBase64: string = ""
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        if (!!reader.result) {
          let fileString = reader.result?.toString();
          fileBase64 = fileString.substring(fileString.indexOf(",") + 1)
          let url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/putfile`;
          let method = "put";
          let data = {
            file: fileBase64,
            type: file.type,
            archiveCategoryId: CategoryId,
            isFile: true,
            name: file.name,
            title: fileTitle,
            workOrderId: (WorkOrderId == null ? 0 : WorkOrderId),
            jobId: JobId,
            attachmentTypeId: 7,
            extraInfo: ExtraInfo
          }
          let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
          if (response) {
            setLoading(false)
            if (typeof response.data.data == 'boolean') {
              setFiles(files.filter((item: any) => item !== file))
              handleOpen()
              setFileTitle('')
              setFileName('')
              if (response.data.data == false) {
                Swal.fire({
                  background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                  color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                  allowOutsideClick: false,
                  title: "آپلود مدرک",
                  text: response.data.message,
                  icon: response.data.status ? "warning" : "error",
                  confirmButtonColor: "#22c55e",
                  confirmButtonText: "Ok!"
                })
              }
            }
          }
        }
      }
    }
  }


  const DeleteAttachmentRow = (rowIndex: number) => {
    setFiles(files.filter((file: any) => files.indexOf(file) !== rowIndex))
  }

  const ArchiveDocument = async (option: UnArchiveDocList) => {
    const { value: ExtraInfo, isConfirmed } = await Swal.fire({
      background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      title: "آرشیو مدرک",
      input: "text",
      inputLabel: ArchiveJobFilterStore.getState().CategoryId != 7 ? "اطلاعات تکمیلی" : 'شماره صورت حساب',
      inputAttributes: {
        dir: 'rtl'
      },
      showCancelButton: true,
      icon: "info",
      confirmButtonColor: "#21af5a",
      cancelButtonColor: "#b53535",
    })
    if (isConfirmed) {
      setLoading(true)
      let url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/putdoc`;
      let method = "put";
      let data = {
        actorId: 0,
        docHeapId: option.docHeapId,
        archiveCategoryId: ArchiveJobFilterData.CategoryId,
        isFile: false,
        name: option.indicator,
        title: option.subject,
        workOrderId: ArchiveJobFilterData.WorkOrderId,
        jobId: ArchiveJobFilterData.JobId,
        docTypeId: option.docTypeId,
        extraInfo: ExtraInfo
      }
      let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
      setLoading(false)
      if (response) {
        if (typeof response.data.data == 'boolean') {
          if (response.data.data == true) {
            setSearchValue('')
            setSearchDocTable([])
            setCount(0)
            handleOpen()
          } else {
            Swal.fire({
              background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "آرشیو مدرک",
              text: response.data.message,
              icon: response.data.status ? "warning" : "error",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK"
            });
          }
        }
      }
    } 
  }

  const HandlingOpenDialog = () => {
    if (ArchiveJobFilterStore.getState().CategoryId != 0 && ArchiveJobFilterStore.getState().WorkOrderId != 0 && ArchiveJobFilterStore.getState().JobId != 0) {
      handleOpen()
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

  const thumbsContainer: any = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  const thumb: any = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    width: 50,
    height: 50,
    padding: 4,
    boxSizing: 'border-box'
  };
  const thumbInner: any = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  const img: any = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };

  const filesList = files.map((file: any, index: number) => (
    <tr className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`} key={"fileIndex" + index}>
      <td className='p-1 w-[70px]' style={thumb}>
        <div style={thumbInner}>
          <figure>
            <Image
              src={file.preview}
              style={img}
              onLoad={() => { URL.revokeObjectURL(file.preview) }}
              width={100}
              height={100}
              alt="putFile"
            />
          </figure>
        </div>
      </td>
      <td className='p-1'>
        <Typography variant='h6' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{file.name} - {file.size} bytes</Typography>
      </td>
      <td dir='ltr' className='p-1'>
        <Input dir='rtl' value={fileTitle} onChange={(event: any) => { setFileTitle(event.target.value); }}
          style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color='blue-gray' crossOrigin="" type='text' label='نام فایل' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      </td>
      <td style={{ width: '7%' }} className='p-1'>
        <div className='container-fluid mx-auto p-0.5'>
          <div className="flex flex-row justify-evenly">

            <Button

              onClick={() => DeleteAttachmentRow(index)}
              style={{ background: color?.color }}
              size="sm"
              className="p-1 mx-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              <DeleteIcon

                fontSize='small'
                className='p-1'
                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
              />
            </Button>
            <Button
              onClick={() => { UploadFileDocument(file); }}
              style={{ background: color?.color }}
              size="sm"
              className="p-1 mx-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <CloudUploadIcon

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
  ));

  const handleLoadingState = (data: boolean) => {
    setLoading(data);
  }

  return (
    <>
      {loading == true && <Loading />}
      <TitleComponent>افزودن مدارک</TitleComponent>
      <ArchiveForm />
      <TitleComponent>مدارک آرشیو نشده</TitleComponent>
      <ArchiveTable sendLoadingState={handleLoadingState} />
      <ButtonComponent onClick={() => HandlingOpenDialog()}>آرشیو مدرک</ButtonComponent>
      {ArchiveJobFilterStore.getState().DocType === false ? (
        <Dialog
          dismiss={{
            escapeKey: true,
            referencePress: true,
            referencePressEvent: 'click',
            outsidePress: false,
            outsidePressEvent: 'click',
            ancestorScroll: false,
            bubbles: true
          }}
          size='xl' className={`absolute top-0 bottom-0 overflow-y-scroll  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {/* <DialogHeader dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>انتخاب مدرک</DialogHeader> */}
          <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between z-[100] sticky top-0 left-0 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            انتخاب مدرک
            <IconButton variant="text" color="blue-gray" onClick={() => { handleOpen(), setSearchValue(""), setSearchDocTable([]), setCount(0); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </DialogHeader>
          <DialogBody className='overflow-y-scroll ' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <section className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} my-3 mx-auto`}>
              <div className="relative flex w-[98%] md:w-2/6 ">
                <Input
                  crossOrigin=""
                  style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
                  type="text"
                  label="Search"
                  value={searchValue}
                  onChange={(event: any) => {
                    setSearchDocTable(undefined);
                    setCount(0);
                    setSearchValue(event.target.value);
                  }}
                  className={`pr-20 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}

                  containerProps={{
                    className: !themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'
                  }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                <Button
                  onClick={() => { SearchDocument(1); }}
                  size="sm"
                  className="!absolute right-1 top-1 rounded"
                  style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  <i className={"bi bi-search"}></i>
                </Button>
              </div>
              <section className='my-3 mx-auto'>
                {loadingTable == false ?
                  (searchDocTable != undefined && searchDocTable.length > 0) &&
                  (<table dir="rtl" className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full  relative text-center max-h-[400px]`}>
                    <thead >
                      <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                        <th style={{ borderBottomColor: color?.color }}
                          className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                          >
                            #
                          </Typography>
                        </th>
                        <th style={{ borderBottomColor: color?.color }}
                          className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                          >
                            شماره مدرک
                          </Typography>
                        </th>
                        <th style={{ borderBottomColor: color?.color }}
                          className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                          >
                            موضوع
                          </Typography>
                        </th>
                        <th style={{ borderBottomColor: color?.color }}
                          className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                          >
                            عملیات
                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                      {searchDocTable?.map((item: UnArchiveDocList, index: number) => {
                        return (
                          <tr key={'searchDocTable' + index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none  hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                            <td style={{ width: '5%' }} className='p-1'>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              >
                                {Number(index) + Number(1)}
                              </Typography>
                            </td>
                            <td style={{ width: '10%' }} className='p-1'>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              >
                                {item.indicator}
                              </Typography>
                            </td>
                            <td className='p-1'>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-normal p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              >
                                {item.subject}
                              </Typography>
                            </td>
                            <td style={{ width: '4%' }} className='p-1'>
                              <div className='container-fluid mx-auto p-0.5'>
                                <div className="flex flex-row justify-evenly">
                                  <Button
                                    onClick={() => ArchiveDocument(item)}
                                    size="sm"
                                    className="p-1 mx-1"
                                    style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                  >
                                    <TaskIcon
                                      fontSize="small"
                                      className='p-1'
                                      onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                      onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                  </Button>
                                  <Button onClick={() => { activeStore.setState((state) => ({ ...state, activeSubLink: "New Document" })), window.open(`/Home/NewDocument?docheapid=${item.docHeapId}&doctypeid=${item.docTypeId}`); }}
                                    size="sm"
                                    className="p-1 mx-1"
                                    style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                  >
                                    <VisibilityIcon
                                      fontSize="small"
                                      className='p-1'
                                      onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                      onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>) : <TableSkeleton className="md:px-4" />
                }
              </section>

            </section>
            {count != 0 && (<section className='flex justify-center mb-0 mt-3'>
              <Stack onClick={(e: any) => SearchDocument(e.target.innerText)} spacing={1}>
                <Pagination hidePrevButton hideNextButton count={count} variant="outlined" size="small" shape="rounded" />
              </Stack>
            </section>)}
          </DialogBody>
        </Dialog>) :
        (<Dialog
          dismiss={{
            escapeKey: true,
            referencePress: true,
            referencePressEvent: 'click',
            outsidePress: false,
            outsidePressEvent: 'click',
            ancestorScroll: false,
            bubbles: true
          }}
          size='xl' className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between z-[100] sticky top-0 left-0 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            انتخاب مدرک
            <IconButton variant="text" color="blue-gray" onClick={() => { handleOpen(); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </DialogHeader>
          <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <div>
              <section className="container mx-auto">
                <div style={{ border: `1px dashed ${color?.color}` }} {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <div className='flex flex-row justify-around items-center'>
                    <IconButton style={{ background: color?.color }} size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      <AddIcon
                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                        style={{ fontSize: "14px" }} />
                    </IconButton>
                    <p dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} p-3 text-[13px] font-thin `}>انتخاب فایل مورد نظر</p>
                  </div>
                </div>
                <aside style={thumbsContainer}>
                  {files != undefined && files.length > 0 && (
                    <CardBody className='w-[100%] mx-auto relative rounded-lg overflow-auto p-0 my-3' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      <table dir="rtl" className={"w-full relative text-center max-h-[400px] rounded-lg"}>
                        <thead>
                          <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th style={{ borderBottomColor: color?.color }}
                              className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              >
                                تصویر مدرک
                              </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                              className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              >
                                اطلاعات مدرک
                              </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                              className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              >
                                توضیحات
                              </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                              className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              >
                                عملیات
                              </Typography>
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                          {filesList}
                        </tbody>
                      </table>
                    </CardBody>
                  )}
                </aside>
              </section>
            </div>
          </DialogBody>
        </Dialog>)}
    </>
  )
}

export default ArchiveComponent;


