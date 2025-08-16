import { SelectOptionModel } from "../shared";

export interface SearchArchiveModels {
    pageNo: number,
    totalCount: number,
    hArchives: ArchivesModel[]
}

export interface ArchivesModel {
    id: number,
    archiveCategory: string,
    asiaCode: string,
    comment?: string,
    subject: string,
    docNo: string,
    sender?: string,
    receiver?: string,
    createDate: string,
    fileName: string,
    docName: string,
    regNo: string,
    vesselNameF?: string,
    vesselNameE?: string
}

export interface SearchArchiveModel {
    SearchArchive: {
        vesselName?: string;
        archiveCategoryId?: number | null;
        AsiaCode?: string;
        sender?: string;
        comment?: string;
        receiver?: string;
        subject?: string;
        RegNo?: string;
        DocNo?: string;
        archiveStartDate?: string;
        archiveEndDate?: string;
    }
}

export interface HArchiveModel {
    vesselNameF: string,
    vesselNameE: string,
    file: string,
    fileName: string,
    fileType: string,
    AsiaCode: string,
    subject: string,
    RegNo: string,
    archiveCategoryId: number
    sender?: string | null,
    comment?: string | null,
    receiver?: string | null,
    DocNo?: string | null,
}
export interface HArchiveModelUpdate {
    vesselNameF: string,
    vesselNameE: string,
    AsiaCode: string,
    subject: string,
    RegNo: string,
    archiveCategoryId: number
    id: number
    sender?: string | null,
    comment?: string | null,
    receiver?: string | null,
    DocNo?: string | null,
}

export interface AddArchiveModel {
    AddHArchive: HArchiveModel
}
export interface UpdateArchiveModel {
    UpdateArchive: HArchiveModelUpdate
}

export interface GetCategoriesModel extends SelectOptionModel<number> {
    id: number,
    title: string,
    faTitle: string
}

export interface GetHArchiveFileModel {
    file: string,
    fileType: string,
    fileName: string,
}