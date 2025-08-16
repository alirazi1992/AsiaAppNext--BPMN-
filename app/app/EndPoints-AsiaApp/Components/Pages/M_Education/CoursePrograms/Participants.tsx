'use client';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import MyCustomComponent from '../../../Shared/CustomTheme_Mui';
import { Dialog, DialogBody, DialogHeader, IconButton } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { ProgramParticipantsProps } from '@/app/Domain/M_Education/Participant';
import ComponentParticipant from './Participants/Participants';

const Participants = forwardRef(({ program }: ProgramParticipantsProps, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open)


    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            handleOpen()
        },
    }));

    return (
        <MyCustomComponent>
            <>
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
                    size='xl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} absolute top-0 min-h-[50vh]`} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between sticky top-0 left-0`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                    Participants
                </DialogHeader>
                <DialogBody className='w-full'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <ComponentParticipant program={program} />
                </DialogBody>
            </Dialog>
            </>
        </MyCustomComponent>
    )
})

Participants.displayName = 'Participants'
export default Participants