
export interface GetStatusUsersModel {
    usersList: GetStatusUsers[],
    pageNo: number,
    pageSize: number,
    totalCount: number
}

export interface GetStatusUsers {
    id: string,
    username: string,
    lockoutEnabled: boolean,
    accessFailedCount: number,
    isActive: boolean
}


export interface StatusUserInformationModel {
    StatusUserInfo: StatusUserInformationType,
}
export interface UpdateStatusUserInformationModel {
    StatusUserInfo: UpdateStatusUserInformationType,
}
export interface StatusUserInformationType {
    userName: string,
    lockoutEnabled?: boolean,
    accessFailedCount: number,
    isActive?: boolean;
    twoFactorEnabled?: boolean,
    email: string,
    phoneNumber: string,
    lockoutEnd?: string,
    password: string,
    confirmPassword: string
}
export interface UpdateStatusUserInformationType {
    userName: string,
    lockoutEnabled?: boolean,
    accessFailedCount: number,
    isActive?: boolean;
    twoFactorEnabled?: boolean,
    email: string,
    phoneNumber: string,
    lockoutEnd?: string,
}

export interface GetInformationStatusUser {
    id: string,
    userName: string,
    email: string,
    phoneNumber: string,
    lockoutEnabled: boolean,
    accessFailedCount: number,
    isActive: boolean,
    lockoutEnd: string,
    twoFactorEnabled: boolean
}
