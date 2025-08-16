'use client';
import { Skeleton } from '@mui/material';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import React from 'react'
const InputSkeleton = () => {
    const themeMode = useStore(themeStore , (state)=>state)
    return (
        <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240", width: "100%" }} variant="rounded" height={35} />
    )
}
export default InputSkeleton