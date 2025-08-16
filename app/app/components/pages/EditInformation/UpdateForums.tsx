import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { GetUserAssociations, UpdateForumsType } from '@/app/models/HR/models';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import SaveIcon from '@mui/icons-material/Save';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { Button, Tooltip } from '@material-tailwind/react';
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
    setNewData: (data: GetUserAssociations) => void,
    state: (data: boolean) => void
}
const UpdateForums = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)

    const schema = yup.object({
        UpdateForums: yup.object().shape({
            title: yup.string().required('اجباری'),
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
        reset,
        formState,
        watch,
        trigger,
    } = useForm<UpdateForumsType>(
        {
            defaultValues: {
                UpdateForums: {
                    attachmentId: props.getData.attachmentId,
                    ExpirationDate: props.getData.expireDate,
                    hasCertificate: props.getData.hasDocument,
                    isMortal: props.getData.isExpirable,
                    title: props.getData.name,
                    id: props.getData.id
                }
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );

    const errors = formState.errors;

    const OnSubmit = () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ویرایش عضویت در انجمن ها',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdateForums) {
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserAssociation`
                        let data = {
                            "id": getValues('UpdateForums.id'),
                            "userId": User.userId,
                            "name": getValues('UpdateForums.title'),
                            "isExpirable": getValues('UpdateForums.isMortal'),
                            "expireDate": getValues('UpdateForums.isMortal') == true ? getValues('UpdateForums.ExpirationDate') : ''
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    expireDate: getValues('UpdateForums.isMortal') == true ? getValues('UpdateForums.ExpirationDate') : '',
                                    id: getValues('UpdateForums.id'),
                                    isExpirable: getValues('UpdateForums.isMortal'),
                                    name: getValues('UpdateForums.title')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش عضویت در انجمن ها',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserAssociation`
                        let data = {
                            "id": getValues('UpdateForums.id'),
                            "name": getValues('UpdateForums.title'),
                            "isExpirable": getValues('UpdateForums.isMortal'),
                            "expireDate": getValues('UpdateForums.isMortal') == true ? getValues('UpdateForums.ExpirationDate') : ''
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    expireDate: getValues('UpdateForums.isMortal') == true ? getValues('UpdateForums.ExpirationDate') : '',
                                    id: getValues('UpdateForums.id'),
                                    isExpirable: getValues('UpdateForums.isMortal'),
                                    name: getValues('UpdateForums.title')
                                })
                                props.state(false)
                                reset()

                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش عضویت در انجمن ها',
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
                        title: 'ویرایش عضویت در انجمن ها',
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
        setValue('UpdateForums', {
            attachmentId: props.getData.attachmentId,
            ExpirationDate: props.getData.expireDate,
            hasCertificate: props.getData.hasDocument,
            isMortal: props.getData.isExpirable,
            title: props.getData.name,
            id: props.getData.id
        })
        props.getData.expireDate && setState(prevState => ({ ...prevState, date: new DateObject({ date: props.getData.expireDate }) }))
    }, [props.getData, setValue])


    const convert = (date: DateObject, format: string = state.format) => {
        let object = { date, format };
        setValue('UpdateForums.ExpirationDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('UpdateForums.ExpirationDate')
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
                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Association' placement="top">
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
                            {...register(`UpdateForums.title`)}
                            error={errors?.UpdateForums && errors?.UpdateForums?.title && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label='نام انجمن'
                            InputProps={{
                                style: { color: errors?.UpdateForums?.title ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateForums && errors?.UpdateForums?.title?.message}</label>
                    </div>
                    <div className='p-1 relative '>
                        <FormControlLabel
                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                            control={<Checkbox
                                sx={{
                                    color: color?.color,
                                    '&.Mui-checked': {
                                        color: color?.color,
                                    },
                                }}   {...register('UpdateForums.isMortal')}
                                checked={watch('UpdateForums.isMortal')}
                                onChange={(event) => { setValue(`UpdateForums.isMortal`, event.target.checked), trigger() }}
                            />} label="مدت دار" />
                    </div>
                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='تاریخ انقضاء' placement="top">
                        <div className='p-1 relative'>
                            <DatePickare
                                {...register(`UpdateForums.ExpirationDate`)}
                                label='تاریخ انقضاء'
                                value={state.date}
                                onChange={(date: DateObject) => convert(date)}
                                error={errors?.UpdateForums && errors?.UpdateForums.ExpirationDate && true}
                                focused={watch(`UpdateForums.ExpirationDate`)}
                                disabled={!watch('UpdateForums.isMortal')}
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateForums && errors?.UpdateForums!.ExpirationDate?.message}</label>
                        </div>
                    </Tooltip>
                </section>
            </form>
            </>
        </MyCustomComponent>
    )
}

export default UpdateForums