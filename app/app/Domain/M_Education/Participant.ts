import { SelectOptionModel } from "../shared"
import { EducationalCourseProgramsModel } from "./Programs"

export interface AddProgramParticipantModel {
    id: number,
    creationDate: string,
    faName: string,
    name: string,
    nationalCode: string
}

export interface GetProgramParticipantsModel {
    totalCount: number,
    pageNo: number,
    pageSize: number,
    participants: ProgramParticipantsModel[]
}

export interface ProgramParticipantsModel {
    id: number,
    creationDate: string
    faName: string,
    name: string,
    nationalCode: string,
    certNo: number | null,
    personetId: string | null,
    attachmentId: number | null
}

export interface AddCertificatetoParticipant {
    AttachCertificate: {
        attachmentFile?: string,
        attachmentName?: string,
        attachmentType?: string,
        participantId: string,
    }
}

export interface GetCertificateAttachment {
    id: number,
    name: string,
    title: string,
    fileType: string,
    file: string
}

export interface SearchKeyModel {
    courseProgramId: number,
    nationalCode: string,
    faName: string,
    name: string
}

export interface ProgramParticipantsProps {
    program: EducationalCourseProgramsModel | undefined,
}

export interface InitializeParticipantsState {
    participants: ProgramParticipantsModel[] | undefined,
    totalCount: number,
    searchKey: SearchKeyModel,
    certNo: number
}

export interface AddParticipantsModel {
    AddParticipant: ParticipantModel[]
}

export interface ParticipantModel {
    name: string,
    faName: string,
    nationalCode: string | null,
    courseProgramId: number,
    personnelId: string | null
}

export interface SearchParticipantsModel {
    Participant: ParticipantsModel
}

export interface ParticipantsModel {
    name?: string,
    faName?: string,
    nationalCode?: string,
    courseProgramId: number,
}

export interface GetAcsUsersModel extends SelectOptionModel<string> {
    faName: string,
    name: string,
    id: string
}

export interface CertificatePdfProps {
    data: string
}

export interface AcsParticipantsProps {
    id: number | undefined,
    onSubmit: (data: ParticipantModel[]) => void
}
