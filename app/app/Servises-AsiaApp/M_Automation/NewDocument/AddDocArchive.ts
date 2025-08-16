import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { AddDocArchiveModel } from "@/app/Domain/M_Automation/NewDocument/toolbars";

// export async function AddDocArchive(docheapId: string, id: number, name: string) {
//   let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/adddocarchive`;
//   let method = "put";
//   let data = {
//     "docHeapId": docheapId,
//     "archiveId": id,
//     "documentName": name
//   };
//   let response: AxiosResponse<Response<AddDocArchiveModel>> = await useAxios({ url, method, data, credentials: true })
//   return response;
// }
const AddDocArchive = () => {
  const { AxiosRequest } = useAxios();
  const Function = async (docheapId: string, id: number, name: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/adddocarchive`;
    let method = "put";
    let data = {
      "docHeapId": docheapId,
      "archiveId": id,
      "documentName": name
    };
    let response: AxiosResponse<Response<AddDocArchiveModel>> = await AxiosRequest({ url, method, data, credentials: true })
    return response;
  }
  return { Function }
}
export default AddDocArchive