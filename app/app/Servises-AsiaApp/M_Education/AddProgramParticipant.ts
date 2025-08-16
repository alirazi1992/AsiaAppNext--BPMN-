
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import type { ParticipantModel, ProgramParticipantsModel } from "@/app/Domain/M_Education/Participant";

// export async function AddProgramParticipant(dataItems: ParticipantModel[]) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/AddProgramParticipant`;
//     let method: string = 'put';
//     let data = dataItems.map((item) => {
//         return {
//             "faName": item.faName,
//             "name": item.name,
//             "nationalCode": item.nationalCode,
//             "courseProgramId": item.courseProgramId,
//             "personnelId": item.personnelId
//         }
//     });
//     let response: AxiosResponse<Response<ProgramParticipantsModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }


const AddProgramParticipant = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItems: ParticipantModel[]) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/AddProgramParticipant`;
        let method: string = 'put';
        let data = dataItems.map((item) => {
            return {
                "faName": item.faName,
                "name": item.name,
                "nationalCode": item.nationalCode,
                "courseProgramId": item.courseProgramId,
                "personnelId": item.personnelId
            }
        });
        let response: AxiosResponse<Response<ProgramParticipantsModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default AddProgramParticipant