import React, { useContext, useEffect, useRef, useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import themeStore from '@/app/zustandData/theme.zustand'
import useStore from "@/app/hooks/useStore";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { IconButton } from "@material-tailwind/react";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { EnterDataContext } from "./EnterData-MainContainer";
import moment from "jalali-moment";

export default function DefineTimesheet() {
    const { setDays, calendarRef, setInitialData, date, setDate } = useContext(EnterDataContext)
    const themeMode = useStore(themeStore, (state) => state)



    function update(value: number) {
        // setInitialData({ masterId: 0, details: [] })
        if (date && calendarRef.current) {
            calendarRef.current.set({ ...calendarRef.current.date, month: Number(new DateObject(date.month.number).setLocale(persian_fa).setCalendar(persian)) + value });
            const updatedDate = new DateObject(date).setMonth(date.month.number + value).setCalendar(persian).setLocale(persian_fa);
            setDate(updatedDate)
        }
    }

    const getDaysOfCurrentMonth = () => {
        const tempDays = []
        for (let i = 1; i <= date.month.length; i++) {
            
            tempDays.push({
                num : i, 
                name : new DateObject(moment(`${date.year}-${date.month.number}-${i}`, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')).setCalendar(persian).setLocale(persian_fa).weekDay.name
            })

        }
        setDays(tempDays)
    };

    useEffect(() => {
        getDaysOfCurrentMonth();
    }, [date]);



    return (
        <div style={{ textAlign: "center", height: "40px" }}>
            <div className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} flex items-center justify-center my-auto h-full`}>
                <IconButton onClick={() => update(1)} variant="outlined" color="blue-gray" size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <NavigateBeforeIcon fontSize="small" className={`mx-1 p-1 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} />
                </IconButton>
                <span className="mx-4">{date.year + '-' + date.month.name}</span>
                <IconButton onClick={() => update(-1)} variant="outlined" color="blue-gray" size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <NavigateNextIcon fontSize="small" className={`mx-1 p-1 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} />
                </IconButton>
                <Calendar
                    className="hidden"
                    ref={calendarRef}
                    calendar={persian}
                    locale={persian_fa}
                />
            </div>
        </div>
    )
}
