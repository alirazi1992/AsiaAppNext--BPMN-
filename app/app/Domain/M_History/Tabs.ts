export interface SearchTabModels {
    pageNo: number,
    totalCount: number,
    tabs: TabsModel[]
}

export interface SearchItemsModel {
    SearchTab: SearchTabModel
}

export interface SearchTabModel {
    customerName?: string,
    nationaCode?: string,
    tabCodeId?: string,
    tabStartDate?: string,
    tabEndDate?: string
}

export interface TabsModel {
    id: number,
    currencyTypeId: number,
    owner: string,
    tabCodeId: string,
    amount: number,
    nationalCode: string,
    tabDate: string
}