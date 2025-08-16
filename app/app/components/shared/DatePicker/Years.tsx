import React, { useState, useRef, useEffect } from 'react';
import {YearsProps} from "./Models/models"

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

const Years: React.FC<YearsProps> = (props) => {
  const [year, setYear] = useState<number>(props.year);
  const [error, setError] = useState<string>("");
  const [editable, setEditable] = useState<boolean>(false);
  const yearRef = useRef<HTMLInputElement>(null);

  const yearChanged = () => {
    if (yearRef.current) {
      const { value } = yearRef.current;

      setYear(Number(value));

      if (value.length === 4 && Number(value) > 1300 && Number(value) < 1500) {
        setEditable(false);
        setError("");
        if (props.changeEvent) props.changeEvent(Number(value));
      } else {
        setError("سال ۴ رقم و درفاصله ۱۳۰۰ تا ۱۵۰۰ باشد");
      }
    }
  }

  useEffect(() => {
    setYear(props.year);
  }, [props.year]);

  let yearString = year.toString().replace(/1|2|3|4|5|6|7|8|9|0/gi, (e) => mapObj[e]);

  return (
    <div className="JC-years">
      <span>سال: </span>
      {!editable && (
        <span className="number" style={{ cursor: "pointer" }} onClick={() => setEditable(true)}>
          {yearString}
        </span>
      )}
      {editable && (
        <input
          type="tel"
          ref={yearRef}
          placeholder="سال"
          onChange={yearChanged}
          onBlur={yearChanged}
          value={year}
        />
      )}
      {editable && (
        <div
          onClick={yearChanged}
          style={{
            content: "&quot;&quot;",
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "0px",
            zIndex: 1,
            left: "0px"
          }}
        />
      )}
      {error && (
        <div className="JC-tooltip">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Years;