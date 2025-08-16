/**
 * Checks if the given file type is one of the allowed image MIME types.
 *
 * @param {string | undefined} fileType - The MIME type of the file (e.g., "image/jpeg", "image/png").
 * @returns {boolean} True if the file type is an allowed image type, otherwise false.
 */
export function isAllowedImageType(fileType?: string): boolean {
  const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!fileType) return false;
  return allowedImageTypes.includes(fileType.toLowerCase());
}

/**
 * Creates a unique SWR cache key for fetching archive/manage/list data.
 *
 * This key is used to identify and cache the SWR request based on
 * provided job ID and work order ID.
 *
 * @param jobId - Optional job ID (defaults to 0 if undefined)
 * @param workOrderId - Optional work order ID (defaults to 0 if undefined)
 * @returns A string key to be used in SWR.
 */
export function createKeyForSwrRequest(jobId: number = 0, workOrderId: number = 0): string {
  return `archive/Manage/list?JobId=${jobId}&WorkOrderId=${workOrderId}`;
}
