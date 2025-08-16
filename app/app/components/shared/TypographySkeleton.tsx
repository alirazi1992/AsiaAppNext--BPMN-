import { Skeleton } from '@mui/material'
import React from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';

const TypographySkeleton = () => {
    const themeMode = useStore(themeStore , (state)=>state)
    return (
        <Skeleton variant="rounded" sx={{ Background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} height={25} />
    )
}

export default TypographySkeleton