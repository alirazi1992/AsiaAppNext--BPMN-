'use client';
import React from 'react';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';

const Loading = () => {
    const color = useStore(colorStore, (state: any) => state);
    return (

        <div className={'flex justify-center rounded-lg items-center w-full h-full absolute z-[99] bg-gray-900/50  '}>
            {/* // <div className={'flex justify-center rounded-lg items-center w-full h-full absolute z-[99]  '}> */}
            <div className="loader">
                <span style={{ background: color?.color }} className="bar"></span>
                <span style={{ background: color?.color }} className="bar"></span>
                <span style={{ background: color?.color }} className="bar"></span>
            </div>
        </div>

    )
}
export default Loading; 