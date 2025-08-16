import { SelectOptionTypes } from '../HR/sharedModels'

export interface AddDepartmentModel {
    DepartmentInfo: DepartmentInfo,
    phoneNumbers?: PhoneType[],
    emails?: EmailModel[]
}

export interface GetRelatedDepartmentList {
    id: number,
    name: string,
    title: string,
    artemisAspNetOrganization: {
        id: number,
        name: string,
        faName: string
    } | null,
    subDepartements: GetRelatedDepartmentList[],
    isSecretariat: boolean,
    faName: string,
    faTitle: string,
    isCentral: boolean,
    secretariatId: number | null,
    isConfirmed: boolean,
    parentDepartementId: number | null,
    emails: EmailModel[],
    phoneNumbers: PhoneType[]
}
export interface DepartmentInfo {
    faName?: string,
    faTitle: string,
    name?: string,
    title: string,
    isSecretariat?: boolean,
    isConfirmed?: boolean,
    isCentral?: boolean,
    parentDepartementId?: number | null,
    artemisAspNetOrganizationId: number,
    secretariatId?: number | null
}
export interface PhoneType {
    isDefault?: boolean,
    isFax?: boolean,
    isMobile?: boolean,
    number?: string,
    id?: number,
    artemisAspNetDepartmentId?: number,
}
export interface EmailModel {
    address?: string,
    isDefault?: boolean,
    id?: number, artemisAspNetDepartmentId?: number,
}

export interface DepartmentListByOrgId extends SelectOptionTypes<number> {
    id: number,
    name: string,
    title: string,
    isSecretariat: boolean,
    faName: string,
    faTitle: string,
    isCentral: boolean,
    secretariatId: number | null,
    isConfirmed: boolean,
    parentDepartementId: number | null,
    // faParentDepartmentName: string | null,
    // parentDepartmentName: string | null
}

export interface GetSecreteriateList extends SelectOptionTypes<number> {
    id: number,
    name: string | null,
    title: string,
    faName: string | null,
    faTitle: string
}