export interface Response<T> { status: boolean, message: string, data: T }
export interface AddUserModel {
    username: string,
    password: string,
    consfirmPassword: string,
    gender: Select2Model,
    number: number,
    faName: string,
    faLastname: string,
    faTitle: string,
    name: string,
    lastname: string,
    title: string
}
export interface Select2Model {
    value: number,
    label: string
}

export interface AddContactsModel {
    address: string,
    addressList: AddressListModel[]
}

export interface AddressListModel {
    address: string
}

// baseInfoManagement
export interface BaseInfoDetailsModel {
    id: number,
    title: string
}

export interface BaseInfoTableModel {
    id: number,
    title: string,
    type: string
}

