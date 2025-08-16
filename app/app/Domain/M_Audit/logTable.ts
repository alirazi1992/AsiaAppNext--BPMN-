import { SelectOptionModel } from "../shared"

export interface GetActorsModel extends SelectOptionModel<number> {
    title: string,
    actorId: number,
    level: number
}
export interface GetActionsModel extends SelectOptionModel<number> {
    id: number,
    name: string,
    codeSourceId: number
}
export interface GetModulesModel extends SelectOptionModel<number> {
    id: number,
    title: string
}
export interface GetSourceListModel extends SelectOptionModel<number> {
    id: number,
    title: string,
    moduleId: number
}

export interface FilterItemsModdel {
    Audit: AuditItemsModel
}

export interface AuditItemsModel {
    actorId: number,
    moduleId: number,
    sourceId: number,
    actionId: number,
    startDate?: string,
    endDate?: string,
    searchText: string,
}

export interface InitializeState {
    actors: GetActorsModel[] | undefined,
    modules: GetModulesModel[] | undefined,
    actionList: GetActionsModel[] | undefined,
    sourceList: GetSourceListModel[] | undefined,
}

export interface GetLogsResultModel {
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