'use client';
import { Button, CardBody, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip } from '@material-tailwind/react'
import { Box, Checkbox, FormControl, FormControlLabel, InputAdornment, InputLabel, Radio, RadioGroup, RadioProps, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SaveIcon from '@mui/icons-material/Save';
import { styled } from '@mui/material/styles';
import { AxiosResponse } from 'axios';
import { Response } from '@/app/models/HR/sharedModels';
import useAxios from '@/app/hooks/useAxios';
import OutlinedInput, { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import moment from 'jalali-moment';
import DateRangePicker from '@/app/components/shared/DatePicker/DateRangePicker';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import UpdateStatusUsers from '@/app/zustandData/UpdateStatusUsers';
import UpdateStatusUser from '@/app/zustandData/UpdateStatusUser';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Swal from 'sweetalert2';
import Loading from '@/app/components/shared/loadingResponse';
import { GetInformationStatusUser, UpdateStatusUserInformationModel } from '@/app/models/UserManagement/StatusUsers/statusTypes';
import AddRole from './AddRole';

const StatusUserInfo = () => {
    const { AxiosRequest } = useAxios()
    const UserId = UpdateStatusUsers((state) => state.userId);
    const Update = UpdateStatusUser((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const [activeTab, setActiveTab] = useState<string>('personInfo')
    const [loading, setLoading] = useState<boolean>(false)

    const schema = yup.object().shape({
        StatusUserInfo: yup.object(({
            userName: yup.string().required('نام کاربری اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            accessFailedCount: yup.number().required(),
            email: yup.string().required('ایمیل اجباری میباشد').matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,})$/, 'ایمیل نامعتبر'),
            phoneNumber: yup.string().required('اجباری').matches(/^[0-9]+$/, 'شماره تماس نامعتبر است'),
        })).required(),
    })
    const {
        unregister,
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        getValues,
        formState,
        trigger,
    } = useForm<UpdateStatusUserInformationModel>(
        {
            defaultValues: {
                StatusUserInfo: {
                    email: '',
                    isActive: false,
                    lockoutEnabled: false,
                    lockoutEnd: '',
                    phoneNumber: '',
                    twoFactorEnabled: false,
                    userName: '',
                    accessFailedCount: 0,
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );


    const errors = formState.errors;
    const BpIcon = styled('span')(({ theme }) => ({
        borderRadius: '50%',
        width: 16,
        height: 16,
        boxShadow:
            theme.palette.mode ===
                'dark'
                ? '0 0 0 1px rgb(16 22 26 / 40%)'
                : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor:
            theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
        backgroundImage:
            theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
                : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background:
                theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
        },
    }));
    const BpCheckedIcon = styled(BpIcon)({
        backgroundColor: color?.color,
        backgroundImage: 'linear-gradient(180deg,#818cf810,hsla(0,0%,100%,0))',
        '&::before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: color?.color,
        },
    });

    function BpRadio(props: RadioProps) {
        return (
            <Radio
                disableRipple
                color="default"
                checkedIcon={<BpCheckedIcon />}
                icon={<BpIcon />}
                {...props}
            />
        );
    }

    const outerTheme = useTheme();
    const DatePickerInputlockoutEnd = (props: any) => {
        return (
            <div dir='rtl'>
                <ThemeProvider theme={DateThemeLockoutEnd(outerTheme)}>
                    <TextField
                        autoComplete='off'
                        error={errors?.StatusUserInfo?.lockoutEnd ? true : false}
                        InputProps={{
                            style: { color: errors?.StatusUserInfo?.lockoutEnd ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                        }}
                        sx={{ fontFamily: 'FaLight' }} size='small' className='w-full relative font-[FaLight]' {...props} dir="ltr" type='text' crossOrigin="" label={props.label} color="primary" />
                </ThemeProvider>
            </div>)
    }
    const setChangeDatelockoutEnd = (_unix: any, formatted: any) => {
        setValue('StatusUserInfo.lockoutEnd', moment.from(formatted, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD'));
        trigger()
    }

    const DateThemeLockoutEnd = (outerTheme: Theme) =>
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
                            '--TextField-brandBorderColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
                            '--TextField-brandBorderHoverColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
                            '--TextField-brandBorderFocusedColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
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
                        },
                    },

                },
                MuiOutlinedInput: {
                    styleOverrides: {
                        notchedOutline: {
                            borderColor: 'var(--TextField-brandBorderColor)',
                        },
                        root: {
                            '--TextField-brandBorderColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
                            '--TextField-brandBorderHoverColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
                            '--TextField-brandBorderFocusedColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
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
                            }
                        },
                    },
                },
                MuiFilledInput: {
                    styleOverrides: {
                        root: {
                            '--TextField-brandBorderColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
                            '--TextField-brandBorderHoverColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
                            '--TextField-brandBorderFocusedColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
                            '&::before, &::after': {
                                borderBottom: '2px solid var(--TextField-brandBorderColor)',
                            },
                            '&:hover:not(.Mui-disabled, .Mui-error):before': {
                                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
                            },
                            '&.Mui-focused:after': {
                                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
                            },
                        },
                    },
                },
                MuiInput: {
                    styleOverrides: {
                        root: {
                            '--TextField-brandBorderColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
                            '--TextField-brandBorderHoverColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
                            '--TextField-brandBorderFocusedColor': errors?.StatusUserInfo?.lockoutEnd ? '#d32f3c' : '#607d8b',
                            '&::before': {
                                borderBottom: '2px solid var(--TextField-brandBorderColor)',
                            },
                            '&:hover:not(.Mui-disabled, .Mui-error):before': {
                                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
                            },
                            '&.Mui-focused:after': {
                                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
                            },
                        }
                    },
                },
            },
        });

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

    const OnSubmit = async () => {
        if (!errors.StatusUserInfo) {
            Swal.fire({
                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "به روزرسانی کاربر",
                text: "آیا از اضافه کردن مورد جدید اطمینان دارید!؟",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#22c55e",
                confirmButtonText: "yes!",
                cancelButtonColor: "#f43f5e",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(true)
                    let url = `${process.env.NEXT_PUBLIC_API_URL}/statusidentity/ManageUser/UpdateStatusUser`;
                    let method = 'patch';
                    let data = {
                        "isActive": getValues('StatusUserInfo.isActive'),
                        "userName": getValues('StatusUserInfo.userName'),
                        "email": getValues('StatusUserInfo.email'),
                        "phoneNumber": getValues('StatusUserInfo.phoneNumber'),
                        "twoFactorEnabled": getValues('StatusUserInfo.twoFactorEnabled'),
                        "lockoutEnd": getValues('StatusUserInfo.lockoutEnd'),
                        "lockoutEnabled": getValues('StatusUserInfo.lockoutEnabled'),
                        "accessFailedCount": getValues('StatusUserInfo.accessFailedCount'),
                    }
                    let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true });
                    if (response) {
                        setLoading(false)
                        if (response.data.status && response.data.data) {
                            reset()
                            location.reload()
                        } else {
                            Swal.fire({
                                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: "به روزرسانی کاربر",
                                text: response.data.message,
                                icon: response.data.status && response.data.data == null ? "warning" : 'error',
                                confirmButtonColor: "#22c55e",
                                confirmButtonText: "OK"
                            })
                        }
                    }
                }
            })
        }
        else {
            Swal.fire({
                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "به روزرسانی کاربر",
                text: 'از درستی و تکمیل موارد پرشده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                icon: "warning",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK"
            })
        }
    }



    useEffect(() => {
        const GetUser = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/statusidentity/ManageUser/GetStatusUser?id=${UserId}`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<GetInformationStatusUser>> = await AxiosRequest({ url, method, data, credentials: true });
            if (response) {
                if (response.data.status && response.data.data) {
                    await Update?.setState({
                        id: response.data.data.id != null ? response.data.data.id : 0,
                        userName: response.data.data.userName != '' ? response.data.data.userName : '',
                        accessFailedCount: response.data.data.accessFailedCount,
                        lockoutEnd: response.data.data.lockoutEnd != '' ? response.data.data.lockoutEnd : '',
                        twoFactorEnabled: response.data.data.twoFactorEnabled,
                        lockoutEnabled: response.data.data.lockoutEnabled,
                        isActive: response.data.data.isActive,
                        email: response.data.data.email != '' ? response.data.data.email : '',
                        phoneNumber: response.data.data.phoneNumber != '' ? response.data.data.phoneNumber : '',
                    })
                }
            }
        }
        if (UserId != null)
            GetUser()
    }, [UserId])

    useEffect(() => {
        reset(undefined, {
            keepValues: false,
            keepDefaultValues: false,
            keepDirty: false,
            keepDirtyValues: false,
            keepErrors: false,
            keepIsSubmitSuccessful: false,
            keepIsSubmitted: false,
            keepIsValid: false,
            keepIsValidating: false,
            keepSubmitCount: false,
            keepTouched: false
        })
        if (Update.id != null) {
            setValue('StatusUserInfo', {
                userName: Update!.userName,
                accessFailedCount: Update!.accessFailedCount,
                twoFactorEnabled: Update!.twoFactorEnabled,
                email: Update!.email,
                phoneNumber: Update!.phoneNumber,
                isActive: Update!.isActive,
                lockoutEnabled: Update!.lockoutEnabled,
                lockoutEnd: Update!.lockoutEnd,
            })
        }
    }, [Update.id, reset, setValue])

    return (
        <>
            {loading == true ? <Loading /> :
                <CardBody className='w-[98%] h-full mx-auto relative rounded-lg overflow-auto '  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <section className='w-full h-full flex flex-col md:flex-row md:justify-between '>
                        <Tabs dir="ltr" value="personInfo" className="w-full mb-3">
                            <TabsHeader
                                className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} max-w-[90px]`}
                                indicatorProps={{
                                    style: {
                                        background: color?.color,
                                        color: "white",
                                    },
                                    className: `shadow `,
                                }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                <Tab onClick={() => {
                                    setActiveTab('personInfo');
                                } } value="personInfo"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='مشخصات فردی' placement="top">
                                        <AccountBoxIcon fontSize='small' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activeTab == "personInfo" ? "white" : ""}` }} />
                                    </Tooltip>
                                </Tab>
                                <Tab onClick={() => {
                                    setActiveTab('addRole');
                                } } value="addRole"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='سمت ها' placement="top">
                                        <ManageAccountsIcon fontSize='small' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activeTab == "addRole" ? "white" : ""}` }} />
                                    </Tooltip>
                                </Tab>
                            </TabsHeader>
                            <TabsBody
                                animate={{
                                    initial: { y: 10 },
                                    mount: { y: 0 },
                                    unmount: { y: 250 },
                                }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                <TabPanel value='personInfo' className="p-0 w-full">
                                    <ThemeProvider theme={customTheme(outerTheme)}>
                                        <form onSubmit={handleSubmit(OnSubmit)} className='h-full w-full'>
                                            <div dir='rtl' className="w-full">
                                                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update User' placement="top">
                                                    <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                        <SaveIcon className='p-1' />
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                            <section className='w-full max-h-[68vh] p-3 grid md:gap-x-3 lg:gap-x-5 md:grid-cols-2 lg:grid-cols-5'>
                                                <section className='lg:col-span-2 flex flex-col h-full gap-y-4 '>
                                                    <section dir='ltr' className='relative w-full mt-1'>
                                                        <TextField
                                                            {...register(`StatusUserInfo.userName`)}
                                                            autoComplete="off"
                                                            size='small'
                                                            dir='ltr'
                                                            value={getValues(`StatusUserInfo.userName`)}
                                                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} no-caret`}
                                                            label='username'
                                                            sx={{ width: '100%', color: '#607d8b' }}
                                                            InputLabelProps={{
                                                                style: { color: '#607d8b' }
                                                            }}
                                                            InputProps={{
                                                                style: { color: errors?.StatusUserInfo?.userName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f', background: '#607d8b20' },
                                                            }}
                                                            onFocus={(e) => e.target.blur()}
                                                        />
                                                        <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.StatusUserInfo?.userName && errors?.StatusUserInfo?.userName?.message}</label>
                                                    </section>
                                                    <section className='relative my-1 w-full'>
                                                        <TextField
                                                            autoComplete='off'
                                                            tabIndex={9}
                                                            {...register(`StatusUserInfo.email`)}
                                                            focused={getValues(`StatusUserInfo.email`) != '' ? true : false}
                                                            error={errors?.StatusUserInfo && errors?.StatusUserInfo?.email && true}
                                                            className='w-full lg:my-0 font-[FaLight]'
                                                            size='small'
                                                            dir='ltr'
                                                            sx={{ fontFamily: 'FaLight' }}
                                                            label='Email'
                                                            InputProps={{
                                                                style: { color: errors?.StatusUserInfo?.email ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                                            }}
                                                        />
                                                        <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.StatusUserInfo?.email && errors?.StatusUserInfo?.email?.message}</label>
                                                    </section>
                                                    <section className='my-1 relative w-full'>
                                                        <TextField
                                                            autoComplete='off'
                                                            sx={{ fontFamily: 'FaLight' }}
                                                            tabIndex={10}
                                                            dir='ltr'
                                                            {...register(`StatusUserInfo.phoneNumber`)}
                                                            focused={getValues(`StatusUserInfo.phoneNumber`) != '' ? true : false}
                                                            error={errors?.StatusUserInfo && errors?.StatusUserInfo?.phoneNumber && true}
                                                            className='w-full lg:my-0 font-[FaLight]'
                                                            size='small'
                                                            label='Phone Number'
                                                            InputProps={{
                                                                style: { color: errors?.StatusUserInfo?.phoneNumber ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                                            }}
                                                        />
                                                        <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.StatusUserInfo?.phoneNumber && errors?.StatusUserInfo?.phoneNumber?.message}</label>
                                                    </section>
                                                </section>

                                                <section className='lg:col-span-2 flex flex-col h-full gap-y-4 '>
                                                    <section className='relative w-full mt-1'>
                                                        <TextField
                                                            autoComplete="off"
                                                            tabIndex={18}
                                                            sx={{ fontFamily: 'FaLight' }}
                                                            {...register(`StatusUserInfo.accessFailedCount`)}
                                                            InputProps={{
                                                                style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                                            }}
                                                            focused={getValues(`StatusUserInfo.accessFailedCount`) ? true : false}
                                                            dir='ltr'
                                                            className='w-full ' type='number'
                                                            size='small'
                                                            label="accessFailedCount"
                                                            variant="outlined" />
                                                    </section>
                                                    <section dir='rtl' className='relative my-1 w-full '>
                                                        <DateRangePicker
                                                            autoComplete="off"
                                                            {...register(`StatusUserInfo.lockoutEnd`)}
                                                            tabIndex={12}
                                                            inputComponent={(props: any) => DatePickerInputlockoutEnd({ ...props, label: "lockoutEnd" })}
                                                            placeholder=""
                                                            format="jYYYY/jMM/jDD"
                                                            onChange={(unix: any, formatted: any) => setChangeDatelockoutEnd(unix, formatted)}
                                                            cancelOnBackgroundClick={false}
                                                            preSelected={Update?.lockoutEnd ? moment.from(Update?.lockoutEnd, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : null}
                                                        />
                                                        <label className='absolute bottom-[-20px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.StatusUserInfo?.lockoutEnd && errors?.StatusUserInfo?.lockoutEnd?.message}</label>
                                                    </section>
                                                </section>
                                                <section className='lg:col-span-1 flex flex-col h-full mt-3 md:my-0 gap-y-4'>
                                                    <FormControlLabel
                                                        className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full mt-1 lg:flex lg:justify-center`}
                                                        control={<Checkbox
                                                            defaultChecked={Update?.twoFactorEnabled}
                                                            sx={{
                                                                color: color?.color,
                                                                '&.Mui-checked': {
                                                                    color: color?.color,
                                                                },
                                                            }} {...register('StatusUserInfo.twoFactorEnabled')}
                                                            onChange={(event) => { setValue('StatusUserInfo.twoFactorEnabled', event.target.checked), trigger() }} />} label="twoFactorEnabled" />
                                                    <FormControlLabel
                                                         className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full mt-1 lg:flex lg:justify-center`}
                                                        control={<Checkbox
                                                            defaultChecked={Update?.lockoutEnabled}
                                                            sx={{
                                                                color: color?.color,
                                                                '&.Mui-checked': {
                                                                    color: color?.color,
                                                                },
                                                            }} {...register('StatusUserInfo.lockoutEnabled')} onChange={(event) => { setValue('StatusUserInfo.lockoutEnabled', event.target.checked), trigger() }} />} label="LockoutEnabled" />
                                                    <FormControlLabel
                                                         className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full mt-1 lg:flex lg:justify-center`}
                                                        control={<Checkbox
                                                            defaultChecked={Update?.isActive}
                                                            sx={{
                                                                color: color?.color,
                                                                '&.Mui-checked': {
                                                                    color: color?.color,
                                                                },
                                                            }} {...register('StatusUserInfo.isActive')} onChange={(event) => { setValue('StatusUserInfo.isActive', event.target.checked), trigger() }} />} label="isActive" />
                                                </section>
                                            </section>
                                        </form>
                                    </ThemeProvider >
                                </TabPanel>
                                <TabPanel value='addRole' className="p-0 w-full">
                                    <AddRole />
                                </TabPanel>
                            </TabsBody>
                        </Tabs>
                    </section>
                </CardBody >}
        </>
    )
}

export default StatusUserInfo
