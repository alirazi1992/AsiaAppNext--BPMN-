'use client';
import React, { useContext, useEffect } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { EnterDataContext } from './EnterData-MainContainer';
import { Timesheetsumvalues } from '@/app/Application-AsiaApp/M_Timesheet/fetchTimesheetSumValues';
import { GetTimeSheetSumValuesModel } from '@/app/Domain/M_Timesheet/model';
import { Td } from '../../../Shared/TableComponent';
import { Controller } from 'react-hook-form';
import moment from 'jalali-moment';
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

const TotalHoursTable = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const { days, initialData, setValue, getValues, watch, control, call, setCall, loadings, setLoadings } = useContext(EnterDataContext)
    const { fetchTimesheetsumvalues } = Timesheetsumvalues()


    enum SumTitleFa {
        'مجموع ساعت' = 0,
        'ساعت کاری استاندارد' = 1,
        'مجموع اضافه کاری' = 2,
        'مجموع کسری کار' = 3
    }

    useEffect(() => {
        const Sum = []
        for (let t = 0; t < 4; t++) {
            const SumValues: GetTimeSheetSumValuesModel[] = []
            for (let d = 1; d <= days.length; d++) {
                SumValues.push({
                    day: d.toString(),
                    totalSumValue: "00:00",
                    totalStandardValue: "08:00",
                    totalOverWorkValue: "00:00",
                    totalWorkDeductionValue: "00:00"
                })
            }
            Sum.push(SumValues)
        }
        setValue('totalTime', Sum)
    }, [days, initialData.masterId])

    useEffect(() => {
        const loadInitialList = async () => {
            setLoadings({ ...loadings, table: true })
            const res = await fetchTimesheetsumvalues(initialData.masterId).then((result) => {
                if (result) {
                    setLoadings({ ...loadings, table: false })
                    if (Array.isArray(result) && result.length > 0) {
                        if (Array.isArray(result)) {
                            setCall(false)
                            const test = getValues(`totalTime`)
                            result?.forEach((data: GetTimeSheetSumValuesModel) => {
                                test[0][Number(moment(data.day, 'YYYY-MM-DD').format('jYYYY-jMM-jDD').substring(8, 10)) - 1] = {
                                    day: Number(moment(data.day, 'YYYY-MM-DD').format('jYYYY-jMM-jDD').substring(8, 10)) - 1,
                                    totalSumValue: data.totalSumValue,
                                }
                                test[1][Number(moment(data.day, 'YYYY-MM-DD').format('jYYYY-jMM-jDD').substring(8, 10)) - 1] = {
                                    day: Number(moment(data.day, 'YYYY-MM-DD').format('jYYYY-jMM-jDD').substring(8, 10)) - 1,
                                    totalSumValue: data.totalStandardValue,
                                }
                                test[2][Number(moment(data.day, 'YYYY-MM-DD').format('jYYYY-jMM-jDD').substring(8, 10)) - 1] = {
                                    day: Number(moment(data.day, 'YYYY-MM-DD').format('jYYYY-jMM-jDD').substring(8, 10)) - 1,
                                    totalSumValue: data.totalOverWorkValue,
                                }
                                test[3][Number(moment(data.day, 'YYYY-MM-DD').format('jYYYY-jMM-jDD').substring(8, 10)) - 1] = {
                                    day: Number(moment(data.day, 'YYYY-MM-DD').format('jYYYY-jMM-jDD').substring(8, 10)) - 1,
                                    totalSumValue: data.totalWorkDeductionValue,
                                }
                            });
                            setValue('totalTime', test)
                        }
                    }
                }
            })
        }
        (initialData.masterId !== 0 || call == true) && loadInitialList()
    }, [initialData.masterId, call])

    return (
        <table dir="rtl" className={`${!themeMode || themeMode?.stateMode ? 'tableDark lightText' : 'tableLight darkText'} timesheet w-full max-h-[280px] relative text-center p-0`}>
            <thead className='md:sticky z-[30] top-0 left-0 w-full'>
                    <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                        <th style={{ borderColor: color?.color, minWidth: '250px' }}
                            className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight '} p-1 sticky right-0 top-0 z-[999]`}>
                            {/* عنوان */}
                        </th>
                        {Array.from({ length: days.length }, (_, index) => (
                            <th key={index} style={{ borderColor: color?.color, minWidth: '65px' }}
                                className={`p-1 md:sticky md:top-0`}>
                                {/* {index + 1} */}
                            </th>
                        ))}
                    </tr>
                </thead>
            <tbody className={`divide-y relative divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                {Object.keys(SumTitleFa).filter(key => isNaN(Number(key))).map((key: any, rowIndex: number) => {
                    return (
                        <tr key={rowIndex} className={`${rowIndex % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                            <Td className={`${rowIndex % 2 ? !themeMode || themeMode?.stateMode ? 'bg-[#15202c]' : 'bg-[#cecbc9]' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} p-0 md:sticky md:right-0`} value={key} style={{ minWidth: '250px' }} />
                            {watch(`totalTime.${rowIndex}`)?.map((day: GetTimeSheetSumValuesModel, colIndex: number) => (
                                <Td key={'ta' + colIndex} className='' value={
                                    <Controller
                                        control={control}
                                        name={`totalTime.${rowIndex}.${colIndex}.totalSumValue`}
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker
                                                disabled
                                                className={` w-full ${!themeMode || themeMode?.stateMode ? 'bg-dark' : 'bg-gray'} ${initialData.isConfirmed == true ? 'select-none' : 'select-text'}`}
                                                disableDayPicker
                                                value={new DateObject(`2025-03-01 ${value}`)}
                                                format="HH:mm"
                                                plugins={[
                                                    // eslint-disable-next-line react/jsx-key
                                                    <TimePicker hideSeconds />
                                                ]}
                                            />
                                        )}
                                    />
                                } />
                            ))}
                        </tr>)
                })}
            </tbody >
        </table>
    )
}

export default TotalHoursTable