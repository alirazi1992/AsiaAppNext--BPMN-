import Select, { ActionMeta, SingleValue } from 'react-select';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';

const SelectOption: React.FC<any> = ({menuPlacement, isRtl, isMulti, register, placeholder, maxHeight, className, loading, components, errorType, onChange, value, options, ...props }) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    return (
        <Select
            {...register}
            menuPlacement={menuPlacement??'bottom'}
            isClearable
            isRtl={isRtl}
            isMulti={isMulti ? true : false}
            isLoading={loading}
            components={components}
            placeholder={placeholder}
            value={value}
            onChange={(option: SingleValue<any>, actionMeta: ActionMeta<any>) => { onChange(option, actionMeta) }}
            menuPosition='absolute'
            maxMenuHeight={maxHeight}
            className={`w-full font-[FaLight] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} ${className}`}
            options={options}
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    color: '#607d8b',
                    neutral10: `${color?.color}` + '60',
                    primary25: `${color?.color}` + '60',
                    primary: color?.color,
                    primary50: color?.color,
                    neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                    neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                    neutral20: errorType ? '#d32f3c' : '#607d8b',
                    neutral30: errorType ? '#d32f3c' : '#607d8b',
                    neutral50: errorType ? '#d32f3c' : '#607d8b',
                },
            })}
        />
    )
}

export default SelectOption