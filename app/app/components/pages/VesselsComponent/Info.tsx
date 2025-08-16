'use client';
import { Button, Card, CardBody, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip, Typography } from '@material-tailwind/react'
import React, { useEffect, useRef, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { useSearchParams } from 'next/navigation';
import Certificates from './Certificates';
import SurveysComponent from './Surveys';
import Memoranda from './Memoranda';
import CMSComponent from './CMS';
import LiftingAppliances from './lifftingApplication';
import BallastTanks from './BallastTanks';
import CargoHolds from './CargoHolds';
import VesselInfo from './vesselInfo';
import AutomatedInstallationComp from './AutomatedInstallation';
import Regulations from './Regulations';
import { GeneralInfoModel, GetVesselsInfoResponse, MainEngineModel, mainGeneratorModel, OwnerInfoModel, Response } from '@/app/models/VesselsModel/statusTypes';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import PrintIcon from '@mui/icons-material/Print';
import b64toBlob from '@/app/Utils/Automation/convertImageToBlob';
import Swal from 'sweetalert2';
import ResLoading from '@/app/components/shared/loadingResponse';

const Info = () => {
    const { AxiosRequest } = useAxios()
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [activeTab, setActiveTab] = useState<string>('Vessel Information')
    const [vesselInfo, setVesselInfo] = useState<GeneralInfoModel | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const resisterAsiaCode = useRef<string | null>(searchParams.get('asiacode'));


    const GetVesselInfo = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetVesselInfo?asiaCode=${resisterAsiaCode.current}`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GeneralInfoModel>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            if (response.data.status && response.data.data != null) {
                setVesselInfo(response.data.data)
            }
        }
    }

    const GetStatusPdf = async () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Survey Status",
            text: "آیا از دانلود اطمینان دارید؟",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "yes!",
            cancelButtonColor: "#d33",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)
                let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetStatusPdf?asiaCode=${resisterAsiaCode.current}`;
                let method = 'get';
                let data = {};
                let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true });
                if (response) {
                    setLoading(false)
                    if (response.data.status && response.data.data != '') {
                        let blob = b64toBlob({ b64Data: response.data.data, contentType: 'application/pdf', sliceSize: 512 });
                        var fileDownload = require('js-file-download');
                        fileDownload(blob, 'statusReport.pdf');
                    } else {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Survey Status",
                            text: response.data.message,
                            icon: response.data.status ? 'warning' : 'error',
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK",
                        })
                    }

                }

            }
        })
    }
    useEffect(() => {
        GetVesselInfo()
    }, [])

    const Arr = [
        { componentName: 'Vessel Information', component: <VesselInfo regNo={resisterAsiaCode.current!} props={vesselInfo!} /> },
        { componentName: 'Certificates', component: <Certificates props={resisterAsiaCode.current} /> },
        { componentName: 'Surveys', component: <SurveysComponent props={resisterAsiaCode.current} /> },
        { componentName: 'Automated Installations', component: <AutomatedInstallationComp props={resisterAsiaCode.current} /> },
        { componentName: 'Memoranda', component: <Memoranda props={resisterAsiaCode.current} /> },
        { componentName: 'CMS', component: <CMSComponent props={resisterAsiaCode.current} /> },
        { componentName: 'Lifting Appliances', component: <LiftingAppliances props={resisterAsiaCode.current} /> },
        { componentName: 'Ballast Tanks', component: <BallastTanks props={resisterAsiaCode.current} /> },
        { componentName: 'Cargo Holds', component: <CargoHolds props={resisterAsiaCode.current} /> },
        { componentName: 'Regulation', component: <Regulations props={resisterAsiaCode.current} /> }]
    return (
        <>
            {loading == true && <ResLoading />}
            <CardBody className='w-[98%] h-full mx-auto relative rounded-lg overflow-auto p-0 '  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <section className='vesselInfo my-2'>
                    <div className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} h-[50px] w-full p-2 cursor-pointer flex items-center justify-between rounded-t-lg `}>
                        <Typography className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} px-3 AccordionTiltle text-md`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                            Registration Information
                        </Typography>
                        <Tooltip content="Survey Status" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                            <Button
                                onClick={() => GetStatusPdf()}
                                size="sm"
                                className="p-1 mx-1"
                                style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                <PrintIcon
                                    fontSize='small'
                                    className='p-1'
                                    onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                    onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                            </Button>
                        </Tooltip>

                    </div>
                    <section className='registerVesselInfo grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 my-2 mx-auto p-4'>
                        <h6 style={{ color: color?.color, fontSize: '13px' }} className='flex justify-start'>Vessel Name: <p className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{vesselInfo?.vesselName}</p></h6>
                        <h6 style={{ color: color?.color, fontSize: '13px' }} className='flex justify-start'>Register No.: <p className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{vesselInfo?.numberOfRegistry}</p></h6>
                        <h6 style={{ color: color?.color, fontSize: '13px' }} className='flex justify-start'>Asia Code: <p className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{vesselInfo?.asiaCode}</p></h6>
                        <h6 style={{ color: color?.color, fontSize: '13px' }} className='flex justify-start'>MMSI No.: <p className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{vesselInfo?.mmsI_No}</p></h6>
                        <h6 style={{ color: color?.color, fontSize: '13px' }} className='flex justify-start'>Temporary Register No.: <p className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{vesselInfo?.temporaryNumberOfRegistry}</p></h6>
                        <h6 style={{ color: color?.color, fontSize: '13px' }} className='flex justify-start'>Previous Name(s): <p className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{vesselInfo?.previuse_Name}</p></h6>
                        <h6 style={{ color: color?.color, fontSize: '13px' }} className='flex justify-start'>Port Of Registry: <p className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{vesselInfo?.portOfRegistry}</p></h6>
                        <h6 style={{ color: color?.color, fontSize: '13px' }} className='flex justify-start'>IMO No.: <p className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{vesselInfo?.imO_No}</p></h6>
                        <h6 style={{ color: color?.color, fontSize: '13px' }} className='flex justify-start'>Callsign: <p className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{vesselInfo?.callSign}</p></h6>
                        <h6 style={{ color: color?.color, fontSize: '13px' }} className='flex justify-start'>Min. Safe Manning: <p className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{vesselInfo?.minSafeManning}</p></h6>
                    </section>
                </section>
                <section className='w-full flex flex-col md:flex-row md:justify-between'>
                    <Tabs orientation="vertical" className=' w-full flex flex-col gap-x-3 justify-start lg:flex-row lg:justify-around lg:items-start' value="Vessel Information" >
                        <TabsBody className='my-2 hidden lg:block'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {Arr.map((val, index) => (
                                <TabPanel key={'value' + index} value={val.componentName} className="p-0 w-full">
                                    {val.component}
                                </TabPanel>
                            ))}
                        </TabsBody>
                        <TabsHeader className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} md:h-[55vh]`}
                        indicatorProps={{
                            style: {
                                background: color?.color,
                                color: "white",
                            },
                            className: `shadow !text-gray-900 flex flex-col p-1 `,
                        }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {Arr.map((val, index) => (
                                <Tab className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} whitespace-nowrap`} style={{ color: activeTab == val.componentName ? 'white' : '' }} onClick={() => setActiveTab(val.componentName)} key={"Arr" + index} value={val.componentName}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    {val.componentName}
                                </Tab>
                            ))}
                        </TabsHeader>
                        <TabsBody className='my-2 block lg:hidden'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {Arr.map((val, index) => (
                                <TabPanel key={'value' + index} value={val.componentName} className="p-0 w-full">
                                    {val.component}
                                </TabPanel>
                            ))}
                        </TabsBody>
                    </Tabs>
                </section>
            </CardBody>
        </>
    )
}

export default Info