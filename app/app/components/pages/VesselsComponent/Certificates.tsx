'use client'
import { Accordion, AccordionBody, Alert, CardBody, Typography } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { CertStateModel, GetCertificatesResponse, Response } from '@/app/models/VesselsModel/statusTypes';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
// import { useSearchParams } from 'next/navigation';
import moment from 'jalali-moment';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import TableSkeleton from '../../shared/TableSkeleton';
import IconRudder from '../../shared/iconRudder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { overFlow } from '@syncfusion/ej2-react-diagrams';

type componetStates = {
    certificatesItem: GetCertificatesResponse[],
    loading: boolean
}

const Certificates = (props: any) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [open, setOpen] = React.useState(0);
    const handleOpen = (value: number) => setOpen(value === open ? 0 : value);
    const { AxiosRequest } = useAxios()
    let certificates = {
        certificatesItem: [],
        loading: true,
    }
    const [componentState, setComponentState] = useState<componetStates>(certificates)


    useEffect(() => {
        const GetCertificates = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetCertificates?asiaCode=${props.props}`;
            let method = 'get'
            let data = {};
            let response: AxiosResponse<Response<GetCertificatesResponse[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                setComponentState((state) => ({ ...state, loading: false }))
                if (
                    response.data.status == true && response.data.data.length > 0
                ) {
                    setComponentState((state) => ({ ...state, certificatesItem: response.data.data }))
                }
            }
        }
        GetCertificates()
    }, [props.props])

    return (
        <CardBody className=' mx-auto relative rounded-lg  p-0' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Alert
                icon={<NotInterestedIcon fontSize='small' sx={{ color: !themeMode || themeMode?.stateMode ? '#fff3cd' : '#856404' }} />}
                className={!themeMode || themeMode?.stateMode ? "rounded-md border-l-4 border-[#fff3cd] bg-[#fff3cd]/30 text-sm font-thin text-[#fff3cd] " : "rounded-md border-l-4 border-[#fff3cd] bg-[#fff3cd]/50 text-sm font-thin text-[#856404]"}>
                <Typography variant='paragraph' className='text-sm' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Note! Please note that only latest certificates issued is shown in vessel class/survey status.</Typography>
            </Alert>
            <CardBody className='mx-auto rounded-lg p-0 mt-3 h-[65vh] overflow-auto' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                {componentState.loading == false ?
                    <table className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full text-center overflow-auto max-h-[62vh] `}>
                        <thead className='sticky z-[9999] top-0 left-0 w-full'>
                            <tr className='w-full'>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Certificate Category
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Code
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Certificate
                                    </Typography>
                                </th>
                                <th style={{ width: "15%", borderBottomColor: color?.color }}
                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Term
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Issue
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Expire
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Extended
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Status
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`statusTable divide-y divide-bg-${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                            {componentState.certificatesItem.length > 0 && componentState.certificatesItem?.map((cerificate: GetCertificatesResponse, index: number) => {
                                return (
                                    cerificate.certStates.map((item: CertStateModel, num: number) => {
                                        return (
                                            <tr key={'certificate' + num}
                                                className={`${num % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none w-full hover:bg-blue-gray-50/30 hover:bg-opacity-75 p-0 m-0 overflow-auto`}>
                                                <td style={{ width: "15%", minWidth: '100px' }} className='p-1'>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className={`font-[EnRegular]  text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        {cerificate.certificateCertTypeName}
                                                    </Typography>
                                                </td>
                                                <td style={{ width: "5%", minWidth: '40px' }} className='p-1'>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        {item.code}
                                                    </Typography>
                                                </td>
                                                <td style={{ width: '40%', minWidth: '110px' }} className='p-1'>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className={`font-[EnRegular]  text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        {item.name}
                                                    </Typography>
                                                </td>
                                                <td style={{ width: '5%', minWidth: '50px' }} className='p-1'>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className={`font-[EnRegular]  text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        {item.term}
                                                    </Typography>
                                                </td>
                                                <td style={{ width: '5%', minWidth: '60px' }} className='p-1'>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className={`font-[EnRegular]  text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        {item.issueDate != '' ? moment(item.issueDate, 'YYYY-MM-DD').format('YYYY-MM-DD') : ''}
                                                    </Typography>
                                                </td>
                                                <td style={{ width: '5%', minWidth: '60px' }} className='p-1'>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className={`font-[EnRegular]  text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        {item.expireDate != '' ? moment(item.expireDate, 'YYYY-MM-DD').format('YYYY-MM-DD') : ''}
                                                    </Typography>
                                                </td>
                                                <td style={{ width: '5%', minWidth: '60px' }} className='p-1'>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className={`font-[EnRegular]  text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        {item.extended}
                                                    </Typography>
                                                </td>
                                                <td style={{ width: '20%', minWidth: '120px' }} className='p-1'>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnUltraLight] whitespace-nowrap flex justify-center items-center flex-nowrap text-[13px]`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        {item.status.trim() == 'Valid' ? <IconRudder color='#04ca6a' /> : (item.status.trim() == 'Expired' ? <IconRudder color='#c40a0a' /> : item.status.trim() == 'Within Window Last Month' ? < IconRudder color='#e98f11' /> : item.status.trim() == 'Within Window' && < IconRudder color='#f5d32d' />)}
                                                        <span className='mx-2'>{item.status.trim()}</span>
                                                    </Typography>
                                                </td>
                                            </tr>
                                        )
                                    })

                                )
                            })}
                        </tbody>
                    </table> : <TableSkeleton />
                }

            </CardBody >
        </CardBody >
    )
}

export default Certificates