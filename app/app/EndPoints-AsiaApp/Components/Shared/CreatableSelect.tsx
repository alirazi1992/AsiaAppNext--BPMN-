'use client';
import React from 'react'
import { ActionMeta, MultiValue } from 'react-select';
import AsyncCreatableSelect from 'react-select/async-creatable';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';

interface CustomAsyncSelectProps {
    cacheOptions: boolean;
    defaultOptions?: any;
    className: string;
    placeholder: string;
    defaultValue?: any;
    loadOptions: any;
    onChange: any
    ref?: React.Ref<any>
    onCreateOption?: (option: any) => void
}

const CreatableSelectComponenet: React.FC<CustomAsyncSelectProps> = ({
    cacheOptions,
    defaultOptions,
    placeholder,
    className,
    defaultValue,
    onChange,
    loadOptions,
    ref,
    onCreateOption
}) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)

    return (
        <AsyncCreatableSelect
            onChange={(option: MultiValue<any>, actionMeta: ActionMeta<any>) => { onChange(option, actionMeta) }}
            isRtl isMulti className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText' + ' ' + className}`}
            cacheOptions={cacheOptions}
            defaultOptions={defaultOptions}
            defaultValue={defaultValue}
            placeholder={placeholder}
            loadOptions={loadOptions}
            maxMenuHeight={250}
            value={defaultValue}
            onCreateOption={onCreateOption}
            ref={ref}
            theme={(theme) => ({
                ...theme,
                height: 10,
                borderRadius: 5,
                colors: {
                    ...theme.colors,
                    color: '#607d8b',
                    neutral10: `${color?.color}` + '60',
                    primary25: `${color?.color}` + '60',
                    primary50: color?.color,
                    primary: color?.color,
                    neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                    neutral20: '#607d8b',
                    neutral30: '#607d8b',
                    neutral50: '#607d8b',
                },
            })}

        />
    )
}

export default CreatableSelectComponenet