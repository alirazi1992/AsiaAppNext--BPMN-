'use client';
import React, { createContext, forwardRef, useContext, useImperativeHandle } from 'react'
import MyCustomComponent from '../../Shared/CustomTheme_Mui'
import { Drawer, IconButton, Typography } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { AuditContext } from './MainContainer';
import AuditForm from './AuditForm';
import { CloseIcon } from '../../Shared/IconComponent';


export const FilterCntext = createContext<any>(null)
const Filter = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const [openRight, setOpenRight] = React.useState(true);
    const openDrawerRight = () => setOpenRight(true);
    const closeDrawerRight = () => setOpenRight(false);

    const {FormRef } = useContext(AuditContext)

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
                    size={460}
                    placement="right"
                    open={openRight}
                    onClose={closeDrawerRight}
                    className={` ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <div className="my-3 w-[96%] mx-auto flex items-center justify-between">
                    <CloseIcon onClick={closeDrawerRight} />
                    <Typography variant="h5" className={!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        فیلترها
                    </Typography>
                </div>
                <section>
                    <AuditForm ref={FormRef} />
                </section>
            </Drawer>
            </>
        </MyCustomComponent>
    )
})
Filter.displayName = 'Filter'

export default Filter