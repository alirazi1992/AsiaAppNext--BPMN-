export interface SearchFilterModel {
    SearchItem: SearchItemsModel
}

export interface SearchItemsModel {
    Indicator?: string,
    SubmitIndicator?: string,
    ImportSubmitNo?: string,
    CreateDateAfter: any | null,
    CreateDateBefore: any | null,
    SignDateAfter: any | null,
    SignDateBefore: any | null,
    SubmitDateAfter: any | null,
    SubmitDateBefore: any | null,
    ImportSubmitDateAfter: any | null,
    ImportSubmitDateBefore: any | null,
    Subject?: string,
    DocTypeId: number,
    Passage?: string,
    Keyword?: string,
    MainReceiver?: string,
    CopyReceiver?: string,
    Sender?: string,
    IsRevoked?: boolean
}

export interface ImportSubmitDateModel {
    ImportSubmitDate?: string
    IsBefore?: boolean
}

export interface CreateDateModel {
    CreateDate?: string
    IsBefore?: boolean
}

export interface SignDateModel {
    LockDate?: string
    IsBefore?: boolean
}

export interface SubmitDateModel {
    SubmitDate?: string
    IsBefore?: boolean
}

export interface SearchDocsResultModel {
    createDate: string
    docHeapId: number
    docTypeId: number
    docTypeTitle: string
    documentDate: string
    indicator: string
    subject: string
    submitDate: string
    submitIndicator?: string
    totalCount: number,
    archiveDirectory: string | null,
    senderReceiver: string | null,
    mainReceiver: string[] | null,
    copyReceiver: string[] | null,
    sender: string | null,
    workOrderArchiveDirectory: string | null,
    jobArchiveDirectory: string | null
}