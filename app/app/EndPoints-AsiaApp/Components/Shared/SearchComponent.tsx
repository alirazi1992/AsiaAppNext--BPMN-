'use client';
import React, { useRef, RefObject } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { Card, InputAdornment, TextField } from '@mui/material';
import MyCustomComponent from './CustomTheme_Mui';
import { SearchKeyProps } from '@/app/Domain/shared';
import { TextFieldProps } from '@mui/material';

const CustomizedSearched: React.FC<SearchKeyProps> = ({ searchKey, className }) => {
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state);
    const searchRef: RefObject<TextFieldProps['inputRef']> = useRef(null);
    return (
        <MyCustomComponent>
            <Card
                sx={{ paddingX: className ? 0 : 2, paddingY: className ? 1 : 2, display: 'flex', justifyContent: 'end', background: 'transparent', boxShadow: 'none' }}>
                <TextField
                    dir='rtl'
                    className={className ? className : 'mx-auto md:m-4 w-11/12 md:w-4/12'}
                    size='small'
                    label="Search"
                    inputRef={searchRef}
                    InputProps={{
                        style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f', position: 'relative' },
                        startAdornment: (
                            <InputAdornment onClick={() => {
                                if (searchRef.current && 'value' in searchRef.current) {
                                    searchKey(searchRef.current.value as string);
                                }
                            }} position='end' sx={{ position: 'absolute', right: '4px', cursor: 'pointer', background: color?.color, height: '100%', width: '35px', borderRadius: '0.25rem;', display: 'flex', justifyContent: 'center' }}>
                                <SearchIcon sx={{ color: 'white', padding: '2px' }} />
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                />
            </Card>
        </MyCustomComponent>
    );
}
export default CustomizedSearched;