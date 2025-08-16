'use client';
import { FileImage } from '@/app/EndPoints-AsiaApp/Components/Shared/AttachmentsImage'
import { ActionButton, Icon, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent'
import { CardBody } from '@material-tailwind/react'
import { TextField } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import { DropzoneFileModel } from '@/app/Domain/shared';
import { thumbInner } from '@/app/Application-AsiaApp/Utils/shared';
import { ForwardReceiverContext } from './ForwardReceiversList';
import DeleteIcon from '@mui/icons-material/Delete';
import { ForwrdDocumentContext } from '../Forward-MainContainer';
import { DataContext } from '../../../NewDocument-MainContainer';
import { ToolbarContext } from '../../../NewDocument-Toolbar';

const AcceptedAttachments = () => {
    const { setValue, register, FileState } = useContext(ForwrdDocumentContext)
    const { file } = useContext(ForwardReceiverContext)
    const themeMode = useStore(themeStore, (state) => state)

    const RemoveFile = (index: number) => {
        file.splice(index, 1)
        FileState.remove(index)
    }

    useEffect(() => {
        const updateFiles = async () => {
            const updatedFiles = await Promise.all(file.map(async (f: DropzoneFileModel) => ({
                attachment: await ReadFileAsync(f.file),
                fileTitle: f.file.name || '',
                type: f.file.type || '',
                description: ''
            })));
            setValue('Forward.files', updatedFiles);
        };
        updateFiles();
    }, [file])


    async function ReadFileAsync(file: any): Promise<string> {
        return new Promise((resolve, reject) => {
            var fr = new FileReader();
            fr.onload = async () => {
                resolve(fr.result as string);
            };
            fr.onerror = async (error) => { };
            fr.readAsDataURL(file);
        });
    }

    return (
        <>
            {file.length > 0 && <CardBody className={'h-auto w-full relative rounded-lg p-0 overflow-hidden my-4'}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <table dir='rtl' className={`w-full relative text-center ${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                    <thead >
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <Th value={'#'} />
                            <Th value={'تصویر مدرک'} />
                            <Th value={'اطلاعات مدرک'} />
                            <Th value={'توضیحات'} />
                            <Th value={'عملیات'} />
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {file.map((op: DropzoneFileModel, index: number) => {
                            return (
                                <tr key={"docTable" + index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                    <Td style={{ width: "3%" }} value={Number(index) + Number(1)} />
                                    <Td style={{ minWidth: '100px', width: '20%' }} value={<>
                                        <div className='w-full h-full flex justify-center' style={thumbInner}>
                                            <figure className='h-[50px] w-[50px]'>
                                                <FileImage file={op} />
                                            </figure>
                                        </div>
                                    </>} />
                                    <Td style={{ width: '25%' }} value={op.file.name.split('.').slice(0, -1) + '--' + op.file.size + ' byte'} />
                                    <Td style={{ width: '45%' }} value={<> <TextField {...register(`Forward.files.${index}.description`)} size='small'
                                        className='w-full lg:my-0 font-[FaLight]'
                                        InputProps={{
                                            style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' }
                                        }} /> </>} />
                                    <Td style={{ width: '7%' }} value={<>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <ActionButton onClick={() => RemoveFile(index)}>
                                                    <Icon Name={DeleteIcon} />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    </>} />
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </CardBody>}
        </>
    )
}
export default AcceptedAttachments