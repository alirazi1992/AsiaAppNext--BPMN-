export interface Response<T> { status: boolean, message: string, data: T }

export interface NewRuleStateModel {
    title: string,
    inToForce: string,
    convention: string,
    reference: string,
    origin: string,
    isPublished: boolean,
}