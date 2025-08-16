import { SelectOptionModel } from "@/app/Domain/shared"
//InitialState-Course(MainContainer)
export interface InitializeStateCourseModel {
    searchKey: string,
    courses: EducationCoursesModel[] | undefined,
    totalCount: number,
    selectedCourse: EducationCoursesModel | undefined,
    categories: GetCategoriesListModel[] | undefined;
    templates: GetGeneralTemplateModel[] | undefined;
}

//InitialState-AddCourse

//GetGeneralTemplates
export interface GetGeneralTemplateModel extends SelectOptionModel<number> {
    id: number,
    name: string
}
//yup-Model(Courses)
export interface AddCourseModel {
    AddCourse: CourseItemsModel
}
export interface CourseItemsModel {
    name: string,
    faName: string,
    courseCode?: string,
    courseCategoryId: number,
    courseDesc?: string,
    faCourseDesc?: string,
    templateId: number,
    id?: number
}

//GetCategoriesList-SelectOption
export interface GetCategoriesListModel extends SelectOptionModel<number> {
    id: number,
    faName: string,
    name: string
}

export interface SubmitAddCourseProps {
    onSubmit: (data: CourseItemsModel) => void,
    categories: GetCategoriesListModel[] | undefined;
    templates: GetGeneralTemplateModel[] | undefined;
}
//GetEducationalCourses
export interface GetCoursesModel {
    pageSize: number,
    pageNo: number,
    totalCount: number,
    educationalCourses: EducationCoursesModel[]
}
export interface EducationCoursesModel {
    courseCode: string | null,
    id: number,
    creator: string,
    name: string,
    faName: string,
    categoryName: string,
    categoryFaName: string,
    creationDate: string,
    courseDesc: string,
    courseFaDesc: string,
    templateName: string,
    duration: number,
    durationUnit: string,
    faDurationUnit: string,
}
//CoursesTable-props
export interface CoursesTableProps {
    courses: EducationCoursesModel[] | undefined,
    removeCourseId: (data: number) => void,
    selectedCourse: (data: EducationCoursesModel) => void
}

export interface UpdateCourseProps {
    onSubmit: (data: CourseItemsModel) => void,
    course: EducationCoursesModel | undefined,
    categories: GetCategoriesListModel[] | undefined;
    templates: GetGeneralTemplateModel[] | undefined;
}