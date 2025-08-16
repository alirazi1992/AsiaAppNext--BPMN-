export interface Response<T> { status: boolean, message: string, data: T }

export interface GetRulesListModel {
    id: number,
    title: string,
    inToForce: string,
    convention: string,
    reference: string,
    summary: string,
    origin: string,
    isPublished: boolean
}
export interface AddRuleModel {
    AddRule: AddRuleItemsModel
}
export interface AddRuleItemsModel {
    title: string,
    inToForce: string,
    convention: string,
    reference: string,
    origin: string,
    isPublished?: boolean,
    summary: string,
    content: string,
    nonHtmlContent?: string,
    nonHtmlSummary?: string,
    ruleId?: number
}

export interface GetRuleModelResponse {
    id: number,
    title: string,
    inToForce: string,
    convention: string,
    reference: string,
    summary: string,
    origin: string,
    isPublished: boolean,
    content: string,
    nonHtmlContent: string,
    nonHtmlSummary: string
}

export interface GetRulesConditionsModel {
    id: number,
    ruleId: number,
    creationDate: string
}

export interface SelectModel {
    value: number,
    label: string

}

export interface GetVesselesModel extends SelectModel {
    id: number,
    nameEn: string
}
export interface GetNavigationAreas extends SelectModel {
    id: number,
    title: string
}
export interface GetCertifiedToOperate extends SelectModel {
    id: number,
    areaTitle: string
}
export interface AddConditionModel {
    id: any,
    vesselTypes: string[],
    navigationAreaCovered: string[],
    certifiedToOperateCovered: string[],
    gtMin: number,
    gtMax: number,
    deadWeightMin: number,
    deadWeightMax: number,
    regulationLengthMin: number,
    regulationLengthMax: number,
    lengthOverallMin: number,
    lengthOverallMax: number,
    passengerCapacityMin: number,
    passengerCapacityMax: number,
    crowCountMin: number,
    crowCountMax: number,
    keelLayingDate: string,
    keelLayingDateRange: boolean,
    dateOfBuild: string,
    dateOfBuildRange: boolean,
    dateOfDelivery: string,
    dateOfDeliveryRange: boolean,
    machineryOperationCovered: string[],
    certificatesCovered: string[]
}

export interface GetAppliedVesselsResponse {
    totalCount: number,
    page: number,
    count: number,
    appliedVessels: GetAppliedVessels[]
}

export interface GetAppliedVessels {
    id: number,
    vesselName: string,
    vesselAsiaCode: string,
    conditionId: number,
    applyDate: string,
    isDeleted: boolean,
    deleteDate: string | null,
    reapplyDate: string | null
}

export interface GetAddConditionResponse {
    conditionId: number,
    ruleId: number,
    creationDate: string
}

export interface ToggleApplyConditionResponse {
    deleteDate: string | null,
    id: number,
    reapplyDate: string | null
}