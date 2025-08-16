
import { GetDocumentDataModel } from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import { GetMainReceiver } from "@/app/Domain/M_Automation/NewDocument/Receivers";
import { Response } from "@/app/Domain/shared";
import { ReceiversType } from "@/app/EndPoints-AsiaApp/Components/Pages/M_Automation/NewDocument/NewDocument-MainContainer";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function SaveDocument(receivers: ReceiversType, docData: GetDocumentDataModel[],  docTypeId: string, templateId: string) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savedoc`;
//     let method = "put";
//     let data = {
//         docTypeId: docTypeId,
//         content:
//             JSON.stringify(docData.map((option: GetDocumentDataModel) => {
//                 switch (option.fieldName) {
//                     case "MainReceiver":
//                         return {
//                             FieldId: option.fieldId,
//                             Name: option.fieldName,
//                             RecordId: option.recordId,
//                             Value: receivers.mainReceivers?.map((item: GetMainReceiver) => (
//                                 {
//                                     Actor: {
//                                         Level: item.Level,
//                                         Action: item.ActionId,
//                                         Id: item.Id
//                                     }
//                                 }
//                             ))
//                         }
//                     case "Sender":
//                         return {
//                             FieldId: option.fieldId,
//                             Name: option.fieldName,
//                             RecordId: option.recordId,
//                             Value: receivers.senders!.map((item: GetMainReceiver) => (
//                                 {
//                                     Actor: {
//                                         Level: item.Level,
//                                         Action: item.ActionId,
//                                         Id: item.Id,
//                                     }
//                                 }
//                             ))
//                         }

//                     case "CopyReceiver":
//                         return {
//                             FieldId: option.fieldId,
//                             Name: option.fieldName,
//                             RecordId: option.recordId,
//                             Value: receivers.copyReceivers?.map((item: GetMainReceiver) => (
//                                 {
//                                     Actor: {
//                                         Level: item.Level,
//                                         Action: item.ActionId,
//                                         Id: item.Id,
//                                         Desc: item.Description
//                                     }
//                                 }
//                             ))
//                         }
//                     default:
//                         return {
//                             FieldId: option.fieldId,
//                             Name: option.fieldName,
//                             RecordId: option.recordId,
//                             Value: option.fieldValue
//                         }
//                 }
//             }
//             )),
//             templateId: templateId
//     }
//     let response: AxiosResponse<Response<number>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const SaveKeyword = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (receivers: ReceiversType, docData: GetDocumentDataModel[],  docTypeId: string, templateId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savedoc`;
        let method = "put";
        let data = {
            docTypeId: docTypeId,
            content:
                JSON.stringify(docData.map((option: GetDocumentDataModel) => {
                    switch (option.fieldName) {
                        case "MainReceiver":
                            return {
                                FieldId: option.fieldId,
                                Name: option.fieldName,
                                RecordId: option.recordId,
                                Value: receivers.mainReceivers?.map((item: GetMainReceiver) => (
                                    {
                                        Actor: {
                                            Level: item.Level,
                                            Action: item.ActionId,
                                            Id: item.Id
                                        }
                                    }
                                ))
                            }
                        case "Sender":
                            return {
                                FieldId: option.fieldId,
                                Name: option.fieldName,
                                RecordId: option.recordId,
                                Value: receivers.senders!.map((item: GetMainReceiver) => (
                                    {
                                        Actor: {
                                            Level: item.Level,
                                            Action: item.ActionId,
                                            Id: item.Id,
                                        }
                                    }
                                ))
                            }
    
                        case "CopyReceiver":
                            return {
                                FieldId: option.fieldId,
                                Name: option.fieldName,
                                RecordId: option.recordId,
                                Value: receivers.copyReceivers?.map((item: GetMainReceiver) => (
                                    {
                                        Actor: {
                                            Level: item.Level,
                                            Action: item.ActionId,
                                            Id: item.Id,
                                            Desc: item.Description
                                        }
                                    }
                                ))
                            }
                        default:
                            return {
                                FieldId: option.fieldId,
                                Name: option.fieldName,
                                RecordId: option.recordId,
                                Value: option.fieldValue
                            }
                    }
                }
                )),
                templateId: templateId
        }
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default SaveKeyword