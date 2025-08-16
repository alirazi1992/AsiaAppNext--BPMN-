'use client';
import React from 'react';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';

const Loading = () => {
    const color = useStore(colorStore, (state: any) => state);
    const themeMode = useStore(themeStore, (state: any) => state);
    return (

        <div className={'flex justify-center rounded-lg items-center w-full h-full absolute z-[1000] ' + (themeMode?.stateMode ? " bg-blue-50/20" : " bg-gray-900/25")}>
            <div className="loader">
                <span style={{ background: color?.color }} className="bar"></span>
                <span style={{ background: color?.color }} className="bar"></span>
                <span style={{ background: color?.color }} className="bar"></span>
            </div>
        </div>
    )
}
export default Loading; 