'use client';
import React, { useEffect, useState } from 'react'
import ButtonComponent from '../../shared/ButtonComp'
import { Button, Card, CardBody, Dialog, DialogHeader, Drawer, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react'
import Checkbox from '@mui/material/Checkbox';
import InputSkeleton from '../../shared/InputSkeleton'
import DateTimePicker from '../../shared/DatePicker/DateTimePicker';
import OutlinedInput, { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import colorStore from '@/app/zustandData/color.zustand';
import SearchIcon from '@mui/icons-material/Search';
import Select, { ActionMeta, SingleValue, MenuListProps, components, MultiValue } from 'react-select';
import moment from 'jalali-moment';
import { FormControlLabel, Pagination, Stack, TextField } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { FilterResumeModel, GetJobVacanciesModel, GetResumeFileModel, GetSearchResumeModel, JobBranchesModel, ResumeListModel } from '@/app/models/HR/resumeManagement';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import { Response } from '@/app/models/HR/sharedModels';
import DateRangePicker from '../../shared/DatePicker/DateRangePicker';
import { LoadingModel, ViewAttachments } from '@/app/models/sharedModels';
import TableSkeleton from '../../shared/TableSkeleton';
import Swal from 'sweetalert2';
import Loading from '../../shared/loadingResponse';
import ContactPageIcon from '@mui/icons-material/ContactPage';

const ManageResume = () => {
    const { AxiosRequest } = useAxios()
    const [openRight, setOpenRight] = useState(true);
    const openDrawerRight = () => setOpenRight(true);
    const closeDrawerRight = () => setOpenRight(false);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const schema = yup.object().shape({
        FilterResume: yup.object(({})).nullable(),
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
    } = useForm<any>(
        {
            defaultValues: {
                FilterResume: {
                    isSelected: false
                }
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    let loading = {
        loadingTable: false,
        loadingRes: false
    }
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => setOpen(!open);
    const [openPDF, setOpenPDF] = useState<boolean>(false)
    const handleOpenPDF = () => setOpenPDF(!openPDF)
    const [attachment, setAttachment] = useState<ViewAttachments>({
        base64: '',
        type: ''
    });
    const [loadings, setLoadings] = useState<LoadingModel>(loading)
    type DataModel = {
        jobVacancy: GetJobVacanciesModel[],
        jobBranches: JobBranchesModel[],
        resumeList: ResumeListModel[],
        paginationCount: number
    }
    let result = {
        jobVacancy: [],
        jobBranches: [],
        resumeList: [],
        paginationCount: 0
    }
    const [state, setState] = useState<DataModel>(result);

    useEffect(() => {
        const GetBranches = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/GetJobBranchesList`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<JobBranchesModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setState((state) => ({
                        ...state, jobBranches: response.data.data.map((item: JobBranchesModel) => {
                            return {
                                value: item.id,
                                label: item.faTitle,
                                faTitle: item.faTitle,
                                id: item.id,
                                title: item.title
                            }
                        })
                    }))
                }
            }
        }
        const GetJobVacancy = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/GetJobVacanciesList`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<GetJobVacanciesModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setState((state) => ({
                        ...state, jobVacancy: response.data.data.map((item: GetJobVacanciesModel) => {
                            return {
                                value: item.id,
                                label: item.title,
                                id: item.id,
                                title: item.title
                            }
                        })
                    }))
                }
            }
        }
        GetBranches()
        GetJobVacancy()
    }, [])
    const outerTheme = useTheme();
    const DateTheme = (outerTheme: Theme) =>
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
                        }
                    },
                },
            },
        });

    const Theme = (outerTheme: Theme) =>
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

    const DatePickerStartDate = (props: any) => {
        return (
            <div>
                <ThemeProvider theme={DateTheme(outerTheme)}>
                    <TextField autoComplete="off"
                        InputProps={{
                            style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                        }}
                        sx={{ fontFamily: 'FaLight' }} size='small' className='w-full relative font-[FaLight]' {...props} dir="ltr" type='text' crossOrigin="" label={props.label} color="primary" />
                </ThemeProvider>
            </div>)
    }
    const DatePickerEndDate = (props: any) => {
        return (
            <div>
                <ThemeProvider theme={DateTheme(outerTheme)}>
                    <TextField autoComplete="off"
                        InputProps={{
                            style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                        }}
                        sx={{ fontFamily: 'FaLight' }} size='small' className='w-full relative font-[FaLight]' {...props} dir="ltr" type='text' crossOrigin="" label={props.label} color="primary" />
                </ThemeProvider>
            </div>)
    }

    const setChangeStartDate = (_unix: any, formatted: any) => {
        setValue('FilterResume.endDate', moment.from(formatted, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD'));
        trigger()
    }
    const setChangeEndDate = (_unix: any, formatted: any) => {
        setValue('FilterResume.startDate', moment.from(formatted, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD'));
        trigger()
    }

    const GetSearchResume = async (page: number = 1) => {
        setLoadings((state) => ({ ...state, loadingTable: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/GetSearchResume`;
        let method = 'post';
        let data = {
            "searchParams": {
                "nationalCode": getValues('FilterResume.nationalCode'),
                "name": getValues(`FilterResume.firstName`),
                "lastName": getValues(`FilterResume.lastName`),
                "faName": getValues(`FilterResume.faFirstName`),
                "faLastName": getValues(`FilterResume.faLastName`),
                "jobBranchId": getValues(`FilterResume.jobBranchId`),
                "jobVacancyId": getValues(`FilterResume.jobVacancyId`),
                "createDateFrom": getValues('FilterResume.startDate'),
                "createDateTo": getValues('FilterResume.endDate'),
                "isSelected": getValues('FilterResume.isSelected')
            },
            "count": 10,
            "page": page
        };
        let response: AxiosResponse<Response<GetSearchResumeModel>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
            setLoadings((state) => ({ ...state, loadingTable: false }))
            if (response.data.status && response.data.data) {
                setState((state) => ({ ...state, resumeList: response.data.data.resumeItems }))
                let countPagination = Math.ceil(Number(response.data.data.totalCount) / Number(10));

            } else {
                setState((state) => ({ ...state, resumeList: [] }))
            }
            closeDrawerRight()
        }
    }

    const ViewResume = async (id: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/GetResumeFile?resumeId=${id}`;
        let method = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetResumeFileModel>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
            if (response.data.status && response.data.data.file != null) {
                const byteArray = Uint8Array.from(atob(response.data.data.file!), c => c.charCodeAt(0));
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const objectUrl = URL.createObjectURL(blob);
                setAttachment({
                    base64: objectUrl, type: 'application/pdf'!
                })
            } else {
                Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "مشاهده ی فایل رزومه",
                    text: 'فایل مورد نظر یافت نشد',
                    icon: 'warning',
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "OK",
                });
            }
            handleOpen()
        }
    }

    const ViewPDFResume = async (id: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetVolunteerResumePdf?resumeId=${id}`;
        let method = 'get';
        let data = {}
        let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
            if (response.data.status && response.data.data != null) {
                const byteArray = Uint8Array.from(atob(response.data.data!), c => c.charCodeAt(0));
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const objectUrl = URL.createObjectURL(blob);
                setAttachment({
                    base64: objectUrl, type: 'application/pdf'!
                })
                handleOpen()
            } else {
                Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "مشاهده ی فایل رزومه",
                    text: 'فایل مورد نظر یافت نشد',
                    icon: 'warning',
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "OK",
                });
            }
        }
    }

    const CheckResume = async (item: ResumeListModel) => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "انتخاب رزومه",
            text: "آیا از انتخاب این رزومه اطمینان دارید؟",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#21af5a",
            cancelButtonColor: "#b53535",
            confirmButtonText: "Yes!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadings((state) => ({ ...state, loadingRes: true }))
                const url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/SetSelectedResume`;
                let method = 'put';
                let data = {
                    "id": item.id,
                    "isSelected": !item.isSelected
                }
                let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
                if (response) {
                    setLoadings((state) => ({ ...state, loadingRes: false }))
                    if (response.data.status && response.data.data) {
                        setCheckedItems({});
                    } else {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "انتخاب رزومه",
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK",
                            text: response.data.message,
                            icon: (response.data.data == false && response.data.status == true) ? "warning" : "error",

                        });
                    }
                }
            }
        })
    }
    const OnSubmit = () => {
        GetSearchResume()
    }
    const MenuList = (
        props: MenuListProps<any, boolean, any>
    ) => {
        return (
            <components.MenuList {...props}>
                <div className='rtl text-right'>
                    {props.children}
                </div>
            </components.MenuList>
        );
    };
    const [checkedItems, setCheckedItems] = useState<any>({});
    const handleCheckboxChange = (item: ResumeListModel) => {
        setCheckedItems((prev: any) => ({
            ...prev,
            [item.id]: !prev[item.id],
        }));
        CheckResume(item)
    };
    return (
        <>
            {loadings.loadingRes == true && <Loading />}
            <ButtonComponent onClick={openDrawerRight}>فیلتر ها</ButtonComponent>
            <CardBody className='w-[98%] mx-auto relative rounded-lg overflow-auto p-0 mt-3 h-[65vh]'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                {loadings.loadingTable == false ?
                    state.resumeList.length > 0 &&
                    <table dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[63vh] `}>
                        <thead>
                            <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        #
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        نشان کردن
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        نام و نام خانوادگی
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        کدملی
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        زمینه شعلی
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        شعبه محل خدمت
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        تاریخ ارسال
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        عملیات
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                            {state.resumeList.map((item: ResumeListModel, index: number) => {
                                return (
                                    <tr key={"cms" + index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`} >
                                        <td style={{ width: "3%", minWidth: '10px' }} className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {index + 1}
                                            </Typography>
                                        </td>
                                        <td style={{ width: "3%", minWidth: '10px' }} className='p-1'>
                                            {item.isSelected == true ?
                                                <Checkbox
                                                    sx={{
                                                        color: color?.color, '&.Mui-checked': {
                                                            color: color?.color,
                                                        }
                                                    }}
                                                    icon={<BookmarkIcon />}
                                                    checkedIcon={<BookmarkBorderIcon />}
                                                    // checked={!!checkedItems[item.id]}
                                                    onChange={() => handleCheckboxChange(item)}
                                                /> :
                                                <Checkbox
                                                    sx={{
                                                        color: color?.color, '&.Mui-checked': {
                                                            color: color?.color,
                                                        }
                                                    }}
                                                    icon={<BookmarkBorderIcon />}
                                                    checkedIcon={<BookmarkIcon />}
                                                    // checked={!!checkedItems[item.id]}
                                                    onChange={() => handleCheckboxChange(item)}
                                                />
                                            }
                                        </td>
                                        <td className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.faName + ' ' + item.faLastName}
                                            </Typography>
                                        </td>
                                        <td className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.nationalCode}
                                            </Typography>
                                        </td>
                                        <td className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.jobVacancyTitleFa}
                                            </Typography>
                                        </td>
                                        <td className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.jobBranchTitleFa}
                                            </Typography>
                                        </td>
                                        <td className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {moment(item.createDate, "YYYY/MM/DD HH:mm:SS").format("jYYYY/jMM/jDD")}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '7%' }} className='p-1'>
                                            <div className='container-fluid mx-auto p-0.5'>
                                                <div className="flex flex-row justify-evenly">
                                                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} placement='right' content='مشاهده رزومه'>
                                                        <Button
                                                            onClick={() => ViewResume(item.id)}
                                                            size="sm"
                                                            className="p-1 mx-1"
                                                            style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >
                                                            <VisibilityIcon
                                                                fontSize='small'
                                                                sx={{ color: 'white' }}
                                                                className='p-1'
                                                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                            />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} placement='right' content='دانلود رزومه'>
                                                        <Button
                                                            onClick={() => ViewPDFResume(item.id)}
                                                            size="sm"
                                                            className="p-1 mx-1"
                                                            style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >
                                                            <ContactPageIcon
                                                                fontSize='small'
                                                                sx={{ color: 'white' }}
                                                                className='p-1'
                                                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                            />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table> : <TableSkeleton />}
            </CardBody>
            {state.paginationCount > 1 && <section className='flex justify-center my-3'>
                <Stack onClick={(e: any) => { GetSearchResume(e.target.innerText) }} spacing={2} >
                    <Pagination showFirstButton showLastButton count={state.paginationCount} variant="outlined" size="small" shape="rounded" />
                </Stack>
            </section>}
            <Drawer
                dismiss={{
                    escapeKey: true,
                    referencePress: true,
                    referencePressEvent: 'click',
                    outsidePress: false,
                    outsidePressEvent: 'click',
                    ancestorScroll: false,
                    bubbles: true
                }}
                size={460}
                placement="right"
                open={openRight}
                onClose={closeDrawerRight}
                className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} p-4 h-[100vh] overflow-y-auto`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
                <ThemeProvider theme={Theme(outerTheme)}>
                    <form onSubmit={handleSubmit(OnSubmit)} className='w-full h-full relative '>
                        <div className="flex items-center justify-between">
                            <IconButton
                                variant="text"
                                color="blue-gray"
                                onClick={closeDrawerRight}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
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
                            <Typography variant="h5" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                فیلترها
                            </Typography>
                        </div>
                        <section className='flex flex-col gap-3'>
                            <div className='flex justify-end w-full'>
                                <FormControlLabel
                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                    control={<Checkbox
                                        sx={{
                                            color: color?.color,
                                            '&.Mui-checked': {
                                                color: color?.color,
                                            },
                                        }} {...register('FilterResume.isSelected')}
                                        onChange={(event) => { setValue('FilterResume.isSelected', event.target.checked), trigger() }} />} label="نشان شده ها" />
                            </div>
                            <TextField autoComplete="off"
                                tabIndex={1}
                                {...register(`FilterResume.faFirstName`)}
                                className='w-full lg:my-0 font-[FaLight]'
                                size='small'
                                dir='rtl'
                                sx={{ fontFamily: 'FaLight' }}
                                label="نام"
                                InputProps={{
                                    style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <TextField autoComplete="off"
                                sx={{ fontFamily: 'FaLight' }}
                                tabIndex={2}
                                dir='rtl'
                                {...register(`FilterResume.faLastName`)}
                                className='w-full lg:my-0 font-[FaLight]'
                                size='small'
                                label="نام خانوادگی"
                                InputProps={{
                                    style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <TextField autoComplete="off"
                                tabIndex={3}
                                {...register(`FilterResume.firstName`)}
                                className='w-full lg:my-0 font-[FaLight]'
                                size='small'
                                dir='ltr'
                                sx={{ fontFamily: 'FaLight' }}
                                label="نام انگلیسی"
                                InputProps={{
                                    style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <TextField autoComplete="off"
                                sx={{ fontFamily: 'FaLight' }}
                                tabIndex={4}
                                dir='ltr'
                                {...register(`FilterResume.lastName`)}
                                className='w-full lg:my-0 font-[FaLight]'
                                size='small'
                                label="نام خانوادگی انگلیسی"
                                InputProps={{
                                    style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <TextField autoComplete="off"
                                sx={{ fontFamily: 'FaLight' }}
                                tabIndex={5}
                                dir='ltr'
                                {...register(`FilterResume.nationalCode`)}
                                className='w-full lg:my-0 font-[FaLight]'
                                size='small'
                                label='کد ملی'
                                InputProps={{
                                    style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <Select<GetJobVacanciesModel, true, any>
                                isRtl
                                isMulti
                                {...register(`FilterResume.jobVacancyId`)}
                                placeholder="زمینه شغلی"
                                components={{ MenuList }}
                                menuPosition='absolute'
                                maxMenuHeight={200}
                                onChange={(option: MultiValue<GetJobVacanciesModel>, actionMeta: ActionMeta<GetJobVacanciesModel>) => {
                                    setValue('FilterResume.jobVacancyId', option.map((item) => {
                                        return item.id
                                    }));
                                    trigger('FilterResume.jobVacancyId')
                                }}
                                className='w-full font-[FaLight] z-[10]'
                                options={state.jobVacancy}
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
                                        neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                        neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`,
                                    },
                                })}
                            />
                            <Select<JobBranchesModel, true, any>
                                isRtl
                                isMulti
                                placeholder="محل خدمت مورد درخواست"
                                maxMenuHeight={200}
                                components={{ MenuList }}
                                menuPosition='absolute'
                                className='w-full font-[FaLight] z-[7]'
                                options={state.jobBranches}
                                {...register(`FilterResume.jobBranchId`)}
                                onChange={(option: MultiValue<JobBranchesModel>, actionMeta: ActionMeta<JobBranchesModel>) => {
                                    setValue('FilterResume.jobBranchId', option.map((item) => {
                                        return item.id
                                    }));
                                    trigger('FilterResume.jobBranchId')
                                }}
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
                                        neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                        neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`,
                                    },
                                })}
                            />

                            <Card shadow className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} p-2 gap-3 my-5 md:m-0`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>

                                <div className="relative  flex flex-col lg:flex-row gap-2 lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
                                    <div className='order-2 lg:order-1'>
                                        <TextField
                                            autoComplete="off"
                                            className='w-full'
                                            InputProps={{
                                                style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                            }}
                                            focused={getValues('FilterResume.startDate') && getValues('FilterResume.startDate') != '' ? true : false}
                                            dir="ltr"
                                            value={watch('FilterResume.startDate') && moment(watch('FilterResume.startDate'), 'YYYY-MM-DD ').format("YYYY/MM/DD")}
                                            type='text' size="small" label="تاریخ میلادی بعد از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }}
                                        />
                                    </div>
                                    <div dir="rtl" className='order-2 lg:order-1 w-auto ' >
                                        <DateRangePicker
                                            backdrop='static'
                                            {...register(`FilterResume.startDate`)}
                                            inputComponent={(props: any) => DatePickerEndDate({ ...props, label: "تاریخ شمسی بعد از" })}
                                            placeholder=""
                                            format="jYYYY/jMM/jDD"
                                            onChange={(unix: any, formatted: any) => setChangeEndDate(unix, formatted)}
                                            cancelOnBackgroundClick={false}
                                            preSelected={watch('FilterResume.startDate') ? moment.from(getValues('FilterResume.startDate')!, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : null}
                                        />
                                        <IconButton className='!absolute top-1 right-1'
                                        onClick={() => {
                                            setValue('FilterResume.startDate', '');
                                        } }
                                        style={{ background: color?.color }} size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                            <ClearIcon className='p-0.5' fontSize="small" />
                                        </IconButton>
                                    </div>
                                </div>
                                <div className="relative flex flex-col lg:flex-row gap-2 lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
                                    <div className='order-2 lg:order-1 w-auto '>
                                        <TextField
                                            autoComplete="off"
                                            InputProps={{
                                                style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                            }}
                                            focused={getValues('FilterResume.endDate') && getValues('FilterResume.endDate') != '' ? true : false}
                                            dir="ltr"
                                            className='w-full'
                                            value={getValues('FilterResume.endDate') && moment(getValues('FilterResume.endDate'), 'YYYY-MM-DD ').format("YYYY/MM/DD")}
                                            type='text' size="small" label="تاریخ میلادی قبل از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }}
                                        />
                                    </div>
                                    <div dir="rtl" className='relative order-1 lg:order-2 ' >
                                        <DateRangePicker
                                            backdrop='static'
                                            {...register(`FilterResume.endDate`)}
                                            tabIndex={5}
                                            inputComponent={(props: any) => DatePickerStartDate({ ...props, label: "تاریخ شمسی قبل از" })}
                                            placeholder=""
                                            format="jYYYY/jMM/jDD"
                                            onChange={(unix: any, formatted: any) => setChangeStartDate(unix, formatted)}
                                            cancelOnBackgroundClick={false}
                                            preSelected={watch('FilterResume.endDate') ? moment.from(getValues('FilterResume.endDate')!, 'en', 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : null}
                                        />
                                        <IconButton className='!absolute top-1 right-1'
                                        onClick={() => {
                                            setValue('FilterResume.endDate', '');
                                        } }
                                        style={{ background: color?.color }} size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                            <ClearIcon className='p-0.5' fontSize="small" />
                                        </IconButton>
                                    </div>

                                </div>

                            </Card>
                        </section>
                        <section className='absolute bottom-0 left-1 z-[500] ' >
                            <IconButton size='lg' style={{ background: color?.color }} className="rounded-full "
                            type='submit'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                <SearchIcon
                                    className='p-2/4'
                                    onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                    onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                            </IconButton>
                        </section>
                    </form>
                </ThemeProvider>
            </Drawer >
            <Dialog size='xl' className={`absolute top-0 bottom-0 overflow-y-scroll  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between sticky top-0 left-0`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <IconButton variant="text" color="blue-gray" onClick={() => { handleOpen(); } }  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                <iframe className='w-full h-full' src={attachment.base64} ></iframe>
            </Dialog>
            <Dialog size='xl' className={`absolute top-0 bottom-0 overflow-y-scroll  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openPDF} handler={handleOpenPDF}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between sticky top-0 left-0`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <IconButton variant="text" color="blue-gray" onClick={() => { handleOpenPDF(); } }  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                <iframe className='w-full h-full' src={attachment.base64} ></iframe>
            </Dialog>
        </>
    )
}

export default ManageResume