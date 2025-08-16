'use client';
import { Button, CardBody, Dialog, DialogBody, DialogHeader, IconButton, Input, Menu, MenuList, Tooltip, Typography } from '@material-tailwind/react';
import React, { useCallback, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import Loading from '../../shared/loadingResponse';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import { yupResolver } from '@hookform/resolvers/yup';
import Select, { ActionMeta, SingleValue } from 'react-select';
import * as yup from "yup";
import { PesonalAddressesModel, GetUserAddressModel, CountryModels, ProvinceModel, CitiesModel, EducationDegreeModel, LocationAddress } from '@/app/models/HR/models';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { LoadingModel } from '@/app/models/sharedModels';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { AxiosResponse } from 'axios';
import TableSkeleton from '../../shared/TableSkeleton';
import UpdateAddress from './UpdateAddress';


const PersonalAddress = () => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    let loading = {
        loadingTable: false,
        loadingRes: false
    }
    const [location, setLoacation] = useState<LocationAddress>({
        countries: [],
        provinces: [],
        cities: [],
        addressType: []
    })

    const [loadings, setLoadings] = useState<LoadingModel>(loading)
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object().shape({
        Address: yup.object().shape({
            address: yup.string().required('اجباری'),
            countryId: yup.number().required().min(1, 'اجباری'),
            provinceId: yup.number().required().min(1, 'اجباری'),
            cityId: yup.number().required().min(1, 'اجباری'),
            addressTypeId: yup.number().required('اجباری').min(1, 'اجباری'),
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
    } = useForm<PesonalAddressesModel>(
        {
            defaultValues: {
                Address: {
                    addressTypeId: 0,
                    cityId: 0,
                    countryId: 0,
                    address: '',
                    postalCode: '',
                    provinceId: 0
                }
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    const outerTheme = useTheme();
    const [addressItems, setAddressItems] = useState<GetUserAddressModel[]>([])

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

    const DeleteAddressItem = async (id: number) => {
        let url: string;
        if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserAddress?id=${id}`;
        } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserAddress?id=${id}`
        }
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'حذف آدرس',
            text: 'آیا از حذف این آدرس اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, Delete it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.Address) {
                    setLoadings((state) => ({ ...state, loadingRes: true }))
                    let method = 'delete';
                    let data = {}
                    let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                    if (response) {
                        setLoadings((state) => ({ ...state, loadingRes: false }))
                        if (response.data.status && response.data.data) {
                            let array = addressItems.filter((item) => item.id !== id)
                            setAddressItems([...array])
                        } else {
                            Swal.fire({
                                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: 'حذف آدرس',
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
            title: 'ذخیره آدرس',
            text: 'آیا از ذخیره شماره تماس اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, save it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.Address) {
                    setLoadings((state) => ({ ...state, loadingRes: true }))
                    let url: string;
                    let data: any;
                    let method = 'put';
                    if (User.userId != null) {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AddUserAddress`;
                        data = {
                            userId: User.userId,
                            address: {
                                "address": getValues('Address.address'),
                                "postalCode": getValues('Address.postalCode'),
                                "addressType": getValues('Address.addressTypeId'),
                                "countryId": getValues('Address.countryId'),
                                "provinceId": getValues('Address.provinceId'),
                                "cityId": getValues('Address.cityId')
                            }
                        }
                        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            setLoadings((state) => ({ ...state, loadingRes: false }))
                            if (response.data.status && response.data.data) {
                                reset()
                                setAddressItems((state) => ([...state, {
                                    id: response.data.data,
                                    addressTypeId: data.address.addressType,
                                    cityId: data.address.cityId,
                                    countryId: data.address.countryId,
                                    address: data.address.address,
                                    provinceId: data.address.provinceId,
                                    postalCode: data.address.postalCode,
                                }]))
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ذخیره آدرس',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!"
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AddCurrentUserAddress`
                        data = {
                            "address": getValues('Address.address'),
                            "postalCode": getValues('Address.postalCode'),
                            "addressType": getValues('Address.addressTypeId'),
                            "countryId": getValues('Address.countryId'),
                            "provinceId": getValues('Address.provinceId'),
                            "cityId": getValues('Address.cityId')
                        }
                        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            setLoadings((state) => ({ ...state, loadingRes: false }))
                            if (response.data.status && response.data.data) {
                                reset()
                                setAddressItems((state) => ([...state, {
                                    id: response.data.data,
                                    addressTypeId: data.addressType,
                                    cityId: data.cityId,
                                    countryId: data.countryId,
                                    address: data.address,
                                    provinceId: data.provinceId,
                                    postalCode: data.postalCode,
                                }]))
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ذخیره آدرس',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!"
                                })

                            }
                        }
                    }
                } else {
                    Swal.fire({
                        background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'ذخیره آدرس',
                        text: 'از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                        icon: "warning",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK!"
                    })
                }
            }
        })
    }

    useEffect(() => {
        const GetAddressList = async () => {
            setLoadings((state) => ({ ...state, loadingTable: true }))
            let url: string;
            if (User.userId != null) {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserAddresses?userId=${User.userId}`;
            } else {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserAddresses`;
            }
            let data = {};
            let method = 'get';
            let response: AxiosResponse<Response<GetUserAddressModel[]>> = await AxiosRequest({ url, data, method, credentials: true })
            if (response) {
                setLoadings((state) => ({ ...state, loadingTable: false }))
                if (response.data.status && response.data.data.length > 0) {
                    if (response.data.status && response.data.data.length > 0) {
                        setAddressItems(response.data.data)
                    } else {
                        setAddressItems([])
                    }
                }
            }
        }
        GetAddressList()
    }, [User.userName, User.userId])

    const GetProvinces = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetProvincesList`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<ProvinceModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            if (response.data.status && response.data.data != null) {
                setLoacation((state) => ({
                    ...state, provinces: response.data.data.map((item: ProvinceModel) => {
                        return {
                            countryId: item.countryId,
                            enName: item.enName,
                            faName: item.faName,
                            id: item.id,
                            label: item.faName,
                            value: item.id
                        }
                    })
                })
                )
            }
        }
    }
    const GetCities = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetCitiesList`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<CitiesModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            if (response.data.status && response.data.data != null) {
                setLoacation((state) => ({
                    ...state, cities: response.data.data.map((item: CitiesModel) => {
                        return {
                            enName: item.enName,
                            faName: item.faName,
                            id: item.id,
                            label: item.faName,
                            provinceId: item.provinceId,
                            value: item.id
                        }
                    })
                })

                )
            }
        }
    }

    const GetAddressTypes = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetAddressTypes`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            if (response.data.status && response.data.data != null) {
                setLoacation((state) => ({
                    ...state, addressType:
                        response.data.data.map((item: EducationDegreeModel) => {
                            return {
                                faName: item.faName,
                                id: item.id,
                                label: item.faName,
                                name: item.name,
                                value: item.id
                            }
                        })
                }))
            }
        }
    }



    useEffect(() => {
        const GetCountries = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetCountries`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<CountryModels[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setLoacation((state) => ({
                        ...state, countries: response.data.data.map((item: CountryModels) => {
                            return {
                                enName: item.enName,
                                faName: item.faName,
                                id: item.id,
                                label: item.faName,
                                value: item.id
                            }
                        })
                    })

                    )
                }
            }
        }
        GetCountries()
        GetProvinces()
        GetAddressTypes()
        GetCities()
    }, [])

    const [item, setItem] = useState<GetUserAddressModel | null>(null);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const handleUpdateDoc = () => setOpenUpdate(!openUpdate)

    const handleData = (data: GetUserAddressModel) => {
        let index: number = addressItems.indexOf(addressItems.find(x => x.id == data.id)!)
        let option: GetUserAddressModel = addressItems.find(x => x.id == data.id)!
        data != null ? addressItems.splice(index, 1, {
            ...option,
            address: data.address,
            addressTypeId: data.addressTypeId,
            cityId: data.cityId,
            countryId: data.countryId,
            postalCode: data.postalCode,
            provinceId: data.provinceId
        }) : null
    };

    const UpdateItems = (op: GetUserAddressModel) => {
        setItem(op)
        handleUpdateDoc()
    }

    const handleState = (data: boolean) => {
        setOpenUpdate(data);
    };

    return (
        <>
            {loadings.loadingRes == true && <Loading />}
            <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} rounded-lg shadow-md h-full mx-auto my-2 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                    dir='rtl'
                    onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10]'>
                    <div dir='rtl' className="w-max ">
                        <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save Address' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SaveIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <ThemeProvider theme={customTheme(outerTheme)}>
                        <section className='grid grid-cols-1 gap-x-1 gap-y-5 my-1'>
                            <section className='grid grid-cols-1 md:grid-cols-5 gap-x-1 gap-y-5 my-2'>
                                <div className='p-1 relative'>
                                    <Select isRtl
                                        maxMenuHeight={300}
                                        placeholder='کشور'
                                        className={`w-full font-[FaLight] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        options={location.countries}
                                        {...register(`Address.countryId`)}
                                        value={location.countries.find((item: CountryModels) => item.id == getValues(`Address.countryId`)) ?? null}
                                        onChange={(option: SingleValue<CountryModels>, actionMeta: ActionMeta<CountryModels>) => {
                                            {
                                                setValue(`Address.countryId`, option!.id),
                                                    setValue(`Address.provinceId`, 0),
                                                    setValue(`Address.cityId`, 0)
                                                    , trigger(`Address.countryId`)
                                            }
                                        }
                                        }
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                color: '#607d8b',
                                                neutral10: `${color?.color}`,
                                                primary25: `${color?.color}`,
                                                primary: '#607d8b',
                                                neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                neutral20: errors?.Address?.countryId ? '#d32f3c' : '#607d8b',
                                                neutral30: errors?.Address?.countryId ? '#d32f3c' : '#607d8b',
                                                neutral50: errors?.Address?.countryId ? '#d32f3c' : '#607d8b',

                                            },
                                        })}
                                    />
                                    <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.Address && errors?.Address!.countryId?.message}</label>
                                </div>
                                <div className='p-1 relative  '>
                                    <Select<ProvinceModel, false, any>
                                        isRtl
                                        placeholder='استان'
                                        {...register(`Address.provinceId`)}
                                        value={location.provinces.find((item) => item.id == getValues(`Address.provinceId`)) ?? null}
                                        maxMenuHeight={300}
                                        className={`w-full font-[FaLight] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        options={location.provinces.filter((item) => item.countryId == getValues(`Address.countryId`))}
                                        onChange={(option: SingleValue<ProvinceModel>, actionMeta: ActionMeta<ProvinceModel>) => {
                                            {
                                                setValue(`Address.provinceId`, option!.id),
                                                    setValue(`Address.cityId`, 0)
                                                trigger(`Address.provinceId`)

                                            }
                                        }
                                        }
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                color: '#607d8b',
                                                neutral10: `${color?.color}`,
                                                primary25: `${color?.color}`,
                                                primary: '#607d8b',
                                                neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                neutral20: errors?.Address?.provinceId ? '#d32f3c' : '#607d8b',
                                                neutral30: errors?.Address?.provinceId ? '#d32f3c' : '#607d8b',
                                                neutral50: errors?.Address?.provinceId ? '#d32f3c' : '#607d8b',
                                            },
                                        })}
                                    />
                                    <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.Address && errors?.Address!.provinceId?.message}</label>
                                </div>
                                <div className='p-1 relative'>
                                    <Select<CitiesModel, false, any> isRtl
                                        placeholder='شهر'
                                        {...register(`Address.cityId`)}
                                        value={location.cities.find((item) => item.id == getValues(`Address.cityId`)) ?? null}
                                        maxMenuHeight={300}
                                        className={`w-full font-[FaLight] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        options={location.cities.filter((item) => item.provinceId == getValues(`Address.provinceId`))}
                                        onChange={(option: SingleValue<CitiesModel>, actionMeta: ActionMeta<CitiesModel>) => {
                                            {
                                                setValue(`Address.cityId`, option!.id),
                                                    trigger(`Address.cityId`)
                                            }
                                        }
                                        }
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                color: '#607d8b',
                                                neutral10: `${color?.color}`,
                                                primary25: `${color?.color}`,
                                                primary: '#607d8b',
                                                neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                neutral20: errors?.Address?.cityId ? '#d32f3c' : '#607d8b',
                                                neutral30: errors?.Address?.cityId ? '#d32f3c' : '#607d8b',
                                                neutral50: errors?.Address?.cityId ? '#d32f3c' : '#607d8b',
                                            },
                                        })}
                                    />
                                    <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.Address && errors?.Address!.cityId?.message}</label>
                                </div>
                                <div className='p-1 relative'>
                                    <Select isRtl
                                        placeholder='نوع آدرس'
                                        value={location.addressType.find((item: EducationDegreeModel) => item.id == getValues(`Address.addressTypeId`)) ?? null}
                                        maxMenuHeight={300}
                                        className={`w-full font-[FaLight] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        options={location.addressType}
                                        {...register(`Address.addressTypeId`)}
                                        onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                                            {
                                                setValue(`Address.addressTypeId`, option!.id)
                                                trigger(`Address.addressTypeId`)
                                            }
                                        }
                                        }
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                color: '#607d8b',
                                                neutral10: `${color?.color}`,
                                                primary25: `${color?.color}`,
                                                primary: '#607d8b',
                                                neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                neutral20: errors?.Address?.addressTypeId ? '#d32f3c' : '#607d8b',
                                                neutral30: errors?.Address?.addressTypeId ? '#d32f3c' : '#607d8b',
                                                neutral50: errors?.Address?.addressTypeId ? '#d32f3c' : '#607d8b',
                                            },
                                        })}
                                    />
                                    <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.Address && errors?.Address!.addressTypeId?.message}</label>
                                </div>
                                <div className='p-1 relative'>
                                    <TextField autoComplete="off"
                                        sx={{ fontFamily: 'FaLight' }}
                                        tabIndex={5}
                                        {...register(`Address.postalCode`)}
                                        error={errors?.Address && errors?.Address?.postalCode && true}
                                        className='w-full lg:my-0 font-[FaLight]'
                                        size='small'
                                        label='کد پستی'
                                        InputProps={{
                                            style: { color: errors?.Address?.postalCode ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                        }}
                                    />
                                    <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.Address && errors?.Address?.postalCode?.message}</label>
                                </div>
                            </section>
                            <div className='p-1 relative'>
                                <TextField autoComplete="off"
                                    sx={{ fontFamily: 'FaLight' }}
                                    tabIndex={4}
                                    {...register(`Address.address`)}
                                    error={errors?.Address && errors?.Address?.address && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    size='small'
                                    label='آدرس'
                                    InputProps={{
                                        style: { color: errors?.Address?.address ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.Address && errors?.Address?.address?.message}</label>
                            </div>

                        </section>
                    </ThemeProvider>
                </form>
            </CardBody>
            <section dir='ltr' className='w-[99%] mx-auto h-[35vh] relative overflow-auto p-0 my-3' >
                {loadings.loadingTable == false ? <table dir="rtl" className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[34vh] relative text-center `}>
                    <thead className='sticky z-[3] top-0 left-0 w-full'>
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    کشور
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    استان
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    شهر
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    انتخاب نوع آدرس
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    آدرس
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    کدپستی
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
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
                            addressItems.length > 0 && addressItems?.map((item: GetUserAddressModel, index: number) => {
                                return (
                                    <tr key={index} style={{ height: '55px' }} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} py-5 border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                        <td style={{ width: '10%', minWidth: '130px' }} className='p-1 relative'>
                                            <Typography
                                                dir='ltr'
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {location.countries.find((option) => option.id == item.countryId)?.faName}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '10%', minWidth: '130px' }} className='p-1 relative'>
                                            <Typography
                                                dir='ltr'
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {location.provinces.find((option) => option.id == item.provinceId)?.faName}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '10%', minWidth: '130px' }} className='p-1 relative'>
                                            <Typography
                                                dir='ltr'
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {location.cities.find((option) => option.id == item.cityId)?.faName}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '10%', minWidth: '130px' }} className='p-1 relative'>
                                            <Typography
                                                dir='ltr'
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {location.addressType.find((option) => option.id == item.addressTypeId)?.faName}
                                            </Typography>
                                        </td>
                                        <td style={{ minWidth: '350px' }} className='p-1 relative'>
                                            <Typography
                                                dir='ltr'
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.address}
                                            </Typography>
                                        </td>
                                        <td style={{ minWidth: '120px' }} className='p-1 relative'>
                                            <Typography
                                                dir='ltr'
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.postalCode}
                                            </Typography>
                                        </td>
                                        <td style={{ width: "3%" }} className='px-1'>
                                            <div className='container-fluid mx-auto px-0.5'>
                                                <div className="flex flex-row justify-evenly">
                                                    <Button
                                                        onClick={() => UpdateItems(item)}
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
                                                        onClick={() => DeleteAddressItem(item.id)}
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
                    <UpdateAddress getData={item} setNewData={handleData} state={handleState} />
                </DialogBody>
            </Dialog>
        </>
    )
}

export default PersonalAddress