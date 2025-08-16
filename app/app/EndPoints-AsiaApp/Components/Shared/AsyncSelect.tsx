import React from 'react';
import AsyncSelect from 'react-select/async';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { ActionMeta, MultiValue } from 'react-select';

interface CustomAsyncSelectProps {
    cacheOptions: boolean;
    defaultOptions: boolean;
    className: string;
    placeholder: string;
    loadOptions: any;
    onChange: any
    ref?: React.Ref<any>
}

const CustomAsyncSelect: React.FC<CustomAsyncSelectProps> = ({
    cacheOptions,
    defaultOptions,
    placeholder,
    className,
    onChange,
    loadOptions,
    ref
}) => {
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state);
    return (
        <AsyncSelect
            onChange={(option: MultiValue<any>, actionMeta: ActionMeta<any>) => { onChange(option, actionMeta) }}
            isRtl isMulti className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText' + ' '+ className}`}
            cacheOptions={cacheOptions}
            defaultOptions={defaultOptions}
            placeholder={placeholder}
            loadOptions={loadOptions}
            maxMenuHeight={250}
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
                    neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`,
                    neutral20: '#607d8b',
                    neutral30: '#607d8b',
                    neutral50: '#607d8b',
                },
            })}

        />
    );
};

export default CustomAsyncSelect;