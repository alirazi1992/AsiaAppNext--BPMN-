'use client';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, CardBody, Dialog, DialogBody, DialogHeader, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { useRouter } from 'next/navigation';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import OutlinedInput, { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import SaveIcon from '@mui/icons-material/Save';
//icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import { AddRuleModel, GetRuleModelResponse, GetRulesListModel, Response } from '@/app/models/RulesAndRegulation.ts/RulesAndRegulation';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import moment from 'jalali-moment';
import Swal from 'sweetalert2';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import Loading from '@/app/components/shared/loadingResponse';
import dynamic from 'next/dynamic';
import AddIcon from '@mui/icons-material/Add';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';


const RulesAndRegulationTable = () => {
    const { AxiosRequest } = useAxios()
    const TextEditorSummary = useMemo(() => { return dynamic(() => import('@/app/components/shared/EditorSummary'), { ssr: false }) }, [])
    const TextEditorContent = useMemo(() => { return dynamic(() => import('@/app/components/shared/EditorContent'), { ssr: false }) }, [])
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const router = useRouter()
    let loading = {
        loadingTable: false,
        loading: false
    }
    const [rulesState, setRulesState] = useState<GetRulesListModel[]>([])
    let [loadings, setLoadings] = useState(loading)
    let [openAdd, setOpenAdd] = useState<boolean>(false)
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const handleOpenAdd = () => setOpenAdd(!openAdd)
    // const handleOpenEdit = () => setOpenEdit(!openEdit)
    const schema = yup.object().shape({
        AddRule: yup.object({
            title: yup.string().required('Required'),
            convention: yup.string().required('Required'),
            reference: yup.string().required('Required'),
            inToForce: yup.string().required('Required'),
            origin: yup.string().required('Required'),
            summary: yup.string().required('Required'),
            content: yup.string().required('Required'),
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
    } = useForm<AddRuleModel>(
        {
            defaultValues: {
                AddRule: {
                    title: '',
                    inToForce: '',
                    convention: '',
                    reference: '',
                    origin: '',
                    isPublished: false,
                    summary: '',
                    content: '',
                    nonHtmlContent: '',
                    nonHtmlSummary: '',
                    ruleId: 0
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );

    const errors = formState.errors

    // const [editorData, setEditorData] = useState<{
    //     summary: {
    //         html: string,
    //         nonHtml: string
    //     },
    //     content: {
    //         html: string,
    //         nonHtml: string
    //     }
    // }>({
    //     summary: {
    //         html: '',
    //         nonHtml: ''
    //     },
    //     content: {
    //         html: '',
    //         nonHtml: ''
    //     }
    // })
    const handleSummary = (data: any) => {
        setValue('AddRule.summary', data.html)
        setValue('AddRule.nonHtmlSummary', data.nonHtml)
    };
    const handleContent = (data: any) => {
        setValue('AddRule.content', data.html)
        setValue('AddRule.nonHtmlContent', data.nonHtml)
    };

    const OnSubmit = () => {
        if (!errors.AddRule) {
            isUpdate == false ? AddRule() : UpdateRole()
        }
    }

    const AddRule = async () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Create Post!",
            text: "Are you sure about Creating this post?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#21af5a",
            cancelButtonColor: "#b53535",
            confirmButtonText: "Yes,Create it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // setLoadings()
                let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/AddRule`;
                let method = "post";
                let data = {
                    "title": getValues('AddRule.title'),
                    "inToForce": getValues('AddRule.inToForce'),
                    "convention": getValues('AddRule.convention'),
                    "reference": getValues('AddRule.reference'),
                    "summary": getValues('AddRule.summary'),
                    "origin": getValues('AddRule.origin'),
                    "isPublished": getValues('AddRule.isPublished'),
                    "content": getValues('AddRule.content'),
                    "nonHtmlContent": getValues('AddRule.nonHtmlContent'),
                    "nonHtmlSummary": getValues('AddRule.nonHtmlSummary')
                };
                let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    if (response.data.data != 0) {
                        rulesState.push({
                            id: response.data.data,
                            convention: getValues('AddRule.convention'),
                            inToForce: getValues('AddRule.inToForce'),
                            isPublished: getValues('AddRule.isPublished') ?? false,
                            origin: getValues('AddRule.origin'),
                            reference: getValues('AddRule.reference'),
                            summary: getValues('AddRule.summary'),
                            title: getValues('AddRule.title')
                        })
                        setRulesState([...rulesState])
                    } else {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Create Post!",
                            text: response.data.message,
                            icon: response.data.status && response.data.data == null ? "warning" : "error",
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK",
                        })
                    }
                    reset()
                    handleOpenAdd()
                    setIsUpdate(false)
                }

            }
        })
    }

    const UpdateRole = async () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Update Rule!",
            text: "Are you sure about Updating this post?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#21af5a",
            cancelButtonColor: "#b53535",
            confirmButtonText: "Yes,update it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // setLoading(true)
                let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/UpdateRule`;
                let method = "PATCH";
                let data = {
                    id: getValues('AddRule.ruleId'),
                    title: getValues('AddRule.title'),
                    inToForce: getValues('AddRule.inToForce'),
                    convention: getValues('AddRule.convention'),
                    reference: getValues('AddRule.reference'),
                    summary: getValues('AddRule.summary'),
                    isPublished: getValues('AddRule.isPublished'),
                    content: getValues('AddRule.content'),
                    nonHtmlContent: getValues('AddRule.nonHtmlContent'),
                    nonHtmlSummary: getValues('AddRule.summary'),
                    origin: getValues('AddRule.origin'),
                }
                let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    if (response.data.status && response.data.data!=0) {
                        let index = rulesState.indexOf(rulesState.find((item: GetRulesListModel) => item.id == response.data.data)!)
                        let newItem: GetRulesListModel = {
                            id: getValues('AddRule.ruleId')!,
                            title: getValues('AddRule.title'),
                            convention: getValues('AddRule.convention'),
                            inToForce: getValues('AddRule.inToForce'),
                            isPublished: getValues('AddRule.isPublished') ?? false,
                            origin: getValues('AddRule.origin'),
                            reference: getValues('AddRule.reference'),
                            summary: getValues('AddRule.summary'),
                        }
                        rulesState.splice(index, 1, newItem)
                    } else {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Update Rule!",
                            text: response.data.message,
                            icon: response.data.status ? "warning" : "error",
                            confirmButtonColor: "#21af5a",
                            confirmButtonText: "Ok"
                        })

                    }
                    reset()
                    handleOpenAdd()
                    setIsUpdate(false)
                }
            }
        })

    }

    const DeleteRule = async (rule: GetRulesListModel) => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Delete Rule!",
            text: "Are you sure about deleteing this rule?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#21af5a",
            cancelButtonColor: "#b53535",
            confirmButtonText: "Yes,Delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadings((state) => ({ ...state, loading: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/DeleteRule?RuleId=${rule.id}&Title=${rule.title}`;
                let method = 'delete';
                let data = {};
                let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    setLoadings((state) => ({ ...state, loading: false }))
                    if (response.data.status && response.data.data!=0) {
                        let index = rulesState.indexOf(rulesState.find((item) => item.id == rule.id)!)
                        rulesState.splice(index, 1)
                    } else {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Delete Rule!",
                            text: response.data.message,
                            icon: response.data.status ? "warning" : "error",
                            confirmButtonColor: "#21af5a",
                            confirmButtonText: "Ok"
                        })
                    }
                }
            }
        })
    };

    const GetRule = async (id: number) => {
        setIsUpdate(true)
        let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/GetRule?Id=${id}`
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetRuleModelResponse>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            if (response.data.status && response.data.data != null) {
                setValue('AddRule', {
                    content: response.data.data.content,
                    convention: response.data.data.convention,
                    ruleId: response.data.data.id,
                    inToForce: response.data.data.inToForce,
                    isPublished: response.data.data.isPublished,
                    nonHtmlContent: response.data.data.nonHtmlContent,
                    nonHtmlSummary: response.data.data.nonHtmlSummary,
                    origin: response.data.data.origin,
                    reference: response.data.data.reference,
                    summary: response.data.data.summary,
                    title: response.data.data.title
                })
            }
            handleOpenAdd()
        }
    };

    useEffect(() => {
        const GetRulesList = async () => {
            setLoadings((state) => ({ ...state, loadingTable: true }))
            let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/GetRulesList`;
            let method = 'get';
            let data = {}
            let response: AxiosResponse<Response<GetRulesListModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                setLoadings((state) => ({ ...state, loadingTable: false }))
                if (response.data.status && response.data.data != null && response.data.data.length > 0) {
                    setRulesState(response.data.data)
                }
            }
        }
        GetRulesList()
    }, []);

    const outerTheme = useTheme();
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

    const dateRef = useRef() as any

    return (
        <>
            {loadings.loading == true && <Loading />}
            <ThemeProvider theme={Theme(outerTheme)}>
                <div className='w-full flex justify-start p-3'>
                    <Tooltip content="New Rule" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                        <Button
                            onClick={handleOpenAdd}
                            style={{ background: color?.color }}
                            size="sm"
                            className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <AddIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                        </Button>
                    </Tooltip>
                </div>
                <CardBody className='RulesClass w-[98%] lg:w-[96%] h-[67vh] mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                    {loadings.loadingTable == false ? <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[68vh] `}>
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
                                        Force Date
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Title
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Convention
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Refrence
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Origin
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Command
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`RulesClass divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                            {rulesState.length > 0 && rulesState.map((item: GetRulesListModel, index: number) => {
                                return (
                                    <tr key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                        <td style={{ width: '3%' }} className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {Number(1 + index)}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '7%' }} className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.inToForce !== '' ? moment(item.inToForce, "YYYY/MM/DD").format("YYYY/MM/DD") : ''}
                                            </Typography>
                                        </td>
                                        <td className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500]  text-[13px] p-0.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.title}
                                            </Typography>
                                        </td>
                                        <td className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.convention}
                                            </Typography>
                                        </td>
                                        <td className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.reference}
                                            </Typography>
                                        </td>
                                        <td className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.origin}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '7%' }} className='p-1'>
                                            <div className='container-fluid mx-auto p-0.5'>
                                                <div className="flex flex-row justify-evenly">
                                                    <Button
                                                        onClick={() => DeleteRule(item)}
                                                        style={{ background: color?.color }}
                                                        size="sm"
                                                        className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                        <DeleteIcon
                                                            fontSize='small'
                                                            className='p-1'
                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                    </Button>
                                                    <Button
                                                        onClick={() => { GetRule(item.id); } }
                                                        style={{ background: color?.color }}
                                                        size="sm"
                                                        className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                        <EditIcon
                                                            fontSize='small'
                                                            className='p-1'
                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                    </Button>
                                                    <Button
                                                        onClick={() => router.push(`/Home/RulesAndRegulation/Apply?id=${item.id}`)}
                                                        style={{ background: color?.color }}
                                                        size="sm"
                                                        className="p-1 mx-1 font-thin whitespace-nowrap"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                        <DirectionsBoatIcon
                                                            fontSize='small'
                                                            className='p-1'
                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                    </Button>

                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table> : <TableSkeleton />}
                </CardBody>
                <Dialog dismiss={{
                    escapeKey: true,
                    referencePress: true,
                    referencePressEvent: 'click',
                    outsidePress: false,
                    outsidePressEvent: 'click',
                    ancestorScroll: false,
                    bubbles: true
                }} size='xl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} absolute top-0 bottom-0 overflow-y-scroll `} open={openAdd} handler={handleOpenAdd}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <DialogHeader dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'cardLight darkText'} flex justify-between z-[100] sticky top-0 left-0 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {isUpdate == false ? 'Add Rule' : 'Update Rule'}
                        <IconButton variant="text" color="blue-gray" onClick={() => { handleOpenAdd(), setIsUpdate(false), reset(); } }  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                    <DialogBody className='overflow-scroll'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <form
                            onSubmit={handleSubmit(OnSubmit)}
                            className='relative z-[10]'>
                            <div dir='rtl' className="w-full">
                                <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <SaveIcon className='p-1' />
                                </Button>
                            </div>
                            <section className="RulesClass h-full m-3">
                                <section className='w-full grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-5'>
                                    <section className='relative'>
                                        <TextField
                                            type='datetime-local'
                                            autoComplete="off"
                                            tabIndex={1}
                                            defaultValue={watch('AddRule.inToForce').slice(0, 10)}
                                            {...register(`AddRule.inToForce`)}
                                            InputProps={{
                                                style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                            }}
                                            error={errors?.AddRule && errors?.AddRule?.inToForce && true}
                                            focused
                                            dir='ltr'
                                            className='w-full '
                                            size='small'
                                            label="come into force"
                                            variant="outlined" />
                                        <label className='absolute bottom-[-20px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddRule?.inToForce && errors?.AddRule?.inToForce?.message}</label>
                                    </section>
                                    <section className='relative'>
                                        <TextField
                                            autoComplete="off"
                                            tabIndex={2}
                                            {...register(`AddRule.title`)}
                                            InputProps={{
                                                style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                            }}
                                            error={errors?.AddRule && errors?.AddRule?.title && true}
                                            dir='ltr'
                                            className='w-full '
                                            size='small'
                                            label="title"
                                            variant="outlined" />
                                        <label className='absolute bottom-[-20px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddRule?.title && errors?.AddRule?.title?.message}</label>
                                    </section>
                                    <section className='relative'>
                                        <TextField
                                            autoComplete="off"
                                            tabIndex={3}
                                            {...register(`AddRule.convention`)}
                                            error={errors?.AddRule && errors?.AddRule?.convention && true}
                                            InputProps={{
                                                style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                            }}
                                            dir='ltr'
                                            className='w-full '
                                            size='small'
                                            label="convention"
                                            variant="outlined" />
                                        <label className='absolute bottom-[-20px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddRule?.convention && errors?.AddRule?.convention?.message}</label>
                                    </section>
                                    <section className='relative'>
                                        <TextField
                                            autoComplete="off"
                                            tabIndex={4}
                                            error={errors?.AddRule && errors?.AddRule?.origin && true}
                                            {...register(`AddRule.origin`)}
                                            InputProps={{
                                                style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                            }}
                                            dir='ltr'
                                            className='w-full '
                                            size='small'
                                            label="origin"
                                            variant="outlined" />
                                        <label className='absolute bottom-[-20px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddRule?.origin && errors?.AddRule?.origin?.message}</label>
                                    </section>
                                    <section className='relative'>
                                        <TextField
                                            autoComplete="off"
                                            tabIndex={5}
                                            error={errors?.AddRule && errors?.AddRule?.reference && true}
                                            {...register(`AddRule.reference`)}
                                            InputProps={{
                                                style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                            }}
                                            dir='ltr'
                                            className='w-full '
                                            size='small'
                                            label="Refrence"
                                            variant="outlined" />
                                        <label className='absolute bottom-[-20px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddRule?.reference && errors?.AddRule?.reference?.message}</label>
                                    </section>
                                    <FormControlLabel
                                        className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        control={<Checkbox
                                            sx={{
                                                color: color?.color,
                                                '&.Mui-checked': {
                                                    color: color?.color,
                                                },
                                            }}
                                            {...register('AddRule.isPublished')}
                                            checked={watch('AddRule.isPublished')}
                                            onChange={(event) => { setValue(`AddRule.isPublished`, event.target.checked), trigger() }} />}

                                        label="is Published" />

                                </section>
                                <section className='w-full my-6' >
                                    <TextEditorSummary sendData={handleSummary} className='w-full' {...register(`AddRule.nonHtmlSummary`)} defaultValue={watch('AddRule.summary')} />
                                </section>
                                <section className="w-full " >
                                    <TextEditorContent sendData={handleContent} className='w-full' {...register(`AddRule.nonHtmlContent`)} defaultValue={watch('AddRule.content')} />
                                </section>
                            </section>
                        </form>
                    </DialogBody>
                </Dialog>
            </ThemeProvider >
        </>
    )
}
export default RulesAndRegulationTable;