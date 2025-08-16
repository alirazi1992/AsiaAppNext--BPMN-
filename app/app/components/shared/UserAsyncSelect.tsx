import AsyncSelect from 'react-select/async';
import useStore from '@/app/hooks/useStore';
import { colorStore, themeStore } from '@/app/zustandData';
import { UserAsyncSelectModal } from '@/app/Domain/M_HumanRecourse/Defects'


const UserAsyncSelect = ({
  value,
  onChange,
  defaultOptions = [],
  loadOptions,
  placeholder = 'کاربران',
  className = '',
  selectRef,
}: UserAsyncSelectModal) => {

  const themeMode = useStore(themeStore, (state) => state)
  const color = useStore(colorStore, (state) => state)

  return (
    <AsyncSelect
      value={value}
      ref={selectRef}
      placeholder={placeholder}
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      isRtl
      className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-full ${className}`}
      onChange={onChange}
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
  );
};

export default UserAsyncSelect;
