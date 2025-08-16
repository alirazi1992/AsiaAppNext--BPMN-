import React from 'react';
import { TextField } from '@mui/material';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';

interface CustomTextFieldProps {
    label: string;
    error?: boolean;
    tabIndex?: number;
    register?: any;
    type?: string;
    color?: string;
    onFocus?: (data: any) => void;
    dir?: 'ltr' | 'rtl';
}

const TextFieldItem: React.FC<CustomTextFieldProps> = ({ onFocus, color, type, register, label, error, tabIndex, dir = 'rtl' }, props) => {
    const themeMode = useStore(themeStore, (state) => state)
    return (
        <TextField
            type={type ?? 'text'}
            autoComplete='off'
            sx={{ fontFamily: 'FaLight' }}
            tabIndex={tabIndex}
            {...register}
            error={!!error}
            className='w-full lg:my-0 font-[FaLight]'
            dir={dir}
            size='small'
            label={label}
            onFocus={onFocus}
            InputProps={{
                style: { color: error ? '#b91c1c' : !themeMode || !themeMode || themeMode?.stateMode ? 'white' : color ?? '#463b2f' },
            }}
        />
    );
};

export default TextFieldItem;