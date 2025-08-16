import useAxios from '@/app/hooks/useAxios';
import { GetAutomatedInstallationResponse, Response } from '@/app/models/VesselsModel/statusTypes';
import { Alert, CardBody, Typography } from '@material-tailwind/react';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';


const AutomatedInstallationComp = (props: any) => {
    const { AxiosRequest } = useAxios()
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)

    let AutomatedInstallation = {
        automatedInstallation: '',
        loading: true
    }

    const [data, setData] = useState(AutomatedInstallation)
    const [html, setHtml] = useState<string>('')



    useEffect(() => {
        const GetAutomatedInstallation = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/Status/GetInformation/GetAutomatedInstallation?asiaCode=${props.props}`;
            let method = 'get'
            let data = {};
            let response: AxiosResponse<Response<GetAutomatedInstallationResponse>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                setData((state) => ({ ...state, loading: false }))
                if (
                    response.data.status == true && response.data.data != null
                ) {
                    setData((state) => ({ ...state, automatedInstallation: response.data.data.automatedInstallation }))
                    setHtml(response.data.data.automatedInstallation.replaceAll('\r\n', '<br>'))
                }
            }
        }
        GetAutomatedInstallation()
    }, [props.props])



    return (
        <CardBody className=' EnFont mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Alert
                icon={<NotInterestedIcon fontSize='small' sx={{ color: !themeMode ||themeMode?.stateMode ? '#fff3cd' : '#856404' }} />}
                className={!themeMode ||themeMode?.stateMode ? "rounded-md border-l-4 border-[#fff3cd] bg-[#fff3cd]/30 text-sm font-thin text-[#fff3cd] " : "rounded-md border-l-4 border-[#fff3cd] bg-[#fff3cd]/50 text-sm font-thin text-[#856404]"}
            >
                <Typography variant='paragraph' className='text-sm'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Note! Please note that automated installations represented here is based on latest Asia Classification Society surveys of related equipments. On any incompatiblity or inconsistency do not hesitiate to contact your support expert.</Typography>
            </Alert>
            <CardBody className='EnFont mx-auto relative h-[65vh] rounded-lg overflow-auto p-0 mt-3'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <div className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} EnFont font-thin max-h-[62vh]`} dangerouslySetInnerHTML={{ __html: html }}></div>
            </CardBody>
        </CardBody>
    )
}

export default AutomatedInstallationComp