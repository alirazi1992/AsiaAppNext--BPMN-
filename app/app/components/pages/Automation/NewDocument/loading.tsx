
// 'use client';
// import React from 'react';
// import themeStore from './../../../../zustandData/theme.zustand';
// import colorStore from './../../../../zustandData/color.zustand';
// import useStore from './../../../../hooks/useStore'

// const Loading = () => {
//     const color = useStore(colorStore, (state: any) => state);
//     return (
//         <section className="w-full h-[100vh] md:h-[calc(100vh-100px)]">
//             <section className='container-fluid mx-auto h-full'>
//                 <section className="flex flex-row h-full justify-center items-center">
//                     <section className="w-[97%] h-[98%] flex justify-center items-center">
//                         <div className="loader">
//                             <span style={{ background: color?.color }} className="bar"></span>
//                             <span style={{ background: color?.color }} className="bar"></span>
//                             <span style={{ background: color?.color }} className="bar"></span>
//                         </div>

//                     </section>
//                 </section>
//             </section>
//         </section>
//     )
// }
// export default Loading; 