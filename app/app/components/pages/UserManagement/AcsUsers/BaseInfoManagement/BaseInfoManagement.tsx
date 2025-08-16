'use client';
import React, { useEffect, useState } from 'react';
import { Button, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import { useRouter } from 'next/navigation';
import ButtonComponent from '@/app/components/shared/ButtonComponent';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import useStore from '@/app/hooks/useStore';
//icons
import SaveIcon from '@mui/icons-material/Save';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BaseInfoTableModel } from '@/app/models/UserManagement/AddUserModel';
import Swal from 'sweetalert2';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { AddInfoModel, GetBaseTypes } from '@/app/models/UserManagement/BaseInfo';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { TextField } from '@mui/material';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import Loading from '@/app/components/shared/loadingResponse';
const BaseInfoManagementTable = () => {
  const { AxiosRequest } = useAxios()
  const themeMode = useStore(themeStore, (state) => state)
  const color = useStore(colorStore, (state) => state)
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open);
  const handleOpenDetail = () => setOpenDetail(!openDetail)
  const [edited, setEdited] = useState<BaseInfoTableModel | null>(null)
  type Loading = {
    tableLoading: boolean,
    responseLoading: boolean
  }
  let loadings = {
    tableLoading: false,
    responseLoading: false
  }
  const [loading, setLoading] = useState<Loading>(loadings);
  const [state, setState] = useState<GetBaseTypes[]>([])
  const schema = yup.object().shape({
    AddInfo: yup.object(({
      titleInfo: yup.string().required('اجباری'),
      typeInfo: yup.string().required('اجباری'),
    })).required(),
  })
  const {
    unregister,
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    resetField,
    getValues,
    formState,
    trigger,
  } = useForm<AddInfoModel>(
    {
      defaultValues: {
        AddInfo: {
          titleInfo: '',
          typeInfo: '',
        },
      }, mode: 'all',
      resolver: yupResolver(schema)
    }
  );
  let updateType = {
    id: 0,
    title: '',
    type: ''
  }

  const [updateBaseType, setUpdateBaseType] = useState<GetBaseTypes>(updateType)

  const outerTheme = useTheme();
  const customTheme = (outerTheme: Theme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      typography: {
        fontFamily: 'FaLight',
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `
                    @font-face {
                      font-family: FaLight;
                      src: url('./assets/newFont/font/IranSansX\(Pro\)/FarsiFont/IRANSansXFaNum-Light.ttf') format('truetype'),
                    }
                  `,
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '--TextField-brandBorderColor': '#607d8b',
              '--TextField-brandBorderHoverColor': '#607d8b',
              '--TextField-brandBorderFocusedColor': '#607d8b',
              '& label.Mui-focused': {
                color: 'var(--TextField-brandBorderFocusedColor)',
              },
              '& label': {
                color: 'var(--TextField-brandBorderFocusedColor)',
              },
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderHoverColor)',
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderFocusedColor)',
              },
              [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderFocusedColor)',
              },
            },
          },


        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: 'var(--TextField-brandBorderColor)',
            },
            root: {
              '--TextField-brandBorderColor': '#607d8b',
              '--TextField-brandBorderHoverColor': '#607d8b',
              '--TextField-brandBorderFocusedColor': '#607d8b',
              '& label.Mui-focused': {
                color: 'var(--TextField-brandBorderFocusedColor)',
              },
              '& label': {
                color: 'var(--TextField-brandBorderFocusedColor)',
              },
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderHoverColor)',
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderFocusedColor)',
              },
              [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderFocusedColor)',
              }
            },
          },
        },
        MuiFilledInput: {
          styleOverrides: {
            root: {
              '--TextField-brandBorderColor': '#607d8b',
              '--TextField-brandBorderHoverColor': '#607d8b',
              '--TextField-brandBorderFocusedColor': '#607d8b',
              '&::before, &::after': {
                borderBottom: '2px solid var(--TextField-brandBorderColor)',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
              },
              '&.Mui-focused:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
              '&.Mui-disabled:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              '--TextField-brandBorderColor': '#607d8b',
              '--TextField-brandBorderHoverColor': '#607d8b',
              '--TextField-brandBorderFocusedColor': '#607d8b',
              '&::before': {
                borderBottom: '2px solid var(--TextField-brandBorderColor)',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
              },
              '&.Mui-focused:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
              '&.Mui-disabled:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
            }
          },
        },
      },
    });
  const errors = formState.errors;
  const OnSubmit = () => {
    Swal.fire({
      title: "Add BaseType",
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      text: "Are you sure?!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, Add it!",
      allowOutsideClick: false,
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading((state) => ({ ...state, responseLoading: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/AddBaseType`
        let method = 'put';
        let data = {
          "title": getValues('AddInfo.titleInfo'),
          "type": getValues('AddInfo.typeInfo')
        }
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
          if (response.data.status && response.data.data != 0) {
            setLoading((state) => ({ ...state, responseLoading: false }))
            setState((state) => ([...state, {
              id: response.data.data,
              title: data.title,
              type: data.type
            }]))
            reset()
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              title: "Add BaseType",
              text: response.data.message,
              icon: (response.data.status == false) ? "error" : "warning",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
              allowOutsideClick: false,
            })
          }
        }
      }
    })
  }

  const DeleteBaseInfo = async (id: number) => {
    Swal.fire({
      title: "Delete BaseInfo",
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      text: "Are you sure?!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "yes, delete it!",
      allowOutsideClick: false,
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading((state) => ({ ...state, responseLoading: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/DeleteBaseInfo?id=${id}`;
        let method = 'delete';
        let data = {};
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoading((state) => ({ ...state, responseLoading: false }))
          if (response.data.status && response.data.data != 0) {
            let newState = state.filter((item) => item.id != id);
            setState([...newState])
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              title: "Delete BaseInfo",
              text: response.data.message,
              icon: (response.data.status == false) ? "error" : "warning",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
              allowOutsideClick: false,
            })
          }
        }
      }


    })
  }


  useEffect(() => {
    const GetBaseTypes = async () => {
      setLoading((state) => ({ ...state, tableLoading: true }))
      let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/GetBaseTypes`;
      let method = 'get';
      let data = {};
      let response: AxiosResponse<Response<GetBaseTypes[]>> = await AxiosRequest({ url, method, data, credentials: true });
      if (response) {
        setLoading((state) => ({ ...state, tableLoading: false }))
        if (response.data.status && response.data.data.length > 0) {
          setState(response.data.data)
        } else {
          setState([])
        }
      }
    }
    GetBaseTypes()
  }, [])

  const EditBaseType = () => {
    Swal.fire({
      title: 'Update BaseInfo',
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      text: "Are you sure?!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, Update it!",
      allowOutsideClick: false,
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading((state) => ({ ...state, responseLoading: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/UpdateBaseInfo`;
        let method = 'patch';
        let data = {
          "id": updateBaseType.id,
          "title": updateBaseType.title,
          "type": updateBaseType.type
        };
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoading((state) => ({ ...state, responseLoading: false }))
          if (response.data.status && response.data.data != 0) {
            let index = state.indexOf(state.find((item) => item.id == updateBaseType.id)!);
            let newOption: GetBaseTypes = {
              id: updateBaseType.id,
              title: updateBaseType.title,
              type: updateBaseType.type
            };
            state.splice(index, 1);
            state.push(newOption)
            setState((state) => ([...state]))
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              title: 'Update BaseInfo',
              text: response.data.message,
              icon: (response.data.status == false) ? "error" : "warning",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
              allowOutsideClick: false,
            })
          }
          handleOpen()
        }
      }


    })
  }


  return (
    <>
      {loading.responseLoading == true && <Loading />}
      <ThemeProvider theme={customTheme(outerTheme)}>
        <section>
          <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} h-full w-[98%] my-3 mx-auto`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <form
              onSubmit={handleSubmit(OnSubmit)}
              className='relative z-[10]'>
              <div dir='rtl' className="w-max">
                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Add Info' placement="top">
                  <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <SaveIcon className='p-1' />
                  </Button>
                </Tooltip>
              </div>
              <section className='grid grid-cols-1 md:grid-cols-2 md:gap-x-5 md:gap-y-5 my-2'>
                <section className='my-1 relative w-full'>
                  <TextField autoComplete="off"
                    sx={{ fontFamily: 'FaLight' }}
                    {...register(`AddInfo.titleInfo`)}
                    tabIndex={2}
                    error={errors?.AddInfo && errors?.AddInfo?.titleInfo && true}
                    className='w-full lg:my-0 font-[FaLight]'
                    dir='ltr'
                    size='small'
                    label='title'
                    InputProps={{
                      style: { color: errors?.AddInfo?.titleInfo ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                    }}
                  />
                  <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddInfo?.titleInfo && errors?.AddInfo?.titleInfo?.message}</label>
                </section>
                <section className='my-1 relative w-full'>
                  <TextField autoComplete="off"
                    sx={{ fontFamily: 'FaLight' }}
                    {...register(`AddInfo.typeInfo`)}
                    tabIndex={3}
                    error={errors?.AddInfo && errors?.AddInfo.typeInfo && true}
                    className='w-full lg:my-0 font-[FaLight]'
                    dir='ltr'
                    size='small'
                    label='type'
                    InputProps={{
                      style: { color: errors?.AddInfo && errors?.AddInfo.typeInfo ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                    }}
                  />
                  <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddInfo && errors?.AddInfo.typeInfo && errors?.AddInfo.typeInfo.message}</label>
                </section>
              </section>
            </form>
          </CardBody>
          <CardBody className='EnFont w-[98%] h-[70vh] mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[73vh] `}>
              <thead >
                <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      Id
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      Title
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      Type
                    </Typography>
                  </th>
                  <th style={{ borderBottomColor: color?.color }}
                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      Command
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                {state.map((option: GetBaseTypes, index) => {
                  return (
                    <tr key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                      <td style={{ width: '3%' }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-[700] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {index + 1}
                        </Typography>
                      </td>
                      <td style={{ width: "30%" }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {option.title}
                        </Typography>
                      </td>
                      <td style={{ width: '30%' }} className='p-1'>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                          {option.type}
                        </Typography>
                      </td>
                      <td style={{ width: '5%' }} className='p-1'>
                        <div className='container-fluid mx-auto p-0.5'>
                          <div className="flex flex-row justify-evenly">
                            <Button
                              style={{ background: color?.color }}
                              size="sm"
                              className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              <InsertDriveFileIcon
                                onClick={() => window.open(`/Home/BaseInfoManagement/Details?baseTypeId=${option.id}`)}
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />

                            </Button>
                            <Button
                              onClick={() => {
                                setUpdateBaseType({
                                  id: option.id, title: option.title, type: option.type
                                }),
                                  handleOpen();
                              } }
                              style={{ background: color?.color }}
                              size="sm"
                              className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              <EditIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                            </Button>
                            <Button
                              onClick={() => DeleteBaseInfo(option.id)}
                              style={{ background: color?.color }}
                              size="sm"
                              className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              <DeleteIcon
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
            </table>
            <Dialog dismiss={{
              escapeKey: true,
              referencePress: true,
              referencePressEvent: 'click',
              outsidePress: false,
              outsidePressEvent: 'click',
              ancestorScroll: false,
              bubbles: true
            }} size='sm' className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <DialogHeader dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} flex justify-between capitalize`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                edit base type
                <IconButton variant="text" color="blue-gray" onClick={() => { handleOpen(); } }  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
              <DialogBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                  className='relative z-[10]'>
                  <div dir='rtl' className="w-full">
                    <Button onClick={() => EditBaseType()} size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      <SaveIcon className='p-1' />
                    </Button>
                  </div>
                  <section className='grid grid-cols-1 gap-y-5 my-2'>
                    <section className='my-2 relative w-full'>
                      <TextField autoComplete="off"
                        sx={{ fontFamily: 'FaLight' }}
                        tabIndex={2}
                        defaultValue={updateBaseType.title}
                        error={(updateBaseType.title == '' || updateBaseType.title == null) && true}
                        focused={updateBaseType.title != null ? true : false}
                        className='w-full lg:my-0 font-[FaLight]'
                        dir='ltr'
                        size='small'
                        label='Title'
                        InputProps={{
                          style: { color: (updateBaseType.title == '' || updateBaseType.title == null) ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                        }}
                        onChange={(event) => setUpdateBaseType({ ...updateBaseType, title: event.target.value })}
                      />
                      <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{(updateBaseType.title == '' || updateBaseType.title == null) && 'اجباری'}</label>
                    </section>
                    <section className='my-2 relative w-full'>
                      <TextField autoComplete="off"
                        sx={{ fontFamily: 'FaLight' }}
                        defaultValue={updateBaseType.type}
                        tabIndex={2}
                        error={(updateBaseType.type == '' || updateBaseType.type == null) && true}
                        focused={updateBaseType.type != null ? true : false}
                        className='w-full lg:my-0 font-[FaLight]'
                        dir='ltr'
                        size='small'
                        label='Type'
                        InputProps={{
                          style: { color: (updateBaseType.type == '' || updateBaseType.type == null) ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                        }}
                        onChange={(event) => setUpdateBaseType({ ...updateBaseType, type: event.target.value })}
                      />
                      <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{(updateBaseType.type == '' || updateBaseType.type == null) && 'اجباری'}</label>
                    </section>
                  </section>
                </form>
              </DialogBody>
            </Dialog>
          </CardBody>
        </section>
      </ThemeProvider >
    </>
  )
}

export default BaseInfoManagementTable; 