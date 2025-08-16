
'use client';
import React from 'react';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { Card, Typography } from '@material-tailwind/react';

const ErrorComponent = () => {

    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)

    return (
        <section className="w-full h-[100vh] md:h-[calc(100vh-100px)]">
            <section className='container-fluid mx-auto h-full'>
                <section className="flex flex-row h-full justify-center items-center">
                    <section className="w-[97%] h-[98%] flex justify-center items-center">
                        <Typography variant='h2' style={{ backgroundImage: ` linear-gradient(to left,  #031B29 0%, #031B29 42.5%, ${color?.color} 50%,  #031B29 57.5%,  #031B29 100%)` }} id="statusCode" className='text-[15vh] md:text-[22.5vh] lg:text-[30vh] xl:text-[40vh]  number font-[700] flex justify-center items-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Error
                        </Typography>
                        {/* <p style={{ textShadow: `1px 1px 1px ${color?.color}` }} className={`capitalize text-center my-1 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}></p> */}
                    </section>
                </section>
            </section>
        </section>
    )
}

export default ErrorComponent;

