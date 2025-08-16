import React, { useState } from 'react';
import DateTimePicker from './DateTimePicker.js';
import { DateTimeRangePickerProps } from "./Models/models.jsx"

const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = (props) => {
  const [disableFromUnix, setDisableFromUnix] = useState<number>();

  const change = (unix: number, formatted: string) => {
    const { onChangeStart } = props;
    setDisableFromUnix(unix);
    if (!!onChangeStart) onChangeStart(unix, formatted);
  };

  const secondchange = (unix: number, formatted: string) => {
    const { onChangeEnd } = props;
    if (!!onChangeEnd) onChangeEnd(unix, formatted);
  };

  let {
    placeholderEnd,
    placeholderStart,
    idStart,
    idEnd,
    format,
    customClassStart,
    customClassEnd,
    containerClass,
    inputTextAlign,
    monthTitleEnable,
    cancelOnBackgroundClick,
    preSelectedStart,
    renderPointer = true,
    pointer,
    ...rest
  } = props;

  if (!placeholderStart) placeholderStart = '';
  if (!placeholderEnd) placeholderEnd = '';
  if (!idStart) idStart = '';
  if (!idEnd) idEnd = '';
  return (
    <div className="jdtrp" style={{ textAlign: 'initial' }}>
      <DateTimeRangePicker
    
        monthTitleEnable={monthTitleEnable}
        containerClass={containerClass}
        inputTextAlign={inputTextAlign}
        customClass={customClassStart}
        placeholder={placeholderStart}
        format={format}
        onChange={change}
        cancelOnBackgroundClick={cancelOnBackgroundClick}
        id={idStart}
        preSelected={preSelectedStart}
        {...rest}
      />
      {renderPointer && <div>{pointer || '->'}</div>}
      {!disableFromUnix && <div>{placeholderEnd}</div>}
      {!!disableFromUnix && (
        <DateTimeRangePicker
          monthTitleEnable={monthTitleEnable}
          containerClass={containerClass}
          inputTextAlign={inputTextAlign}
          customClass={customClassEnd}
          placeholder={placeholderEnd}
          disableFromUnix={disableFromUnix}
          format={format}
          cancelOnBackgroundClick={cancelOnBackgroundClick}
          onChange={secondchange}
          id="datePicker"
          preSelected={preSelectedStart}
          {...rest}
        />
      )}
    </div>
  );
};

export default DateTimeRangePicker;