// 'use client';
// import { Button, CardBody, Popover, PopoverContent, PopoverHandler, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip, Typography } from '@material-tailwind/react';
// import React, { Fragment, Suspense, useCallback, useEffect, useState } from 'react';
// import colorStore from '@/app/zustandData/color.zustand';
// import themeStore from '@/app/zustandData/theme.zustand';
// import { useRouter } from 'next/navigation';
// import useStore from "@/app/hooks/useStore";
// import { SearchDocsModel } from '@/app/models/Automation/SearchModel'
// import activeStore from '@/app/zustandData/activate.zustand';
// // ***icons
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import InfoIcon from '@mui/icons-material/Info';
// import TableSkeleton from '@/app/components/shared/TableSkeleton';

// interface Props {
//   data: SearchDocsModel[],
//   loading: boolean
// }

// const SearchAutomationTableComponent = (props: Props) => {
//   const activeState = activeStore();
//   const themeMode = useStore(themeStore, (state) => state);
//   const color = useStore(colorStore, (state) => state)
//   const router = useRouter();
//   const GetDocumentData = (docTypeId: string, docHeapId: string) => {
//     if (router) {
//       activeStore.setState((state) => ({ ...state, activeSubLink: "New Document" }))
//       window.open(`/Home/NewDocument?doctypeid=${docTypeId}&docheapid=${docHeapId}`)
//     }
//   };

//   return (

//     <CardBody className='w-[98%] lg:w-[96%] mx-auto relative rounded-lg overflow-auto p-0' >
//       {props.loading == false ?
//         props.data.length > 0 &&
//         (<table dir="rtl" className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center  `}>
//           <thead>
//             <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//               <th style={{ borderBottomColor: color?.color }}
//                 className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//               >
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                 >
//                   #
//                 </Typography>
//               </th>
//               <th style={{ borderBottomColor: color?.color }}
//                 className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//               >
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-[700] text-[12px] p-1.5`}
//                 // style={{
//                 //   width: "3%",
//                 //   writingMode: "vertical-rl",
//                 //   textOrientation: "mixed"
//                 // }}
//                 >
//                   نوع
//                 </Typography>
//               </th>
//               <th style={{ borderBottomColor: color?.color }}
//                 className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//               >
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                 >
//                   شماره مدرک
//                 </Typography>
//               </th>
//               <th style={{ borderBottomColor: color?.color }}
//                 className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//               >
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                 >
//                   شماره صادره / وارده
//                 </Typography>
//               </th>
//               <th style={{ borderBottomColor: color?.color }}
//                 className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//               >
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                 >
//                   تاریخ ایجاد
//                 </Typography>
//               </th>
//               <th style={{ borderBottomColor: color?.color }}
//                 className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//               >
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                 >
//                   تاریخ امضا
//                 </Typography>
//               </th>
//               <th style={{ borderBottomColor: color?.color }}
//                 className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//               >
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                 >
//                   تاریخ صادره / وارده
//                 </Typography>
//               </th>
//               <th style={{ borderBottomColor: color?.color }}
//                 className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//               >
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                 >
//                   فرستنده
//                 </Typography>
//               </th>
//               <th style={{ borderBottomColor: color?.color }}
//                 className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//               >
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                 >
//                   مخاطب
//                 </Typography>
//               </th>
//               <th style={{ borderBottomColor: color?.color }}
//                 className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//               >
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                 >
//                   موضوع
//                 </Typography>
//               </th>
//               <th style={{ borderBottomColor: color?.color }}
//                 className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//               >
//                 <Typography
//                   variant="small"
//                   color="blue-gray"
//                   className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                 >
//                   عملیات
//                 </Typography>
//               </th>
//             </tr>
//           </thead>
//           <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>

//             {props?.data.map((item: SearchDocsModel, index: number) => {
//               return (
//                 <tr key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                   <td style={{ width: '3%' }} className='p-1'>
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className={`font-[700] text-[13px] p-0.5 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                     >
//                       {Number(index) + Number(1)}
//                     </Typography>
//                   </td>
//                   <td style={{ width: '3%' }} className='p-1'>
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[12px] p-1.5`}
//                     // style={{
//                     //   writingMode: "vertical-rl",
//                     //   textOrientation: "mixed"
//                     // }}
//                     >
//                       {item.docTypeTitle}
//                     </Typography>
//                   </td>
//                   <td style={{ width: '5%' }} className='p-1'>
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className={`font-[500] text-[13px] p-0.5 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                     >
//                       {item.indicator}
//                     </Typography>
//                   </td>
//                   <td style={{ width: '5%' }} className='p-1'>
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className={`font-[500] text-[13px] p-0.5 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                     >
//                       {item.submitIndicator ?? "-"}
//                     </Typography>
//                   </td>
//                   <td style={{ width: '5%' }} className='p-1'>
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className={`font-[500] text-[13px] p-0.5 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                     >
//                       {item.createDate ?? "-"}
//                     </Typography>
//                   </td>
//                   <td style={{ width: '5%' }} className='p-1'>
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className={`font-[500] text-[13px] p-0.5 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                     >
//                       {item.documentDate ?? "-"}
//                     </Typography>
//                   </td>
//                   <td style={{ width: '5%' }} className='p-1'>
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className={`font-[500] text-[13px] p-0.5 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                     >
//                       {item.submitDate ?? "-"}
//                     </Typography>
//                   </td>
//                   <td style={{ width: "10%" }} className='px-1'>
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[13px] p-0.5 `}
//                     >
//                       {item.sender ?? "-"}
//                     </Typography>
//                   </td>
//                   <td style={{ width: "30%" }} className='px-1'>
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[13px] p-0.5 `}
//                     >
//                       {(item.mainReceiver != null && item.mainReceiver.length > 0) ? item.mainReceiver[0] : "-"}
//                     </Typography>
//                   </td>
//                   <td style={{ width: "15%" }} className='p-1'>
//                     <Typography
//                       variant="small"
//                       color="blue-gray"
//                       className={`font-[500] text-[13px] p-0.5 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                     >
//                       {item.subject}
//                     </Typography>
//                   </td>
//                   <td style={{ width: '7%' }} className='p-1'>
//                     <div className='container-fluid mx-auto p-0.5'>
//                       <div className="flex flex-row justify-evenly">
//                         <Button

//                           onClick={() => GetDocumentData(item.docTypeId.toString(), item.docHeapId.toString())}
//                           size="sm"
//                           className="p-1 mx-1"
//                           style={{ background: color?.color }}
//                         >
//                           <VisibilityIcon
//                             fontSize='small'
//                             className='p-1'
//                             onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                             onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                         </Button>
//                         <Popover placement="bottom">
//                           <PopoverHandler>
//                             <Button

//                               size="sm"
//                               className="p-1 mx-1"
//                               style={{ background: color?.color }}
//                             >

//                               <Tooltip content="اطلاعات تکمیلی" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                                 <InfoIcon

//                                   fontSize="small"
//                                   className='p-1'
//                                   onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                   onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                                 />
//                               </Tooltip>
//                             </Button>
//                           </PopoverHandler>
//                           <PopoverContent className="z-[9999] border-none py-[10px] bg-blue-gray-600 text-white" dir="rtl">
//                             مخاطب :   {item.mainReceiver != null && item.mainReceiver.length > 0 &&
//                               item.mainReceiver?.map((option: string, num: number) => {
//                                 return (<p key={num} dir='rtl'>{(num + 1) + "." + option + `, `}</p>)
//                               })
//                             }
//                             محل بایگانی : {item.workOrderArchiveDirectory ? item.workOrderArchiveDirectory : item.jobArchiveDirectory}
//                           </PopoverContent>
//                         </Popover>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>) : <TableSkeleton className="my-auto" />}
//     </CardBody >
//   )
// }



// export default SearchAutomationTableComponent; 