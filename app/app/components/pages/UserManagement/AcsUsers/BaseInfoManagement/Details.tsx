'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, Drawer, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import ButtonComponent from '@/app/components/shared/ButtonComponent';
import useStore from '@/app/hooks/useStore';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
// icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useAxios from '@/app/hooks/useAxios';
import { AddValueModel, GetBaseInfoValue } from '@/app/models/UserManagement/BaseInfo';
import { Response } from '@/app/models/HR/sharedModels';
import { AxiosResponse } from 'axios';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import { useSearchParams } from 'next/navigation';
import { TextField } from '@mui/material';

const DetailsTable = () => {
  const { AxiosRequest } = useAxios()
  const themeMode = useStore(themeStore, (state) => state)
  const color = useStore(colorStore, (state) => state)
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams()
  const [edited, setEdited] = useState<string>("")
  const handleOpen = () => setOpen(!open);
  type LoadingModel = {
    tableLoading: boolean,
    responseLoading: boolean
  }
  let loadings = {
    tableLoading: false,
    responseLoading: false
  }
  const [loading, setLoading] = useState<LoadingModel>(loadings)
  const [baseValues, setBaseValues] = useState<GetBaseInfoValue[]>([])
  const schema = yup.object().shape({
    AddValue: yup.object(({
      value: yup.string().required('اجباری'),
    })).required(),
  })
  let update = {
    id: 0,
    value: ''
  }
  const [updateBaseVal, setUpdateBaseVal] = useState<GetBaseInfoValue>(update)
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
  } = useForm<AddValueModel>(
    {
      defaultValues: {
        AddValue: {
          value: '',
        },
      }, mode: 'all',
      resolver: yupResolver(schema)
    }
  );
  const errors = formState.errors
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

  const GetBaseValueTypes = useCallback(async () => {
    setLoading((state) => ({ ...state, tableLoading: true }))
    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/GetBaseValueTypes?baseTypeId=${searchParams.get('baseTypeId')}`;
    let method = 'get';
    let data = {};
    if (searchParams.get('baseTypeId') != null) {
      let response: AxiosResponse<Response<GetBaseInfoValue[]>> = await AxiosRequest({ url, method, data, credentials: true });
      if (response) {
        setLoading((state) => ({ ...state, tableLoading: false }))
        if (response.data.status && response.data.data) {
          setBaseValues(response.data.data)
        } else {
          setBaseValues([])
        }
      }
    }
  }, [searchParams])

  const DeleteBaseInfoValue = (id: number) => {
    Swal.fire({
      title: "Delete BaseInfoValue",
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      text: "Are you sure?!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      allowOutsideClick: false,
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading((state) => ({ ...state, responseLoading: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/DeleteBaseInfoValue?id=${id}`;
        let method = 'delete';
        let data = {};
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoading((state) => ({ ...state, responseLoading: false }))
          if (response.data.status && response.data.data) {
            let newState = baseValues.filter((item) => item.id != id);
            setBaseValues([...newState])
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              title: "Delete BaseInfoValue",
              text: response.data.message,
              icon: (response.data.status == false) ? "error" : "warning",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK",
              allowOutsideClick: false,
            })
          }
        }
      }


    })
  }

  const EditBaseValue = () => {
    Swal.fire({
      title: 'Update BaseInfoValue',
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      text: "Are you sure?!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "yes, update it!",
      allowOutsideClick: false,
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading((state) => ({ ...state, responseLoading: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/UpdateBaseInfoValue`;
        let method = 'patch';
        let data = {
          "id": updateBaseVal.id,
          'value': updateBaseVal.value,
        };
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
          setLoading((state) => ({ ...state, responseLoading: false }))
          if (response.data.status && response.data.data != 0) {
            let index = baseValues.indexOf(baseValues.find((item) => item.id == updateBaseVal.id)!);
            let newOption: GetBaseInfoValue = {
              id: updateBaseVal.id,
              value: updateBaseVal.value,
            };
            baseValues.splice(index, 1);
            baseValues.push(newOption)
            setBaseValues((state) => ([...state]))
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              title: 'Update BaseInfoValue',
              text: response.data.message,
              icon: (response.data.status == false) ? "error" : "warning",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK",
              allowOutsideClick: false,
            })
          }
          handleOpen()
        }
      }


    })
  }

  useEffect(() => {
    GetBaseValueTypes()
  }, [GetBaseValueTypes]
  )

  const OnSubmit = () => {
    Swal.fire({
      title: "Add BaseInfoValue",
      background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
      text: "Are you sure?!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "yes, add it!",
      allowOutsideClick: false,
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading((state) => ({ ...state, responseLoading: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/AddBaseInfoValue`
        let method = 'put';
        let data = {
          "id": Number(searchParams.get('baseTypeId')),
          "value": getValues('AddValue.value')
        }
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
          if (response.data.status && response.data.data != 0) {
            setBaseValues([...baseValues, {
              id: response.data.data,
              value: data.value
            }])
            setLoading((state) => ({ ...state, responseLoading: false }))
            setValue('AddValue.value', '')
          } else {
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              title: "Add BaseInfoValue",
              text: response.data.message,
              icon: (response.data.status == false) ? "error" : "warning",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK",
              allowOutsideClick: false,
            })
          }
        }
      }
    })
  }


  return (
    <ThemeProvider theme={customTheme(outerTheme)}>
      <section>
        <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} h-full w-[98%] my-3 mx-auto `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
            <section className='my-1 relative md:w-2/4'>
              <TextField autoComplete="off"
                sx={{ fontFamily: 'FaLight' }}
                {...register(`AddValue.value`)}
                tabIndex={2}
                error={errors?.AddValue && errors?.AddValue?.value && true}
                className='w-full lg:my-0 font-[FaLight]'
                dir='ltr'
                size='small'
                label='value'
                InputProps={{
                  style: { color: errors?.AddValue?.value ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                }}
              />
              <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddValue?.value && errors?.AddValue?.value?.message}</label>
            </section>
          </form>

        </CardBody>
        <CardBody className='EnFont w-[98%] h-[500px] mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {loading.tableLoading == false ? baseValues.length > 0 && <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center h-auto `}>
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
                    Title
                  </Typography>
                </th>
                <th style={{ borderBottomColor: color?.color }}
                  className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    Commands
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
              {baseValues.map((option: GetBaseInfoValue, index: number) => {
                return (
                  <tr style={{ height: "40px" }} key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                    <td style={{ width: '3%' }} className='p-1'>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {index + 1}
                      </Typography>
                    </td>
                    <td className='p-1'>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {option.value}
                      </Typography>
                    </td>
                    <td style={{ width: '5%' }} className='p-1'>
                      <div className='container-fluid mx-auto p-0.5'>
                        <div className="flex flex-row justify-evenly">
                          <Button
                            onClick={() => { setUpdateBaseVal({ id: option.id, value: option.value }), handleOpen(); } }
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
                            onClick={() => DeleteBaseInfoValue(option.id)}
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
            <Dialog dismiss={{
              escapeKey: true,
              referencePress: true,
              referencePressEvent: 'click',
              outsidePress: false,
              outsidePressEvent: 'click',
              ancestorScroll: false,
              bubbles: true
            }} size='sm' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} absolute top-0 `} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <DialogHeader dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} flex justify-between capitalize`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                edit base info
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
                    <Button onClick={() => EditBaseValue()} size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      <SaveIcon className='p-1' />
                    </Button>
                  </div>
                  <section className='my-2 relative w-full'>
                    <TextField autoComplete="off"
                      sx={{ fontFamily: 'FaLight' }}
                      defaultValue={updateBaseVal.value}
                      tabIndex={2}
                      error={(updateBaseVal.value == '' || updateBaseVal.value == null) && true}
                      focused={updateBaseVal.value != null ? true : false}
                      className='w-full lg:my-0 font-[FaLight]'
                      dir='ltr'
                      size='small'
                      label='Type'
                      InputProps={{
                        style: { color: (updateBaseVal.value == '' || updateBaseVal.value == null) ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                      }}
                      onChange={(event) => setUpdateBaseVal({ ...updateBaseVal, value: event.target.value })}
                    />
                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{(updateBaseVal.value == '' || updateBaseVal.value == null) && 'اجباری'}</label>
                  </section>
                </form>
              </DialogBody>
            </Dialog>

          </table> : <TableSkeleton />}
        </CardBody>
      </section>
    </ThemeProvider>
  )
}
export default DetailsTable;