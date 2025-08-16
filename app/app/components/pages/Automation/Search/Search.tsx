// 'use client';
// import React, { ReactComponentElement, RefObject, Suspense, useCallback, useEffect, useRef, useState } from 'react';
// import { Card, Drawer, IconButton, Typography } from '@material-tailwind/react';
// import themeStore from '@/app/zustandData/theme.zustand';
// import colorStore from '@/app/zustandData/color.zustand';
// import SearchForm from './SearchForm';
// import ButtonComp from '@/app/components/shared/ButtonComp';
// import SearchInputsStore from "@/app/zustandData/searchPage.zustand"
// import SearchTable from './SearchTable';
// import useAxios from '@/app/hooks/useAxios';
// import useStore from '@/app/hooks/useStore';
// import searchResult from '@/app/zustandData/showsearchResult.zustand'
// import { Response, SearchDocsModel } from '@/app/models/Automation/SearchModel';
// import Swal from 'sweetalert2';
// import { AxiosResponse } from 'axios';
// import { Pagination, Stack } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import TableSkeleton from '@/app/components/shared/TableSkeleton';

// const SearchComponent = () => {
//   const color = useStore(colorStore, (state) => state)
//   const [openRight, setOpenRight] = React.useState(true);
//   const openDrawerRight = () => setOpenRight(true);
//   const closeDrawerRight = () => setOpenRight(false);
//   const ShowTable = searchResult();
//   const [loadings, setLoadings] = useState<boolean>(false)
//   const [foundDocuments, setFoundDocuments] = useState<SearchDocsModel[]>([]);
//   let [count, setCount] = useState<number>(0);
//   const { Inputs } = SearchInputsStore();
//   const themeMode = useStore(themeStore, (state) => state)
//   const drawerRef = useRef() as RefObject<HTMLInputElement>;
//   const SearchDocs = useCallback(async (pageNo: number) => {
//     // Drawer.current.focus();
//     setLoadings(true);
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/searchdocs`
//     let method = "post"
//     let data = { param: JSON.stringify({ ...Inputs, DocTypeId: Inputs.DocTypeId!.value }), page: pageNo, count: 10 }
//     closeDrawerRight()
//     let response: AxiosResponse<Response<SearchDocsModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
//     if (response) {
//       setLoadings(false)
//       if (response.data.data != null && response.data.data.length > 0) {
//         let paginationCount = Math.ceil(Number(response.data.data[0]?.totalCount) / Number(10));
//         setCount(paginationCount)
//         setFoundDocuments(response.data.data);
//       } else {
//         Swal.fire({
//           background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//           color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
//           allowOutsideClick: false,
//           title: "Search Document",
//           text: response.data.message,
//           icon: (response.data.status && (response.data.data?.length == 0 || response.data.data == null)) ? "warning" : "error",
//           confirmButtonColor: "#22c55e",
//           confirmButtonText: "OK",
//         })
//       }
//     }
//   }, [Inputs, !themeMode ||themeMode?.stateMode])


//   useEffect(() => {
//     if (drawerRef.current) {
//       drawerRef.current.focus();
//       drawerRef.current.click();
//     }
//   }, []);

//   return (
//     <section >
//       <ButtonComp onClick={openDrawerRight}>فیلتر ها</ButtonComp>
//       <SearchTable data={foundDocuments} loading={loadings} />
//       {count > 1 && <section className='flex justify-center my-3'>
//         <Stack onClick={(e: any) => { setFoundDocuments([]), SearchDocs(e.target.innerText) }} spacing={1}>
//           <Pagination hidePrevButton hideNextButton count={count} variant="outlined" size="small" shape="rounded" />
//         </Stack>
//       </section>}
//       <Drawer
//         ref={drawerRef}
//         size={460}
//         placement="right"
//         open={openRight}
//         onClose={closeDrawerRight}
//         onKeyDown={(e: any) => { if (e.key === 'Enter' || e.key === 13) { SearchDocs(1) } }}
//         onKeyUp={(e: any) => { if (e.key === 'Enter' || e.key === 13) { SearchDocs(1) } }}
//         // className={" h-auto overflow-y-auto " + themeMode?.themeCard}
//         className={`h-auto overflow-y-auto ${!themeMode ||themeMode?.stateMode ? 'cardDark' : 'cardLight'}`}
//       >
//         <div className="my-3 w-[96%] mx-auto flex items-center justify-between">
//           <IconButton
//             variant="text"
//             color="blue-gray"
//             onClick={closeDrawerRight}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="h-5 w-5"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </IconButton>
//           <Typography variant="h5" className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>
//             فیلترها
//           </Typography>
//         </div>
//         <section>
//           <SearchForm />
//           <section className='sticky bottom-5 right-10 z-[500]'>
//             <IconButton size='lg' style={{ background: color?.color }} onClick={() => { setFoundDocuments([]), SearchDocs(1) }} className="rounded-full ml-5">
//               <SearchIcon
//                 className='p-2/4'
//                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//             </IconButton>
//           </section>
//         </section>
//       </Drawer>
//     </section>

//   )
// }

// export default SearchComponent; 