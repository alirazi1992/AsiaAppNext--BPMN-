'use client';
import { CloseIcon } from '@/app/EndPoints-AsiaApp/Components/Shared/IconComponent';
import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import { GetAttachmentsList } from '@/app/Domain/M_Automation/NewDocument/Attachments';


const ViewVideoComponent = forwardRef<{ handleOpenVideo: () => void, setItems: (item: GetAttachmentsList) => void }>((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const [open, setOpen] = useState<boolean>(false)
    const [option, setOption] = useState<GetAttachmentsList | null>(null)
    const handleOpen = () => setOpen(!open)

    useImperativeHandle(ref, () => ({
        handleOpenVideo: () => {
            handleOpen()
        },
        setItems: (item: GetAttachmentsList) => {
            setOption(item)
        }
    }))
    return (
        <Dialog
            dismiss={{
                escapeKey: true,
                referencePress: true,
                referencePressEvent: 'click',
                outsidePress: false,
                outsidePressEvent: 'click',
                ancestorScroll: false,
                bubbles: true
            }}
            size='xl' className={`absolute top-0 bottom-0 ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between sticky top-0 left-0`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {option?.fileTitle}
                <CloseIcon onClick={() => handleOpen()} />
            </DialogHeader>
            <DialogBody className='w-full h-[88vh] flex justify-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <video width="960" height="640" autoPlay={true} controls={true}>
                    <source src={`${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getappendixvideostream?Id=${option?.id}&AttachmentType=${option?.attachmentTypeId}`} type="video/mp4" />
                </video>
            </DialogBody>
        </Dialog>
    )
})
ViewVideoComponent.displayName = 'ViewVideoComponent'
export default ViewVideoComponent

