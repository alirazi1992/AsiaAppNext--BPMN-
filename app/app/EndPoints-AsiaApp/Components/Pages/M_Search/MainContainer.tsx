'use client'
import React, { useRef, useState } from 'react';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import Filter from './Filter';
import SearchedList from './SearchedList';
import ButtonComponent from '@/app/components/shared/ButtonComp';
import { SearchDocsResultModel, SearchFilterModel } from '@/app/Domain/M_Search/search';
import CustomizedPagination from '../../Shared/Pagination';
import { initializeItem } from '@/app/Application-AsiaApp/Utils/M_Search/data';
import { useList } from '@/app/Application-AsiaApp/M_Search/fetchSearchesList';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';


export const SearchContext = React.createContext<any>(null)

const MainContainer = () => {
    const FilterRef = useRef<{ handleOpen: () => void; handleClose: () => void }>(null);
    const FormRef = useRef<{ OnSubmit: (page: number) => void }>(null);
    const [result, setResult] = useState<SearchDocsResultModel[]>([])
    const [loadings, setLoadings] = useState(loading)
    const [page, setPage] = useState<number>(1)

    const OpenDrawer = () => {
        if (FilterRef.current) {
            FilterRef.current.handleOpen()
        }
    }

    return (
        <SearchContext.Provider value={{ result, setResult, FormRef, setPage, setLoadings, FilterRef }}>
            <MyCustomComponent>
                <>
                    <ButtonComponent onClick={() => OpenDrawer()} >فیلتر ها</ButtonComponent>
                    <Filter ref={FilterRef} />
                    {loadings.table == false ? <SearchedList /> : <TableSkeleton />}
                    {result.length > 0 && <CustomizedPagination page={page} className={loadings.table == false ? ' flex visible ' : ' hidden invisible '} count={Math.ceil(Number(result[0]?.totalCount) / Number(10))} handlePage={(page) => { if (FormRef.current) { setPage(page); FormRef.current.OnSubmit(page) } }} />}
                </>
            </MyCustomComponent>
        </SearchContext.Provider>
    )
}

export default MainContainer