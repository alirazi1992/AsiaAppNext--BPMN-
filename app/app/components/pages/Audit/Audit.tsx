
// 'use client';
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//     Drawer,
//     Typography,
//     IconButton,
//     Input,
//     Card
// } from "@material-tailwind/react";
// import themeStore from '@/app/zustandData/theme.zustand';
// import useStore from "@/app/hooks/useStore";
// import colorStore from '@/app/zustandData/color.zustand';
// import ButtonComponent from '@/app/components/shared/ButtonComp';
// import Select2, { ActionMeta, SingleValue } from 'react-select';
// import DateTimePicker from '@/app/components/shared/DatePicker/DateTimePicker';
// import SearchIcon from '@mui/icons-material/Search';
// import moment from 'jalali-moment';
// //icons
// import ClearIcon from '@mui/icons-material/Clear';
// import { GetActionsModel, GetActorsModel, GetModulesModel, GetResultAuditSearch, GetSourceListModel, InitialStateAudit, LogsModel, Response } from '@/app/models/Autit/AuditModels';
// import { Axios, AxiosResponse } from 'axios';
// import useAxios from '@/app/hooks/useAxios';
// import InputSkeleton from '../../shared/InputSkeleton';
// import Swal from 'sweetalert2';
// import AuditTable from './AuditTable';
// import { Pagination, Stack } from '@mui/material';

// interface InputsLoadings {
//     modules: boolean,
//     actors: boolean,
//     actions: boolean,
//     sourceList: boolean,
// }
// interface Pagination {
//     total: number,
//     count: number,
//     page: number
// }
// const AuditFilter = () => {
//     const [openRight, setOpenRight] = useState(true);
//     const openDrawerRight = () => setOpenRight(true);
//     const closeDrawerRight = () => setOpenRight(false);
//     const color = useStore(colorStore, (state) => state)
//     const themeMode = useStore(themeStore, (state) => state)
//     const [loading, setLoading] = useState<boolean>(false)

//     let inputLoadings = {
//         modules: false,
//         actors: false,
//         actions: false,
//         sourceList: false,
//     }

//     let initialInputs = {
//         actors: [],
//         actions: [],
//         modules: [],
//         sourceList: [],
//         selectedAction: null,
//         selectedActor: null,
//         startDate: "",
//         endDate: "",
//         searchText: "",
//         resultSearch: [],
//         paginationCount: 0
//     }
//     const [loadings, setLoadings] = useState<InputsLoadings>(inputLoadings)
//     const [filter, setFilter] = useState<InitialStateAudit>(initialInputs)

//     const setEndDate = (unix: any, formatted: any) => {
//         setFilter((prev: any) => ({ ...prev, endDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS') }));
//     }
//     const setStartDate = (unix: any, formatted: any) => {
//         setFilter((prev: any) => ({ ...prev, startDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS') }));
//     }
//     const DatePickerInput = (props: any) => {
//         return (
//             <div dir='ltr'>
//                 <Input className="popo" {...props} type='text' crossOrigin="" size="md" label={props.label} style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" />
//             </div>)
//     }

//     const GetActors = async () => {
//         setLoadings((state) => ({ ...state, actors: true }))
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetActors`;
//         let method = 'get';
//         let data = {};
//         let response: AxiosResponse<GetActorsModel[]> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response) {
//             setLoadings((state) => ({ ...state, actors: false }))
//             if (response.data != null) {
//                 setFilter((state: any) => ({
//                     ...state, actors: [{
//                         title: 'همه',
//                         actorId: 0,
//                         level: 0,
//                         label: 'همه',
//                         value: 0
//                     }, ...response.data.map((item: GetActorsModel) => {
//                         return {
//                             title: item.title,
//                             actorId: item.actorId,
//                             level: item.level,
//                             label: item.title,
//                             value: item.actorId
//                         }
//                     })], selectedActor: {
//                         title: 'همه',
//                         actorId: 0,
//                         level: 0,
//                         label: 'همه',
//                         value: 0
//                     }
//                 }))
//             }
//         }
//     }

//     const GetModules = async () => {
//         setLoadings((state) => ({ ...state, modules: true }))
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetModules`;
//         let method = 'get';
//         let data = {};
//         let response: AxiosResponse<GetModulesModel[]> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response) {
//             setLoadings((state) => ({ ...state, modules: false }))
//             if (response.data != null && response.data.length > 0) {
//                 setFilter((state: any) => ({
//                     ...state, modules: response.data.map((item: GetModulesModel) => {
//                         return {
//                             id: item.id,
//                             label: item.title,
//                             title: item.title,
//                             value: item.value
//                         }
//                     })
//                 }))
//             }
//         }
//     }

//     const GetSourceList = useCallback(async (id: number) => {
//         setLoadings((state) => ({ ...state, sourceList: true }))
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetSourcesList?moduleId=${id}`;
//         let method = 'get';
//         let data = {};
//         let response: AxiosResponse<Response<GetSourceListModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response) {
//             setLoadings((state) => ({ ...state, sourceList: false }))
//             if (response.data.status && response.data.data != null && response.data.data.length > 0) {
//                 setFilter((state: any) => ({
//                     ...state, sourceList: response.data.data!.map((item: GetModulesModel) => {
//                         return {
//                             id: item.id,
//                             label: item.title,
//                             title: item.title,
//                             value: item.value
//                         }
//                     })
//                 }))
//             }
//         }

//     }, [])

//     const GetActionList = useCallback(async (id: number) => {
//         setLoadings((state) => ({ ...state, actions: true }))
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetActionsList?sourceCodeId=${id}`;
//         let method = 'get';
//         let data = {};
//         let response: AxiosResponse<Response<GetActionsModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response) {
//             setLoadings((state) => ({ ...state, actions: false }))
//             if (response.data.status && response.data.data != null) {
//                 setFilter((state: any) => ({
//                     ...state, actions: response.data.data!.map((item: GetActionsModel) => {
//                         return {
//                             id: item.id,
//                             name: item.name,
//                             codeSourceId: item.codeSourceId,
//                             label: item.name,
//                             value: item.id
//                         }
//                     })
//                 }))
//             }
//         }

//     }, [])

//     useEffect(() => {
//         GetActors()
//         GetModules()
//     }, [])




//     const Search = async (page: number = 1) => {
//         closeDrawerRight()
//         if (filter.selectedAction != null) {
//             setLoading(true)
//             let url = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetLogs`;
//             let method = 'post';
//             let data = {
//                 "actionId": filter.selectedAction?.id,
//                 "startDate": filter.startDate ?? '',
//                 "endDate": filter.endDate ?? '',
//                 "actorId": filter.selectedActor?.actorId,
//                 "searchText": filter.searchText,
//                 "pageNo": page,
//                 "count": 10
//             };
//             let response: AxiosResponse<Response<GetResultAuditSearch>> = await AxiosRequest({ url, method, data, credentials: true })
//             if (response) {
//                 setLoading(false)
//                 if (response.status && response.data.data != null && response.data.data.logs != null) {
//                     setFilter((state: any) => ({ ...state, resultSearch: response.data.data.logs, paginationCount: Math.ceil(Number(response.data.data.totalCount) / Number(10)) }))
//                 }
//             }
//         } else {
//             Swal.fire({
//                 background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                 color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
//                 allowOutsideClick: false,
//                 title: "جست و جو",
//                 text: "لطفا فیلد های تعیین شده رو انتخاب کنید",
//                 icon: "warning",
//                 confirmButtonColor: "#22c55e",
//                 confirmButtonText: "OK!",
//             })
//         }
//     }

//     return (
//         <section>
//             <ButtonComponent onClick={openDrawerRight}>فیلتر ها</ButtonComponent>
//             <AuditTable loadingState={loading} tableData={filter.resultSearch} />
//             {filter.paginationCount > 1 && <section className='flex justify-center my-3'>
//                 <Stack onClick={(e: any) => { setFilter((state: any) => ({ ...state, resultSearch: [] })), Search(e.target.innerText) }} spacing={2} >
//                     <Pagination showFirstButton showLastButton count={filter.paginationCount} variant="outlined" size="small" shape="rounded" />
//                 </Stack>
//             </section>}
//             <Drawer
//                 size={460}
//                 placement="right"
//                 open={openRight}
//                 onClose={closeDrawerRight}
//                 className={` p-4 h-[100vh] overflow-y-auto ${!themeMode ||themeMode?.stateMode ? 'cardDark' : 'cardLight'} `}
//             >
//                 <section className='w-full h-full overflow-y-scroll relative'>
//                     <div className="my-3 w-[96%] mx-auto flex items-center justify-between">
//                         <IconButton
//                             variant="text"
//                             color="blue-gray"
//                             onClick={closeDrawerRight}
//                         >
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 strokeWidth={2}
//                                 stroke="currentColor"
//                                 className="h-5 w-5"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     d="M6 18L18 6M6 6l12 12"
//                                 />
//                             </svg>
//                         </IconButton>
//                         <Typography variant="h5" className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>
//                             فیلترها
//                         </Typography>
//                     </div>
//                     <section className='flex flex-col gap-3'>
//                         {loadings.actors == false ? <Select2 isRtl
//                             isClearable={true}
//                             className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} placeholder="عامل"
//                             options={filter.actors}
//                             defaultValue={filter.actors[0]}
//                             onChange={(option: SingleValue<GetActorsModel>, actionMeta: ActionMeta<GetActorsModel>) => { setFilter((state: any) => ({ ...state, selectedActor: option })) }}
//                             maxMenuHeight={500}
//                             theme={(theme) => ({
//                                 ...theme,
//                                 height: 10,
//                                 borderRadius: 5,
//                                 colors: {
//                                     ...theme.colors,
//                                     color: '#607d8b',
//                                     neutral10: `${color?.color}`,
//                                     primary25: `${color?.color}`,
//                                     primary: '#607d8b',
//                                     neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                     neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : '#75634f'}`
//                                 },
//                             })}
//                         /> : <InputSkeleton />}
//                         {loadings.modules == false ? <Select2 isRtl
//                             isClearable={true}
//                             className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} placeholder="انتخاب ماژول"
//                             options={filter.modules}
//                             onChange={(option: SingleValue<GetModulesModel>, actionMeta: ActionMeta<GetModulesModel>) => { GetSourceList(option!.id) }}
//                             maxMenuHeight={220}
//                             theme={(theme) => ({
//                                 ...theme,
//                                 height: 10,
//                                 borderRadius: 5,
//                                 colors: {
//                                     ...theme.colors,
//                                     color: '#607d8b',
//                                     neutral10: `${color?.color}`,
//                                     primary25: `${color?.color}`,
//                                     primary: '#607d8b',
//                                     neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                     neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : '#75634f'}`
//                                 },
//                             })}
//                         /> : <InputSkeleton />}
//                         {loadings.sourceList == false ? <Select2 isRtl
//                             isClearable={true}
//                             className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} placeholder="انتخاب صفحه"
//                             options={filter.sourceList}
//                             onChange={(option: SingleValue<GetSourceListModel>, actionMeta: ActionMeta<GetSourceListModel>) => { GetActionList(option!.id) }}
//                             maxMenuHeight={220}
//                             theme={(theme) => ({
//                                 ...theme,
//                                 height: 10,
//                                 borderRadius: 5,
//                                 colors: {
//                                     ...theme.colors,
//                                     color: '#607d8b',
//                                     neutral10: `${color?.color}`,
//                                     primary25: `${color?.color}`,
//                                     primary: '#607d8b',
//                                     neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                     neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : '#75634f'}`
//                                 },
//                             })}
//                         /> : <InputSkeleton />}
//                         {loadings.actions == false ? <Select2 isRtl
//                             isClearable={true}
//                             className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} placeholder="انتخاب فعالیت"
//                             options={filter.actions}
//                             onChange={(option: SingleValue<GetActionsModel>, actionMeta: ActionMeta<GetActionsModel>) => { setFilter((state: any) => ({ ...state, selectedAction: option })) }}
//                             maxMenuHeight={220}
//                             theme={(theme) => ({
//                                 ...theme,
//                                 height: 10,
//                                 borderRadius: 5,
//                                 colors: {
//                                     ...theme.colors,
//                                     color: '#607d8b',
//                                     neutral10: `${color?.color}`,
//                                     primary25: `${color?.color}`,
//                                     primary: '#607d8b',
//                                     neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                     neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : '#75634f'}`
//                                 },
//                             })}
//                         /> : <InputSkeleton />}
//                         <Input dir="rtl" onChange={(e) => { setFilter({ ...filter, searchText: e.currentTarget.value }) }}
//                             className='grow min-w-min' crossOrigin="" size="md" label="توضیحات" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" />
//                         <Card shadow className={`${!themeMode ||themeMode?.stateMode ? 'cardDark' : 'cardLight'} p-2 gap-3`}>
//                             <div className="relative flex flex-col lg:flex-row gap-2 lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
//                                 <div className='order-2 lg:order-1 w-auto '>
//                                     <Input dir="rtl"
//                                         value={filter.startDate ?? ""}
//                                         type='text' crossOrigin="" size="md" label="تاریخ میلادی قبل از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
//                                         onChange={(e) => { setFilter({ ...filter, startDate: e.target.value }) }}
//                                     />
//                                 </div>
//                                 <div dir="rtl" className='relative order-1 lg:order-2 ' >
//                                     <DateTimePicker
//                                         customClass='relative'
//                                         inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ قبل از" })}
//                                         placeholder=""
//                                         format="jYYYY/jMM/jDD HH:mm:SS"
//                                         id="dateTimePickerCreationTo"
//                                         onChange={setStartDate}
//                                         cancelOnBackgroundClick={false}
//                                         inputTextAlign="left"
//                                         currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                                         preSelected={filter.startDate && moment(filter.startDate, 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                                     />
//                                     <IconButton className='!absolute top-1 right-1'
//                                         onClick={() => { setFilter((state: any) => ({ ...state, startDate: '' })) }}
//                                         style={{ background: color?.color }} size="sm">
//                                         <ClearIcon className='p-0.5' fontSize="small" />
//                                     </IconButton>
//                                 </div>

//                             </div>
//                             <div className="relative flex flex-col gap-2 lg:flex-row lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
//                                 <div className='order-2 lg:order-1'>
//                                     <Input dir="rtl"
//                                         value={filter.endDate ?? ""}
//                                         type='text' crossOrigin="" size="md" label="تاریخ میلادی بعد از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
//                                         onChange={(e) => { setFilter({ ...filter, endDate: e.target.value }) }}
//                                     />
//                                 </div>
//                                 <div dir="rtl" className='relative order-1 lg:order-2' >
//                                     <DateTimePicker
//                                         customClass='relative'
//                                         inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ بعد از" })}
//                                         placeholder=""
//                                         format="jYYYY/jMM/jDD HH:mm:SS"
//                                         id="dateTimePickerCreationTo"
//                                         onChange={setEndDate}
//                                         cancelOnBackgroundClick={false}
//                                         inputTextAlign="left"
//                                         currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                                         preSelected={filter.endDate && moment(filter.endDate, 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                                     />
//                                     <IconButton className='!absolute top-1 right-1'
//                                         onClick={() => { setFilter((state: any) => ({ ...state, endDate: '' })) }}
//                                         style={{ background: color?.color }} size="sm">
//                                         <ClearIcon className='p-0.5' fontSize="small" />
//                                     </IconButton>
//                                 </div>
//                             </div>
//                         </Card>
//                     </section>
//                     <section className='absolute bottom-5 left-5  ' >
//                         <IconButton size='lg' style={{ background: color?.color }} className="rounded-full "
//                             onClick={() => Search()}
//                         >
//                             <SearchIcon
//                                 className='p-2/4'
//                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                         </IconButton>
//                     </section>
//                 </section>

//             </Drawer >
//         </section >


//     )
// }

// export default AuditFilter;