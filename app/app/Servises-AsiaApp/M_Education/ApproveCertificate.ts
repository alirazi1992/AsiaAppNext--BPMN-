
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function ApproveCerificate(id: number) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/ApproveCertificate?certId=${id}`;
//     let method: string = 'get';
//     let data = {};
//     let response: AxiosResponse<Response<boolean>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const ApproveCerificate = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/ApproveCertificate?certId=${id}`;
        let method: string = 'get';
        let data = {};
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default ApproveCerificate