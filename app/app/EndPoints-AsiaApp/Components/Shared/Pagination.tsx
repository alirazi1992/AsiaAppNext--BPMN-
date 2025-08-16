'use client'
import { SharedPaginationProps } from '@/app/Domain/shared'
import { Pagination, Stack } from '@mui/material'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import React from 'react'

const CustomizedPagination: React.FC<SharedPaginationProps> = ({ className, count, handlePage, page }) => {
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    return (
        <section className={'flex justify-center my-3 ' + className}>
            {count > 0 && (<Stack spacing={1} >
                <Pagination
                    page={page}
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: !themeMode || themeMode?.stateMode ? 'lightText' : 'darkText',
                            backgroundColor: 'transparent'
                        },
                        '& .MuiPaginationItem-outlined': {
                            outline: color?.color,
                            color: color?.color,
                            borderColor: color?.color,
                        },
                        '& .Mui-selected': {
                            color: 'white',
                            backgroundColor: color?.color + '80',
                        }
                    }}
                    onChange={(e, value) => handlePage(value)}
                    hidePrevButton hideNextButton count={count} variant="outlined" size="small" shape="rounded" />
            </Stack>)}
        </section>

    )
}

export default CustomizedPagination