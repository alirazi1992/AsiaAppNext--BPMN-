import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { GetCheckUpDataModel, UpdatePriodicalCheckUpsModel } from '@/app/models/HR/models';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import SaveIcon from '@mui/icons-material/Save';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
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
    setNewData: (data: GetCheckUpDataModel) => void,
    state: (data: boolean) => void
}
const UpdateCheckeUp = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object().shape({
        UpdatePriodicalCheckUps: yup.object().shape({
            checkUpDate: yup.string().required("اجباری"),
            id: yup.number().required("اجباری"),

        }).required()
    });

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        getValues,
        formState,
        control,
        watch,
        trigger,
    } = useForm<UpdatePriodicalCheckUpsModel>(
        {
            defaultValues: {
                UpdatePriodicalCheckUps: {
                    attachmentId: props.getData.attachmentId,
                    checkUpDate: props.getData.checkUpDate,
                    id: props.getData.id
                }
            }, mode: 'onChange',
            resolver: yupResolver(schema)
        }
    );

    const errors = formState.errors;
    const OnSubmit = () => {
        Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ویرایش معاینات ادواری',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdatePriodicalCheckUps) {
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserPriodicalCheckup`
                        let data = {
                            "userId": User.userId,
                            "id": getValues('UpdatePriodicalCheckUps.id'),
                            "checkupDate": getValues('UpdatePriodicalCheckUps.checkUpDate')
                        };
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    checkUpDate: getValues('UpdatePriodicalCheckUps.checkUpDate')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش معاینات ادواری',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserPriodicalCheckup`
                        let data = {
                            "id": getValues('UpdatePriodicalCheckUps.id'),
                            "checkupDate": getValues('UpdatePriodicalCheckUps.checkUpDate')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    checkUpDate: getValues('UpdatePriodicalCheckUps.checkUpDate')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش معاینات ادواری',
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
                        title: 'ویرایش معاینات ادواری',
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
        setValue('UpdatePriodicalCheckUps', {
            attachmentId: props.getData.attachmentId,
            checkUpDate: props.getData.checkUpDate,
            id: props.getData.id
        })
        props.getData.checkUpDate && setState(prevState => ({ ...prevState, date: new DateObject({ date: props.getData!.checkUpDate! }) }))
    }, [props.getData, setValue])

    const convert = (date: DateObject, format: string = state.format) => {
        let object = { date, format };
        setValue('UpdatePriodicalCheckUps.checkUpDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('UpdatePriodicalCheckUps.checkUpDate')
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
                        <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Priodical Checkup' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SaveIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <section className='grid grid-cols-1 gap-y-4'>
                        <Tooltip className={!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'} content='تاریخ انجام معاینات' placement="top"><div className='p-1 relative'>
                            <DatePickare
                                {...register(`UpdatePriodicalCheckUps.checkUpDate`)}
                                label='تاریخ انجام معاینات'
                                value={state.date}
                                onChange={(date: DateObject) => convert(date)}
                                error={errors?.UpdatePriodicalCheckUps && errors?.UpdatePriodicalCheckUps.checkUpDate && true}
                                focused={watch(`UpdatePriodicalCheckUps.checkUpDate`)}
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdatePriodicalCheckUps && errors?.UpdatePriodicalCheckUps!.checkUpDate?.message}</label>
                        </div>
                        </Tooltip>
                    </section>
                </form>
            </>
        </MyCustomComponent>
    )
}

export default UpdateCheckeUp