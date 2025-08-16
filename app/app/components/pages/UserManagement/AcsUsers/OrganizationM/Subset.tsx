'use client';
import { Button, CardBody, Dialog, DialogBody, DialogHeader, IconButton, Input, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip, Typography } from '@material-tailwind/react'
import { Box, Checkbox, FormControl, FormControlLabel, Radio, RadioGroup, RadioProps, TextField } from '@mui/material'
import React, { useEffect, useState, useCallback } from 'react'
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import AsyncSelect from 'react-select/async';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PlaceIcon from '@mui/icons-material/Place';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import { styled } from '@mui/material/styles';
import { AxiosResponse } from 'axios';
import { Response } from '@/app/models/HR/sharedModels';
import { DataModel, CountryModels, ProvinceModel, CitiesModel } from '@/app/models/HR/models';
import useAxios from '@/app/hooks/useAxios';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { Resolver, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { AddOrganizationInformationModel, PhoneType, AddressModel, EmailModel, OptionsModel, GetOrganizationModel } from '@/app/models/UserManagement/AddOrganization.models';
import { CustomerOptionProps, CustomerProps } from '@/app/models/UserManagement/AddOrganization.models';
import TableSkeleton from '@/app/components/shared/TableSkeleton';


const SubsetOrganizationM = () => {
    const { AxiosRequest } = useAxios()
    type OrganizationListType = {
        "id": number,
        "name": string,
        "faName": string,
        "nationalCode": string
    }

    type LocationAddress = {
        countries: CountryModels[],
        provinces: ProvinceModel[],
        cities: CitiesModel[],
        addressType: OptionsModel[],
        organizationList: OrganizationListType[]
    }
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const [activeTab, setActiveTab] = useState<string>('OrgInfo')
    const [genderId, setGenderId] = useState<number>(2)
    const [loading, setLoading] = useState<boolean>(false)
    const [locations, setLoacations] = useState<LocationAddress>({
        countries: [],
        provinces: [],
        cities: [],
        addressType: [],
        organizationList: []
    })
    const [searchText, setSearchText] = useState<string>('')
    const schema = yup.object().shape({
        OrganizationInfo: yup.object(({
            name: yup.string().required('نام انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faName: yup.string().required('نام اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            title: yup.string().required('عنوان انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faTitle: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            countryId: yup.number().required().min(1, 'اجباری'),
            provinceId: yup.number().required().min(1, 'اجباری'),
            cityId: yup.number().required().min(1, 'اجباری'),
            parentOrganizationId: yup.number().required(),
        })).required(),
        phoneNumbers: yup.array(yup.object().shape({
            number: yup.string().required('اجباری').matches(/^[0-9]+$/, 'شماره تماس نامعتبر است'),
            artemisAspNetOrganizationId: yup.number().required()
        })).required().default([]),
        physicalAddresses: yup.array(yup.object().shape({
            physicalAddress: yup.string().required('اجباری'),
            countryId: yup.number().required().min(1, 'اجباری'),
            provinceId: yup.number().required().min(1, 'اجباری'),
            cityId: yup.number().required().min(1, 'اجباری'),
            addressTypeId: yup.number().required('اجباری').min(1, 'اجباری'),
            artemisAspNetOrganizationId: yup.number().required()
        })).required().default([]),
    })
    const {
        unregister,
        register,
        handleSubmit,
        setValue,
        watch,
        resetField,
        reset,
        control,
        getValues,
        formState,
        trigger,
    } = useForm<AddOrganizationInformationModel>(
        {
            defaultValues: {
                OrganizationInfo: {
                    cityId: 0,
                    countryId: 32,
                    provinceId: 0,
                    faName: '',
                    faTitle: '',
                    name: '',
                    nationalCode: '',
                    title: '',
                    isMain: false,
                    isConfirmed: false,
                    isFactual: true,
                    id: 0,
                    parentOrganizationId: 0,
                },
                phoneNumbers: [{
                    artemisAspNetOrganizationId: 0,
                    id: null,
                    isDefault: false,
                    isFax: false,
                    isMobile: false,
                    number: ''
                }],

                physicalAddresses: [{
                    addressTypeId: 0,
                    cityId: 0,
                    countryId: 32,
                    physicalAddress: '',
                    postalCode: '',
                    provinceId: 0,
                    artemisAspNetOrganizationId: 0,
                    id: null,
                }],

                emails: [
                    //     {
                    //     address: '',
                    //     isDefault: false,
                    //     artemisAspNetOrganizationId: 0,
                    //     id: 0,
                    // }
                ]
            }, mode: 'all',
            resolver: yupResolver(schema) as Resolver<AddOrganizationInformationModel>
        }
    );
    const AddressItems = useFieldArray({
        name: "physicalAddresses",
        control
    });

    const PhoneItems = useFieldArray({
        name: "phoneNumbers",
        control
    });

    const EmailItems = useFieldArray({
        name: "emails",
        control
    });
    const outerTheme = useTheme();

    const [loadingTableOrg, setLoadingTableOrg] = useState<boolean>(false)
    const GetOrganizationList = useCallback(async () => {
        setLoadingTableOrg(true)
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/searchCustomers?searchkey=${searchText}`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<OrganizationListType[]>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            setLoadingTableOrg(false)
            if (response.data.status && response.data.data != null) {
                setLoacations((state) => ({
                    ...state, organizationList: response.data.data.map((item: OrganizationListType) => {
                        return {
                            faName: item.faName,
                            id: item.id,
                            name: item.name,
                            nationalCode: item.nationalCode
                        }
                    })
                })
                )
            }
        }
    }, [searchText])


    let options = [{ faName: 'ندارد', id: 0, label: 'ندارد', name: 'ندارد', nationalCode: "", value: 0 }]
    let customerTimeOut: any;
    const filterSearchCustomers = async (searchinputValue: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/searchCustomers?searchkey=${searchinputValue}`;
        let method = 'get';
        let data = {};
        if (searchinputValue && searchinputValue != null && searchinputValue.trim() != '') {
            let response: AxiosResponse<Response<CustomerOptionProps[]>> = await AxiosRequest({ url, method, data, credentials: true })
            options = [...options, ...response.data.data.map((item: CustomerProps, index: number) => {
                return { value: item.id, label: item.faName + ` _ ` + item.nationalCode, name: item.name, faName: item.faName, nationalCode: item.nationalCode, id: item.id }
            })]

            return options.filter((i: CustomerOptionProps) =>
                i.label.toLowerCase().includes(searchinputValue.toLowerCase())
            );
        } else {
            return []
        }
    };

    const loadSearchedCustomerOptions = (
        searchinputValue: string,
        callback: (options: CustomerOptionProps[]) => void
    ) => {
        clearTimeout(customerTimeOut);
        customerTimeOut = setTimeout(async () => {
            callback(await filterSearchCustomers(searchinputValue));
        }, 1000);
    };

    let isFactual = [
        {
            label: 'حقیقی',
            value: true,
            default: 'true'
        },
        {
            label: 'حقوقی',
            value: false,
            default: 'false'
        },
    ]


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

    const AddEmailItem = () => {
        EmailItems.append({
            address: '',
            isDefault: false,
            artemisAspNetOrganizationId: 0,
            id: 0
        })
    }

    const DeleteEmail = (index: number) => {
        EmailItems.remove(index)
    }

    const AddPhoneItem = () => {
        !errors.phoneNumbers ? PhoneItems.append({
            number: '',
            isDefault: false,
            isFax: false,
            isMobile: false,
            artemisAspNetOrganizationId: 0,
            id: 0

        })
            :
            Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "افزودن شماره تماس",
                text: 'از درستی و تکمیل مورد قبلی اطمینان حاصل فرمایید و مجددا تلاش کنید',
                icon: "warning",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK"
            })
    }

    const DeletePhone = (index: number) => {
        PhoneItems.remove(index)
    }

    const AddAddressItem = () => {
        !errors.physicalAddresses ? AddressItems.append({
            physicalAddress: '',
            cityId: 0,
            countryId: 32,
            provinceId: 0,
            addressTypeId: 0,
            postalCode: '',
            id: 0,
            artemisAspNetOrganizationId: 0
        }) :
            Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "افزودن آدرس",
                text: 'از درستی و تکمیل مورد قبلی اطمینان حاصل فرمایید و مجددا تلاش کنید',
                icon: "warning",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK"
            })

    }
    const DeleteItem = (index: number) => {
        AddressItems.remove(index)
    }

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

    const DeleteOrganization = async (orgId: number) => {
        Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "حذف سازمان",
            text: "آیا از حذف کردن سازمان اطمینان دارید!؟",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, remove it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/DeleteOrganization?organizationId=${orgId}`;
                let method = 'delete';
                let data = {};
                let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
                if (response) {
                    if (response.data.status && response.data.data) {
                        let newOrg = locations.organizationList.filter((item) => item.id !== orgId)
                        setLoacations((state) => ({ ...state, organizationList: newOrg }))
                    } else {
                        Swal.fire({
                            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "حذف سازمان",
                            text: response.data.message,
                            icon: response.data.status ? "warning" : 'error',
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK"
                        })
                    }

                }

            }
        })
    }



    useEffect(() => {
        const GetCountries = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetCountries`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<CountryModels[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setLoacations((state) => ({
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
        const GetProvinces = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetProvincesList`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<ProvinceModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setLoacations((state) => ({
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
                    setLoacations((state) => ({
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
            let response: AxiosResponse<Response<OptionsModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setLoacations((state) => ({
                        ...state, addressType:
                            response.data.data.map((item: OptionsModel) => {
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
        GetCountries()
        GetProvinces()
        GetCities()
        GetAddressTypes()
    }, [])

    const [update, setUpdate] = useState<boolean>(false)

    const OnSubmit = async (data: any) => {
        if (!errors.OrganizationInfo && !errors.physicalAddresses && !errors.phoneNumbers && !errors.emails) {
            update == false ?
                Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "افزودن سازمان",
                    text: "آیا از اضافه کردن سازمان جدید اطمینان دارید!؟",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "yes!",
                    cancelButtonColor: "#f43f5e",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        setLoading(true)
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/AddOrganization`;
                        let method = 'put';
                        let data = {
                            "name": getValues('OrganizationInfo.name'),
                            "faName": getValues('OrganizationInfo.faName'),
                            "title": getValues('OrganizationInfo.title'),
                            "faTitle": getValues('OrganizationInfo.faTitle'),
                            "parentOrganizationId": getValues('OrganizationInfo.parentOrganizationId') == 0 ? null : getValues('OrganizationInfo.parentOrganizationId'),
                            "isMain": getValues('OrganizationInfo.isMain'),
                            "isConfirmed": getValues('OrganizationInfo.isConfirmed'),
                            "phoneNumbers": getValues('phoneNumbers').map((phone: PhoneType) => {
                                return {
                                    "number": phone.number,
                                    "isMobile": phone.isMobile,
                                    "isDefault": phone.isDefault,
                                    "isFax": phone.isFax
                                }
                            }),
                            "emails": getValues('emails')?.map((email: EmailModel) => {
                                return {
                                    "address": email.address,
                                    "isDefault": email.isDefault
                                }
                            }),
                            "physicalAddresses": getValues('physicalAddresses').map((address: AddressModel) => {
                                return {
                                    "physicalAddress": address.physicalAddress,
                                    "countryId": address.countryId,
                                    "provinceId": address.countryId == 32 ? address.provinceId : null,
                                    "cityId": address.countryId == 32 ? address.cityId : null,
                                    "postalCode": address.postalCode,
                                    "addressTypeId": address.addressTypeId
                                }
                            }),
                            "countryId": getValues('OrganizationInfo.countryId'),
                            "cityId": getValues('OrganizationInfo.countryId') == 32 ? getValues('OrganizationInfo.cityId') : null,
                            "provinceId": getValues('OrganizationInfo.countryId') == 32 ? getValues('OrganizationInfo.provinceId') : null,
                            "nationalCode": getValues('OrganizationInfo.nationalCode'),
                            "isFactual": getValues('OrganizationInfo.isFactual')
                        }
                        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
                        if (response) {
                            setLoading(false)
                            if (response.data.data == 0) {
                                Swal.fire({
                                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: "افزودن سازمان",
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK"
                                })
                            }
                            handleOpen()
                            reset()
                        }
                    }
                }) : Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "ویرایش سازمان",
                    text: "آیا از ویرایش این سازمان اطمینان دارید!؟",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "yes, Update it!",
                    cancelButtonColor: "#f43f5e",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        setLoading(true)
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/UpdateOrganization`;
                        let method = 'patch';
                        let data = {
                            "id": getValues('OrganizationInfo.id'),
                            "name": getValues('OrganizationInfo.name'),
                            "faName": getValues('OrganizationInfo.faName'),
                            "title": getValues('OrganizationInfo.title'),
                            "faTitle": getValues('OrganizationInfo.faTitle'),
                            "parentOrganizationId": getValues('OrganizationInfo.parentOrganizationId') == 0 ? null : getValues('OrganizationInfo.parentOrganizationId'),
                            "isMain": getValues('OrganizationInfo.isMain'),
                            "isConfirmed": getValues('OrganizationInfo.isConfirmed'),
                            "phoneNumbers":
                                getValues('phoneNumbers').map((phone: PhoneType) => {
                                    return {
                                        "number": phone.number,
                                        "isMobile": phone.isMobile,
                                        "isDefault": phone.isDefault,
                                        "isFax": phone.isFax,
                                        "artemisAspNetOrganizationId": getValues('OrganizationInfo.id'),
                                        "id": phone.id == 0 ? null : phone.id,
                                    }
                                }),
                            "emails":
                                getValues('emails')?.map((email: EmailModel) => {
                                    return {
                                        "address": email.address,
                                        "isDefault": email.isDefault,
                                        "artemisAspNetOrganizationId": getValues('OrganizationInfo.id'),
                                        "id": email.id == 0 ? null : email.id,
                                    }
                                }),
                            "physicalAddresses":
                                getValues('physicalAddresses').map((address: AddressModel) => {
                                    return {
                                        "artemisAspNetOrganizationId": getValues('OrganizationInfo.id'),
                                        "id": address.id == 0 ? null : address.id,
                                        "physicalAddress": address.physicalAddress,
                                        "countryId": address.countryId,
                                        "provinceId": address.provinceId,
                                        "cityId": address.cityId,
                                        "postalCode": address.postalCode,
                                        "addressTypeId": address.addressTypeId
                                    }
                                }),
                            "countryId": getValues('OrganizationInfo.countryId') == null ? 32 : getValues('OrganizationInfo.countryId'),
                            "cityId": getValues('OrganizationInfo.cityId'),
                            "provinceId": getValues('OrganizationInfo.provinceId'),
                            "nationalCode": getValues('OrganizationInfo.nationalCode'),
                            "isFactual": getValues('OrganizationInfo.isFactual')
                        }
                        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
                        if (response) {
                            setUpdate(false)
                            setLoading(false)
                            if (response.data.data == false) {
                                Swal.fire({
                                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: "ویرایش سازمان",
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK"
                                })
                            }
                            handleOpen()
                            reset()
                        }
                    }
                })
        }
        else {
            Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "ویرایش سازمان",
                text: 'از درستی و تکمیل موارد پرشده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                icon: "warning",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK"
            })
        }
    }

    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open)

    const GetOrganization = async (id: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetOrganization?id=${id}`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetOrganizationModel>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
            if (response.data.status && response.data.data != null) {
                setValue('OrganizationInfo', {
                    countryId: response.data.data.countryId != null ? response.data.data.countryId : 32,
                    faName: response.data.data.faName,
                    faTitle: response.data.data.faTitle,
                    name: response.data.data.name,
                    nationalCode: response.data.data.nationalCode,
                    provinceId: response.data.data.provinceId,
                    cityId: response.data.data.cityId,
                    title: response.data.data.title,
                    isConfirmed: response.data.data.isConfirm,
                    isMain: response.data.data.isMain,
                    parentOrganizationId: response.data.data.parentOrganizationId == null ? 0 : response.data.data.parentOrganizationId,
                    isFactual: response.data.data.isFactual,
                    id: id
                }),
                    response.data.data.phoneNumbers.length > 0 ?
                        setValue('phoneNumbers', response.data.data.phoneNumbers.map((item) => {
                            return {
                                number: item.number,
                                isDefault: item.isDefault,
                                isFax: item.isFax,
                                isMobile: item.isMobile,
                                artemisAspNetOrganizationId: id,
                                id: item.id
                            }
                        })) : setValue('phoneNumbers', [{
                            number: '',
                            isDefault: false,
                            isFax: false,
                            isMobile: false,
                            artemisAspNetOrganizationId: id,
                            id: null
                        }])
                response.data.data.addresses.length > 0 ? setValue('physicalAddresses', response.data.data.addresses.map((item) => {
                    return {
                        physicalAddress: item.physicalAddress,
                        cityId: item.cityId,
                        countryId: item.countryId != null ? item.countryId : 32,
                        provinceId: item.provinceId,
                        postalCode: item.postalCode,
                        artemisAspNetOrganizationId: id,
                        id: item.id,
                        addressTypeId: item.addressTypeId,
                    }
                })) : setValue('physicalAddresses', [{
                    addressTypeId: 0,
                    physicalAddress: '',
                    cityId: 0,
                    countryId: 32,
                    provinceId: 0,
                    postalCode: '',
                    artemisAspNetOrganizationId: id,
                    id: null
                }])
                response.data.data.eMails.length > 0 ? setValue('emails', response.data.data.eMails.map((item) => {
                    return {
                        address: item.address,
                        isDefault: item.isDefault,
                        artemisAspNetOrganizationId: id,
                        id: item.id
                    }
                })) : setValue('emails', [{
                    address: '',
                    isDefault: false,
                    artemisAspNetOrganizationId: id,
                    id: null
                }])
                if (
                    getValues('OrganizationInfo') != null
                ) {
                    handleOpen()
                    setUpdate(true)
                    return
                }
                return
            }
        }
    }

    return (
        <>
            <CardBody onKeyUp={(event) => event.key == 'Enter' && GetOrganizationList()} className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} w-[98%] mt-2 mx-auto`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <div className="w-full">
                    <div className="container-fluid mx-auto">
                        <div className="flex flex-col md:flex-row justify-end md:justify-between items-center">
                            <div className='w-full flex justify-start my-2 md:my-0'>
                                <IconButton onClick={() => { handleOpen(), reset(); }} style={{ background: color?.color }} size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><i className=" bi bi-plus-lg"></i>
                                </IconButton>
                            </div>
                            <div className="relative w-[90%] flex">
                                <Input
                                    dir='ltr'
                                    crossOrigin=""
                                    style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
                                    type="text"
                                    label="search"
                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} pr-10 p-2`}
                                    containerProps={{
                                        className: !themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'
                                    }}
                                    onChange={(e: any) => { setSearchText(e.target.value), e.target.value.toString().trim() == "", setLoacations((state) => ({ ...state, organizationList: [] })); }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                <Button
                                    size="sm"
                                    className="!absolute right-1 top-1 rounded p-1"
                                    style={{ background: color?.color }}
                                    onClick={() => { GetOrganizationList(); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    <SearchIcon
                                        className='p-1'
                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog
                    dismiss={{
                        escapeKey: true,
                        referencePress: true,
                        referencePressEvent: 'click',
                        outsidePress: false,
                        outsidePressEvent: 'click',
                        ancestorScroll: false,
                        bubbles: true
                    }}
                    size='xl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} absolute top-0 `} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} flex justify-between`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {update == false ? 'افزودن سازمان' : 'ویرایش سازمان'}
                        <IconButton variant="text" color="blue-gray" onClick={() => { handleOpen(), setUpdate(false); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </IconButton>
                    </DialogHeader>
                    <DialogBody dir='rtl' className=" h-full m-3 relative overflow-y-scroll " placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} h-full relative rounded-lg overflow-auto`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <section className='w-full h-full flex flex-col md:flex-row md:justify-between '>
                                <Tabs dir="ltr" value="OrgInfo" className="w-full mb-3">
                                    <form onSubmit={handleSubmit(OnSubmit)} className='h-full w-full'>
                                        <div dir='rtl' className="w-full">
                                            <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Add Organization' placement="top">
                                                <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <SaveIcon className='p-1' />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                        <TabsHeader
                                            className={` ${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} max-w-[160px]`}
                                            indicatorProps={{
                                                style: {
                                                    background: color?.color,
                                                    color: "white",
                                                },
                                                className: `shadow `,
                                            }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <Tab onClick={() => {
                                                setActiveTab('OrgInfo');
                                            }} value="OrgInfo" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='مشخصات فردی' placement="top">
                                                    <AccountBoxIcon fontSize='small' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activeTab == "OrgInfo" ? "white" : ""}` }} />
                                                </Tooltip>
                                            </Tab>
                                            <Tab onClick={() => {
                                                setActiveTab('phoneInfo');
                                            }} value="phoneInfo" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='شماره تماس' placement="top">
                                                    < LocalPhoneIcon fontSize='small' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activeTab == "phoneInfo" ? "white" : ""}` }} />
                                                </Tooltip>
                                            </Tab>
                                            <Tab onClick={() => {
                                                setActiveTab('addressInfo');
                                            }} value="addressInfo" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='آدرس ها' placement="top">
                                                    <PlaceIcon fontSize='small' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activeTab == "addressInfo" ? "white" : ""}` }} />
                                                </Tooltip>
                                            </Tab>
                                            <Tab onClick={() => {
                                                setActiveTab('OrgInfoEmail');
                                            }} value="OrgInfoEmail" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='ایمیل ها' placement="top">
                                                    <EmailIcon fontSize='small' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activeTab == "OrgInfoEmail" ? "white" : ""}` }} />
                                                </Tooltip>
                                            </Tab>
                                        </TabsHeader>
                                        <TabsBody
                                            animate={{
                                                initial: { y: 10 },
                                                mount: { y: 0 },
                                                unmount: { y: 250 },
                                            }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <TabPanel value='phoneInfo' className="p-0 w-full">
                                                <section dir='ltr' className='w-[98%] h-[60vh] relative mx-auto overflow-auto p-0 my-3' >
                                                    <table dir="rtl" className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[58vh] relative text-center `}>
                                                        <thead className='sticky z-[30] top-0 left-0 w-full'>
                                                            <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>

                                                                <th style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        شماره
                                                                    </Typography>
                                                                </th>
                                                                <th style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        isDefault
                                                                    </Typography>
                                                                </th>
                                                                <th style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        isMobile
                                                                    </Typography>
                                                                </th>
                                                                <th style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        isFax
                                                                    </Typography>
                                                                </th>

                                                                <th style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        عملیات
                                                                    </Typography>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>

                                                            {
                                                                PhoneItems.fields.length > 0 && PhoneItems.fields.map((item: PhoneType, index: number) => {
                                                                    return (
                                                                        <tr key={'phone' + index} style={{ height: '60px' }} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'braedDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} py-5 border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                                                            <td style={{ minWidth: '120px', width: '25%' }} className='p-1 relative'>
                                                                                <input
                                                                                    autoComplete='off'
                                                                                    dir='ltr'
                                                                                    {...register(`phoneNumbers.${index}.number`)}
                                                                                    className={errors?.phoneNumbers?.[index] && errors?.phoneNumbers?.[index]!.number ? `${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400` : `${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md  rinng-0 outline-none shadow-none bg-inherit focused`} />
                                                                                <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.phoneNumbers?.[index] && errors?.phoneNumbers?.[index]!.number?.message}</label>
                                                                            </td>


                                                                            <td style={{ width: '10%' }} className=' relative'>
                                                                                <Checkbox
                                                                                    {...register(`phoneNumbers.${index}.isDefault`)}
                                                                                    sx={{
                                                                                        color: color?.color,
                                                                                        '&.Mui-checked': {
                                                                                            color: color?.color,
                                                                                        },
                                                                                    }}
                                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                                    onChange={(event) => { setValue(`phoneNumbers.${index}.isDefault`, event.target.checked), trigger() }}
                                                                                />

                                                                            </td>
                                                                            <td style={{ width: '10%' }} className=' relative'>
                                                                                <Checkbox
                                                                                    {...register(`phoneNumbers.${index}.isMobile`)}
                                                                                    sx={{
                                                                                        color: color?.color,
                                                                                        '&.Mui-checked': {
                                                                                            color: color?.color,
                                                                                        },
                                                                                    }}
                                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                                    onChange={(event) => { setValue(`phoneNumbers.${index}.isMobile`, event.target.checked), trigger() }}
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: '10%' }} className=' relative'>
                                                                                <Checkbox
                                                                                    {...register(`phoneNumbers.${index}.isFax`)}
                                                                                    defaultChecked={item.isFax ? true : false}
                                                                                    sx={{
                                                                                        color: color?.color,
                                                                                        '&.Mui-checked': {
                                                                                            color: color?.color,
                                                                                        },
                                                                                    }}
                                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                                    onChange={(event) => { setValue(`phoneNumbers.${index}.isFax`, event.target.checked), trigger() }}
                                                                                />

                                                                            </td>
                                                                            <td style={{ width: "3%" }} className='px-1'>
                                                                                <div className='container-fluid mx-auto px-0.5'>
                                                                                    <div className="flex flex-row justify-evenly">
                                                                                        {index !== 0 && <Button
                                                                                            onClick={() => DeletePhone(index)}
                                                                                            size="sm"
                                                                                            className="p-1 mx-1"
                                                                                            style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                                        >
                                                                                            <DeleteIcon
                                                                                                fontSize='small'
                                                                                                sx={{ color: 'white' }}
                                                                                                className='p-1'
                                                                                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                                            />
                                                                                        </Button>}
                                                                                    </div></div></td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                    <section dir='ltr'>
                                                        <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='افزودن شماره جدید' placement="right">
                                                            <Button
                                                                onClick={() => AddPhoneItem()}
                                                                style={{ background: color?.color }}
                                                                className='mx-1 my-3 p-1 w-[30px]' size="lg" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                                <AddIcon
                                                                    sx={{ color: 'white' }}
                                                                    fontSize="small"
                                                                    className='p-1'
                                                                />
                                                            </Button>
                                                        </Tooltip>
                                                    </section>
                                                </section>
                                            </TabPanel>
                                            <TabPanel value='addressInfo' className="p-0 w-full">
                                                <section dir='ltr' className='w-[99%] mx-auto h-[60vh] relative overflow-auto p-0 my-3' >
                                                    <table dir="rtl" className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[58vh] relative text-center `}>
                                                        <thead className='sticky z-[30] top-0 left-0 w-full'>
                                                            <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                                                                <th
                                                                    style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        کشور
                                                                    </Typography>
                                                                </th>
                                                                <th
                                                                    style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        استان
                                                                    </Typography>
                                                                </th>
                                                                <th
                                                                    style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        شهر
                                                                    </Typography>
                                                                </th>
                                                                <th
                                                                    style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        انتخاب نوع آدرس
                                                                    </Typography>
                                                                </th>
                                                                <th
                                                                    style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        آدرس
                                                                    </Typography>
                                                                </th>
                                                                <th
                                                                    style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        کدپستی
                                                                    </Typography>
                                                                </th>
                                                                <th
                                                                    style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        عملیات
                                                                    </Typography>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                                                            {
                                                                AddressItems.fields.length > 0 && AddressItems.fields.map((item: AddressModel, index: number) => {
                                                                    return (
                                                                        <tr key={index} style={{ height: '55px' }} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} py-5 border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>


                                                                            <td style={{ width: '10%', minWidth: '130px' }} className='p-1 relative'>
                                                                                <Select isRtl
                                                                                    defaultValue={locations.countries.find((item: CountryModels) => item.id == 32)}
                                                                                    value={locations.countries.find((item: CountryModels) => item.id == getValues(`physicalAddresses.${index}.countryId`)) ?? locations.countries.find((item: CountryModels) => item.id == 32)}
                                                                                    maxMenuHeight={160}
                                                                                    className={`w-full font-[FaLight] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                                    options={locations.countries}
                                                                                    {...register(`physicalAddresses.${index}.countryId`)}
                                                                                    onChange={(option: SingleValue<CountryModels>, actionMeta: ActionMeta<CountryModels>) => {
                                                                                        {

                                                                                            setValue(`physicalAddresses.${index}.countryId`, option!.id)
                                                                                                , trigger()
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
                                                                                            neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                                                            neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                                                            neutral20: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]!.countryId ? '#d32f3c' : '#607d8b',
                                                                                            neutral30: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]!.countryId ? '#d32f3c' : '#607d8b',
                                                                                            neutral50: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]!.countryId ? '#d32f3c' : '#607d8b',

                                                                                        },
                                                                                    })}
                                                                                />
                                                                                <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]!.countryId?.message}</label>
                                                                            </td>
                                                                            <td style={{ width: '10%', minWidth: '130px' }} className='p-1 relative'>
                                                                                <Select isRtl
                                                                                    maxMenuHeight={160}
                                                                                    className={`w-full font-[FaLight] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                                    options={locations.provinces.filter((item) => item.countryId == getValues(`physicalAddresses.${index}.countryId`))}
                                                                                    {...register(`physicalAddresses.${index}.provinceId`)}
                                                                                    value={locations.provinces.filter((item) => item.countryId == getValues(`physicalAddresses.${index}.countryId`)).find((item: ProvinceModel) => item.id == getValues(`physicalAddresses.${index}.provinceId`)) ?? null}
                                                                                    onChange={(option: SingleValue<ProvinceModel>, actionMeta: ActionMeta<ProvinceModel>) => {
                                                                                        {
                                                                                            setValue(`physicalAddresses.${index}.provinceId`, option!.id)
                                                                                                , trigger()
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
                                                                                            neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                                                            neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                                                            neutral20: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]?.provinceId ? '#d32f3c' : '#607d8b',
                                                                                            neutral30: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]?.provinceId ? '#d32f3c' : '#607d8b',
                                                                                            neutral50: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]?.provinceId ? '#d32f3c' : '#607d8b',
                                                                                        },
                                                                                    })}
                                                                                />
                                                                                <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]!.provinceId?.message}</label>
                                                                            </td>
                                                                            <td style={{ width: '10%', minWidth: '130px' }} className='p-1 relative'>
                                                                                <Select isRtl
                                                                                    maxMenuHeight={160}
                                                                                    className={`w-full font-[FaLight] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                                    options={locations.cities.filter((item) => item.provinceId == getValues(`physicalAddresses.${index}.provinceId`))}
                                                                                    {...register(`physicalAddresses.${index}.cityId`)}
                                                                                    value={locations.cities.filter((item) => item.provinceId == getValues(`physicalAddresses.${index}.provinceId`)).find((item: CitiesModel) => item.id == getValues(`physicalAddresses.${index}.cityId`)) ?? null}

                                                                                    onChange={(option: SingleValue<CitiesModel>, actionMeta: ActionMeta<CitiesModel>) => {
                                                                                        {
                                                                                            setValue(`physicalAddresses.${index}.cityId`, option!.id),
                                                                                                trigger()
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
                                                                                            neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                                                            neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                                                            neutral20: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]?.cityId ? '#d32f3c' : '#607d8b',
                                                                                            neutral30: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]?.cityId ? '#d32f3c' : '#607d8b',
                                                                                            neutral50: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]?.cityId ? '#d32f3c' : '#607d8b',
                                                                                        },
                                                                                    })}
                                                                                />
                                                                                <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]!.cityId?.message}</label>
                                                                            </td>
                                                                            <td style={{ width: '10%', minWidth: '130px' }} className='p-1 relative'>
                                                                                <Select isRtl
                                                                                    maxMenuHeight={160}
                                                                                    className={`w-full font-[FaLight] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                                    options={locations.addressType}
                                                                                    {...register(`physicalAddresses.${index}.addressTypeId`)}
                                                                                    onChange={(option: SingleValue<OptionsModel>, actionMeta: ActionMeta<OptionsModel>) => {
                                                                                        {
                                                                                            setValue(`physicalAddresses.${index}.addressTypeId`, option!.id)
                                                                                            trigger()
                                                                                        }
                                                                                    }
                                                                                    }
                                                                                    value={locations.addressType.find((item: OptionsModel) => item.id == getValues(`physicalAddresses.${index}.addressTypeId`))}
                                                                                    theme={(theme) => ({
                                                                                        ...theme,
                                                                                        colors: {
                                                                                            ...theme.colors,
                                                                                            color: '#607d8b',
                                                                                            neutral10: `${color?.color}`,
                                                                                            primary25: `${color?.color}`,
                                                                                            primary: '#607d8b',
                                                                                            neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                                                            neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                                                            neutral20: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]?.addressTypeId ? '#d32f3c' : '#607d8b',
                                                                                            neutral30: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]?.addressTypeId ? '#d32f3c' : '#607d8b',
                                                                                            neutral50: errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]?.addressTypeId ? '#d32f3c' : '#607d8b',
                                                                                        },
                                                                                    })}
                                                                                />
                                                                                <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]!.addressTypeId?.message}</label>
                                                                            </td>
                                                                            <td style={{ minWidth: '350px' }} className='p-1 relative'>
                                                                                <input
                                                                                    autoComplete='off'
                                                                                    {...register(`physicalAddresses.${index}.physicalAddress`)}
                                                                                    type="text" className={errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]!.physicalAddress ? `${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400` : `${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused`} />
                                                                                <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]!.physicalAddress?.message}</label>
                                                                            </td>
                                                                            <td style={{ minWidth: '120px' }} className='p-1 relative'>
                                                                                <input
                                                                                    autoComplete='off'
                                                                                    {...register(`physicalAddresses.${index}.postalCode`)}
                                                                                    type="text" className={errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]!.postalCode ? `${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400` : `${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused`} />
                                                                                <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.physicalAddresses?.[index] && errors?.physicalAddresses?.[index]!.postalCode?.message}</label>
                                                                            </td>
                                                                            <td style={{ width: "3%" }} className='px-1'>
                                                                                <div className='container-fluid mx-auto px-0.5'>
                                                                                    <div className="flex flex-row justify-evenly">
                                                                                        {index !== 0 && <Button
                                                                                            onClick={() => DeleteItem(index)}
                                                                                            size="sm"
                                                                                            className="p-1 mx-1"
                                                                                            style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                                        >
                                                                                            <DeleteIcon
                                                                                                fontSize='small'
                                                                                                sx={{ color: 'white' }}
                                                                                                className='p-1'
                                                                                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                                            />
                                                                                        </Button>}
                                                                                    </div></div></td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                    <section dir='ltr'>
                                                        <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='افزودن آدرس جدید' placement="right">
                                                            <Button
                                                                onClick={() => AddAddressItem()}
                                                                style={{ background: color?.color }}
                                                                className='mx-1 my-3 p-1 w-[30px]' size="lg" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                                <AddIcon
                                                                    sx={{ color: 'white' }}
                                                                    fontSize="small"
                                                                    className='p-1'
                                                                />
                                                            </Button>
                                                        </Tooltip>
                                                    </section>
                                                </section>
                                            </TabPanel>
                                            <TabPanel value='OrgInfo' className="p-0 w-full">
                                                <ThemeProvider theme={customTheme(outerTheme)}>
                                                    <section className='h-[60vh] overflow-y-auto w-full'
                                                    >
                                                        <section dir='rtl' className='w-full max-h-[58vh] gap-x-4 p-3 grid md:grid-cols-2'>
                                                            <section className='flex flex-col gap-y-2 w-[100%] h-full'>
                                                                <section className='my-1 relative w-full'>
                                                                    <TextField
                                                                        autoComplete='off'
                                                                        sx={{ fontFamily: 'FaLight' }}
                                                                        {...register(`OrganizationInfo.faName`)}
                                                                        tabIndex={1}
                                                                        error={errors?.OrganizationInfo && errors?.OrganizationInfo?.faName && true}
                                                                        className='w-full lg:my-0 font-[FaLight]'
                                                                        dir='rtl'
                                                                        size='small'
                                                                        label='نام'
                                                                        InputProps={{
                                                                            style: { color: errors?.OrganizationInfo?.faName ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                                        }}
                                                                    />
                                                                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.OrganizationInfo?.faName && errors?.OrganizationInfo?.faName?.message}</label>
                                                                </section>
                                                                <section className='my-1 relative w-full'>
                                                                    <TextField
                                                                        autoComplete='off'
                                                                        sx={{ fontFamily: 'FaLight' }}
                                                                        {...register(`OrganizationInfo.faTitle`)}
                                                                        tabIndex={3}
                                                                        error={errors?.OrganizationInfo && errors?.OrganizationInfo?.faTitle && true}
                                                                        className='w-full lg:my-0 font-[FaLight]'
                                                                        dir='rtl'
                                                                        size='small'
                                                                        label='عنوان'
                                                                        InputProps={{
                                                                            style: { color: errors?.OrganizationInfo?.faTitle ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                                        }}
                                                                    />
                                                                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.OrganizationInfo?.faTitle && errors?.OrganizationInfo?.faTitle?.message}</label>
                                                                </section>
                                                                <section className='my-1 relative w-full'>
                                                                    <TextField
                                                                        autoComplete='off'
                                                                        sx={{ fontFamily: 'FaLight' }}
                                                                        {...register(`OrganizationInfo.nationalCode`)}
                                                                        tabIndex={6}
                                                                        className='w-full lg:my-0 font-[FaLight]'
                                                                        size='small'
                                                                        dir='ltr'
                                                                        label="شماره ملی"
                                                                        InputProps={{
                                                                            style: { color: errors?.OrganizationInfo?.nationalCode ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                                        }}
                                                                        error={errors?.OrganizationInfo && errors?.OrganizationInfo?.nationalCode && true}
                                                                    />
                                                                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.OrganizationInfo?.nationalCode && errors?.OrganizationInfo?.nationalCode?.message}</label>
                                                                </section>
                                                                <Tooltip content='test'>
                                                                    <section className='relative my-1.5 w-full'>
                                                                        <AsyncSelect isRtl className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] disabled:opacity-[5px]`} cacheOptions defaultOptions placeholder="سازمان مرجع"
                                                                            value={options.find((item: CustomerOptionProps) => item.id == getValues('OrganizationInfo.parentOrganizationId'))}
                                                                            loadOptions={loadSearchedCustomerOptions}
                                                                            onChange={(option: SingleValue<CustomerOptionProps>, actionMeta: ActionMeta<CustomerOptionProps>) => {
                                                                                setValue('OrganizationInfo.parentOrganizationId', option!.id)
                                                                            }}
                                                                            theme={(theme) => ({
                                                                                ...theme,
                                                                                height: 10,
                                                                                borderRadius: 5,
                                                                                colors: {
                                                                                    ...theme.colors,
                                                                                    color: '#607d8b',
                                                                                    neutral10: `${color?.color}`,
                                                                                    primary25: `${color?.color}`,
                                                                                    primary: '#607d8b',
                                                                                    neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                                                    neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                                                    neutral20: errors?.OrganizationInfo?.parentOrganizationId ? '#d32f3c' : '#607d8b',
                                                                                    neutral30: errors?.OrganizationInfo?.parentOrganizationId ? '#d32f3c' : '#607d8b',
                                                                                    neutral50: errors?.OrganizationInfo?.parentOrganizationId ? '#d32f3c' : '#607d8b',

                                                                                },
                                                                            })}
                                                                        />
                                                                        <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.OrganizationInfo?.parentOrganizationId && errors?.OrganizationInfo?.parentOrganizationId?.message}</label>
                                                                    </section>
                                                                </Tooltip>
                                                                <section className='my-2 relative w-full border-select-group'>
                                                                    <FormControl className='h-full w-full ' >
                                                                        <RadioGroup
                                                                            row
                                                                            {...register(`OrganizationInfo.isFactual`)}
                                                                            aria-labelledby="gender"
                                                                            value={watch(`OrganizationInfo.isFactual`)}
                                                                            defaultValue={true}
                                                                            name="customized-radios"
                                                                            className='font-[FaLight] '
                                                                        >
                                                                            {isFactual.map((item) => {
                                                                                return < FormControlLabel
                                                                                    key={item.label}
                                                                                    onChange={() => { setValue('OrganizationInfo.isFactual', item.value) }}
                                                                                    defaultChecked={getValues('OrganizationInfo.isFactual') == item.value ? true : false}
                                                                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[FaLight] `} value={item.value} control={<BpRadio />}
                                                                                    label={item.label}
                                                                                />
                                                                            })
                                                                            }
                                                                        </RadioGroup>
                                                                    </FormControl>

                                                                </section>

                                                            </section>
                                                            <section className='flex flex-col h-full gap-y-2 w-[100%]'>
                                                                <section className='relative my-1 w-full'>
                                                                    <TextField
                                                                        autoComplete='off'
                                                                        tabIndex={9}
                                                                        {...register(`OrganizationInfo.name`)}
                                                                        error={errors?.OrganizationInfo && errors?.OrganizationInfo?.name && true}
                                                                        className='w-full lg:my-0 font-[FaLight]'
                                                                        size='small'
                                                                        dir='ltr'
                                                                        sx={{ fontFamily: 'FaLight' }}
                                                                        label="نام انگلیسی"
                                                                        InputProps={{
                                                                            style: { color: errors?.OrganizationInfo?.name ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                                        }}
                                                                    />
                                                                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.OrganizationInfo?.name && errors?.OrganizationInfo?.name?.message}</label>
                                                                </section>

                                                                <section className='my-1 relative w-full'>
                                                                    <TextField
                                                                        autoComplete='off'
                                                                        dir='ltr'
                                                                        sx={{ fontFamily: 'FaLight' }}
                                                                        {...register(`OrganizationInfo.title`)}
                                                                        tabIndex={11}
                                                                        error={errors?.OrganizationInfo && errors?.OrganizationInfo?.title && true}
                                                                        className='w-full lg:my-0 font-[FaLight]'
                                                                        size='small'
                                                                        label='title'
                                                                        InputProps={{
                                                                            style: { color: errors?.OrganizationInfo?.title ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                                        }}
                                                                    />
                                                                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.OrganizationInfo?.title && errors?.OrganizationInfo?.title?.message}</label>
                                                                </section>
                                                                <section className='my-1 relative w-full'>
                                                                    <Select isRtl
                                                                        placeholder="کشور"
                                                                        // defaultValue={locations.countries.find((item: CountryModels) => item.id == 32)}
                                                                        value={locations.countries.find((item: CountryModels) => item.id == getValues('OrganizationInfo.countryId')) ?? locations.countries.find((item: CountryModels) => item.id == 32)}
                                                                        // value={locations.countries.find((item: CountryModels) => item.id == getValues('OrganizationInfo.countryId')) ?? locations.countries.find((item: CountryModels) => item.id == 32)}
                                                                        maxMenuHeight={160}
                                                                        className={`w-full font-[FaLight] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                        options={locations.countries}
                                                                        {...register(`OrganizationInfo.countryId`)}
                                                                        onChange={(option: SingleValue<CountryModels>, actionMeta: ActionMeta<CountryModels>) => {
                                                                            {
                                                                                setValue(`OrganizationInfo.countryId`, option!.id),
                                                                                    resetField('OrganizationInfo.provinceId')
                                                                                    , trigger()
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
                                                                                neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                                                neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                                                neutral20: errors?.OrganizationInfo?.countryId ? '#d32f3c' : '#607d8b',
                                                                                neutral30: errors?.OrganizationInfo?.countryId ? '#d32f3c' : '#607d8b',
                                                                                neutral50: errors?.OrganizationInfo?.countryId ? '#d32f3c' : '#607d8b',

                                                                            },
                                                                        })}
                                                                    />
                                                                    <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.OrganizationInfo && errors?.OrganizationInfo?.countryId?.message}</label>
                                                                </section>
                                                                <section className='my-1 relative w-full'>
                                                                    <Select isRtl
                                                                        placeholder="استان"
                                                                        maxMenuHeight={160}
                                                                        className={`w-full font-[FaLight] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                        options={locations.provinces.filter((item) => item.countryId == getValues(`OrganizationInfo.countryId`))}
                                                                        {...register(`OrganizationInfo.provinceId`)}
                                                                        value={locations.provinces.filter((item) => item.countryId == getValues(`OrganizationInfo.countryId`)).find((item: ProvinceModel) => item.id == getValues(`OrganizationInfo.provinceId`)) ?? null}
                                                                        onChange={(option: SingleValue<ProvinceModel>, actionMeta: ActionMeta<ProvinceModel>) => {
                                                                            {
                                                                                setValue(`OrganizationInfo.provinceId`, option!.id)
                                                                                    , trigger()
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
                                                                                neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                                                neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                                                neutral20: errors?.OrganizationInfo?.provinceId ? '#d32f3c' : '#607d8b',
                                                                                neutral30: errors?.OrganizationInfo?.provinceId ? '#d32f3c' : '#607d8b',
                                                                                neutral50: errors?.OrganizationInfo?.provinceId ? '#d32f3c' : '#607d8b',
                                                                            },
                                                                        })}
                                                                    />
                                                                    <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.OrganizationInfo && errors?.OrganizationInfo.provinceId?.message}</label>
                                                                </section>
                                                                <section className='my-1 relative w-full'>
                                                                    <Select isRtl
                                                                        placeholder="شهر"
                                                                        maxMenuHeight={160}
                                                                        className={`w-full font-[FaLight] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                        options={locations.cities.filter((item) => item.provinceId == getValues(`OrganizationInfo.provinceId`))}
                                                                        {...register(`OrganizationInfo.cityId`)}
                                                                        value={locations.cities.filter((item) => item.provinceId == getValues(`OrganizationInfo.provinceId`)).find((item) => item.id == getValues(`OrganizationInfo.cityId`)) ?? null}
                                                                        onChange={(option: SingleValue<CitiesModel>, actionMeta: ActionMeta<CitiesModel>) => {
                                                                            {
                                                                                setValue(`OrganizationInfo.cityId`, option!.id),
                                                                                    trigger()
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
                                                                                neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                                                neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                                                neutral20: errors?.OrganizationInfo?.cityId ? '#d32f3c' : '#607d8b',
                                                                                neutral30: errors?.OrganizationInfo?.cityId ? '#d32f3c' : '#607d8b',
                                                                                neutral50: errors?.OrganizationInfo?.cityId ? '#d32f3c' : '#607d8b',
                                                                            },
                                                                        })}
                                                                    />
                                                                    <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.OrganizationInfo && errors?.OrganizationInfo?.cityId?.message}</label>
                                                                </section>

                                                            </section>

                                                            <section className='grid grid-cols-2 border-select-group py-0 my-1.5 w-full'>

                                                                <FormControlLabel
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                    control={<Checkbox
                                                                        defaultChecked={getValues('OrganizationInfo.isConfirmed') == true ? true : false}
                                                                        sx={{
                                                                            color: color?.color,
                                                                            '&.Mui-checked': {
                                                                                color: color?.color,
                                                                            },
                                                                        }} {...register('OrganizationInfo.isConfirmed')}
                                                                        onChange={(event) => { setValue('OrganizationInfo.isConfirmed', event.target.checked), trigger() }} />} label="تائید شده" />
                                                                <FormControlLabel
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                    control={<Checkbox
                                                                        defaultChecked={getValues('OrganizationInfo.isMain') == true ? true : false}
                                                                        sx={{
                                                                            color: color?.color,
                                                                            '&.Mui-checked': {
                                                                                color: color?.color,
                                                                            },
                                                                        }} {...register('OrganizationInfo.isMain')}
                                                                        onChange={(event) => { setValue('OrganizationInfo.isMain', event.target.checked), trigger() }} />} label="اصلی" />
                                                            </section>
                                                        </section>
                                                    </section>
                                                </ThemeProvider >
                                            </TabPanel>
                                            <TabPanel value='OrgInfoEmail' className="p-0 w-full">
                                                <section dir='ltr' className='w-[98%] h-[60vh] relative mx-auto overflow-auto p-0 my-3' >
                                                    <table dir="rtl" className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[58vh] relative text-center `}>
                                                        <thead className='sticky z-[30] top-0 left-0 w-full'>
                                                            <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>

                                                                <th style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        ایمیل
                                                                    </Typography>
                                                                </th>
                                                                <th style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        isDefault
                                                                    </Typography>
                                                                </th>
                                                                <th style={{ borderBottomColor: color?.color }}
                                                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                                >
                                                                    <Typography
                                                                        color="blue-gray"
                                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                    >
                                                                        عملیات
                                                                    </Typography>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>

                                                            {
                                                                EmailItems.fields.length > 0 && EmailItems.fields.map((item: EmailModel, index: number) => {
                                                                    return (
                                                                        <tr key={'email' + index} style={{ height: '60px' }} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} py-5 border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                                                            <td style={{ minWidth: '120px' }} className='p-1 relative'>
                                                                                <input
                                                                                    autoComplete='off'
                                                                                    dir='ltr'
                                                                                    {...register(`emails.${index}.address`)}
                                                                                    className={errors?.emails?.[index] && errors?.emails?.[index]!.address ? `${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400` : `${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused`} />
                                                                                <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.emails?.[index] && errors?.emails?.[index]!.address?.message}</label>
                                                                            </td>
                                                                            <td style={{ width: '5%' }} className=' relative'>
                                                                                <Checkbox
                                                                                    {...register(`emails.${index}.isDefault`)}
                                                                                    onChange={(event) => { setValue(`emails.${index}.isDefault`, event.target.checked), trigger() }}
                                                                                    sx={{
                                                                                        color: color?.color,
                                                                                        '&.Mui-checked': {
                                                                                            color: color?.color,
                                                                                        },
                                                                                    }}

                                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                                />

                                                                            </td>
                                                                            <td style={{ width: "3%" }} className='px-1'>
                                                                                <div className='container-fluid mx-auto px-0.5'>
                                                                                    <div className="flex flex-row justify-evenly">
                                                                                        <Button

                                                                                            onClick={() => DeleteEmail(index)}
                                                                                            size="sm"
                                                                                            className="p-1 mx-1"
                                                                                            style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                                        >
                                                                                            <DeleteIcon
                                                                                                fontSize='small'
                                                                                                sx={{ color: 'white' }}
                                                                                                className='p-1'
                                                                                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                                            />
                                                                                        </Button>
                                                                                    </div></div></td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                    <section dir='ltr'>
                                                        <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='افزودن شماره جدید' placement="right">
                                                            <Button
                                                                onClick={() => AddEmailItem()}
                                                                style={{ background: color?.color }}
                                                                className='mx-1 my-3 p-1 w-[30px]' size="lg" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                                <AddIcon
                                                                    sx={{ color: 'white' }}
                                                                    fontSize="small"
                                                                    className='p-1'
                                                                />
                                                            </Button>
                                                        </Tooltip>
                                                    </section>
                                                </section>
                                            </TabPanel>
                                        </TabsBody>
                                    </form>
                                </Tabs>
                            </section>
                        </CardBody>
                    </DialogBody>
                </Dialog>
            </CardBody >
            <CardBody className='w-[98%] mx-auto relative rounded-lg overflow-auto p-0 mt-3 h-[65vh]' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                {loadingTableOrg == false ? (locations.organizationList.length > 0 && <table dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[63vh] `}>
                    <thead>
                        <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    #
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    نام سازمان
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    عملیات
                                </Typography>
                            </th>

                        </tr>
                    </thead>
                    <tbody className={`statusTable divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {locations.organizationList.length > 0 && locations.organizationList.map((item: OrganizationListType, index: number) => {
                            return (
                                <tr key={"cms" + index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`} >
                                    <td style={{ width: "3%", minWidth: '10px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {index + 1}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.nationalCode != null ? item.faName + ' - ' + item.nationalCode : item.faName}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '7%' }} className='p-1'>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <Button
                                                    onClick={() => { GetOrganization(item.id); }}
                                                    style={{ background: color?.color }} size="sm"
                                                    className="p-1 mx-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <EditIcon
                                                        fontSize='small'
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                    />
                                                </Button>
                                                <Button
                                                    onClick={() => DeleteOrganization(item.id)}
                                                    size="sm"
                                                    className="p-1 mx-1"
                                                    style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    <DeleteIcon
                                                        fontSize='small'
                                                        sx={{ color: 'white' }}
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>) : <TableSkeleton />}
            </CardBody>
        </>
    )
}
export default SubsetOrganizationM;
