
export interface Response<T> { status: boolean; message: string; data: T }

export interface SelectOptionModel {
    label: string,
    value: number
}

export interface SelectOptionTypes<T> {
    label: string,
    value: T
}