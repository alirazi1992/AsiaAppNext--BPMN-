import React, { useState } from 'react';
import {MonthsProps} from "./Models/models"
const Months: React.FC<MonthsProps> = (props) => {
  const [months] = useState<string[]>([
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند"
  ]);
  const [monthPickerView, setMonthPickerView] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(props.month!);

  const monthClicked = (i: number): void => {
    const { clickEvent } = props;
    if (clickEvent) clickEvent(i);
    setMonthPickerView(false);
    setSelectedMonth(i);
  }

  const renderMonths = (): JSX.Element[] => {
    const result: JSX.Element[] = [];
    for (let i = 1; months.length >= i; i++) {
      if (selectedMonth === i) {
        result.push(
          <div key={i} className="month-items selected">
            {months[i - 1]}
          </div>
        );
      } else {
        result.push(
          <div
            key={i}
            className="month-items"
            onClick={() => monthClicked(i)}
          >
            {months[i - 1]}
          </div>
        );
      }
    }
    return result;
  }

  const { month, monthTitleEnable } = props;

  return (
    <div className="JC-months">
      {monthTitleEnable && <span>ماه: </span>}
      <div className="holder">
        <div onClick={() => monthClicked(month! - 1)} className="prev">
          {">"}
        </div>
        <div
          onClick={() => {
            setMonthPickerView(!monthPickerView);
          }}
          className="print-month"
        >
          {months[month! - 1]}
        </div>
        <div onClick={() => monthClicked(month! + 1)} className="next">
          {"<"}
        </div>
        {monthPickerView && (
          <div className="monthPicker">{renderMonths()}</div>
        )}
      </div>
    </div>
  );
}

export default Months;