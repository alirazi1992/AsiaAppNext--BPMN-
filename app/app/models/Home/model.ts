export interface Response<T> { status: boolean, message: string, data: T }

export interface SelectOptionModel {
    label: string,
    value: number
}

export interface RoleModel {
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

export interface ActorsModel extends SelectOptionModel {
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
