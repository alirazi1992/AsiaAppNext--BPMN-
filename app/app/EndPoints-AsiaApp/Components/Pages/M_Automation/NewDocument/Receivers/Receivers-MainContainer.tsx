'use client';
import { TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import React, { useState } from 'react';
import CustomTab from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTab';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from "@/app/hooks/useStore";
import MainReceiver from './MainReceiver';
import CopyReceiver from './CopyReceiver';

const ReceiversMainContainer = () => {
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state);
    const [activate, setActivate] = useState<string>('MainReceivers')

    return (
        <Tabs dir='rtl' value={activate} className="h-full w-full p-0 m-0 ">
            <TabsHeader className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} md:my-3 w-full md:w-[400px] md:p-1 grid grid-cols-1 md:grid-cols-2`}
            indicatorProps={{
                style: { background: color?.color },
                className: `shadow !text-gray-900`
            }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <CustomTab value="MainReceivers" label="گیرندگان اصلی" isActive={activate === 'MainReceivers'} onClick={() => setActivate('MainReceivers')} />
                <CustomTab value="CopyReceivers" label="گیرندگان رونوشت" isActive={activate === 'CopyReceivers'} onClick={() => setActivate('CopyReceivers')} />
            </TabsHeader>
            <TabsBody className='w-full h-full'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <TabPanel className='h-full w-full m-0 p-0' value='MainReceivers'>
                    <MainReceiver />
                </TabPanel>
                <TabPanel className='h-full w-full m-0 p-0' value='CopyReceivers'>
                    <CopyReceiver />
                </TabPanel>
            </TabsBody>
        </Tabs>
    )
}

export default ReceiversMainContainer