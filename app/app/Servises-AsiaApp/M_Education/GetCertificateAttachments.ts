import { GetCertificateAttachment } from "@/app/Domain/M_Education/Participant";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetCertificateAttachments = async (id: number) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetCertificateAttachment?attachmentId=${id}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetCertificateAttachment>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetCertificateAttachments

const GetCertificateAttachments = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetCertificateAttachment?attachmentId=${id}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetCertificateAttachment>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetCertificateAttachments
