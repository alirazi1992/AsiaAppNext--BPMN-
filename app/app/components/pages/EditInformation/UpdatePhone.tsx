import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { GetUserPhonesModel, UpdatePesonalPhonesModel } from '@/app/models/HR/models';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import { Button, Tooltip } from '@material-tailwind/react';

type Props = {
    getData: any,
    setNewData: (data: GetUserPhonesModel) => void,
    state: (data: boolean) => void
}
const UpdatePhone = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object().shape({
        UpdatePhone: yup.object().shape({
            id: yup.number().required('اجباری'),
            phoneNo: yup.string().required('اجباری').matches(/^[1-9]\d{9}$/, 'شماره تماس نامعتبر است')
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
        getValues,
        formState,
        trigger,
    } = useForm<UpdatePesonalPhonesModel>(
        {
            defaultValues: {
                UpdatePhone: {
                    phoneNo: typeof props.getData.number === 'string' ?
                        (props.getData.number.startsWith('0') ? props.getData.number.slice(1) : props.getData.number.startsWith('98') ? props.getData.number.slice(2) : props.getData.number) :
                        '',
                    isDefault: props.getData.isDefault,
                    isFax: props.getData.isFax,
                    isMobile: props.getData.isMobile,
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
            title: 'ویرایش شماره تماس',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdatePhone) {
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserProfilePhoneNo`;
                        let data = {
                            "userId": User.userId,
                            "id": getValues('UpdatePhone.id'),
                            "number": '98' + getValues('UpdatePhone.phoneNo'),
                            "isDefault": getValues('UpdatePhone.isDefault'),
                            "isFax": getValues('UpdatePhone.isFax'),
                            "isMobile": getValues('UpdatePhone.isMobile')
                        };
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    isDefault: data.isDefault,
                                    isFax: data.isFax,
                                    isMobile: data.isMobile,
                                    number: data.number
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش شماره تماس',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserProfilePhoneNo`;
                        let data = {
                            "id": getValues('UpdatePhone.id'),
                            "number": '98' + getValues('UpdatePhone.phoneNo'),
                            "isDefault": getValues('UpdatePhone.isDefault'),
                            "isFax": getValues('UpdatePhone.isFax'),
                            "isMobile": getValues('UpdatePhone.isMobile')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    isDefault: data.isDefault,
                                    isFax: data.isFax,
                                    isMobile: data.isMobile,
                                    number: data.number
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش شماره تماس',
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
                        title: 'ویرایش شماره تماس',
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
                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Phone Numbers' placement="top">
                    <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <SaveIcon className='p-1' />
                    </Button>
                </Tooltip>
            </div>
            <ThemeProvider theme={customTheme(outerTheme)}>
                <section className='grid grid-cols-1 gap-y-4'>
                    <div className='p-1 relative'>
                        <TextField
                            {...register('UpdatePhone.phoneNo')}
                            autoComplete="off"
                            size='small'
                            dir='ltr'
                            tabIndex={1}
                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                            focused
                            error={errors?.UpdatePhone && errors?.UpdatePhone?.phoneNo && true}
                            label="شماره تماس"
                            sx={{ width: '100%' }}
                            InputProps={{
                                style: { color: errors?.UpdatePhone?.phoneNo ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <span className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} bg-[#607d8b70] rounded-sm border-[#607d8b] px-2 mr-2`}>98</span>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdatePhone && errors?.UpdatePhone!.phoneNo?.message}</label>
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
                                }}  {...register('UpdatePhone.isDefault')}
                                checked={watch('UpdatePhone.isDefault')}
                                onChange={(event) => { setValue('UpdatePhone.isDefault', event.target.checked), trigger() }}
                            />} label="is Default" />
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
                                }}  {...register('UpdatePhone.isMobile')}
                                checked={watch('UpdatePhone.isMobile')}
                                onChange={(event) => { setValue('UpdatePhone.isMobile', event.target.checked), trigger() }}
                            />} label="is Mobile" />
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
                                }}  {...register('UpdatePhone.isFax')}
                                checked={watch('UpdatePhone.isFax')}
                                onChange={(event) => { setValue('UpdatePhone.isFax', event.target.checked), trigger() }}
                            />} label="is Fax" />
                    </div>
                </section>
            </ThemeProvider>


        </form>
    )
}

export default UpdatePhone