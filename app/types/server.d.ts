type ServerResponse<T = unknown> = {
  data: T;
  /**
   * if has server error is false not true
   */
  status: boolean;
  /**
   * error message or success message
   */
  message: string;
};
