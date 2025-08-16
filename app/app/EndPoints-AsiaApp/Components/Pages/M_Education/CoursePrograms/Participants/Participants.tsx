'use client'
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip } from '@material-tailwind/react'
import React, { createContext, useEffect, useRef, useState } from 'react'
import Diversity3Icon from '@mui/icons-material/Diversity3';
import Groups3Icon from '@mui/icons-material/Groups3';
import SearchIcon from '@mui/icons-material/Search';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import AcsParticipants from './AcsParticipants';
import OtherParticipants from './OtherParticipants';
import SearchParticipants from './SearchParticipants';
import { EducationalCourseProgramsModel } from '@/app/Domain/M_Education/Programs';
import ParticipantsTable from './ParticipantsTable';
import { useProgramParticipants } from '@/app/Application-AsiaApp/M_Education/fetchParticipants';
import { GetProgramParticipantsModel, ParticipantModel, ParticipantsModel, ProgramParticipantsModel, SearchParticipantsModel } from '@/app/Domain/M_Education/Participant';
import { initializeStateParticipants } from '@/app/Application-AsiaApp/Utils/M_Education.ts/data';
import { InsertingProgramParticipant } from '@/app/Application-AsiaApp/M_Education/InsertCreatedProgramParticipant';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import { IssueProgramCertificarte } from '@/app/Application-AsiaApp/M_Education/IssueEducationProgramCertificate';
import CustomizedPagination from '@/app/EndPoints-AsiaApp/Components/Shared/Pagination';
import { RemovingProgramParticipants } from '@/app/Application-AsiaApp/M_Education/RemoveProgramParticipant';
import Loading from '@/app/components/shared/loadingResponse';
import TableSkeleton from '@/app/components/shared/TableSkeleton';

type Test = {
    program: EducationalCourseProgramsModel | undefined
}
export const ParticipantContext = createContext<any>(null)
const ComponentParticipant: React.FC<Test> = ({ program }) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [state, setState] = useState(initializeStateParticipants)
    const [loadings, setLoadings] = useState(loading);
    const [activate, setActivate] = useState<string>('Acs');
    let participants: GetProgramParticipantsModel | undefined;
    const { fetchParticipants } = useProgramParticipants()
    const { AddParticipant } = InsertingProgramParticipant()
    const { IssueParticipant } = IssueProgramCertificarte()
    const { RemoveParticipant } = RemovingProgramParticipants()

    const AcsRef = useRef<{ customMethod: () => void }>(null);
    const OtherRef = useRef<{ ResetMethod: () => void }>(null);

    // AcsRef.current?.
    useEffect(() => {
        const InitializeProgramParticipants = async () => {
            setLoadings((state) => ({ ...state, table: true }))
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const res = await fetchParticipants({ ...state.searchKey, courseProgramId: program?.id! }, 1).then((result) => {
                if (result) {
                    setLoadings((state) => ({ ...state, table: false }))
                    if (typeof result == 'object') {
                        setState(prev => ({ ...prev, participants: result?.participants, totalCount: Math.ceil(Number(result?.participants) / 10) }))
                    }
                }
            })
        }
        InitializeProgramParticipants()
    }, [])

    const handlerAddParticipants = async (data: ParticipantModel[]) => {
        setLoadings((state) => ({ ...state, response: true }))
        let options: ProgramParticipantsModel[] | undefined;
        const res = await AddParticipant(data).then((result) => {
            if (result) {
                setLoadings((state) => ({ ...state, response: false }));
                if (Array.isArray(result)) {
                    (options = result!.map((item, index) => ({
                        name: item.name,
                        faName: item.faName,
                        nationalCode: item.nationalCode,
                        certNo: null,
                        attachmentId: null,
                        personetId: data[index].personnelId,
                        creationDate: item.creationDate,
                        id: item.id
                    })))
                    if (AcsRef.current && activate == 'Acs') {
                        AcsRef.current.customMethod();
                    }
                    if (OtherRef.current && activate == 'other') {
                        OtherRef.current.ResetMethod();
                    }
                    setState((prev) => ({ ...prev, participants: prev.participants!.length > 0 ? [...prev.participants!, ...options!] : options! }))
                }
            }
        })
    }
    const handleGetSearchItem = async (data: ParticipantsModel) => {
        const res = await fetchParticipants({ courseProgramId: data.courseProgramId, faName: data.faName ?? '', name: data.name ?? '', nationalCode: data.nationalCode ?? '' }, 1).then((result) => {
            if (result) {
                if (typeof result == 'object')
                    setState(prev => ({ ...prev, participants: result?.participants, totalCount: Math.ceil(Number(result?.participants) / 10) }))
            }
        })
    }

    const handleIssueCertificate = async (data: number) => {
        setLoadings((state) => ({ ...state, response: true }))
        let option = state.participants!.find((item) => item.id == data)!
        let index = state.participants!.indexOf(option)
        setLoadings((state) => ({ ...state, response: true }))
        const res = await IssueParticipant(data).then((res) => {
            if (res && typeof res == 'number') {
                setLoadings((state) => ({ ...state, response: false }))
                index != -1 && state.participants?.splice(index, 1, { ...option, certNo: res })
            }
        })
    }

    const handleGetPageNo = async (page: number) => {
        const res = await fetchParticipants({ ...state.searchKey }, page).then((result) => {
            if (result) {
                if (typeof result == 'object') {
                    setState((prev) => ({ ...prev, participants: participants!.participants }));
                }
            }
        })
    }

    const handleRemoveParticipants = async (id: number) => {
        let index = state.participants!.indexOf(state.participants!.find((item) => item.id == id)!)
        setLoadings((state) => ({ ...state, response: true }))
        const res = await RemoveParticipant(id).then((res) => {
            setLoadings((state) => ({ ...state, response: false })),
                res == true && (index != -1 && state.participants?.splice(index, 1))

        })
    }

    return (
        <ParticipantContext.Provider value={{ state, setState }}>
            {loadings.response == true && <Loading />}
            <Tabs dir="ltr" value="Acs" className="w-full mb-3 h-auto">
                <TabsHeader
                    className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} max-w-[160px]`}
                    indicatorProps={{
                        style: {
                            background: color?.color,
                            color: "white",
                        },
                        className: `shadow `,
                    }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                    <Tab onClick={() => {
                        setActivate('Acs');
                    }} value="Acs" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <Tooltip className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}  z-[1000000]`} content='Acs participants' placement="top">
                            <Diversity3Icon fontSize='small' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activate == "Acs" ? "white" : ""}` }} />
                        </Tooltip>
                    </Tab>
                    <Tab onClick={() => {
                        setActivate('other');
                    }} value="other" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <Tooltip className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}  z-[1000000]`} content='other participants' placement="top">
                            < Groups3Icon fontSize='small' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activate == "other" ? "white" : ""}` }} />
                        </Tooltip>
                    </Tab>
                    <Tab onClick={() => {
                        setActivate('search');
                    }} value="search" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <Tooltip className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}  z-[1000000]`} content='search participants' placement="top">
                            <SearchIcon fontSize='small' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activate == "search" ? "white" : ""}` }} />
                        </Tooltip>
                    </Tab>
                </TabsHeader>
                <TabsBody
                    animate={{
                        initial: { y: 5 },
                        mount: { y: 0 },
                        unmount: { y: 20 },
                    }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                    <TabPanel value="Acs">
                        <AcsParticipants ref={AcsRef} id={program?.id} onSubmit={handlerAddParticipants} />
                    </TabPanel>
                    <TabPanel value='other'>
                        <OtherParticipants ref={OtherRef} onSubmit={handlerAddParticipants} id={program?.id} />
                    </TabPanel>
                    <TabPanel value='search'>
                        <SearchParticipants onSubmit={handleGetSearchItem} id={program?.id} />
                    </TabPanel>
                    {loadings.table == false ? <ParticipantsTable RemoveParticipant={handleRemoveParticipants} CertificatePdf={(data: number) => setState(prev => ({ ...prev, certNo: data }))} IssueCerificate={handleIssueCertificate} data={activate == 'Acs' ? state.participants?.filter(item => item.personetId != null) : activate == 'other' ? state.participants?.filter(item => item.personetId == null) : state.participants} /> : <TableSkeleton />}
                    <CustomizedPagination count={state.totalCount} handlePage={handleGetPageNo} />
                </TabsBody>
            </Tabs >
        </ParticipantContext.Provider>
    )
}

export default ComponentParticipant