'use client';
import useAxios from '@/app/hooks/useAxios';
import { EducationDegreeModel, GetUserLanguages, LanguageModel, LanguageType } from '@/app/models/HR/models';
import { Response } from '@/app/models/HR/sharedModels';
import { Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { Tooltip, Button, CardBody, Dialog, DialogHeader, IconButton, DialogBody } from '@material-tailwind/react';
import Loading from '../../shared/loadingResponse';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import TableSkeleton from '../../shared/TableSkeleton';
import { LoadingModel } from '@/app/models/sharedModels';
import UpdateEducation from './UpdateLanguages';
import EditIcon from '@mui/icons-material/Edit';

const Language = () => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    let loading = {
        loadingTable: false,
        loadingRes: false
    }
    const [loadings, setLoadings] = useState<LoadingModel>(loading)
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object({
        LanguageState: yup.object().shape({
            languageId: yup.number().required().min(1, 'اجباری'),
            writeLevel: yup.number().required().min(1, 'اجباری'),
            readLevel: yup.number().required().min(1, 'اجباری'),
            speakLevel: yup.number().required().min(1, 'اجباری'),
        }).required()
    })

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        watch,
        formState,
        control,
        trigger,
    } = useForm<LanguageType>(
        {
            defaultValues: {
                LanguageState: {
                    languageId: 0,
                    readLevel: 0,
                    speakLevel: 0,
                    writeLevel: 0
                }
            }, mode: 'onChange',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;

    let languages = {
        languages: [],
        languageLevel: []
    }
    const [initialState, setInitialState] = useState<LanguageModel>(languages)

    const GetLanguages = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/BaseInfo/manage/GetForeignLanguages`;
        let method = 'get';
        let data = {}
        let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
            if (response.data.status && response.data.data != null) {
                setInitialState((state) => ({
                    ...state, languages: response.data.data.map((item) => {
                        return {
                            value: item.id,
                            label: item.faName,
                            faName: item.faName,
                            id: item.id,
                            name: item.name
                        }
                    })
                }))
            }
        }
    }

    const GetLanguagesLevels = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/BaseInfo/manage/GetLanguageLevel`;
        let method = 'get';
        let data = {}
        let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
            if (response.data.status && response.data.data != null) {
                setInitialState((state) => ({
                    ...state, languageLevel: response.data.data.map((item) => {
                        return {
                            value: item.id,
                            label: item.faName,
                            faName: item.faName,
                            id: item.id,
                            name: item.name
                        }
                    })
                }))
            }
        }
    }

    const [languagesList, setLanguagesList] = useState<GetUserLanguages[]>([])
    const OnSubmit = async () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ذخیره زبان های خارجی',
            text: 'آیا از ذخیره این زبان خارجی اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, save it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.LanguageState) {
                    setLoadings((state) => ({ ...state, loadingRes: true }))
                    let url: string;
                    let data: any;
                    let method = 'put';
                    if (User.userId != null) {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveUserLanguagesLearnt`;
                        data = {
                            userId: User.userId,
                            languages: {
                                languageId: getValues('LanguageState.languageId'),
                                readLanguageLevelId: getValues('LanguageState.readLevel'),
                                writeLanguageLevelId: getValues('LanguageState.writeLevel'),
                                speakLanguageLevelId: getValues('LanguageState.speakLevel')
                            }
                        }
                        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            setValue('LanguageState', {
                                languageId: 0,
                                readLevel: 0,
                                speakLevel: 0,
                                writeLevel: 0
                            })
                            setLoadings((state) => ({ ...state, loadingRes: false }))
                            if (response.data.status && response.data.data) {
                                setLanguagesList((state) => ([...state, {
                                    id: response.data.data,
                                    languageId: data.languages.languageId,
                                    readDominanceLevelId: data.languages.readLanguageLevelId,
                                    speakDominanceLevelId: data.languages.speakLanguageLevelId,
                                    writeDominanceLevelId: data.languages.writeLanguageLevelId
                                }]))
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ذخیره زبان های خارجی',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!"
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveCurrentUserLanguageLearnt`
                        data = {
                            "languageId": getValues('LanguageState.languageId'),
                            "readLanguageLevelId": getValues('LanguageState.readLevel'),
                            "writeLanguageLevelId": getValues('LanguageState.writeLevel'),
                            "speakLanguageLevelId": getValues('LanguageState.speakLevel')
                        }
                        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            setValue('LanguageState', {
                                languageId: 0,
                                readLevel: 0,
                                speakLevel: 0,
                                writeLevel: 0
                            })
                            setLoadings((state) => ({ ...state, loadingRes: false }))
                            if (response.data.status && response.data.data) {
                                setLanguagesList((state) => ([...state, {
                                    id: response.data.data,
                                    languageId: data.languageId,
                                    readDominanceLevelId: data.readLanguageLevelId,
                                    speakDominanceLevelId: data.speakLanguageLevelId,
                                    writeDominanceLevelId: data.writeLanguageLevelId
                                }]))
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ذخیره زبان های خارجی',
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
                        title: 'ذخیره زبان های خارجی',
                        text: 'از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                        icon: "warning",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK!"
                    })
                }
            }
        })
    }

    const DeleteLanguages = async (id: number) => {
        let url: string;
        if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserLanguage?id=${id}`;
        } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteCurrentUserLanguage?id=${id}`
        }
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'حذف زبان های خارجی',
            text: 'آیا از حذف این زبان خارجی اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, Delete it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.LanguageState) {
                    setLoadings((state) => ({ ...state, loadingRes: true }))
                    let method = 'delete';
                    let data = {}
                    let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                    if (response) {
                        setLoadings((state) => ({ ...state, loadingRes: false }))
                        if (response.data.status && response.data.data) {
                            let array = languagesList.filter((item) => item.id !== id)
                            setLanguagesList([...array])
                        } else {
                            Swal.fire({
                                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: 'حذف زبان های خارجی',
                                text: response.data.message,
                                icon: response.data.status ? "warning" : 'error',
                                confirmButtonColor: "#22c55e",
                                confirmButtonText: "OK!"
                            })
                        }

                    }
                }
            }
        })
    }

    useEffect(() => {
        const GetLanguagesList = async () => {
            setLoadings((state) => ({ ...state, loadingTable: true }))
            let url: string;
            if (User.userId != null) {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserLanguages?userId=${User.userId}`;
            } else {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserLanguages`;
            }
            let data = {};
            let method = 'get';
            let response: AxiosResponse<Response<GetUserLanguages[]>> = await AxiosRequest({ url, data, method, credentials: true })
            if (response) {
                setLoadings((state) => ({ ...state, loadingTable: false }))
                if (response.data.status && response.data.data.length > 0) {
                    if (response.data.status && response.data.data.length > 0) {
                        setLanguagesList(response.data.data)
                    } else {
                        setLanguagesList([])
                    }
                }
            }

        }
        GetLanguagesList()
    }, [User.userName, User.userId])

    useEffect(() => {
        GetLanguages()
        GetLanguagesLevels()
    }, [])
    const [item, setItem] = useState<GetUserLanguages | null>(null)
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const handleUpdateDoc = () => setOpenUpdate(!openUpdate)
    const handleData = (data: GetUserLanguages) => {
        let index: number = languagesList.indexOf(languagesList.find(x => x.id == data.id)!)
        let option: GetUserLanguages = languagesList.find(x => x.id == data.id)!
        data != null ? languagesList.splice(index, 1, {
            ...option,
            languageId: data.languageId,
            readDominanceLevelId: data.readDominanceLevelId,
            speakDominanceLevelId: data.speakDominanceLevelId,
            writeDominanceLevelId: data.writeDominanceLevelId
        }) : null
    };

    const UpdateItem = (op: GetUserLanguages) => {
        setItem(op)
        handleUpdateDoc()
    }

    const handleState = (data: boolean) => {
        setOpenUpdate(data);
    };




    return (
        <>
            {loadings.loadingRes == true && <Loading />}
            <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} rounded-lg shadow-md h-auto mb-5 mx-auto `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                    dir='rtl'
                    onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10]'>
                    <div className="w-max ">
                        <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save Certificates' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SaveIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <section className='grid grid-cols-1 md:grid-cols-4 gap-x-1 gap-y-5 my-2'>
                        <div className='p-1 relative'>
                            <Select isRtl
                                value={initialState.languages.find((item) => item.id == watch(`LanguageState.languageId`)) ?? null}
                                placeholder='زبان های خارجی'
                                maxMenuHeight={200}
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaMedium]`}
                                options={initialState.languages}
                                {...register(`LanguageState.languageId`)}
                                onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                                    {
                                        setValue(`LanguageState.languageId`, option!.id),
                                            trigger(`LanguageState.languageId`)
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
                                        neutral20: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                        neutral30: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                        neutral50: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                    },
                                })}
                            />
                            <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.LanguageState?.languageId && errors?.LanguageState!.languageId?.message}</label>
                        </div>
                        <div className='p-1 relative '>
                            <Select isRtl
                                placeholder='سطح مکالمه'
                                value={initialState.languageLevel.find((item) => item.id == watch(`LanguageState.speakLevel`)) ?? null}
                                maxMenuHeight={200}
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaMedium]`}
                                options={initialState.languageLevel}
                                {...register(`LanguageState.speakLevel`)}
                                onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                                    {
                                        setValue(`LanguageState.speakLevel`, option!.id),
                                            trigger(`LanguageState.speakLevel`)
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
                                        neutral20: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                        neutral30: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                        neutral50: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                    },
                                })}
                            />
                            <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.LanguageState?.speakLevel && errors?.LanguageState!.speakLevel?.message}</label>
                        </div>
                        <div className='p-1 relative'>
                            <Select isRtl
                                placeholder='سطح خواندن'
                                value={initialState.languageLevel.find((item) => item.id == watch(`LanguageState.readLevel`)) ?? null}
                                maxMenuHeight={200}
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaMedium]`}
                                options={initialState.languageLevel}
                                {...register(`LanguageState.readLevel`)}
                                onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                                    {
                                        setValue(`LanguageState.readLevel`, option!.id),
                                            trigger(`LanguageState.readLevel`)
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
                                        neutral20: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                        neutral30: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                        neutral50: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                    },
                                })}
                            />
                            <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.LanguageState?.readLevel && errors?.LanguageState!.readLevel?.message}</label>
                        </div>
                        <div className='p-1 relative'>
                            <Select isRtl
                                placeholder='سطح نگارش'
                                value={initialState.languageLevel.find((item) => item.id == watch(`LanguageState.writeLevel`)) ?? null}
                                maxMenuHeight={200}
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaMedium]`}
                                options={initialState.languageLevel}
                                {...register(`LanguageState.writeLevel`)}
                                onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                                    {
                                        setValue(`LanguageState.writeLevel`, option!.id),
                                            trigger(`LanguageState.writeLevel`)
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
                                        neutral20: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                        neutral30: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                        neutral50: errors?.LanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                    },
                                })}
                            />
                            <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.LanguageState?.writeLevel && errors?.LanguageState!.writeLevel?.message}</label>
                        </div>
                    </section>
                </form>
            </CardBody>
            <section dir='ltr' className='w-[100%] h-auto lg:h-[72vh] mx-auto  p-0 my-3' >
                {loadings.loadingTable == false ? (<table dir="rtl" className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[70vh] relative text-center `}>
                    <thead className='sticky z-[3] top-0 left-3 w-full'>
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                >
                                    زبان خارجی
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                >
                                    مکالمه
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                >
                                    خواندن
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                >
                                    نگارش
                                </Typography>
                            </th>
                            <th
                                style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} p-1.5 text-sm font-['FaBold'] leading-none`}
                                >
                                    عملیات
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-bg-[#93c5fd]`}>
                        {languagesList.length > 0 && languagesList.map((item: GetUserLanguages, index: number) => {
                            return (
                                <tr key={index} style={{ height: '55px' }} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} py-5 border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>

                                    <td style={{ width: '15%', minWidth: '180px' }} className='p-1 relative'>
                                        <Typography
                                            dir='ltr'
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        >
                                            {initialState.languages.find((option) => option.id == item.languageId)?.faName}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '15%', minWidth: '180px' }} className='p-1 relative'>
                                        <Typography
                                            dir='ltr'
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        >
                                            {initialState.languageLevel.find((option) => option.id == item.speakDominanceLevelId)?.faName}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '15%', minWidth: '180px' }} className='p-1 relative'>
                                        <Typography
                                            dir='ltr'
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        >
                                            {initialState.languageLevel.find((option) => option.id == item.readDominanceLevelId)?.faName}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '15%', minWidth: '180px' }} className='p-1 relative'>
                                        <Typography
                                            dir='ltr'
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        >
                                            {initialState.languageLevel.find((option) => option.id == item.writeDominanceLevelId)?.faName}
                                        </Typography>
                                    </td>
                                    <td style={{ width: "3%" }} className='px-1'>
                                        <div className='container-fluid mx-auto px-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <Button
                                                    size="sm"
                                                    className="p-1 mx-1"
                                                    onClick={() => UpdateItem(item)}
                                                    style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    <EditIcon
                                                        fontSize='small'
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                    />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="p-1 mx-1"
                                                    onClick={() => DeleteLanguages(item.id)}
                                                    style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
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
                        }
                        )
                        }
                    </tbody>
                </table>) : <TableSkeleton />}
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
                    <UpdateEducation getData={item} setNewData={handleData} state={handleState} />
                </DialogBody>
            </Dialog>
        </>
    )
}

export default Language