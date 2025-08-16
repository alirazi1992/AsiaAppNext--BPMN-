'use client';
import React from 'react';
import colorStore from '../../zustandData/color.zustand';
import useStore from "./../../hooks/useStore";
import { Button } from '@material-tailwind/react';
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: string
}
const ButtonComponent = ({ type = 'button', children, onClick }: ButtonProps) => {
  const color = useStore(colorStore, (state) => state)
  return (
    <section aria-hidden="false" className="h-[80px] w-[98%] md:w-[96%] mx-auto flex justify-start items-center py-3">
      <Button type={type as 'button' | 'submit' | 'reset'} className="text-xs font-[400] w-[125px] h-[40px] capitalize" style={{ background: color?.color }} onClick={onClick}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{children}</Button>
    </section>
  )
}
export default ButtonComponent