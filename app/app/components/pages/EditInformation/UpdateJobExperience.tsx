import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { GetJobExperienceModels, UpdateJobExprienceModel } from '@/app/models/HR/models';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import SaveIcon from '@mui/icons-material/Save';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { TextField } from '@mui/material';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { Button, Tooltip } from '@material-tailwind/react';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import { DateObject } from "react-multi-date-picker";
import "react-multi-date-picker/styles/layouts/mobile.css"
import persian from "react-date-object/calendars/persian"
import persian_en from "react-date-object/locales/persian_en";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import "react-multi-date-picker/styles/backgrounds/bg-gray.css"
import DatePickare from '@/app/EndPoints-AsiaApp/Components/Shared/DatePickareComponent';


type Props = {
    getData: any,
    setNewData: (data: GetJobExperienceModels) => void,
    state: (data: boolean) => void
}
const UpdateJobExperience = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object().shape({
        UpdateRelatedJobs: yup.object().shape({
            employerName: yup.string().required("اجباری"),
            startDate: yup.string().required("اجباری"),
            finishDate: yup.string().optional().nullable(),
            role: yup.string().required("اجباری"),
            activityDesc: yup.string().required("اجباری"),
            id: yup.number().required('اجباری')

        }).required()
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        getValues,
        reset,
        formState,
        control,
        trigger,
    } = useForm<UpdateJobExprienceModel>(
        {
            defaultValues: {
                UpdateRelatedJobs: {
                    activityDesc: props.getData.activityDesc,
                    attachmentId: props.getData.attachmentId,
                    employerName: props.getData.employerName,
                    endDate: props.getData.endDate,
                    role: props.getData.role,
                    startDate: props.getData.startDate,
                    id: props.getData.id
                }
            }, mode: 'onChange',
            resolver: yupResolver(schema)
        })

    const errors = formState.errors;

    const OnSubmit = () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ویرایش سوابق شغلی',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdateRelatedJobs) {
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserJobExperience`
                        let data = {
                            "id": getValues('UpdateRelatedJobs.id'),
                            "name": getValues('UpdateRelatedJobs.employerName'),
                            "startDate": getValues('UpdateRelatedJobs.startDate'),
                            "endDate": getValues('UpdateRelatedJobs.endDate'),
                            "activityDesc": getValues('UpdateRelatedJobs.activityDesc'),
                            'role': getValues('UpdateRelatedJobs.role'),
                            "userId": User.userId
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    activityDesc: getValues('UpdateRelatedJobs.activityDesc'),
                                    employerName: getValues('UpdateRelatedJobs.employerName'),
                                    endDate: getValues('UpdateRelatedJobs.endDate'),
                                    id: getValues('UpdateRelatedJobs.id'),
                                    role: getValues('UpdateRelatedJobs.role'),
                                    startDate: getValues('UpdateRelatedJobs.startDate')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش سوابق شغلی',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserJobExperience`
                        let data = {
                            "id": getValues('UpdateRelatedJobs.id'),
                            "name": getValues('UpdateRelatedJobs.employerName'),
                            "startDate": getValues('UpdateRelatedJobs.startDate'),
                            "endDate": getValues('UpdateRelatedJobs.endDate'),
                            "activityDesc": getValues('UpdateRelatedJobs.activityDesc'),
                            'role': getValues('UpdateRelatedJobs.role')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    activityDesc: getValues('UpdateRelatedJobs.activityDesc'),
                                    employerName: getValues('UpdateRelatedJobs.employerName'),
                                    endDate: getValues('UpdateRelatedJobs.endDate'),
                                    id: getValues('UpdateRelatedJobs.id'),
                                    role: getValues('UpdateRelatedJobs.role'),
                                    startDate: getValues('UpdateRelatedJobs.startDate')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش سوابق شغلی',
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
                        background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'ویرایش سوابق شغلی',
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
        startDate: {
            format: string;
            gregorian?: string;
            persian?: string;
            date?: DateObject | null;
        }
        , finishDate: {
            format: string;
            gregorian?: string;
            persian?: string;
            date?: DateObject | null;
        }
    }>(({ startDate: { format: "YYYY/MM/DD" }, finishDate: { format: "YYYY/MM/DD" } }))


    const ConvertStartDate = (date: DateObject, format: string = state.startDate.format) => {
        let object = { date, format };
        setValue('UpdateRelatedJobs.startDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('UpdateRelatedJobs.startDate')
        setState(prevState => ({
            ...prevState,
            startDate: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }
    const ConvertFinishDate = (date: DateObject, format: string = state.finishDate.format) => {
        let object = { date, format };
        setValue('UpdateRelatedJobs.endDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('UpdateRelatedJobs.endDate')
        setState(prevState => ({
            ...prevState,
            finishDate: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }
    useEffect(() => {
        props?.getData.startDate && setState(prevState => ({
            ...prevState,
            startDate: {
                ...prevState.startDate,
                date: new DateObject({ date: props.getData.startDate })
            }
        }))
        props?.getData.endDate && setState(prevState => ({
            ...prevState,
            finishDate: {
                ...prevState.finishDate,
                date: new DateObject({ date: props.getData.endDate })
            }
        }))
    }, [props.getData.endDate, props.getData.startDate])

    return (
        <MyCustomComponent>
            <>
            <form
                dir='rtl'
                onSubmit={handleSubmit(OnSubmit)}
                className='relative z-[10]'>
                <div className="w-max my-2 ">
                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Job Experience' placement="top">
                        <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <SaveIcon className='p-1' />
                        </Button>
                    </Tooltip>
                </div>
                <section className='grid grid-cols-1 gap-y-4'>
                    <div className='p-1 relative'>
                        <TextField autoComplete="off"
                            sx={{ fontFamily: 'FaLight' }}
                            tabIndex={1}
                            {...register(`UpdateRelatedJobs.employerName`)}
                            error={errors?.UpdateRelatedJobs && errors?.UpdateRelatedJobs?.employerName && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label='نام محل کار'
                            InputProps={{
                                style: { color: errors?.UpdateRelatedJobs?.employerName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateRelatedJobs && errors?.UpdateRelatedJobs?.employerName?.message}</label>
                    </div>
                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='تاریخ شروع همکاری' placement="top">
                        <div className='p-1 relative'>
                            <DatePickare
                                {...register(`UpdateRelatedJobs.startDate`)}
                                label='تاریخ شروع همکاری'
                                value={state.startDate.date}
                                onChange={(date: DateObject) => ConvertStartDate(date)}
                                error={errors?.UpdateRelatedJobs && errors?.UpdateRelatedJobs?.startDate && true}
                                focused={watch(`UpdateRelatedJobs.startDate`)}
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateRelatedJobs && errors?.UpdateRelatedJobs!.startDate?.message}</label>
                        </div>
                    </Tooltip>
                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='تاریخ پایان همکاری' placement="top">
                        <div className='p-1 relative'>
                            <DatePickare
                                {...register(`UpdateRelatedJobs.endDate`)}
                                label='تاریخ اتمام همکاری'
                                value={state.finishDate.date}
                                onChange={(date: DateObject) => ConvertFinishDate(date)}
                                error={errors?.UpdateRelatedJobs && errors?.UpdateRelatedJobs?.endDate && true}
                                focused={watch(`UpdateRelatedJobs.endDate`)}
                            />
                            <label className='text-[10px] flex w-full justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateRelatedJobs?.endDate && errors?.UpdateRelatedJobs!.endDate?.message}</label>
                        </div>
                    </Tooltip>
                    <div className='p-1 relative '>
                        <TextField autoComplete="off"
                            dir='rtl'
                            sx={{ fontFamily: 'FaLight' }}
                            tabIndex={4}
                            {...register(`UpdateRelatedJobs.role`)}
                            error={errors?.UpdateRelatedJobs && errors?.UpdateRelatedJobs?.role && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label="سمت"
                            InputProps={{
                                style: { color: errors?.UpdateRelatedJobs?.role ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateRelatedJobs && errors?.UpdateRelatedJobs?.role?.message}</label>
                    </div>
                    <div className='p-1 relative'>
                        <textarea
                            onFocus={(e) => e.target.rows = 4} rows={1}
                            {...register(`UpdateRelatedJobs.activityDesc`)}
                            className={errors?.UpdateRelatedJobs && errors?.UpdateRelatedJobs!.activityDesc ? `${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400` : `${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused`}
                            placeholder="اهم فعالیت ها"
                        />
                        <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateRelatedJobs?.activityDesc && errors?.UpdateRelatedJobs!.activityDesc?.message}</label>
                    </div>
                </section>
            </form>
            </>
        </MyCustomComponent >
    )
}

export default UpdateJobExperience