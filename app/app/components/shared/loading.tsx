'use client';
import React from 'react';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';

const Loading = () => {
    const color = useStore(colorStore, (state: any) => state);
    return (

        <div className='w-full h-[87vh] flex justify-center items-center'>
            <div className="loader">
                <span style={{ background: color?.color }} className="bar"></span>
                <span style={{ background: color?.color }} className="bar"></span>
                <span style={{ background: color?.color }} className="bar"></span>
            </div>
        </div>

    )
}
export default Loading; 
