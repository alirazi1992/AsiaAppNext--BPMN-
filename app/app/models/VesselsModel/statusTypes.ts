
export interface Response<T> { status: boolean, message: string, data: T };

export interface GetCertificatesResponse {
    certificateCertTypeName: string,
    certStates: CertStateModel[]

}

export interface CertStateModel {
    code: string,
    name: string,
    term: string,
    issueDate: string,
    expireDate: string,
    extended: string,
    status: string,
    statusIcon: string,
    certTypeCategoryId: number,
    certTypeCategory: {
        id: number,
        name: string
    }
}


export interface GetSurveyResponse {
    categoryName: string,
    surveyStates: SurveyStatesModel[]
}

export interface SurveyStatesModel {
    code: string,
    surveyName: string,
    lastSurvey: string,
    dueDate: string,
    winStart: string,
    winEnd: string,
    postPoned: string,
    status: string,
    statusIcon: string,
    isClassSurvey: boolean,
    surveyTypeId: number
}

export interface GetMemorandaResponse {
    asiaCode: string,
    issueDate: string,
    issuedAt: string,
    memoranda: string
}

export interface GetCMSResponse {
    item: number,
    itemDescription: string,
    lastDate: string,
    doneBy: number,
    dueDate: string,
    extendedUntil: string,
    status: string
}

export interface GetLiftingApplianceResponse {
    identification: string,
    type: string,
    swl: string,
    use: string,
    convention: string
}

export interface GetBallastTanksResponse {
    identification: string,
    initialFrame: string,
    finalFrame: string,
    position: string,
    lastSurvey: string,
    protection: string,
    coatingCondition: string,
    annualExamination: string
}

export interface GetCargoHoldsResponse {
    identification: string,
    initialFrame: string,
    finalFrame: string,
    position: string,
    lastSurvey: string
}

export interface GetAutomatedInstallationResponse {
    automatedInstallation: string
}

export interface GetRegulationResponse {
    id: number,
    applyDate: string,
    title: string,
    intoForce: string,
    convention: string,
    reference: string,
    nonHTMLSummary: string,
    origin: string,
    isPublished: boolean,
    nonHTMLContent: string
}


export interface GeneralInfoModel {
    id: number,
    asiaCode: string,
    numberOfRegistry: string,
    temporaryNumberOfRegistry: string,
    portOfRegistry: string,
    vesselName: string,
    imO_No: string,
    vesselTypeMajor: string,
    vesselTypeMinor: string,
    vesselType: string,
    callSign: string,
    mmsI_No: string,
    previuse_Name: string,
    minSafeManning: string,
    fullLoadDraught: string,
    length: string,
    breadth: string,
    depth: string,
    lengthBetweenPerpendiculars: string,
    registeredLength: string,
    lightWeightDraught: string,
    gt: string,
    nt: string,
    deadWeight: string,
    ngt: string,
    nnt: string,
    allowedNavigationArea: string,
    radioCertifiedToOperateArea: string,
    hullMaterial: string,
    hull_No: string,
    watertightCompartmentCount: string,
    typeOfDeck: string,
    bodyType: string,
    dateOfBuildingContract: string,
    dateOfKeelLaying: string,
    dateOfDelivery: string,
    dateOfConversionContract: string,
    dateOfConversionCommencment: string,
    dateOfConversionCompletion: string,
    unforeseenDelayInDelivery: string,
    placeOfBuild: string,
    shipyard: string,
    propellingType: string,
    propeller: string,
    speed: string,
    ownerName: string,
    ownerCompanyNumber: string,
    ownerIMO_No: string,
    ownerAddress: string,
    managerShow: boolean,
    managerName: string,
    managerCompanyNumber: string,
    managerIMO_No: string,
    managerAddress: string,
    operatorShow: boolean,
    operatorName: string,
    operatorCompanyNumber: string,
    operatorAddress: string,
    phone1: string,
    phone2: string,
    email1: string,
    email2: string
}


export interface MainEngineModel {
    manufacturer: string,
    type: string,
    ratedPower: string,
    ratedSpeed: string,
    serialNo: string,
    location: string,
    use: string,
    noxCode2008: string
}

export interface mainGeneratorModel {
    manufacturer: string,
    type: string,
    ratedPower: string,
    ratedSpeed: string,
    serialNo: string,
    location: string,
    use: string,
    noxCode2008: string
}

export interface OwnerInfoModel {
    regOwnerName: string,
    regOwnerCompanyNumber: string,
    regOwnerIMONumber: string,
    regOwnerAddress: string,
    regISMShow: boolean,
    regISMName: string,
    regISMCompanyNumber: string,
    regISMIMONumber: string,
    regISMAddress: string,
    regOperatorShow: boolean,
    regOperatorName: string,
    regOperatorCompanyNumber: string,
    regOperatorAddress: string,
    phone1: string,
    phone2: string,
    email1: string,
    email2: string
}

export interface GetVesselsInfoResponse {
    generalInfo: GeneralInfoModel,
    mainEngine: MainEngineModel,
    mainGenerator: mainGeneratorModel[],
    ownerInfo: OwnerInfoModel,
    showPDFLink: boolean
}

export interface GetVesselsListItems {
    totalCount: number,
    count: number,
    pageNo: number,
    vessels: VesselsModel[]
}

export interface VesselsModel {
    asiaCode: string,
    callSign: string,
    gt: string,
    ngt: string,
    imO_No: string,
    numberOfRegistry: string,
    portOfRegistry: string,
    vesselName: string,
    vesselType: string
}
