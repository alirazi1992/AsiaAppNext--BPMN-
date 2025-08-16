export type BpmsFormItems = {
  Id: number;

  /**
   * نام
   */
  Title: string;

  /**
   * مدل کدی که در آخر  بعد از تایید دریافت میگردد
   */
  NumberingFmt: string;

  /**
   * سالانه صفر شود یا خیر
   */
  Yearly: boolean;

  /**
   * از چه عددی شروع شود
   */
  IndexStart: number;

  /**
   * قابل ثبت صادره داشته باشن
   */
  Submitable: boolean;

  /**
   * مازول api/getModuleList
   */
  ModuleId: number;

  /**
   *عنوان فارسی فرم
   */
  FaTitle: string;

  IsImportType: boolean;
};
