import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { EducationDegreeModel, GetSoftwareModels, UpdateSoftwareType } from '@/app/models/HR/models';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import Select, { ActionMeta, SingleValue, MenuListProps, components } from 'react-select';
import SaveIcon from '@mui/icons-material/Save';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { TextField } from '@mui/material';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { Button, Tooltip } from '@material-tailwind/react';
type Props = {
    getData: any,
    setNewData: (data: GetSoftwareModels) => void,
    state: (data: boolean) => void
}
const UpdateSoftware = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object({
        UpdateSoftware: yup.object().shape({
            softwareName: yup.string().required('نام نرم افزار را وارد کنید'),
            id: yup.number().required('اجباری'),
            dominantLevel: yup.number().required('میزان توانایی استفاده را وارد کنید').min(1, 'میزان توانایی استفاده را وارد کنید')
        }).required()
    });

    const {
        register,
        handleSubmit,
        getValues,
        reset,
        setValue,
        formState,
        trigger,
    } = useForm<UpdateSoftwareType>(
        {
            defaultValues: {
                UpdateSoftware: { dominantLevel: props.getData.dominanceLevelId, softwareName: props.getData.name, attachmentId: props.getData.attachmentId, id: props.getData.id }
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
            title: 'ویرایش نرم افزارهای تخصصی',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdateSoftware) {
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserSoftware`
                        let data = {
                            "id": getValues('UpdateSoftware.id'),
                            "userId": User.userId,
                            "software": getValues('UpdateSoftware.softwareName'),
                            "dominanceLevelId": getValues('UpdateSoftware.dominantLevel')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    dominanceLevelId: getValues('UpdateSoftware.dominantLevel'),
                                    name: getValues('UpdateSoftware.softwareName'),
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش نرم افزارهای تخصصی',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserSoftware`
                        let data = {
                            "id": getValues('UpdateSoftware.id'),
                            "software": getValues('UpdateSoftware.softwareName'),
                            "dominanceLevelId": getValues('UpdateSoftware.dominantLevel')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    dominanceLevelId: getValues('UpdateSoftware.dominantLevel'),
                                    name: getValues('UpdateSoftware.softwareName'),
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش نرم افزارهای تخصصی',
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
                        title: 'ویرایش نرم افزارهای تخصصی',
                        text: 'از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                        icon: "warning",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK!",
                    })
                }
            }
        })
    }
    const [dominanceLevels, setDominanceLevels] = useState<EducationDegreeModel[]>([])
    useEffect(() => {
        const GetDominanceLevels = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/BaseInfo/manage/GetDominanceLevels`;
            let method = 'get';
            let data = {}
            let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setDominanceLevels(response.data.data.map((item) => {
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
        GetDominanceLevels()
    }, [])

    return (
        <form
            dir='rtl'
            onSubmit={handleSubmit(OnSubmit)}
            className='relative z-[10]'>
            <div className="w-max my-2 ">
                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Softwares' placement="top">
                    <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <SaveIcon className='p-1' />
                    </Button>
                </Tooltip>
            </div>
            <ThemeProvider theme={customTheme(outerTheme)}>
                <section className='grid grid-cols-1 gap-y-4'>
                    <div className='p-1 relative'>
                        <TextField autoComplete="off"
                            sx={{ fontFamily: 'FaLight' }}
                            tabIndex={1}
                            {...register(`UpdateSoftware.softwareName`)}
                            error={errors?.UpdateSoftware && errors?.UpdateSoftware?.softwareName && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label='نرم افزار های تخصصی'
                            InputProps={{
                                style: { color: errors?.UpdateSoftware?.softwareName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateSoftware && errors?.UpdateSoftware?.softwareName?.message}</label>
                    </div>
                    <div className='p-1 relative '>
                        <Select isRtl
                            placeholder='میزان توانایی استفاده'
                            maxMenuHeight={200}
                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaMedium]`}
                            options={dominanceLevels}
                            {...register(`UpdateSoftware.dominantLevel`)}
                            value={dominanceLevels.find((item) => item.id == getValues(`UpdateSoftware.dominantLevel`)) ?? null}
                            onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                                {
                                    setValue(`UpdateSoftware.dominantLevel`, option!.id),
                                        trigger(`UpdateSoftware.dominantLevel`)
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
                                    neutral20: errors?.UpdateSoftware?.dominantLevel ? '#d32f3c' : '#607d8b',
                                    neutral30: errors?.UpdateSoftware?.dominantLevel ? '#d32f3c' : '#607d8b',
                                    neutral50: errors?.UpdateSoftware?.dominantLevel ? '#d32f3c' : '#607d8b',
                                },
                            })}
                        />
                        <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateSoftware?.dominantLevel && errors?.UpdateSoftware!.dominantLevel?.message}</label>
                    </div>

                </section>
            </ThemeProvider>
        </form>
    )
}

export default UpdateSoftware