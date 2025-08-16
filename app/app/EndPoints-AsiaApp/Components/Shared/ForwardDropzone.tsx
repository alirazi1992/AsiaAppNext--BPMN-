'use client';
import React, { useCallback, useContext } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { ActionButton, Icon } from './TableComponent';
import AddIcon from '@mui/icons-material/Add';
import { useDropzone } from 'react-dropzone';
import { DropzoneFileModel } from '@/app/Domain/shared';
import { ForwardReceiverContext } from '@/app/EndPoints-AsiaApp/Components/Pages/M_Automation/NewDocument/Toolbars/ForwardDocument/ReceiversGroups/ForwardReceiversList';

const ForwardDropzone = () => {
    const { setFile } = useContext(ForwardReceiverContext)
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map((file: File) => {
            return {
                file: file,
                preview: URL.createObjectURL(file),
            };
        });
        setFile((prevFiles: DropzoneFileModel[]) => [...prevFiles, ...newFiles]);
    },
        [setFile]);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop, multiple: true,
    });


    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    return (
        <div style={{ border: `1px dashed ${color?.color}` }} {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex flex-row justify-around items-center'>
                 <p dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} p-3 text-[13px] font-thin`}>انتخاب فایل مورد نظر</p>
                <ActionButton>
                    <Icon Name={AddIcon} />
                </ActionButton>
            </div>
        </div>
    )
}

export default ForwardDropzone