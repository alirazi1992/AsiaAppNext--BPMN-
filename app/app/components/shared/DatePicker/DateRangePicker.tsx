// import React, { useState } from 'react';
// import DatePicker from './index.js';
// import {DateRangePickerProps} from './Models/models.jsx'
// const DateRangePicker: React.FC<DateRangePickerProps> = (props) => {
//   const [disableFromUnix, setDisableFromUnix] = useState<number>();

//   const change = (unix: number, formatted: string) => {
//     const { onChangeStart } = props;
//     setDisableFromUnix(unix);
//     if (!!onChangeStart) onChangeStart(unix, formatted);
//   };

//   const secondChange = (unix: number, formatted: string) => {
//     const { onChangeEnd } = props;
//     if (!!onChangeEnd) onChangeEnd(unix, formatted);
//   };

//   let {
//     placeholderEnd,
//     placeholderStart,
//     idStart,
//     idEnd,
//     format,
//     customClassEnd,
//     customClassStart,
//     containerClass,
//     inputTextAlign,
//     monthTitleEnable,
//     cancelOnBackgroundClick,
//     preSelectedStart,
//     renderPointer = true,
//     pointer,
//     ...rest
//   } = props;

//   if (!placeholderStart) placeholderStart = '';
//   if (!placeholderEnd) placeholderEnd = '';
//   if (!idStart) idStart = '';
//   if (!idEnd) idEnd = '';

//   return (
//     <div className="jdtrp" style={{ textAlign: 'initial' }}>
//       <DatePicker
//         monthTitleEnable={monthTitleEnable}
//         containerClass={containerClass}
//         inputTextAlign={inputTextAlign}
//         customClass={customClassStart}
//         placeholder={placeholderStart}
//         format={format}
//         onChange={change}
//         cancelOnBackgroundClick={cancelOnBackgroundClick}
//         id={idStart}
//         preSelected={preSelectedStart}
//         {...rest}
//       />
//       {renderPointer && <div>{pointer || '->'}</div>}
//       {!disableFromUnix && <div>{placeholderEnd}</div>}
//       {!!disableFromUnix && (
//         <DatePicker
//           containerClass={containerClass}
//           inputTextAlign={inputTextAlign}
//           customClass={customClassEnd}
//           placeholder={placeholderEnd}
//           disableFromUnix={disableFromUnix}
//           format={format}
//           onChange={secondChange}
//           cancelOnBackgroundClick={cancelOnBackgroundClick}
//           id="datePicker"
//           preSelected={preSelectedStart}
//           {...rest}
//         />
//       )}
//     </div>
//   );
// };

// export default DateRangePicker;
import React, { useEffect, useState } from 'react';
import DatePicker from './index';
import Days from './Days';
import Months from './Months';
import Years from './Years';
import Styles from './StylesDate'
import { DateRangePickerProps } from './Models/models.jsx'
import Input from './Input';
import Background from './Background';
import moment from 'jalali-moment';
import colorStore from './../../../zustandData/color.zustand';
import themeStore from './../../../zustandData/theme.zustand';
import useStore from "./../../../hooks/useStore";
const DateRangePicker: React.FC<DateRangePickerProps> = (props) => {
  const [disableFromUnix, setDisableFromUnix] = useState<number>();
  const [openPicker, setOpenPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [currentMonth, setCurrentMonth] = useState<number>();
  const [selectedMonthFirstDay, setSelectedMonthFirstDay] = useState<number>();
  const [selectedDay, setSelectedDay] = useState<string | null | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [inputValue, setInputValue] = useState<string>();
  const [daysCount, setDaysCount] = useState<number | undefined>(0);
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);


  useEffect(() => {
    const preSelected =
      props.preSelected && props.format
        ? moment(props.preSelected, props.format).format(props.format)
        : '';

    setSelectedDay(preSelected);
    setDaysCount(
      daysInMonth(
        moment(props.currentDate, props.format).jMonth() + 1,
        moment(props.currentDate, props.format).jYear()
      )
    );
    setSelectedYear(parseInt(moment().format('jYYYY')));
    setCurrentMonth(parseInt(moment().format('jMM')));
    setSelectedMonthFirstDay(
      moment(
        moment().format('jYYYY') +
        '/' +
        moment().format('jMM') +
        '/01',
        'jYYYY/jMM/jDD'
      ).weekday()
    );
    setSelectedTime(moment().format('HH:mm'));
    setInputValue(preSelected);
  }, [props.preSelected, props.format, props.currentDate]);

  const daysInMonth = (month: number, selectedYear: number) => {
    if (0 < month && month < 7) return 31;
    else if (6 < month && month < 12) return 30;
    else if (month == 12 && moment.jIsLeapYear(selectedYear)) return 30;
    else if (month == 12 && !moment.jIsLeapYear(selectedYear)) return 29;
  };

  const change = (unix: number, formatted: string) => {
    const { onChangeStart } = props;
    setDisableFromUnix(unix);
    if (!!onChangeStart) onChangeStart(unix, formatted);
  };

  const secondChange = (unix: number, formatted: string) => {
    const { onChangeEnd } = props;
    if (!!onChangeEnd) onChangeEnd(unix, formatted);
  };


  const submitHandler = (e: React.MouseEvent) => {
    e.preventDefault();

    const { onChange, format } = props;
    const formatted = format || 'jYYYY-jMM-jDD HH:mm';

    if (!!selectedDay && !!selectedTime) {
      setOpenPicker(false);

      if (onChange) {
        const unix = moment(
          selectedDay + ' ' + selectedTime,
          'jYYYYjMMjDD HH:mm'
        ).unix();

        onChange(unix, inputValue || '');
      }
    }
  };

  let {
    placeholderEnd,
    placeholderStart,
    idStart,
    idEnd,
    format,
    customClassEnd,
    customClassStart,
    containerClass,
    inputTextAlign,
    monthTitleEnable,
    cancelOnBackgroundClick,
    preSelectedStart,
    renderPointer = true,
    pointer,
    id,
    placeholder,
    inputAlign,
    inputComponent,
    customClass,
    backdrop,
    ...rest
  } = props;



  if (!placeholderStart) placeholderStart = '';
  if (!placeholderEnd) placeholderEnd = '';
  if (!idStart) idStart = '';
  if (!idEnd) idEnd = '';

  const daysClicked = (day: string, momentDay: string) => {
    const { format } = props;
    const formatted = format || 'jYYYY-jMM-jDD HH:mm';

    if (selectedDay !== momentDay) {
      setSelectedDay(momentDay);
      setInputValue(
        moment(momentDay + ' ' + selectedTime, 'jYYYYjMMjDD HH:mm').format(
          formatted
        )
      );
    }
  };

  const monthsClicked = (month: number) => {
    const year = selectedYear || parseInt(moment().format('jYYYY'));
    let thisMonth = month;
    setDaysCount(0);

    if (month === 0) {
      setCurrentMonth(12);
      setSelectedYear(selectedYear! - 1);
      thisMonth = 12;
      firstDayOfMonth(12, selectedYear! - 1);
    } else if (month === 13) {
      setCurrentMonth(1);
      setSelectedYear(selectedYear! + 1);
      thisMonth = 1;
      firstDayOfMonth(1, selectedYear! + 1);
    } else {
      setCurrentMonth(month);
      firstDayOfMonth(month, year);
    }

    setDaysCount(daysInMonth(month, year));
  };

  const firstDayOfMonth = (mo: number, ye: number) => {
    let month = mo.toString();
    let year = ye.toString();

    if (month.length === 1) month = '0' + month;

    setSelectedMonthFirstDay(
      moment(year + '/' + month + '/01', 'jYYYY/jMM/jDD').weekday()
    );
  };
  const yearSelected = (year: number) => {
    setSelectedYear(year);
    firstDayOfMonth(currentMonth!, year);
  };

  const cancelPicker = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenPicker(false);
  };

  return (
    <>
      <style jsx global>{`${Styles({ color: color?.color, themeCard: !themeMode ||themeMode?.stateMode ? 'cardDark' : 'cardLight', themeTable: !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight', textColor: !themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText', stateMode: !themeMode ||themeMode?.stateMode })}`}</style>
      <div style={{ textAlign: 'initial' }} className={containerClass}>
        <Input
          type="text"
          id={id}
          placeholder={placeholder}
          dir="ltr"
          style={{ textAlign: inputAlign }}
          readOnly
          value={inputValue}
          onClick={() => {
            setOpenPicker(!openPicker);
          }}
          elementcomponent={inputComponent}
        />
        {cancelOnBackgroundClick && openPicker && (
          <Background onClick={() => setOpenPicker(false)} />
        )}
        {openPicker && (
          <div className={'JDatePicker ' + customClass}>
            <div className="JDheader">
              <div className="right border-6">
                <Years
                  changeEvent={(returnedYear) => yearSelected(returnedYear)}
                  year={selectedYear || parseInt(moment().format('jYYYY'))}
                />
              </div>
            </div>
            <Months
              monthTitleEnable={monthTitleEnable}
              clickEvent={(returnedMonth) => monthsClicked(returnedMonth)}
              month={currentMonth}
            />
            <div className="days-titles">
              <div>ش</div>
              <div>ی</div>
              <div>د</div>
              <div>س</div>
              <div>چ</div>
              <div>پ</div>
              <div>ج</div>
            </div>
            <Days
              disableFromUnix={disableFromUnix}
              selectedYear={selectedYear || parseInt(moment().format('jYYYY'))}
              selectedDay={selectedDay}
              currentMonth={currentMonth}
              daysCount={daysCount}
              firstDay={selectedMonthFirstDay}
              clickEvent={(day: string, momentDay: string) => daysClicked(day, momentDay)}
            />
            <div>
              <button onClick={(e) => submitHandler(e)} className={"text-green-500 JDsubmit"}>
                تایید
              </button>
              <button className={"text-red-500 JDcancel"} onClick={cancelPicker}>
                بستن
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DateRangePicker;