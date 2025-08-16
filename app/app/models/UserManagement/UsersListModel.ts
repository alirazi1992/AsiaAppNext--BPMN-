export interface Response<T> { status: boolean, message: string, data: T }

export interface UsersListItemsModel {
    id: string,
    username: string,
    isActive: boolean,
    lockoutEnabled: boolean,
    accessFailedCount: number
}

export interface GetUserListodel {
    usersList: UsersListItemsModel[],
    pageNo: number,
    pageSize: number,
    totalCount: number
}