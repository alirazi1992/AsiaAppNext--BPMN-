
export interface Response<T> { status: boolean; message: string; data: T }
export interface ResponseSelect<T> { Status: boolean, Message: string, Data: T }

export interface SelectOptionModel {
    value: number | null,
    label: string
}

export interface AllArchiveModel extends SelectOptionModel {
    id: number,
    name: string,
}

export interface ArchiveAutomationModel {
    id: number,
    archiveName: string,
    parentId: number | null
    subArchives: ArchiveAutomationModel[] | null,
    archiveDocs: ArchiveDocsModels[]
}

export interface UpdateArchiveResponseModel {
    id: number,
    name: string,
    parentId: any
}

export interface ArchiveDocsModels {
    id: number,
    docIndicatorId: string,
    docHeapId: number,
    docSubject: string,
    docTypeId: number
}

export interface GroupedOption {
    label: string,
    options: SelectOptionModel[]
}

export interface LoadingModel {
    loadingResponse: boolean,
    loadingSearch: boolean
}

