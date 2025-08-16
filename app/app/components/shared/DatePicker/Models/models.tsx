
export interface Props {
  id?: string;
  placeholder?: string;
  preSelected?: string;
  format?: string;
  onChange?: (timestamp: number, formatted: string) => void;
  customClass?: string;
  containerClass?: string;
  inputTextAlign?: "left" | "right";
  monthTitleEnable?: boolean;
  disableFromUnix?: number;
  inputComponent: React.FC<{}>;
  controlValue?: any;
  cancelOnBackgroundClick?: boolean;
  openPicker?: boolean;
  daysCount?: number;
  selectedDay?: string;
  currentMonth?: number;
  selectedYear?: number;
  selectedMonthFirstDay?: number;
  selectedTime?: string;
  inputValue?: string;
}

export interface YearsProps {
  year: number;
  changeEvent?: (year: number) => void;
}

export interface TimePickerProps {
  selectedTime: string;
  selectedYear: number | null;
  currentMonth: number | undefined;
  selectedDay: string | null | undefined;
  disableFromUnix?: number;
  changeEvent?: (selectedTime: string) => void;
  disableFromYear?: any,
  disableFromMonth?: any,
  disableFromDay?: any
}

export interface MonthsProps {
  month: number | undefined;
  monthTitleEnable?: boolean;
  clickEvent?: (month: number) => void;
}

export interface JDatePickerProps {
  id?: string;
  placeholder?: string;
  disableFromUnix?: number;
  customClass?: string;
  containerClass?: string;
  inputTextAlign?: string;
  monthTitleEnable?: boolean;
  inputComponent?: React.FC<{}>;
  cancelOnBackgroundClick?: boolean;
  onChange?: (unixTime: number, formattedTime: string) => void;
  preSelected?: string;
  format?: string;
  controlValue?: boolean;
};

export interface InputProps {
  type: string
  id?: string
  placeholder?: string
  dir: string
  style: {}
  readOnly: boolean
  value?: string
  onClick: any
  elementcomponent?: React.FC<{}>
}

export interface disabled {
  disableFromYear: string
  disableFromMonth: string
  disableFromDay: number
}

export interface DaysProps {
  firstDay: number | undefined
  selectedYear: number
  currentMonth: number | undefined
  selectedDay: string | null | undefined
  daysCount: number | undefined
  clickEvent: any
  disableFromUnix: number | undefined
}

export interface DateTimeRangePickerProps {
  onChangeStart?: (unix: number, formatted: string) => void;
  onChangeEnd?: (unix: number, formatted: string) => void;
  placeholderEnd?: string;
  placeholderStart?: string;
  idStart?: string;
  idEnd?: string;
  format?: string;
  customClassStart?: string;
  customClassEnd?: string;
  containerClass?: string;
  inputTextAlign?: string;
  monthTitleEnable?: boolean;
  cancelOnBackgroundClick?: boolean;
  preSelectedStart?: string;
  renderPointer?: boolean;
  pointer?: React.ReactNode;
  backdrop?: string;
  [key: string]: any;
}

export interface DateRangePickerProps {
  onChangeStart?: (unix: number, formatted: string) => void;
  onChangeEnd?: (unix: number, formatted: string) => void;
  placeholderEnd?: string;
  placeholderStart?: string;
  idStart?: string;
  idEnd?: string;
  format?: string;
  customClassEnd?: string;
  customClassStart?: string;
  containerClass?: string;
  inputTextAlign?: string;
  monthTitleEnable?: boolean;
  cancelOnBackgroundClick?: boolean;
  preSelectedStart?: string;
  renderPointer?: boolean;
  pointer?: React.ReactNode;
  backdrop?: string;
  [key: string]: any;
}

export interface DateTimePickerProps {
  id?: string;
  placeholder?: string;
  disableFromUnix?: number;
  customClass?: string;
  containerClass?: string;
  inputTextAlign?: string;
  monthTitleEnable?: boolean;
  inputComponent?: React.FC<{}>;
  cancelOnBackgroundClick?: boolean;
  preSelected?: string;
  format?: string;
  backdrop?: string;
  controlValue?: boolean;
  onChange?: (unix: number, formatted: string) => void;
  currentDate?: string
}