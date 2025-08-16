export interface GetUserModel {
    id: string,
    accessFailedCount: number,
    lockoutEnd: string,
    userName: string,
    twoFactorEnabled: boolean,
    lockoutEnabled: boolean,
    isActive: boolean,
    faFirstName: string,
    firstName: string,
    faLastName: string,
    lastName: string,
    title: string,
    faTitle: string,
    genderId: number,
    addresses: UserAddressModel[],
    eMails: EmailModel[],
    phoneNumbers: PhoneNumbersModel[],
    personalCode: number,
    isConfirmed: boolean,
    artemisAspNetUserAttachments: any,
    nationalCode: string,
    employmentDate: string,
    childCount: number,
    fatherName: string,
    inssuranceNo: string,
    birthCertificateId: string,
    birthCertificateIssueanceCity: string,
    militaryServiceId: number,
    lastEducationDegree: number,
    fieldOfStudy: string,
    educationInstitute?: any,
    isMarried: boolean,
    jobExperinces: any,
    birthDate: string,
    isTechnicalExp: boolean,
    isRetired: boolean
}

export interface UserAddressModel {
    id: number,
    physicalAddress: string,
    isDeleted: boolean,
    artemisAspNetUsers: any | null,
    artemisAspNetUsersId: string,
    artemisAspNetOrganization: any | null,
    artemisAspNetOrganizationId: any | null,
    countryId: number,
    provinceId: number,
    cityId: number,
    postalCode?: string,
    addressTypeId: number
}
export interface EmailModel {
    id: number,
    address: string,
    isDefault: boolean,
    isDeleted: boolean,
    artemisAspNetUsers: any | null,
    artemisAspNetUsersId: string,
    artemisAspNetOrganization: any | null,
    artemisAspNetOrganizationId: any | null,
    artemisAspNetDepartment: any | null,
    artemisAspNetDepartmentId: any | null
}
export interface PhoneNumbersModel {
    id: number,
    number: string,
    isMobile: boolean,
    isDefault: boolean,
    isDeleted: boolean,
    isFax: boolean,
    artemisAspNetUsers: any | null,
    artemisAspNetUsersId: string,
    artemisAspNetOrganization: any | null,
    artemisAspNetOrganizationId: any | null,
    artemisAspNetDepartment: any | null,
    artemisAspNetDepartmentId: any | null
}
export interface ArtemisAspNetUserAttachmentsModel {
    id: number,
    name: string,
    fileType: string,
    isDeleted: boolean,
    title: string,
    attachmentThumbnail: string
    file: null,
    attachmentType: number,
}

export interface UserProfileDocumentsModel {
    id: number,
    profileAttachmentTypeId: number,
    userId: string,
    expireDate: string | null
}

export interface SelectRoleType {
    SelectRole: SelectRoleModels
}
export interface SelectStatusRoleType {
    SelectRole: SelecStatusRoleModels
}

export interface SelectRoleModels {
    isDefault?: boolean,
    parentOrganizationId: number,
    isActive?: boolean,
    RoleName: string,
    roleId?: string,
}

export interface SelecStatusRoleModels {
    isDefault?: boolean,
    isActive?: boolean,
    RoleName: string,
}

export interface SelectUserClaimsType {
    SelectUserClaims: SelectUserClaimsModels
}
export interface SelectUserClaimsModels {
    claimType: number,
    claimValue: number
}
export interface SelectRoleClaimsType {
    SelectRoleClaims: SelectRoleClaimsModels
}
export interface SelectRoleClaimsModels {
    claimType: string,
    claimValue: string,
}

export interface ChangePassModel {
    ChangePass: {
        currentPassword: string,
        password: string,
        confirmPassword: string,
    }

}
export interface ChangeUserPassModel {
    ChangePass: {
        password: string,
        confirmPassword: string,
    }

}