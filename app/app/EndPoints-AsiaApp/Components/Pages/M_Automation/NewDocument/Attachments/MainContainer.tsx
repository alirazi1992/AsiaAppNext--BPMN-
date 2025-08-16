'use client'
import { DropzoneFileModel, LoadingModel } from '@/app/Domain/shared'
import Dropzone from '@/app/EndPoints-AsiaApp/Components/Shared/Dropzone'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import AcceptedFilesList from './AcceptedFilesList'
import { GetAttachmentsList } from '@/app/Domain/M_Automation/NewDocument/Attachments'
import AttachmentList from './AttachmentList'
import { DataContext } from '../NewDocument-MainContainer'
import { useAttachmentsList } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchAttachmentsList'
import TableSkeleton from '@/app/components/shared/TableSkeleton'

export const AttachmentContext = createContext<any>(null)
const AttachmentsMainContainer = () => {
    const { docheapId, loadings, setLoadings } = useContext(DataContext)
    const DialogRef = useRef<{ handleOpen: () => void }>(null);
    const [file, setFile] = useState<DropzoneFileModel[]>([])
    const [Attachments, setAttachments] = useState<GetAttachmentsList[]>([])
    const { fetchAttachments } = useAttachmentsList()

    useEffect(() => {
        const loadAttachmentsList = async () => {
            setLoadings((prev: LoadingModel) => ({ ...prev, table: true }))
            const res = docheapId && docheapId !== '' && await fetchAttachments(docheapId).then((result) => {
                if (result) {
                    setLoadings((prev: LoadingModel) => ({ ...prev, table: false }))
                    if (Array.isArray(result)) {
                        setAttachments(result)
                    } else {
                        setAttachments([])
                    }
                }
            })
        }
        loadAttachmentsList()
    }, [])

    return (
        <AttachmentContext.Provider value={{ file, setFile, DialogRef, Attachments, setAttachments }}>
            <section className='w-full gap-x-4 my-4'>
                <Dropzone />
                <AcceptedFilesList ref={DialogRef} />
                <section className='w-full gap-x-4 my-4'>
                    {loadings.table == false ? <AttachmentList /> : <TableSkeleton />}
                </section>
            </section>
        </AttachmentContext.Provider>
    )
}

export default AttachmentsMainContainer