import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { GetUserEmailModel, UpdatePesonalEmailsModel } from '@/app/models/HR/models';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { Button, Tooltip } from '@material-tailwind/react';
type Props = {
    getData: any,
    setNewData: (data: GetUserEmailModel) => void,
    state: (data: boolean) => void
}
const UpdateEmail = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object().shape({
        UpdateEmail: yup.object().shape({
            id: yup.number().required('اجباری'),
            address: yup.string().required('اجباری').matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,})$/, 'ایمیل نامعتبر'),
        }),
    })
    const {
        unregister,
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        watch,
        resetField,
        getValues,
        formState,
        trigger,
    } = useForm<UpdatePesonalEmailsModel>(
        {
            defaultValues: {
                UpdateEmail: {
                    address: props.getData.address,
                    isDefault: props.getData.isDefault,
                    id: props.getData.id
                },
            }, mode: 'all',
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
            title: 'ویرایش ایمیل',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdateEmail) {
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserProfileEmail`
                        let data = {
                            "userId": User.userId,
                            "id": getValues('UpdateEmail.id'),
                            "address": getValues('UpdateEmail.address'),
                            "isDefault": getValues('UpdateEmail.isDefault')
                        };
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    address: getValues('UpdateEmail.address'),
                                    isDefault: getValues('UpdateEmail.isDefault')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش ایمیل',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserProfileEmail`
                        let data = {
                            "id": getValues('UpdateEmail.id'),
                            "address": getValues('UpdateEmail.address'),
                            "isDefault": getValues('UpdateEmail.isDefault')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    address: getValues('UpdateEmail.address'),
                                    isDefault: getValues('UpdateEmail.isDefault')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش ایمیل',
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
                        title: 'ویرایش ایمیل',
                        text: 'از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                        icon: "warning",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK!",
                    })
                }
            }
        })
    }


    return (
        <form
            dir='rtl'
            onSubmit={handleSubmit(OnSubmit)}
            className='relative z-[10]'>
            <div className="w-max my-2 ">
                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Personnel Emails' placement="top">
                    <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <SaveIcon className='p-1' />
                    </Button>
                </Tooltip>
            </div>
            <ThemeProvider theme={customTheme(outerTheme)}>
                <section className='grid grid-cols-1 gap-y-4'>
                    <div className='p-1 relative'>
                        <TextField
                            {...register('UpdateEmail.address')}
                            autoComplete="off"
                            size='small'
                            dir='ltr'
                            tabIndex={1}
                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                            focused
                            error={errors?.UpdateEmail && errors?.UpdateEmail?.address && true}
                            label="ایمیل"
                            sx={{ width: '100%' }}
                            InputProps={{
                                style: { color: errors?.UpdateEmail?.address ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateEmail && errors?.UpdateEmail.address?.message}</label>
                    </div>
                    <div className='p-1 relative'>
                        <FormControlLabel
                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                            control={<Checkbox
                                sx={{
                                    color: color?.color,
                                    '&.Mui-checked': {
                                        color: color?.color,
                                    },
                                }}  {...register('UpdateEmail.isDefault')}
                                checked={watch('UpdateEmail.isDefault')}
                                onChange={(event) => { setValue('UpdateEmail.isDefault', event.target.checked), trigger() }}
                            />} label="is Default" />
                    </div>
                </section>
            </ThemeProvider>

        </form>
    )
}

export default UpdateEmail