import AsyncSelect from 'react-select/async';
import useStore from '@/app/hooks/useStore';
import { colorStore, themeStore } from '@/app/zustandData';
import { memo } from 'react'
type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholderText?: string;
};

const UserSearchInput = ({ value, onChange, placeholderText }: Props) => {
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state);
    return (
        <div className="w-full">
            <AsyncSelect
                inputValue={value}
                onInputChange={(inputValue, { action }) => {
                    if (action === 'input-change') {
                        onChange(inputValue);
                    }
                }}
                value={value}
                isRtl
                cacheOptions
                defaultOptions={false}
                loadOptions={() => Promise.resolve([])}
                menuIsOpen={false}
                components={{
                    DropdownIndicator: null,
                    IndicatorSeparator: null,
                    Menu: () => null,
                }}
                placeholder={placeholderText ? placeholderText : "جستجو..."}
                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-full`}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 5,
                    colors: {
                        ...theme.colors,
                        color: '#607d8b',
                        neutral10: color?.color,
                        primary25: color?.color,
                        primary: '#607d8b',
                        neutral0: !themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce",
                        neutral80: !themeMode || themeMode?.stateMode ? "white" : "#463b2f",
                    },
                })}
            />
        </div>
    );
};

export default memo(UserSearchInput);
