// "use client"
// import { DefectanceModel, NotifMessageModel } from '@/app/zustandData/notif.zustand'
// import moment from 'jalali-moment'
// import React, { useEffect, useState } from 'react'
// import zustandStore from '@/app/zustandData/notif.zustand';
// import { Button, Typography } from '@material-tailwind/react';
// import useStore from "@/app/hooks/useStore";
// import themeStore from '@/app/zustandData/theme.zustand';

// const DefectenceNotif = (props: any, dismiss: any) => {
//     const themeMode = useStore(themeStore, (state) => state)
//     const Notif = zustandStore()

//     useEffect(() => {

//     }, [])


//     return (
//         <section className='text-[13px] text-white font-thin'>
//             <section className='flex justify-around items-center mb-4'>
//                 <Typography variant="paragraph" className=" text-[15px] w-[90%] text-white">{props.props.subject}</Typography>
//                 <button onClick={() => { Notif.removeMessage(props.props.index) }} type="button" className=" text-gray-400 hover:text-gray-100 rounded-md focus:ring-2 focus:ring-gray-200 p-1.5 inline-flex items-center justify-center w-5 h-5 dark:text-gray-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-warning" aria-label="Close">
//                     <span className="sr-only">Close</span>
//                     <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
//                         <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
//                     </svg>
//                 </button>
//             </section>
//             <p>{props.props.defectences.map((item: DefectanceModel) => {
//                 return `نام : ${item.faName} انقضاء: ${item.expireDate}`
//             }).join("\n")}</p>
//             <p><span className="mx-2 text-white">فرستنده :</span>{props.props.sender}</p>
//         </section>
//     )
// }

// export default DefectenceNotif