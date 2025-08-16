import { CategoriesProps } from "./ViewDocumentFormModels";

export interface Response<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface OptionProps<T> {
  readonly value: T;
  readonly label: string;
}

export interface ViewDocumentItemTable {
  docHeapId: number;
  jobId: number;
  workOrderId: number;
}

export interface ViewDocumentListTableModel {
  id: number;
  title: string;
  name: string;
  isFile: boolean;
  attacher: string;
  archiveCategoryId: string;
  createDate: string;
  type: string;
  docHeapId: number;
  workOrderId: number;
  jobId: number;
  attachmentTypeId: number;
  extraInfo: string | null;
}

export interface ViewDocumentDownloadFile {
  fileName: string;
  file: string;
  fileType: string;
}

export interface viewDocumentTableDataModel {
  activateTab: number;
  categories: CategoriesProps[];
  img: string;
  jobId: number | undefined;
  workOrderId: number | undefined;
  file: ViewDocumentDownloadFile;
}

export interface TransferDocument {
  Transfer: {
    itemId: number;
    archiveJobId: number;
    archiveWorkOrderId: number;
    transferJobId: number;
    transferWorkOrderId: number;
    categoryId?: number;
  };
}

export type TransferAllDocument = {
  archiveIds: number[];
  jobId: number;
  categoryId?: number;
  workOrderId?: number;
};

export interface EditArchiveDocumentForm extends ViewDocumentListTableModel {
  isJobArchive: boolean;
}
