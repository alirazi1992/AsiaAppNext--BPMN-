'use client';
import { Tab, Typography } from '@material-tailwind/react';
import React from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';


const CustomTab = ({ value, label, isActive, onClick }: any) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    return (
        <Tab className='min-w-max' value={value} onClick={onClick}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <Typography
                variant='h6'
                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm`}
                style={{ color: isActive ? "white" : "" }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
                {label}
            </Typography>
        </Tab>)
}

export default CustomTab