'use client'
import React, { useRef, useState } from 'react';
import { FilterResumeModel, GetSearchResumeModel, StateModel } from '@/app/Domain/M_HumanRecourse/ManageResume';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import Filter from './Filter';
import ButtonComponent from '@/app/components/shared/ButtonComp';
import CustomizedPagination from '../../Shared/Pagination';
import { useList } from '@/app/Application-AsiaApp/M_HumanRecourse/fetchSearchResume';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import ResumeList from './ResumeList';
import { initialItems } from '@/app/Application-AsiaApp/Utils/M_HumanResource/data';
import Loading from '@/app/components/shared/loadingResponse';

export const ResumeContext = React.createContext<any>(null)

const MainContainer = () => {
    const { fetchSearchedList } = useList()
    const FilterRef = useRef<{ handleOpen: () => void; handleClose: () => void }>(null);
    const FormRef = useRef<{ reset: () => void }>(null);
    const [state, setState] = useState<StateModel>({ branches: undefined, vacancies: undefined, result: null, items: initialItems })
    const [loadings, setLoadings] = useState(loading)

    const OpenDrawer = () => {
        if (FilterRef.current) {
            FilterRef.current.handleOpen()
        }
    }

    const SearchResume = async (list: FilterResumeModel = initialItems, page: number = 1) => {
        setState((prev) => ({ ...prev, result: null }))
        setLoadings(prev => ({ ...prev, table: true }))
        const res = await fetchSearchedList(list, page).then((result: GetSearchResumeModel | string | undefined) => {
            if (result) {
                setLoadings(prev => ({ ...prev, table: false }))
                if (typeof result == 'object' && result !== null) {
                    setState((prev) => ({ ...prev, result: result }))
                }
                if (FilterRef.current) {
                    FilterRef.current.handleClose()
                }
                if (FormRef.current) {
                    FormRef.current.reset()
                }
            }
        })
    }

    return (
        <>
            {loading.response == true && <Loading />}
            <ResumeContext.Provider value={{ setLoadings, state, setState, SearchResume, FormRef }
            }>
                <MyCustomComponent>
                    <>
                        <ButtonComponent onClick={() => OpenDrawer()} >فیلتر ها</ButtonComponent>
                        <Filter ref={FilterRef} />
                        {loadings.table == false ? <ResumeList /> : <TableSkeleton />}
                        {state.result && state.result.totalCount > 10 && <CustomizedPagination className={loadings.table == false ? ' flex visible ' : ' hidden invisible '} count={Math.ceil(Number(state.result?.totalCount) / Number(10))} handlePage={(page) => SearchResume(state.items, page)} />}
                    </>
                </MyCustomComponent>
            </ResumeContext.Provider >
        </>
    )
}

export default MainContainer