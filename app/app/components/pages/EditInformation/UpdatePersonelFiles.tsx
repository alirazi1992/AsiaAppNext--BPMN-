import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { FileAttachmentTypes, GetAttachmentTypes, UpdatePersonelFileType } from '@/app/models/HR/models';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Select, { ActionMeta, SingleValue } from 'react-select';
import SaveIcon from '@mui/icons-material/Save';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import DateRangePicker from '../../shared/DatePicker/DateRangePicker';
import moment from 'jalali-moment';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import { Response } from '@/app/models/HR/sharedModels';
import { Button, Tooltip } from '@material-tailwind/react';
import { UserProfileDocumentsModel } from '@/app/models/HR/userInformation';
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
    getData: any;
    setNewData: (data: UserProfileDocumentsModel) => void,
    state: (data: boolean) => void
}

const UpdatePersonelFiles = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const User = UpdateUsersStore((state) => state);
    const schema = yup.object({
        UpdatePersonnelFiles: yup.object().shape({
            fileType: yup.number().required().min(1, 'اجباری'),
            id: yup.number().required('اجباری'),
            ExpireDate: yup.string().when('isMortal', ([isMortal], sch) => {
                return isMortal == true
                    ? sch
                        .required('اجباری')
                    : sch.nullable();
            })
        }).required(),
    })
    const {
        reset,
        register,
        handleSubmit,
        setValue,
        getValues,
        formState,
        control,
        watch,
        trigger,
        clearErrors,
    } = useForm<UpdatePersonelFileType>(
        {
            defaultValues: {
                UpdatePersonnelFiles: {
                    ExpireDate: props.getData.expireDate ? props.getData.expireDate : '',
                    fileType: props.getData.profileAttachmentTypeId,
                    isMortal: props.getData.expireDate != '' ? true : false,
                    id: props.getData.id
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    const setChangeDate = (unix: any, formatted: any) => {
        setValue(`UpdatePersonnelFiles.ExpireDate`, moment.from(formatted, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD')),
            trigger(`UpdatePersonnelFiles.ExpireDate`)
    }
    const [fileType, setFileType] = useState<GetAttachmentTypes[]>([])

    useEffect(() => {
        const GetAttachmentTypes = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/GetAttachmentTypes?categoryId=1`;
            let method = 'get'
            let data = {};
            let response: AxiosResponse<Response<GetAttachmentTypes[]>> = await AxiosRequest({ url, method, data, credentials: true });
            if (response) {
                (response.data.status && response.data.data.length > 0) ? setFileType(response.data.data.map((item) => {
                    return {
                        faTitle: item.faTitle,
                        id: item.id,
                        label: item.faTitle,
                        title: item.title,
                        value: item.id,
                        defaultExpireByDay: item.defaultExpireByDay,
                        isExpirable: item.isExpirable
                    }
                })) : setFileType([])
            }
        }
        GetAttachmentTypes()
    }, [])

    const OnSubmit = () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ویرایش مدارک پرسنلی',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdatePersonnelFiles) {
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserProfileDocument`
                        let data = {
                            "id": getValues('UpdatePersonnelFiles.id'),
                            "categoryId": getValues('UpdatePersonnelFiles.fileType'),
                            "expireDate": fileType.find(item => item.id == watch('UpdatePersonnelFiles.fileType'))?.isExpirable == false ? null : getValues('UpdatePersonnelFiles.ExpireDate'),
                            "userId": User.userId
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    expireDate: fileType.find(item => item.id == watch('UpdatePersonnelFiles.fileType'))?.isExpirable == false ? null : getValues('UpdatePersonnelFiles.ExpireDate'),
                                    profileAttachmentTypeId: getValues('UpdatePersonnelFiles.fileType')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش مدارک پرسنلی',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserProfileDocument`
                        let data = {
                            "id": getValues('UpdatePersonnelFiles.id'),
                            "categoryId": getValues('UpdatePersonnelFiles.fileType'),
                            "expireDate": fileType.find(item => item.id == watch('UpdatePersonnelFiles.fileType'))?.isExpirable == false ? null : getValues('UpdatePersonnelFiles.ExpireDate'),
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    expireDate: fileType.find(item => item.id == watch('UpdatePersonnelFiles.fileType'))?.isExpirable == false ? null : getValues('UpdatePersonnelFiles.ExpireDate'),
                                    profileAttachmentTypeId: getValues('UpdatePersonnelFiles.fileType')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش مدارک پرسنلی',
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
                        title: 'ویرایش مدارک پرسنلی',
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
        setValue('UpdatePersonnelFiles', {
            ExpireDate: props.getData.expireDate ? props.getData.expireDate : '',
            fileType: props.getData.profileAttachmentTypeId,
            isMortal: props.getData.expireDate != '' ? true : false,
            id: props.getData.id
        })
        props.getData.expireDate && setState(prevState => ({ ...prevState, date: new DateObject({ date: props.getData!.expireDate! }) }))
    }, [props.getData, setValue])

    const convert = (date: DateObject, format: string = state.format) => {
        let object = { date, format };
        setValue('UpdatePersonnelFiles.ExpireDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('UpdatePersonnelFiles.ExpireDate')
        setState({
            gregorian: new DateObject(object).format(),
            persian: new DateObject(object).convert(persian, persian_en).format(),
            ...object
        })
    }

    return (
        <MyCustomComponent>
            <>
            <form onSubmit={handleSubmit(OnSubmit)} className='w-full'>
                <div className="w-max my-2">
                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Personnel Files' placement="top">
                        <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <SaveIcon className='p-1' />
                        </Button>
                    </Tooltip>
                </div>
                <section className='grid grid-cols-1 gap-y-4'>
                    <div className='p-1 '>
                        <Select isRtl id='JobsInput' isSearchable {...register(`UpdatePersonnelFiles.fileType`)}
                            value={fileType.find((item) => item.id == watch(`UpdatePersonnelFiles.fileType`)) ?? null}
                            minMenuHeight={300}
                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full z-[90000]`} placeholder="نوع مدرک" options={fileType}
                            theme={(theme) => ({
                                ...theme,
                                height: 10,
                                borderRadius: 5,
                                colors: {
                                    ...theme.colors,
                                    color: '#607d8b',
                                    neutral10: `${color?.color}`,
                                    primary25: `${color?.color}`,
                                    primary: '#607d8b',
                                    neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                    neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`,
                                    neutral20: errors?.UpdatePersonnelFiles?.fileType ? '#d32f3c' : '#607d8b',
                                    neutral30: errors?.UpdatePersonnelFiles?.fileType ? '#d32f3c' : '#607d8b',
                                    neutral50: errors?.UpdatePersonnelFiles?.fileType ? '#d32f3c' : '#607d8b',
                                },
                            })}
                            onChange={(option: SingleValue<FileAttachmentTypes>, actionMeta: ActionMeta<FileAttachmentTypes>) => {
                                reset(),
                                    setValue('UpdatePersonnelFiles.isMortal', fileType.find((item) => item.id == option!.id)?.isExpirable),
                                    setValue(`UpdatePersonnelFiles.fileType`, option!.id),
                                    clearErrors(),
                                    trigger()
                            }
                            }
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdatePersonnelFiles && errors?.UpdatePersonnelFiles?.fileType?.message}</label>
                    </div>
                    <section dir='rtl' className={`${(fileType.find((item => item.id == watch('UpdatePersonnelFiles.fileType')))?.isExpirable == false) || watch('UpdatePersonnelFiles.fileType') == 0 ? ' hidden' : 'grid'}`}>
                        <div className='p-1'>
                            <FormControlLabel
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                control={<Checkbox

                                    {...register(`UpdatePersonnelFiles.isMortal`)}
                                    checked={watch('UpdatePersonnelFiles.isMortal')}
                                    // disabled
                                    sx={{
                                        color: color?.color,
                                        '&.Mui-checked': {
                                            color: color?.color,
                                        },
                                    }}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />}
                                label="مدت دار" />

                        </div>
                        <div className='p-1 relative'>
                            <DatePickare
                                {...register(`UpdatePersonnelFiles.ExpireDate`)}
                                label='تاریخ انقضاء'
                                value={state.date == null ? '' : state.date}
                                onChange={(date: DateObject) => convert(date)}
                                error={errors?.UpdatePersonnelFiles && errors?.UpdatePersonnelFiles.ExpireDate && true}
                                focused={watch(`UpdatePersonnelFiles.ExpireDate`)}
                                disabled={!watch(`UpdatePersonnelFiles.ExpireDate`)}
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdatePersonnelFiles && errors?.UpdatePersonnelFiles!.ExpireDate?.message}</label>
                        </div>
                    </section>
                </section>
            </form>
            </>
        </MyCustomComponent>
    )
}

export default UpdatePersonelFiles