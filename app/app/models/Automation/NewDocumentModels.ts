import { SelectOptionModel } from "@/app/Domain/shared";

export interface Response<T> { status: boolean; message: string; data: T }
export interface ResponseArchive<T> { Status: boolean; Message: string; Data: T }

export interface GetDocumentDataModel {
        fieldId: number,
        fieldName: string,
        fieldValue: string,
        isUpdatable: boolean,
        recordId: number
}

export interface ResponseGetToolbarsModel {
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


export interface newDocumentValue {
        WordDocUrlDto: {
                Access_token: string,
                Urlsrc: string,
                EmbedUrlsrc: string,
                Favicon: string
        },
        OrginalFileId: number,
        fieldId: number,
        SaveDate: string,
        EditState: boolean
}

export interface GetRepositoryModel extends SelectInterfaceModel {
        Id: number,
        Value: string
}

export interface NewDocumentSelectsModels extends SelectInterfaceModel {
        Id: number,
        Value: string
        isUpdatable?: boolean,
        recordId: number | null
}


export interface KeyWordsItemModel extends SelectInterfaceModel {

        readonly title: string;
        readonly faTitle: string;
        readonly createDate: string;
        readonly jobId: number;

}


export interface SaveReceiverModel {
        Selected: SaveMainActor[]
}
export interface SaveMainActor {
        Actor: SaveActorModel
}
export interface SaveActorModel {
        EnValue: string,
        Level: number,
        Id: number,
        Value: string,
        ActionName: string,
        Desc: string,
        ActionId: number
}



export interface GetRecieversModel extends SelectInterfaceModel {
        EnValue: string,
        Level: number,
        Id: number,
        Value: string,
        Name: string,
        FaName: string
}

export interface SelectedSendersItem {
        EnValue: string,
        Level: number,
        label: string,
        value: number
}

export interface UnArchiveDocList {
        docHeapId: number,
        docTypeId: number,
        indicator: string,
        subject: string,
        totalCount: string,
}

export interface TreePanelModel {
        hierarchy: OrgChartModel[]
        index: number
}


export interface NewDocumentStateModels {
        SubmitNoValue: string,
        documentResult: string,
        templateId: number,
        getDocumentData: GetDocumentDataModel[],
        optionPriority: GetRepositoryModel[],
        optionClassification: GetRepositoryModel[],
        optionFlowType: GetRepositoryModel[],
        optionHasAttachments: GetRepositoryModel[],
        recievers: GetRecieversModel[],
        creationPersioanDate: string,
        signPersianDate: string,
        isuuedPersianDate: string,
        paraphTableListItems: ParaphTableListModel[],
        addParaph: string,
        paraphLength: number,
        forwardsTableListItems: ForwardsListModel[],
        attachments: ForwardAttachmentsModel[],
        attachmentImg: string,
        file: FileModel | null,
        keywords: KeywordModel[],
        relatedDocsTableListItems: RelatedDocListTableModel | null,
        attachmentsTableListItems: AttachmentsTableListModel[],
        relationType: RelationTypeModel | null,
        selectedRelation: UnArchiveDocList | null,
        NextRelation: boolean,
        layoutSize: LayoutsModel[],
        forwardRecievers: ForwardRecieversModel[],
        forwardRecieversTableitems: ForwardRecieversModel[],
        recieveTypes: RecieveTypes[],
        setFormat: number,
        pdfString: string,
        RecieversTableListItems: RecieversTableListItem[],
        SendersTableListItems: GetSendersModel[]
        CopyRecieversTableListItems: CopyRecieversTableListItem[],
        SignersName: SignersModel[],
        printString: string,
        HierarchyItems: HierarchyModel[],
        docTypeState: GetdocTypeModel | null,
        importImage: string,
        toolbars: ResponseGetToolbarsModel | null,
        SubjectValue: string,
        ShowPassageIframe: boolean | null,
        PassageDocument: PassageModel | null,
        ImportTables: SaveImportTablesItemsModels[]
}

export interface initialFilesModel {
        file: string,
        fileType: string,
        fileName: string,
        fileDesc: string,
        isFile: boolean
}

export interface SignersModel {
        Id: number,
        SignerName: string,
        SignDate: string
}
export interface GetImportImageModel {
        file: string,
        fileName: string,
        fileType: string
}
export interface RelationTypeModel {
        value: number,
        label: string
}

export interface FileModel {
        file: string,
        fileName: string,
        fileType: string
}

export interface ResponseUploadAllAttachments {
        createDate: string,
        creator: string,
        desc: string,
        fileType: string,
        id: number,
        persianDate: string
        title: string,
        fileName: string
}

export interface RecieversTableListItem extends SelectInterfaceModel {
        ActionName: string,
        ActionId: number,
        Description: string,
        Id: number,
        Level: number,
        Value: string,
        EnValue: string
}
export interface CopyRecieversTableListItem extends SelectInterfaceModel {
        ActionName: string,
        ActionId: number,
        Description: string,
        Id: number,
        Level: number,
        Value: string,
        EnValue: string
}
export interface GetSendersModel extends SelectInterfaceModel {
        Id: number,
        EnValue: string,
        Level: number,
        Value: string,
        ActionName: string,
        Description: string,
        ActionId: number
}

export interface DateInputs {
        CreationDate: string
        DateSign: string
        IssuedDate: string
        ChangeDate: string
}


export interface ParaphTableListModel {
        id: number,
        desc: string,
        writer: string,
        contact: string,
        paraphDate: string,
        personalDesc: string,
        paraphType: number,
        forwardDesc: string
}

export interface test extends ParaphTableListModel {
        date: any
}

export interface AddParaphItem {
        docParaphId: number
        writer: string,
        paraphType: number,
        desc: string,
        date: string,
        persianDate: any,
}

export interface ForwardAttachmentsModel {
        id: number,
        attachmentId: number,
        attachmentTitle: string,
        attachmentDesc: string
}
export interface ForwardTargetModel {
        targetId: number,
        receiverActorId: number,
        receiverName: string,
        receiverFaName: string,
        receiverRoleName: string,
        receiverFaRoleName: string,
        receiveType: string
}

export interface ForwardsListModel {
        id: number,
        createDate: string,
        forwardAttachments: ForwardAttachmentsModel[],
        desc: string,
        forwardTarget: ForwardTargetModel[]
        fromActorId: number,
        senderFaName: string,
        senderName: string,
        senderFaRoleName: string,
        senderRoleName: string
}

export interface SubsetFoldersHierarchyModels {
        Id: number,
        ArchiveName: string,
        ParentId: number,
        SubArchives: SubsetFoldersHierarchyModels[],
        IsArchived: boolean
}

export interface HierarchyModels {
        archiveFolders: SubsetFoldersHierarchyModels[]
}

export interface ResponseAddDocArchive {
        docHeapId: number,
        docTypeId: number,
        subject: string,
        indicatorId: string,
        docArchiveId: number
}


export interface SelectInterfaceModel {
        label: string,
        value: number
}

export interface KeywordModel extends SelectInterfaceModel {
        id: number,
        title: string,
        isAssigned: boolean,
        docKeword: KeywordDocMidel | null
}


export interface KeywordDocMidel {
        id: number,
        docHeap: any,
        docHeapId: number,
        frequentlyUsingKeyWord: any,
        frequentlyUsingKeyWordId: number,
        isDelete: boolean,
        deleteDate: any,
        deleteActorId: number,
        deleteActor: any,
        actorId: number,
        actor: string,
        createDate: string
}
export interface ResponseSaveKeywords {
        keywordId: number,
        title: string,
        isAssigned: boolean,
        docKeywordId: number
}

interface CheckItem {
        isActive?: boolean
}

export interface AttachmentsTableListModel extends CheckItem {
        id: number,
        attachmentType: AttachmentTypeModel,
        attachmentTypeId: number,
        name: string,
        fileTitle: string,
        description: string | null | undefined,
        createDate: string,
        creator: string,
        fileType: string,
        lockDate: any
}

export interface AttachmentTypeModel {

        id: number,
        title: string,
        description: string

}


export interface RelatedDocListTableModel {
        relatedDocs: RelatedDocsModel[] | null | undefined,
        documentIndicator: string
}

export interface RelatedDocsModel {
        id: number,
        createDate: string,
        relatedDocHeapId: number,
        isNext: boolean,
        docRelationType: string,
        relatedDocIndicator: string,
        docTypeId: number,
        docTypeTitle: string
}

export interface UploadImageResponse {
        createDate: string,
        creator: string,
        desc: string,
        fileType: string,
        id: number,
        persianDate: string,
        title: string
}

export interface AddRelationModel {
        docTypeId: number,
        docHeapId: number,
        relatedDocHeapId: number,
        relationType: string,
        relationId: number,
        relatedIndicator: string,
        docTypeTitle: string,
        isNext: boolean
}

export interface LayoutsModel extends SelectInterfaceModel {
        id: number,
        name: string,
        path: string,
        isMain: boolean
}

export interface TableItems {
        desc: string,
        isHidden: boolean,
        receiveTypeId: number,
        isChecked: boolean
}

export interface receiveTypeModel {
        id: number,
        title: string,
        isDefault: boolean,
        faTitle: string
}

export interface GetDocTypes extends SelectOptionModel<number> {
        "id": number,
        "name": string,
        "faName": string,
        "moduleId": number,
        "moduleName": string
}

export interface ForwardReceiverModel {
        actorId: number,
        label: string,
        value: number,
        level: number,
        title: string
}

export interface GroupMembersModel extends TableItems {
        actorId: number,
        title: string,
        level: number,
        IsGroup: boolean,
        isChecked: boolean
}

export interface ForwardRecieversModel extends TableItems {
        title: string,
        actorId: number,
        level: number,
        IsGroup?: boolean,
}

export interface ResponseForwardDocument {
        createDate: string,
        desc: string,
        forwardAttachments: ResponseFoewardAttachment[],
        forwradTragte: ResponseForwradTragte[],
        fromActorId: number,
        id: number,
        senderFaName: string,
        senderFaRoleName: string,
        senderName: string,
        senderRoleName: string
}

export interface ResponseFoewardAttachment {
        attachmentDesc: string,
        attachmentId: number,
        attachmentTitle: string,
        id: number
}

export interface ResponseForwradTragte {
        receiverActorId: number,
        receiverFaName: string,
        receiverFaRoleName: string,
        receiverName: string,
        receiverRoleName: string,
        targetId: number


}

export interface DescFile {
        fileDesc: string | null | undefined
}
export interface FilesModel extends DescFile {
        file: fileFilesModel,
        preview: string,
        desc?: string
}
export interface fileFilesModel {
        path: string,
        name: string,
        lastModified: number,
        lastModifiedDate: any,
        size: number,
        type: string,
        webkitRelativePath: string
}


export interface TotalMembar extends RelationTypeModel {
        id: number,
        actorId: number,
        level: number,
        actorName: string,
        IsGroup?: boolean,
        isChecked?: boolean,
        desc: string,
        isHidden: boolean,
        receiveTypeId: number
}

export interface ReceiverFinalTableItemModel {
        name: string,
        receinveId: number,
        personalDesc: string,
        isHidden: boolean
}

export interface RecieveTypes extends SelectInterfaceModel {
        id: number,
        title: string,
        isDefault: boolean,
        faTitle: string
}

export interface SignDocumentModel {

        signatureId: number,
        signer: string,
        lockedFields: string[],
        signDate: string

}

export interface HierarchyModel {
        id: number,
        createDate: string,
        inCartable: boolean,
        forwardAttachments: ForwardAttachmentModel[]
        desc: string,
        forwardTarget: ForwardTargetModel[],
        fromActorId: number,
        forwardParentTargetId: number,
        senderName: string,
        senderFaName: string,
        senderRole: string,
        senderFaRole: string,
}

export interface ForwardTargetModel {
        id: number,
        personalDesc: string,
        forwardState: ForwardStateModel,
        firstSeenDate: string,
        lastSeenDate: string,
        childForwardSource: HierarchyModel[],
        toActorId: number,
        forwardSourceId: number,
        receiverName: string,
        receiverFaName: string,
        receiverRole: string,
        receiverFaRole: string,
        receiveType: string
}

export interface ForwardAttachmentModel {
        id: number,
        attachmentType: string,
        attachmentTypeId: number,
        name: string,
        fileTitle: string,
        description: string,
        createDate: string,
        creator: string,
        fileType: string,
        lockDate: string
}

export interface ForwardStateModel {
        id: number,
        name: string,
        description: string
}

export interface OrgChartModel {
        id: number,
        pid: number | null,
        StateId: number | null,
        LastSeenDate: string | null,
        FirstSeenDate: string | null,
        State: string | null,
        Desc: string,
        PersonnalDesc: string | null,
        ActorFaName: string,
        ActorFaRole: string,
        Answer: string | null,
        createDate: string | null,
        tags: string[],
        receiveType: string | null,
        name: string | null,
}

export enum ForwardStateEnum {
        Seen = 1,
        NotSeen = 2,
        Pending = 3,
        Confirm = 4,
        Rejected = 5,
        Deny = 6,
}

export interface GetdocTypeModel {
        id: number,
        title: string,
        faTitle: string,
        isImportType: boolean
}

export type UpdateDocumentIssuedItems = {
        Name: string,
        RecordId: number,
        FieldId: number,
        Value: string,
}

export type UpdateDocumentIssued = {
        content: string,
        docHeapId: string,
        docTypeId: string | null,
        indicator: string
}

export type UpdateDocument = {
        content: string,
        docHeapId: string,
        docTypeId: string,
        indicator: string
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

export interface DropzoneFileModel {
        file: string,
        desc: string,
        title: string,
        type: string,
        docHeapId: string,
        docTypeId: string
}

export interface SelectedValuToForward {
        IsGroup: boolean,
        actorId: number,
        desc: string,
        isHidden: boolean,
        label: string,
        level: number,
        receiveTypeId: number,
        title: string,
        value: number
}

export interface OpenNewDocumentModel {
        drafts: DraftModel[],
        layoutSize: LayoutsModel[],
        formatId: LayoutsModel | undefined,
        documentType: number,
        documentSize: number,
        draftId: string
}

export interface GetDocTypes extends SelectInterfaceModel {
        "id": number,
        "name": string,
        "faName": string,
        "moduleId": number,
        "moduleName": string
}

export interface DraftModel extends SelectInterfaceModel {
        id: number,
        title: string
}

export interface SaveImportType {
        isExists: boolean,
        docsList: SaveImportTablesItemsModels[]
}

export interface SaveImportTablesItemsModels {
        createDate: string,
        submitDate: string,
        subject: string,
        docHeapId: number,
        sender: string
}


export interface LoadingNewDocument {
        loadingResponse: boolean,
        loadingGetDocumentData: boolean,
        loadingPriority: boolean,
        loadingFlowType: boolean,
        loadingClassification: boolean,
        loadingHasAttachment: boolean,
        loadingFowardReceivers: boolean,
        loadingKeywords: boolean,
        loadingParaphList: boolean,
        loadingForwardsList: boolean,
        loadingRelatedDocList: boolean,
        loadingGroupsList: boolean,
        loadingAttachmentList: boolean,
        loadingSignersList: boolean,
        loadingMainReceiversList: boolean,
        loadingCopyReceiversList: boolean,
        loadingSendersList: boolean,
        loadingImageImport: boolean,
        loadingSearch: boolean,
        loadingGetDocumentresult: boolean
}



