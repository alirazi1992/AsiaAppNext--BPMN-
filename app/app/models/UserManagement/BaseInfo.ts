

export interface GetBaseTypes {
    id: number,
    type: string,
    title: string
}

export interface GetBaseInfoValue {
    id: number,
    value: string
}

export interface AddInfoModel {
    AddInfo: {
        titleInfo: string,
        typeInfo: string,
    }
}
export interface AddValueModel {
    AddValue: {
        value: string,
    }
}