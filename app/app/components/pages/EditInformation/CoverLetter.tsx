'use client';
import { Button, Tooltip } from '@material-tailwind/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import * as yup from "yup";
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import useAxios from '@/app/hooks/useAxios';
import { AxiosResponse } from 'axios';
import { Response } from '@/app/models/HR/sharedModels';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import dynamic from 'next/dynamic';
import { CoverLetterModel, GetCoverLetterModel } from '@/app/models/HR/models';
import InputSkeleton from '../../shared/InputSkeleton';

const CoverLetter = (props: any) => {
    const { AxiosRequest } = useAxios()
    const TextEditorComponent = useMemo(() => { return dynamic(() => import('@/app/components/shared/textEditor'), { ssr: false }) }, [])
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state);
    const themeMode = useStore(themeStore, (state) => state);
    const [loading, setLoading] = useState<boolean>(false);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const schema = yup.object({
        Content: yup.string(),
        NonHTMLContent: yup.string(),
    })
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState,
        control,
        watch,
        trigger,
    } = useForm<CoverLetterModel>(
        {
            defaultValues: {
                Content: '',
                NonHTMLContent: '',
            }, mode: 'onChange',
            resolver: yupResolver(schema)
        }
    );
    const [dataFromChild, setDataFromChild] = useState<any>(null);
    const handleData = (data: any) => {
        setDataFromChild(data);
    };
    const errors = formState.errors;
    const OnSubmit = async () => {
        let url: string;
        let data: any;
        if (User.userId != null) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveUserCoverLetter`;
            data = {
                "userId": User.userId,
                "content": dataFromChild.html,
                "nonHtmlContent": dataFromChild.nonHtml
            }
        } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/SaveCurrentUserCoverLetter`;
            data = {
                "content": dataFromChild.html,
                "nonHtmlContent": dataFromChild.nonHtml
            }
        }
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ذخیره توضیحات تکمیلی',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, save it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.Content) {
                    setLoading(true)
                    let method = 'patch';
                    let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
                    if (response) {
                        setLoading(false)
                        if (response.data.data == null) {
                            Swal.fire({
                                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: 'ذخیره توضیحات تکمیلی',
                                text: response.data.message,
                                icon: response.data.status ? "warning" : "error",
                                confirmButtonColor: "#22c55e",
                                confirmButtonText: "OK!",
                            })
                        }
                    }
                } else {
                    Swal.fire({
                        background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'ذخیره توضیحات تکمیلی',
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
        const GetCoverLetter = async () => {
            setShowEditor(false)
            let url: string;
            if (User.userId != null) {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserCoverLetter?userId=${User.userId}`;
            } else {
                url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetCurrentUserCoverLetter`;
            }
            let data = {};
            let method = 'get';
            let response: AxiosResponse<Response<GetCoverLetterModel>> = await AxiosRequest({ url, data, method, credentials: true })
            if (response) {
                if (response.data.status && response.data.data) {
                    setValue('NonHTMLContent', response.data.data.nonHtmlContent)
                    setValue('Content', response.data.data.content)

                }
                setShowEditor(true)
            }
        }
        GetCoverLetter()
    }, [User.userName, User.userId, setValue])
    return (
        <form
            onSubmit={handleSubmit(OnSubmit)}
            className='relative px-5 py-2'>
            <div dir='rtl' className="w-max">
                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save CoverLetter' placement="top">
                    <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <SaveIcon className='p-1' />
                    </Button>
                </Tooltip>
            </div>
            {showEditor == true ? <section dir='ltr' className='w-full h-[65vh] mx-auto overflow-auto my-3' >
                <TextEditorComponent sendData={handleData} className='w-full' {...register(`NonHTMLContent`)} defaultValue={watch('Content')} />
            </section> :
                <section dir='ltr' className='w-full mx-auto overflow-auto my-3' >
                    <InputSkeleton />
                </section>}
        </form>
    )
}

export default CoverLetter