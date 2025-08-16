import { GetJobVacanciesListModel } from "@/app/Domain/M_HumanRecourse/ManageResume";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function GetJobVacanciesList() {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/GetJobVacanciesList`;
//     let method = 'get';
//     let data = {};
//     let response: AxiosResponse<Response<GetJobVacanciesListModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const GetJobVacanciesList = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/GetJobVacanciesList`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetJobVacanciesListModel[]>>  = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetJobVacanciesList