import { OptionProps } from 'react-select';
import { SelectOptionModel } from '../HR/sharedModels';
export interface Response<T> { status: boolean, message: string, data: T }

export interface AddOrganizationInformationModel {
    OrganizationInfo: AddOrganizationStateModel,
    phoneNumbers: PhoneType[],
    physicalAddresses: AddressModel[],
    emails?: EmailModel[],
}

export interface AddOrganizationStateModel {
    name: string,
    faName: string,
    title: string,
    faTitle: string,
    countryId: number,
    cityId: number | null,
    provinceId: number | null,
    isMain?: boolean,
    isConfirmed?: boolean,
    id?: number,
    isFactual?: boolean
    nationalCode?: string,
    parentOrganizationId: number,
}

export interface AddressModel {
    physicalAddress: string,
    countryId: number,
    cityId: number,
    provinceId: number,
    addressTypeId: number,
    postalCode?: string,
    id?: number | null,
    artemisAspNetOrganizationId: number,
}

export interface PhoneType {
    isDefault?: boolean,
    isFax?: boolean,
    isMobile?: boolean,
    number: string,
    id?: number | null,
    artemisAspNetOrganizationId: number,
}


export interface EmailModel {
    address?: string,
    isDefault?: boolean,
    id?: number | null,
    artemisAspNetOrganizationId: number,
}

export interface OptionsModel extends SelectOptionModel {
    id: number,
    name: string,
    faName: string
}

export interface GetOrganizationModel {
    name: string,
    title: string,
    parentOrganizationId: number | null,
    parentOrganization: string | null,
    faName: string,
    faTitle: string,
    isMain: boolean,
    isConfirm: boolean,
    countryId: number,
    cityId: number,
    provinceId: number,
    isFactual: boolean,
    nationalCode: string,
    phoneNumbers: OrgPhoneNumberModel[],
    eMails: OrgEmailsModel[],
    addresses: OrgAddressesModel[]
}

export interface OrgPhoneNumberModel {
    id: number,
    number: string,
    isMobile: boolean,
    isDefault: boolean,
    isFax: boolean,
    artemisAspNetOrganizationId: number
}

export interface OrgEmailsModel {
    id: number,
    address: string,
    isDefault: boolean,
    artemisAspNetOrganizationId: number
}

export interface OrgAddressesModel {
    id: number,
    physicalAddress: string,
    artemisAspNetOrganizationId: number,
    countryId: number,
    provinceId: number,
    cityId: number,
    postalCode: string,
    addressTypeId: number
}


export interface AsyncSelectModel {
    label: string,
    value: number
}

export interface CustomerProps {
    id: number,
    name: string,
    faName: string,
    nationalCode: string
}

export interface CustomerOptionProps extends AsyncSelectModel {
    faName: string,
    name: string,
    nationalCode: string,
    id: number,
}
