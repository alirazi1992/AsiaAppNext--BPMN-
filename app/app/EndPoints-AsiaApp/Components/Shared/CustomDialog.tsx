'use client'
import { Dialog, DialogBody, DialogHeader, IconButton } from '@material-tailwind/react'
import React, { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';

type DialogProps = {
    title: string,
    children: ReactNode,
    dir: string
}

const CustomDialog = forwardRef(({ children, dir, title }: DialogProps, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open)

    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            handleOpen()
        }
    }))

    return (
        <Dialog dismiss={{ escapeKey: true, referencePress: true, referencePressEvent: 'click', outsidePress: false, outsidePressEvent: 'click', ancestorScroll: false, bubbles: true }}
        size='xl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} absolute top-0 min-h-[50vh] `} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <DialogHeader dir={dir} className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between sticky top-0 left-0`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <IconButton variant="text" color="blue-gray" onClick={() => handleOpen()}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </IconButton>
                {title}
            </DialogHeader>
            <DialogBody className='w-full'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {children}
            </DialogBody>
        </Dialog>
    )
})
CustomDialog.displayName = 'CustomDialog'
export default CustomDialog