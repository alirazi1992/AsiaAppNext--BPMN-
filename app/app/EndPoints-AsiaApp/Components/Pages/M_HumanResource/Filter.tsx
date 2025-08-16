'use client';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react'
import MyCustomComponent from '../../Shared/CustomTheme_Mui'
import { Drawer, IconButton, Typography } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import FilterForm from './FilterForm';
// import { SearchContext } from './MainContainer';
import { CloseIcon } from '../../Shared/IconComponent';

const Filter = forwardRef((props: any, ref) => {
    const FormRef = useRef<{ handleOpen: () => void } | null>(null);
    const themeMode = useStore(themeStore, (state) => state)
    const [openRight, setOpenRight] = React.useState(true);
    const openDrawerRight = () => setOpenRight(true);
    const closeDrawerRight = () => setOpenRight(false);

    // const { SearchDocs } = useContext(SearchContext)

    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            openDrawerRight()
        },
        handleClose: () => {
            closeDrawerRight()
        },
    }));

    return (
        <MyCustomComponent>
            <>
            <Drawer
                    size={480}
                    placement="right"
                    open={openRight}
                    onClose={closeDrawerRight}
                    className={`overflow-y-auto ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <div className="my-3 w-[96%] mx-auto flex items-center justify-between">
                    <CloseIcon onClick={closeDrawerRight} />
                    <Typography variant="h5" className={!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        فیلترها
                    </Typography>
                </div>
                <section>
                    <FilterForm  />
                </section>
            </Drawer>
            </>
        </MyCustomComponent>
    )
})
Filter.displayName = 'Filter'

export default Filter