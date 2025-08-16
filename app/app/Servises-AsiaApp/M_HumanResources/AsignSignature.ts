

import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function AsignSignature(title: string, file: string, fileType: string, userId: string) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AssignSignature`;
//     let method: string = 'put';
//     let data = {
//         "title": title,
//         "file": file,
//         "fileType": fileType,
//         "userId": userId
//     };
//     let response: AxiosResponse<Response<number>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const AsignSignature =  () => {
    const { AxiosRequest } = useAxios();
    const Function = async (title: string, file: string, fileType: string, userId: string) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/AssignSignature`;
    let method: string = 'put';
    let data = {
        "title": title,
        "file": file,
        "fileType": fileType,
        "userId": userId
    };
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return {Function}
}
export default AsignSignature