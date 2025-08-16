export interface Response<T> { status: boolean; message: string; data: T }

export interface SearchDocsModel {
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
    copyReceiver: string | null,
    sender: string | null,
    workOrderArchiveDirectory: string | null,
    jobArchiveDirectory: string
}


export interface DatePickerPropsModel {
    label: string
}

export interface ImportSubmitDateModel {
    ImportSubmitDate: string
    IsBefore: boolean
}

export interface CreateDateModel {
    CreateDate: string
    IsBefore: boolean
}

export interface SignDateModel {
    LockDate: string
    IsBefore: boolean
}

export interface SubmitDateModel {
    SubmitDate: string
    IsBefore: boolean
}

export interface SearchInputs {
    Indicator: string,
    SubmitIndicator: string,
    ImportSubmitNo: string,
    CreateDateAfter: CreateDateModel | null,
    CreateDateBefore: CreateDateModel | null,
    SignDateAfter: SignDateModel | null,
    SignDateBefore: SignDateModel | null,
    SubmitDateAfter: SubmitDateModel | null,
    SubmitDateBefore: SubmitDateModel | null,
    ImportSubmitDateAfter: ImportSubmitDateModel | null,
    ImportSubmitDateBefore: ImportSubmitDateModel | null,
    Subject: string,
    DocTypeId: DocTypes | null,
    Passage: string,
    Keyword: string,
    MainReceiver: string,
    CopyReceiver: string,
    Sender: string,
    IsRevoked: boolean
}

export interface DocTypes{
    label: string
    value: number
}
