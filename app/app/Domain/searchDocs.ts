
export interface GetSerachDocsModel {
    count: string,
    docList: DocListModel[],
    page: string,
    totalCount: string,
}

export interface DocListModel {
    docHeapId: number,
    docTypeId: number,
    indicator: string,
    subject: string,
    totalCount: string,
}

export interface DocsListProps {
    data: DocListModel[]
}

export interface InitializeStateModel {
    searchKey: string,
    totalCount: number,
    isNext: boolean,
    docs: DocListModel[]
}