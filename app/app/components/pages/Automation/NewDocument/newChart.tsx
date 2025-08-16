// 'use client'
// import useAxios from '@/app/hooks/useAxios';
// import { ForwardStateEnum, ForwardTargetModel, HierarchyModel, OrgChartModel, Response } from '@/app/models/Automation/NewDocumentModels';
// import { AxiosResponse } from 'axios';
// import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
// import themeStore from '@/app/zustandData/theme.zustand';
// import colorStore from '@/app/zustandData/color.zustand';
// import useStore from '@/app/hooks/useStore';
// import { Tab, Tabs, TabsBody, TabsHeader, Typography } from '@material-tailwind/react';
// import moment from 'jalali-moment';
// import dynamic from 'next/dynamic';
// import { DataContext } from '@/app/EndPoints-AsiaApp/Components/Pages/M_Automation/NewDocument/NewDocument-MainContainer';
// const TreePanel = dynamic(
//     () => import('./newTreePanel'),
//     {
//         ssr: false,
//     })

// const ChartNewDocument = (props: any) => {
//     let initialState = {
//         chartLength: 0,
//         chartContent: [],
//         activeTab: "document1"
//     }

//     interface ChartStateModel {
//         chartLength: number,
//         chartContent: OrgChartModel[][],
//         activeTab: string
//     }

//     const tree = useRef<HTMLDivElement>(null);
//     const [chartState, setChartState] = useState<ChartStateModel>(initialState);
//     const themeMode = useStore(themeStore, (state) => state)
//     const color = useStore(colorStore, (state) => state)
//     const { docHeapId } = useContext(DataContext);

//     const getSeenState = (stateId: number) => {
//         switch (stateId) {
//             case ForwardStateEnum.NotSeen:
//                 return "وضعیت: مشاهده نشده";
//             case ForwardStateEnum.Pending:
//                 return "وضعیت: درحال بررسی";
//             case ForwardStateEnum.Seen:
//                 return "وضعیت: مشاهده شده";
//             case ForwardStateEnum.Confirm:
//                 return "وضعیت: خاتمه یافته";
//             case ForwardStateEnum.Deny:
//                 return "وضعیت: رد شده";
//             case ForwardStateEnum.Rejected:
//                 return "وضعیت: برگشت داده شده";
//             default:
//                 return "";
//         }
//     }
//     const getStateColor = (stateId: number) => {
//         switch (stateId) {
//             case ForwardStateEnum.Seen:
//                 return 'yellow';
//             case ForwardStateEnum.NotSeen:
//                 return "blue";
//             case ForwardStateEnum.Pending:
//                 return "yellow";
//             case ForwardStateEnum.Confirm:
//                 return "green";
//             case ForwardStateEnum.Rejected:
//                 return "red";
//             case ForwardStateEnum.Deny:
//                 return "green";
//             default:
//                 return "blue";
//         }
//     }


//     const findForwardTargets = useCallback((branch: HierarchyModel): OrgChartModel[] => {
//         let nodes: OrgChartModel[] = []
//         if (branch.forwardParentTargetId == null) {
//             nodes.push({
//                 ActorFaName: branch.senderFaName,
//                 ActorFaRole: branch.senderFaRole,
//                 Answer: null,
//                 Desc: branch.desc,
//                 FirstSeenDate: null,
//                 LastSeenDate: null,
//                 id: branch.id,
//                 PersonnalDesc: null,
//                 pid: null,
//                 State: null,
//                 StateId: null,
//                 createDate: null,
//                 tags: ['blue'],
//                 receiveType: null,
//                 name: null
//             })
//             branch.forwardTarget.map((forwardTarget: ForwardTargetModel) => {
//                 nodes.push({
//                     name: forwardTarget.forwardState.name,
//                     receiveType: forwardTarget.receiveType,
//                     ActorFaName: forwardTarget.receiverFaName,
//                     ActorFaRole: forwardTarget.receiverFaRole,
//                     Answer: forwardTarget.forwardState.name == "Deny" ? "رد مدرک" : forwardTarget.forwardState.name == "Confirm" ? "تائید مدرک" : "",
//                     Desc: branch.desc,
//                     FirstSeenDate: forwardTarget.firstSeenDate != null ? moment(forwardTarget.firstSeenDate, 'YYYY/MM/DD HH:mm:SS').format('jYYYY/jMM/jDD HH:mm:SS') : null,
//                     LastSeenDate: forwardTarget.lastSeenDate != null ? moment(forwardTarget.lastSeenDate, 'YYYY/MM/DD HH:mm:SS').format('jYYYY/jMM/jDD HH:mm:SS') : null,
//                     id: forwardTarget.id,
//                     PersonnalDesc: forwardTarget.personalDesc,
//                     pid: branch.id,
//                     State: getSeenState(forwardTarget.forwardState.id),
//                     StateId: forwardTarget.forwardState.id,
//                     createDate: moment(branch.createDate, 'YYYY/MM/DD HH:mm:SS').format('jYYYY/jMM/jDD HH:mm:SS'),
//                     tags: forwardTarget.forwardState.id > 0 ? [getStateColor(forwardTarget.forwardState.id)] : ["blue"]
//                 })
//                 if (forwardTarget.childForwardSource.length > 0) {
//                     forwardTarget.childForwardSource.map((forwardTarget: HierarchyModel) => {
//                         nodes.push(...findForwardTargets(forwardTarget))
//                     })
//                 }
//             })
//         } else {
//             branch.forwardTarget.map((forwardTarget: ForwardTargetModel) => {
//                 nodes.push({
//                     ActorFaName: forwardTarget.receiverFaName,
//                     ActorFaRole: forwardTarget.receiverFaRole,
//                     Answer: forwardTarget.forwardState.name == "Deny" ? "رد مدرک" : forwardTarget.forwardState.name == "Confirm" ? "تائید مدرک" : "",
//                     Desc: branch.desc,
//                     FirstSeenDate: forwardTarget.firstSeenDate != null ? moment(forwardTarget.firstSeenDate, 'YYYY/MM/DD HH:mm:SS').format('jYYYY/jMM/jDD HH:mm:SS') : null,
//                     LastSeenDate: forwardTarget.lastSeenDate != null ? moment(forwardTarget.lastSeenDate, 'YYYY/MM/DD HH:mm:SS').format('jYYYY/jMM/jDD HH:mm:SS') : null,
//                     id: forwardTarget.id,
//                     PersonnalDesc: forwardTarget.personalDesc,
//                     pid: branch.forwardParentTargetId,
//                     State: getSeenState(forwardTarget.forwardState.id),
//                     StateId: forwardTarget.forwardState.id,
//                     createDate: moment(branch.createDate, 'YYYY/MM/DD HH:mm:SS').format('jYYYY/jMM/jDD HH:mm:SS'),
//                     tags: forwardTarget.forwardState.id > 0 ? [getStateColor(forwardTarget.forwardState.id)] : ["blue"],
//                     receiveType: forwardTarget.receiveType,
//                     name: forwardTarget.forwardState.name
//                 })
//                 if (forwardTarget.childForwardSource.length > 0) {
//                     forwardTarget.childForwardSource.map((forwardTarget: HierarchyModel) => {
//                         nodes.push(...findForwardTargets(forwardTarget))
//                     })
//                 }
//             })
//         }
//         return nodes
//     }, []);


//     const GetForwardHierarchy = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getforwardhierarchy?docHeapId=${props.docHeapId}`;
//         let method = "get";
//         let data = {};
//         let response: AxiosResponse<Response<HierarchyModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response.data.data != null && response.data.status) {
//             let hierarchies = response.data.data.map((hierarchy: HierarchyModel, num: number) => {
//                 let x = findForwardTargets(hierarchy)
//                 return x
//             })

//             setChartState((state) => ({ ...state, chartContent: hierarchies }))
//         }
//     }, [findForwardTargets, props.docHeapId])

//     useEffect(() => {
//         GetForwardHierarchy()
//     }, [docHeapId, GetForwardHierarchy])
//     return (
//         <div>
//             <Tabs value="document1" >
//                 <TabsHeader
//                     dir='rtl'
//                     className={`${!themeMode ||themeMode?.stateMode ? 'contentDark' : 'contentLight'} flex flex-col md:flex-row`}
//                     indicatorProps={{
//                         style: {
//                             background: color?.color,
//                         },
//                         className: `shadow !text-gray-900`,
//                     }}
//                 >
//                     {chartState.chartContent.length > 0 && chartState.chartContent.map((x: OrgChartModel[], index: number) => {
//                         return (<Tab onClick={(e: any) => {
//                             setChartState((state) => ({ ...state, activeTab: `document${index + 1}` }))
//                         }} className='w-[70px]' key={index} value={`document${index + 1}`} >
//                             <Typography variant='h6' style={{ color: `${chartState.activeTab == `document${index + 1}` ? "white" : ""}` }} className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`}>ارجاع{index + 1}</Typography>
//                         </Tab>)
//                     }
//                     )}
//                 </TabsHeader>
//                 <TabsBody>
//                     {chartState.chartContent.length > 0 && chartState.chartContent.map((hierarchy: OrgChartModel[], index: number) => {
//                         return (
//                             <TreePanel props={{ hierarchy, index }} key={index}></TreePanel>)
//                     })}
//                 </TabsBody>
//             </Tabs>
//         </div >
//     )
// }

// export default ChartNewDocument