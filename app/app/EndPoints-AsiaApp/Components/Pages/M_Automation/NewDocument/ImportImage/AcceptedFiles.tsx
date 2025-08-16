'use client';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { Button, CardBody, Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { ActionButton, Icon, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import { DropzoneFileModel, LoadingModel } from '@/app/Domain/shared';
import { thumbInner } from '@/app/Application-AsiaApp/Utils/shared';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { TextField } from '@mui/material';
import { FileImage } from '@/app/EndPoints-AsiaApp/Components/Shared/AttachmentsImage';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import { CloseIcon } from '@/app/EndPoints-AsiaApp/Components/Shared/IconComponent';
import * as yup from "yup";
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UploadListAttachments } from '@/app/Domain/M_Automation/NewDocument/Attachments';
import { DataContext } from '../NewDocument-MainContainer';
import { useUploadImage } from '@/app/Application-AsiaApp/M_Automation/NewDocument/UploadImportImage';
import { ImportImageContext } from './MainContainer';
import { ConvertBase64toBlob } from '@/app/Application-AsiaApp/Utils/blob';

const AcceptedFiles = forwardRef((props: any, ref) => {
    const { file, setFile, setImportImage, DialogRef } = useContext(ImportImageContext)
    const { docheapId, docTypeId, setLoadings } = useContext(DataContext)
    const themeMode = useStore(themeStore, (state) => state)
    const { UploadImportImage } = useUploadImage()

    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open);

    const schema = yup.object().shape({
        files: yup.array(yup.object().shape({
            file: yup.string().required(),
            type: yup.string().required(),
            title: yup.string().required(),
            desc: yup.string().optional()
        })).required()
    }).required()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        getValues,
        trigger,
        setValue,
        control,
        formState,
    } = useForm<UploadListAttachments>(
        {
            defaultValues: {
                files: [
                    {
                        file: '',
                        title: '',
                        type: '',
                        desc: ''
                    }
                ]
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );

    const errors = formState.errors;
    const FilesState = useFieldArray({
        name: "files",
        control
    })

    useEffect(() => {
        const updateFiles = async () => {
            const updatedFiles = await Promise.all(file.map(async (f: DropzoneFileModel) => ({
                file: await ReadFileAsync(f.file),
                title: f.file.name || '',
                type: f.file.type || '',
                desc: ''
            })));
            setValue('files', updatedFiles);
        };
        updateFiles();
    }, [file])


    useImperativeHandle(ref, () => ({
        handleOpenDialog: () => {
            handleOpen()
        }
    }));

    const DeleteFile = (index: number) => {
        file.splice(index, 1)
        FilesState.remove(index)
    }


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



    const UploadImage = async (op: DropzoneFileModel, desc: string, index: number) => {
        if (DialogRef.current) { DialogRef.current.handleOpenDialog() }
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        let readFile = await ReadFileAsync(op.file)
        const res = await UploadImportImage(
            {
                file: readFile,
                title: op.file.name || '',
                type: op.file.type || '',
                desc: desc
            }, docheapId, docTypeId,).then(async (result) => {
                if (result) {
                    if (typeof result === 'object' && 'id' in result) {
                        setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                        let blob = ConvertBase64toBlob({ b64Data: readFile.substring(readFile.lastIndexOf(",") + 1), contentType: result.fileType, sliceSize: 512 });
                        setImportImage(URL.createObjectURL(blob));
                        file.splice(index, 1)
                        FilesState.remove(index)

                    } else {
                        setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                        setImportImage((prev: string) => (prev));
                    }
                }
            })
    }

    return (
        <MyCustomComponent>
            <>
                <Dialog dismiss={{ escapeKey: true, referencePress: true, referencePressEvent: 'click', outsidePress: false, outsidePressEvent: 'click', ancestorScroll: false, bubbles: true }}
                    size='xl' className={`absolute top-0 min-h-[50vh] ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <DialogHeader dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'} flex justify-between sticky top-0 left-0`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <CloseIcon onClick={() => { handleOpen(), setFile([]) }} />
                        انتخاب مدرک
                    </DialogHeader>
                    <DialogBody className='w-full' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <form dir='rtl' className='h-full w-full'>
                            <CardBody className={'h-auto mx-auto relative rounded-lg p-0 overflow-hidden '} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                <table dir='rtl' className={`w-full relative text-center ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                                    <thead >
                                        <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                                            <Th value={'#'} />
                                            <Th value={'تصویر مدرک'} />
                                            <Th value={'اطلاعات مدرک'} />
                                            <Th value={'توضیحات'} />
                                            <Th value={'عملیات'} />
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                                        {file.map((op: DropzoneFileModel, index: number) => {
                                            return (
                                                <tr key={"docTable" + index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                                    <Td style={{ width: "3%" }} value={Number(index) + Number(1)} />
                                                    <Td style={{ minWidth: '100px', width: '20%' }} value={<>
                                                        <div className='w-full h-full flex justify-center' style={thumbInner}>
                                                            <figure className='h-[50px] w-[50px]'>
                                                                <FileImage file={op} />
                                                            </figure>
                                                        </div>
                                                    </>} />
                                                    <Td style={{ width: '25%' }} value={op.file.name.split('.').slice(0, -1) + '--' + op.file.size + ' byte'} />
                                                    <Td style={{ width: '45%' }} value={<> <TextField {...register(`files.${index}.desc`)} size='small'
                                                        className='w-full lg:my-0 font-[FaLight]'
                                                        InputProps={{
                                                            style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' }
                                                        }} /> </>} />
                                                    <Td style={{ width: '7%' }} value={<>
                                                        <div className='container-fluid mx-auto p-0.5'>
                                                            <div className="flex flex-row justify-evenly">
                                                                <ActionButton onClick={() => DeleteFile(index)}>
                                                                    <Icon Name={DeleteIcon} />
                                                                </ActionButton>
                                                                <ActionButton onClick={() => UploadImage(op, watch(`files.${index}.desc`) ?? '', index)}>
                                                                    <Icon Name={CloudUploadIcon} />
                                                                </ActionButton>
                                                            </div>
                                                        </div>
                                                    </>} />
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </CardBody>
                        </form>
                    </DialogBody>
                </Dialog>
            </>
        </MyCustomComponent>
    )
})
AcceptedFiles.displayName = 'AcceptedFiles'
export default AcceptedFiles