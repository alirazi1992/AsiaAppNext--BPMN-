
import { GetGeneralTemplateModel } from "@/app/Domain/M_Education/Courses";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetGeneralTemplates = async () => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetGeneralTemplates?moduleId=7`;
//     let method: string = 'patch';
//     let data = {}
//     let response: AxiosResponse<Response<GetGeneralTemplateModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetGeneralTemplates

const GetGeneralTemplates = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (searchKey: string = '', page: number = 1) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/base/manage/GetGeneralTemplates?moduleId=7`;
    let method: string = 'patch';
    let data = {}
    let response: AxiosResponse<Response<GetGeneralTemplateModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
  }
  export default GetGeneralTemplates
