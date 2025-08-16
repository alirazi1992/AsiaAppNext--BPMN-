
export interface Response<T> { status: boolean; message: string; data: T }



export interface loadingModel {
    loadingTable: boolean,
    loadingResponse: boolean
}
