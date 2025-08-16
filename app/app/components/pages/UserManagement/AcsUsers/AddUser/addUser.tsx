'use client';
import { Button, CardBody, Tooltip } from '@material-tailwind/react'
import { Box, Checkbox, FormControl, FormControlLabel, Radio, RadioGroup, RadioProps, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import SaveIcon from '@mui/icons-material/Save';
import { styled } from '@mui/material/styles';
import { AxiosResponse } from 'axios';
import { Response } from '@/app/models/HR/sharedModels';
import { DataModel, EducationDegreeModel, CountryModels, ProvinceModel, CitiesModel, AddUserInformationModel } from '@/app/models/HR/models';
import useAxios from '@/app/hooks/useAxios';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2';
import Loading from '@/app/components/shared/loadingResponse';
import { DateObject } from "react-multi-date-picker";
import DatePickare from '@/app/EndPoints-AsiaApp/Components/Shared/DatePickareComponent';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import persian from "react-date-object/calendars/persian"
import persian_en from "react-date-object/locales/persian_en";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import "react-multi-date-picker/styles/layouts/mobile.css"
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import "react-multi-date-picker/styles/backgrounds/bg-gray.css"



type PersonalInfoModel = {
    gender: EducationDegreeModel[],
    militry: DataModel[],
    EducationDegree: EducationDegreeModel[]
}

const PesonalInfo = () => {
    const { AxiosRequest } = useAxios()
    let personalInfoData: PersonalInfoModel = {
        gender: [],
        militry: [],
        EducationDegree: []
    }

    type LocationAddress = {
        countries: CountryModels[],
        provinces: ProvinceModel[],
        cities: CitiesModel[],
        addressType: EducationDegreeModel[]
    }
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const [activeTab, setActiveTab] = useState<string>('personInfo')
    const [data, setData] = useState(personalInfoData)
    const [loading, setLoading] = useState<boolean>(false)
    const [locations, setLoacations] = useState<LocationAddress>({
        countries: [],
        provinces: [],
        cities: [],
        addressType: []
    })
    const schema = yup.object().shape({
        UserInfo: yup.object(({
            // faFirstName: yup.string().required('نام اجباری').matches(/^[\u0600-\u06FF\s]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            faLastName: yup.string().required('نام خانوادگی اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            faTitle: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            // firstName: yup.string().required('نام انگلیسی اجباری').matches(/^[A-Za-z]/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            userName: yup.string().required('نام کاربری اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            password: yup.string()
                .required('پسورد اجباری است')
                .test('has-lowercase', 'حداقل یک حرف کوچک باید وجود داشته باشد', value =>
                    /[a-z]/.test(value))
                .test('has-uppercase', 'حداقل یک حرف بزرگ باید وجود داشته باشد', value =>
                    /[A-Z]/.test(value))
                .test('has-special-char', 'حداقل یک کاراکتر خاص باید وجود داشته باشد', value =>
                    /[!@#$%^&*]/.test(value))
                .test('no-persian', 'پسورد نمی‌تواند شامل حروف فارسی باشد', value =>
                    !/[آ-ی]/.test(value))
                .min(8, 'حداقل باید 8 کاراکتر باشد')
            ,
            confirmPassword: yup.string()
                .required('تایید پسورد اجباری ').test('has-lowercase', 'حداقل یک حرف کوچک باید وجود داشته باشد', value =>
                    /[a-z]/.test(value))
                .test('has-uppercase', 'حداقل یک حرف بزرگ باید وجود داشته باشد', value =>
                    /[A-Z]/.test(value))
                .test('has-special-char', 'حداقل یک کاراکتر خاص باید وجود داشته باشد', value =>
                    /[!@#$%^&*]/.test(value))
                .test('no-persian', 'پسورد نمی‌تواند شامل حروف فارسی باشد', value =>
                    !/[آ-ی]/.test(value))
                .min(8, 'حداقل باید 8 کاراکتر باشد')
                .oneOf([yup.ref('password')], 'پسوردها باهم مطابقت ندارند'),
            lastName: yup.string().required('نام خانوادگی انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            title: yup.string().required('عنوان انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            accessFailedCount: yup.number(),
            personnelId: yup.number().required('اجباری').typeError('مقدار عددی وارد کنید'),
        })).required(),
    })
    const {
        unregister,
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        watch,
        getValues,
        formState,
        trigger,
    } = useForm<AddUserInformationModel>(
        {
            defaultValues: {
                UserInfo: {
                    title: '',
                    faTitle: '',
                    firstName: '',
                    userName: '',
                    birthDate: '',
                    faLastName: '',
                    birthCertificateId: '',
                    faFirstName: '',
                    insuranceNumber: '',
                    fatherName: '',
                    lastName: '',
                    nationalCode: '',
                    militaryServiceId: null,
                    birthCertificateIssueCity: '',
                    childCount: 0,
                    lastEducationDegree: 0,
                    lastFieldOfStudy: '',
                    employeementDate: '',
                    personnelId: 0,
                    genderId: 1,
                    accessFailedCount: 0,
                    password: '',
                    confirmPassword: '',
                    isTechnicalExp: false,
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
    const married = [{
        id: 1,
        title: 'single',
        faTitle: 'مجرد',
        isMarried: false
    }, {
        id: 2,
        title: 'married',
        faTitle: 'متاهل',
        isMarried: true
    }]


    useEffect(() => {
        const GetGender = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetGenders`;
            let method = 'GET';
            let data = {};
            let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data) {
                    setData((prev) => ({
                        ...prev, gender: response.data.data
                    }))
                }
            }
        }
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
            let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setLoacations((state) => ({
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
        const GetEducationLevels = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/BaseInfo/manage/GetEducationDegrees`;
            let method = 'get';
            let data = {}
            let response: AxiosResponse<Response<EducationDegreeModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setData((state) => ({
                        ...state, EducationDegree: response.data.data.map((item: EducationDegreeModel) => {
                            return {
                                value: item.id,
                                label: item.faName,
                                faName: item.faName,
                                name: item.name,
                                id: item.id

                            }
                        })
                    }))
                }
            }
        }

        const GetMilitaryServicesList = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/BaseInfo/manage/GetMilitariesList`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<DataModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setData(prev => ({
                        ...prev, militry:
                            response.data.data.length > 0 ? response.data.data.map((item: DataModel) => {
                                return {
                                    value: item.id,
                                    label: item.faTitle,
                                    faTitle: item.faTitle,
                                    id: item.id,
                                    title: item.title
                                }
                            }) : []
                    }))
                }
            }
        }
        GetGender()
        GetCountries()
        GetProvinces()
        GetCities()
        GetEducationLevels()
        GetAddressTypes()
        GetMilitaryServicesList()
    }, [])

    const OnSubmit = async () => {
        if (!errors.UserInfo) {
            Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "افزودن کاربر",
                text: "آیا از اضافه کردن مورد جدید اطمینان دارید!؟",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#22c55e",
                confirmButtonText: "Yes, Add User!",
                cancelButtonColor: "#f43f5e",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(true)
                    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/AddUser`;
                    let method = 'post';
                    let data = {
                        "lockoutEnd": getValues(`UserInfo.lockoutEnd`),
                        "userName": getValues(`UserInfo.userName`),
                        "twoFactorEnabled": getValues(`UserInfo.twoFactorEnabled`),
                        "lockoutEnabled": getValues(`UserInfo.lockoutEnabled`) ? getValues(`UserInfo.lockoutEnabled`) : false,
                        "accessFailedCount": getValues(`UserInfo.accessFailedCount`) != 0 ? getValues(`UserInfo.accessFailedCount`) : 0,
                        "isActive": getValues(`UserInfo.IsActive`) ? getValues(`UserInfo.IsActive`) : false,
                        "faFirstName": getValues(`UserInfo.faFirstName`),
                        "firstName": getValues(`UserInfo.firstName`),
                        "faLastName": getValues(`UserInfo.faLastName`),
                        "lastName": getValues(`UserInfo.lastName`),
                        "title": getValues(`UserInfo.title`),
                        "faTitle": getValues(`UserInfo.faTitle`),
                        "genderId": getValues(`UserInfo.genderId`) ? getValues(`UserInfo.genderId`) : 1,
                        "personalCode": getValues(`UserInfo.personnelId`),
                        "isConfirmed": getValues(`UserInfo.isConfirmed`) ? getValues(`UserInfo.isConfirmed`) : false,
                        "nationalCode": getValues(`UserInfo.nationalCode`),
                        "employmentDate": getValues(`UserInfo.employeementDate`),
                        "childCount": Number(getValues(`UserInfo.childCount`)),
                        "fatherName": getValues(`UserInfo.fatherName`),
                        "inssuranceNo": getValues(`UserInfo.insuranceNumber`) ? getValues(`UserInfo.insuranceNumber`) : '',
                        "birthCertificateId": getValues(`UserInfo.birthCertificateId`),
                        "birthCertificateIssueanceCity": getValues(`UserInfo.birthCertificateIssueCity`),
                        "militaryServiceId": getValues(`UserInfo.militaryServiceId`) ? getValues(`UserInfo.militaryServiceId`) : null,
                        "lastEducationDegree": getValues(`UserInfo.lastEducationDegree`),
                        "fieldOfStudy": getValues(`UserInfo.lastFieldOfStudy`),
                        "isMarried": getValues(`UserInfo.isMarried`) ? getValues(`UserInfo.isMarried`) : false,
                        "password": getValues(`UserInfo.password`),
                        "confirmPassword": getValues(`UserInfo.confirmPassword`),
                        'birthDate': getValues(`UserInfo.birthDate`),
                        'isTechnicalExp': getValues(`UserInfo.isTechnicalExp`)
                    }
                    let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
                    if (response) {
                        reset()
                        setLoading(false)
                        if (response.data.status && response.data.data) {
                            location.reload()
                        } else {
                            Swal.fire({
                                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: "افزودن کاربر",
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
        else {
            Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "افزودن کاربر",
                text: 'از درستی و تکمیل موارد پرشده اطمینان حاصل فرمایید و مجددا تلاش کنید',
                icon: "warning",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK"
            })
        }
    }

    const [state, setState] = useState<{
        birthDate: {
            format: string;
            gregorian?: string;
            persian?: string;
            date?: DateObject | null;
        }
        , employmentDate: {
            format: string;
            gregorian?: string;
            persian?: string;
            date?: DateObject | null;
        }
        , lockoutEnd: {
            format: string;
            gregorian?: string;
            persian?: string;
            date?: DateObject | null;
        }
    }>(({ birthDate: { format: "YYYY/MM/DD" }, employmentDate: { format: "YYYY/MM/DD" }, lockoutEnd: { format: "YYYY/MM/DD" } }))


    const ConvertBirthDate = (date: DateObject, format: string = state.birthDate.format) => {
        let object = { date, format };
        setValue('UserInfo.birthDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('UserInfo.birthDate')
        setState(prevState => ({
            ...prevState,
            birthDate: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }
    const ConvertEmploymentDate = (date: DateObject, format: string = state.employmentDate.format) => {
        let object = { date, format };
        setValue('UserInfo.employeementDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('UserInfo.employeementDate')
        setState(prevState => ({
            ...prevState,
            employmentDate: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }
    const ConvertlockedDate = (date: DateObject, format: string = state.lockoutEnd.format) => {
        let object = { date, format };
        setValue('UserInfo.lockoutEnd', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('UserInfo.lockoutEnd')
        setState(prevState => ({
            ...prevState,
            lockoutEnd: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }

    return (
        <MyCustomComponent>
            <>
                {loading == true ? <Loading /> :
                    <CardBody className='w-[98%] h-full mx-auto relative rounded-lg overflow-auto ' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <section className='w-full h-full flex flex-col md:flex-row md:justify-between '>
                            <form onSubmit={handleSubmit(OnSubmit)} className='h-full w-full'>
                                <div dir='rtl' className="w-full">
                                    <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Add User' placement="top">
                                        <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                            <SaveIcon className='p-1' />
                                        </Button>
                                    </Tooltip>
                                </div>
                                <section className='h-[68vh] overflow-y-auto w-full'
                                >
                                    <section dir='rtl' className='w-full max-h-[68vh] gap-x-4 p-3 grid md:grid-cols-2 lg:grid-cols-3'>
                                        <section className='flex flex-col gap-y-3 w-[100%] h-full'>
                                            <section className='my-1 relative w-full'>
                                                <TextField
                                                    autoComplete='off'
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.faFirstName`)}
                                                    tabIndex={1}
                                                    error={errors?.UserInfo && errors?.UserInfo?.faFirstName && true}
                                                    className='w-full lg:my-0 font-[FaLight]'
                                                    dir='rtl'
                                                    size='small'
                                                    label='نام'
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.faFirstName ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.faFirstName && errors?.UserInfo?.faFirstName?.message}</label>
                                            </section>
                                            <section className='my-1 relative w-full'>
                                                <TextField
                                                    autoComplete='off'
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.faLastName`)}
                                                    tabIndex={2}
                                                    error={errors?.UserInfo && errors?.UserInfo?.faLastName && true}
                                                    className='w-full lg:my-0 font-[FaLight]'
                                                    dir='rtl'
                                                    size='small'
                                                    label="نام خانوادگی"
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.faLastName ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.faLastName && errors?.UserInfo?.faLastName?.message}</label>
                                            </section>
                                            <section className='my-1 relative w-full'>
                                                <TextField
                                                    autoComplete='off'
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.faTitle`)}
                                                    tabIndex={3}
                                                    error={errors?.UserInfo && errors?.UserInfo?.faTitle && true}
                                                    className='w-full lg:my-0 font-[FaLight]'
                                                    dir='rtl'
                                                    size='small'
                                                    label='عنوان'
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.faTitle ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.faTitle && errors?.UserInfo?.faTitle?.message}</label>
                                            </section>
                                            <section className='my-1 relative w-full'>
                                                <TextField
                                                    autoComplete='off'
                                                    {...register(`UserInfo.fatherName`)}
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    tabIndex={4}
                                                    className='w-full lg:my-0 font-[FaLight]'
                                                    dir='rtl'
                                                    size='small'
                                                    label="نام پدر"
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.fatherName ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                    error={errors?.UserInfo && errors?.UserInfo?.fatherName && true}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.fatherName && errors?.UserInfo?.fatherName?.message}</label>
                                            </section>
                                            <section dir='rtl' className='relative my-1 w-full '>
                                                <DatePickare
                                                    haveHour={false}
                                                    register={{ ...register(`UserInfo.birthDate`) }}
                                                    label='تاریخ تولد'
                                                    value={state.birthDate.date}
                                                    onChange={(date: DateObject) => ConvertBirthDate(date)}
                                                    error={errors?.UserInfo && errors?.UserInfo?.birthDate && true}
                                                    focused={watch(`UserInfo.birthDate`)}
                                                />
                                                <label className='absolute bottom-[-20px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.birthDate && errors?.UserInfo?.birthDate?.message}</label>
                                            </section>
                                            <section className='my-1 relative w-full'>
                                                <TextField
                                                    autoComplete='off'
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.nationalCode`)}
                                                    tabIndex={6}
                                                    className='w-full lg:my-0 font-[FaLight]'
                                                    size='small'
                                                    dir='ltr'
                                                    label="شماره ملی"
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.nationalCode ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                    error={errors?.UserInfo && errors?.UserInfo?.nationalCode && true}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.nationalCode && errors?.UserInfo?.nationalCode?.message}</label>
                                            </section>
                                            <section className='my-1 relative w-full'>
                                                <TextField
                                                    autoComplete='off'
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.birthCertificateId`)}
                                                    tabIndex={7}
                                                    className='w-full lg:my-0 font-[FaLight]'
                                                    size='small'
                                                    dir='ltr'
                                                    label="شماره شناسنامه"
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.birthCertificateId ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                    error={errors?.UserInfo && errors?.UserInfo?.birthCertificateId && true}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.birthCertificateId && errors?.UserInfo?.birthCertificateId?.message}</label>
                                            </section>
                                            <section className='my-1 relative w-full'>
                                                <TextField
                                                    autoComplete='off'
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.birthCertificateIssueCity`)}
                                                    tabIndex={8}
                                                    color='info'
                                                    className={'w-full lg:my-0 font-[FaLight] '}
                                                    size='small'
                                                    label="محل صدور شناسنامه"
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.birthCertificateIssueCity ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' }, // Customize text color here
                                                    }}
                                                    error={errors?.UserInfo && errors?.UserInfo?.birthCertificateIssueCity && true}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.birthCertificateIssueCity && errors?.UserInfo?.birthCertificateIssueCity?.message}</label>
                                            </section>
                                            <section className='flex flex-col  w-full'>

                                                <FormControlLabel
                                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                    control={<Checkbox sx={{
                                                        color: color?.color,
                                                        '&.Mui-checked': {
                                                            color: color?.color,
                                                        },
                                                    }} {...register('UserInfo.isConfirmed')}
                                                        onChange={(event) => { setValue('UserInfo.isConfirmed', event.target.checked), trigger() }} />} label="isConfirmed" />
                                            </section>
                                            <section className='flex flex-col px-0  w-full'>
                                                <FormControlLabel
                                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                    control={<Checkbox sx={{
                                                        color: color?.color,
                                                        '&.Mui-checked': {
                                                            color: color?.color,
                                                        },
                                                    }} {...register('UserInfo.twoFactorEnabled')}
                                                        onChange={(event) => { setValue('UserInfo.twoFactorEnabled', event.target.checked), trigger() }} />} label="twoFactorEnabled" />
                                            </section>
                                            <section className='flex flex-col px-0  w-full'>
                                                <FormControlLabel
                                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                    control={<Checkbox sx={{
                                                        color: color?.color,
                                                        '&.Mui-checked': {
                                                            color: color?.color,
                                                        },
                                                    }} {...register('UserInfo.isTechnicalExp')}
                                                        onChange={(event) => { setValue('UserInfo.isTechnicalExp', event.target.checked), trigger() }} />} label="isTechnicalExpert" />
                                            </section>
                                        </section>
                                        <section className='flex flex-col h-full gap-y-3 w-[100%]'>
                                            <section className='relative my-1 w-full'>
                                                <TextField
                                                    autoComplete='off'
                                                    tabIndex={9}
                                                    {...register(`UserInfo.firstName`)}
                                                    error={errors?.UserInfo && errors?.UserInfo?.firstName && true}
                                                    className='w-full lg:my-0 font-[FaLight]'
                                                    size='small'
                                                    dir='ltr'
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    label="نام انگلیسی"
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.firstName ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.firstName && errors?.UserInfo?.firstName?.message}</label>
                                            </section>
                                            <section className='my-1 relative w-full'>
                                                <TextField
                                                    autoComplete='off'
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    tabIndex={10}
                                                    dir='ltr'
                                                    {...register(`UserInfo.lastName`)}
                                                    error={errors?.UserInfo && errors?.UserInfo?.lastName && true}
                                                    className='w-full lg:my-0 font-[FaLight]'
                                                    size='small'
                                                    label="نام خانوادگی انگلیسی"
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.lastName ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.lastName && errors?.UserInfo?.lastName?.message}</label>
                                            </section>
                                            <section className='my-1 relative w-full'>
                                                <TextField
                                                    autoComplete='off'
                                                    dir='ltr'
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.title`)}
                                                    tabIndex={11}
                                                    error={errors?.UserInfo && errors?.UserInfo?.faLastName && true}
                                                    className='w-full lg:my-0 font-[FaLight]'
                                                    size='small'
                                                    label='title'
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.title ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.faLastName && errors?.UserInfo?.faLastName?.message}</label>
                                            </section>
                                            <section dir='rtl' className='relative my-1 w-full '>
                                                <DatePickare
                                                    haveHour={false}
                                                    register={{ ...register(`UserInfo.employeementDate`) }}
                                                    label='تاریخ استخدام'
                                                    value={state.employmentDate.date}
                                                    onChange={(date: DateObject) => ConvertEmploymentDate(date)}
                                                    error={errors?.UserInfo && errors?.UserInfo?.employeementDate && true}
                                                    focused={watch(`UserInfo.employeementDate`)}
                                                />
                                                <label className='absolute bottom-[-20px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.employeementDate && errors?.UserInfo?.employeementDate?.message}</label>
                                            </section>
                                            <section className='relative w-full mt-1'>
                                                <TextField
                                                    autoComplete='off'
                                                    tabIndex={18}
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.insuranceNumber`)}
                                                    InputProps={{
                                                        style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                    error={errors?.UserInfo && errors?.UserInfo?.insuranceNumber && true}
                                                    dir='ltr'
                                                    className='w-full ' type='text'
                                                    size='small'
                                                    label="شماره بیمه"
                                                    variant="outlined" />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.insuranceNumber && errors?.UserInfo?.insuranceNumber?.message}</label>

                                            </section>
                                            <section className='my-1 relative w-full'>
                                                <TextField
                                                    autoComplete="off"
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    tabIndex={13}
                                                    dir='ltr'
                                                    {...register(`UserInfo.personnelId`)}
                                                    error={errors?.UserInfo && errors?.UserInfo?.personnelId && true}
                                                    className='w-full lg:my-0 font-[FaLight]'
                                                    size='small'
                                                    label="شماره پرسنلی"
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.personnelId ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.personnelId && errors?.UserInfo?.personnelId?.message}</label>
                                            </section>
                                            <section className='relative my-1.5 w-full '>
                                                <Select<EducationDegreeModel, false, any>
                                                    menuPosition='absolute'
                                                    maxMenuHeight={400}
                                                    tabIndex={14}
                                                    options={data.EducationDegree}
                                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaLight] z-20`} placeholder="آخرین مدرک تحصیلی"
                                                    {...register(`UserInfo.lastEducationDegree`)}
                                                    value={data.EducationDegree.find((item) => item.id == getValues(`UserInfo.lastEducationDegree`))}
                                                    onChange={(option: SingleValue<EducationDegreeModel>, _actionMeta: ActionMeta<EducationDegreeModel>) => {
                                                        setValue('UserInfo.lastEducationDegree', option!.id);
                                                        trigger()
                                                    }
                                                    }
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        height: 5,
                                                        borderRadius: 5,
                                                        colors: {
                                                            ...theme.colors,
                                                            color: '#607d8b',
                                                            neutral10: `${color?.color}`,
                                                            primary25: `${color?.color}`,
                                                            primary: '#607d8b',
                                                            neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                            neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                            neutral20: errors?.UserInfo?.lastEducationDegree ? '#d32f3c' : '#607d8b',
                                                            neutral30: errors?.UserInfo?.lastEducationDegree ? '#d32f3c' : '#607d8b',
                                                            neutral50: errors?.UserInfo?.lastEducationDegree ? '#d32f3c' : '#607d8b',

                                                        },
                                                    })}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.lastEducationDegree && errors?.UserInfo?.lastEducationDegree?.message}</label>
                                            </section>
                                            <section className='my-1 relative w-full'>
                                                <TextField
                                                    autoComplete="off"
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    tabIndex={15}
                                                    {...register(`UserInfo.lastFieldOfStudy`)}
                                                    error={errors?.UserInfo && errors?.UserInfo?.lastFieldOfStudy && true}
                                                    className='w-full lg:my-0 font-[FaLight]'
                                                    size='small'
                                                    label="رشته ی تحصیلی"
                                                    InputProps={{
                                                        style: { color: errors?.UserInfo?.lastFieldOfStudy ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.lastFieldOfStudy && errors?.UserInfo?.lastFieldOfStudy?.message}</label>
                                            </section>
                                            <section className='flex flex-col w-full'>

                                                <FormControlLabel
                                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                    control={<Checkbox sx={{
                                                        color: color?.color,
                                                        '&.Mui-checked': {
                                                            color: color?.color,
                                                        },
                                                    }} {...register('UserInfo.lockoutEnabled')} onChange={(event) => { setValue('UserInfo.lockoutEnabled', event.target.checked), trigger() }} />} label="LockoutEnabled" />
                                            </section>
                                            <section className='flex flex-col w-full'>
                                                <FormControlLabel
                                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                    control={<Checkbox sx={{
                                                        color: color?.color,
                                                        '&.Mui-checked': {
                                                            color: color?.color,
                                                        },
                                                    }} {...register('UserInfo.IsActive')} onChange={(event) => { setValue('UserInfo.IsActive', event.target.checked), trigger() }} />} label="isActive" />
                                            </section>
                                        </section>
                                        <section className='flex flex-col h-full gap-y-3 w-[100%]'>
                                            <section dir='ltr' className='relative w-full mt-1'>
                                                <TextField
                                                    autoComplete="off"
                                                    tabIndex={17}
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.userName`)}
                                                    InputProps={{
                                                        style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                    dir='ltr'
                                                    className='w-full ' type='string'
                                                    size='small'
                                                    label="userName"
                                                    error={errors?.UserInfo && errors?.UserInfo?.userName && true}
                                                    variant="outlined" />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.userName && errors?.UserInfo?.userName?.message}</label>
                                            </section>
                                            <section className='relative w-full mt-1'>
                                                <TextField
                                                    autoComplete="off"
                                                    tabIndex={18}
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.password`)}
                                                    InputProps={{
                                                        style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                    dir='ltr'
                                                    className='w-full ' type='string'
                                                    size='small'
                                                    label="password"
                                                    error={errors?.UserInfo && errors?.UserInfo?.password && true}
                                                    variant="outlined" />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.password && errors?.UserInfo?.password?.message}</label>
                                            </section>
                                            <section className='relative w-full mt-1'>
                                                <TextField
                                                    autoComplete="off"
                                                    tabIndex={18}
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.confirmPassword`)}
                                                    InputProps={{
                                                        style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                    error={errors?.UserInfo && errors?.UserInfo?.confirmPassword && true}
                                                    dir='ltr'
                                                    className='w-full ' type='string'
                                                    size='small'
                                                    label="Confirm Password"
                                                    variant="outlined" />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.confirmPassword && errors?.UserInfo?.confirmPassword?.message}</label>

                                            </section>

                                            <section className='relative w-full mt-1'>
                                                <TextField
                                                    autoComplete="off"
                                                    tabIndex={18}
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.accessFailedCount`)}
                                                    InputProps={{
                                                        style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                    dir='ltr'
                                                    className='w-full ' type='number'
                                                    size='small'
                                                    label="accessFailedCount"
                                                    variant="outlined" />
                                            </section>
                                            <section dir='rtl' className='relative my-1 w-full '>
                                                {/* <DateRangePicker
                                                    autoComplete="off"
                                                    {...register(`UserInfo.lockoutEnd`)}
                                                    tabIndex={12}
                                                    inputComponent={(props: any) => DatePickerInputlockoutEnd({ ...props, label: "lockoutEnd" })}
                                                    placeholder=""
                                                    format="jYYYY/jMM/jDD"
                                                    onChange={(unix: any, formatted: any) => setChangeDatelockoutEnd(unix, formatted)}
                                                    cancelOnBackgroundClick={false}
                                                // preSelected={props.props && props.props.employmentDate ? props.props.employmentDate : ''}
                                                /> */}
                                                <DatePickare
                                                    haveHour={false}
                                                    register={{ ...register(`UserInfo.lockoutEnd`) }}
                                                    label='lockoutEnd'
                                                    value={state.lockoutEnd.date}
                                                    onChange={(date: DateObject) => ConvertlockedDate(date)}
                                                    error={errors?.UserInfo && errors?.UserInfo?.lockoutEnd && true}
                                                    focused={watch(`UserInfo.lockoutEnd`)}
                                                />
                                                <label className='absolute bottom-[-20px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.lockoutEnd && errors?.UserInfo?.lockoutEnd?.message}</label>

                                            </section>
                                            <section className=' my-1.5 border-select-group'>
                                                <FormControl className='w-full h-full' >
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="gender"
                                                        defaultValue="Male"
                                                        name="customized-radios"
                                                        className='w-full h-full px-4 font-[FaLight] '
                                                    >
                                                        {
                                                            data.gender.map((gender: EducationDegreeModel) => {
                                                                return <FormControlLabel onChange={() => { gender.id == 2 && unregister('UserInfo.militaryServiceId'), setValue('UserInfo.genderId', gender.id) }} className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[FaLight] `} key={gender.id} value={gender.name} control={<BpRadio />} label={gender.faName} />
                                                            })
                                                        }
                                                    </RadioGroup>
                                                </FormControl>
                                            </section>
                                            {watch('UserInfo.genderId') == 1 && <section className='relative my-1.5 w-full '>
                                                <Select<DataModel, false, any>
                                                    // defaultValue={(props.props && props.props.militaryServiceId) ? data.militry.find((item: DataModel) => item.id == props.props.militaryServiceId) : data.militry.find((item: DataModel) => item.id == getValues(`UserInfo.militaryServiceId`))}
                                                    isClearable
                                                    menuPosition='absolute'
                                                    maxMenuHeight={400}
                                                    tabIndex={19}
                                                    options={data.militry}
                                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-full font-[FaLight] z-20`} placeholder="وضعیت نظام وظیفه"
                                                    {...register(`UserInfo.militaryServiceId`)}
                                                    onChange={(option: SingleValue<DataModel>, _actionMeta: ActionMeta<DataModel>) => {
                                                        setValue('UserInfo.militaryServiceId', option?.id);
                                                        trigger()
                                                    }}
                                                    value={data.militry.find((item) => item.id == getValues(`UserInfo.militaryServiceId`))}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        height: 5,
                                                        borderRadius: 5,
                                                        colors: {
                                                            ...theme.colors,
                                                            color: '#607d8b',
                                                            neutral10: `${color?.color}`,
                                                            primary25: `${color?.color}`,
                                                            primary: '#607d8b',
                                                            neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                            neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                            neutral20: errors?.UserInfo?.militaryServiceId ? '#d32f3c' : '#607d8b',
                                                            neutral30: errors?.UserInfo?.militaryServiceId ? '#d32f3c' : '#607d8b',
                                                            neutral50: errors?.UserInfo?.militaryServiceId ? '#d32f3c' : '#607d8b',
                                                        },
                                                    })}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UserInfo?.militaryServiceId && errors?.UserInfo?.militaryServiceId?.message}</label>
                                            </section>}
                                            <section className=' my-1.5 border-select-group'>
                                                <FormControl className='w-full h-full' >
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby='isMarried'
                                                        defaultValue={"single"}
                                                        name="customized-radios"
                                                        className='w-full h-full px-4 font-[FaLight] '
                                                    >
                                                        {married.map((state, _index) => {
                                                            return < FormControlLabel
                                                                key={state.id}
                                                                onChange={() => { setValue('UserInfo.isMarried', state.isMarried) }}
                                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[FaLight] `} value={state.title} control={<BpRadio />}
                                                                label={state.faTitle}
                                                            />
                                                        })
                                                        }
                                                    </RadioGroup>
                                                </FormControl>
                                            </section>
                                            <section className='relative w-full mt-1'>
                                                <TextField
                                                    autoComplete="off"
                                                    tabIndex={20}
                                                    sx={{ fontFamily: 'FaLight' }}
                                                    {...register(`UserInfo.childCount`)}
                                                    InputProps={{
                                                        style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                    onChange={(event) => { setValue('UserInfo.childCount', Number(event.target.value)) }}
                                                    dir='ltr'
                                                    className='w-full ' type='number'
                                                    size='small'
                                                    label="تعداد فرزندان"
                                                    variant="outlined" />
                                            </section>

                                        </section>
                                    </section>
                                </section>
                            </form>
                        </section>
                    </CardBody>}
            </>
        </MyCustomComponent>
    )
}

export default PesonalInfo
