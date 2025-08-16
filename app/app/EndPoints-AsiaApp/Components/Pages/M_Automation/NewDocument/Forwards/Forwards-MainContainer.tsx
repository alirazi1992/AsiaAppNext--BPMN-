'use client'
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useForwardsList } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchForwardsList';
import { ForwardAttachmentsModel, GetAttachmentPdfModel, GetForwardsListModel } from '@/app/Domain/M_Automation/NewDocument/Forwards';
import ForwardsList from './ForwardsList';
import { DataContext } from '../NewDocument-MainContainer';
import { LoadingModel } from '@/app/Domain/shared';
import RefrenceAttachments from './RefrenceAttachments';
import ViewAttachmentPdf from './ViewAttachments';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
// import ViewAttachmentComponent from './ViewAttachments';

export const ForwardContext = createContext<any>(null)
const ForwardsMainContainer = () => {
    const { docheapId, setLoadings, loadings, setForwardsList, activate } = useContext(DataContext)
    const { fetchForwardsList } = useForwardsList()

    const ForwardRef = useRef<{ handleOpen: () => void, viewAttachment: (item: GetAttachmentPdfModel) => void }>(null);
    const AttachmentsRef = useRef<{ handleOpenAttachments: () => void, SetAttachments: (item: ForwardAttachmentsModel[]) => void }>(null);

    useEffect(() => {
        const loadInitialList = async () => {
            setLoadings((state: LoadingModel) => ({ ...state, table: true }))
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const res = await fetchForwardsList(docheapId!).then((result) => {
                if (result) {
                    setLoadings((state: LoadingModel) => ({ ...state, table: false }))
                    if (Array.isArray(result)) {
                        setForwardsList([...result])
                    }
                }
            }
            )
        }
        { activate == 'Forwards' && loadInitialList() }
    }, [activate, docheapId])

    return (
        <ForwardContext.Provider value={{ AttachmentsRef, ForwardRef }}>
            {loadings.table == false ? <ForwardsList /> : <TableSkeleton className='w-full' />}
            <RefrenceAttachments ref={AttachmentsRef} />
            <ViewAttachmentPdf ref={ForwardRef} />
        </ForwardContext.Provider>
    )
}

export default ForwardsMainContainer