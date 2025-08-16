import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function AddCertificateAttachment(file: string, title: string, type: string, id: number) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/AddCertificateAttachment`;
//     let method: string = 'put';
//     let data = {
//         "file": file,
//         "fileType": type,
//         "title": title,
//         "participantId": id
//     }
//     let response: AxiosResponse<Response<number>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const AddCertificateAttachment = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (file: string, title: string, type: string, id: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/AddCertificateAttachment`;
        let method: string = 'put';
        let data = {
            "file": file,
            "fileType": type,
            "title": title,
            "participantId": id
        }
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default AddCertificateAttachment