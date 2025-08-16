export interface ParaphListProps {
    data: GetParaphsListModel[],
    removeParaphId: (data: number) => void,
}

export interface AddParaphModel {
    AppParaph: ParaphItemModel
}

export interface ParaphItemModel {
    paraph: string
}

export interface AddParaphResultModel {
    docParaphId: number,
    date: string,
    writer: string,
    paraphType: number,
    persianDate: string,
    desc: string
}

export interface InitializeParaphStateModel {
    paraphsList: GetParaphsListModel[]
}

export interface GetParaphsListModel {
    id: number,
    desc: string,
    writer: string,
    contact: string,
    paraphDate: string,
    personalDesc: string,
    paraphType: number,
    forwardDesc: string
}