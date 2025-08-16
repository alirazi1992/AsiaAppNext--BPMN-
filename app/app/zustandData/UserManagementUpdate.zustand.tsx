import { create } from 'zustand';
import { EmailModel, PhoneNumbersModel, UserAddressModel } from '../models/HR/userInformation';

export interface UpdateUserData {
    userName: string;
    id: string;
    accessFailedCount: number;
    lockoutEnd: string;
    twoFactorEnabled: boolean;
    lockoutEnabled: boolean;
    isActive: boolean;
    isTechnicalExp: boolean;
    faFirstName: string;
    firstName: string;
    faLastName: string;
    lastName: string;
    title: string;
    faTitle: string;
    genderId: number;
    addresses: UserAddressModel[],
    eMails: EmailModel[],
    phoneNumbers: PhoneNumbersModel[],
    personalCode: number;
    isConfirmed: boolean;
    artemisAspNetUserAttachments: any,
    nationalCode: string;
    employmentDate: string;
    childCount: number;
    fatherName: string;
    inssuranceNo: string;
    birthCertificateId: string;
    birthCertificateIssueanceCity: string;
    militaryServiceId: number;
    lastEducationDegree: number;
    fieldOfStudy: string;
    educationInstitute?: string | null;
    isMarried: boolean;
    isRetired : boolean,
    // jobExperinces: any,
    birthDate: string,
    setState: (newUser: any) => Promise<void>;
}

const useStore = create<UpdateUserData>((set) => ({
    userName: '',
    id: '',
    accessFailedCount: 0,
    lockoutEnd: '',
    twoFactorEnabled: false,
    lockoutEnabled: false,
    isTechnicalExp: false,
    isActive: false,
    faFirstName: '',
    firstName: '',
    faLastName: '',
    lastName: '',
    title: '',
    faTitle: '',
    genderId: 1,
    addresses: [
    //     {
    //     addressTypeId: 0,
    //     artemisAspNetOrganization: null,
    //     artemisAspNetOrganizationId: null,
    //     artemisAspNetUsers: null,
    //     artemisAspNetUsersId: '',
    //     cityId: 0,
    //     countryId: 0,
    //     id: 0,
    //     isDeleted: false,
    //     physicalAddress: '',
    //     provinceId: 0,
    //     postalCode: ''
    // }
],
    eMails: [
    //     {
    //     address: "",
    //     artemisAspNetDepartment: null,
    //     artemisAspNetDepartmentId: null,
    //     artemisAspNetOrganization: null,
    //     artemisAspNetOrganizationId: null,
    //     artemisAspNetUsers: null,
    //     artemisAspNetUsersId: '',
    //     id: 0,
    //     isDefault: false,
    //     isDeleted: false


    // }
],
    phoneNumbers: [
    //     {
    //     artemisAspNetDepartment: null,
    //     artemisAspNetDepartmentId: null,
    //     artemisAspNetOrganization: null,
    //     artemisAspNetOrganizationId: null,
    //     artemisAspNetUsers: null,
    //     artemisAspNetUsersId: '',
    //     id: 0,
    //     isDefault: false,
    //     isDeleted: false,
    //     isFax: false,
    //     isMobile: false,
    //     number: ''
    // }
],
    personalCode: 0,
    isConfirmed: false,
    artemisAspNetUserAttachments: null,
    nationalCode: '',
    employmentDate: '',
    childCount: 0,
    fatherName: '',
    inssuranceNo: '',
    birthCertificateId: '',
    birthCertificateIssueanceCity: '',
    militaryServiceId: 0,
    lastEducationDegree: 0,
    fieldOfStudy: '',
    educationInstitute: null,
    isMarried: false,
    isRetired: false,
    // jobExperinces:  newUser.id || state.id,
    birthDate: '',
    setState: async (newUser: UpdateUserData) => {
        set((state) => ({
            ...state,
            userName: newUser.userName,
            id: newUser.id,
            isTechnicalExp: newUser.isTechnicalExp,
            accessFailedCount: newUser.accessFailedCount,
            lockoutEnd: newUser.lockoutEnd,
            twoFactorEnabled: newUser.twoFactorEnabled,
            lockoutEnabled: newUser.lockoutEnabled,
            isActive: newUser.isActive,
            faFirstName: newUser.faFirstName,
            firstName: newUser.firstName,
            faLastName: newUser.faLastName,
            lastName: newUser.lastName,
            title: newUser.title,
            genderId: newUser.genderId,
            faTitle: newUser.faTitle,
            addresses: newUser.addresses,
            eMails: newUser.eMails,
            phoneNumbers: newUser.phoneNumbers,
            personalCode: newUser.personalCode,
            isConfirmed: newUser.isConfirmed,
            artemisAspNetUserAttachments: newUser.artemisAspNetUserAttachments,
            nationalCode: newUser.nationalCode,
            employmentDate: newUser.employmentDate,
            childCount: newUser.childCount,
            fatherName: newUser.fatherName,
            inssuranceNo: newUser.inssuranceNo,
            birthCertificateId: newUser.birthCertificateId,
            birthCertificateIssueanceCity: newUser.birthCertificateIssueanceCity,
            militaryServiceId: newUser.militaryServiceId,
            lastEducationDegree: newUser.lastEducationDegree,
            fieldOfStudy: newUser.fieldOfStudy,
            educationInstitute: newUser.educationInstitute,
            isMarried: newUser.isMarried,
            birthDate: newUser.birthDate,
            isRetired : newUser.isRetired
        }))
    }
}))



export default useStore;
