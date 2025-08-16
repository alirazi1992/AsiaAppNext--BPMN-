import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetPdfCertificates = async (certNo: number) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetParticipantCertificatePdf?certId=${certNo}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<string>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetPdfCertificates

const GetPdfCertificates = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (certNo: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetParticipantCertificatePdf?certId=${certNo}`;
    let method: string = 'get';
    let data = {}
    let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetPdfCertificates
