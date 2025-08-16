
// import React from 'react';
// import themeStore from '@/app/zustandData/theme.zustand';
// import colorStore from '@/app/zustandData/color.zustand';
// import useStore from '@/app/hooks/useStore';
// import { InputAdornment, TextField } from '@mui/material';
// import ClearIcon from '@mui/icons-material/Clear';
// import DatePickare from './DatePickareComponent';
// import { DateObject } from 'react-multi-date-picker';

// interface CustomDateCardProps {
//     valueTextField: string;
//     valueDatePickare: DateObject | null | undefined;
//     clearValue: () => void;
//     labelTextField: string;
//     labelDatePickare: string;
//     error?: boolean;
//     convertDate: (date: DateObject) => void;
//     focused: any
// }

// const DateCard: React.FC<CustomDateCardProps> = ({ focused, valueTextField, clearValue, labelTextField, labelDatePickare, valueDatePickare, error, convertDate }, props) => {
//     const themeMode = useStore(themeStore, (state) => state)
//     const color = useStore(colorStore, (state) => state)
//     return (
//         <div className="statusTable relative flex flex-col md:flex-row gap-2 md:flex-nowrap w-full datePicker md:grow ">
//             <div className='order-2 lg:order-1'>
//                 <TextField
//                     className='w-full p-3'
//                     size='small'
//                     label={labelTextField}
//                     value={valueTextField}
//                     InputProps={{
//                         style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f', position: 'relative' },
//                         startAdornment: (
//                             <InputAdornment onClick={clearValue}
//                                 position='end' sx={{ position: 'absolute', right: '4px', cursor: 'pointer', background: color?.color, height: '100%', width: '35px', borderRadius: '0.25rem;', display: 'flex', justifyContent: 'center' }}>
//                                 <ClearIcon sx={{ color: 'white', padding: '2px' }} />
//                             </InputAdornment>
//                         ),
//                     }}
//                     variant="outlined"
//                 />
//             </div>
//             <div dir='ltr'>
//                 <DatePickare
//                     haveHour={true}
//                     {...props}
//                     label={labelDatePickare}
//                     value={valueDatePickare}
//                     onChange={(date: DateObject) => convertDate(date)}
//                     error={error}
//                     focused={focused}
//                 />
//             </div>
//         </div>
//     )
// }

// export default DateCard

import React from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { InputAdornment, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DatePickare from './DatePickareComponent';
import { DateObject } from 'react-multi-date-picker';

interface CustomDateCardProps {
    valueTextField: string;
    valueDatePickare: DateObject | null | undefined;
    clearValue: () => void;
    labelTextField: string;
    labelDatePickare: string;
    error?: boolean;
    convertDate: (date: DateObject) => void;
    focused: any,
    haveHour?: boolean
}

const DateCard: React.FC<CustomDateCardProps> = ({ haveHour, focused, valueTextField, clearValue, labelTextField, labelDatePickare, valueDatePickare, error, convertDate }, props) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    return (
        <div className="statusTable px-0 mx-0 relative flex flex-col md:flex-row gap-2 md:flex-nowrap w-full datePicker md:grow ">
            <div className='order-2 w-full lg:order-1'>
                <TextField
                    className='w-full p-3'
                    size='small'
                    label={labelTextField}
                    value={valueTextField}
                    InputProps={{
                        style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f', position: 'relative' },
                        startAdornment: (
                            <InputAdornment onClick={clearValue}
                                position='end' sx={{ position: 'absolute', right: '4px', cursor: 'pointer', background: color?.color, height: '100%', width: '35px', borderRadius: '0.25rem;', display: 'flex', justifyContent: 'center' }}>
                                <ClearIcon sx={{ color: 'white', padding: '2px' }} />
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                />
            </div>
            <div dir='ltr' className='w-full'>
                <DatePickare
                    haveHour={haveHour == false ? false : true}
                    {...props}
                    label={labelDatePickare}
                    value={valueDatePickare}
                    onChange={(date: DateObject) => convertDate(date)}
                    error={error}
                    focused={focused}
                />
            </div>
        </div>
    )
}

export default DateCard