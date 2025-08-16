'use client';
import { useHierarchy } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchForwardHierarchy'
import React, { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore'
import { DataContext } from '../../NewDocument-MainContainer';
import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { CloseIcon } from '@/app/EndPoints-AsiaApp/Components/Shared/IconComponent';
import ChartNewDocument from '@/app/EndPoints-AsiaApp/Components/Pages/M_Automation/NewDocument/Toolbars/Hierarchy/chart';

const MainContainer = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open)

    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            handleOpen()
        },
    }));
    return (
        <Dialog
            dismiss={{
                escapeKey: true, referencePress: true, referencePressEvent: 'click', outsidePress: false, outsidePressEvent: 'click', ancestorScroll: false, bubbles: true
            }} size='xl' className={`absolute top-0 bottom-0 overflow-y-scroll  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
            <DialogHeader dir='rtl' className={` flex justify-between sticky top-0 left-0 z-[555555] ${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'} `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                درخت ارجاعات
                <CloseIcon onClick={() => handleOpen()} />
            </DialogHeader>
            <DialogBody className='w-full overflow-y-auto'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <ChartNewDocument />
            </DialogBody>
        </Dialog>
    )
})
MainContainer.displayName = 'MainContainer'
export default MainContainer