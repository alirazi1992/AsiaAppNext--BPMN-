

'use client';
import { Carousel } from '@material-tailwind/react';
import Image from 'next/image';
import React from 'react';
import Img1 from './../../../assets/images/8.jpg';
import Img2 from './../../../assets/images/12.jpg';
import Img3 from './../../../assets/images/7.jpg';
import Img4 from './../../../assets/images/1.jpg';
import Img5 from './../../../assets/images/4.jpg';
import Img6 from './../../../assets/images/6.jpg';
import Img7 from './../../../assets/images/5.jpg';
import styles from './../../../assets/styles/LoginCarousel.module.css';

export default function LoginCarousel() {
    const images = [Img1, Img2, Img3, Img4, Img5, Img6, Img7]
    return (
        <section className={"hidden lg:flex lg:w-[59%] h-[100vh] bg-black overflow-hidden relative sliderBox " + styles.sliderBox}>
            <Carousel navigation={({ setActiveIndex, activeIndex, length }) => (
                <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                    {new Array(length).fill("").map((_, i) => (
                        <span
                            key={i}
                            className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"}`}
                            onClick={() => setActiveIndex(i)} />
                    ))}
                </div>
            )}
                autoplay className="rounded-xl h-full" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {images.map((val: any, i: number) => {
                    return (
                        <div key={i} className='w-full h-full'>
                            <Image
                                className="flex h-full object-cover w-full" alt='asiaApp-img'
                                src={val} />
                        </div>
                    )
                })}
            </Carousel>
        </section >
    )
}
