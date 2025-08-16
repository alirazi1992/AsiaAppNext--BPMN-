'use client';
import { Button, CardBody, Popover, PopoverContent, PopoverHandler, Tooltip } from '@material-tailwind/react';
import React, { useContext } from 'react';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { useRouter } from 'next/navigation';
import useStore from "@/app/hooks/useStore";
import activeStore from '@/app/zustandData/activate.zustand';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';
import { SearchContext } from './MainContainer';
import { SearchDocsResultModel } from '@/app/Domain/M_Search/search';
import { ActionButton, Td, Th } from '../../Shared/TableComponent';
import { Icon } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';

const SearchedList = () => {
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state)
    const router = useRouter();

    const GetDocumentData = (docTypeId: string, docHeapId: string) => {
        if (router) {
            activeStore.setState((state) => ({ ...state, activeSubLink: "New Document" }))
            window.open(`/Home/NewDocument?doctypeid=${docTypeId}&docheapid=${docHeapId}`)
        }
    }
    const { result } = useContext(SearchContext)    
    return (
        <>
            {result && result.length > 0 && <CardBody className='w-[98%] lg:w-[96%] mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <table dir="rtl" className={`w-full relative text-center ${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} `}>
                    <thead>
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <Th value={'#'} />
                            <Th value={'نوع'} />
                            <Th value={'شماره مدرک'} />
                            <Th value={'شماره صادره / وارده'} />
                            <Th value={'تاریخ ایجاد'} />
                            <Th value={'تاریخ امضاء'} />
                            <Th value={'تاریخ صادره / وارده'} />
                            <Th value={'فرستنده'} />
                            <Th value={'مخاطب'} />
                            <Th value={'موضوع'} />
                            <Th value={'عملیات'} />
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {result.map((item: SearchDocsResultModel, index: number) => {
                            return (
                                <tr key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                    <Td style={{ width: '3%' }} value={Number(index) + Number(1)} />
                                    <Td style={{ width: '3%' }} value={item.docTypeTitle} />
                                    <Td style={{ width: '5%' }} value={item.indicator} />
                                    <Td style={{ width: '5%' }} value={item.submitIndicator ?? "-"} />
                                    <Td style={{ width: '5%' }} value={item.createDate ?? "-"} />
                                    <Td style={{ width: '5%' }} value={item.documentDate ?? "-"} />
                                    <Td style={{ width: '5%' }} value={item.submitDate ?? "-"} />
                                    <Td style={{ width: "10%" }} value={item.sender ?? "-"} />
                                    <Td style={{ width: "30%" }} value={(item.mainReceiver != null && item.mainReceiver.length > 0) ? item.mainReceiver[0] : "-"} />
                                    <Td style={{ width: "15%" }} value={item.subject} />
                                    <Td style={{ width: "7%" }} value={
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <ActionButton onClick={() => GetDocumentData(item.docTypeId.toString(), item.docHeapId.toString())}>
                                                    <Icon Name={VisibilityIcon} />
                                                </ActionButton>
                                                <Popover placement="bottom">
                                                    <PopoverHandler>
                                                        <Button
                                                            size="sm"
                                                            className="p-1 mx-1"
                                                            style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >
                                                            <Tooltip content="اطلاعات تکمیلی" className={!themeMode ||themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'}>
                                                                <Icon Name={InfoIcon} />
                                                            </Tooltip>
                                                        </Button>
                                                    </PopoverHandler>
                                                    <PopoverContent className="z-[9999] border-none py-[10px] bg-blue-gray-600 text-white" dir="rtl"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                        مخاطب :   {item.mainReceiver != null && item.mainReceiver.length > 0 &&
                                                            item.mainReceiver?.map((option: string, num: number) => {
                                                                return (<p key={num} dir='rtl'>{(num + 1) + "." + option + `, `}</p>)
                                                            })
                                                        }
                                                        محل بایگانی : {item.workOrderArchiveDirectory ? item.workOrderArchiveDirectory : item.jobArchiveDirectory}
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    } />
                                </tr>
                    );
                        })}
                </tbody>
            </table>
            </CardBody >}
        </>
    )
}
export default SearchedList; 