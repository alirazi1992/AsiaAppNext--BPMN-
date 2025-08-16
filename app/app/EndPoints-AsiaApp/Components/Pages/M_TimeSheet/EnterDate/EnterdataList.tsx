'use client'
import { CardBody } from '@material-tailwind/react'
import React, { useContext, useEffect, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { EnterDataContext } from './EnterData-MainContainer';
import { useList } from '@/app/Application-AsiaApp/M_Timesheet/fetchTimesheetBoundries';
import { GetTimesheetBoundriesModel, TimesheetDetailsModel } from '@/app/Domain/M_Timesheet/model';
import { Td } from '../../../Shared/TableComponent';
import { Controller } from 'react-hook-form';
import moment from 'jalali-moment';
import styles from '@/app/assets/styles/Timesheet.module.css'
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import TotalHoursTable from './TotalHoursTable';
import { InsertingTimeSheet } from '@/app/Application-AsiaApp/M_Timesheet/InsertUserAddTimeSheet';
import { useDetails } from '@/app/Application-AsiaApp/M_Timesheet/fetchTimeSheetDetail';

const EnterdataList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { days, date, loadings, setLoadings, selected, setValue, setInitialData, control, watch, initialData } = useContext(EnterDataContext)
    const color = useStore(colorStore, (state) => state)
    const [title, setTitle] = useState<GetTimesheetBoundriesModel[] | undefined>(undefined)
    const { fetchTimeSheetBoundries } = useList()
    const { fetchTimeSheetDetails } = useDetails()
    const { AddUserTimeSheet } = InsertingTimeSheet()

    useEffect(() => {

        const AddTimeSheet = async () => {
            setLoadings({ ...loadings, response: true })
            const res = await AddUserTimeSheet(selected, { month: date.setCalendar(persian).setLocale(persian_fa).month.number, year: date.setCalendar(persian).setLocale(persian_fa).year }).then((result) => {
                if (result) {
                    setLoadings({ ...loadings, response: false })
                    typeof result == 'number' && result !== 0 && setInitialData({ masterId: result, details: [], isConfirmed: false })
                }
            })
        }

        const loadInitialList = async () => {
            setLoadings({ ...loadings, response: true })
            const res = await fetchTimeSheetBoundries().then(async (result) => {
                if (result) {
                    if (Array.isArray(result)) {
                        setTitle(result)
                        let monthTable: Array<TimesheetDetailsModel[]> = []
                        for (let i = 0; i < result.length; i++) {
                            let dayTable: Array<TimesheetDetailsModel> = []
                            for (let j = 1; j <= date.month.length; j++) {
                                dayTable.push({
                                    time: '',
                                    boundryItemId: result[i].id,
                                    spendTimeDate: moment(`${date.year}-${date.month.number}-${j}`, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')
                                })
                            }
                            monthTable.push(dayTable)
                        }

                        const result2: any = await fetchTimeSheetDetails(selected, { month: date.setCalendar(persian).setLocale(persian_fa).month.number, year: date.setCalendar(persian).setLocale(persian_fa).year }).then((res) => {
                            if (res) {
                                setLoadings({ ...loadings, response: false })
                                if (typeof res == 'object' && 'masterId' in res) {
                                    setInitialData({
                                        masterId: res.masterId, details: res.details,
                                        isConfirmed: res.isConfirmed
                                    })
                                    res.details.length > 0 &&
                                        res.details.forEach((detail: any) => {
                                            monthTable[detail.boundryItemId - 1][Number(moment(detail.timeSpendDate, 'YYYY-MM-DD').format('jYYYY-jMM-jDD').substring(8, 10)) - 1] = {
                                                time: detail.time,
                                                boundryItemId: detail.boundryItemId,
                                                spendTimeDate: moment(detail.timeSpendDate).format('YYYY-MM-DD')
                                            }
                                        })
                                }
                            } else { AddTimeSheet() }
                        });
                        setValue("times", monthTable);
                    }
                }
            })
        }

        (selected != "") && loadInitialList()
    }, [date, selected])

    return (
        <CardBody className='w-full h-[65vh] mx-auto relative rounded-lg overflow-y-auto p-0' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
            <table dir="rtl" className={`${!themeMode || themeMode?.stateMode ? 'tableDark lightText' : 'tableLight darkText'} timesheet w-full relative max-h-[60vh] text-center`}>
                <thead className='md:sticky z-[30] md:top-0 md:left-0 w-full'>
                    <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                        <th style={{ borderColor: color?.color, minWidth: '250px' }}
                            className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight '} p-1 sticky right-0 top-0 z-[45]`}>
                            عنوان
                        </th>
                        {days.map((item: { name: string, num: number }, index) => (
                            <th key={index} style={{ background: item.name == 'جمعه' || item.name == 'پنجشنبه' ? '#d35555' : themeMode?.stateMode ? '#15202c' : '#cbc5c0' , color: item.name == 'جمعه' || item.name == 'پنجشنبه' ? '#fff' : '', borderColor: color?.color, minWidth: '65px' }}
                                className={`p-1 sticky top-0 z-[30]`}>
                                {index + 1}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={`divide-y relative divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                    {watch("times")?.map((boundry: any, rowIndex: number) => {
                        return (
                            <tr key={rowIndex} className={`${rowIndex % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                <Td className={`sticky right-0 z-[5] ${rowIndex % 2 ? !themeMode || themeMode?.stateMode ? 'bg-[#15202c]' : 'bg-[#cecbc9]' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}`} value={title?.find(p => p.id == boundry[0]?.boundryItemId)?.name} />
                                {boundry?.map((day: TimesheetDetailsModel, colIndex: number) => (
                                    <Td className='relative ' dir='ltr' key={colIndex} value={
                                        <>
                                            <Controller
                                                control={control}
                                                name={`times.${rowIndex}.${colIndex}.time`}
                                                render={({ field: { onChange, value } }) => (
                                                    <DatePicker
                                                        className={` w-full flex justify-center ${!themeMode || themeMode?.stateMode ? 'bg-dark' : 'bg-gray'} ${initialData.isConfirmed == true ? 'select-none' : 'select-text'}`}
                                                        disableDayPicker
                                                        editable={false}
                                                        onChange={(data) => { onChange(data?.format('HH:mm:ss')) }}
                                                        value={new DateObject(`2025-03-01 ${value}`)}
                                                        format="HH:mm"
                                                        plugins={[
                                                            // eslint-disable-next-line react/jsx-key
                                                            <TimePicker
                                                                className='relative z-[9999]'
                                                                hideSeconds />

                                                        ]}
                                                    />
                                                )}
                                            />
                                        </>
                                    } />
                                ))}
                            </tr>
                        )
                    })}
                </tbody >
            </table>
            <TotalHoursTable />
        </CardBody >
    )
}


export default EnterdataList