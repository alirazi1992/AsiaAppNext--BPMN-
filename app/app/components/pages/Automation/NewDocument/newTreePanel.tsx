// 'use client'
// import { Tree, TreeNode } from 'react-organizational-chart';
// import { Button, Card, Dialog, Popover, PopoverContent, PopoverHandler, TabPanel, Typography } from '@material-tailwind/react'
// import React, { useEffect, useRef, useState } from 'react';
// import StyledNode from './styledComponent';
// import useStore from '@/app/hooks/useStore';
// import colorStore from '@/app/zustandData/color.zustand';
// import themeStore from '@/app/zustandData/theme.zustand';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// import { ForwardStateEnum, OrgChartModel } from '@/app/models/Automation/NewDocumentModels';

// interface ChartStateModel {
//     props: {
//         hierarchy: OrgChartModel[],
//         index: number
//     }
// }
// export default function TreePanel(props: ChartStateModel) {
//     const themeMode = useStore(themeStore, (state) => state)
//     const [state, setState] = useState<boolean>(false)
//     const handleState = () => setState(!state)

//     let Node: OrgChartModel = props.props.hierarchy.find((item) => item.pid == null)!
//     const [treeItems, setTreeItems] = useState<OrgChartModel[]>(props.props.hierarchy.filter((item) => item.pid != null))
//     const [showInfo, setShowInfo] = useState(false);


//     const FindChild = (option: OrgChartModel, index: number) => {
//         return (
//             <TreeNode key={"hierarchy" + index + "hierarchy"}
//                 label={<StyledNode
//                     className="flex items-center "
//                     x={option!.StateId! > 0 ? [getStateColor(option!.StateId!)] : "#2292c3"} >
//                     <div
//                         onMouseLeave={() => { setShowInfo(false), setData(null) }}
//                         onMouseEnter={() => { setShowInfo(true), setData(option) }}
//                         className={`relartive h-full w-full flex items-center p-2 /4  ${!themeMode ||themeMode?.stateMode ? 'contentDark' : 'contentLight'}`}>
//                     <div className='p-1 w-full h-full flex flex-col justify-center'>
//                         <strong className={`select-none font-thin text-[13px] text-gray-600 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>{option.ActorFaName}</strong>
//                         <p className='text-blue-600 select-none text-[12px]'>{option.ActorFaRole}</p>
//                         <p style={{ color: option!.StateId! > 0 ? getStateColor(option!.StateId!) : "blue" }} className='select-none text-[12px]'>{option.State}</p>
//                         <div className='flex items-center justify-around'>
//                             <p className={`select-none text-[12px] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>{option.receiveType}</p>
//                             <p style={{ color: option.name == 'تایید شده' ? '#04ca6a' : option.name == 'رد شده' ? '#c40a0a' : '#f5d32d' }} className='select-none text-[12px] '>{option.name}</p>
//                         </div>
//                     </div>
//                 </div>
//                 </StyledNode >}
//             >
// {
//     treeItems.filter((item: OrgChartModel) => item.pid == option.id && item.id != option.id).map((item: OrgChartModel, index: number) => {
//         return FindChild(item, index)
//     })
// }
//             </TreeNode >
//         )
//     }
// const getSeenState = (stateId: number) => {
//     switch (stateId) {
//         case ForwardStateEnum.NotSeen:
//             return "مشاهده نشده";
//         case ForwardStateEnum.Pending:
//             return "درحال بررسی";
//         case ForwardStateEnum.Seen:
//             return "مشاهده شده";
//         case ForwardStateEnum.Confirm:
//             return "خاتمه یافته";
//         case ForwardStateEnum.Deny:
//             return "رد شده";
//         case ForwardStateEnum.Rejected:
//             return "برگشت داده شده";
//         default:
//             return "";
//     }
// }
// const getStateColor = (stateId: number) => {
//     switch (stateId) {
//         case ForwardStateEnum.Seen:
//             return '#f5d32d';
//         case ForwardStateEnum.NotSeen:
//             return "#2292c3";
//         case ForwardStateEnum.Pending:
//             return "#f5d32d";
//         case ForwardStateEnum.Confirm:
//             return "#04ca6a";
//         case ForwardStateEnum.Rejected:
//             return "#c40a0a";
//         case ForwardStateEnum.Deny:
//             return "#04ca6a";
//         default:
//             return "#2292c3";
//     }
// }

// let chart = useRef(null) as any
// let tabPanel = useRef(null) as any
// const [scale, setScale] = useState(1);

// const handleZoom = (event: any) => {
//     const newScale = scale - event.deltaY * 0.005;
//     const clampedScale = Math.min(Math.max(0.125, newScale), 2);
//     setScale(clampedScale);
// };

// const [data, setData] = useState<OrgChartModel | null>(null)
// const [drag, setDrag] = useState<boolean>(false)
// const [position, setPosition] = useState<{
//     x: number,
//     y: number,
// }>({ x: 0, y: 50 });

// const [startPosition, setStartPosition] = useState({
//     x: 0,
//     y: 0
// })

// useEffect(() => {
//     setPosition({
//         x: (tabPanel.current.clientWidth - chart.current.clientWidth) / 2,
//         y: 50
//     })
// }, [])


// return (
//     <>
//         <TabPanel
//             ref={tabPanel}
//             onWheel={(event: MouseEvent) => handleZoom(event)}
//             onMouseLeave={() => { setDrag(false), chart.current.classList.remove("cursor-grabbing") }}
//             onMouseDown={(event: any) => { setDrag(true), chart.current.classList.add("cursor-grabbing"), setPosition({ x: chart.current.offsetLeft, y: chart.current.offsetTop }), setStartPosition({ x: event.clientX, y: event.clientY }) }}
//             onMouseUp={() => { setDrag(false), chart.current.classList.remove("cursor-grabbing") }}
//             onMouseMove={(event: any) => { drag == true && (setStartPosition({ x: event.clientX, y: event.clientY }), setPosition((state) => ({ x: state.x! + (event.clientX - startPosition.x), y: state.y! + (event.clientY - startPosition.y) }))) }}
//             value={`document${props.props.index + 1}`} className='relative h-[71vh] ' >
//             <div
//                 ref={chart}
//                 style={{
//                     transform: `scale(${scale})`,
//                     transition: "0.4s",
//                     position: "absolute",
//                     left: position.x > window.innerWidth ? 0 : position.x + 'px',
//                     top: position.y > window.innerHeight ? 0 : position.y + 'px',

//                 }}
//                 className='draggable-tree h-auto w-auto flex justify-center items-center '  >
//                 <Tree
//                     lineWidth={'0.5px'}
//                     lineColor={'gray'}
//                     lineBorderRadius={'6px'}
//                     label={<StyledNode
//                         className="flex items-center cursor-pointer "
//                         x={Node!.StateId! > 0 ? [getStateColor(Node!.StateId!)] : "#2292c3"}>
//                         <div
//                             className={` relartive  h-full w-full flex items-center cursor-pointer ${!themeMode ||themeMode?.stateMode ? 'contentDark' : 'contentLight'} `}>
//                             <div className='p-2 h-full flex flex-col justify-center w-full'>
//                                 <strong className={`select-none text-[15px] text-gray-600 ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>{Node.ActorFaName}</strong>
//                                 <p className='select-none text-blue-600 text-[10px]'>{Node.ActorFaRole}</p>
//                                 <p style={{ color: Node!.StateId! > 0 ? getStateColor(Node!.StateId!) : "blue" }} className='select-none text-[10px]'>{Node.State}</p>
//                                 <div className='flex items-center justify-around'>
//                                     <p className={`select-none text-[12px] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>{Node!.receiveType}</p>
//                                     <p style={{ color: Node.name == 'تایید شده' ? '#04ca6a' : Node.name == 'رد شده' ? '#c40a0a' : '#f5d32d' }} className='select-none text-[12px] '>{Node!.name}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </StyledNode>}
//                 >
//                     {treeItems.filter((item) => item.pid == Node.id).map((item: OrgChartModel, index: number) => {
//                         return (
//                             FindChild(item, index)
//                         )
//                     })}
//                 </Tree>
//             </div >
//         </TabPanel >
//         {showInfo &&
//             <Card className={`absolute z-[1000] top-10 right-0 p-4 rounded-lg ${!themeMode ||themeMode?.stateMode ? " bg-[#2e4b64]" : " bg-[#efe7e2]"}`}>
//                 <div className={`transition duration-200 ease-in-out`}>
//                     <Typography className={`text-right font-[500] text-[13px] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} `}>نام :{data!.ActorFaName}</Typography>
//                     <Typography className={`text-right font-[500] text-[13px] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} `}>سمت :{data!.ActorFaRole}</Typography>
//                     {data!.createDate && <Typography className={`text-right text-[13px] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>تاریخ ایجاد :{data!.createDate}</Typography>}
//                     {data!.FirstSeenDate && <Typography className={`text-right text-[13px] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>تاریخ اولین بازدید :{data!.FirstSeenDate}</Typography>}
//                     {data!.LastSeenDate && <Typography className={`text-right text-[13px] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>تاریخ آخرین بازدید :{data!.LastSeenDate}</Typography>}
//                     {data!.PersonnalDesc && <Typography className={`text-right text-[13px] ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>توضیحات شخصی :{data!.PersonnalDesc}</Typography>}
//                 </div>
//             </Card>}


//     </>)
// }
