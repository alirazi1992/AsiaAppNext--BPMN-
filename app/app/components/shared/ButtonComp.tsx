'use client';
import React from 'react';
import colorStore from '../../zustandData/color.zustand';
import { Button } from '@material-tailwind/react';
import useStore from "./../../hooks/useStore";
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: string
    disabled?: boolean
}
const ButtonComponent = ({ type = 'button', children, onClick, disabled }: ButtonProps) => {
    const color = useStore(colorStore, (state) => state)
    return (
        <section aria-hidden="false" className="h-[80px] w-[99%]  mx-auto flex justify-end items-center py-3">
            <Button disabled={disabled} type={type as 'button' | 'submit' | 'reset'} className="text-xs font-[400] w-[125px] h-[40px]" style={{ background: color?.color }} onClick={onClick} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{children}</Button>
        </section>
    )
}
export default ButtonComponent; 