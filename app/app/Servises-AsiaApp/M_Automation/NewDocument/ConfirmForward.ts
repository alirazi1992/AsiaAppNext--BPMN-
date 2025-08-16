import { AddForwardReceiver } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const ConfirmForwardDocument = async (receivers: AddForwardReceiver, docheapId: string, subject: string, forwardParentId: number, indicator: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/forwardconfirm`;
//     let method = "Put";
//     let data = {
//         "receivers": receivers.Forward.AddReceiver.map((item) => {
//             return {
//                 "receiverActorId": item.receiverActorId,
//                 "receiveTypeId": item.receiveTypeId,
//                 "personalDesc": item.personalDesc,
//                 "isHidden": item.isHidden,
//             }
//         }),
//         "forwardDesc": receivers.Forward.forwardDesc,
//         "files": receivers.Forward.files?.map((item) => {
//             return {
//                 "attachment": item.attachment,
//                 "description": item.description,
//                 "fileTitle": item.fileTitle,
//                 "type": item.type
//             }
//         }),
//         "docHeapId": docheapId,
//         "parentForwardTargetId": forwardParentId,
//         "subject": subject,
//         "docIndicator": indicator,
//     };
//     let response: AxiosResponse<Response<any>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default ConfirmForwardDocument

const ConfirmForwardDocument = () => {
  const { AxiosRequest } = useAxios();
  const Function = async (
    receivers: AddForwardReceiver,
    docheapId: string,
    subject: string,
    forwardParentId: number,
    indicator: string,
    docTypeId: string
  ) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/forwardconfirm`;
    let method = "Put";
    let data = {
      receivers: receivers.Forward.AddReceiver.map((item) => {
        return {
          receiverActorId: item.receiverActorId,
          receiveTypeId: item.receiveTypeId,
          personalDesc: item.personalDesc,
          isHidden: item.isHidden,
        };
      }),
      forwardDesc: receivers.Forward.forwardDesc,
      files: receivers.Forward.files?.map((item) => {
        return {
          attachment: item.attachment,
          description: item.description,
          fileTitle: item.fileTitle,
          type: item.type,
        };
      }),
      docHeapId: docheapId,
      parentForwardTargetId: forwardParentId,
      subject: subject,
      docIndicator: indicator,
      docTypeId,
    };
    let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true });
    return response;
  };
  return { Function };
};
export default ConfirmForwardDocument;
