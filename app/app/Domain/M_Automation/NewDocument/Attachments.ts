export interface UploadListOfAttachmentModel {
    createDate: string,
    creator: string,
    desc: string,
    fileType: string,
    id: number,
    persianDate: string
    title: string,
    fileName: string
}

export interface UploadFilesModel {
    file: string,
    type: string,
    title: string,
    desc?: string | undefined
}

export interface UploadForwardAttachment {
    attachment: string,
    fileTitle: string,
    type: string,
    description?: string | undefined
}

export interface UploadListAttachments {
    files: UploadFilesModel[]
}
export interface UploadForwardAttachmentsModel {
    files: UploadForwardAttachment[]
}

export interface UploadListofAttachmentsModel {
    createDate: string,
    creator: string,
    desc: string,
    fileType: string,
    id: number,
    persianDate: string
    title: string,
    fileName?: string | null
}

interface CheckItem {
    isActive?: boolean
}

export interface AttachmentTypeModel {
    id: number,
    title: string,
    description: string
}

export interface GetAttachmentsList extends CheckItem {
    id: number,
    attachmentType: AttachmentTypeModel,
    attachmentTypeId: number,
    name: string,
    fileTitle: string,
    description: string | null | undefined,
    createDate: string,
    creator: string,
    fileType: string,
    lockDate: string
}

export interface DownloadAttachment {
    file: string,
    fileName: string,
    fileType: string
}
