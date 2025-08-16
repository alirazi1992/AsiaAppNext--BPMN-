export interface AddCategoryModel {
    AddCategory: CategoryItemsModel
}

export interface CategoryItemsModel {
    faName: string,
    name: string,
    id?: number
}

export interface GetCourseCategoriesProps {
    searchKey: string
}

export interface GetCourseCategoriesModel {
    pageSize: number,
    pageNo: number,
    totalCount: number,
    categoriesList: CourseCategoriesModels[]
}

export interface CourseCategoriesModels {
    id: number,
    creator: string,
    name: string,
    faName: string,
    creationDate: string
}

export interface InitializeStateCategoryModel {
    totalCount: number,
    searchKey: string,
    list: CourseCategoriesModels[] | undefined,
    selectedCategory: CourseCategoriesModels | undefined,
}

export interface CategoriesTableProps {
    categories: CourseCategoriesModels[] | undefined,
    removeCategoryId: (data: number) => void,
    selectedCategory: (data: CourseCategoriesModels) => void
}
export interface UpdateCategoryProps {
    category: CourseCategoriesModels | undefined,
    onSubmit: (data: CategoryItemsModel) => void,
}

export interface SubmitAddCategoryProps {
    onSubmit: (data: CategoryItemsModel) => void
}
