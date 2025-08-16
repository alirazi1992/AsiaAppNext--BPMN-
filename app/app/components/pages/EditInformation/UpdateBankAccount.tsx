import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { EducationDegreeModel, GetBankAccountModels, UpdateBanksAccountModel } from '@/app/models/HR/models';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import Select, { ActionMeta, SingleValue } from 'react-select';
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
    setNewData: (data: GetBankAccountModels) => void,
    state: (data: boolean) => void
}
const UpdatebankAccount = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)

    const schema = yup.object().shape({
        UpdateBank: yup.object().shape({
            accountNo: yup.string().required("اجباری").matches(/^[0-9]+$/, 'شماره حساب نامعنبر'),
            debitCardNo: yup.string().required('اجباری').matches(/^[0-9]{16}$/, 'شماره کارت نامعنبر'),
            shebaNo: yup.string().required('اجباری').matches(/^[0-9]+$/, 'شماره شبا نامعنبر'),
            bankId: yup.number().required('اجباری').min(1, 'اجباری'),
            id: yup.number().required('اجباری')
        }).required()
    });

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
    } = useForm<UpdateBanksAccountModel>(
        {
            defaultValues: {
                UpdateBank:
                {
                    accountNo: props.getData.accountNo,
                    bankId: props.getData.bankId,
                    debitCardNo: props.getData.debitCardNo,
                    isDefault: props.getData.isDefault,
                    shebaNo: props.getData.shebaNo,
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
            title: ' ویرایش اطلاعات بانکی',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdateBank) {
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserBankAccount`
                        let data = {
                            "id": getValues('UpdateBank.id'),
                            "userId": User.userId,
                            "debitCardNo": getValues('UpdateBank.debitCardNo'),
                            "shebaNo": getValues('UpdateBank.shebaNo'),
                            "accountNo": getValues('UpdateBank.accountNo'),
                            "isDefault": getValues('UpdateBank.isDefault'),
                            "bankId": getValues('UpdateBank.bankId')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData, 
                                    accountNo:getValues('UpdateBank.accountNo'),
                                    bankId:getValues('UpdateBank.bankId'), 
                                    debitCardNo:getValues('UpdateBank.debitCardNo'), 
                                    isDefault:getValues('UpdateBank.isDefault'), 
                                    shebaNo:getValues('UpdateBank.shebaNo')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: ' ویرایش اطلاعات بانکی',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserBankAccount`
                        let data = {
                            "id": getValues('UpdateBank.id'),
                            "debitCardNo": getValues('UpdateBank.debitCardNo'),
                            "shebaNo": getValues('UpdateBank.shebaNo'),
                            "accountNo": getValues('UpdateBank.accountNo'),
                            "isDefault": getValues('UpdateBank.isDefault'),
                            "bankId": getValues('UpdateBank.bankId')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData, 
                                    accountNo:getValues('UpdateBank.accountNo'),
                                    bankId:getValues('UpdateBank.bankId'), 
                                    debitCardNo:getValues('UpdateBank.debitCardNo'), 
                                    isDefault:getValues('UpdateBank.isDefault'), 
                                    shebaNo:getValues('UpdateBank.shebaNo')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: ' ویرایش اطلاعات بانکی',
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
                        title: ' ویرایش اطلاعات بانکی',
                        text: 'از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                        icon: "warning",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK!",
                    })
                }
            }
        })
    }
    const [bankList, setBankList] = useState<EducationDegreeModel[]>([])
    useEffect(() => {
        const GetBankList = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetBanksList`;
            let method = 'get';
            let data = {}
            let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setBankList(response.data.data.map((item) => {
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
        GetBankList()
    }, []);



    return (
        <form
            dir='rtl'
            onSubmit={handleSubmit(OnSubmit)}
            className='relative z-[10]'>
            <div className="w-max my-2 ">
                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Bank Account' placement="top">
                    <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <SaveIcon className='p-1' />
                    </Button>
                </Tooltip>
            </div>
            <ThemeProvider theme={customTheme(outerTheme)}>
                <section className='grid grid-cols-1 gap-y-4'>
                    <div className='p-1 relative'>
                        <Select isRtl
                            placeholder='نام بانک'
                            maxMenuHeight={200}
                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaMedium]`}
                            options={bankList}
                            {...register(`UpdateBank.bankId`)}
                            onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                                {
                                    setValue(`UpdateBank.bankId`, option!.id),
                                        trigger(`UpdateBank.bankId`)
                                }
                            }
                            }
                            value={bankList.find((item) => item.id == getValues(`UpdateBank.bankId`)) ?? null}
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
                                    neutral20: errors?.UpdateBank?.bankId ? '#d32f3c' : '#607d8b',
                                    neutral30: errors?.UpdateBank?.bankId ? '#d32f3c' : '#607d8b',
                                    neutral50: errors?.UpdateBank?.bankId ? '#d32f3c' : '#607d8b',
                                },
                            })}
                        />
                        <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateBank?.bankId && errors?.UpdateBank?.bankId?.message}</label>
                    </div>
                    <div className='p-1 relative'>
                        <TextField
                            dir='ltr'
                            autoComplete="off"
                            sx={{ fontFamily: 'FaLight' }}
                            tabIndex={2}
                            {...register(`UpdateBank.shebaNo`)}
                            error={errors?.UpdateBank && errors?.UpdateBank?.shebaNo && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label='شماره شباء'
                            InputProps={{
                                style: { color: errors?.UpdateBank?.shebaNo ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateBank && errors?.UpdateBank?.shebaNo?.message}</label>
                    </div>
                    <div className='p-1 relative'>
                        <TextField autoComplete="off"
                            dir='ltr'
                            sx={{ fontFamily: 'FaLight' }}
                            tabIndex={3}
                            {...register(`UpdateBank.accountNo`)}
                            error={errors?.UpdateBank && errors?.UpdateBank?.accountNo && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label='شماره حساب'
                            InputProps={{
                                style: { color: errors?.UpdateBank?.accountNo ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateBank && errors?.UpdateBank?.accountNo?.message}</label>
                    </div>
                    <div className='p-1 relative'>
                        <TextField autoComplete="off"
                            dir='ltr'
                            sx={{ fontFamily: 'FaLight' }}
                            tabIndex={4}
                            {...register(`UpdateBank.debitCardNo`)}
                            error={errors?.UpdateBank && errors?.UpdateBank?.shebaNo && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label='شماره کارت'
                            InputProps={{
                                style: { color: errors?.UpdateBank?.debitCardNo ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                inputProps: { maxLength: 16 }
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateBank && errors?.UpdateBank?.debitCardNo?.message}</label>
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
                                }}  {...register(`UpdateBank.isDefault`)}
                                checked={watch(`UpdateBank.isDefault`)}
                                onChange={(event) => { setValue(`UpdateBank.isDefault`, event.target.checked), trigger() }}
                            />} label="پیش فرض" />
                    </div>
                </section>
            </ThemeProvider>
        </form>
    )
}

export default UpdatebankAccount