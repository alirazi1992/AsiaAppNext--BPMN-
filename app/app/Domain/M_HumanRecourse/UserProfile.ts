export interface GetUserSignaturesResulltModel {
    title: string | null,
    fileType: string,
    id: number
}

export interface GetUserSignatureResultModel {
    title: string,
    fileType: string,
    file: string
}

export interface SaveUserCertificates {
    attachmentId: number | null
    id: number
}