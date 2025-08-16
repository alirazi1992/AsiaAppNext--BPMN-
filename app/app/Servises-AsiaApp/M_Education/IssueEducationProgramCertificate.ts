

import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function IssueCertificate(id: number) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/IssueEducationProgramCertificate?participantId=${id}`;
//     let method: string = 'put';
//     let data = {};
//     let response: AxiosResponse<Response<number>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const IssueCertificate = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/IssueEducationProgramCertificate?participantId=${id}`;
        let method: string = 'put';
        let data = {};
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default IssueCertificate