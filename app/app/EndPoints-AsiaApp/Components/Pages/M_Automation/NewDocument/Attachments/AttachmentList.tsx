'use client';
import { ActionButton, Icon, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent'
import { Button, CardBody, Popover, PopoverContent, PopoverHandler, Tooltip } from '@material-tailwind/react'
import React, { useContext, useRef, useState } from 'react'
import { AttachmentContext } from './MainContainer'
import { DownloadAttachment, GetAttachmentsList } from '@/app/Domain/M_Automation/NewDocument/Attachments'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudDownload from '@mui/icons-material/CloudDownload';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import themeStore from '@/app/zustandData/theme.zustand'
import colorStore from '@/app/zustandData/color.zustand'
import useStore from '@/app/hooks/useStore'
import moment from 'jalali-moment';
import { Checkbox } from '@material-tailwind/react';
import { DataContext } from '../NewDocument-MainContainer';
import { RemovingAttachments } from '@/app/Application-AsiaApp/M_Automation/NewDocument/RemoveAttachment';
import { LoadingModel } from '@/app/Domain/shared';
import { useDownloadAttachments } from '@/app/Application-AsiaApp/M_Automation/NewDocument/DownloadAttachment';
import { ConvertBase64toBlob } from '@/app/Application-AsiaApp/Utils/blob';
import { ImageTypes, PDFTypes, VideoTypes } from '@/app/Application-AsiaApp/Utils/shared';
import ViewAttachmentComponent from './ViewAttachment';
import ViewVideoComponent from './ViewVideo';
import Swal from 'sweetalert2';

const AttachmentList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const { DeleteAttachment } = RemovingAttachments()
    const { downloadAttachment } = useDownloadAttachments()
    const { Attachments, setAttachments } = useContext(AttachmentContext)
    const { docheapId, docTypeId, setLoadings, loadings } = useContext(DataContext)
    const attachmentRef = useRef<{ handleOpen: () => void }>(null);
    const videoRef = useRef<{ handleOpenVideo: () => void, setItems: (item: GetAttachmentsList) => void }>(null);
    const [viewAttachment, setViewAttachment] = useState<DownloadAttachment | null>(null)

    const RemoveAttachment = (id: number) => {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        const res = DeleteAttachment(id, docheapId, docTypeId).then((result) => {
            if (result) {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                if (typeof result === 'boolean' && result == true) {
                    let index = Attachments.indexOf(Attachments.find((p: GetAttachmentsList) => p.id == id)!);
                    if (index !== -1) {
                        let Array = [...Attachments]
                        Array.splice(index, 1)
                        setAttachments([...Array])
                    }
                }
            }
        })
    }

    const Download = async (id: number) => {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        const res = await downloadAttachment(id).then((result) => {
            if (result) {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                if (typeof result == 'object' && 'file' in result && typeof window !== 'undefined') {
                    let blob = ConvertBase64toBlob({ b64Data: result.file.substring(result.file.lastIndexOf(",") + 1), contentType: result.fileType, sliceSize: 512 });
                    var fileDownload = require('js-file-download');
                    fileDownload(blob, result.fileName);
                }
            }
        })
    }

    const DownloadSelectedAttachments = async () => {
        let allSelected = Attachments.filter((p: GetAttachmentsList) => p.isActive)
        if (allSelected.length > 0) {
            allSelected.map(async (p: GetAttachmentsList) => {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
                const res = await downloadAttachment(p.id).then((result) => {
                    if (result) {
                        setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                        if (typeof result == 'object' && 'file' in result && typeof window !== 'undefined') {
                            let blob = ConvertBase64toBlob({ b64Data: result.file.substring(result.file.lastIndexOf(",") + 1), contentType: result.fileType, sliceSize: 512 });
                            var fileDownload = require('js-file-download');
                            fileDownload(blob, result.fileName);
                        }
                    }
                })
            })
        } else {
            const res = Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "Download Attachment",
                text: 'پیوست های مورد نظر را انتخاب کنید',
                icon: 'info',
                confirmButtonColor: "#22c55e",
                confirmButtonText: "Ok!"
            })
            return res
        }
    }

    const ViewAttachment = async (id: number) => {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        const res = await downloadAttachment(id).then((result) => {
            if (result) {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                if (typeof result == 'object' && 'file' in result && result.file !== null && typeof window !== 'undefined') {
                    if (attachmentRef.current) {
                        let blob = ConvertBase64toBlob({ b64Data: result.file.substring(result.file.lastIndexOf(",") + 1), contentType: result.fileType, sliceSize: 512 });
                        let blobUrl = URL.createObjectURL(blob);
                        setViewAttachment({ file: blobUrl, fileName: result.fileName.split(".")[0], fileType: result.fileType });
                        attachmentRef.current.handleOpen()
                    };
                }
            }
        })
    }


    return (
        <>
            <form dir='rtl' className='h-full w-full'>
                <Tooltip content="دانلود گروهی" className={`${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'} z-[88888888]`}>
                    <Button onClick={() => DownloadSelectedAttachments()} size="sm" className="p-1 mx-1 my-4" style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        <Icon Name={CloudDownload} />
                    </Button>
                </Tooltip>
                <CardBody className='w-full md:h-[55vh] h-[40vh] relative rounded-lg overflow-auto p-0' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                    <table dir='rtl' className={`w-full md:max-h-[51vh] max-h-[38vh] relative text-center ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                        <thead className={`sticky border-b-2 z-[9999] top-0 left-0 w-full`}>
                            <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                                <Th value={'#'} />
                                <Th value={'تاریخ'} />
                                <Th value={'پیوست کننده'} />
                                <Th value={'عنوان'} />
                                <Th value={'عملیات'} />
                                <Th value={<>
                                    <Tooltip content="انتخاب تمام موارد" className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                                        <Checkbox
                                            onChange={() => {
                                                setAttachments((state: GetAttachmentsList[]) => (
                                                    [...state.map((p: GetAttachmentsList) => ({
                                                        ...p,
                                                        isActive: !p.isActive
                                                    }))]));
                                            }}
                                            checked={Attachments.find(((a: GetAttachmentsList) => a.isActive == false)) ? false : true}
                                            crossOrigin=""
                                            name="type"
                                            color='blue-gray'
                                            className="p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                    </Tooltip>
                                </>} />
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                            {Attachments.map((op: GetAttachmentsList, index: number) => {
                                return (
                                    <tr key={"docTable" + index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                        <Td style={{ width: "3%" }} value={Number(index) + Number(1)} />
                                        <Td value={moment(op.createDate).format('jYYYY/jMM/jDD HH:mm:ss')} />
                                        <Td style={{ width: "30%" }} value={op.creator} />
                                        <Td value={op.fileTitle} />
                                        <Td style={{ width: '10%' }} value={<>
                                            <div className='container-fluid mx-auto p-0.5'>
                                                <div className="flex flex-row justify-evenly">
                                                    <ActionButton onClick={() => RemoveAttachment(op.id)}>
                                                        <Icon Name={DeleteIcon} />
                                                    </ActionButton>
                                                    <ActionButton onClick={() => Download(op.id)} >
                                                        <Icon Name={CloudDownload} />
                                                    </ActionButton>
                                                    {VideoTypes.includes(op.fileType) || VideoTypes.map(type => type.split('/').pop()).includes(op.fileType) ?
                                                        <ActionButton onClick={() => { if (videoRef.current) { videoRef.current.handleOpenVideo(), videoRef.current.setItems(op) } }}>
                                                            <Icon Name={PlayArrowIcon} />
                                                        </ActionButton> :
                                                        (PDFTypes.includes(op.fileType) || PDFTypes.map(type => type.split('/').pop()).includes(op.fileType) || ImageTypes.includes(op.fileType) || ImageTypes.map(type => type.split('/').pop()).includes(op.fileType))
                                                        && <ActionButton onClick={() => ViewAttachment(op.id)}>
                                                            <Icon Name={VisibilityIcon} />
                                                        </ActionButton>}
                                                    <Popover placement="bottom">
                                                        <PopoverHandler>
                                                            <Button
                                                                size="sm"
                                                                className="p-1 mx-1"
                                                                style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                <Tooltip content="اطلاعات تکمیلی" className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                                                                    <InfoIcon
                                                                        fontSize="small"
                                                                        className='p-1'
                                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                                </Tooltip>
                                                            </Button>
                                                        </PopoverHandler>
                                                        <PopoverContent className="flex-col z-[9999] border-none py-[10px] bg-blue-gray-600 text-white" dir="rtl" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                            توضیحات : {op.description ?? "توضیحی برای این پیوست درج نشده است"}
                                                        </PopoverContent>
                                                    </Popover>

                                                </div>
                                            </div>
                                        </>} />
                                        < Td style={{ width: '5%' }} value={<>
                                            <Checkbox
                                                onChange={() => {
                                                    op.isActive = !op.isActive, setAttachments((state: GetAttachmentsList[]) => (
                                                        [...state]));
                                                }}
                                                checked={op.isActive}
                                                crossOrigin=""
                                                name="type"
                                                color='blue-gray'
                                                className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                        </>} />
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </CardBody>
            </form >

            <ViewAttachmentComponent file={viewAttachment !== null ? viewAttachment : { file: '', fileName: '', fileType: '' }} ref={attachmentRef} />
            <ViewVideoComponent ref={videoRef} />
        </>
    )
}

export default AttachmentList