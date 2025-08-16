
'use client';
import React from 'react';
import colorStore from '../zustandData/color.zustand';
import themeStore from '../zustandData/theme.zustand';
import useStore from "./../hooks/useStore";
import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/navigation';
import ButtonComponent from '@/app/components/shared/ButtonComponent';

const NotFoundPage = () => {

  const color = useStore(colorStore, (state) => state)
  const themeMode = useStore(themeStore, (state) => state)
  const router = useRouter()

  return (
    <section className={`w-full h-[100vh] RulesClass ${!themeMode ||themeMode?.stateMode ? 'contentDark' : 'contentLight'}`}>
      <section className='container-fluid mx-auto h-full'>
        <section className="w-full h-full flex flex-col items-center justify-center">
          <Typography variant='h2' style={{ backgroundImage: ` linear-gradient(to left,  #031B29 0%, #031B29 42.5%, ${color?.color} 50%,  #031B29 57.5%,  #031B29 100%)` }} id="statusCode" className='text-[15vh] md:text-[22.5vh] lg:text-[30vh] xl:text-[40vh] flex justify-center items-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            404 <Typography variant='small'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Error</Typography>
          </Typography>
          <p style={{ textShadow: `1px 1px 1px ${color?.color}` }} className={`capitalize text-center my-1 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>the requested resource was not found</p>
          <ButtonComponent onClick={() => router.back()}>Back</ButtonComponent>
        </section>
      </section>
    </section>
  )
}

export default NotFoundPage;

