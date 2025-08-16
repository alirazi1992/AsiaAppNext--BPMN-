import React from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import colorStore from '@/app/zustandData/color.zustand';
import { Button, Typography } from '@material-tailwind/react';

export const Th = ({ value }: any) => {
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state);
    return (
        <th style={{ borderBottomColor: color?.color + '50' }} className={`p-2 sticky top-0 border-b-2 ${themeMode?.stateMode ? 'themeDark' : 'themeLight'} `}>
            <Typography variant="small" color="blue-gray" className={`font-normal text-sm p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                {value}
            </Typography>
        </th>
    )
}
export const Td = ({ value, style, className }: any) => {
    const themeMode = useStore(themeStore, (state) => state);
    return (
        <td style={style} className={className}>
            <Typography variant="small" color="blue-gray" className={`font-thin text-xs ${themeMode?.stateMode ? 'lightText' : 'darkText'} `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {value}
            </Typography>
        </td>
    )
}

export const ActionButton = ({ onClick, children }: any) => {
    const color = useStore(colorStore, (state) => state);
    return (<Button
        onClick={onClick}
        size="sm"
        className="p-1 mx-1"
        style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}    >
        {children}
    </Button>)
}

export const Icon = ({ Name }: any) => {
    return (
        <Name
            fontSize='small'
            className='p-1'
            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
    )
}

export const ListItem = ({ title, content }: { title: string, content?: string | null }) => {
    const themeMode = useStore(themeStore, (state) => state);
    return (
        <>
            <Typography dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[FaBold]`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >{title}</Typography>
            <Typography dir='ltr' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[EnUltraLight]`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >{content}</Typography>
        </>
    )
}