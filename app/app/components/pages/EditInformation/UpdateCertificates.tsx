import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { GetCertificateModels, UpdateCertificateType } from '@/app/models/HR/models';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import SaveIcon from '@mui/icons-material/Save';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import moment from 'jalali-moment';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { Button, Tooltip } from '@material-tailwind/react';
import { LoadingModel } from '@/app/models/sharedModels';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import DatePickare from '@/app/EndPoints-AsiaApp/Components/Shared/DatePickareComponent';
import { DateObject } from 'react-multi-date-picker';
import "react-multi-date-picker/styles/layouts/mobile.css"
import persian from "react-date-object/calendars/persian"
import persian_en from "react-date-object/locales/persian_en";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import "react-multi-date-picker/styles/backgrounds/bg-gray.css"
type Props = {
    getData: any,
    setNewData: (data: GetCertificateModels) => void,
    state: (data: boolean) => void
}
const UpdateCertificates = (props: Props) => {
    const { AxiosRequest } = useAxios()
    let loading = {
        loadingTable: false,
        loadingRes: false
    }
    const [loadings, setLoadings] = useState<LoadingModel>(loading);
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)

    const schema = yup.object({
        UpdateCourse: yup.object().shape({
            title: yup.string().required('اجباری'),
            duration: yup.number().required().min(1, 'اجباری').typeError('مقدار عددی وارد کنید'),
            institute: yup.string().required('اجباری'),
            finishDate: yup.number().required('سال پایان تحصیل را وارد کنید').min(+moment.from((new Date().getFullYear() - 50).toString(), 'YYYY').format('jYYYY'), 'تاریخ نامعتبر است').max(+moment.from((new Date().getFullYear() + 1).toString(), 'YYYY').format('jYYYY'), 'تاریخ نامعتبر است').typeError('مقدار عددی وارد کنید'),
            ExpirationDate: yup.string().when('isMortal', ([isMortal], sch) => {
                return isMortal == true
                    ? sch
                        .required('اجباری')
                    : sch.nullable();
            }),
            id: yup.number().required('اجباری')
        }).required(),
    })
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState,
        reset,
        control,
        watch,
        trigger,
    } = useForm<UpdateCertificateType>(
        {
            defaultValues: {
                UpdateCourse:
                {
                    title: props.getData.name,
                    duration: props.getData.duration,
                    finishDate: props.getData.finishYear,
                    institute: props.getData.institute,
                    isMortal: props.getData.isExpirable == true ? true : false,
                    ExpirationDate: props.getData.expireDate ? props.getData.expireDate : '',
                    certificateAtachmentId: props.getData.certificateAttachmentId ? props.getData.certificateAttachmentId : null,
                    id: props.getData.id,
                    hasCertificate: props.getData.hasCertificate
                }
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );

    const errors = formState.errors;

    const OnSubmit = () => {
        Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ویرایش دوره ها و گواهینامه ها',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdateCourse) {
                    setLoadings((state) => ({ ...state, loadingRes: true }))
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserCertificate`
                        let data = {
                            "id": getValues('UpdateCourse.id'),
                            "duration": getValues('UpdateCourse.duration'),
                            "institute": getValues('UpdateCourse.institute'),
                            "expireDate": getValues('UpdateCourse.isMortal') == false ? '' : getValues('UpdateCourse.ExpirationDate'),
                            "finishYear": getValues('UpdateCourse.finishDate'),
                            "isExpirable": getValues('UpdateCourse.isMortal'),
                            "userId": User.userId,
                            "name": getValues('UpdateCourse.title')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    certificateAttachmentId: getValues('UpdateCourse.certificateAtachmentId') ?? 0,
                                    hasCertificate: getValues('UpdateCourse.hasCertificate') ?? false,
                                    name: getValues('UpdateCourse.title'),
                                    duration: getValues('UpdateCourse.duration'),
                                    expireDate: getValues('UpdateCourse.isMortal') == true ? getValues('UpdateCourse.ExpirationDate')! : '',
                                    finishYear: getValues('UpdateCourse.finishDate'),
                                    id: getValues('UpdateCourse.id'),
                                    institute: getValues('UpdateCourse.institute'),
                                    isExpirable: getValues('UpdateCourse.isMortal') ? true : false
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش دوره ها و گواهینامه ها',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserCertificate`
                        let data = {
                            "id": getValues('UpdateCourse.id'),
                            "duration": getValues('UpdateCourse.duration'),
                            "institute": getValues('UpdateCourse.institute'),
                            "expireDate": getValues('UpdateCourse.isMortal') == true ? getValues('UpdateCourse.ExpirationDate') : null,
                            "finishYear": getValues('UpdateCourse.finishDate'),
                            "isExpirable": getValues('UpdateCourse.isMortal'),
                            "name": getValues('UpdateCourse.title')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            setLoadings((state) => ({ ...state, loadingRes: false }))
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    certificateAttachmentId: getValues('UpdateCourse.certificateAtachmentId') ?? 0,
                                    hasCertificate: getValues('UpdateCourse.hasCertificate') ?? false,
                                    name: getValues('UpdateCourse.title'),
                                    duration: getValues('UpdateCourse.duration'),
                                    expireDate: getValues('UpdateCourse.isMortal') == true ? getValues('UpdateCourse.ExpirationDate')! : '',
                                    finishYear: getValues('UpdateCourse.finishDate'),
                                    id: getValues('UpdateCourse.id'),
                                    institute: getValues('UpdateCourse.institute'),
                                    isExpirable: getValues('UpdateCourse.isMortal') ? true : false
                                })
                                props.state(false)
                                reset()

                            } else {
                                Swal.fire({
                                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش دوره ها و گواهینامه ها',
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
                        title: 'ویرایش دوره ها و گواهینامه ها',
                        text: 'از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                        icon: "warning",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK!",
                    })
                }
            }
        })
    }


    const [state, setState] = useState<{
        format: string;
        gregorian?: string;
        persian?: string;
        date?: DateObject | null;
    }>({ format: "YYYY/MM/DD" });

    useEffect(() => {
        props.getData != undefined
        setValue('UpdateCourse', {
            title: props.getData.name,
            duration: props.getData.duration,
            finishDate: props.getData.finishYear,
            institute: props.getData.institute,
            isMortal: props.getData.isExpirable == true ? true : false,
            ExpirationDate: props.getData.expireDate ? props.getData.expireDate : '',
            certificateAtachmentId: props.getData.certificateAttachmentId ? props.getData.certificateAttachmentId : null,
            id: props.getData.id,
            hasCertificate: props.getData.hasCertificate
        })
        props.getData.ExpirationDate && setState(prevState => ({ ...prevState, date: new DateObject({ date: props.getData!.ExpirationDate! }) }))
    }, [props.getData, setValue])

    const convert = (date: DateObject, format: string = state.format) => {
        let object = { date, format };
        setValue('UpdateCourse.ExpirationDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('UpdateCourse.ExpirationDate')
        setState({
            gregorian: new DateObject(object).format(),
            persian: new DateObject(object).convert(persian, persian_en).format(),
            ...object
        })
    }


    return (
        <MyCustomComponent>
            <>
                <form
                    dir='rtl'
                    onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10]'>
                    <div className="w-max my-2 ">
                        <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Certificates' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SaveIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <section className='grid grid-cols-1 gap-y-4'>
                        <div className='p-1 relative'>
                            <TextField autoComplete="off"
                                sx={{ fontFamily: 'FaLight' }}
                                tabIndex={15}
                                {...register(`UpdateCourse.title`)}
                                error={errors?.UpdateCourse && errors?.UpdateCourse?.title && true}
                                className='w-full lg:my-0 font-[FaLight]'
                                size='small'
                                label='نام دوره'
                                InputProps={{
                                    style: { color: errors?.UpdateCourse?.title ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateCourse && errors?.UpdateCourse?.title?.message}</label>
                        </div>
                        <div className='p-1 relative '>
                            <TextField autoComplete="off"
                                dir='ltr'
                                type='number'
                                sx={{ fontFamily: 'FaLight' }}
                                tabIndex={15}
                                {...register(`UpdateCourse.duration`)}
                                error={errors?.UpdateCourse && errors?.UpdateCourse?.duration && true}
                                className='w-full lg:my-0 font-[FaLight]'
                                size='small'
                                label="مدت (روز)"
                                InputProps={{
                                    style: { color: errors?.UpdateCourse?.duration ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateCourse && errors?.UpdateCourse?.duration?.message}</label>
                        </div>
                        <div className='p-1 relative'>
                            <TextField autoComplete="off"
                                dir='ltr'
                                sx={{ fontFamily: 'FaLight' }}
                                tabIndex={15}
                                {...register(`UpdateCourse.finishDate`)}
                                error={errors?.UpdateCourse && errors?.UpdateCourse?.finishDate && true}
                                className='w-full lg:my-0 font-[FaLight]'
                                size='small'
                                label="سال اتمام دوره"
                                InputProps={{
                                    style: { color: errors?.UpdateCourse?.finishDate ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateCourse?.finishDate && errors?.UpdateCourse!.finishDate?.message}</label>
                        </div>
                        <div className='p-1 relative'>
                            <TextField autoComplete="off"
                                sx={{ fontFamily: 'FaLight' }}
                                tabIndex={15}
                                {...register(`UpdateCourse.institute`)}
                                error={errors?.UpdateCourse && errors?.UpdateCourse?.institute && true}
                                className='w-full lg:my-0 font-[FaLight]'
                                size='small'
                                label="محل برگزاری"
                                InputProps={{
                                    style: { color: errors?.UpdateCourse?.institute ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateCourse?.institute && errors?.UpdateCourse!.institute?.message}</label>
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
                                    }}   {...register('UpdateCourse.isMortal')}
                                    checked={watch('UpdateCourse.isMortal') == true ? true : false}
                                    onChange={(event) => { setValue(`UpdateCourse.isMortal`, event.target.checked), trigger() }}
                                />} label="مدت دار" />
                        </div>
                        <div className='p-1 relative'>
                            <DatePickare
                                {...register(`UpdateCourse.ExpirationDate`)}
                                label='تاریخ انقضاء'
                                value={state.date}
                                onChange={(date: DateObject) => convert(date)}
                                error={errors?.UpdateCourse && errors?.UpdateCourse.ExpirationDate && true}
                                focused={watch(`UpdateCourse.ExpirationDate`)}
                                disabled={!watch('UpdateCourse.isMortal')}
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateCourse && errors?.UpdateCourse!.ExpirationDate?.message}</label>
                        </div>
                    </section>
                </form>
            </>
        </MyCustomComponent >
    )
}

export default UpdateCertificates