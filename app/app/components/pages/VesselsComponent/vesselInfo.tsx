'use client';
import { Accordion, AccordionBody, AccordionHeader, CardBody, Typography } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
// icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { GeneralInfoModel, MainEngineModel, mainGeneratorModel, OwnerInfoModel, Response } from '@/app/models/VesselsModel/statusTypes';
import useAxios from '@/app/hooks/useAxios';
import { AxiosResponse } from 'axios';
type VesselMoreInfoType = {
    ownerInfo: OwnerInfoModel | null,
    mainGenerator: mainGeneratorModel[],
    mainEngine: MainEngineModel[],
}
type PropsModel = {
    props: GeneralInfoModel,
    regNo: string
}

const VesselInfo = (props: PropsModel) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [open, setOpen] = React.useState(0);
    const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

    let vesselMoreInfo = {
        ownerInfo: null,
        mainGenerator: [],
        mainEngine: []
    }

    const [moreInfo, setMoreInfo] = useState<VesselMoreInfoType>(vesselMoreInfo)
    const { AxiosRequest } = useAxios()
    useEffect(() => {
        const GetOwnerInfo = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetOwnerInfo?asiaCode=${props.regNo}`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<OwnerInfoModel>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data != null) {
                    setMoreInfo((state) => ({ ...state, ownerInfo: response.data.data }))
                } else {
                    setMoreInfo((state) => ({ ...state, ownerInfo: null }))
                }
            }
        }

        const GetMainEngine = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetMainEngines?asiaCode=${props.regNo}`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<MainEngineModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data.length > 0) {
                    setMoreInfo((state) => ({ ...state, mainEngine: response.data.data }))
                } else {
                    setMoreInfo((state) => ({ ...state, mainEngine: [] }))
                }
            }
        }
        const GetMainGenerators = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetMainGenerators?asiaCode=${props.regNo}`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<mainGeneratorModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data.length > 0) {
                    setMoreInfo((state) => ({ ...state, mainGenerator: response.data.data }))
                } else {
                    setMoreInfo((state) => ({ ...state, mainGenerator: [] }))
                }
            }
        }
        if (props.regNo != null || props.regNo != '') {
            GetOwnerInfo()
            GetMainGenerators()
            GetMainEngine()
        }
    }, [props.regNo])



    return (
        <CardBody className='mx-auto relative rounded-lg overflow-auto p-0 vesselInfo' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Accordion open={open === 1} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <div onClick={() => handleOpen(1)} className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} h-[50px] w-full py-2 cursor-pointer flex items-center justify-between`}>
                    <Typography className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} px-5 AccordionTiltle text-md`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        Technical Information
                    </Typography>
                    {open !== 1 ? <KeyboardArrowDownIcon
                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                        sx={{ margin: '0px 5px', color: color?.color }} />
                        : <KeyboardArrowUpIcon
                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            sx={{ margin: '0px 5px', color: color?.color }} />
                    }
                </div>
                <AccordionBody  >
                    <section className='registerVesselInfo grid grid-cols-1 md:grid-cols-2  gap-x-4 gap-y-3 my-2 mx-auto p-4'>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Ship type: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.vesselTypeMajor}-{props.props?.vesselTypeMinor}-{props.props?.vesselType}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Length: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.length}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Length Between Perpendiculars: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.lengthBetweenPerpendiculars}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Registered Length: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.registeredLength}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Gross Tonnage: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.gt}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Nat. Gross Tonnage: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.ngt}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Allowed Navigation Area: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.allowedNavigationArea}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Breadth: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.breadth}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Nat. Net Tonnage: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.nnt}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Full load Draught: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.fullLoadDraught}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Depth: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.depth}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Light Weight Draught: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.lightWeightDraught}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Dead Weight: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.deadWeight}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Operation Area: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.radioCertifiedToOperateArea}</p></h6>

                    </section>
                </AccordionBody>
            </Accordion>
            <Accordion open={open === 2} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <div onClick={() => handleOpen(2)} className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} h-[50px] w-full py-2 cursor-pointer flex items-center justify-between`}>
                    <Typography className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} px-5 AccordionTiltle text-md`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        Hull Information
                    </Typography>
                    {open !== 2 ? <KeyboardArrowDownIcon
                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                        sx={{ margin: '0px 5px', color: color?.color }} />
                        : <KeyboardArrowUpIcon
                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            sx={{ margin: '0px 5px', color: color?.color }} />
                    }
                </div>
                <AccordionBody >
                    <section className='registerVesselInfo grid grid-cols-1 md:grid-cols-2  gap-x-4 gap-y-3 my-2 mx-auto p-4'>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Hull Material: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.hullMaterial}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Hull No: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`}>{props.props?.hull_No}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Type of Deck: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.typeOfDeck}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Watertight Compartment Nos: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.watertightCompartmentCount}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Date Of Building Contract: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.dateOfBuildingContract}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Date Of Keel Laying: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.dateOfKeelLaying}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Date Of Delivery: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.dateOfDelivery}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Date Of Conversion Contract: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.dateOfConversionContract}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Date Of Conversion Commencement: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.dateOfConversionCommencment}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Date Of Conversion Completion: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.dateOfConversionCompletion}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Unforeseen Delay In Delivery: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.unforeseenDelayInDelivery}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Place Of Build: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.placeOfBuild}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Shipyard: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.shipyard}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Body/Craft Type: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.bodyType}</p></h6>
                    </section>
                </AccordionBody>
            </Accordion>
            <Accordion open={open === 3} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <div onClick={() => handleOpen(3)} className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} h-[50px] w-full py-2 cursor-pointer flex items-center justify-between`}>
                    <Typography className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} px-5 AccordionTiltle text-md`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        Machinery Information
                    </Typography>
                    {open !== 3 ? <KeyboardArrowDownIcon
                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                        sx={{ margin: '0px 5px', color: color?.color }} />
                        : <KeyboardArrowUpIcon
                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            sx={{ margin: '0px 5px', color: color?.color }} />
                    }
                </div>
                <AccordionBody >
                    <section className='registerVesselInfo grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 my-2 mx-auto p-4'>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Propelling type: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.propellingType}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Propeller: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{props.props?.propeller}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Speed: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`}>{props.props?.speed}</p></h6>
                    </section>
                    <Typography style={{ color: color?.color }} className={`px-4 text-md title`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        Main Propulsion
                    </Typography>
                    <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-1.5 px-4'>
                        {moreInfo.mainEngine.map((item: MainEngineModel, index: number) => {
                            return (
                                <section key={"mainGenerator" + index} className='registerVesselInfo grid gap-y-1.5 p-4'>
                                    <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} >{item?.manufacturer}-{item?.type}</p>
                                    <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} >{item?.ratedPower}-{item?.ratedSpeed}rpm-{item?.serialNo}</p>
                                    <h6 style={{ color: color?.color }} className='flex justify-start'>Location: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{item?.location}</p></h6>
                                    <h6 style={{ color: color?.color }} className='flex justify-start'>Nox Tech. Code 2008: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{item?.noxCode2008}</p></h6>
                                </section>
                            )
                        })
                        }
                    </section>
                    <Typography style={{ color: color?.color }} className={`px-4 text-md title`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        Main Generators
                    </Typography>
                    <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-1.5 px-4'>
                        {moreInfo.mainGenerator.map((item: mainGeneratorModel, index: number) => {
                            return (
                                <section key={"mainGenerator" + index} className='registerVesselInfo grid gap-y-1.5 p-4'>
                                    <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} >{item?.manufacturer}-{item?.type}</p>
                                    <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} >{item?.ratedPower}-{item?.ratedSpeed}-{item?.ratedSpeed}-{item?.serialNo}</p>
                                    <h6 style={{ color: color?.color }} className='flex justify-start'>location: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{item.location}</p></h6>
                                    <h6 style={{ color: color?.color }} className='flex justify-start'>Nox Tech. Code 2008: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{item?.noxCode2008}</p></h6>
                                </section>
                            )
                        })
                        }
                    </section>
                </AccordionBody>
            </Accordion>
            <Accordion open={open === 4} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}  >
                <div onClick={() => handleOpen(4)} className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} h-[50px] w-full py-2 cursor-pointer flex items-center justify-between`}>
                    <Typography className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} px-5 AccordionTiltle text-md`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        Registered Owner, Manager, Operator
                    </Typography>
                    {open !== 4 ? <KeyboardArrowDownIcon
                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                        sx={{ margin: '0px 5px', color: color?.color }} />
                        : <KeyboardArrowUpIcon
                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            sx={{ margin: '0px 5px', color: color?.color }} />
                    }
                </div>
                <AccordionBody >
                    <Typography style={{ color: color?.color }} className={`p-4 my-1 text-md title`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        Registered Owner
                    </Typography>
                    <section className='registerVesselInfo grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1.5 my-1 mx-auto px-4'>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Owner name: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`} >{moreInfo.ownerInfo?.regOwnerName}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Company number: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`}>{moreInfo.ownerInfo?.regOwnerCompanyNumber}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>IMO number: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`}>{moreInfo.ownerInfo?.regOwnerIMONumber}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Address: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`}>{moreInfo.ownerInfo?.regOwnerAddress}</p></h6>
                    </section>
                    <Typography style={{ color: color?.color }} className={`p-4 my-1 text-md title`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        Registered Manager (ISM)
                    </Typography>
                    <section className='registerVesselInfo grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1.5 mx-auto px-4'>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Manager name: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`}>{moreInfo.ownerInfo?.regISMName}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Company number: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`}>{moreInfo.ownerInfo?.regISMCompanyNumber}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>IMO number: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2`}>{moreInfo.ownerInfo?.regISMIMONumber}</p></h6>
                        <h6 style={{ color: color?.color }} className='flex justify-start'>Address: <p className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} mx-2 px-2`} >{moreInfo.ownerInfo?.regISMAddress}</p></h6>
                    </section>
                </AccordionBody>
            </Accordion>
        </CardBody >
    )
}

export default VesselInfo