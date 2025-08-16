'use client'
import { Button, ButtonGroup, Card, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Radio, Tooltip, Typography } from '@material-tailwind/react';
import React, { useCallback, useEffect, useRef, useState, } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import Select2, { ActionMeta, SingleValue } from 'react-select';
import { useSearchParams, useRouter } from 'next/navigation';
import BlockIcon from '@mui/icons-material/Block';
import { AxiosResponse } from 'axios';
import { AddConditionModel, GetAddConditionResponse, GetCertifiedToOperate, GetNavigationAreas, GetRulesConditionsModel, GetVesselesModel, Response } from '@/app/models/RulesAndRegulation.ts/RulesAndRegulation';
//icons
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import useAxios from '@/app/hooks/useAxios';
import TableSkeleton from '../../shared/TableSkeleton';
import Swal from 'sweetalert2';
import Loading from '../../shared/loadingResponse';
import moment from 'jalali-moment';
import ButtonComponent from '../../shared/ButtonComponent';


const Apply = () => {
    const { AxiosRequest } = useAxios()
    interface Loading {
        tableLoading: boolean,
        action: boolean
    }
    interface Options {
        VesselTypes: GetVesselesModel[],
        NavigationAreas: GetNavigationAreas[],
        CertifiedToOperateAreas: GetCertifiedToOperate[],
        MachineryOperations: GetNavigationAreas[],
        Certificates: GetNavigationAreas[]
    }
    const searchParams = useSearchParams()
    const id = useRef<string | null>(searchParams.get('id'));
    let loadings = {
        tableLoading: false,
        action: false
    }
    const [loading, setLoading] = useState<Loading>(loadings)
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [state, setState] = useState<boolean>(false)
    const router = useRouter()
    const handleOpen = () => setState(!state)
    const [rulesConditions, setRulesConditions] = useState<GetRulesConditionsModel[]>([])

    let options = {
        VesselTypes: [],
        NavigationAreas: [],
        CertifiedToOperateAreas: [],
        MachineryOperations: [],
        Certificates: []
    }

    let addCondition: AddConditionModel = {
        id: id!.current,
        vesselTypes: [],
        navigationAreaCovered: [],
        certifiedToOperateCovered: [],
        gtMin: 0,
        gtMax: 0,
        deadWeightMin: 0,
        deadWeightMax: 0,
        regulationLengthMin: 0,
        regulationLengthMax: 0,
        lengthOverallMin: 0,
        lengthOverallMax: 0,
        passengerCapacityMin: 0,
        passengerCapacityMax: 0,
        crowCountMin: 0,
        crowCountMax: 0,
        keelLayingDate: '',
        keelLayingDateRange: false,
        dateOfBuild: '',
        dateOfBuildRange: false,
        dateOfDelivery: '',
        dateOfDeliveryRange: false,
        machineryOperationCovered: [],
        certificatesCovered: []
    }
    const [condition, setCondition] = useState<AddConditionModel>(addCondition)

    const [applyState, setApplyState] = useState<Options>(options)

    const GetRulesConditions = async () => {
        setLoading((state) => ({ ...state, tableLoading: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/GetRuleConditions?Id=${id.current}`
        let method = ''
        let data = {}
        let response: AxiosResponse<GetRulesConditionsModel[]> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            setLoading((state) => ({ ...state, tableLoading: false }))
            if (response.data != null && response.data.length > 0) {
                setRulesConditions(response.data)
            }
        }
    }

    const UnApplyConditions = async (id: number) => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "UnApply Condition!",
            text: "Are you sure about unapplying this condition?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#21af5a",
            cancelButtonColor: "#b53535",
            confirmButtonText: "Yes,unApply it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading((state) => ({ ...state, action: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/UnapplyCondition?ConditionId=${id}`;
                let method = 'PATCH';
                let data = {};
                let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    setLoading((state) => ({ ...state, action: false }))
                    if (response.data.data == 0) {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "UnApply Condition!",
                            text: response.data.message,
                            icon: response.data.status ? "warning" : "error",
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK",
                        })
                    }
                }
            }
        })
    }

    const DeleteConditions = (id: number) => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Delete Condition!",
            text: "Are you sure about deleting this condition?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#21af5a",
            cancelButtonColor: "#b53535",
            confirmButtonText: "Yes,delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading((state) => ({ ...state, action: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/DeleteCondition?ConditionId=${id}`;
                let method = 'delete';
                let data = {};
                let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    setLoading((state) => ({ ...state, action: false }))
                    if (response.data.status && response.data.data != 0) {
                        let index = rulesConditions.indexOf(rulesConditions.find(item => item.id == id)!)
                        rulesConditions.splice(index, 1)
                    } else {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Delete Condition!",
                            text: response.data.message,
                            icon: response.data.status ? "warning" : "error",
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK",
                        })
                    }
                }
            }
        })
    }

    const GetVesselsType = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/GetVesselTypes`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<GetVesselesModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response.data.data != null && response.data.data.length > 0) {
            setApplyState((state: any) => ({
                ...state, VesselTypes: response.data.data.map((item: GetVesselesModel) => {
                    return {
                        label: item.nameEn,
                        value: item.id,
                        id: item.id,
                        nameEn: item.nameEn
                    }
                })
            }))
        }
    }
    const GetNavigationAreas = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/GetNavigationAreas`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<GetNavigationAreas[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response.data.data != null && response.data.data.length > 0) {
            setApplyState((state: any) => ({
                ...state, NavigationAreas: response.data.data.map((item: GetNavigationAreas) => {
                    return {
                        label: item.title,
                        value: item.id,
                        id: item.id,
                        title: item.title
                    }
                })
            }))
        }
    }
    const GetCertifiedToOperate = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/GetCertifiedToOperate`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<GetCertifiedToOperate[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response.data.data != null && response.data.data.length > 0) {
            setApplyState((state: any) => ({
                ...state, CertifiedToOperateAreas: response.data.data.map((item: GetCertifiedToOperate) => {
                    return {
                        label: item.areaTitle,
                        value: item.id,
                        areaTitle: item.areaTitle,
                        id: item.id,
                    }
                })
            }))
        }
    }

    const GetMachinaryOperations = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/GetMachinaryOperations`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<GetNavigationAreas[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response.data.data != null && response.data.data.length > 0) {
            setApplyState((state: any) => ({
                ...state, MachineryOperations: response.data.data.map((item: GetNavigationAreas) => {
                    return {
                        label: item.title,
                        value: item.id,
                        areaTitle: item.title,
                        id: item.id,
                    }
                })
            }))
        }
    }
    const GetCertificates = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/GetCertificates`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<GetNavigationAreas[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response.data.data != null && response.data.data.length > 0) {
            setApplyState((state: any) => ({
                ...state, Certificates: response.data.data.map((item: GetNavigationAreas) => {
                    return {
                        label: item.title,
                        value: item.id,
                        areaTitle: item.title,
                        id: item.id,
                    }
                })
            }))
        }
    }

    const AddCondition = async () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Add Condition!",
            text: "Are you sure about adding this condition?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#21af5a",
            cancelButtonColor: "#b53535",
            confirmButtonText: "Yes,add it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading((state) => ({ ...state, action: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/AddCondition`
                let method = 'put'
                let data = {
                    "id": id.current,
                    "vesselTypes": [
                        condition.vesselTypes
                    ],
                    "navigationAreaCovered": [
                        condition.navigationAreaCovered
                    ],
                    "certifiedToOperateCovered": [
                        condition.certifiedToOperateCovered
                    ],
                    "gtMin": condition.gtMin,
                    "gtMax": condition.gtMax,
                    "deadWeightMin": condition.deadWeightMin,
                    "deadWeightMax": condition.deadWeightMax,
                    "regulationLengthMin": condition.regulationLengthMin,
                    "regulationLengthMax": condition.regulationLengthMax,
                    "lengthOverallMin": condition.lengthOverallMin,
                    "lengthOverallMax": condition.lengthOverallMax,
                    "passengerCapacityMin": condition.passengerCapacityMin,
                    "passengerCapacityMax": condition.passengerCapacityMax,
                    "crowCountMin": condition.crowCountMin,
                    "crowCountMax": condition.crowCountMax,
                    "keelLayingDate": condition.keelLayingDate,
                    "keelLayingDateRange": condition.keelLayingDateRange,
                    "dateOfBuild": condition.dateOfBuild,
                    "dateOfBuildRange": condition.dateOfBuildRange,
                    "dateOfDelivery": condition.dateOfDelivery,
                    "dateOfDeliveryRange": condition.dateOfDeliveryRange,
                    "machineryOperationCovered": [
                        condition.machineryOperationCovered
                    ],
                    "certificatesCovered": [
                        condition.certificatesCovered
                    ]
                }
                let response: AxiosResponse<Response<GetAddConditionResponse>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    setLoading((state) => ({ ...state, action: false }))
                    let array: GetRulesConditionsModel[] = rulesConditions;
                    let newItem = {
                        creationDate: response.data.data.creationDate,
                        id: response.data.data.conditionId,
                        ruleId: Number(id.current)
                    }
                    setRulesConditions([...rulesConditions, newItem])
                    if (response.data.data == null) {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Add Condition!",
                            text: response.data.message,
                            icon: response.data.status ? "warning" : "error",
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK",
                        })
                    }
                }
            }
        })
    }

    const ApplyCondiion = async () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Apply Condition!",
            text: "Are you sure about applying this condition?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#21af5a",
            cancelButtonColor: "#b53535",
            confirmButtonText: "Yes,apply it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading((state) => ({ ...state, action: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/ApplyCondition`;
                let method = 'put';
                let data = {
                    "ruleId": Number(id.current),
                    "conditionId":
                        rulesConditions.map((rule: GetRulesConditionsModel) => { return rule.id })
                };
                let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    setLoading((state) => ({ ...state, action: false }))
                    if (response.data.data == null) {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Apply Condition!",
                            text: response.data.message,
                            icon: response.data.status ? "warning" : "error",
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK",
                        })
                    }
                }
            }
        })

    }



    useEffect(() => {
        GetRulesConditions()
        GetVesselsType()
        GetNavigationAreas()
        GetCertifiedToOperate()
        GetMachinaryOperations()
        GetCertificates()
    }, [])


    return (
        <>
            {loading.action == true && <Loading />}

            <div className='RulesClass w-[98%] md:w-[50%] flex flex-col items-end justify-between md:flex-row md:items-center md:justify-around m-3'>
                <div className='w-[100%] flex flex-row justify-start'>
                    <Tooltip content="Add Condition" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                        <Button
                            onClick={() => handleOpen()}
                            size="sm"
                            className="p-1 mx-1"
                            style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                            <AddIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Search Vessels" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                        <Button
                            onClick={() => router.push(`/Home/RulesAndRegulation/SearchVessels?id=${id.current}`)}
                            size="sm"
                            className="p-1 mx-1"
                            style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                            <SearchIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Apply Condition " className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                        <Button
                            onClick={() => ApplyCondiion()}
                            size="sm"
                            className="p-1 mx-1"
                            style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                            <ReplyAllIcon
                                fontSize='small'
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            />
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <CardBody className='RulesClass w-[98%] lg:w-[80%] h-[67vh] mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                {loading.tableLoading == false ? <table className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} w-full relative text-center max-h-[68vh] `}>
                    <thead>
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    #
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Id
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Ruled
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    CreationDate
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Command
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`RulesClass divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>

                        {rulesConditions.map((item: GetRulesConditionsModel, index: number) => {
                            return (
                                <tr key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                    <td style={{ width: '10%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {Number(1 + index)}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '10%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[12px] p-1.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.id}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '10%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[12px] p-1.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.ruleId}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[12px] p-1.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.creationDate !== '' ? moment(item.creationDate, 'YYYY/MM/DD HH:mm:SS').format("YYYY/MM/DD HH:mm:SS") : ''}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '10%' }} className='p-1'>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content="unApply" ><Button

                                                    onClick={() => { UnApplyConditions(item.id); } }
                                                    style={{ background: color?.color }}
                                                    size="sm"
                                                    className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <BlockIcon
                                                        fontSize='small'
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />

                                                </Button>
                                                </Tooltip>
                                                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content="Delete condition" ><Button

                                                    onClick={() => { DeleteConditions(item.id); } }
                                                    style={{ background: color?.color }}
                                                    size="sm"
                                                    className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <DeleteIcon
                                                        fontSize='small'
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />

                                                </Button>
                                                </Tooltip>

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
            }} size='xl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} absolute top-0 bottom-0 overflow-y-scroll `} open={state} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'cardLight darkText'} flex justify-between z-[100] sticky top-0 left-0 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Add Condition
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
                <DialogBody className='overflow-y-scroll'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <section className='flex flex-col gap-4'>
                        <Input readOnly value={id!.current!} crossOrigin="" size="md" label="Id" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        <section className='flex gap-x-4 justify-around '>
                            <Select2 isRtl
                                onChange={(option: SingleValue<GetVesselesModel>) => { setCondition((state: any) => ({ ...state, vesselTypes: option!.id.toString() })) }}
                                options={applyState.VesselTypes}
                                maxMenuHeight={160}
                                placeholder="VesselTypes"
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] z-50`}
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
                                        neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                        neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
                                    },
                                })}
                            />
                            <Select2 isRtl
                                onChange={(option: SingleValue<GetNavigationAreas>) => { setCondition((state: any) => ({ ...state, navigationAreaCovered: option!.id.toString() })) }}
                                maxMenuHeight={160}
                                options={applyState.NavigationAreas}
                                placeholder="NavigationArease"
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] z-50`}
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
                                        neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                        neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
                                    },
                                })}
                            />
                            <Select2 isRtl
                                onChange={(option: SingleValue<GetCertifiedToOperate>) => { setCondition((state: any) => ({ ...state, certifiedToOperateCovered: option!.id.toString() })) }}
                                maxMenuHeight={160}
                                placeholder="CertifiedToOperateAreas"
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] z-50`}
                                options={applyState.CertifiedToOperateAreas}
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
                                        neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                        neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
                                    },
                                })}
                            />
                        </section>

                        <section className='flex gap-x-4 justify-around'>
                            <div className='flex justify-between gap-x-3'>
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, gtMin: event.target.value }))} className='' label="GT(min)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, gtMax: event.target.value }))} className='' label="GT(max)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                            <div className='flex justify-between gap-x-3'>
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, deadWeightMin: event.target.value }))} label="Dead Weight(min)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, deadWeightMax: event.target.value }))} label="Dead Weight(max)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                            <div className='flex justify-between gap-x-3'>
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, regulationLengthMin: event.target.value }))} label="Regulation Length(min)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, regulationLengthMax: event.target.value }))} label="Regulation Length(max)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                        </section>
                        <section className='flex gap-x-4 justify-around'>
                            <div className='flex justify-between gap-x-3'>
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, lengthOverallMin: event.target.value }))} label="Length Overall(min)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, lengthOverallMin: event.target.value }))} label="Length Overall(max)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                            <div className='flex justify-between gap-x-3'>
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, passengerCapacityMin: event.target.value }))} label="Passenger Capacity(min)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, passengerCapacityMax: event.target.value }))} label="Passenger Capacity(max)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                            <div className='flex justify-between gap-x-3'>
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, crowCountMin: event.target.value }))} label="Crow Count(min)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                <Input crossOrigin="" type='number' onBlur={(event: any) => setCondition((state) => ({ ...state, crowCountMax: event.target.value }))} label="Crow Count(max)" size="md" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                        </section>
                        <section className='flex gap-x-4 justify-around'>
                            <div className='flex justify-between gap-x-7'>
                                <div className="flex gap-3">
                                    <Radio name="keelLayingDate" onChange={() => setCondition((state) => ({ ...state, keelLayingDateRange: false }))} crossOrigin="" color='blue-gray' label={<Typography
                                        color="blue-gray"
                                        className={`flex font-medium ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        before</Typography>} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    />
                                    <Radio name="keelLayingDate" onChange={() => setCondition((state) => ({ ...state, keelLayingDateRange: true }))} crossOrigin="" color='blue-gray' label={<Typography
                                        color="blue-gray"
                                        className={`flex font-medium ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        after</Typography>} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </div>
                                <Input onChange={(event: any) => setCondition((state) => ({ ...state, keelLayingDate: event.target.value }))} crossOrigin="" type='date' size="md" label='Keel Laying' style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                            <div className='flex justify-between gap-x-7'>
                                <div className="flex gap-3">
                                    <Radio name="dateOfBuild" onChange={() => setCondition((state) => ({ ...state, dateOfBuildRange: false }))} crossOrigin="" color='blue-gray' label={<Typography
                                        color="blue-gray"
                                        className={`flex font-medium ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        before</Typography>} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    />
                                    <Radio name="dateOfBuild" onChange={() => setCondition((state) => ({ ...state, dateOfBuildRange: true }))} crossOrigin="" color='blue-gray' label={<Typography
                                        color="blue-gray"
                                        className={`flex font-medium ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        after</Typography>} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </div>
                                <Input onChange={(event: any) => setCondition((state) => ({ ...state, dateOfBuild: event.target.value }))} crossOrigin="" type='date' size="md" label='Date Of Build' style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                            <div className='flex justify-between gap-x-7'>
                                <div className="flex gap-3">
                                    <Radio onChange={() => setCondition((state) => ({ ...state, dateOfDeliveryRange: false }))} crossOrigin="" color='blue-gray' name="dateOfDelivery" label={<Typography
                                        color="blue-gray"
                                        className={`flex font-medium ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        before</Typography>} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    />
                                    <Radio onChange={() => setCondition((state) => ({ ...state, dateOfDeliveryRange: true }))} crossOrigin="" color='blue-gray' name="dateOfDelivery" label={<Typography
                                        color="blue-gray"
                                        className={`flex font-medium ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        after</Typography>} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </div>
                                <Input onChange={(event: any) => setCondition((state) => ({ ...state, dateOfDelivery: event.target.value }))} crossOrigin="" type='date' size="md" label='Date Of Delivery' style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </div>
                        </section>
                        <section className='flex gap-x-4 justify-around'>
                            <Select2 isRtl
                                onChange={(option: SingleValue<GetNavigationAreas>) => { setCondition((state: any) => ({ ...state, machineryOperationCovered: option!.id.toString() })) }}
                                maxMenuHeight={160}
                                options={applyState.MachineryOperations}
                                placeholder="MachineryOperations"
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] z-50`}
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
                                        neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                        neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
                                    },
                                })}
                            />
                            <Select2 isRtl
                                onChange={(option: SingleValue<GetNavigationAreas>) => { setCondition((state: any) => ({ ...state, certificatesCovered: option!.id.toString() })) }}
                                maxMenuHeight={160}
                                placeholder="Certificates"
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] z-50`}
                                options={applyState.Certificates}
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
                                        neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                        neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
                                    },
                                })}
                            />
                        </section>


                    </section>
                </DialogBody>
                <DialogFooter className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} w-full flex flex-nowrap justify-between sticky bottom-0 left-0`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    {/* <section className='flex justify-start'>
                        <ButtonComponent onClick={() => handleOpen()}>close!</ButtonComponent>
                    </section> */}
                    <section className='flex justify-end'>
                        <ButtonComponent onClick={() => AddCondition()}>Add!</ButtonComponent>
                    </section>
                </DialogFooter>
            </Dialog>

        </>
    )
}

export default Apply