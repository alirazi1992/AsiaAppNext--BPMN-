import { SelectOptionModel } from "../../shared";
import { GetDocumentDataModel } from "./NewDocument";

export interface GetFieldRepositoryModel extends SelectOptionModel<number> {
    Id: number,
    Value: string
}
export interface DocumentInfoProps {
    docTypeId?: string | null,
    docheapId?: string | null,
    forwardParentId?: string | null,
    AllData: GetDocumentDataModel[] | undefined

}

export interface GetSignersModel {
    Id: number,
    SignDate: string
    SignerName: string
}

export interface InitializeSignersState {
    AllData: GetDocumentDataModel[] | undefined
    signers: GetSignersModel[]
}

export interface UnSignDocumentModel {
    lockedFields: number,
    status: boolean
}

export interface SignDocumentModel {
    signatureId: number,
    signer: string,
    lockedFields: string[],
    signDate: string
}

export interface GetToolbarResultModel {
    secretariateExport: boolean,
    archive: boolean,
    print: boolean,
    pdfExport: boolean,
    return: boolean,
    deny: boolean,
    confirm: boolean,
    confirmForward: boolean,
    forward: boolean,
    forwardTree: boolean,
    save: boolean,
    revock: boolean,
    saveDraft: boolean
}

export interface GetDocTypeModel {
    id: number,
    title: string,
    faTitle: string,
    isImportType: boolean
}

export interface DocumentInfoModel {
    DocumentInfo: {
        creator?: string | null,
        createDate?: string | null,
        submitDate?: string | null,
        signDate?: string | null,
        indicator?: string | null,
        subject?: string | null,
        submitNo?: string | null,
        flowType?: number | null,
        hasAttachment?: number | null,
        classification?: number | null,
        priority?: number | null,
    }
}

export interface InitialStateRepoModel {
    priority: GetFieldRepositoryModel[] | undefined,
    hasAttachment: GetFieldRepositoryModel[] | undefined,
    flowType: GetFieldRepositoryModel[] | undefined,
    classification: GetFieldRepositoryModel[] | undefined,

}


export interface GetDraftsModel extends SelectOptionModel<number> {
    id: number,
    title: string
}
