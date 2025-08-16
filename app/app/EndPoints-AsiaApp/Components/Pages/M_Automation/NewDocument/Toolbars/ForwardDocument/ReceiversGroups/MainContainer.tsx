'use client';
import { Accordion, AccordionBody, AccordionHeader, Card, CardBody, IconButton, Typography } from '@material-tailwind/react'
import React, { createContext, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand'
import colorStore from '@/app/zustandData/color.zustand'
import useStore from '@/app/hooks/useStore'
import GroupsIcon from '@mui/icons-material/Groups';
import { GetGroupsModel, ReceiverGroupMembersModel } from '@/app/Domain/M_Automation/NewDocument/toolbars';
import GroupsList from './groupsList';
import MembersList from './MembersList'
import SelectForwardReceiver from './SelectForwardReceivers';
import ForwardReceiverList from './ForwardReceiversList';

export const ReceiversContext = createContext<any>(null)
const ReceiversMainContainer = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [accordion, setAccordion] = React.useState(0);
    const handleAccordion = (value: any) => setAccordion(accordion === value ? 0 : value)
    const [groups, setGroups] = useState<GetGroupsModel[]>([])
    const [members, setMembers] = useState<ReceiverGroupMembersModel[]>([])
    const [forwardReceivers, setForwardReceivers] = useState<ReceiverGroupMembersModel[]>([])

    return (
        <ReceiversContext.Provider value={{ groups, setGroups, members, setMembers, forwardReceivers, setForwardReceivers }}>
            <Card shadow className={`${!themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight'} p-3`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Accordion open={accordion === 1} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <AccordionHeader className='h-[50px] flex justify-start' onClick={() => handleAccordion(1)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <IconButton style={{ background: color?.color }} size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <GroupsIcon />
                        </IconButton>
                        <Typography variant="h5" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} py-4 px-6 font-[500] whitespace-nowrap `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            گروه های گیرندگان
                        </Typography>
                    </AccordionHeader>
                    <AccordionBody >
                        <section className='grid grid-cols-1 md:grid-cols-2 gap-x-3'>
                            <GroupsList />
                            <MembersList />
                        </section>
                    </AccordionBody>
                </Accordion>
                <SelectForwardReceiver />
                <ForwardReceiverList />
            </Card>
        </ReceiversContext.Provider>
    )
}

export default ReceiversMainContainer