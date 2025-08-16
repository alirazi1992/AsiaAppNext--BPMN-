'use client'
import React, { useRef, useState } from 'react';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import Filter from './Filter';
import ButtonComponent from '@/app/components/shared/ButtonComp';
import CustomizedPagination from '../../Shared/Pagination';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import { useAuditLogs } from '@/app/Application-AsiaApp/M_Audit/fetchLogs';
import AuditList from './AuditList';
import { AuditItemsModel, GetLogsResultModel } from '@/app/Domain/M_Audit/logTable';
import { inializeAuditData } from '@/app/Application-AsiaApp/Utils/M_Audit/data';
import { SweetAlertResult } from 'sweetalert2';

type AuditContext = {
    result: GetLogsResultModel | undefined,
    setResult: (result: GetLogsResultModel | undefined) => void,
    item: AuditItemsModel,
    setItem: (item: AuditItemsModel) => void,
    GetLogs: (page?: number, data?: AuditItemsModel) => Promise<void>,
    FormRef: React.RefObject<{ reset: () => void }>
}
export const AuditContext = React.createContext<AuditContext>({
    result: undefined,
    setResult: () => { },
    item: inializeAuditData,
    setItem: () => { },
    GetLogs: async () => { },
    FormRef: React.createRef<{ reset: () => void }>(),
})


const MainContainer = () => {
    const FilterRef = useRef<{ handleOpen: () => void; handleClose: () => void }>(null);
    const FormRef = useRef<{ reset: () => void }>(null);
    const [result, setResult] = useState<GetLogsResultModel | undefined>(undefined)
    const [item, setItem] = useState<AuditItemsModel>(inializeAuditData)
    const [loadings, setLoadings] = useState(loading)
    const { fetchLogs } = useAuditLogs()

    const OpenDrawer = () => {
        if (FilterRef.current) {
            FilterRef.current.handleOpen()
        }
    }

    const GetLogs = async (page: number = 1, data: AuditItemsModel) => {
        setLoadings(prev => ({ ...prev, table: true }))
        if (FilterRef.current) {
            FilterRef.current.handleClose()
        }
        const res = await fetchLogs(page, data).then((result) => {
            if (result) {
                setLoadings(prev => ({ ...prev, table: false }))
                if (typeof result == 'object' && 'logs' in result && result.logs.length > 0) {
                    setResult(result)
                    if (FormRef.current) {
                        FormRef.current.reset()
                    }
                }
                else {
                    setResult({ logs: [], count: 0, page: 1, totalCount: 0 })
                }
            }
        })
    }
    return (
        <AuditContext.Provider value={{ result, setResult, item, setItem, GetLogs: (page?: number, data?: AuditItemsModel) => GetLogs(page, data || inializeAuditData), FormRef }}>
            <MyCustomComponent>
                <>
                    <ButtonComponent onClick={() => OpenDrawer()} >فیلتر ها</ButtonComponent>
                    <Filter ref={FilterRef} />
                    {loadings.table == false ? <AuditList /> : <TableSkeleton />}
                    {result && result.logs.length > 0 && <CustomizedPagination className={loadings.table == false ? ' flex visible ' : ' hidden invisible '} count={Math.ceil(Number(result.totalCount) / Number(10))} handlePage={(page) => GetLogs(page, item)} />}
                </>
            </MyCustomComponent>
        </AuditContext.Provider>
    )
}

export default MainContainer