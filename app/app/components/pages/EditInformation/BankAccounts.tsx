import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2';
import SaveIcon from '@mui/icons-material/Save';
import { BanksAccountModel, EducationDegreeModel, GetBankAccountModels } from '@/app/models/HR/models';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { Button, CardBody, Dialog, DialogBody, DialogHeader, IconButton, Tooltip } from '@material-tailwind/react';
import DeleteIcon from '@mui/icons-material/Delete';
import { AxiosResponse } from 'axios';
import { Response } from '@/app/models/HR/sharedModels';
import useAxios from '@/app/hooks/useAxios';
import Loading from '../../shared/loadingResponse';
import UpdateUsersStore from '@/app/zustandData/updateUsers'
import TableSkeleton from '../../shared/TableSkeleton';
import { LoadingModel } from '@/app/models/sharedModels';
import UpdatebankAccount from './UpdateBankAccount';
import EditIcon from '@mui/icons-material/Edit';

const BamkAccounts = () => {
    let loading = {
        loadingTable: false,
        loadingRes: false
    }
    const { AxiosRequest } = useAxios()
    const [loadings, setLoadings] = useState<LoadingModel>(loading)
    const [bankAccounts, setBankAccounts] = useState<GetBankAccountModels[]>([])
    const [bankList, setBankList] = useState<EducationDegreeModel[]>([])
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object().shape({
        Bank: yup.object().shape({
            accountNo: yup.string().required("اجباری").matches(/^[0-9]+$/, 'شماره حساب نامعنبر'),
            debitCardNo: yup.string().required('اجباری').matches(/^[0-9]{16}$/, 'شماره کارت نامعنبر'),
            shebaNo: yup.string().required('اجباری').matches(/^[0-9]+$/, 'شماره شبا نامعنبر'),
            bankId: yup.number().required('اجباری').min(1, 'اجباری')
        }).required()
    });

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        reset,
        formState,
        control,
        trigger,
    } = useForm<BanksAccountModel>(
        {
            defaultValues: {
                Bank:
                {
                    accountNo: '',
                    bankId: 0,
                    debitCardNo: '',
                    isDefault: false,
                    shebaNo: ''
                }

            }, mode: 'onChange',
            resolver: yupResolver(schema)
        }
    );

    const errors = formState.errors;
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

    const DeleteBankAccount = async (id: number) => {
        let url: string;
        if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserBankAccount?id=${id}`;
        } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserBankAccount?id=${id}`
        }
        Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'حذف اطلاعات بانکی',
            text: 'آیا از حذف این اطلاعات بانکی اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, Delete it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.Bank) {
                    setLoadings((state) => ({ ...state, loadingRes: true }))
                    let method = 'delete';
                    let data = {}
                    let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                    if (response) {
                        setLoadings((state) => ({ ...state, loadingRes: false }))
                        if (response.data.status && response.data.data) {
                            let array = bankAccounts.filter((item) => item.id !== id)
                            setBankAccounts([...array])
                        } else {
                            Swal.fire({
                                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: 'حذف اطلاعات بانکی',
                                text: response.data.message,
                                icon: response.data.status ? "warning" : 'error',
                                confirmButtonColor: "#22c55e",
                                confirmButtonText: "OK!",
                            })
                        }

                    }
                }
            }
        })
    }


    const OnSubmit = async () => {
        Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ذخیره اطلاعات بانکی',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, save it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.Bank) {
                    setLoadings((state) => ({ ...state, loadingRes: true }))
                    let url: string;
                    let data: any;
                    let method = 'put';
                    if (User.userId != null) {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveUserBankAccounts`;
                        let data = {
                            "userId": User.userId,
                            "bankAccounts": {
                                "bankId": getValues('Bank.bankId'),
                                "accountNo": getValues('Bank.accountNo'),
                                "shebaNo": getValues('Bank.shebaNo'),
                                "debitCardNo": getValues('Bank.debitCardNo'),
                                "isDefault": getValues('Bank.isDefault')
                            }
                        }
                        let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            setValue('Bank', {
                                accountNo: '',
                                bankId: 0,
                                debitCardNo: '',
                                shebaNo: '',
                                isDefault: false
                            })
                            setLoadings((state) => ({ ...state, loadingRes: false }))
                            if (response.data.status && response.data.data != null) {
                                reset()
                                setBankAccounts((state) => ([...state, {
                                    accountNo: data.bankAccounts.accountNo,
                                    bankId: data.bankAccounts.bankId,
                                    debitCardNo: data.bankAccounts.debitCardNo,
                                    id: response.data.data,
                                    isDefault: data.bankAccounts.isDefault ?? false,
                                    shebaNo: data.bankAccounts.shebaNo
                                }]))

                            } else {
                                Swal.fire({
                                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ذخیره اطلاعات بانکی',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveCurrentUserBankAccounts`
                        data = {
                            "bankId": getValues('Bank.bankId'),
                            "accountNo": getValues('Bank.accountNo'),
                            "shebaNo": getValues('Bank.shebaNo'),
                            "debitCardNo": getValues('Bank.debitCardNo'),
                            "isDefault": getValues('Bank.isDefault')
                        }
                        let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            setValue('Bank', {
                                accountNo: '',
                                bankId: 0,
                                debitCardNo: '',
                                shebaNo: '',
                                isDefault: false
                            })
                            setLoadings((state) => ({ ...state, loadingRes: false }))
                            if (response.data.status) {
                                reset()
                                Swal.fire({
                                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ذخیره اطلاعات بانکی',
                                    text: response.data.message,
                                    icon: 'success',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                                setBankAccounts((state) => ([...state, {
                                    accountNo: data.accountNo,
                                    bankId: data.bankId,
                                    debitCardNo: data.debitCardNo,
                                    id: response.data.data,
                                    isDefault: data.isDefault ?? false,
                                    shebaNo: data.shebaNo
                                }]))
                            } else {
                                Swal.fire({
                                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ذخیره اطلاعات بانکی',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })

                            }
                        }
                    }
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'ذخیره اطلاعات بانکی',
                        text: 'از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                        icon: "warning",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK!",
                    })
                }
            }
        })
    }

    useEffect(() => {
        const GetBankList = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetBanksList`;
            let method = 'get';
            let data = {}
            let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setBankList(response.data.data.map((item) => {
                        return {
                            value: item.id,
                            label: item.faName,
                            faName: item.faName,
                            id: item.id,
                            name: item.name
                        }
                    }))

                }
            }
        }
        GetBankList()
    }, []);

    useEffect(() => {
        const GetBankAccountList = async () => {
            setLoadings((state) => ({ ...state, loadingTable: true }))
            let url: string;
            if (User.userId != null) {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserBankAccounts?userId=${User.userId}`;
            } else {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserBankAccounts`;
            }
            let data = {};
            let method = 'get';
            let response: AxiosResponse<Response<GetBankAccountModels[]>> = await AxiosRequest({ url, data, method, credentials: true })
            if (response) {
                setLoadings((state) => ({ ...state, loadingTable: false }))
                if (response.data.status && response.data.data.length > 0) {
                    if (response.data.status && response.data.data.length > 0) {
                        setBankAccounts(response.data.data)
                    } else {
                        setBankAccounts([])
                    }
                }
            }
        }
        GetBankAccountList()
    }, [User.userName, User.userId])
    const [item, setItem] = useState<GetBankAccountModels | null>(null);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const handleUpdateDoc = () => setOpenUpdate(!openUpdate)

    const handleData = (data: GetBankAccountModels) => {
        let index: number = bankAccounts.indexOf(bankAccounts.find(x => x.id == data.id)!)
        let option: GetBankAccountModels = bankAccounts.find(x => x.id == data.id)!
        data != null ? bankAccounts.splice(index, 1, {
            ...option,
            accountNo: data.accountNo,
            bankId: data.bankId,
            debitCardNo: data.debitCardNo,
            isDefault: data.isDefault,
            shebaNo: data.shebaNo
        }) : null
    };

    const UpdateItem = (op: GetBankAccountModels) => {
        setItem(op)
        handleUpdateDoc()
    }

    const handleState = (data: boolean) => {
        setOpenUpdate(data);
    };


    return (
        <>
            {loadings.loadingRes == true && <Loading />}
            <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} rounded-lg shadow-md h-auto mx-auto `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                    dir='rtl'
                    onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10]'>
                    <div className="w-max ">
                        <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save Bank Accouns' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SaveIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <ThemeProvider theme={customTheme(outerTheme)}>
                        <section className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-x-1 gap-y-5 my-2'>
                            <div className='p-1 relative'>
                                <Select isRtl
                                    placeholder='نام بانک'
                                    maxMenuHeight={200}
                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaMedium]`}
                                    options={bankList}
                                    {...register(`Bank.bankId`)}
                                    onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                                        {
                                            setValue(`Bank.bankId`, option!.id),
                                                trigger(`Bank.bankId`)
                                        }
                                    }
                                    }
                                    value={bankList.find((item) => item.id == getValues(`Bank.bankId`)) ?? null}
                                    theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            color: '#607d8b',
                                            neutral10: `${color?.color}`,
                                            primary25: `${color?.color}`,
                                            primary: '#607d8b',
                                            neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                            neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                            neutral20: errors?.Bank?.bankId ? '#d32f3c' : '#607d8b',
                                            neutral30: errors?.Bank?.bankId ? '#d32f3c' : '#607d8b',
                                            neutral50: errors?.Bank?.bankId ? '#d32f3c' : '#607d8b',
                                        },
                                    })}
                                />
                                <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.Bank?.bankId && errors?.Bank?.bankId?.message}</label>
                            </div>
                            <div className='p-1 relative'>
                                <TextField
                                    dir='ltr'
                                    autoComplete="off"
                                    sx={{ fontFamily: 'FaLight' }}
                                    tabIndex={2}
                                    {...register(`Bank.shebaNo`)}
                                    error={errors?.Bank && errors?.Bank?.shebaNo && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    size='small'
                                    label='شماره شباء'
                                    InputProps={{
                                        style: { color: errors?.Bank?.shebaNo ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.Bank && errors?.Bank?.shebaNo?.message}</label>
                            </div>
                            <div className='p-1 relative'>
                                <TextField autoComplete="off"
                                    dir='ltr'
                                    sx={{ fontFamily: 'FaLight' }}
                                    tabIndex={3}
                                    {...register(`Bank.accountNo`)}
                                    error={errors?.Bank && errors?.Bank?.accountNo && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    size='small'
                                    label='شماره حساب'
                                    InputProps={{
                                        style: { color: errors?.Bank?.accountNo ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.Bank && errors?.Bank?.accountNo?.message}</label>
                            </div>
                            <div className='p-1 relative'>
                                <TextField autoComplete="off"
                                    dir='ltr'
                                    sx={{ fontFamily: 'FaLight' }}
                                    tabIndex={4}
                                    {...register(`Bank.debitCardNo`)}
                                    error={errors?.Bank && errors?.Bank?.shebaNo && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    size='small'
                                    label='شماره کارت'
                                    InputProps={{
                                        style: { color: errors?.Bank?.debitCardNo ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                        inputProps: { maxLength: 16 }
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.Bank && errors?.Bank?.debitCardNo?.message}</label>
                            </div>
                            <div className='p-1 relative '>
                                <FormControlLabel
                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                    control={<Checkbox
                                        sx={{
                                            color: color?.color,
                                            '&.Mui-checked': {
                                                color: color?.color,
                                            },
                                        }}  {...register('Bank.isDefault')}
                                        checked={watch('Bank.isDefault')}
                                        onChange={(event) => { setValue(`Bank.isDefault`, event.target.checked), trigger() }}
                                    />} label="پیش فرض" />
                            </div>

                        </section>
                    </ThemeProvider>
                </form>
            </CardBody>
            <section dir='rtl' className='w-[100%] h-auto lg:h-[72vh] mx-auto  p-0 my-3' >
                {loadings.loadingTable == false ? <table dir="rtl" className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[70vh] md:relative text-center`}>
                    <thead className='sticky z-[3] top-0 left-0 w-full'>
                        <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} p-1.5 text-sm font-[FaBold] whitespace-nowrap leading-none `}
                                >
                                    نام بانک
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} p-1.5 whitespace-nowrap text-sm font-[FaBold] leading-none`}
                                >
                                    شماره شباء
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} p-1.5 whitespace-nowrap text-sm font-[FaBold] leading-none`}
                                >
                                    شماره حساب
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                >
                                    شماره کارت
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                >
                                    is Default
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                >
                                    عملیات
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {
                            bankAccounts.length > 0 && bankAccounts.map((item: GetBankAccountModels, index: number) => {
                                return (
                                    <tr key={index} style={{ height: '55px' }} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} py-5 border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                        <td style={{ width: '15%', minWidth: '100px' }} className='p-1 relative'>
                                            <Typography
                                                dir='ltr'
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                            >
                                                {bankList.find((option) => option.id == item.bankId)?.faName}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '25%', minWidth: '100px' }} className='p-1 relative'>
                                            <Typography
                                                dir='ltr'
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                            >
                                                {item.shebaNo}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '25%' }} className='p-1 h-full relative'>
                                            <Typography
                                                dir='ltr'
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                            >
                                                {item.accountNo}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '35%' }} className='p-1 h-full relative'>
                                            <Typography
                                                dir='ltr'
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                            >
                                                {item.debitCardNo}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '10%' }} className=' relative'>
                                            <Checkbox
                                                checked={item.isDefault}
                                                sx={{
                                                    color: color?.color,
                                                    '&.Mui-checked': {
                                                        color: color?.color,
                                                    },
                                                }}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                onChange={(event) => { setValue(`Bank.isDefault`, event.target.checked), trigger() }}
                                            />
                                        </td>
                                        <td style={{ width: "5%" }} className='px-1'>
                                            <div className='container-fluid mx-auto px-0.5'>
                                                <div className="flex flex-row justify-evenly">
                                                    <Button
                                                        style={{ background: color?.color }}
                                                        size="sm"
                                                        className="p-1 mx-1"
                                                        onClick={() => UpdateItem(item)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        <EditIcon
                                                            fontSize='small'
                                                            className='p-1'
                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                        />
                                                    </Button>
                                                    <Button
                                                        style={{ background: color?.color }}
                                                        size="sm"
                                                        className="p-1 mx-1"
                                                        onClick={() => DeleteBankAccount(item.id)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        <DeleteIcon
                                                            fontSize='small'
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
            }} size='sm' className={`absolute top-0 min-h-[55vh] overflow-y-scroll  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openUpdate} handler={handleUpdateDoc} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between sticky top-0 left-0`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <IconButton variant="text" color="blue-gray" onClick={() => { handleUpdateDoc(); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                <DialogBody dir='rtl' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <UpdatebankAccount getData={item} setNewData={handleData} state={handleState} />
                </DialogBody>
            </Dialog>
        </>

    )
}


export default BamkAccounts