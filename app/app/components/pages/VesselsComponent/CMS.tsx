'use client'
import { Alert, CardBody, Typography } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { useSearchParams } from 'next/navigation';
import { GetCMSResponse, Response } from '@/app/models/VesselsModel/statusTypes';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import TableSkeleton from '../../shared/TableSkeleton';
import moment from 'jalali-moment';

type componetStates = {
    CMSItems: GetCMSResponse[],
    loading: boolean
}

const CMSComponent = (props: any) => {
    const { AxiosRequest } = useAxios()
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    let CMS = {
        CMSItems: [],
        loading: true,
    }

    const [componentState, setComponentState] = useState<componetStates>(CMS)
   
    useEffect(() => {
        const GetCMS = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetCMS?asiaCode=${props.props}`;
            let method = 'get'
            let data = {};
            let response: AxiosResponse<Response<GetCMSResponse[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                setComponentState((state) => ({ ...state, loading: false }))
                if (
                    response.data.status == true && response.data.data.length > 0
                ) {
                    setComponentState((state) => ({ ...state, CMSItems: response.data.data }))
                }
            }
        }
        GetCMS()
    }, [props.props])

    return (
        <CardBody className='mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Alert
                icon={<NotInterestedIcon fontSize='small' sx={{ color: !themeMode ||themeMode?.stateMode ? '#fff3cd' : '#856404' }} />}
                className={!themeMode ||themeMode?.stateMode ? "rounded-md border-l-4 border-[#fff3cd] bg-[#fff3cd]/30 text-sm font-thin text-[#fff3cd] " : "rounded-md border-l-4 border-[#fff3cd] bg-[#fff3cd]/50 text-sm font-thin text-[#856404]"}
            >
                <Typography variant='paragraph' className='text-sm'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Note! Please note that C/Eng means Chief Enginer and also ACS is abbreviation for Asia Classification Society.</Typography>
            </Alert>
            <CardBody className='mx-auto relative rounded-lg overflow-auto p-0 mt-3 h-[65vh]'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                {componentState.loading == false ? <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[63vh] `}>
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
                                    Description
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Last Date
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Done By
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Due Date
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Postponed
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Status
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`statusTable divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {componentState.CMSItems.length > 0 && componentState.CMSItems.map((cms, index) => {
                            return (
                                <tr key={"cms" + index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`} >
                                    <td style={{ width: "3%", minWidth: '10px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {cms.item}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '25%', minWidth: '180px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {cms.itemDescription}
                                        </Typography>
                                    </td>
                                    <td style={{ width: "10%", minWidth: '120px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {cms.lastDate != '' ? moment(cms.lastDate, 'YYYY-MM-DD').format('YYYY-MM-DD') : ''}
                                        </Typography>
                                    </td>
                                    <td style={{ width: "10%", minWidth: '120px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {cms.doneBy}
                                        </Typography>
                                    </td>
                                    <td style={{ width: "10%", minWidth: '120px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {cms.dueDate != '' ? moment(cms.dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD') : ''}
                                        </Typography>
                                    </td>
                                    <td style={{ width: "10%", minWidth: '120px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {cms.extendedUntil != '' ? moment(cms.extendedUntil, 'YYYY-MM-DD').format('YYYY-MM-DD') : ''}
                                        </Typography>
                                    </td>
                                    <td style={{ width: "10%", minWidth: '120px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {cms.status}
                                        </Typography>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table> : <TableSkeleton />}
            </CardBody>
        </CardBody>
    )
}

export default CMSComponent