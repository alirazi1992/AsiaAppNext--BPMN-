export interface LoginModel {
    activeRole: string | null,
    actors: ActorsModel[],
    profilePicture: string | null,
    signInSuccessfull: boolean,
    claimsPrincipal: any,
    authenticaionProperties: any,
    isLockedOut: boolean,
    isUserFound: boolean
}

export interface ClaimsModel {
    key: string,
    value: string
}
export interface LoginData {
    User: UserModel
}
export interface UserModel {
    username: string, password: string
}

export interface ActorsModel extends SelectOptionModel<number> {
    readonly id: number,
    readonly roleId: string,
    readonly roleName: string,
    readonly userId: string,
    readonly userName: string,
    readonly isDefault: boolean,
    readonly claims: ClaimsModel[],
    readonly firstName: string,
    readonly lastName: string,
    readonly faFirstName: string,
    readonly faLastName: string,
    readonly faTitle: string,
    readonly title: string,
    readonly genderId: number,
    readonly departmentId: number,
    readonly departementName: string,
    readonly departementFaName: string,
    readonly departementTitle: string,
    readonly departementFaTitle: string,
    readonly parentDepartementId: number,
    readonly isSecretariate: boolean
}

export interface Response<T> {
    status: boolean,
    message: string,
    data: T
}
export interface Res<T> {
    Status: boolean,
    Message: string,
    Data: T
}

export interface LoadingModel {
    response: boolean,
    table: boolean,
    iframeLoading: boolean
}

export interface SelectOptionModel<T> {
    value: T,
    label: string
}

export interface SearchKeyProps {
    searchKey: (data: string) => void,
    className?: string
}

export interface SharedPaginationProps {
    count: number,
    className?: string,
    page?: number,
    handlePage: (data: number) => void
}

export interface SelectOptionProps {
    Model: any,

}

export interface ViewAttachments {
    type: string,
    base64: string
}

export interface DropzoneFileModel {
    file: File,
    preview: string
}
