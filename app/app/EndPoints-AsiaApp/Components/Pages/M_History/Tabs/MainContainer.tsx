'use client';
import React, { createContext, useRef, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand'
import { CardBody } from '@material-tailwind/react';
import useStore from '@/app/hooks/useStore';
import HistoryList from './HistoryList';
import SearchHistory from './SearchHistory';
import { SearchTabModels } from '@/app/Domain/M_History/Tabs';
import { LoadingModel } from '@/app/Domain/shared';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import Loading from '@/app/components/shared/loadingResponse';
import CustomizedPagination from '../../../Shared/Pagination';

export const HistorySerachContext = createContext<any>(null)
const MainContainer = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const [state, setState] = useState<SearchTabModels | null>(null)
    const [loadings, setLoadings] = useState<LoadingModel>(loading)
    const [page, setPage] = useState<number>(1)
    const SearchRef = useRef<{ OnSubmit: (num: number) => void }>(null)

    return (
        <HistorySerachContext.Provider value={{ state, setState, loadings, setLoadings, setPage }}>
            {loadings.response && <Loading />}
            <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} rounded-lg shadow-md  w-[98%] my-3 mx-auto`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <SearchHistory ref={SearchRef} />
            </CardBody>
            <HistoryList />
            {state && state?.totalCount > 0 && <CustomizedPagination page={page} className={loadings.table ? 'hidden invisible' : 'flex visible'} count={Math.ceil(state.totalCount / 10)} handlePage={(page) => { if (SearchRef.current) { setPage(page); SearchRef.current.OnSubmit(page) } }} />}
        </HistorySerachContext.Provider>
    )
}

export default MainContainer