// import { SearchDocsResultModel } from "@/app/Domain/M_Search/search";
// import { Response } from "@/app/Domain/shared";
// import useAxios from "@/app/hooks/useAxios";
// import { AxiosResponse } from "axios";
// import { useEffect } from "react";

// const SearchDocs =  () => {
//     const { AxiosRequest } = useAxios();
//     const Search = async (list: string, page: number = 1) => {
//         let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/searchdocs`;
//         let method: string = 'post';
//         let data = {
//             "param": list,
//             "page": page,
//             "count": 10
//         }
//         let response: AxiosResponse<Response<SearchDocsResultModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
//         return response;
//     }
//     return {Search}
// }
// export default SearchDocs


import { SearchDocsResultModel } from "@/app/Domain/M_Search/search";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { useEffect } from "react";

const SearchDocs =  () => {
    const { AxiosRequest } = useAxios();
    const Search = async (list: string, page: number = 1) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/searchdocs`;
        let method: string = 'post';
        let data = {
            "param": list,
            "page": page,
            "count": 10
        }
        let response: AxiosResponse<Response<SearchDocsResultModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return {Search}
}
export default SearchDocs