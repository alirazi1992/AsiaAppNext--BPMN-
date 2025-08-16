'use client';
import React, { useCallback, useContext } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { ActionButton, Icon } from './TableComponent';
import AddIcon from '@mui/icons-material/Add';
import { useDropzone } from 'react-dropzone';
import { DropzoneFileModel } from '@/app/Domain/shared';
import { ImportImageContext } from '../Pages/M_Automation/NewDocument/ImportImage/MainContainer';

const ImportImageDropzone = () => {
    const { setFile, DialogRef } = useContext(ImportImageContext)
    const onDropImportImage = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map((file: File) => {
            const preview = URL.createObjectURL(file);
            return {
                file: file,
                preview: preview,
            };
        });
        setFile((prevFiles: DropzoneFileModel[]) => [...prevFiles, ...newFiles]);
        if (DialogRef.current) {
            DialogRef.current.handleOpenDialog();
        }
        newFiles.forEach(file => URL.revokeObjectURL(file.preview));
    }, [DialogRef, setFile]);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDropImportImage,
        multiple: false,
        accept: {
            'application/pdf': []
        }
    });

    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    return (
        <div style={{ border: `1px dashed ${color?.color}` }} {...getRootProps({ className: 'dropzone w-5/6 mx-auto' })}>
            <input {...getInputProps()} />
            <div className='flex flex-row justify-around items-center'>
                <ActionButton>
                    <Icon Name={AddIcon} />
                </ActionButton>
                <p dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} p-3 text-[13px] font-thin`}>انتخاب فایل مورد نظر</p>
            </div>
        </div>
    )
}

export default ImportImageDropzone