'use client'
import React, { forwardRef, useContext, useImperativeHandle, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { CardBody, Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ForwardAttachmentsModel } from '@/app/Domain/M_Automation/NewDocument/Forwards';
import { useAttachments } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchAttachmentPdf';
import b64toBlob from '@/app/Utils/Automation/convertImageToBlob';
import { ActionButton, Icon, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import { DataContext } from '../NewDocument-MainContainer';
import { LoadingModel } from '@/app/Domain/shared';
import { CloseIcon } from '@/app/EndPoints-AsiaApp/Components/Shared/IconComponent';
import { ForwardContext } from './Forwards-MainContainer';
import { ConvertBase64toBlob } from '@/app/Application-AsiaApp/Utils/blob';

const RefrenceAttachments = forwardRef((props: any, ref) => {
    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open)
    const themeMode = useStore(themeStore, (state) => state)
    const [attachments, setAttachments] = useState<ForwardAttachmentsModel[]>([])
    const { setLoadings } = useContext(DataContext)
    const { ForwardRef } = useContext(ForwardContext)
    const { fetchAttachmentPdf } = useAttachments()

    const ViewAttachmentPdf = async (item: ForwardAttachmentsModel) => {
        setLoadings((state: LoadingModel) => ({ ...state, response: true }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const result = await fetchAttachmentPdf(item.attachmentId).then((res) => {
            if (res) {
                setLoadings((state: LoadingModel) => ({ ...state, response: false }))
                if (typeof res == 'object' && 'file' in res) {
                    let blob = ConvertBase64toBlob({ b64Data: res.file.substring(res.file.lastIndexOf(",") + 1), contentType: res.fileType, sliceSize: 512 });
                    if (ForwardRef.current) {
                        ForwardRef.current.viewAttachment({ file: URL.createObjectURL(blob), fileName: res.fileName, fileType: res.fileType })
                        ForwardRef.current.handleOpen()
                    }
                }
            }
        });
    }

    useImperativeHandle(ref, () => ({
        handleOpenAttachment: () => {
            handleOpen()
        }
        ,
        SetAttachments: (items: ForwardAttachmentsModel[]) => {
            setAttachments(items)
        }

    }))

    return (
        <Dialog
            dismiss={{ escapeKey: true, referencePress: true, referencePressEvent: 'click', outsidePress: false, outsidePressEvent: 'click', ancestorScroll: false, bubbles: true }}
            size='lg' className={`absolute top-0 min-h-[50vh]  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between sticky top-0 left-0`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                مشاهده ضمائم
                <CloseIcon onClick={() => handleOpen()} />
            </DialogHeader>
            <DialogBody className='w-full h-full' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <CardBody className={'h-auto max-h-[40vh] mx-auto relative rounded-lg p-0 overflow-hidden '} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                    <table dir='rtl' className={`w-full relative text-center max-h-[61vh] ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                        <thead >
                            <tr className={!themeMode || themeMode?.stateMode ? 'themeDrak' : 'themeLight'}>
                                <Th value='#' />
                                <Th value='عنوان' />
                                <Th value='توضیحات' />
                                <Th value='عملیات' />
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDrak' : 'themeLight'}`}>
                            {attachments.length > 0 && attachments.map((item: ForwardAttachmentsModel, index: number) => {
                                return (
                                    <tr key={"Attachments" + index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                        <Td style={{ width: '5%' }} value={Number(index) + Number(1)} />
                                        <Td value={item.attachmentTitle} />
                                        <Td value={item.attachmentDesc} />
                                        <Td style={{ width: "5%" }} value={<>
                                            <div className='container-fluid mx-auto p-0.5'>
                                                <div className="flex flex-row justify-evenly">
                                                    <ActionButton onClick={() => ViewAttachmentPdf(item)}>
                                                        <Icon Name={VisibilityIcon} />
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
            </DialogBody>
        </Dialog>
    )
})

RefrenceAttachments.displayName = 'RefrenceAttachments'
export default RefrenceAttachments