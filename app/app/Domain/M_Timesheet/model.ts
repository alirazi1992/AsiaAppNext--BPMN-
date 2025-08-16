export interface GetTimesheetBoundriesModel {
    id: number, name: string
}

export interface TimesheetDetailsModel {
    time: any,
    spendTimeDate: string,
    boundryItemId: number
}

export interface GetUnderneathUserNamesModel {
    userId: string,
    name: string
}

export interface GetUserTimesheetDetails {
    masterId: number,
    details: any[],
    isConfirmed: boolean
}

export interface GetTimeSheetSumValuesModel {
    day: string,
    totalSumValue: string,
    totalStandardValue: string,
    totalOverWorkValue: string,
    totalWorkDeductionValue: string
}

export interface ReportTimesheet {
    GetTimesheet: GetTimesheet
}
interface GetTimesheet {
    byBranch: boolean;
    byMonth: boolean;
    branchId?: number[];
    peopleId?: string[];
    isMain: boolean;
    startDate: string;
    endDate: string;
}
