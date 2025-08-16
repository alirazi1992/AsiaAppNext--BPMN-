import { AddForwardReceiver, ForwardResultModel } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const ForwardDocument = async (receivers: AddForwardReceiver, docheapId: string, subject: string, forwardParentId: number, indicator: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/forward`;
//     let method = "put";
//     let data = {
//         "forwardDoc": {
//             "receivers": receivers.Forward.AddReceiver.map((item) => {
//                 return {
//                     "receiverActorId": item.receiverActorId,
//                     "receiveTypeId": item.receiveTypeId,
//                     "personalDesc": item.personalDesc,
//                     "isHidden": item.isHidden,
//                 }
//             }),
//             "forwardDesc": receivers.Forward.forwardDesc,
//             "files": receivers.Forward.files?.map((item) => {
//                 return {
//                     "attachment": item.attachment,
//                     "description": item.description,
//                     "fileTitle": item.fileTitle,
//                     "type": item.type
//                 }
//             }),
//             "docHeapId": docheapId,
//             "parentForwardTargetId": forwardParentId ?? 0,
//             "subject": subject,
//             "docIndicator": indicator,
//         },
//         "recipientTitles": receivers.Forward.AddReceiver.map((item) => {
//             return item.title
//         })
//     };
//     let response: AxiosResponse<Response<ForwardResultModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default

const ForwardDocument = () => {
  const { AxiosRequest } = useAxios();
  const Function = async (
    receivers: AddForwardReceiver,
    docheapId: string,
    subject: string,
    forwardParentId: number,
    indicator: string,
    docTypeId: string
  ) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/forward`;
    let method = "put";
    let data = {
      forwardDoc: {
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
        parentForwardTargetId: forwardParentId ?? 0,
        subject: subject,
        docIndicator: indicator,
        docTypeId,
      },
      recipientTitles: receivers.Forward.AddReceiver.map((item) => {
        return item.title;
      }),
    };
    let response: AxiosResponse<Response<ForwardResultModel>> = await AxiosRequest({
      url,
      method,
      data,
      credentials: true,
    });
    return response;
  };
  return { Function };
};
export default ForwardDocument;
