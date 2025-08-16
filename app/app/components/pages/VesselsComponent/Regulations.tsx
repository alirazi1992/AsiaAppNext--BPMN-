'use client'
import { Alert, Button, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Typography } from '@material-tailwind/react'
import React, { useEffect, useRef, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useAxios from '@/app/hooks/useAxios';
import { GetRegulationResponse, Response } from '@/app/models/VesselsModel/statusTypes';
import { AxiosResponse } from 'axios';
import TableSkeleton from '../../shared/TableSkeleton';
import moment from 'jalali-moment';
import ButtonComponent from '../../shared/ButtonComponent';
import TextEditorComponent from '../../shared/textEditor';

type ComponentState = {
    regulationItems: GetRegulationResponse[],
    loading: boolean,
    showRegulation: {
        id: number,
        regulationItem: GetRegulationResponse | null
    }
}

const Regulations = (props: any) => {
    const { AxiosRequest } = useAxios()
    let Content = useRef('') as any
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state);
    const [open, setOpen] = useState(false);
    const handlerOpen = () => { setOpen(!open) };

    let regulations = {
        regulationItems: [],
        loading: true,
        showRegulation: {
            id: 0,
            regulationItem: null
        }
    }

    const [componentState, setComponentState] = useState<ComponentState>(regulations)
    const [showRegulation, setShowRegulation] = useState<GetRegulationResponse>({
        applyDate: '',
        nonHTMLContent: '',
        convention: '',
        id: 0,
        intoForce: '',
        isPublished: false,
        origin: '',
        reference: '',
        nonHTMLSummary: '',
        title: ''
    })

    useEffect(() => {
        const GetRegulation = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetRegulations?asiaCode=${props.props}`;
            let method = 'get'
            let data = {};
            let response: AxiosResponse<Response<GetRegulationResponse[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                setComponentState((state) => ({ ...state, loading: false }))
                if (
                    response.data.status == true && response.data.data.length > 0
                ) {
                    setComponentState((state) => ({ ...state, regulationItems: response.data.data }))
                    response.data.data.map((item) => {
                        setComponentState((state) => ({ ...state, showRegulation: { id: item.id, regulationItem: item } }))
                    })
                }
            }
        }

        GetRegulation()
    }, [props.props])



    return (
        <>
            <CardBody className='mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <CardBody className='mx-auto relative rounded-lg overflow-auto p-0 mt-3 h-[65vh]'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                    {componentState.loading == false ? <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[62vh] `}>
                        <thead>
                            <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
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
                                        Commands
                                    </Typography>
                                </th>


                            </tr>
                        </thead>
                        <tbody className={`statusTable divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                            {componentState.regulationItems.length > 0 && componentState.regulationItems.map((item, index) => {
                                return (
                                    <tr key={"regulation" + index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`} >
                                        <td style={{ width: "15%", minWidth: '120px' }} className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.applyDate != '' ? moment(item.applyDate, 'YYYY-MM-DD').format('YYYY-MM-DD') : ''}
                                            </Typography>
                                        </td>
                                        <td className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.title}
                                            </Typography>
                                        </td>
                                        <td style={{ width: "10%", minWidth: '120px' }} className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.convention}
                                            </Typography>
                                        </td>
                                        <td style={{ width: "15%", minWidth: '120px' }} className='p-1'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {item.reference}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '4%' }} className='p-1'>
                                            <div className='container-fluid mx-auto p-0.5'>
                                                <div className="flex flex-row justify-evenly">
                                                    <Button
                                                        size="sm"
                                                        className="mx-1 p-1"
                                                        onClick={() => { handlerOpen(), setShowRegulation(componentState.regulationItems.find((i) => i.id == item.id)!); } }
                                                        style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                                        <VisibilityIcon fontSize="small"
                                                            className='p-1'
                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table> : <TableSkeleton />}
                </CardBody>
            </CardBody>
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
                size='xl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} EnFont absolute top-0 bottom-0 overflow-y-scroll `} open={open} handler={handlerOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between z-[100] sticky top-0 left-0 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Rule / Regulation
                    <IconButton variant="text" color="blue-gray" onClick={() => { handlerOpen(); } }  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                <DialogBody className=" EnFont h-full m-3 py-2 relative"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <div className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-thin`} dangerouslySetInnerHTML={{ __html: showRegulation.nonHTMLContent.replaceAll('\r\n', '<br>') }}></div>
                </DialogBody>
            </Dialog>
        </>
    )
}

export default Regulations