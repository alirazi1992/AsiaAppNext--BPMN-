'use client'
import { DropzoneFileModel, LoadingModel } from '@/app/Domain/shared'
import ImportImageDropzone from '@/app/EndPoints-AsiaApp/Components/Shared/ImportImageDropzone'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import AcceptedFiles from './AcceptedFiles'
import { DataContext } from '../NewDocument-MainContainer'
import { useImportImage } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchImportImage'
import { ConvertBase64toBlob } from '@/app/Application-AsiaApp/Utils/blob'
import LetterImage from './LetterImage'
import IframeSkeleton from '@/app/components/shared/IframeSkeleton'

export const ImportImageContext = createContext<any>(null)


const ImportImageMainContainer = () => {
    const { docheapId, loadings, setLoadings, docTypeId } = useContext(DataContext)
    const DialogRef = useRef<{ handleOpenDialog: () => void }>(null);
    const [file, setFile] = useState<DropzoneFileModel[]>([])
    const [importImage, setImportImage] = useState<string>('')
    const { fetchImportImage } = useImportImage()

    useEffect(() => {
        const loadImportImage = async () => {
            setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
            const res = docTypeId == '4' && docheapId && docheapId !== '' && await fetchImportImage(docheapId).then((result) => {
                if (result) {
                    setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                    if (typeof result == 'object' && 'fileName' in result) {
                        let blob = ConvertBase64toBlob({ b64Data: result.file.substring(result.file.lastIndexOf(",") + 1), contentType: result.fileType, sliceSize: 512 });
                        setImportImage(URL.createObjectURL(blob));
                    }
                }
            })
        }
        loadImportImage()
    }, [docTypeId, docheapId])

    return (
        <ImportImageContext.Provider value={{ file, setFile, loadings, DialogRef, setImportImage }}>
            <ImportImageDropzone />
            <section className='w-full gap-x-4 my-4'>
                <AcceptedFiles ref={DialogRef} />
                < LetterImage content={importImage} /> : <IframeSkeleton />
            </section>
        </ImportImageContext.Provider>
    )
}

export default ImportImageMainContainer