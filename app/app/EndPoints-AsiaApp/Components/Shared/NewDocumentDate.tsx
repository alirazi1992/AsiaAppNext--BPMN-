
import React from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { TextField } from '@mui/material';
import DatePickare from './DatePickareComponent';
import { DateObject } from 'react-multi-date-picker';

interface CustomDateCardProps {
    valueTextField: string;
    valueDatePickare: DateObject | string | null | undefined;
    labelTextField: string;
    labelDatePickare: string;
    error?: boolean;
    disabled?: boolean;
    convertDate?: (date: DateObject) => void;
    focused: any,
    className?: string;
    onfocus?: any
}

const DateCardNewDocument: React.FC<CustomDateCardProps> = ({ disabled, onfocus, className, focused, valueTextField, labelTextField, labelDatePickare, valueDatePickare, error, convertDate }, props) => {
    const themeMode = useStore(themeStore, (state) => state)
    return (
        <div className={`relative flex flex-col md:flex-row gap-2 md:flex-nowrap w-full datePicker md:grow md:justify-between ${className}`}>
            <div className='order-2 lg:order-1 w-full '>
                <TextField
                    dir='ltr'
                    className={`w-full p-3 ${(disabled && disabled == true) ? 'caret-transparent select-none' : 'select-text'} `}
                    size='small'
                    label={labelTextField}
                    value={valueTextField}
                    InputProps={{
                        style: { color: !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f', background: (disabled && disabled == true) ? '#607d8b10' : 'transparent' },
                    }}
                    InputLabelProps={{
                        style: { color: '#607d8b' }
                    }}
                    sx={{ width: '100%', color: '#607d8b' }}
                    // onFocus={onfocus}
                />
            </div>
            <div dir='ltr' className='w-full'>
                <DatePickare
                    disabled={disabled}
                    haveHour={true}
                    {...props}
                    label={labelDatePickare}
                    value={valueDatePickare}
                    onChange={(date: DateObject) => convertDate?.(date)}
                    error={error}
                    focused={focused}
                />
            </div>
        </div>
    )
}

export default DateCardNewDocument