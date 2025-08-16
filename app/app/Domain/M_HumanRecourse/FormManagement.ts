import { SelectOptionModel } from "../shared";

export interface FormsTabModel {
    title: string;
    component: React.ComponentType;
    val: string;
    key: number;
}

export interface GetUserInfoModel {
    userId: string,
    firstName: string,
    lastName: string,
    faFirstName: string,
    faLastName: string,
    nationalCode: string,
    personalCode: number
}

export interface getUserRemainingLeaveModel {
    employeeNumber: number,
    remainKardex: number,
    estehDayTime: number,
    reaminKardexHourMinuteString: string,
    reaminKardexDayHourMinuteString: string
}

export interface GetparentRoleModel {
    name: string,
    faName: string,
    title: string,
    faTitle: string,
    departmentId: number,
    parentId: string,
    orgId: number,
    isConfirmed: boolean
}

export interface GetSubstituteColleagues extends SelectOptionModel<string> {
    userId: string,
    firstName: string,
    lastName: string,
    faFirstName: string,
    faLastName: string,
    nationalCode: string | null
}

export interface GetDailyLeaveFieldsModel {
    id: number,
    name: string,
    faTitle: string,
    fieldType: string,
    defaultValue: string | null,
    hasRepository: boolean,
    repoQuery: string | null,
    readOnly: boolean,
    updatable: boolean,
    printable: boolean,
    isActorField: boolean,
    isMandatory: boolean
}

export interface GetDailyLeaveInitialModel {
    getUserRemainingLeave: getUserRemainingLeaveModel,
    getParentRole: GetparentRoleModel,
    getSubstituteColleagues: GetSubstituteColleagues[],
    getDailyLeaveDocFields: GetDailyLeaveFieldsModel[]
}


export interface GetPersonnelWorkPermitsInitial {
    getUserInfo: GetUserInfoModel,
    getDailyLeaveInitial: {
        status: boolean,
        message: string,
        data: GetDailyLeaveInitialModel
    }
}


