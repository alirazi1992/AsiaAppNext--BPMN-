'use client';
import { CardBody, Tooltip } from '@material-tailwind/react';
import React, { useContext, useRef, useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from "@/app/hooks/useStore";
import { ActionButton, Icon, Td, Th } from '../../Shared/TableComponent';
import moment from 'jalali-moment';
import { ResumeContext } from './MainContainer';
import { GetResumeFileModel, ResumeItemsModel, StateModel } from '@/app/Domain/M_HumanRecourse/ManageResume';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { InsertingselctedResume } from '@/app/Application-AsiaApp/M_HumanRecourse/InsertResumetoSelectedList';
import { Checkbox } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useFile } from '@/app/Application-AsiaApp/M_HumanRecourse/fetchResumeFile';
import { usePdf } from '@/app/Application-AsiaApp/M_HumanRecourse/fetchVolunteerResume';
import ViewResumePDF from './ViewResumePDF';
import ViewResume from './ViewResume';
import { LoadingModel } from '@/app/Domain/shared';

const ResumeList = () => {
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state)
    const { state, setState, setLoadings } = useContext(ResumeContext)
    const [fileResult, setFileResult] = useState<{
        result: GetResumeFileModel | null,
        data: string | null
    }>({
        result: null,
        data: null
    })

    const Ref = useRef<{ handleOpen: () => void }>(null);
    const ResumeRef = useRef<{ handleOpenResume: () => void }>(null);
    const { AddResumetoList } = InsertingselctedResume()
    const { fetchResumeFile } = useFile()
    const { fetchVolunteerResumePdf } = usePdf()

    const Addtofavarite = async (item: ResumeItemsModel) => {
        const res = await AddResumetoList(item).then((result) => {
            if (result) {
                let newList = [...state.result.resumeItems]
                let index = newList.findIndex(op => op.id === item.id)
                newList.splice(index, 1, { ...item, isSelected: item.isSelected })
                setState((prev: StateModel) => ({ ...prev, result: { ...state.result, resumeItems: newList } }))
            }
        })
    }

    const ViewResumeFile = async (id: number) => {
        setLoadings((state: LoadingModel) => ({ ...state, response: true }))
        const res = await fetchResumeFile(id).then((result) => {
            if (result) {
                setLoadings((state: LoadingModel) => ({ ...state, response: false }))
                if (typeof result == 'object') {
                    setFileResult({ result: result, data: null })
                    if (Ref && Ref.current) {
                        Ref.current.handleOpen()
                    }
                }
            }
        })
    }

    const ViewResumePdf = async (id: number) => {
        setLoadings((state: LoadingModel) => ({ ...state, response: true }))
        const res = await fetchVolunteerResumePdf(id).then((result) => {
            if (result) {
                setLoadings((state: LoadingModel) => ({ ...state, response: false }))
                setFileResult({ result: null, data: result })
                if (ResumeRef && ResumeRef.current) {
                    ResumeRef.current.handleOpenResume()
                }
            }
        })
    }

    return (
        <>{state.result && state.result.resumeItems.length > 0 && <CardBody className='w-[98%] lg:w-[96%] mx-auto relative rounded-lg overflow-auto p-0' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
            <table dir="rtl" className={`w-full relative text-center ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} `}>
                <thead>
                    <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                        <Th value={'#'} />
                        <Th value={'نشان کردن'} />
                        <Th value={'نام و نام خانوادگی'} />
                        <Th value={'کدملی'} />
                        <Th value={'زمینه شغلی'} />
                        <Th value={'شعبه محل خدمت'} />
                        <Th value={'تاریخ ارسال'} />
                        <Th value={'عملیات'} />
                    </tr>
                </thead>
                <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                    {state.result && state.result?.resumeItems.map((item: ResumeItemsModel, index: number) => {
                        return (
                            <tr key={index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                <Td style={{ width: '5%' }} value={Number(index) + Number(1)} />
                                <Td style={{ width: '3%', minWidth: '10px' }} value={<>
                                    <Checkbox sx={{
                                        color: color?.color, '&.Mui-checked': {
                                            color: color?.color
                                        }
                                    }}
                                        icon={item.isSelected ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                        checkedIcon={item.isSelected ? <BookmarkBorderIcon /> : <BookmarkIcon />}
                                        onChange={() => Addtofavarite(item)}
                                    />
                                </>} />
                                <Td style={{ width: '20%' }} value={item.faName + ' ' + item.faLastName} />
                                <Td style={{ width: '20%' }} value={item.nationalCode} />
                                <Td style={{ width: '10%' }} value={item.jobVacancyTitleFa} />
                                <Td style={{ width: '10%' }} value={item.jobBranchTitleFa} />
                                <Td style={{ width: '20%' }} value={moment(item.createDate).format('jYYYY-jMM-jDD')} />
                                <Td style={{ width: '7%' }} value={<>
                                    <div className='container-fluid mx-auto p-0.5'>
                                        <div className="flex flex-row justify-evenly">
                                            <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} placement='right' content='مشاهده رزومه'>
                                                <ActionButton
                                                    onClick={() => ViewResumeFile(item.id)}
                                                > <Icon Name={VisibilityIcon} />
                                                </ActionButton>
                                            </Tooltip>
                                            <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} placement='right' content='دانلود رزومه'>
                                                <ActionButton
                                                    onClick={() => ViewResumePdf(item.id)}
                                                > <Icon Name={ContactPageIcon} />
                                                </ActionButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </>} />
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </CardBody >}
            <ViewResume data={fileResult.result} ref={Ref} />
            <ViewResumePDF data={fileResult.data} ref={ResumeRef} />

        </>
    )
}
export default ResumeList; 