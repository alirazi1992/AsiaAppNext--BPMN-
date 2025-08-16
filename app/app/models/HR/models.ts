import { SelectOptionModel } from './sharedModels'

export interface PersonalInfoStateModel {
    firstName?: string,
    faFirstName?: string,
    lastName: string,
    faLastName: string,
    userName: string,
    title: string,
    faTitle: string,
    isMarried?: boolean,
    isConfirmed?: boolean,
    isTechnicalExp?: boolean,
    lockoutEnabled?: boolean,
    inssuranceNo?: string,
    isActive?: boolean,
    nationalCode?: string,
    fatherName?: string,
    genderId?: number,
    twoFactorEnabled?: boolean,
    militaryServiceId?: number | null,
    birthDate?: string,
    birthCertificateId?: string,
    birthCertificateIssueanceCity?: string,
    childCount?: number,
    lastEducationDegree?: number,
    fieldOfStudy?: string,
    employmentDate?: string,
    insuranceNumber?: string,
    personnelCode: number,
    accessFailedCount?: number
    isRetired?: boolean,
    lockoutEnd?: string,
}
export interface AddUserInfoStateModel {
    firstName?: string,
    lockoutEnd?: string,
    faFirstName?: string,
    lastName: string,
    faLastName: string,
    password: string,
    insuranceNumber?: string,
    confirmPassword: string,
    userName: string,
    title: string,
    faTitle: string,
    isMarried?: boolean,
    isConfirmed?: boolean,
    twoFactorEnabled?: boolean,
    isTechnicalExp?: boolean,
    lockoutEnabled?: boolean,
    IsActive?: boolean,
    nationalCode?: string,
    fatherName?: string,
    genderId?: number,
    militaryServiceId?: number | null,
    birthDate?: string,
    birthCertificateId?: string,
    birthCertificateIssueCity?: string,
    childCount?: number,
    lastEducationDegree?: number,
    lastFieldOfStudy?: string,
    employeementDate?: string,
    personnelId: number,
    accessFailedCount?: number

}

export interface EmailModel {
    address: string,
    isDefault?: boolean,

}
export interface UpdateEmailModel {
    address: string,
    isDefault?: boolean,
    id: number

}

export interface GetUserEmailModel extends EmailModel {
    id: number,
}


export interface InformationModel {
    UserInfo: PersonalInfoStateModel,
}

export interface PesonalPhonesModel {
    Phone: PhoneType
}
export interface UpdatePesonalPhonesModel {
    UpdatePhone: UpdatePhoneType
}

export interface LocationAddress {
    countries: CountryModels[],
    provinces: ProvinceModel[],
    cities: CitiesModel[],
    addressType: EducationDegreeModel[]
}

export interface GetUserPhonesModel {
    number: string,
    isDefault: boolean,
    isFax: boolean,
    isMobile: boolean,
    id: number
}

export interface PesonalEmailsModel {
    Email: EmailModel,
}
export interface UpdatePesonalEmailsModel {
    UpdateEmail: UpdateEmailModel,
}


export interface PesonalAddressesModel {
    Address: AddressModel
}
export interface UpdatePesonalAddressesModel {
    UpdateAddress: UpdateAddressModel
}


export interface AddUserInformationModel {
    UserInfo: AddUserInfoStateModel,
}

export interface FileAttachments {
    attachmentType: number | undefined,
    id?: number,
    name?: string,
    fileType?: string,
    isDeleted?: boolean,
    title?: string,
    attachmentThumbnail: string
    file?: string,
}

export interface InformationType {
    Base: FirstModel
}

export interface DataModel {
    id: number,
    title: string,
    faTitle: string
}
export interface FileAttachmentTypes extends SelectOptionModel {
    id: number,
    title: string,
    faTitle: string
}

export interface GetAttachmentTypes extends SelectOptionModel {
    id: number,
    title: string,
    faTitle: string,
    isExpirable: boolean,
    defaultExpireByDay: number
}

export interface EducationDegreeModel extends SelectOptionModel {
    id: number,
    name: string,
    faName: string
}

export interface LocationModel extends SelectOptionModel {
    id: number,
    title: string,
    faTitle: string,
    selected?: string
}
export interface CityModel extends SelectOptionModel {
    id: number,
    faName: string,
    enName: string
}
export interface CountryModels extends SelectOptionModel {
    id: number,
    faName: string,
    enName: string
}
export interface ProvinceModel extends SelectOptionModel {
    id: number,
    faName: string,
    enName: string,
    countryId: number
}
export interface CitiesModel extends SelectOptionModel {
    id: number,
    faName: string,
    enName: string,
    provinceId: number
}

export interface EducationModel {
    fieldOfStudy: string,
    degree: number,
    university: string,
    scoreAverage: string,
    finishYear: number,
    attachmentFile?: string,
    attachmentType?: string,
    attachmentName?: string,
    attachmentId?: number,
}
export interface UpdateEducationModel {
    fieldOfStudy: string,
    degree: number,
    university: string,
    scoreAverage: string,
    finishYear: number,
    attachmentId?: number,
    id: number,
}

export interface LanguageModel {
    languages: EducationDegreeModel[],
    languageLevel: EducationDegreeModel[]
}

export interface foreignLanguages {
    languageId: number,
    writeLevel: number,
    readLevel: number,
    speakLevel: number,
}
export interface UpdateforeignLanguages {
    languageId: number,
    writeLevel: number,
    readLevel: number,
    speakLevel: number,
    id: number
}

export interface SoftwaresLearnt {
    softwareName: string,
    dominantLevel: number,
    attachmentFile?: string,
    attachmentType?: string,
    attachmentName?: string,
    attachmentId?: number
}
export interface UpdateSoftwaresLearnt {
    softwareName: string,
    dominantLevel: number,
    attachmentId?: number,
    id: number
}

export interface JobExperiencesModel {
    employerName: string,
    startDate: string,
    endDate?: string | null,
    role: string,
    activityDesc: string
    attachmentFile?: string,
    attachmentName?: string,
    attachmentType?: string,
    attachmentId?: number
}
export interface UpdateJobExperiencesModel {
    employerName: string,
    startDate: string,
    endDate?: string | null,
    role: string,
    activityDesc: string
    attachmentId?: number,
    id: number
}
export interface BankInfoModel {
    bankId: number,
    accountNo: string,
    shebaNo: string,
    debitCardNo: string,
    isDefault?: boolean,

}
export interface UpdateBankInfoModel {
    bankId: number,
    accountNo: string,
    shebaNo: string,
    debitCardNo: string,
    isDefault?: boolean,
    id: number,

}

export interface IrrelevantJobExperiences {
    employerName: string,
    duration: number,
    activityDesc: string
}

export interface Questions {
    introducerName?: string,
    introducerPhoneNo?: string,
    isReadyToTransfer?: boolean,
    missionCapablity?: boolean,
    missionType?: number,
    fultTimeSalaryRequest?: string,
    hourlySalaryRequest?: string,
    cvFile: any,
    docName?: string,
    coverLetter?: string
}

export interface CooprationType {
    Coopration: Questions
}

export interface AddressModel {
    address: string,
    countryId: number,
    provinceId: number,
    cityId: number,
    addressTypeId: number,
    postalCode?: string,
}
export interface UpdateAddressModel {
    address: string,
    countryId: number,
    provinceId: number,
    cityId: number,
    id: number,
    addressTypeId: number,
    postalCode?: string,
}

export interface GetUserAddressModel extends AddressModel {
    id: number
}

export interface PhoneType {
    phoneNo: string,
    isDefault?: boolean,
    isFax?: boolean,
    isMobile?: boolean,
}
export interface UpdatePhoneType {
    phoneNo: string,
    isDefault?: boolean,
    isFax?: boolean,
    isMobile?: boolean,
    id: number
}

export interface DateInputs {
    CreationDate: string
    DateSign: string
    IssuedDate: string
    ChangeDate: string
}

export interface ModelJobVacancyId {
    jobVacancyId: number
}
export interface ModelJobBranchId {
    jobBranchId: number
}

export interface FirstModel {
    jobVacancyId: ModelJobVacancyId[],
    jobBranchId: ModelJobBranchId[]
}

export interface JobExprienceModel {
    RelatedJobs: JobExperiencesModel,
}
export interface UpdateJobExprienceModel {
    UpdateRelatedJobs: UpdateJobExperiencesModel,
}
export interface PriodicalCheckUpsModel {
    PriodicalCheckUps: CheckUpModel,
}
export interface UpdatePriodicalCheckUpsModel {
    UpdatePriodicalCheckUps: UpdateCheckUpModel,
}

export interface BanksAccountModel {
    Bank: BankInfoModel,
}
export interface AddSignatureFile {
    attachmentFile: string;
    attachmentType: string;
    attachmentName: string;
}

export interface UpdateBanksAccountModel {
    UpdateBank: UpdateBankInfoModel,
}

export interface SoftwareType {
    Software: SoftwaresLearnt
}
export interface UpdateSoftwareType {
    UpdateSoftware: UpdateSoftwaresLearnt
}

export interface EducationType {
    EducationState: EducationModel
}
export interface UpdateEducationType {
    UpdateEducationState: UpdateEducationModel
}

export interface PersonnelFileModels {
    fileType: number,
    attachmentFile: string,
    attachmentType: string,
    attachmentName: string,
    isMortal?: boolean,
    ExpireDate?: string,
}
export interface UpdatePersonnelFileModels {
    fileType: number,
    isMortal?: boolean,
    ExpireDate?: string,
    id: number
}

export interface UpdatePersonnelFiles {
    fileType: number,
    isMortal?: boolean,
    ExpireDate?: string,
}


export interface CheckUpModel {
    // fileType?: string,
    attachmentFile: string,
    attachmentType: string,
    attachmentName: string,
    checkUpDate: string,
    attachmentId?: number,
}
export interface UpdateCheckUpModel {
    checkUpDate: string,
    attachmentId?: number,
    id: number
}

export interface PersonelFileType {
    PersonnelFiles: PersonnelFileModels,
}
export interface UpdatePersonelFileType {
    UpdatePersonnelFiles: UpdatePersonnelFileModels,
}

export interface CertificateType {
    Course: CourseModel
}
export interface UpdateCertificateType {
    UpdateCourse: UpdateCourseModel
}
export interface ForumsType {
    Forums: ForumsModel
}
export interface UpdateForumsType {
    UpdateForums: UpdateForumsModel
}
export interface ForumsModel {
    title: string,
    attachmentName?: string,
    hasCertificate?: boolean,
    isMortal?: boolean,
    ExpirationDate?: string,
    attachmentFile?: string,
    attachmentType?: string,
    attachmentId?: number
}
export interface UpdateForumsModel {
    title: string,
    hasCertificate?: boolean,
    isMortal?: boolean,
    ExpirationDate?: string,
    attachmentId?: number,
    id: number
}


export interface LanguageType {
    LanguageState: foreignLanguages
}
export interface UpdateLanguageType {
    UpdateLanguageState: UpdateforeignLanguages
}

export interface PersonalInfoAddressType {
    Address: AddressModel[]

}

export interface VisionStatusTypes extends SelectOptionModel {
    id: number, title: string
}
export interface PhysicalConditionsType {
    height: number,
    weight: number,
    haveDiseases?: boolean,
    diseasesDesc?: string,
    visionStatusTypeId: number,
    visionStatusDesc?: string
}

export interface PhysicalConditionsModel {
    PhysicalCondition: PhysicalConditionsType
}

export interface AcceptedFileModel {
    file: {
        path: string,
        lastModified: string,
        lastModifiedDate: string,
        name: string,
        size: number,
        type: string,
        webkitRelativePath: string
        base64file: string
    },
    preview: any
}

export interface GetFileModel {
    id: number,
    name: string,
    title: string,
    fileType: string,
    file: string
}
export interface GetCertificateModels {
    id: number,
    name: string,
    duration: number,
    finishYear: number,
    institute: string,
    hasCertificate: boolean,
    certificateAttachmentId: number| null,
    isExpirable: boolean,
    expireDate: string | null
}

export interface CourseModel {
    title: string,
    duration: number,
    institute: string,
    finishDate: number,
    hasCertificate?: boolean,
    isMortal?: boolean,
    ExpirationDate?: string,
    attachmentFile?: string,
    attachmentType?: string,
    attachmentName?: string,
    certificateAtachmentId?: number | null
}
export interface UpdateCourseModel {
    title: string,
    duration: number,
    institute: string,
    finishDate: number,
    isMortal?: boolean,
    ExpirationDate?: string,
    certificateAtachmentId?: number,
    hasCertificate?: boolean,
    id: number
}

export interface GetUserLanguages {
    id: number,
    languageId: number,
    readDominanceLevelId: number,
    writeDominanceLevelId: number,
    speakDominanceLevelId: number
}


export interface GetBankAccountModels {
    id: number,
    accountNo: string,
    shebaNo: string,
    debitCardNo: string,
    bankId: number,
    isDefault: boolean
}

export interface GetSoftwareModels {
    id: number,
    name: string,
    dominanceLevelId: number,
    attachmentId: number
}

export interface GetUserAssociations {
    id: number,
    name: string,
    hasDocument: boolean,
    isExpirable: boolean,
    expireDate: string,
    attachmentId: number
}
export interface GetUserEducations {
    id: number,
    educationDegree: number,
    name: string,
    scoreAverage: string,
    finishYear: number,
    attachmentId?: number,
    institute: string
}

export interface GetJobExperienceModels {
    id: number,
    employerName: string,
    startDate: string,
    endDate: string,
    role: string,
    activityDesc: string,
    attachmentId: number
}

export interface GetCheckUpDataModel {
    id: number,
    checkUpDate: string,
    attachmentId: number

}

export interface GetCoverLetterModel {
    id: number,
    content: string,
    nonHtmlContent: string
}

export interface CoverLetterModel {
    Content?: string,
    NonHTMLContent?: string,
} 