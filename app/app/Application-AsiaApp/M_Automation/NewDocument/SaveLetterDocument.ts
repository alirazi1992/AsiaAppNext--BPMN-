
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { GetDocumentDataModel } from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import { ReceiversType } from "@/app/EndPoints-AsiaApp/Components/Pages/M_Automation/NewDocument/NewDocument-MainContainer";
import SaveDocument from "@/app/Servises-AsiaApp/M_Automation/NewDocument/SaveLetterDoc";

export const SaveDocs = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = SaveDocument()
    const SaveDocuments = async (receivers: ReceiversType, docData: GetDocumentDataModel[], docTypeId: string, templateId: string) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'Save Document',
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!"
        })
        if (result.isConfirmed) {
            const response = await Function(receivers, docData, docTypeId, templateId)
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                }else{
                if ( response.data.data !== 0 && response.data.status) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'Save Document',
                        text: response.data.message,
                        icon: response.data.status == true ? "warning" : 'error',
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                    return res
                }}
            }
        } else {
            const res = 'dissmiss';
            return res
        }
    }
    return { SaveDocuments };
}