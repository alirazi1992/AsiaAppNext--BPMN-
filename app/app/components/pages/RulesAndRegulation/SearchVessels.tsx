'use client';
import { Button, CardBody, Input, Tooltip, Typography } from '@material-tailwind/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import SearchIcon from '@mui/icons-material/Search';
import useStore from "@/app/hooks/useStore";
import colorStore from '@/app/zustandData/color.zustand';
import TableSkeleton from '../../shared/TableSkeleton';
import { useSearchParams } from 'next/navigation'
import useAxios from '@/app/hooks/useAxios';
import { AxiosResponse } from 'axios';
import { GetAppliedVessels, GetAppliedVesselsResponse, Response, ToggleApplyConditionResponse } from '@/app/models/RulesAndRegulation.ts/RulesAndRegulation';
//icons
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import moment from 'jalali-moment';
import Swal from 'sweetalert2';
import { Pagination, Stack } from '@mui/material';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye'

const SearchVessels = () => {
    const { AxiosRequest } = useAxios()
    interface Loading {
        loadingTable: boolean,
        action: boolean
    }
    const searchParams = useSearchParams()
    const id = useRef<string | null>(searchParams.get('id'));
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state)
    let loadings = {
        loadingTable: false,
        action: false
    }
    const [loading, setLoading] = useState<Loading>(loadings)
    const [searchText, setSearchText] = useState<string | null>(null)
    const [appliedVessels, setAppliedVessels] = useState<GetAppliedVessels[]>([])

    const [count, setCount] = useState<number>(0)

    const GetAppliedVessels = useCallback(async (pageNo: number = 1) => {
        setLoading((state) => ({ ...state, loadingTable: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/GetAppliedVessels`;
        let method = 'post';
        let data = {
            "ruleId": Number(id!.current),
            "count": 10,
            "pageNo": pageNo,
            "searchKey": searchText
        };
        let response: AxiosResponse<Response<GetAppliedVesselsResponse>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            setLoading((state) => ({ ...state, loadingTable: false }))
            if (response.data.status && response.data.data != null) {
                setAppliedVessels(response.data.data.appliedVessels)
                let paginationCount = Math.ceil(Number(response.data.data?.totalCount) / Number(10));
                setCount(paginationCount)
            }
        }
    }, [searchText])

    const ToggleApplyVessel = async (item: GetAppliedVessels) => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Toggle Apply Vessel!",
            text: "Are you sure about Creating this post?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#21af5a",
            cancelButtonColor: "#b53535",
            confirmButtonText: "Yes!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading((state) => ({ ...state, action: false }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/RulesAndRegulations/Manage/ToggleApplyVessel`;
                let method = 'patch';
                let data = {
                    "status": item.isDeleted,
                    "vesselApplyId": item.id
                };
                let response: AxiosResponse<Response<ToggleApplyConditionResponse>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    setLoading((state) => ({ ...state, action: false }))
                    let item: GetAppliedVessels = appliedVessels.find((item) => item.id == response.data.data.id)!;
                    let newItem = {
                        id: response.data.data.id,
                        vesselName: item.vesselName,
                        vesselAsiaCode: item.vesselAsiaCode,
                        conditionId: item.conditionId,
                        applyDate: item.applyDate,
                        isDeleted: !item.isDeleted,
                        deleteDate: response.data.data.deleteDate,
                        reapplyDate: response.data.data.reapplyDate
                    }
                    let index = appliedVessels.indexOf(item)
                    appliedVessels.splice(index, 1, newItem)
                }
                if (response.data.data == null) {
                    Swal.fire({
                        background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Toggle Apply Vessel!",
                        text: response.data.message,
                        icon: response.data.status && response.data.data == null ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK",
                    })
                }
            }
        })

    }
    // let resultData: any[] = []
    // const [showVessels, setShowVessels] = useState<GetAppliedVessels[] | null>(null)
    // const SearchApplyVessels = () => {
    //     appliedVessels.forEach((item: GetAppliedVessels) => {
    //         if (item.vesselName.includes(searchText!)) {
    //             resultData.push(item)
    //         }
    //     })
    // }
    useEffect(() => {
        GetAppliedVessels()
    }, [GetAppliedVessels])

    return (
        <>
            <CardBody
                onKeyDown={(e: any) => { if (e.key === 'Enter' || e.key === 13) { GetAppliedVessels; } } }
                onKeyUp={(e: any) => { if (e.key === 'Enter' || e.key === 13) { GetAppliedVessels; } } }
                className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} RulesClass w-[98%] md:w-[96%] my-3 mx-auto `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <div className="w-full">
                    <div className="container-fluid mx-auto">
                        <div className="flex flex-col md:flex-row justify-end md:justify-between items-center">
                            <div className="statusTable relative w-[90%] md:w-[400px] flex ">
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
                                    onBlur={(e: any) => { setSearchText(e.target.value), e.target.value.toString().trim() == ""; } } onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                />
                                <Button
                                    size="sm"
                                    className="!absolute right-1 top-1 rounded p-1"
                                    style={{ background: color?.color }}
                                    onClick={() => { GetAppliedVessels(); } }  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    <SearchIcon
                                        className='p-1'
                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardBody className='w-[98%] lg:w-[96%] mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                {loading.loadingTable == false ? <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center `}>
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
                                    state
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[700] text-[12px] p-1.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    VesselAsiaCode
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    VesselName
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    ConditionId
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    ApplyDate
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    ReApplyDate
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    IsDeleted
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    DeleteDate
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Action
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={` RulesClass divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>

                        {appliedVessels.map((item: GetAppliedVessels, index: number) => {
                            return (
                                <tr key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                    <td style={{ width: '3%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {Number(index) + Number(1)}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '3%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            <PanoramaFishEyeIcon sx={{ color: `${item.isDeleted == false ? '#04ca6a' : '#c40a0a'}` }} />
                                        </Typography>
                                    </td>
                                    <td style={{ width: '3%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[12px] p-1.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.vesselAsiaCode}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.vesselName}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '2%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.conditionId}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.applyDate !== '' ? moment(item.applyDate, 'YYYY/MM/DD HH:mm:SS').format("YYYY/MM/DD HH:mm:SS") : ''}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.reapplyDate !== null ? moment(item.reapplyDate, 'YYYY/MM/DD HH:mm:SS').format("YYYY/MM/DD HH:mm:SS") : ''}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.isDeleted ? 'true' : 'false'}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.deleteDate == null ? '' : moment(item.deleteDate, 'YYYY/MM/DD HH:mm:SS').format("YYYY/MM/DD HH:mm:SS")}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '3%' }} className='p-1'>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">

                                                {item.isDeleted == false ?
                                                    <Button
                                                        size="sm"
                                                        className="p-1 mx-1 bg-[#c40a0a]"
                                                        onClick={() => ToggleApplyVessel(item)}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        <Tooltip content="UnApply" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                                                            <DoDisturbIcon
                                                                fontSize="small"
                                                                className='p-1'
                                                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                            />
                                                        </Tooltip>
                                                    </Button> :
                                                    <Button size="sm"
                                                    className="p-1 mx-1 bg-[#04ca6a]"
                                                    onClick={() => ToggleApplyVessel(item)}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        <Tooltip content="ReApply" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                                                            <ReplyAllIcon
                                                                fontSize="small"
                                                                className='p-1'
                                                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                            />
                                                        </Tooltip>
                                                    </Button>}

                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table> : <TableSkeleton />}
            </CardBody >
            {count != 0 && (<section className='flex RulesClass justify-center mb-0 mt-3'>
                <Stack onClick={(e: any) => { GetAppliedVessels(e.target.innerText) }} spacing={1}>
                    <Pagination hidePrevButton hideNextButton count={count} variant="outlined" size="small" shape="rounded" />
                </Stack>
            </section>)}
        </>

    )
}

export default SearchVessels