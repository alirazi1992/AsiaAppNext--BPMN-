export interface Response<T> { status: boolean; message: string; data: T }

export interface InitialStateAudit {
    selectedActor: GetActorsModel | null,
    actions: GetActionsModel[],
    modules: GetModulesModel[],
    sourceList: GetSourceListModel[],
    selectedAction: GetActionsModel | null,
    startDate: string,
    endDate: string,
    actors: GetActorsModel[],
    searchText: string,
    resultSearch: LogsModel[],
    paginationCount: number
}

export interface SelectOptionModel {
    label: string,
    value: number
}

export interface GetActorsModel extends SelectOptionModel {
    title: string,
    actorId: number,
    level: number
}
export interface GetActionsModel extends SelectOptionModel {
    id: number,
    name: string,
    codeSourceId: number
}
export interface GetModulesModel extends SelectOptionModel {
    id: number,
    title: string
}
export interface GetSourceListModel extends SelectOptionModel {
    id: number,
    title: string,
    moduleId: number
}

export interface GetResultAuditSearch {
    logs: LogsModel[],
    totalCount: number,
    page: number,
    count: number
}

export interface LogsModel {
    actionDate: string,
    actionDesc: string,
    actorName: string
}