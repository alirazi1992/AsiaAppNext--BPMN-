
export interface Response<T> { status: boolean; message: string; data: T }

export interface GroupManagementModel {
    id: number,
    name: string,
    receiverGroupMembers: GroupMember[],
}

export interface GroupMember extends SelectInterfaceOptions {
    id: number,
    actorId: number,
    level: number,
    actorName: string,
    desc: string,
    isHidden: boolean,
    receiveTypeId: number

}

export interface SelectInterfaceOptions {
    value: number, label: string
}

export interface ReceiversModel {
    title: string,
    actorId: number,
    level: number
}

export interface SelectReceiversModel {
    title: string,
    actorId: number,
    level: number,
    label: string
}


export interface AddMemberModel {
    actorId: number,
    level: number,
    title: string,
    groupId: number,
    desc: string,
    isHidden: boolean,
    receiveTypeId: number
}

export interface MemberInformaionModel {
    receiver: SelectReceiversModel | null,
    desc: string,
    receiveTypeId: number,
    isHidden: boolean,
}
export interface LoadingModel {
    loadingGroup: boolean,
    loadingMember: boolean,
    loadingResponse: boolean,
    loadingReceiveType: boolean,
    loadingGetReceivers: boolean
}


