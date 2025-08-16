
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function GetVolunteerResumePdf(id: number) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetVolunteerResumePdf?resumeId=${id}`;
//     let method = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<string>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
const GetVolunteerResumePdf = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetVolunteerResumePdf?resumeId=${id}`;
        let method = 'get';
        let data = {}
        let response:  AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetVolunteerResumePdf