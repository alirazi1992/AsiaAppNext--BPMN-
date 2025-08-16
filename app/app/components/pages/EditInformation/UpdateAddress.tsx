import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { CitiesModel, CountryModels, EducationDegreeModel, GetUserAddressModel, LocationAddress, ProvinceModel, UpdatePesonalAddressesModel } from '@/app/models/HR/models';
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
import Select, { ActionMeta, SingleValue } from 'react-select';
type Props = {
    getData: any,
    setNewData: (data: GetUserAddressModel) => void,
    state: (data: boolean) => void
}
const UpdateAddress = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object().shape({
        UpdateAddress: yup.object().shape({
            address: yup.string().required('اجباری'),
            countryId: yup.number().required().min(1, 'اجباری'),
            provinceId: yup.number().required().min(1, 'اجباری'),
            id: yup.number().required('اجباری'),
            cityId: yup.number().required().min(1, 'اجباری'),
            addressTypeId: yup.number().required('اجباری').min(1, 'اجباری'),
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
    } = useForm<UpdatePesonalAddressesModel>(
        {
            defaultValues: {
                UpdateAddress: {
                    addressTypeId: props.getData.addressTypeId,
                    cityId: props.getData.cityId,
                    countryId: props.getData.countryId,
                    address: props.getData.address,
                    postalCode: props.getData.postalCode,
                    provinceId: props.getData.provinceId,
                    id: props.getData.id
                }
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
            title: 'ویرایش آدرس',
            text: 'آیا از ذخیره این تغییرات اطمینان دارید؟',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Yes, update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!errors.UpdateAddress) {
                    let url: string;
                    let method = 'patch';
                    if (User.userId != null) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateUserProfileAddress`
                        let data = {
                            "userId": User.userId,
                            "id": getValues('UpdateAddress.id'),
                            "addressType": getValues('UpdateAddress.addressTypeId'),
                            "countryId": getValues('UpdateAddress.countryId'),
                            "provinceId": getValues('UpdateAddress.provinceId'),
                            "cityId": getValues('UpdateAddress.cityId'),
                            "address": getValues('UpdateAddress.address'),
                            "postalCode": getValues('UpdateAddress.postalCode')
                        };
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    address: getValues('UpdateAddress.address'),
                                    addressTypeId: getValues('UpdateAddress.addressTypeId'),
                                    cityId: getValues('UpdateAddress.cityId'),
                                    countryId: getValues('UpdateAddress.countryId'),
                                    provinceId: getValues('UpdateAddress.provinceId'),
                                    postalCode: getValues('UpdateAddress.postalCode')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش آدرس',
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK!",
                                })
                            }
                        }
                    }
                    else {
                        url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/UpdateCurrentUserProfileAddress`
                        let data = {
                            "id": getValues('UpdateAddress.id'),
                            "addressType": getValues('UpdateAddress.addressTypeId'),
                            "countryId": getValues('UpdateAddress.countryId'),
                            "provinceId": getValues('UpdateAddress.provinceId'),
                            "cityId": getValues('UpdateAddress.cityId'),
                            "address": getValues('UpdateAddress.address'),
                            "postalCode": getValues('UpdateAddress.postalCode')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
                        if (response) {
                            if (response.data.status && response.data.data) {
                                props.setNewData({
                                    ...props.getData,
                                    address: getValues('UpdateAddress.address'),
                                    addressTypeId: getValues('UpdateAddress.addressTypeId'),
                                    cityId: getValues('UpdateAddress.cityId'),
                                    countryId: getValues('UpdateAddress.countryId'),
                                    provinceId: getValues('UpdateAddress.provinceId'),
                                    postalCode: getValues('UpdateAddress.postalCode')
                                })
                                props.state(false)
                                reset()
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: 'ویرایش آدرس',
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
                        title: 'ویرایش آدرس',
                        text: 'از درستی و تکمیل موارد اضافه شده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                        icon: "warning",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK!",
                    })
                }
            }
        })
    }

    const [location, setLoacation] = useState<LocationAddress>({
        countries: [],
        provinces: [],
        cities: [],
        addressType: []
    })

    const GetProvinces = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetProvincesList`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<ProvinceModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            if (response.data.status && response.data.data != null) {
                setLoacation((state) => ({
                    ...state, provinces: response.data.data.map((item: ProvinceModel) => {
                        return {
                            countryId: item.countryId,
                            enName: item.enName,
                            faName: item.faName,
                            id: item.id,
                            label: item.faName,
                            value: item.id
                        }
                    })
                })
                )
            }
        }
    }
    const GetCities = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetCitiesList`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<CitiesModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            if (response.data.status && response.data.data != null) {
                setLoacation((state) => ({
                    ...state, cities: response.data.data.map((item: CitiesModel) => {
                        return {
                            enName: item.enName,
                            faName: item.faName,
                            id: item.id,
                            label: item.faName,
                            provinceId: item.provinceId,
                            value: item.id
                        }
                    })
                })

                )
            }
        }
    }

    const GetAddressTypes = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetAddressTypes`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            if (response.data.status && response.data.data != null) {
                setLoacation((state) => ({
                    ...state, addressType:
                        response.data.data.map((item: EducationDegreeModel) => {
                            return {
                                faName: item.faName,
                                id: item.id,
                                label: item.faName,
                                name: item.name,
                                value: item.id
                            }
                        })
                }))
            }
        }
    }



    useEffect(() => {
        const GetCountries = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetCountries`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<CountryModels[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setLoacation((state) => ({
                        ...state, countries: response.data.data.map((item: CountryModels) => {
                            return {
                                enName: item.enName,
                                faName: item.faName,
                                id: item.id,
                                label: item.faName,
                                value: item.id
                            }
                        })
                    })

                    )
                }
            }
        }
        GetCountries()
        GetProvinces()
        GetAddressTypes()
        GetCities()
    }, [])


    return (
        <form
            dir='rtl'
            onSubmit={handleSubmit(OnSubmit)}
            className='relative z-[10]'>
            <div className="w-max my-2 ">
                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Personnel Email' placement="top">
                    <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <SaveIcon className='p-1' />
                    </Button>
                </Tooltip>
            </div>
            <ThemeProvider theme={customTheme(outerTheme)}>
                <section className='grid grid-cols-1 gap-y-4'>
                    <div className='p-1 relative'>
                        <Select isRtl
                            maxMenuHeight={300}
                            placeholder='کشور'
                            className={`w-full font-[FaLight] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                            options={location.countries}
                            {...register(`UpdateAddress.countryId`)}
                            value={location.countries.find((item: CountryModels) => item.id == getValues(`UpdateAddress.countryId`)) ?? null}
                            onChange={(option: SingleValue<CountryModels>, actionMeta: ActionMeta<CountryModels>) => {
                                {
                                    setValue(`UpdateAddress.countryId`, option!.id),
                                        setValue(`UpdateAddress.provinceId`, 0),
                                        setValue(`UpdateAddress.cityId`, 0)
                                        , trigger(`UpdateAddress.countryId`)
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
                                    neutral20: errors?.UpdateAddress?.countryId ? '#d32f3c' : '#607d8b',
                                    neutral30: errors?.UpdateAddress?.countryId ? '#d32f3c' : '#607d8b',
                                    neutral50: errors?.UpdateAddress?.countryId ? '#d32f3c' : '#607d8b',

                                },
                            })}
                        />
                        <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateAddress && errors?.UpdateAddress!.countryId?.message}</label>
                    </div>
                    <div className='p-1 relative  '>
                        <Select<ProvinceModel, false, any>
                            isRtl
                            placeholder='استان'
                            {...register(`UpdateAddress.provinceId`)}
                            value={location.provinces.find((item) => item.id == getValues(`UpdateAddress.provinceId`)) ?? null}
                            maxMenuHeight={300}
                            className={`w-full font-[FaLight] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                            options={location.provinces.filter((item) => item.countryId == getValues(`UpdateAddress.countryId`))}
                            onChange={(option: SingleValue<ProvinceModel>, actionMeta: ActionMeta<ProvinceModel>) => {
                                {
                                    setValue(`UpdateAddress.provinceId`, option!.id),
                                        setValue(`UpdateAddress.cityId`, 0)
                                    trigger(`UpdateAddress.provinceId`)

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
                                    neutral20: errors?.UpdateAddress?.provinceId ? '#d32f3c' : '#607d8b',
                                    neutral30: errors?.UpdateAddress?.provinceId ? '#d32f3c' : '#607d8b',
                                    neutral50: errors?.UpdateAddress?.provinceId ? '#d32f3c' : '#607d8b',
                                },
                            })}
                        />
                        <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateAddress && errors?.UpdateAddress!.provinceId?.message}</label>
                    </div>
                    <div className='p-1 relative'>
                        <Select<CitiesModel, false, any> isRtl
                            placeholder='شهر'
                            {...register(`UpdateAddress.cityId`)}
                            value={location.cities.find((item) => item.id == getValues(`UpdateAddress.cityId`)) ?? null}
                            maxMenuHeight={300}
                            className={`w-full font-[FaLight] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                            options={location.cities.filter((item) => item.provinceId == getValues(`UpdateAddress.provinceId`))}
                            onChange={(option: SingleValue<CitiesModel>, actionMeta: ActionMeta<CitiesModel>) => {
                                {
                                    setValue(`UpdateAddress.cityId`, option!.id),
                                        trigger(`UpdateAddress.cityId`)
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
                                    neutral20: errors?.UpdateAddress?.cityId ? '#d32f3c' : '#607d8b',
                                    neutral30: errors?.UpdateAddress?.cityId ? '#d32f3c' : '#607d8b',
                                    neutral50: errors?.UpdateAddress?.cityId ? '#d32f3c' : '#607d8b',
                                },
                            })}
                        />
                        <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateAddress && errors?.UpdateAddress!.cityId?.message}</label>
                    </div>
                    <div className='p-1 relative'>
                        <Select isRtl
                            placeholder='نوع آدرس'
                            value={location.addressType.find((item: EducationDegreeModel) => item.id == getValues(`UpdateAddress.addressTypeId`)) ?? null}
                            maxMenuHeight={300}
                            className={`w-full font-[FaLight] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                            options={location.addressType}
                            {...register(`UpdateAddress.addressTypeId`)}
                            onChange={(option: SingleValue<EducationDegreeModel>, actionMeta: ActionMeta<EducationDegreeModel>) => {
                                {
                                    setValue(`UpdateAddress.addressTypeId`, option!.id)
                                    trigger(`UpdateAddress.addressTypeId`)
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
                                    neutral20: errors?.UpdateAddress?.addressTypeId ? '#d32f3c' : '#607d8b',
                                    neutral30: errors?.UpdateAddress?.addressTypeId ? '#d32f3c' : '#607d8b',
                                    neutral50: errors?.UpdateAddress?.addressTypeId ? '#d32f3c' : '#607d8b',
                                },
                            })}
                        />
                        <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.UpdateAddress && errors?.UpdateAddress!.addressTypeId?.message}</label>
                    </div>
                    <div className='p-1 relative'>
                        <TextField autoComplete="off"
                            sx={{ fontFamily: 'FaLight' }}
                            tabIndex={5}
                            {...register(`UpdateAddress.postalCode`)}
                            error={errors?.UpdateAddress && errors?.UpdateAddress?.postalCode && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label='کد پستی'
                            InputProps={{
                                style: { color: errors?.UpdateAddress?.postalCode ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateAddress && errors?.UpdateAddress?.postalCode?.message}</label>
                    </div>
                    <div className='p-1 relative'>
                        <TextField autoComplete="off"
                            sx={{ fontFamily: 'FaLight' }}
                            tabIndex={4}
                            {...register(`UpdateAddress.address`)}
                            error={errors?.UpdateAddress && errors?.UpdateAddress?.address && true}
                            className='w-full lg:my-0 font-[FaLight]'
                            size='small'
                            label='آدرس'
                            InputProps={{
                                style: { color: errors?.UpdateAddress?.address ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                            }}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.UpdateAddress && errors?.UpdateAddress?.address?.message}</label>
                    </div>
                </section>
            </ThemeProvider>
        </form>
    )
}

export default UpdateAddress