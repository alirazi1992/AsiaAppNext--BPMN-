'use client';
import React from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';

const PopovelListItem = ({ onClick, item }: {
    onClick: () => void,
    Name: any,
    activate: string,
    item: string,
}) => {
    const themeMode = useStore(themeStore, (state) => state)
    return (
        <li dir='rtl' onClick={onClick} className={`text-right my-2 p-2 hover:bg-blue-gray-500/10 rounded-md text-sm font-thin cursor-pointer ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>
            <span className='mx-2'>{item}</span>
        </li>
    )
}

export default PopovelListItem