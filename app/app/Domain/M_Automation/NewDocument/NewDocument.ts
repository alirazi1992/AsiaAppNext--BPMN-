import { SelectOptionModel } from "../../shared";
import { GetDocTypeModel } from "./DocumentInformation";
export interface GetDocumentDataModel {
    fieldId: number,
    fieldName: string,
    fieldValue: string,
    isUpdatable: boolean,
    recordId: number
}

export interface InitializeStateModel {
    documentData: GetDocumentDataModel[] | undefined,
    docTypes: GetDocTypeModel | null,
    signers: any[]
    documentImage: string | null,
    layoutId: number,
}

export interface TabsProps {
    docheapId: string
}

export interface GetRecieveTypesModel extends SelectOptionModel<number> {
    id: number,
    title: string,
    isDefault: boolean,
    faTitle: string
}

export interface PassageModel {
    WordDocUrlDto: WordDocUrlDtoModel,
    FileId: string,
    OrginalFileId: string,
    SaveDate: string,
    EditState: boolean
}
export interface WordDocUrlDtoModel {
    Access_token: string,
    Urlsrc: string,
    EmbedUrlsrc: string,
    Favicon: string
}


