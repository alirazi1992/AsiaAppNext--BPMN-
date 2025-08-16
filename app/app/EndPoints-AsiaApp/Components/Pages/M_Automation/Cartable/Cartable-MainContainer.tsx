'use client';
import { TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import React, { useState } from 'react'
import CustomTab from '../../../Shared/CustomTab';
import themeStore from '@/app/zustandData/theme.zustand'
import colorStore from '@/app/zustandData/color.zustand'
import useStore from '@/app/hooks/useStore';
import InboxMainContainer from './Inbox/Inbox-MainContainer';
import OutInboxMainContainer from './OutInbox/OutInbox-MainContainer';

const CartableMainContainer = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [activeTab, setActiveTab] = useState<string>('inbox')
    return (
        <Tabs dir='rtl' value='inbox' className="p-2/4 m-3 h-full">
            <TabsHeader className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} w-full md:w-[200px]:`}
                indicatorProps={{
                    style: { background: color?.color },
                    className: `shadow !text-gray-900`
                }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <section className='flex flex-col md:h-[35px] md:flex-row w-full'>
                    <CustomTab value="inbox" label="صندوق دریافت" isActive={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} />
                    <CustomTab value="outInbox" label="دسته بندی ها" isActive={activeTab === 'outInbox'} onClick={() => setActiveTab('outInbox')} />
                </section>
                <section className='bg-green-100'>
                    test
                </section>
            </TabsHeader>
            <TabsBody className='h-full m-0 p-0' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <TabPanel className='h-full w-full' value="inbox">
                    <InboxMainContainer />
                </TabPanel>
                <TabPanel className='h-full w-full' value="outInbox">
                    <OutInboxMainContainer />
                </TabPanel>
            </TabsBody>
        </Tabs>
    )
}
export default CartableMainContainer