import { SelectOptionModel } from "../../shared";
import { UploadForwardAttachment } from "./Attachments";

export interface GetDocLayouts extends SelectOptionModel<number> {
    id: number,
    name: string,
    path: string,
    isMain: boolean
}

export interface GetPrintModel {
    layoutSize: number
}

export interface GetGroupsModel {
    id: number,
    name: string,
    receiverGroupMembers: ReceiverGroupMembersModel[],
}

export interface ReceiverGroupMembersModel extends SelectOptionModel<number> {
    id: number,
    actorId: number,
    level: number,
    actorName: string,
    IsGroup?: boolean,
    isChecked?: boolean,
    desc: string,
    isHidden: boolean,
    receiveTypeId: number
}

export interface TableItems {
    desc: string,
    isHidden: boolean,
    receiveTypeId: number,
    isChecked: boolean
}

export interface GetForwardRecieversModel extends TableItems, SelectOptionModel<number> {
    actorName: string,
    title: string,
    actorId: number,
    level: number,
    IsGroup?: boolean,
}


export interface AddForwardReceiver {
    Forward: {
        AddReceiver: {
            receiverActorId: number;
            title: string;
            receiveTypeId: number;
            personalDesc?: string;
            isHidden?: boolean;
        }[]
        ,
        forwardDesc?: string,
        files?: UploadForwardAttachment[]
    }
}

export interface ForwardResultModel {
    createDate: string,
    desc: string,
    forwardAttachments: any
    forwardTarget: {
        receiverActorId: number
        receiverFaName: string
        receiverFaRoleName: string
        receiverName: string
        receiverRoleName: string
    }[]
    fromActorId: number,
    id: number,
    senderFaName: string
    senderFaRoleName: string
    senderName: string
    senderRoleName: string
}

export interface GetForwardHierarchyModel {
    id: number,
    createDate: string,
    inCartable: boolean,
    forwardAttachments: ForwardAttachmentModel[]
    desc: string,
    forwardTarget: ForwardTargetModel[],
    fromActorId: number,
    forwardParentTargetId: number,
    senderName: string,
    senderFaName: string,
    senderRole: string,
    senderFaRole: string,
}

export interface ForwardStateModel {
    id: number,
    name: string,
    description: string
}

export interface ForwardTargetModel {
    id: number,
    personalDesc: string,
    forwardState: ForwardStateModel,
    firstSeenDate: string,
    lastSeenDate: string,
    childForwardSource: GetForwardHierarchyModel[],
    toActorId: number,
    forwardSourceId: number,
    receiverName: string,
    receiverFaName: string,
    receiverRole: string,
    receiverFaRole: string,
    receiveType: string
}

export interface ForwardAttachmentModel {
    id: number,
    attachmentType: string,
    attachmentTypeId: number,
    name: string,
    fileTitle: string,
    description: string,
    createDate: string,
    creator: string,
    fileType: string,
    lockDate: string
}

export interface GetArchiveHierarchyModel {
    Id: number,
    ArchiveName: string,
    ParentId: number,
    SubArchives: GetArchiveHierarchyModel[],
    IsArchived: boolean
}

export interface AddDocArchiveModel {
    docHeapId: number,
    docTypeId: number,
    subject: string,
    indicatorId: string,
    docArchiveId: number
}

export interface GetIssameImportExistModel {
    isExists: boolean,
    docsList: ExistDocListModel[]
}
export interface ExistDocListModel {
    createDate: string,
    submitDate: string,
    subject: string,
    docHeapId: number,
    sender: string
}
