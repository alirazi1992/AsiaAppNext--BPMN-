export interface Response<T> { status: boolean, message: string, data: T }

import { SelectOptionTypes } from '../HR/sharedModels';

export interface GetOrganizationRoleMoleds extends SelectOptionTypes<string> {
    id: string,
    name: string,
    faName: string,
    title: string,
    faTitle: string,
    faDepartmentName: string,
    departmentName: string,
    faOrganizationName: string,
    organizationName: string
}

export interface GetStatusRolesListModels extends SelectOptionTypes<string> {
    id: string,
    name: string
}

export interface GetUserRoles {
    userId: string,
    roleId: string,
    isActive: boolean,
    id: number
}

export interface GetResponseAddRole {
    id: number,
    userId: string,
    roleId: string,
    isActive: boolean
}

export interface GetUserRolesModel {
    id: number,
    roleId: string,
    isActive: boolean,
    roleName: string,
    isDefault: boolean
}
export interface SelectUsersRoles extends SelectOptionTypes<string> {
    id: number,
    roleId: string,
    isActive: boolean,
    roleName: string,
    isDefault: boolean
}

export interface GetBaseType extends SelectOptionTypes<number> {
    id: number,
    type: string,
    title: string
}
export interface GetBaseValueTypes {
    id: number,
    value: string
}

export interface AddNewRoleModel {
    AddNewRole: AddRoleType
}

export interface AddRoleType {
    faName: string,
    roleId?: string | null,
    orgId?: number,
    faTitle: string,
    name: string,
    title: string,
    isConfirmed?: boolean,
    parentArtemisAspNetRolesId?: string | null,
    artemisAspNetDepartmentId: number,
    artemisAspNetDepartmentName?: string | null,
    artemisAspNetDepartmentFaName?: string | null,
}

export interface GetRolesHierarchyByOrgIdModel {
    id: string,
    name: string,
    title: string,
    faName: string,
    faTitle: string,
    isConfirmed: boolean,
    parentArtemisAspNetRolesId: string | null,
    department: DepartmentModel,
    subRoles: GetRolesHierarchyByOrgIdModel[]
}

export interface DepartmentModel {
    id: number,
    name: string | null,
    faName: string | null
}

export interface GetOrganizationRoleModel extends SelectOptionTypes<string> {
    id: string,
    name: string,
    faName: string,
    title: string,
    faTitle: string,
    faDepartmentName: string | null,
    departmentName: string | null,
    faOrganizationName: string,
    organizationName: string
}

export interface DepartmentEmails {
    id: number,
    address: string,
    isDefault: boolean,
    artemisAspNetDepartmentId: number
}
export interface DepartmentPhoneNumbers {
    id: number,
    artemisAspNetDepartmentId: number,
    isDefault: boolean,
    isFax: boolean,
    isMobile: boolean,
    number: string
}

export interface GetRelatedDepartmentList {
    id: number,
    name: string,
    title: string,
    artemisAspNetOrganization: {
        id: number,
        name: string,
        faName: string
    },
    subDepartements: GetRelatedDepartmentList[],
    isSecretariat: boolean,
    faName: string,
    faTitle: string,
    isCentral: boolean,
    secretariatId: number,
    isConfirmed: boolean,
    parentDepartementId: number,
    emails: DepartmentEmails[],
    phoneNumbers: DepartmentPhoneNumbers[]
}


export interface UserClaimsModel {
    value: string,
    type: string,
    id: number
}

export interface GetRolesClaimsModel {
    roleId: string,
    roleClaims: RoleClaimsModel[]
}
export interface RoleClaimsModel {
    value: string,
    type: string,
    id: number
}

export interface GetUsersByRoleIdModel {
    userId: string,
    userName: string,
    faFirstname: string,
    faLastname: string
}
export interface GetRoleByRoleIdModel {
    name: string,
    faName: string,
    title: string,
    faTitle: string,
    departmentId: number,
    parentId: string,
    orgId: number,
    isConfirmed: boolean
}