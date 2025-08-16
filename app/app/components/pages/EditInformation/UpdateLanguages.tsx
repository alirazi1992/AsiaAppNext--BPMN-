import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { EducationDegreeModel, GetUserLanguages, LanguageModel, UpdateLanguageType } from '@/app/models/HR/models';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { createTheme, Theme, useTheme } from '@mui/material/styles';
import Select, { ActionMeta, SingleValue, MenuListProps, components } from 'react-select';
import SaveIcon from '@mui/icons-material/Save';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { Button, Tooltip } from '@material-tailwind/react';
type Props = {
    getData: any,
    setNewData: (data: GetUserLanguages) => void,
    state: (data: boolean) => void
}
const UpdateLanguage = (props: Props) => {
    const { AxiosRequest } = useAxios()
    let loading = {
        loadingTable: false,
        loadingRes: false
    }
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object({
        UpdateLanguageState: yup.object().shape({
            languageId: yup.number().required().min(1, 'اجباری'),
            writeLevel: yup.number().required().min(1, 'اجباری'),
            readLevel: yup.number().required().min(1, 'اجباری'),
            speakLevel: yup.number().required().min(1, 'اجباری'),
            id: yup.number().required().min(1, 'اجباری'),
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
    } = useForm<UpdateLanguageType>(
        {
            defaultValues: {
                UpdateLanguageState: {
                    languageId: props.getData.languageId,
                    readLevel: props.getData.readDominanceLevelId,
                    speakLevel: props.getData.speakDominanceLevelId,
                    writeLevel: props.getData.writeDominanceLevelId,
                    id: props.getData.id
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
  
    const OnSubmit = () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ویرایش زبان های خارجی',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdateLanguageState) {
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserLanguage`;
                        let data = {
                            "id": getValues('UpdateLanguageState.id'),
                            "languageId": getValues('UpdateLanguageState.languageId'),
                            "readLevelId": getValues('UpdateLanguageState.readLevel'),
                            "writeLevelId": getValues('UpdateLanguageState.writeLevel'),
                            "speakLevelId": getValues('UpdateLanguageState.speakLevel'),
                            "userId": User.userId,
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    id: getValues('UpdateLanguageState.id'),
                                    languageId: getValues('UpdateLanguageState.languageId'),
                                    readDominanceLevelId: getValues('UpdateLanguageState.readLevel'),
                                    speakDominanceLevelId: getValues('UpdateLanguageState.speakLevel'),
                                    writeDominanceLevelId: getValues('UpdateLanguageState.writeLevel')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش زبان های خارجی',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserLanguage`;
                        let data = {
                            "id": getValues('UpdateLanguageState.id'),
                            "languageId": getValues('UpdateLanguageState.languageId'),
                            "readLevelId": getValues('UpdateLanguageState.readLevel'),
                            "writeLevelId": getValues('UpdateLanguageState.writeLevel'),
                            "speakLevelId": getValues('UpdateLanguageState.speakLevel')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    id: getValues('UpdateLanguageState.id'),
                                    languageId: getValues('UpdateLanguageState.languageId'),
                                    readDominanceLevelId: getValues('UpdateLanguageState.readLevel'),
                                    speakDominanceLevelId: getValues('UpdateLanguageState.speakLevel'),
                                    writeDominanceLevelId: getValues('UpdateLanguageState.writeLevel')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش زبان های خارجی',
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
                        title: 'ویرایش زبان های خارجی',
                        text: 'از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                        icon: "warning",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK!",
                    })
                }
            }
        })
    }


    let languages = {
        languages: [],
        languageLevel: []
    }
    const [initialState, setInitialState] = useState<LanguageModel>(languages)

    useEffect(() => {
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
        GetLanguagesLevels()
        GetLanguages()
    }, [])


    return (
        <form
            dir='rtl'
            onSubmit={handleSubmit(OnSubmit)}
            className='relative z-[10]'>
            <div className="w-max my-2 ">
                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Languages' placement="top">
                    <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <SaveIcon className='p-1' />
                    </Button>
                </Tooltip>
            </div>
            <section className='grid grid-cols-1 gap-y-4'>
                <div className='p-1 relative'>
                    <Select isRtl
                        value={initialState.languages.find((item) => item.id == watch(`UpdateLanguageState.languageId`)) ?? null}
                        placeholder='زبان های خارجی'
                        maxMenuHeight={200}
                        className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaMedium]`}
                        options={initialState.languages}
                        {...register(`UpdateLanguageState.languageId`)}
                        onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                            {
                                setValue(`UpdateLanguageState.languageId`, option!.id),
                                    trigger(`UpdateLanguageState.languageId`)
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
                                neutral20: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                neutral30: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                neutral50: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                            },
                        })}
                    />
                    <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateLanguageState?.languageId && errors?.UpdateLanguageState!.languageId?.message}</label>
                </div>
                <div className='p-1 relative '>
                    <Select isRtl
                        placeholder='سطح مکالمه'
                        value={initialState.languageLevel.find((item) => item.id == watch(`UpdateLanguageState.speakLevel`)) ?? null}
                        maxMenuHeight={200}
                        className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaMedium]`}
                        options={initialState.languageLevel}
                        {...register(`UpdateLanguageState.speakLevel`)}
                        onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                            {
                                setValue(`UpdateLanguageState.speakLevel`, option!.id),
                                    trigger(`UpdateLanguageState.speakLevel`)
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
                                neutral20: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                neutral30: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                neutral50: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                            },
                        })}
                    />
                    <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateLanguageState?.speakLevel && errors?.UpdateLanguageState!.speakLevel?.message}</label>
                </div>
                <div className='p-1 relative'>
                    <Select isRtl
                        placeholder='سطح خواندن'
                        value={initialState.languageLevel.find((item) => item.id == watch(`UpdateLanguageState.readLevel`)) ?? null}
                        maxMenuHeight={200}
                        className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaMedium]`}
                        options={initialState.languageLevel}
                        {...register(`UpdateLanguageState.readLevel`)}
                        onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                            {
                                setValue(`UpdateLanguageState.readLevel`, option!.id),
                                    trigger(`UpdateLanguageState.readLevel`)
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
                                neutral20: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                neutral30: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                neutral50: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                            },
                        })}
                    />
                    <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateLanguageState?.readLevel && errors?.UpdateLanguageState!.readLevel?.message}</label>
                </div>
                <div className='p-1 relative'>
                    <Select isRtl
                        placeholder='سطح نگارش'
                        value={initialState.languageLevel.find((item) => item.id == watch(`UpdateLanguageState.writeLevel`)) ?? null}
                        maxMenuHeight={200}
                        className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaMedium]`}
                        options={initialState.languageLevel}
                        {...register(`UpdateLanguageState.writeLevel`)}
                        onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                            {
                                setValue(`UpdateLanguageState.writeLevel`, option!.id),
                                    trigger(`UpdateLanguageState.writeLevel`)
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
                                neutral20: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                neutral30: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                                neutral50: errors?.UpdateLanguageState?.speakLevel ? '#d32f3c' : '#607d8b',
                            },
                        })}
                    />
                    <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateLanguageState?.writeLevel && errors?.UpdateLanguageState!.writeLevel?.message}</label>
                </div>
            </section>
        </form>
    )
}

export default UpdateLanguage