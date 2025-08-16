import { SelectOptionModel } from '@/app/Domain/shared';
import { GetCategoriesListModel } from './Courses';
import { GetProgramParticipantsModel, ProgramParticipantsModel } from './Participant';

export interface GetCoursesListModel extends SelectOptionModel<number> {
    id: number,
    faName: string,
    name: string
}

export interface GetEducationalCourseProgramModel {
    totalCount: number,
    pageNo: number,
    pageSize: number,
    coursePrograms: EducationalCourseProgramsModel[]
}

export interface EducationalCourseProgramsModel {
    finishDate: string | null,
    courseCode: string | null,
    creationDate: string | null,
    name: string,
    faName: string,
    categoryName: string,
    categoryFaName: string,
    couchName: string,
    faCouchName: string,
    institute: string,
    faInstitute: string,
    page2Desc: string,
    faPage2Desc: string,
    validPeriod: number
    id: number,
    creatorName: string,
    creatorFaName: string,
    duration: number,
    durationUnit: string,
    faDurationUnit: string
}

export interface ProgramsTableProps {
    programs: EducationalCourseProgramsModel[] | undefined,
    removeProgramId: (data: number) => void
    selectedProgram: (data: EducationalCourseProgramsModel, icon: string) => void,
}

export interface InitializeStateProgramsModel {
    courses: GetCategoriesListModel[] | undefined,
    totalCount: number,
    searchKey: SearchProgramModel,
    programs: EducationalCourseProgramsModel[] | undefined,
    selectedProgram: EducationalCourseProgramsModel | undefined,
    participants: ProgramParticipantsModel[] | undefined,
    totalCountParticipants: number
}

export interface UpdateProgramProps {
    onSubmit: (data: ProgramItemsModel) => void,
    program: EducationalCourseProgramsModel | undefined,
    courses: GetCategoriesListModel[] | undefined,
}

export interface AddProgramModel {
    AddProgram: ProgramItemsModel
}
export interface ProgramItemsModel {
    educationalCourseId: number,
    coachName?: string,
    coachFaName?: string,
    duration: number,
    durationUnit: string,
    faDurationUnit: string,
    instituteName: string,
    instituteFaName: string,
    finishDate: string,
    page2Desc?: string,
    page2FaDesc?: string,
    validPeriod: number,
    id?: number
}
export interface SearchProgramsModel {
    SearchProgram: SearchProgramModel
}

export interface SearchProgramModel {
    name?: string,
    coachName?: string,
    instituteName?: string,
    participant?: string,
    personnel?: string,
    finishDateBefore?: string,
    finishDateAfter?: string,
    creationDateBefore?: string,
    creationDateAfter?: string,
    categoryName?: string,
    courseCode?: string | null
}


export interface SubmitAddCourseProgramsProps {
    onSubmit: (data: ProgramItemsModel) => void,
    courses: GetCategoriesListModel[] | undefined;
}
export interface SearchCourseProgramsProps {
    onSubmit: (data: SearchProgramModel) => void,
}
