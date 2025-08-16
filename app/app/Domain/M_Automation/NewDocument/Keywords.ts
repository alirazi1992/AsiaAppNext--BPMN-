import { SelectOptionModel, SelectOptionProps } from '../../shared'

// export interface GetKeywordsListModel extends SelectOptionModel<number> {
//     id: number,
//     title: string,
//     isAssigned: boolean,
//     docKeword: DocKewordModel | null
// }
export interface DocKewordModel {
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

export interface KeywordModel extends SelectOptionModel<number> {
    id: number,
    title: string
}


export interface InitializeStateModel {
    keywordsList?: KeywordModel[],
    selected?: KeywordModel[]
}

export interface GetRelatedDocsListModel {
    relatedDocs: RelatedDocsModel[] | undefined,
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

export interface SelectedKeywordsModel {
    AddKeywords: InitializeStateModel
}

export interface SaveKeywordModel {
    keywordId: number,
    title: string,
    isAssigned: boolean,
    docKeywordId: number
}

export interface AddRelationResultModel {
    docTypeId: number,
    docHeapId: number,
    relatedDocHeapId: number,
    relationType: string,
    relationId: number,
    relatedIndicator: string,
    docTypeTitle: string,
    isNext: boolean
}

export interface AddRelationYupModel {
    AddRelation: {
        RelationDoc: SelectOptionModel<number> | null
    }
}


