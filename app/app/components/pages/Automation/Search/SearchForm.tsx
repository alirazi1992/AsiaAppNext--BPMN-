// 'use client';
// import React, { BaseSyntheticEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
// import { CardBody, Checkbox, Input, Typography, Card, IconButton } from '@material-tailwind/react';
// import DateTimePicker from "@/app/components/shared/DatePicker/DateTimePicker";
// import colorStore from '@/app/zustandData/color.zustand';
// import SearchInputsStore from '@/app/zustandData/searchPage.zustand';
// import { DocTypes, SearchInputs } from '@/app/models/Automation/SearchModel';
// import useStore from "@/app/hooks/useStore";
// import themeStore from '@/app/zustandData/theme.zustand';
// import Select2 from 'react-select';
// import moment from 'jalali-moment';
// // icons***
// import ClearIcon from '@mui/icons-material/Clear';


// const InitialInputs: SearchInputs = {
//   Indicator: "",
//   SubmitIndicator: "",
//   ImportSubmitNo: "",
//   CreateDateAfter: null,
//   CreateDateBefore: null,
//   SignDateAfter: null,
//   SignDateBefore: null,
//   SubmitDateAfter: null,
//   SubmitDateBefore: null,
//   ImportSubmitDateAfter: null,
//   ImportSubmitDateBefore: null,
//   Subject: "",
//   DocTypeId: {
//     label: "صادره / اداری ",
//     value: 1
//   },
//   Passage: "",
//   Keyword: "",
//   MainReceiver: "",
//   CopyReceiver: "",
//   Sender: "",
//   IsRevoked: false
// }


// const SearchFormComponent = () => {
//   const [searchParams, setSearchParams] = useState<SearchInputs>(InitialInputs)
//   const themeMode = useStore(themeStore, (state) => state)
//   const color = useStore(colorStore, (state) => state)
//   const SearchInputs = SearchInputsStore()


//   const DatePickerInput = (props: any) => {
//     return (
//       <div dir='ltr'>
//         <Input className="popo" {...props} type='text' crossOrigin="" size="md" label={props.label} style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" />
//       </div>)
//   }


//   useEffect(() => {
//     SearchInputs.SetInputs(searchParams);
//   }, [searchParams])

//   const setCreationAfter = (unix: any, formatted: any) => {
//     setSearchParams((prev) => ({ ...prev, CreateDateAfter: { CreateDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS'), IsBefore: false } }));
//   }
//   const setCreationBefore = (unix: any, formatted: any) => {
//     setSearchParams((prev) => ({ ...prev, CreateDateBefore: { CreateDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS'), IsBefore: true } }));
//   }
//   const setSignAfter = (unix: any, formatted: any) => {
//     setSearchParams((prev) => ({ ...prev, SignDateAfter: { LockDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS'), IsBefore: false } }));
//   }
//   const setSignBefore = (unix: any, formatted: any) => {
//     setSearchParams((prev) => ({ ...prev, SignDateBefore: { LockDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS'), IsBefore: true } }));
//   }
//   const setSubmitAfter = (unix: any, formatted: any) => {
//     setSearchParams((prev) => ({ ...prev, SubmitDateAfter: { SubmitDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS'), IsBefore: false } }));
//   }
//   const setSubmitBefore = (unix: any, formatted: any) => {
//     setSearchParams((prev) => ({ ...prev, SubmitDateBefore: { SubmitDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS'), IsBefore: true } }));
//   }
//   const setImportAfter = (unix: any, formatted: any) => {
//     setSearchParams((prev) => ({ ...prev, ImportSubmitDateAfter: { ImportSubmitDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS'), IsBefore: false } }));
//   }
//   const setImportBefore = (unix: any, formatted: any) => {
//     setSearchParams((prev) => ({ ...prev, ImportSubmitDateBefore: { ImportSubmitDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:SS').format('YYYY/MM/DD HH:mm:SS'), IsBefore: true } }));
//   }

//   const docTypes: DocTypes[] = [{
//     label: "صادره / اداری ",
//     value: 1
//   }, {
//     label: "وارده",
//     value: 4
//   }]

//   const handleSeach = (e: any) => {
//     e.preventDefault();
//     setSearchParams((state) => ({ ...state, ImportSubmitDateBefore: { ImportSubmitDate: "", IsBefore: true } }))
//   }

//   return (
//     <CardBody className={"w-[95%] md:w-[90%] mx-auto "}>
//       <form onSubmit={(e) => handleSeach(e)} className="w-full">
//         <div className="w-full flex flex-col items-center gap-2">
//           <div className='flex justify-end w-full'>
//             <Checkbox defaultChecked={false} label={
//               <Typography className={`flex font-medium ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}>
//                 وضعیت ابطال
//               </Typography>
//             } color='blue-gray' crossOrigin="" onChange={(e) => { setSearchParams({ ...searchParams, IsRevoked: Boolean(e.currentTarget.value) }) }} />
//           </div>
//           <Input defaultValue={searchParams.SubmitIndicator} dir="rtl" type='text' crossOrigin="" size="md" label="شماره وارده/صادره" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, SubmitIndicator: e.currentTarget.value }) }} />
//           <Input defaultValue={searchParams.ImportSubmitNo} dir="rtl" type='text' crossOrigin="" size="md" label="شماره صادره نامه وارده" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, ImportSubmitNo: e.currentTarget.value }) }} />
//           <Input defaultValue={searchParams.Indicator} dir="rtl" type='text' crossOrigin="" size="md" label="شماره مدرک" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, Indicator: e.currentTarget.value }) }} />
//           <Select2 isRtl
//             maxMenuHeight={220}
//             className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} placeholder="نوع مدرک" options={docTypes}
//             onChange={(option: any) => { setSearchParams({ ...searchParams, DocTypeId: option }) }}
//             defaultValue={searchParams.DocTypeId}
//             value={searchParams.DocTypeId}
//             theme={(theme) => ({
//               ...theme,
//               height: 10,
//               borderRadius: 5,
//               colors: {
//                 ...theme.colors,
//                 color: '#607d8b',
//                 neutral10: `${color?.color}`,
//                 primary25: `${color?.color}`,
//                 primary: '#607d8b',
//                 neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                 neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`
//               },
//             })}
//           />



//           <Input defaultValue={searchParams.Keyword} dir="rtl" className='grow min-w-min' crossOrigin="" size="md" label="کلید واژه" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, Keyword: e.currentTarget.value }) }} />
//           <Input defaultValue={searchParams.Passage} dir="rtl" className='grow min-w-min' crossOrigin="" size="md" label="متن" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, Passage: e.currentTarget.value }) }} />
//           <Input defaultValue={searchParams.Subject} dir="rtl" className='grow min-w-min' crossOrigin="" size="md" label="موضوع" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, Subject: e.currentTarget.value }) }} />
//           <Input defaultValue={searchParams.Sender} dir="rtl" crossOrigin="" size="md" label="فرستنده" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, Sender: e.currentTarget.value }) }} />
//           <Input defaultValue={searchParams.CopyReceiver} dir="rtl" crossOrigin="" size="md" label="گیرنده رونوشت" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, CopyReceiver: e.currentTarget.value }) }} />
//           <Input defaultValue={searchParams.MainReceiver} dir="rtl" crossOrigin="" size="md" label="گیرنده" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, MainReceiver: e.currentTarget.value }) }} />
//           <Card shadow className={`${!themeMode ||themeMode?.stateMode ? 'cardDark' : 'cardLight'} p-2 gap-3 w-full lg:w-auto `}>
//             <Typography dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-[700] text-[14px] mb-2`} variant='h6'>
//               تاریخ ایجاد
//             </Typography>
//             <div className="relative  flex flex-col lg:flex-row gap-2 lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
//               <div className='order-2 lg:order-1 w-auto '>
//                 <Input dir="ltr" value={searchParams.CreateDateAfter?.CreateDate ?? ""} type='text' crossOrigin="" size="md" label="تاریخ میلادی بعد از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, CreateDateAfter: { CreateDate: e.target.value, IsBefore: false } }) }} />
//               </div>
//               <div dir='ltr'>
//                 <DateTimePicker
//                   inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ بعد از", onChange: (e: BaseSyntheticEvent) => { setSearchParams({ ...searchParams, CreateDateAfter: { CreateDate: e.target.value, IsBefore: false } }) } })}
//                   placeholder=""
//                   format="jYYYY/jMM/jDD HH:mm:SS"
//                   onChange={setCreationAfter}
//                   cancelOnBackgroundClick={false}
//                   currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                   preSelected={searchParams.CreateDateAfter?.CreateDate && moment(searchParams.CreateDateAfter?.CreateDate, 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                 />
//               </div>
//               <IconButton className='!absolute top-1 right-1' onClick={() => { setSearchParams((state) => ({ ...state, CreateDateAfter: { CreateDate: "", IsBefore: false } })) }} style={{ background: color?.color }} size="sm">
//                 <ClearIcon className='p-0.5' fontSize="small" />
//               </IconButton>
//             </div>
//             <div className="relative  flex flex-col lg:flex-row gap-2 lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
//               <div className='order-2 lg:order-1 w-auto '>
//                 <Input defaultValue={searchParams.CreateDateBefore?.CreateDate ?? ""} dir="ltr" value={searchParams.CreateDateBefore?.CreateDate ?? ""} type='text' crossOrigin="" size="md" label="تاریخ میلادی قبل از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, CreateDateBefore: { CreateDate: e.target.value, IsBefore: true } }) }} />
//               </div>
//               <div dir="ltr">
//                 <DateTimePicker
//                   customClass='relative'
//                   inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ قبل از" })}
//                   placeholder=""
//                   format="jYYYY/jMM/jDD HH:mm:SS"
//                   id="dateTimePickerCreationTo"
//                   onChange={setCreationBefore}
//                   cancelOnBackgroundClick={false}
//                   inputTextAlign="left"
//                   currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                   preSelected={searchParams.CreateDateBefore?.CreateDate && moment(searchParams.CreateDateBefore?.CreateDate, 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                 />
//               </div>
//               <IconButton className='!absolute top-1 right-1' onClick={() => { setSearchParams((state) => ({ ...state, CreateDateBefore: { CreateDate: "", IsBefore: true } })) }} style={{ background: color?.color }} size="sm">
//                 <ClearIcon className='p-0.5' fontSize="small" />
//               </IconButton>

//             </div>
//           </Card>
//           <Card shadow className={`${!themeMode ||themeMode?.stateMode ? 'cardDark' : 'cardLight'} p-2 gap-3 w-full lg:w-auto `}>
//             <Typography dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-[700] text-[14px] mb-2`} variant='h6'>
//               تاریخ امضاء
//             </Typography>
//             <div className="relative  flex flex-col lg:flex-row gap-2 lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
//               <div className='order-2 lg:order-1 w-auto '>
//                 <Input dir="ltr" value={searchParams.SignDateAfter?.LockDate ?? ""} type='text' crossOrigin="" size="md" label="تاریخ میلادی بعد از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, SignDateAfter: { LockDate: e.currentTarget.value, IsBefore: false } }) }} />
//               </div>
//               <div dir="ltr">
//                 <DateTimePicker
//                   inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ بعد از" })}
//                   placeholder=""
//                   format="jYYYY/jMM/jDD HH:mm:SS"
//                   id="dateTimePickerSignTo"
//                   onChange={setSignAfter}
//                   cancelOnBackgroundClick={false}
//                   currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                   preSelected={searchParams.SignDateAfter?.LockDate && moment(searchParams.SignDateAfter?.LockDate, 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                 />
//               </div>
//               <IconButton className='!absolute top-1 right-1' onClick={() => { setSearchParams((state) => ({ ...state, SignDateAfter: { LockDate: "", IsBefore: false } })) }} style={{ background: color?.color }} size="sm">
//                 <ClearIcon className='p-0.5' fontSize="small" />
//               </IconButton>
//             </div>
//             <div className="relative  flex flex-col lg:flex-row gap-2 lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
//               <div className='order-2 lg:order-1 w-auto '>
//                 <Input dir="ltr" value={searchParams.SignDateBefore?.LockDate ?? ""} type='text' crossOrigin="" size="md" label="تاریخ میلادی قبل از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, SignDateBefore: { LockDate: e.currentTarget.value, IsBefore: true } }) }} />
//               </div>
//               <div dir="ltr" >
//                 <DateTimePicker
//                   inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ قبل از" })}
//                   placeholder=""
//                   format="jYYYY/jMM/jDD HH:mm:SS"
//                   id="dateTimePickerSignTo"
//                   onChange={setSignBefore}
//                   cancelOnBackgroundClick={false}
//                   currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                   preSelected={searchParams.SignDateBefore?.LockDate && moment(searchParams.SignDateBefore?.LockDate, 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                 />
//               </div>
//               <IconButton className='!absolute top-1 right-1' onClick={() => { setSearchParams((state) => ({ ...state, SignDateBefore: { LockDate: "", IsBefore: true } })) }} style={{ background: color?.color }} size="sm">
//                 <ClearIcon className='p-0.5' fontSize="small" />
//               </IconButton>
//             </div>
//           </Card>
//           <Card shadow className={`${!themeMode ||themeMode?.stateMode ? 'cardDark' : 'cardLight'} p-2 gap-3 w-full lg:w-auto `}>
//             <Typography dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-[700] text-[14px] mb-2`} variant='h6'>
//               تاریخ صادره
//             </Typography>
//             <div className="relative  flex flex-col lg:flex-row gap-2 lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
//               <div className='order-2 lg:order-1 w-auto '>
//                 <Input dir="ltr" value={searchParams.SubmitDateAfter?.SubmitDate ?? ""} type='text' crossOrigin="" size="md" label="تاریخ میلادی بعد از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, SubmitDateAfter: { SubmitDate: e.currentTarget.value, IsBefore: false } }) }} />
//               </div>
//               <div dir="ltr" >
//                 <DateTimePicker
//                   inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ بعد از" })}
//                   placeholder=""
//                   format="jYYYY/jMM/jDD HH:mm:SS"
//                   id="dateTimePickerSubmitFrom"
//                   onChange={setSubmitAfter}
//                   cancelOnBackgroundClick={false}
//                   currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                   preSelected={searchParams.SubmitDateAfter?.SubmitDate && moment(searchParams.SubmitDateAfter?.SubmitDate, 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                 />
//               </div>
//               <IconButton className='!absolute top-1 right-1' onClick={() => { setSearchParams((state) => ({ ...state, SubmitDateAfter: { SubmitDate: "", IsBefore: false } })) }} style={{ background: color?.color }} size="sm">
//                 <ClearIcon className='p-0.5' fontSize="small" />
//               </IconButton>
//             </div>
//             <div className="relative  flex flex-col lg:flex-row gap-2 lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
//               <div className='order-2 lg:order-1 w-auto '>
//                 <Input dir="ltr" value={searchParams.SubmitDateBefore?.SubmitDate ?? ''} type='text' crossOrigin="" size="md" label="تاریخ میلادی قبل از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, SubmitDateBefore: { SubmitDate: e.currentTarget.value, IsBefore: true } }) }} />
//               </div>
//               <div dir="ltr" >
//                 <DateTimePicker
//                   inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ قبل از" })}
//                   placeholder=""
//                   format="jYYYY/jMM/jDD HH:mm:SS"
//                   id="dateTimePickerSubmitTo"
//                   onChange={setSubmitBefore}
//                   cancelOnBackgroundClick={false}
//                   currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                   preSelected={searchParams.SubmitDateBefore?.SubmitDate && moment(searchParams.SubmitDateBefore?.SubmitDate, 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                 />
//               </div>
//               <IconButton className='!absolute top-1 right-1' onClick={() => { setSearchParams((state) => ({ ...state, SubmitDateBefore: { SubmitDate: "", IsBefore: true } })) }} style={{ background: color?.color }} size="sm">
//                 <ClearIcon className='p-0.5' fontSize="small" />
//               </IconButton>
//             </div>
//           </Card>
//           <Card shadow className={`${!themeMode ||themeMode?.stateMode ? 'cardDark' : 'cardLight'} p-2 gap-3 w-full lg:w-auto `}>
//             <Typography dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-[700] text-[14px] mb-2`} variant='h6'>
//               تاریخ وارده
//             </Typography>
//             <div className="relative  flex flex-col lg:flex-row gap-2 lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
//               <div className='order-2 lg:order-1 w-auto '>
//                 <Input dir="ltr" value={searchParams.ImportSubmitDateAfter?.ImportSubmitDate ?? ""} type='text' crossOrigin="" size="md" label="تاریخ میلادی بعد از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, ImportSubmitDateAfter: { ImportSubmitDate: e.currentTarget.value, IsBefore: false } }) }} />
//               </div>
//               <div dir="ltr">
//                 <DateTimePicker
//                   inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ بعد از" })}
//                   placeholder=""
//                   format="jYYYY/jMM/jDD HH:mm:SS"
//                   id="dateTimePickerImportFrom"
//                   onChange={setImportAfter}
//                   cancelOnBackgroundClick={false}
//                   currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                   preSelected={searchParams.ImportSubmitDateAfter?.ImportSubmitDate && moment(searchParams.ImportSubmitDateAfter?.ImportSubmitDate, 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                 />
//               </div>
//               <IconButton size="sm" className='!absolute top-1 right-1 p-1' onClick={() => { setSearchParams((state) => ({ ...state, ImportSubmitDateAfter: { ImportSubmitDate: "", IsBefore: false } })) }} style={{ background: color?.color }}>
//                 <ClearIcon fontSize="small" className='p-0.5' />
//               </IconButton>
//             </div>
//             <div className="relative  flex flex-col lg:flex-row gap-2 lg:flex-nowrap w-full datePicker lg:grow lg:justify-between">
//               <div className='order-2 lg:order-1 w-auto '>
//                 <Input dir="ltr" value={searchParams.ImportSubmitDateBefore?.ImportSubmitDate ?? ""} type='text' crossOrigin="" size="md" label="تاریخ میلادی قبل از" style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onChange={(e) => { setSearchParams({ ...searchParams, ImportSubmitDateBefore: { ImportSubmitDate: e.currentTarget.value, IsBefore: true } }) }} />
//               </div>
//               <div dir="ltr" >
//                 <DateTimePicker
//                   inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ قبل از" })}
//                   placeholder=""
//                   format="jYYYY/jMM/jDD HH:mm:SS"
//                   id="dateTimePickerImportTo"
//                   onChange={setImportBefore}
//                   cancelOnBackgroundClick={false}
//                   currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                   preSelected={searchParams.ImportSubmitDateBefore?.ImportSubmitDate && moment(searchParams.ImportSubmitDateBefore?.ImportSubmitDate, 'YYYY/MM/DD HH:mm:SS').locale('fa').format("jYYYY/jMM/jDD HH:mm:SS")}
//                 />
//               </div>
//               <IconButton size="sm" className='!absolute top-1 right-1 p-1' onClick={() => { setSearchParams((state) => ({ ...state, ImportSubmitDateBefore: { ImportSubmitDate: "", IsBefore: true } })) }} style={{ background: color?.color }}>
//                 <ClearIcon fontSize="small" className='p-0.5' />
//               </IconButton>
//             </div>
//           </Card>
//         </div>
//       </form >
//     </CardBody >
//   )
// }

// export default SearchFormComponent;

