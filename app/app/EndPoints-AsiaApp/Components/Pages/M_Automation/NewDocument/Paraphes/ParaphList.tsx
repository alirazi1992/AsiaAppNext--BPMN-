'use client'
import { GetParaphsListModel, ParaphListProps } from '@/app/Domain/M_Automation/NewDocument/Paraph'
import { Button, CardBody, Popover, PopoverContent, PopoverHandler, Tooltip, Typography } from '@material-tailwind/react'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from "@/app/hooks/useStore";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import moment from 'jalali-moment';
import { ActionButton, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import { Icon } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';

const ParaphList = ({ data, removeParaphId }: ParaphListProps) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    return (
        <CardBody className={'h-auto max-h-[40vh] mx-auto relative rounded-lg bg-red-400 p-0 overflow-hidden '}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
            {data.length > 0 && (
                <table dir="rtl" className={`w-full relative text-center h-auto max-h-[41vh] ${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                    <thead className='sticky z-[30] top-0 left-0 w-full'>
                        <tr className={!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}>
                            <Th value='#' />
                            <Th value='تاریخ پاراف' />
                            <Th value='نگارنده' />
                            <Th value='مخاطب' />
                            <Th value='عملیات' />
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {data.map((item: GetParaphsListModel, index: number) => {
                            return (
                                <tr key={item.id.toString()} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                    <Td value={Number(index + 1)} />
                                    <Td value={item.paraphDate !== '' ? moment(item.paraphDate, 'YYYY/MM/DD HH:mm:ss').format("jYYYY/jMM/jDD HH:mm:ss") : ''} />
                                    <Td value={item.writer} />
                                    <Td value={item.contact} />
                                    <Td style={{ width: '10%' }} value={<>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                {item.contact == "" && (
                                                    <ActionButton onClick={() => removeParaphId(item.id)} >
                                                        <Icon Name={DeleteIcon} />
                                                    </ActionButton>)}
                                                <Popover placement="bottom">
                                                    <PopoverHandler>
                                                        <Button
                                                            onClick={() => removeParaphId(item.id)}
                                                            size="sm"
                                                            className="p-1 mx-1"
                                                            style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >
                                                            <Tooltip content="اطلاعات تکمیلی" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                                                                <Icon Name={InfoIcon} />
                                                            </Tooltip>
                                                        </Button>
                                                    </PopoverHandler>
                                                    <PopoverContent className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex-col z-[9999] border-none py-[10px]`} dir="rtl"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                        <Typography className="w-full text-sm opacity-90 font-[400]"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>توضیحات : {item.desc ?? "-"}</Typography>
                                                        <Typography className="w-full text-sm opacity-90 font-[400]"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>توضیحات شخصی : {item.personalDesc ?? "-"}</Typography>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </>} />
                                </tr>
                            )
                        })}
                    </tbody>
                </table>)}
        </CardBody>
    )
}
export default ParaphList