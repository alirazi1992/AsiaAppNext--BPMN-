'use client';
import React, { createContext, useRef, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand'
import { CardBody, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip } from '@material-tailwind/react';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand'
import { SearchTabModels } from '@/app/Domain/M_History/Tabs';
import { LoadingModel } from '@/app/Domain/shared';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import Loading from '@/app/components/shared/loadingGetData';
import CustomizedPagination from '../../../Shared/Pagination';
import ArchiveSearch from './ArchiveSearch';
import ArchiveList from './ArchiveList';
import { SearchArchiveModels } from '@/app/Domain/M_History/Archive';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddHArchive from './AddArchive';
import useLoginUserInfo from '@/app/zustandData/useLoginUserInfo';

export const ArchiveSerachContext = createContext<any>(null)
const ArchiveMainContainer = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [state, setState] = useState<SearchArchiveModels | null>(null)
    const [loadings, setLoadings] = useState<LoadingModel>(loading)
    const SearchRef = useRef<{ OnSubmit: (num: number) => void }>(null)
    const [activate, setActivate] = useState<string>('Search')
    const CurrentUser = useLoginUserInfo.getState();
    const [page, setPage] = useState<number>(1)
    return (
        <ArchiveSerachContext.Provider value={{ state, setState, loadings, setLoadings, setPage }}>
            {loadings.response == true && <Loading />}
            <Tabs dir="ltr" value="Search" className="w-full h-auto ">

                <TabsHeader
                    className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} m-2 bg-gray-600 max-w-[80px] `}
                    indicatorProps={{
                        style: {
                            background: color?.color,
                            color: "white",
                        },
                        className: `shadow `,
                    }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
                    {CurrentUser && CurrentUser.userInfo && CurrentUser.userInfo.actors.some((actor: any) => actor.claims.some((claim: any) => (claim.key == "History" && claim.value == "HArchiveAdd"))) &&
                        <Tab onClick={() => {
                            setActivate('Add');
                        }} value="Add" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <Tooltip className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}  z-[1000000]`} content='Add History Archive' placement="top">
                                <AddCircleOutlineIcon fontSize='small' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activate == "Add" ? "white" : ""}` }} />
                            </Tooltip>
                        </Tab>}
                    <Tab onClick={() => {
                        setActivate('Search');
                    }} value="Search" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <Tooltip className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}  z-[1000000]`} content='Search History Archive' placement="top">
                            < SearchIcon fontSize='small' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activate == "Search" ? "white" : ""}` }} />
                        </Tooltip>
                    </Tab>
                </TabsHeader>
                <TabsBody
                    animate={{
                        initial: { x: 50 },
                        mount: { x: 0 },
                        unmount: { x: 140 },
                    }} className='min-h-screen' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                    {CurrentUser && CurrentUser.userInfo && CurrentUser.userInfo.actors.some((actor: any) => actor.claims.some((claim: any) => (claim.key == "History" && claim.value == "HArchiveAdd"))) && <TabPanel value="Add" >
                        <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} shadow-md rounded-lg w-[98%] my-3 mx-auto`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <AddHArchive />
                        </CardBody>
                    </TabPanel>}
                    <TabPanel value='Search' >
                        <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} shadow-md rounded-lg w-[98%] my-3 mx-auto`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <ArchiveSearch ref={SearchRef} />
                        </CardBody>
                        <ArchiveList />
                        {state && state?.totalCount > 0 && <CustomizedPagination page={page} className={loadings.table ? 'hidden invisible' : 'flex visible'} count={Math.ceil(state.totalCount / 10)} handlePage={(page) => { if (SearchRef.current) { setPage(page); SearchRef.current.OnSubmit(page) } }} />}
                    </TabPanel>
                </TabsBody>
            </Tabs >

        </ArchiveSerachContext.Provider >
    )
}

export default ArchiveMainContainer

