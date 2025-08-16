import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import AddRelation from "@/app/Servises-AsiaApp/M_Automation/NewDocument/AddRelation";

export const InsertingRelationDoc = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = AddRelation()
    const InsertRelation = async (docheapId: string, relatedDocHeapId: number, relationTypeId: number, isNext: boolean) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Add Relation Document to list",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add it!"
        })
        if (result.isConfirmed) {
            const response = await Function(docheapId, relatedDocHeapId, relationTypeId, isNext);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                }else{
                if ( response.data.status && response.data.data != null) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Add Relation Document to list",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                    return res
                }}
            }
        } else {
            const res = 'dissmiss'
            return res

        }
    }
    return { InsertRelation };
}