'use client';
import { Button, Tab, Tooltip } from '@material-tailwind/react'
import React from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';

const CustomButton = ({ backgroundColor, tooltipContent, IconComponent, onClick }: any) => {
    const themeMode = useStore(themeStore, (state) => state)
    return (
        <Tooltip content={tooltipContent} className={!themeMode ||themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'}>
            <Button
                onClick={onClick}
                size="sm"
                className="p-1 mx-1"
                style={{ background: backgroundColor }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
                <IconComponent
                    fontSize='small'
                    className='p-1'
                    onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                    onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                />
            </Button>
        </Tooltip>
    )
}

export default CustomButton
