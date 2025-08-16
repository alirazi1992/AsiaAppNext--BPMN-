"use client"
import moment from 'jalali-moment';
import React, { useState, useEffect } from 'react';
import Days from './Days';
import Months from './Months';
import Styles from './Styles';
import Years from './Years';
import Input from './Input';
import Background from './Background';
import { JDatePickerProps, InputProps } from './Models/models';

const JDatePicker: React.FC<JDatePickerProps> = (props) => {
  const [openPicker, setOpenPicker] = useState(false);
  const [daysCount, setDaysCount] = useState(0);
  const [selectedDay, setSelectedDay] = useState('');
  const [currentMonth, setCurrentMonth] = useState<number>(
    parseInt(moment().format('jMM'))
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    parseInt(moment().format('jYYYY'))
  );
  const [selectedMonthFirstDay, setSelectedMonthFirstDay] = useState(-1);
  const [inputValue, setInputValue] = useState('');

  let {
    id,
    placeholder,
    disableFromUnix,
    customClass,
    containerClass,
    inputTextAlign,
    monthTitleEnable,
    inputComponent,
    cancelOnBackgroundClick,
    onChange,
    preSelected,
    format,
    controlValue,
  } = props;

  useEffect(() => {
    const selectedMonthFirstDay = moment(
      selectedYear.toString() + '/' + currentMonth.toString() + '/01',
      'jYYYY/jMM/jDD'
    ).weekday();

    setSelectedMonthFirstDay(selectedMonthFirstDay);

  }, [selectedYear, currentMonth, selectedDay, props.format, props.controlValue]);

  useEffect(() => {
    if (
      props.controlValue &&
      preSelected !== props.preSelected &&
      preSelected !== selectedDay
    ) {
      setSelectedDay(
        preSelected!.length > 1
          ? moment(preSelected, props.format).format('jYYYYjMMjDD')
          : ''
      );
      setInputValue(preSelected!);
    }
  }, [preSelected, props.preSelected, props.controlValue, props.format, selectedDay]);

  const daysInMonth = (month: number, selectedYear: number): number => {
    if (month > 0 && month < 7) return 31;
    else if (month > 6 && month < 12) return 30;
    else if (month === 12 && moment.jIsLeapYear(selectedYear)) return 30;
    else if (month === 12 && !moment.jIsLeapYear(selectedYear)) return 29;
    return 0;
  };

  const daysClicked = (day: string, momentDay: string): void => {
    if (!format) format = 'jYYYY-jMM-jDD';
    if (selectedDay !== momentDay) {
      setSelectedDay(momentDay);
      setInputValue(
        moment(momentDay + ' 23:59:59', 'jYYYYjMMjDD HH:mm:ss').format(format)
      );
      setOpenPicker(false);
    }

    let formatted;
    if (!!format) {
      formatted = moment(
        momentDay + ' 23:59:59',
        'jYYYYjMMjDD HH:mm:ss'
      ).format(format);
    }
    if (onChange) {
      onChange(
        moment(momentDay + ' 23:59:59', 'jYYYYjMMjDD HH:mm:ss').unix(),
        formatted!
      );
    }
  };

  const monthsClicked = (month: number): void => {
    let year = selectedYear;
    let thisMonth = month;
    setDaysCount(0);

    if (month === 0) {
      setCurrentMonth(12);
      setDaysCount(daysInMonth(12, selectedYear - 1));
      setSelectedYear(selectedYear - 1);
      thisMonth = 12;
      year = selectedYear - 1;
    } else if (month === 13) {
      setCurrentMonth(1);
      setDaysCount(daysInMonth(1, selectedYear + 1));
      setSelectedYear(selectedYear + 1);
      thisMonth = 1;
      year = selectedYear + 1;
    } else {
      setCurrentMonth(month);
      setDaysCount(daysInMonth(month, selectedYear));
    }

    firstDayOfMonth(thisMonth, year);
  };

  const firstDayOfMonth = (mo: number, ye: number): void => {
    let month = mo.toString();
    let year = ye.toString();
    if (month.length === 1) month = '0' + month;
    setSelectedMonthFirstDay(
      moment(year + '/' + month + '/01', 'jYYYY/jMM/jDD').weekday()
    );
  };

  const yearSelected = (year: number): void => {
    setSelectedYear(year);
    firstDayOfMonth(currentMonth, year);
  };

  let inputAlign =
    !!inputTextAlign && typeof inputTextAlign != 'undefined'
      ? inputTextAlign
      : 'right';

  return (
    <>
    <style id="jdstyle">{Styles(null)}</style>
    <div style={{ textAlign: 'initial' }} className={containerClass}>
      <React.Fragment>
        <Input
          type="text"
          id={id}
          placeholder={placeholder}
          dir="ltr"
          style={{ textAlign: inputAlign }}
          readOnly
          value={inputValue}
          onClick={() => setOpenPicker(!openPicker)}
          elementcomponent={inputComponent}
        />
        {cancelOnBackgroundClick && openPicker && (
          <Background onClick={() => setOpenPicker(false)} />
        )}
      </React.Fragment>
      {openPicker && (
        <div className={'JDatePicker ' + customClass}>
          <div className="JDheader">
            <div className="right">
              <Years
                changeEvent={(returnedYear: number) =>
                  yearSelected(returnedYear)
                }
                year={selectedYear}
              />
            </div>
            <div className="left" />
          </div>
          <Months
            monthTitleEnable={monthTitleEnable}
            clickEvent={(returnedMonth: number) => monthsClicked(returnedMonth)}
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
            selectedYear={selectedYear}
            selectedDay={selectedDay}
            currentMonth={currentMonth}
            daysCount={daysCount}
            firstDay={selectedMonthFirstDay}
            clickEvent={(day: string, momentDay: string) => daysClicked(day, momentDay)}
          />
        </div>
      )}
    </div>
    </>
  );
};

export default JDatePicker;