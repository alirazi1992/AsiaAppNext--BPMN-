
import { GetListOfApprovingCertificateModel } from "@/app/Domain/M_Education/ApproveCertificate";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetListOfApprovingCertificate = async () => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetListOfApprovingCertificates`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetListOfApprovingCertificateModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetListOfApprovingCertificate

const GetListOfApprovingCertificate = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetListOfApprovingCertificates`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetListOfApprovingCertificateModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
  }
  export default GetListOfApprovingCertificate