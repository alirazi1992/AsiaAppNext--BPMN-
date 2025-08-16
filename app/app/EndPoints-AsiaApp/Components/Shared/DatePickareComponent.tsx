/* eslint-disable react/jsx-key */
'use client'
import React, { createContext } from 'react'
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/layouts/mobile.css"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import "react-multi-date-picker/styles/backgrounds/bg-gray.css"
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import MyCustomComponent from "./CustomTheme_Mui";

export const DateContext = createContext<{ state: any; setState: React.Dispatch<React.SetStateAction<any>> } | null>(null)
import { TextField } from "@mui/material";

const DatePickare: React.FC<any> = ({ disableDayPicker, plugin, multiple, label, error, focused, onChange, value, disabled, haveHour, register, ...props }) => {
    const themeMode = useStore(themeStore, (state) => state);

    return (
        <MyCustomComponent>
            <>
                <DatePicker
                    {...props}
                    disableDayPicker={disableDayPicker}
                    disabled={disabled && disabled == true ? true : false}
                    value={value}
                    onChange={onChange}
                    multiple={multiple && multiple == true ? true : false}
                    calendar={persian}
                    locale={persian_fa}
                    format={(haveHour && haveHour == true) ? "YYYY/MM/DD HH:mm:ss" : "YYYY/MM/DD"}
                    className={` w-full rmdp-mobile ${!themeMode || themeMode?.stateMode ? 'bg-dark' : 'bg-gray'} ${disabled == true ? 'select-none' : 'select-text'}`}
                    render={<TextField
                        {...register}
                        focused={focused != '' ? true : false}
                        error={error && true}
                        autoComplete='off'
                        InputProps={{
                            style: { color: error ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f', background: disabled && disabled == true && '#607d8b10' },
                        }}
                        sx={{ fontFamily: 'FaLight', width: '100%' }}
                        className={`${disabled && disabled == true && 'caret-transparent'} w-full lg:my-0 font-[FaLight] `}
                        dir='ltr'
                        size='small'
                        label={label}
                    />}
                    mobileLabels={{
                        OK: "تائید",
                        CANCEL: "بستن",
                    }}

                    plugins={haveHour == true ? [<TimePicker hideSeconds position="bottom" />] : plugin ? plugin : []}
                />
            </>
        </MyCustomComponent>
    )
}

export default DatePickare