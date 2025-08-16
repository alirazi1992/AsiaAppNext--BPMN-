'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import Loading from '@/app/components/shared/loadingResponse';
import SelectKeyword from './SelectKeyword';
import { useRelatedDocs } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchRelatedDocsList';
import { DataContext } from '../NewDocument-MainContainer';
import { RelatedDocsModel } from '@/app/Domain/M_Automation/NewDocument/Keywords';
import { RelatedDocsTable } from './RelatedDocumentList';
import TableSkeleton from '@/app/components/shared/TableSkeleton';

export const KeywordsContext = createContext<any>(null)
const MainContainers = () => {
    const [loadings, setLoadings] = useState(loading)
    const { docheapId } = useContext(DataContext)
    const { fetchRelatedDocsList } = useRelatedDocs()
    const [relatedDocs, setRelatedDocs] = useState<RelatedDocsModel[] | undefined>(undefined)

    useEffect(() => {
        const loadInitialList = async () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setLoadings((state) => ({ ...state, table: true }))
            const res = await fetchRelatedDocsList(docheapId).then((result) => {
                if (result) {
                    setLoadings((state) => ({ ...state, table: false }))
                    if (typeof result == 'object' && 'relatedDocs' in result) {
                        setRelatedDocs(result!.relatedDocs)
                    }
                }
            })
        }
        loadInitialList()
    }, [docheapId])


    return (
        <KeywordsContext.Provider value={{ relatedDocs, setRelatedDocs, setLoadings }}>
            {loadings.response == true && <Loading />}
            <SelectKeyword />
            <section className='w-full flex justify-between gap-x-4 my-4'>
                {loadings.table == false ? <div className='w-2/4'>
                    <RelatedDocsTable title='قبلی' isNext={false} />
                </div> : <TableSkeleton />}
                {loadings.table == false ? <div className='w-2/4'>
                    <RelatedDocsTable title='بعدی' isNext={true} />
                </div> : <TableSkeleton />}
            </section>
        </KeywordsContext.Provider>
    )
}

export default MainContainers