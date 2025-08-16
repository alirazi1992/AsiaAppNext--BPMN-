'use client';
import { Typography } from '@material-tailwind/react';
import React from 'react';
import themeStore from '../../zustandData/theme.zustand';
import useStore from './../../hooks/useStore'; 
interface TextProps {
  children: React.ReactNode,
}
const TitleComponent = ({ children }: TextProps) => {
  const themeMode = useStore(themeStore, (state)=>state) 
  return (
    <section className='w-100'>
      <Typography dir='rtl' variant="h5" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} py-4 px-6 text-right font-[500] whitespace-nowrap `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        {children}
      </Typography>
    </section>
  )
}
export default TitleComponent; 