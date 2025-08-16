import { Grid, Skeleton } from '@mui/material'
import React, { useContext } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import { KeywordsContext } from '@/app/EndPoints-AsiaApp/Components/Pages/M_Automation/NewDocument/Keyword-RelatedDocuments/MainContainers';

const TableSkeleton = (props: any) => {
    const themeMode = useStore(themeStore, (state) => state)
    return (
        <Grid container wrap="nowrap" className={props.className + " flex items-center h-full w-full"}>
            <table dir='rtl' className='w-full mx-auto h-[190px]'>
                <thead className=' w-full' >
                    <tr className='flex p-1 w-full'>
                        <td className='w-[5%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                        <td className='w-[95%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                    </tr>
                </thead>
                <tbody dir="rtl" className=' w-full' >
                    <tr className='flex p-1 w-full'>
                        <td className='w-[5%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                        <td className='w-[95%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                    </tr>
                    <tr className='flex p-1 w-full'>
                        <td className='w-[5%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                        <td className='w-[95%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                    </tr>
                    <tr className='flex p-1 w-full'>
                        <td className='w-[5%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                        <td className='w-[95%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                    </tr>
                    <tr className='flex p-1 w-full'>
                        <td className='w-[5%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                        <td className='w-[95%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                    </tr>
                    <tr className='flex p-1 w-full'>
                        <td className='w-[5%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                        <td className='w-[95%]'>
                            <Skeleton sx={{ background: !themeMode ||themeMode?.stateMode ? "#52687c1a" : "#52525240" }} animation="wave" variant="rounded" height={30} />
                        </td>
                    </tr>

                </tbody>
            </table>
        </Grid>
    )
}

export default TableSkeleton