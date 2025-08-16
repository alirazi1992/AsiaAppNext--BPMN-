'use client';
import { Button, CardBody, Dialog, DialogBody, DialogHeader, IconButton, Tooltip, Typography } from '@material-tailwind/react';
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
import { GetUserPhonesModel, PesonalPhonesModel } from '@/app/models/HR/models';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import { Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material';
import { LoadingModel } from '@/app/models/sharedModels';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { AxiosResponse } from 'axios';
import TableSkeleton from '../../shared/TableSkeleton';
import UpdatePhone from './UpdatePhone';
import EditIcon from '@mui/icons-material/Edit';


export const PersonalPhone = () => {
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
        Phone: yup.object().shape({
            phoneNo: yup.string().required('اجباری').matches(/^[1-9]\d{9}$/, 'شماره تماس نامعتبر است')
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
    } = useForm<PesonalPhonesModel>(
        {
            defaultValues: {
                Phone: {
                    phoneNo: '',
                    isDefault: false,
                    isFax: false,
                    isMobile: false
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );

    const errors = formState.errors;
    const outerTheme = useTheme();

    const [phoneItems, setPhoneItems] = useState<GetUserPhonesModel[]>([])

    const DeletePhoneItem = async (id: number) => {
        let url: string;
        if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserPhoneNumber?id=${id}`;
        } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserPhoneNumber?id=${id}`
        }
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'حذف شماره تماس',
            text: 'آیا از حذف این شماره تماس اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, Delete it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.Phone) {
                    setLoadings((state) => ({ ...state, loadingRes: true }))
                    let method = 'delete';
                    let data = {}
                    let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                    if (response) {
                        setLoadings((state) => ({ ...state, loadingRes: false }))
                        if (response.data.status && response.data.data) {
                            let array = phoneItems.filter((item) => item.id !== id)
                            setPhoneItems([...array])

                        } else {
                            Swal.fire({
                                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: 'حذف شماره تماس',
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
            title: 'ذخیره شماره تماس',
            text: 'آیا از ذخیره شماره تماس اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, save it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.Phone) {
                    setLoadings((state) => ({ ...state, loadingRes: true }))
                    let url: string;
                    let data: any;
                    let method = 'put';
                    if (User.userId != null) {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AddUserPhoneNumber`;
                        data = {
                            userId: User.userId,
                            number: {
                                "number": '98' + getValues('Phone.phoneNo'),
                                "isDefault": getValues('Phone.isDefault'),
                                "isFax": getValues('Phone.isFax'),
                                "isMobile": getValues('Phone.isMobile')
                            }
                        }
                        let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            setLoadings((state) => ({ ...state, loadingRes: false }))
                            if (response.data.status && response.data.data) {
                                reset()

                                setPhoneItems((state) => ([...state, {
                                    id: response.data.data,
                                    isDefault: data.number.isDefault,
                                    isFax: data.number.isFax,
                                    isMobile: data.number.isMobile,
                                    number: data.number.phoneNo
                                }]))
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ذخیره شماره تماس',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK"
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AddCurrentUserPhoneNumber`
                        data = {
                            "number": '98' + getValues('Phone.phoneNo'),
                            "isDefault": getValues('Phone.isDefault'),
                            "isFax": getValues('Phone.isFax'),
                            "isMobile": getValues('Phone.isMobile')
                        }
                        let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            setLoadings((state) => ({ ...state, loadingRes: false }))
                            if (response.data.status && response.data.data) {
                                reset()

                                setPhoneItems((state) => ([...state, {
                                    id: response.data.data,
                                    isDefault: data.isDefault,
                                    isFax: data.isFax,
                                    isMobile: data.isMobile,
                                    number: data.number
                                }]))
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ذخیره شماره تماس',
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
                        title: 'ذخیره شماره تماس',
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
        const GetPhoneList = async () => {
            setLoadings((state) => ({ ...state, loadingTable: true }))
            let url: string;
            if (User.userId != null) {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserPhoneNumbersList?userId=${User.userId}`;
            } else {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserPhoneNumbersList`;
            }
            let data = {};
            let method = 'get';
            let response: AxiosResponse<Response<GetUserPhonesModel[]>> = await AxiosRequest({ url, data, method, credentials: true })
            if (response) {
                setLoadings((state) => ({ ...state, loadingTable: false }))
                if (response.data.status && response.data.data.length > 0) {
                    if (response.data.status && response.data.data.length > 0) {
                        setPhoneItems(response.data.data)
                    } else {
                        setPhoneItems([])
                    }
                }
            }
        }
        GetPhoneList()
    }, [User.userName, User.userId])

    const [item, setItem] = useState<GetUserPhonesModel | null>(null);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const handleUpdateDoc = () => setOpenUpdate(!openUpdate)

    const handleData = (data: GetUserPhonesModel) => {
        let index: number = phoneItems.indexOf(phoneItems.find(x => x.id == data.id)!)
        let option: GetUserPhonesModel = phoneItems.find(x => x.id == data.id)!
        data != null ? phoneItems.splice(index, 1, {
            ...option,
            isDefault: data.isDefault,
            isFax: data.isFax,
            isMobile: data.isMobile,
            number: data.number
        }) : null
    };

    const UpdateItem = (op: GetUserPhonesModel) => {
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
                        <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save Phone Numbers' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SaveIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <ThemeProvider theme={customTheme(outerTheme)}>
                        <section className='grid grid-cols-1 md:grid-cols-4 gap-x-1 gap-y-5 my-2'>
                            <div className='p-1 relative'>
                                <TextField
                                    {...register('Phone.phoneNo')}
                                    autoComplete="off"
                                    size='small'
                                    dir='ltr'
                                    tabIndex={1}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                    focused
                                    error={errors?.Phone && errors?.Phone?.phoneNo && true}
                                    label="شماره تماس"
                                    sx={{ width: '100%' }}
                                    InputProps={{
                                        style: { color: errors?.Phone?.phoneNo ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                        startAdornment: (
                                            <InputAdornment position="end">
                                                <span className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} bg-[#607d8b70] rounded-sm border-[#607d8b] px-2 mr-2`}>98</span>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.Phone && errors?.Phone!.phoneNo?.message}</label>
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
                                        }}  {...register('Phone.isDefault')}
                                        checked={watch('Phone.isDefault')}
                                        onChange={(event) => { setValue('Phone.isDefault', event.target.checked), trigger() }}
                                    />} label="is Default" />
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
                                        }}  {...register('Phone.isMobile')}
                                        checked={watch('Phone.isMobile')}
                                        onChange={(event) => { setValue('Phone.isMobile', event.target.checked), trigger() }}
                                    />} label="is Mobile" />
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
                                        }}  {...register('Phone.isFax')}
                                        checked={watch('Phone.isFax')}
                                        onChange={(event) => { setValue('Phone.isFax', event.target.checked), trigger() }}
                                    />} label="is Fax" />
                            </div>
                        </section>
                    </ThemeProvider>
                </form>
            </CardBody>
            <section dir='ltr' className='w-[98%] h-[72vh] relative mx-auto overflow-auto p-0 my-3' >
                {loadings.loadingTable == false ? <table dir="rtl" className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[70vh] relative text-center `}>
                    <thead className='sticky z-[30] top-0 left-0 w-full'>
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>

                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    شماره
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
                                    isMobile
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    isFax
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

                        {
                            phoneItems!.length > 0 && phoneItems?.map((item: GetUserPhonesModel, index: number) => {
                                return (
                                    <tr key={'phone' + index} style={{ height: '60px' }} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} py-5 border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                        <td >
                                            <Typography
                                                dir='ltr'
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.number}
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
                                        <td style={{ width: '10%' }} >
                                            <Checkbox
                                                checked={item.isMobile}
                                                sx={{
                                                    color: color?.color,
                                                    '&.Mui-checked': {
                                                        color: color?.color,
                                                    },
                                                }}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        </td>
                                        <td style={{ width: '10%' }} >
                                            <Checkbox
                                                checked={item.isFax}
                                                sx={{
                                                    color: color?.color,
                                                    '&.Mui-checked': {
                                                        color: color?.color,
                                                    },
                                                }}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        </td>
                                        <td style={{ width: "3%" }} className='px-1'>
                                            <div className='container-fluid mx-auto px-0.5'>
                                                <div className="flex flex-row justify-evenly">
                                                    <Button
                                                        onClick={() => UpdateItem(item)}
                                                        size="sm"
                                                        className="p-1 mx-1"
                                                        style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        <EditIcon
                                                            fontSize='small'
                                                            sx={{ color: 'white' }}
                                                            className='p-1'
                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                        />
                                                    </Button>
                                                    <Button
                                                        onClick={() => DeletePhoneItem(item.id)}
                                                        size="sm"
                                                        className="p-1 mx-1"
                                                        style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
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
                    <UpdatePhone getData={item} setNewData={handleData} state={handleState} />
                </DialogBody>
            </Dialog>
        </>
    )
}
export default PersonalPhone
