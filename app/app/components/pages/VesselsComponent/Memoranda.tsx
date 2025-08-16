'use client'
import { Alert, CardBody, Typography } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { GetMemorandaResponse, Response } from '@/app/models/VesselsModel/statusTypes';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import TableSkeleton from '../../shared/TableSkeleton';
import moment from 'jalali-moment';

type MemorandaType = {
    memorandaState: GetMemorandaResponse[],
    loading: boolean
}

const Memoranda = (props: any) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    let memoranda = {
        loading: true,
        memorandaState: []
    }
    const [componentState, setComponentState] = useState<MemorandaType>(memoranda)
    const { AxiosRequest } = useAxios()
    useEffect(() => {
        const GetMemorandas = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetMemorandas?asiaCode=${props.props}`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<GetMemorandaResponse[]>> = await AxiosRequest({ url, method, data, credentials: true });
            if (response) {
                setComponentState((state) => ({ ...state, loading: false }));
                if (response.data.status && response.data.data) {
                    setComponentState((state) => ({ ...state, memorandaState: response.data.data }));
                }
            }
        }
        GetMemorandas()
    }, [props.props])


    return (
        <CardBody className='mx-auto relative rounded-lg overflow-auto p-0' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <CardBody className='mx-auto relative rounded-lg overflow-auto p-0 mt-3 h-[65vh]' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                {componentState.loading == false ? <table className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[63vh] `}>
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
                                    Issue Date
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Issued At
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Memoranda
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`statusTable divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {componentState.memorandaState.length > 0 && componentState.memorandaState.map((memoranda, index) => {
                            return (
                                <tr key={"memoranda" + index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`} >
                                    <td style={{ width: "10%", minWidth: '80px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {memoranda.asiaCode}
                                        </Typography>
                                    </td>
                                    <td style={{ width: "10%", minWidth: '80px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {memoranda.issueDate != '' ? moment(memoranda.issueDate, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD') : ''}
                                        </Typography>
                                    </td>
                                    <td style={{ width: "10%", minWidth: '80px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {memoranda.issuedAt}
                                        </Typography>
                                    </td>
                                    <td style={{ width: "50%", minWidth: '200px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {memoranda.memoranda}
                                        </Typography>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table> : <TableSkeleton />}
            </CardBody>

        </CardBody >
    )
}

export default Memoranda