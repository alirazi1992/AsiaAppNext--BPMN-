'use client';
import React, { useState } from 'react';
import moment from 'jalali-moment';
import { disabled , DaysProps} from './Models/models';

interface MapObj {
  [key: string]: string;
}
const mapObj:MapObj = {
  1: '۱',
  2: '۲',
  3: '۳',
  4: '۴',
  5: '۵',
  6: '۶',
  7: '۷',
  8: '۸',
  9: '۹',
  0: '۰'
};

const Days = (daysProps : DaysProps) => {
  const result = [];

  let year = daysProps.selectedYear.toString();
  let month = daysProps.currentMonth!.toString();
  const [disabled , setDisabled] = useState<disabled>()

  if (month.length == 1) month = '0' + month;

  let enable = true;
  let check = false;

  if (daysProps.disableFromUnix) {
    const unix = daysProps.disableFromUnix / 1000;
    setDisabled({
      disableFromYear : moment(unix).format('jYYYY'),
      disableFromMonth : moment(unix).format('jMM'),
      disableFromDay : parseInt(moment(unix).format('jDD'))
    });

    if (disabled!.disableFromYear > year) enable = false;
    else if (disabled!.disableFromYear == year && disabled!.disableFromMonth > month) enable = false;
    else if (disabled!.disableFromYear == year && disabled!.disableFromMonth == month) check = true;
  }

  for (let i = 1; daysProps.daysCount! >= i; i++) {
    let addedClass = '';
    let marginRight = '0%';
    let date : string;
    let number = i.toString().replace(/1|2|3|4|5|6|7|8|9|0/gi, function (e) {
      return mapObj[e];
    });

    if (i == 1) marginRight = daysProps.firstDay! * 14.28 + '%';

    if (i < 10) date = year + month + '0' + i.toString();
    else date = year + month + i.toString();

    if (date == daysProps.selectedDay) addedClass = ' selected';
    const today = moment().format('jYYYYjMMjDD');

    if (date == today) addedClass += ' current-date';

    if (check) {
      if (i < disabled!.disableFromDay) enable = false;
      else enable = true;
    }

    result.push(<div className={'day-items' + addedClass} key={i} id={date} style={enable ? { marginRight: marginRight } : { background: '#ccc', cursor: 'default', marginRight: marginRight }} onClick={() => enable ? daysProps.clickEvent(1, date) : {}}>{number}</div>);
  }

  return <div className="JC-days">
    <div className="holder">
      {!!daysProps.daysCount && result}
    </div>
  </div>;
}

export default Days;
