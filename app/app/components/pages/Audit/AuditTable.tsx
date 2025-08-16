
// 'use client';
// import { CardBody, Typography } from "@material-tailwind/react";
// import themeStore from '@/app/zustandData/theme.zustand';
// import colorStore from '@/app/zustandData/color.zustand';
// import useStore from '@/app/hooks/useStore';
// import { GetResultAuditSearch, LogsModel } from "@/app/models/Autit/AuditModels";
// import TableSkeleton from "@/app/components/shared/TableSkeleton";
// import moment from 'jalali-moment';

// const AuditTable = ({ loadingState, tableData }: any) => {
//     const themeMode = useStore(themeStore, (state) => state)
//     const color = useStore(colorStore, (state) => state)
//     return (
//         <CardBody className='w-[98%] md:w-[96%] h-[67vh] relative rounded-lg overflow-auto p-0 mx-auto'>
//             {loadingState == false ? tableData.length > 0 && <table dir="rtl" className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} w-full relative text-center max-h-[68vh] `}>
//                 <thead>
//                     <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                         <th style={{ borderBottomColor: color?.color, width: "3%" }}
//                             className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                         >
//                             <Typography
//                                 variant="small"
//                                 color="blue-gray"
//                                 className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                             >
//                                 #
//                             </Typography>
//                         </th>
//                         <th style={{ borderBottomColor: color?.color }}
//                             className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                         >
//                             <Typography
//                                 variant="small"
//                                 color="blue-gray"
//                                 className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                             >
//                                 زمان
//                             </Typography>
//                         </th>
//                         <th style={{ borderBottomColor: color?.color }}
//                             className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                         >
//                             <Typography
//                                 variant="small"
//                                 color="blue-gray"
//                                 className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                             >
//                                 عامل
//                             </Typography>
//                         </th>
//                         <th style={{ borderBottomColor: color?.color }}
//                             className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                         >
//                             <Typography
//                                 variant="small"
//                                 color="blue-gray"
//                                 className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                             >
//                                 توضیحات
//                             </Typography>
//                         </th>
//                     </tr>
//                 </thead>
//                 <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                     {tableData.map((item: LogsModel, index: number) => {
//                         return (
//                             <tr className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`} key={"AuditItems" + index}>
//                                 <td style={{ width: '3%' }} className='p-1'>
//                                     <Typography
//                                         variant="small"
//                                         color="blue-gray"
//                                         className={`font-normal p-0.5 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                     >
//                                         {Number(index + 1)}
//                                     </Typography>
//                                 </td>
//                                 <td style={{ width: '25%' }} className='p-1'>
//                                     <Typography
//                                         variant="small"
//                                         color="blue-gray"
//                                         className={`font-normal p-0.5 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                     >
//                                         {item.actionDate!=='' ? moment(item.actionDate, 'YYYY/MM/DD HH:mm:SS').format("jYYYY/jMM/jDD HH:mm:SS"):''}
//                                     </Typography>
//                                 </td>
//                                 <td style={{ width: '25%' }} className='p-1'>
//                                     <Typography
//                                         variant="small"
//                                         color="blue-gray"
//                                         className={`font-normal p-0.5 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                     >
//                                         {item.actorName}
//                                     </Typography>
//                                 </td>
//                                 <td className='p-1'>
//                                     <Typography
//                                         variant="small"
//                                         color="blue-gray"
//                                         className={`font-normal p-0.5 whitespace-nowrap ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                     >
//                                         {item.actionDesc}
//                                     </Typography>
//                                 </td>
//                             </tr>
//                         )
//                     })
//                     }
//                 </tbody>
//             </table> : <TableSkeleton />}
//         </CardBody>
//     )
// }
// export default AuditTable;