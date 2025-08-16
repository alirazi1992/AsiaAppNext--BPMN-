'use client'
import React, { useEffect, useState } from 'react'
import { Alert, CardBody, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from '@material-tailwind/react'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { GetSurveyResponse, Response, SurveyStatesModel } from '@/app/models/VesselsModel/statusTypes';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import TableSkeleton from '../../shared/TableSkeleton';
import IconRudder from '../../shared/iconRudder';
import b64toBlob from '@/app/Utils/Automation/convertImageToBlob';
import Image from 'next/image';

type Surveys = {
    surveysState: GetSurveyResponse[],
    loading: boolean,
    activateTab: string
}

const SurveysComponent = (props: any) => {
    const { AxiosRequest } = useAxios()
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    let surveys = {
        surveysState: [],
        loading: true,
        activateTab: "Statutory"
    }
    const [componentState, setComponentState] = useState<Surveys>(surveys)

    useEffect(() => {
        const GetSurveysClassification = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetSurveys?asiaCode=${props.props}`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<GetSurveyResponse[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                setComponentState((state) => ({ ...state, loading: false }))
                if (response.data.status == true && response.data.data) {
                    setComponentState((state) => ({
                        ...state, surveysState: response.data.data
                    }))
                }
            }
        }

        GetSurveysClassification()
    }, [props.props])


    return (
        <CardBody className='mx-auto relative rounded-lg overflow-auto p-0 font-[EnBold]'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Alert
                icon={<NotInterestedIcon fontSize='small' sx={{ color: !themeMode ||themeMode?.stateMode ? '#fff3cd' : '#856404' }} />}
                className={!themeMode ||themeMode?.stateMode ? "rounded-md border-l-4 border-[#fff3cd] bg-[#fff3cd]/30 text-sm font-thin text-[#fff3cd] " : "rounded-md border-l-4 border-[#fff3cd] bg-[#fff3cd]/50 text-sm font-thin text-[#856404]"}
            >
                <Typography variant='paragraph' className='text-sm'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Note! Please note that only latest class surveys is shown in vessel class/survey status.</Typography>
            </Alert>
            <Tabs value="Statutory" className="my-3 h-full">
                <TabsHeader
                    dir='rtl'
                    className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} w-full md:w-[400px] flex flex-col md:flex-row md:justify-end`}
                    indicatorProps={{
                        style: {
                            background: color?.color,
                        },
                        className: `shadow !text-gray-900`,
                    }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                    <Tab className='min-w-max surveyTab' value="Classification" onClick={() => setComponentState((state) => ({ ...state, activateTab: "Classification" }))}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        <Typography variant='h6' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] font-thin`} style={{ color: `${componentState.activateTab == "Classification" ? "white" : ""}` }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Classification Surveys</Typography>
                    </Tab>
                    <Tab className='min-w-max surveyTab' value="Statutory" onClick={() => setComponentState((state) => ({ ...state, activateTab: "Statutory" }))}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        <Typography variant='h6' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] font-thin`} style={{ color: `${componentState.activateTab == "Statutory" ? "white" : ""}` }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Statutory Surveys</Typography>
                    </Tab>
                </TabsHeader>
                <TabsBody className='m-0 p-0 w-full'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <TabPanel value="Statutory" className='w-full m-0 p-0'>
                        <CardBody className='mx-auto relative rounded-lg overflow-auto p-0 mt-3 h-[60vh]'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                            {componentState.loading == false ?
                                <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[58vh] `}>
                                    <thead>
                                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Survey Name
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Last Survey
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Due Date
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Window Start
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Window End
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Postponed
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Status
                                                </Typography>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className={`statusTable font-[EnUltraLight] divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                                        {
                                            componentState.surveysState.length > 0 && componentState.surveysState.find((item) => item.categoryName == 'Statutory Surveys')?.surveyStates.map((survey: SurveyStatesModel, index: number) => {
                                                return (
                                                    <tr key={"Statutory" + index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`} >
                                                        <td style={{ width: "20%", minWidth: '200px' }} className='p-1 font-[Ira]'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.surveyName}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: "10%", minWidth: '60px' }} className='p-1'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-[EnUltraLight] whitespace-nowrap text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.lastSurvey}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: "10%", minWidth: '60px' }} className='p-1'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-[EnUltraLight] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.dueDate}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: "10%", minWidth: '60px' }} className='p-1'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-[EnUltraLight] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.winStart}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: "10%", minWidth: '60px' }} className='p-1'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-[EnUltraLight] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.winEnd}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: "10%", minWidth: '60px' }} className='p-1'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-[EnUltraLight] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.postPoned}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: '20%', minWidth: '80px' }} className='p-1'>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnUltraLight] text-[13px] mx-2 flex justify-center items-center`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.status.trim() == 'Valid' ? <IconRudder color='#04ca6a' /> : survey.status.trim() == 'Within Window Last Month' ? < IconRudder color='#e98f11' /> : survey.status.trim() == 'Within Window' ? < IconRudder color='#f5d32d' /> : survey.status.trim() == 'Expired' && < IconRudder color='#c40a0a' />}
                                                                <span className='mx-2'>{survey.status.trim() == 'Within Window Last Month' ? 'Within Window' : survey.status.trim()}</span>
                                                            </Typography>
                                                        </td>
                                                    </tr>)
                                            })}

                                    </tbody>
                                </table> : <TableSkeleton />}
                        </CardBody>
                    </TabPanel>
                    <TabPanel value="Classification" className='w-full m-0 p-0'>
                        <CardBody className='mx-auto relative rounded-lg overflow-auto p-0 mt-3 h-[60vh]'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                            {componentState.loading == false ?
                                <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[58vh] `}>
                                    <thead>
                                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Survey Name
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Last Survey
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Due Date
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Window Start
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Window End
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Postponed
                                                </Typography>
                                            </th>
                                            <th style={{ borderBottomColor: color?.color }}
                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    Status
                                                </Typography>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className={`statusTable font-[EnUltraLight] divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                                        {
                                            componentState.surveysState.length > 0 && componentState.surveysState.find((item) => item.categoryName == 'Classification Surveys')?.surveyStates.map((survey: SurveyStatesModel, index: number) => {
                                                return (
                                                    <tr key={'classification' + index}
                                                        className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                                        <td style={{ width: "20%", minWidth: '200px' }} className='p-1'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-[EnUltraLight] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.surveyName}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: "10%", minWidth: '60px' }} className='p-1'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-[EnUltraLight] whitespace-nowrap text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.lastSurvey}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: "10%", minWidth: '60px' }} className='p-1'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-[EnUltraLight] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.dueDate}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: "10%", minWidth: '60px' }} className='p-1'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-[EnUltraLight] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.winStart}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: "10%", minWidth: '60px' }} className='p-1'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-[EnUltraLight] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.winEnd}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: "10%", minWidth: '60px' }} className='p-1'>
                                                            <Typography
                                                                style={{ fontFamily: 'EnUltraLight' }}
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`font-[EnUltraLight] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.postPoned}
                                                            </Typography>
                                                        </td>
                                                        <td style={{ width: '20%', minWidth: '80px' }} className='p-1'>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnUltraLight] text-[13px] mx-2 flex justify-center items-center`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                {survey.status.trim() == 'Valid' ? <IconRudder color='#04ca6a' /> : survey.status.trim() == 'Within Window Last Month' ? < IconRudder color='#e98f11' /> : survey.status.trim() == 'Within Window' ? < IconRudder color='#f5d32d' /> : survey.status.trim() == 'Expired' && < IconRudder color='#c40a0a' />}
                                                                <span className='mx-2'>{survey.status.trim() == 'Within Window Last Month' ? 'Within Window' : survey.status.trim()}</span>
                                                            </Typography>
                                                        </td>

                                                    </tr>
                                                )


                                            })
                                        }
                                    </tbody>
                                </table> : <TableSkeleton />}
                        </CardBody>
                    </TabPanel>
                </TabsBody>
            </Tabs>

        </CardBody>
    )
}

export default SurveysComponent