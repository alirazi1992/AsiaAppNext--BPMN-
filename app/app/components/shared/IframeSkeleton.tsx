'use-client';
import { Skeleton } from '@mui/material';
import React from 'react'
const IframeSkeleton = () => {
    return (
        <Skeleton variant="rounded" sx={{ background: "gray", width: "100%", height: "100%" }}  />
    )
}
export default IframeSkeleton