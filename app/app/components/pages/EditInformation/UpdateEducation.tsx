import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { EducationDegreeModel, GetUserEducations, UpdateEducationType } from '@/app/models/HR/models';
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
import moment from 'jalali-moment';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { Button, Tooltip } from '@material-tailwind/react';
type Props = {
    getData: GetUserEducations,
    setNewData: (data: GetUserEducations) => void,
    state: (data: boolean) => void
}
const UpdateEducation = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const [educationLevels, setEducationLevels] = useState<EducationDegreeModel[]>([])
    const schema = yup.object({
        UpdateEducationState: yup.object().shape({
            id: yup.number().required('اجباری'),
            fieldOfStudy: yup.string().required('اجباری'),
            degree: yup.number().required().min(1, 'اجباری').typeError('مقدار عددی وارد کنید'),
            university: yup.string().required('اجباری'),
            scoreAverage: yup.string().required('اجباری').matches(/^\d+(\/\d{0,2})?$/, 'عدد باید دارای دو رقم اعشار یا کمتر باشد'),
            finishYear: yup.number().required('اجباری').min(+moment.from((new Date().getFullYear() - 50).toString(), 'YYYY').format('jYYYY'), 'تاریخ نامعتبر است').max(+moment.from((new Date().getFullYear() + 1).toString(), 'YYYY').format('jYYYY'), 'تاریخ نامعتبر است').typeError('مقدار عددی وارد کنید'),
        }).required(),
    })

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        reset,
        formState,
        control,
        trigger,
    } = useForm<UpdateEducationType>(
        {
            defaultValues: {
                UpdateEducationState: {
                    degree: props.getData.educationDegree,
                    fieldOfStudy: props.getData.name,
                    finishYear: props.getData.finishYear,
                    scoreAverage: String(props.getData.scoreAverage).includes(".") ? String(props.getData.scoreAverage).replaceAll(".", "/") : String(props.getData.scoreAverage),
                    university: props.getData.institute,
                    attachmentId: props.getData.attachmentId,
                    id: props.getData.id,
                }
            }, mode: 'onChange',
            resolver: yupResolver(schema)
        }
    );
    //
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
    const MenuList = (
        props: MenuListProps<EducationDegreeModel, false, any>
    ) => {
        return (
            <components.MenuList {...props}>
                <div className='rtl text-right'>
                    {props.children}
                </div>
            </components.MenuList>
        );
    };

    const OnSubmit = () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ویرایش سوابق آموزشی',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdateEducationState) {
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserEducation`
                        let data = {
                            "fieldOfStudy": getValues('UpdateEducationState.fieldOfStudy'),
                            "educationDegreeId": getValues('UpdateEducationState.degree'),
                            "educationInstitute": getValues('UpdateEducationState.university'),
                            "scoreAverage": Number(getValues('UpdateEducationState.scoreAverage').includes('/') ? getValues('UpdateEducationState.scoreAverage').replaceAll('/', '.') : getValues('UpdateEducationState.scoreAverage')).toFixed(2),
                            "finishYear": getValues('UpdateEducationState.finishYear'),
                            "id": getValues('UpdateEducationState.id'),
                            "userId": User.userId
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    educationDegree: getValues('UpdateEducationState.degree'),
                                    finishYear: getValues('UpdateEducationState.finishYear'),
                                    id: getValues('UpdateEducationState.id'),
                                    institute: getValues('UpdateEducationState.university'),
                                    name: getValues('UpdateEducationState.fieldOfStudy'),
                                    scoreAverage: Number(getValues('UpdateEducationState.scoreAverage').replaceAll('/', '.')).toFixed(2),
                                })
                                props.state(false)
                                // reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش سوابق آموزشی',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserEducation`
                        let data = {
                            "fieldOfStudy": getValues('UpdateEducationState.fieldOfStudy'),
                            "educationDegreeId": getValues('UpdateEducationState.degree'),
                            "educationInstitute": getValues('UpdateEducationState.university'),
                            "scoreAverage": Number(getValues('UpdateEducationState.scoreAverage').replaceAll('/', '.')).toFixed(2),
                            "finishYear": getValues('UpdateEducationState.finishYear'),
                            "id": getValues('UpdateEducationState.id'),
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    educationDegree: getValues('UpdateEducationState.degree'),
                                    finishYear: getValues('UpdateEducationState.finishYear'),
                                    id: getValues('UpdateEducationState.id'),
                                    institute: getValues('UpdateEducationState.university'),
                                    name: getValues('UpdateEducationState.fieldOfStudy'),
                                    scoreAverage: Number(getValues('UpdateEducationState.scoreAverage').replaceAll('/', '.')).toFixed(2),
                                })
                                props.state(false)
                                reset()

                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش سوابق آموزشی',
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
                        title: 'ویرایش سوابق آموزشی',
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
        const GetEducationLevels = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/BaseInfo/manage/GetEducationDegrees`;
            let method = 'get';
            let data = {}
            let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
            if (response) {
                if (response.data.status && response.data.data.length > 0) {
                    setEducationLevels(response.data.data.map((item) => {
                        return {
                            faName: item.faName,
                            id: item.id,
                            label: item.faName,
                            name: item.name,
                            value: item.id
                        }
                    }))
                }
            }
        }
        GetEducationLevels()
    }, [])

    return (
        <form
            dir='rtl'
            onSubmit={handleSubmit(OnSubmit)}
            className='relative z-[10]'>
            <div className="w-max my-2 ">
                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Educations' placement="top">
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
                            tabIndex={15}
                            {...register(`UpdateEducationState.fieldOfStudy`)}
                            error={errors?.UpdateEducationState && errors?.UpdateEducationState?.fieldOfStudy && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label="رشته ی تحصیلی"
                            InputProps={{
                                style: { color: errors?.UpdateEducationState?.fieldOfStudy ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateEducationState && errors?.UpdateEducationState?.fieldOfStudy?.message}</label>
                    </div>
                    <div className='p-1 relative '>
                        <TextField autoComplete="off"
                            sx={{ fontFamily: 'FaLight' }}
                            tabIndex={15}
                            {...register(`UpdateEducationState.university`)}
                            error={errors?.UpdateEducationState && errors?.UpdateEducationState?.fieldOfStudy && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label="دانشگاه"
                            InputProps={{
                                style: { color: errors?.UpdateEducationState?.university ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateEducationState && errors?.UpdateEducationState?.university?.message}</label>
                    </div>
                    <div className='p-1 relative'>
                        <Select isRtl
                            components={{ MenuList }}
                            {...register(`UpdateEducationState.degree`)}
                            placeholder='مقطع تحصیلی'
                            value={educationLevels.find((item) => item.id == getValues(`UpdateEducationState.degree`)) ?? null}
                            onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                                {
                                    setValue(`UpdateEducationState.degree`, option!.id)
                                        , trigger(`UpdateEducationState.degree`)
                                }
                            }
                            }
                            menuPosition='absolute'
                            maxMenuHeight={700}
                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaLight] z-[9999999] `}
                            options={educationLevels}
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
                                    neutral20: errors?.UpdateEducationState?.degree ? '#d32f3c' : '#607d8b',
                                    neutral30: errors?.UpdateEducationState?.degree ? '#d32f3c' : '#607d8b',
                                    neutral50: errors?.UpdateEducationState?.degree ? '#d32f3c' : '#607d8b',
                                },
                            })}
                        />
                        <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateEducationState?.degree && errors?.UpdateEducationState!.degree?.message}</label>
                    </div>
                    <div className='p-1 relative '>
                        <TextField autoComplete="off"
                            sx={{ fontFamily: 'FaLight' }}
                            tabIndex={15}
                            {...register(`UpdateEducationState.scoreAverage`)}
                            error={errors?.UpdateEducationState && errors?.UpdateEducationState?.scoreAverage && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label="معدل"
                            InputProps={{
                                style: { color: errors?.UpdateEducationState?.scoreAverage ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateEducationState && errors?.UpdateEducationState?.scoreAverage?.message}</label>
                    </div>
                    <div className='p-1 relative '>
                        <TextField autoComplete="off"
                            sx={{ fontFamily: 'FaLight' }}
                            tabIndex={15}
                            {...register(`UpdateEducationState.finishYear`)}
                            error={errors?.UpdateEducationState && errors?.UpdateEducationState?.finishYear && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label="سال پایان تحصیل"
                            InputProps={{
                                style: { color: errors?.UpdateEducationState?.finishYear ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateEducationState && errors?.UpdateEducationState?.finishYear?.message}</label>
                    </div>
                </section>
            </ThemeProvider>
        </form>
    )
}

export default UpdateEducation