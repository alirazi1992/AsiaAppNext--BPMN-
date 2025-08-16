
export interface Response<T> { status: boolean; message: string; data: T }

export interface CartableAutomationGetInbox {
    receiveTypeId: number,
    receiveTypeTitle: string,
    count: number
}

export interface CartableAutomationGetInboxItems {
    count: number,
    page: number,
    totalCount: number,
    docList: GetInboxListTableDocList[] | null
}
export interface CartableAutomationOutboxTableItems {
    count: number,
    page: number,
    totalCount: number,
    docList: GetOutboxListTable[],
}

export interface CartableAutomationListTable {
    docHeapId: number,
    docNumber: string,
    docTypeId: number,
    docTypeTitle: string,
    submitNumber: string,
    creationDate: string,
    subject: string,
    forwardParentId: number,
    attachments: AttachmentsModel[],
    mainReceiversRaw: CartableAutomationMainReceiversRaw,
    mainReceiversName: CartableAutomationMainReceiversName[],
    sendersRaw: any,
    sendersName: any,
    isImport: boolean,
}

export interface GetInboxListTableDocList extends CartableAutomationListTable {
    seenState: boolean,
    forwardSenderName: string,
    isArchived: string,
    forwardTargetId: number,
    archiveDirectoriesString: string[],
    jobArchiveDirectories: any[],
    workOrderArchiveDirectories: WorkOrderArchiveDirectories[]
}

export interface WorkOrderArchiveDirectories {
    organizationId: number,
    jobId: number,
    workOrderId: number,
    organizationName: string,
    jobName: string,
    workOrderName: string
}

export interface GetOutboxListTable extends CartableAutomationListTable {
    forwardSourceId: number,
    forwardReceiver: string[]
}

export interface CartableAutomationGetOutboxItems {
    enTitle: string,
    state: number,
    count: number,
    title: string
}

export interface AttachmentsModel {
    id: number,
    attachmentId: number,
    attachmentTitle: string,
    attachmentDesc: string,
    attachmentTypeId: number,
    fileType: string,
}

export interface CartableAutomationMainReceiversName {
    faName: string,
    name: string
}

export interface CartableAutomationMainReceiversRaw {
    id: number,
    docHeapId: number,
    docHeap: any,
    value: string,
    docField: CartableAutomationDocField
    docFieldId: number,
}

export interface CartableAutomationDocField {
    id: number,
    docTypeId: number,
    docType: any,
    name: string,
    faTitle: string,
    fieldType: string,
    defaultValue: any,
    hasRepository: boolean,
    repoQuery: string,
    readOnly: boolean,
    tableStructure: any,
    updatable: boolean,
    printable: boolean,
    fieldDetails: any,
    isActorField: boolean,
    isMandatory: boolean
}

export interface ViewAttachmentModel {
    file: string,
    fileName: string,
    fileType: string
}


export interface InitialStateModel {
    getInbox?: CartableAutomationGetInbox[],
    paginationCount: number,
    outBoxPaginationCount: number,
    docTypeId: number,
    checkedDocumentInbox: GetInboxListTableDocList[],
    checkedDocumentOutbox: GetOutboxListTable[],
    getOutbox: CartableAutomationGetOutboxItems[],
    getInboxList?: CartableAutomationGetInboxItems,
    getOutboxList?: CartableAutomationOutboxTableItems,
    attachment?: AttachmentsModel[],
    attachmentImg: string,
    file: ViewAttachmentModel | null
}

export interface OutboxItems {

    name: string,
    outboxItems: CartableAutomationGetInboxItems

}

export interface Select2OptionsModel {
    Title: string,
    Id: number,
    value: number,
    label: string
}

export interface LoadingModel {
    loadingResponse: boolean,
    loadingInboxList: boolean,
    loadingOutInboxList: boolean,
    loadingIframe: boolean,
    loadingInbox: boolean,
    loadingOutInbox: boolean
}

