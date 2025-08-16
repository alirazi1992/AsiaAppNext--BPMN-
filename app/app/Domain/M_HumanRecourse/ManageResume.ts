import { SelectOptionModel } from "../shared";

export interface GetJobBrancheslistModel extends SelectOptionModel<number> {
    id: number,
    title: string,
    faTitle: string
}

export interface GetJobVacanciesListModel extends SelectOptionModel<number> {
    id: number,
    title: string,
}

export interface ResumeItemsModel {
    createDate: string,
    faLastName: string,
    faName: string,
    isSelected: boolean,
    jobBranchTitleFa: string,
    jobVacancyTitleFa: string,
    lastName: string,
    name: string,
    id: number,
    nationalCode: string,
}

export interface GetSearchResumeModel {
    page: number,
    totalCount: number,
    count: number,
    resumeItems: ResumeItemsModel[]
}

export interface GetResumeFileModel {
    docTitle: string,
    file: string
}

export interface FilterResumeModel {
    isSelect?: boolean,
    faName?: string,
    name?: string,
    faLastname?: string,
    lastname?: string,
    startDate?: string,
    endDate?: string,
    nationalCode?: string,
    jobVacancyId?: number[],
    jobBranchId?: number[]
}


export interface StateModel {
    branches: GetJobBrancheslistModel[] | undefined,
    vacancies: GetJobVacanciesListModel[] | undefined,
    result: GetSearchResumeModel | null,
    items: FilterResumeModel
}