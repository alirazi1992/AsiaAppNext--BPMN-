'use client';
import { Button, CardBody, Dialog, DialogBody, DialogHeader, IconButton, Input, Menu, MenuList, Tooltip, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import Loading from '../../shared/loadingResponse';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { GetUserEmailModel, PesonalEmailsModel } from '@/app/models/HR/models';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import { Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material';
import { LoadingModel } from '@/app/models/sharedModels';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { AxiosResponse } from 'axios';
import TableSkeleton from '../../shared/TableSkeleton';
import EditIcon from '@mui/icons-material/Edit';
import UpdateEmail from './UpdateEmail';


export const PersonalEmails = () => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    let loading = {
        loadingTable: false,
        loadingRes: false
    }
    const [loadings, setLoadings] = useState<LoadingModel>(loading)
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object().shape({
        Email: yup.object().shape({
            address: yup.string().required('اجباری').matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,})$/, 'ایمیل نامعتبر'),
        }),
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
    } = useForm<PesonalEmailsModel>(
        {
            defaultValues: {
                Email: {
                    address: '',
                    isDefault: false
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );

    const errors = formState.errors;
    const outerTheme = useTheme();
    const [emailItems, setEmailItems] = useState<GetUserEmailModel[]>([])

    const DeleteEmailItem = async (id: number) => {
        let url: string;
        if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserEmail?id=${id}`;
        } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserEmail?id=${id}`
        }
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'حذف ایمیل',
            text: 'آیا از حذف این ایمیل اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, Delete it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.Email) {
                    setLoadings((state) => ({ ...state, loadingRes: true }))
                    let method = 'delete';
                    let data = {}
                    let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                    if (response) {
                        setLoadings((state) => ({ ...state, loadingRes: false }))
                        if (response.data.status && response.data.data) {
                            let array = emailItems.filter((item) => item.id !== id)
                            setEmailItems([...array])
                        } else {
                            Swal.fire({
                                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: 'حذف ایمیل',
                                text: response.data.message,
                                icon: response.data.status ? "warning" : 'error',
                                confirmButtonColor: "#22c55e",
                                confirmButtonText: "OK"
                            })
                        }

                    }
                }
            }
        })
    }

    const OnSubmit = async () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ذخیره ایمیل',
            text: 'آیا از ذخیره ایمیل اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, Save it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.Email) {
                    setLoadings((state) => ({ ...state, loadingRes: true }))
                    let url: string;
                    let data: any;
                    let method = 'put';
                    if (User.userId != null) {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AddUserEmail`;
                        data = {
                            userId: User.userId,
                            "email": {
                                "address": getValues('Email.address'),
                                "isDefault": getValues('Email.isDefault')
                            }
                        }
                        let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            setLoadings((state) => ({ ...state, loadingRes: false }))
                            if (response.data.status && response.data.data) {
                                reset()
                                setEmailItems((state) => ([...state, {
                                    id: response.data.data,
                                    isDefault: data.email.isDefault,
                                    address: data.email.address
                                }]))
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ذخیره ایمیل',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK"
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AddCurrentUserEmail`
                        data = {
                            "address": getValues('Email.address'),
                            "isDefault": getValues('Email.isDefault')
                        }
                        let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            setLoadings((state) => ({ ...state, loadingRes: false }))
                            if (response.data.status && response.data.data) {
                                reset()
                                setEmailItems((state) => ([...state, {
                                    id: response.data.data,
                                    isDefault: data.isDefault,
                                    address: data.address
                                }]))
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ذخیره ایمیل',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK"
                                })

                            }
                        }
                    }
                } else {
                    Swal.fire({
                        background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'ذخیره ایمیل',
                        text: 'از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                        icon: "warning",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK"
                    })
                }
            }
        })
    }

    useEffect(() => {
        const GetEmailList = async () => {
            setLoadings((state) => ({ ...state, loadingTable: true }))
            let url: string;
            if (User.userId != null) {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserEmails?userId=${User.userId}`;
            } else {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserEmails`;
            }
            let data = {};
            let method = 'get';
            let response: AxiosResponse<Response<GetUserEmailModel[]>> = await AxiosRequest({ url, data, method, credentials: true })
            if (response) {
                setLoadings((state) => ({ ...state, loadingTable: false }))
                if (response.data.status && response.data.data.length > 0) {
                    if (response.data.status && response.data.data.length > 0) {
                        setEmailItems(response.data.data)
                    } else {
                        setEmailItems([])
                    }
                }
            }
        }
        GetEmailList()
    }, [User.userName, User.userId])

    const [item, setItem] = useState<GetUserEmailModel | null>(null);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const handleUpdateDoc = () => setOpenUpdate(!openUpdate)
    const handleData = (data: GetUserEmailModel) => {
        let index: number = emailItems.indexOf(emailItems.find(x => x.id == data.id)!)
        let option: GetUserEmailModel = emailItems.find(x => x.id == data.id)!
        data != null ? emailItems.splice(index, 1, {
            ...option,
            address: data.address,
            isDefault: data.isDefault
        }) : null
    };
    const UpdateItem = (op: GetUserEmailModel) => {
        setItem(op)
        handleUpdateDoc()
    }
    const handleState = (data: boolean) => {
        setOpenUpdate(data);
    };
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

    return (
        <>
            {loadings.loadingRes == true && <Loading />}
            <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} rounded-lg shadow-md h-full mx-auto my-2 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                    dir='rtl'
                    onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10]'>
                    <div dir='rtl' className="w-max ">
                        <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save Emails' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SaveIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <ThemeProvider theme={customTheme(outerTheme)}>
                        <section className='grid grid-cols-1 md:grid-cols-3 gap-x-1 gap-y-5 my-2'>
                            <div className='p-1 relative'>
                                <TextField
                                    {...register('Email.address')}
                                    autoComplete="off"
                                    size='small'
                                    dir='ltr'
                                    tabIndex={1}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                    focused
                                    error={errors?.Email && errors?.Email?.address && true}
                                    label="ایمیل"
                                    sx={{ width: '100%' }}
                                    InputProps={{
                                        style: { color: errors?.Email?.address ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.Email && errors?.Email.address?.message}</label>
                            </div>
                            <div className='p-1 relative md:flex md:justify-center '>
                                <FormControlLabel
                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                    control={<Checkbox
                                        sx={{
                                            color: color?.color,
                                            '&.Mui-checked': {
                                                color: color?.color,
                                            },
                                        }}  {...register('Email.isDefault')}
                                        checked={watch('Email.isDefault')}
                                        onChange={(event) => { setValue('Email.isDefault', event.target.checked), trigger() }}
                                    />} label="is Default" />
                            </div>
                        </section>
                    </ThemeProvider>
                </form>
            </CardBody>
            <section dir='ltr' className='w-[98%] h-[68vh] relative mx-auto overflow-auto p-0 my-3' >
                {loadings.loadingTable == false ? <table dir="rtl" className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[68vh] relative text-center `}>
                    <thead className='sticky z-[30] top-0 left-0 w-full'>
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>

                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    ایمیل
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    isDefault
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    عملیات
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {emailItems!.length > 0 && emailItems?.map((item: GetUserEmailModel, index: number) => {
                            return (
                                <tr key={'email' + index} style={{ height: '60px' }} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} py-5 border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                    <td style={{ minWidth: '120px' }} className='p-1 relative'>
                                        <Typography
                                            dir='ltr'
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.address}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '10%' }} >
                                        <Checkbox
                                            checked={item.isDefault}
                                            sx={{
                                                color: color?.color,
                                                '&.Mui-checked': {
                                                    color: color?.color,
                                                },
                                            }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    </td>
                                    <td style={{ width: "5%" }} className='px-1'>
                                        <div className='container-fluid mx-auto px-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <Button
                                                    onClick={() => UpdateItem(item)}
                                                    size="sm"
                                                    className="p-1 mx-1"
                                                    style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    <EditIcon
                                                        fontSize='small'
                                                        sx={{ color: 'white' }}
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                    />
                                                </Button>
                                                <Button
                                                    onClick={() => DeleteEmailItem(item.id)}
                                                    size="sm"
                                                    className="p-1 mx-1"
                                                    style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    <DeleteIcon
                                                        fontSize='small'
                                                        sx={{ color: 'white' }}
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                    />
                                                </Button>
                                            </div></div></td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table> : <TableSkeleton />}
            </section>
            <Dialog dismiss={{
                escapeKey: true,
                referencePress: true,
                referencePressEvent: 'click',
                outsidePress: false,
                outsidePressEvent: 'click',
                ancestorScroll: false,
                bubbles: true
            }} size='sm' className={`absolute top-0 min-h-[55vh] overflow-y-scroll  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openUpdate} handler={handleUpdateDoc}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between sticky top-0 left-0`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <IconButton variant="text" color="blue-gray" onClick={() => { handleUpdateDoc(); } }  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                <DialogBody dir='rtl'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <UpdateEmail getData={item} setNewData={handleData} state={handleState} />
                </DialogBody>
            </Dialog>
        </>
    )
}
export default PersonalEmails
