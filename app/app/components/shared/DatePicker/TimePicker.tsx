import React, { useState, useRef, useEffect } from 'react';
import {TimePickerProps} from "./Models/models"
import moment from "jalali-moment"
const mapObj: Record<string, string> = {
  1: "۱",
  2: "۲",
  3: "۳",
  4: "۴",
  5: "۵",
  6: "۶",
  7: "۷",
  8: "۸",
  9: "۹",
  0: "۰"
};

const TimePicker: React.FC<TimePickerProps> = (props) => {
  const [editable, setEditable] = useState<boolean>(false);
  const [minuteDisabled, setMinuteDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [minute, setMinute] = useState<number>(Math.floor(parseInt(props.selectedTime.substring(3, 5)) / 5) * 5);
  const [hour, setHour] = useState<string>(props.selectedTime.substring(0, 2));
  const [disableFromYear, setDisableFromYear] = useState<string>("");
  const [disableFromMonth, setDisableFromMonth] = useState<string>("");
  const [disableFromDay, setDisableFromDay] = useState<string>("");
  const [disableFromHour, setDisableFromHour] = useState<string>("");
  const [disableFromMinute, setDisableFromMinute] = useState<string>("");
  const hourRef = useRef<HTMLSelectElement>(null);
  const minuteRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    let unix = "";
    if (props.disableFromUnix) {
      unix = props.disableFromUnix.toString();
      setDisableFromYear(moment(parseInt(unix) * 1000).format("jYYYY"));
      setDisableFromMonth(moment(parseInt(unix) * 1000).format("jMM"));
      setDisableFromDay(moment(parseInt(unix) * 1000).format("jDD"));
      setDisableFromHour(moment(parseInt(unix) * 1000).format("HH"));
      setDisableFromMinute(moment(parseInt(unix) * 1000).format("mm"));
    }
  }, [props.disableFromUnix]);

  useEffect(() => {
    setMinute(Math.floor(parseInt(props.selectedTime.substring(3, 5)) / 5) * 5);
    setHour(props.selectedTime.substring(0, 2));
    setError("");
    setMinuteDisabled(false);
    setEditable(false);
  }, [props.selectedTime]);

  const minuteChanged = () => {
    const minuteElement = minuteRef.current;
    const hourElement = hourRef.current;
    const { changeEvent } = props;
    const minuteInt = parseInt(minuteElement?.value ?? '0');
    const hourInt = parseInt(hourElement?.value ?? '0');

    if (hourInt >= 0 && hourInt < 24) {
      if (minuteInt >= 0 && minuteInt < 60) {
        setError("");
        setEditable(false);
        if (changeEvent) changeEvent(`${hourElement?.value ?? '00'}:${minuteElement?.value ?? '00'}`);
      } else {
        setError("دقیقه حداکثر ۶۰ باشد");
      }
    } else {
      setError("ساعت حداکثر ۲۴ باشد");
    }
  }

  const hourChanged = () => {
    const hourElement = hourRef.current;
    const { changeEvent } = props;
    const hourInt = parseInt(hourElement?.value ?? '0');

    if (hourInt >= 0 && hourInt < 24) {
      if (changeEvent) changeEvent(`${hourElement?.value ?? '00'}:${minute}`);
      setError("");
      setMinuteDisabled(false);
      setHour(hourElement?.value ?? '00');
    } else {
      setError("ساعت حداکثر ۲۴ باشد");
      setMinuteDisabled(true);
    }
  }

  const TimePicker = () => {
    const hourOptions = [];
    let initCheck = false;
    const { selectedDay, disableFromYear: year, disableFromMonth: month, disableFromDay: day } = props;

    if (props.currentMonth! < 10) props.currentMonth = 0 + props.currentMonth!;
    if (!!selectedDay) {
      const formattedDay = moment(selectedDay, "jYYYYjMMjDD").format("jDD");
      initCheck = year === disableFromYear && month === disableFromMonth && formattedDay === disableFromDay;
    }

    for (let i = 0; i <= 23; i++) {
      let number = i.toString();
      let enable = true;
      if (i < 10) number = "0" + number;
      let persianNumber = number.replace(/1|2|3|4|5|6|7|8|9|0/gi, (e) => mapObj[e]);
      
      if (initCheck && number <= disableFromHour) enable = false;

      if (enable) {
        hourOptions.push(
          <option key={i} value={number}>
            {persianNumber}
          </option>
        );
      }
    }

    const hourElement = (
      <select onChange={hourChanged} value={hour} ref={hourRef}>
        {hourOptions}
      </select>
    );

    const minuteOptions = [];
    for (let i = 0; i <= 11; i++) {
      let min = 5 * i;
      let number = min.toString();
      if (min < 10) number = "0" + number;
      let persianNumber = number.replace(/1|2|3|4|5|6|7|8|9|0/gi, (e) => mapObj[e]);
      minuteOptions.push(
        <option key={i} value={number}>
          {persianNumber}
        </option>
      );
    }
    const minuteElement = (
      <select disabled={minuteDisabled} value={minute} onChange={minuteChanged} ref={minuteRef}>
        {minuteOptions}
      </select>
    );

    return (
      <div>
        <div className="right">{minuteElement}:</div>
        <div className="left">{hourElement}</div>
      </div>
    );
  }

  const { selectedDay } = props;
  const timeString = props.selectedTime.toString().replace(/1|2|3|4|5|6|7|8|9|0/gi, (e) => mapObj[e]);

  return (
    <div className="JC-years">
      {!editable && (
        <div
          className="number"
          style={{ cursor: "pointer" }}
          onClick={() => setEditable(true)}
        >
          {timeString}
        </div>
      )}
      {!!selectedDay && editable && <TimePicker />}
      {editable && !selectedDay && (
        <p style={{ color: "darkorange", fontSize: "12px" }}>
          ابتدا یک تاریخ انتخاب نمایید
        </p>
      )}
      {error && (
        <div className="JC-tooltip">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TimePicker;