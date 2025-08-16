import { CategoriesOptionProps, CustomerOptionProps, JobOptionProps, WorkOrderOptionProps } from "./ViewDocumentFormModels";

export interface Response<T> { status: boolean; message: string; data: T }

export interface UnArchiveSraechDocs {
    count: string,
    docList: UnArchiveDocList[],
    page: string,
    totalCount: string,
}

export interface UnArchiveDocList {
    docHeapId: number,
    docTypeId: number,
    indicator: string,
    subject: string,
    totalCount: string,
}

export interface UnArchiveDocumentModel {
    docTypeId: number,
    docHeapId: number,
    subject: string,
    docIndicatorId: number,
}

export interface UnArchivePutDoc {
    actorId: number,
    docHeapId: number,
    archiveCategoryId: number,
    isFile: true,
    name: string,
    title: string,
    workOrderId: number,
    jobId: number,
    docTypeId: number
}

export interface DocumentType {
    index: number,
    title: string,
    isFile: boolean
}

export interface addDocumentDataModel {
    searchBased: string,
    jobs: JobOptionProps[],
    orgs?: CustomerOptionProps,
    workOrder: WorkOrderOptionProps[],
    categories: CategoriesOptionProps[],
    workOrderId?: number,
    orgId?: number,
    jobId?: number,
    docType: boolean
}

export interface UnArchivePutFile {
    file: string,
    type: string,
    archiveCategoryId: number,
    isFile: true,
    name: string,
    title: string,
    workOrderId: number,
    jobId: number
}

export interface AcceptedFileModel {
    path: string,
    lastModified: string,
    lastModifiedDate: string,
    name: string,
    size: number,
    type: string,
    webkitRelativePath: string
    base64file: string,
}

export interface LoadingModel {
    loadingTable: boolean,
}
