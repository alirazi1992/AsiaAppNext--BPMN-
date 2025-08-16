export interface GetForwardsListModel {
    id: number,
    createDate: string,
    forwardAttachments: ForwardAttachmentsModel[],
    desc: string,
    forwardTarget: ForwardTargetModel[]
    fromActorId: number,
    senderFaName: string,
    senderName: string,
    senderFaRoleName: string,
    senderRoleName: string
}

export interface ForwardAttachmentsModel {
    id: number,
    attachmentId: number,
    attachmentTitle: string,
    attachmentDesc: string
}
export interface ForwardTargetModel {
    targetId: number,
    receiverActorId: number,
    receiverName: string,
    receiverFaName: string,
    receiverRoleName: string,
    receiverFaRoleName: string,
    receiveType: string
}

export interface InitializeForwardsStateModel {
    forwardsList: GetForwardsListModel[]
}

export interface RemoveForwardsResultModel {
    sourceId: number
}

export interface ForwardsListProps {
    data: GetForwardsListModel[],
    removeForwardsId: (data: number) => void,
}

export interface GetAttachmentPdfModel {
    file: string
    fileName: string,
    fileType: string
}
