// "use client";
// import { Button, CardBody, Input, Tooltip } from '@material-tailwind/react';
// import React from 'react'
// import useStore from "@/app/hooks/useStore";
// import SearchIcon from '@mui/icons-material/Search';
// import colorStore from '@/app/zustandData/color.zustand';
// import themeStore from '@/app/zustandData/theme.zustand';
// import AddIcon from '@mui/icons-material/Add';
// import { useRouter } from 'next/navigation';

// const SearchProcess = () => {
//     const themeMode = useStore(themeStore, (state) => state);
//     const color = useStore(colorStore, (state) => state)
//     const router = useRouter()
//     return (
//         <CardBody className={"w-[98%] md:w-[96%] my-3 mx-auto " + themeMode?.themeCard}>
//             <div className="w-full">
//                 <div className="container-fluid mx-auto">
//                     <div className="flex flex-col md:flex-row justify-end md:justify-between items-center">
//                         <div className='w-full flex justify-start my-2 md:my-0'>
//                             <Tooltip content="New Process" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                                 <Button
//                                     onClick={() => router.push("/Home/ProcessProductionEng/NewProcess")}
//                                     size="sm"
//                                     className="p-1 mx-1"
//                                     style={{ background: color?.color }}
//                                 >
//                                     <AddIcon
//                                         fontSize='small'
//                                         className='p-1'
//                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                 </Button>
//                             </Tooltip>
//                         </div>
//                         <div className="relative w-[90%] flex">
//                             <Input
//                                 dir='rtl'
//                                 crossOrigin=""
//                                 style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
//                                 type="text"
//                                 label="search"
//                                 className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} pr-10 p-2`}
//                                 containerProps={{
//                                     className: !themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'
//                                 }}
//                             //   onBlur={(e: any) => { setSearchText(e.target.value), e.target.value.toString().trim() == "" && setShowData(null) }}
//                             />
//                             <Button
//                                 size="sm"
//                                 className="!absolute right-1 top-1 rounded p-1"
//                                 style={{ background: color?.color }}
//                             //   onClick={() => { SearchArchives(), setShowData(resultData) }}
//                             >
//                                 <SearchIcon
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                                 />
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </CardBody>
//     )
// }

// export default SearchProcess