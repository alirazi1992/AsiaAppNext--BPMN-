import { SelectOptionTypes } from "./sharedModels";

export interface FilterResumeModel {
    FilterResume?: {
        endDate?: string | null;
        startDate?: string | null;
        firstName?: string | null;
        faFirstName?: string | null;
        lastName?: string | null;
        faLastName?: string | null;
        jabVacancyId?: number[] | null;
        jobBranchId?: number[] | null;
        nationalCode?: string | null
    } | null
}

export interface JobBranchesModel extends SelectOptionTypes<number> {
    id: number,
    title: string,
    faTitle: string
}
export interface GetJobVacanciesModel extends SelectOptionTypes<number> {
    id: number,
    title: string,
}

export interface ResumeListModel {
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
    resumeItems: ResumeListModel[]
}

export interface GetResumeFileModel {
    docTitle: string,
    file: string
}
