
'use client';
import { Breadcrumbs } from '@material-tailwind/react'
import React from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import activeStore from '@/app/zustandData/activate.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
const BreadcrumbsComponent = () => {
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const acativeStore = useStore(activeStore, (state) => state)
  const router = useRouter();
  return (
    <>
      <Breadcrumbs separator="/" className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} hidden md:flex`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <HomeIcon fontSize='small' onClick={() => { router.push("/Home"), activeStore.setState((state) => ({ ...state, activate: "", activeSubLink: "", activeSubMenu:'' })) }} className={`opacity-65 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`} />
        {acativeStore?.activate != "" && (<a href="#" className={`opacity-65 font-[500] text-[13px] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>
          {acativeStore?.activate}
        </a>)}
        {/* {(acativeStore?.activeSubMenu != "" || acativeStore?.activeSubMenu != null) && (<a style={{ color: color?.color }} className={themeMode?.textColor + " font-[500] text-[13px]"}>{acativeStore?.activeSubMenu}</a>)} */}
        {acativeStore?.activeSubLink != "" && (<a style={{ color: color?.color }} className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[13px]`}>{acativeStore?.activeSubLink}</a>)}
      </Breadcrumbs>
    </>
  )
}

export default BreadcrumbsComponent; 
