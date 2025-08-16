import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetListOfApprovingCertificate from "@/app/Servises-AsiaApp/M_Education/GetListOfApprovingCertificates";
import ApproveCerificate from "@/app/Servises-AsiaApp/M_Education/ApproveCertificate";

export const useApprovingCertificates = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetListOfApprovingCertificate()
    const fetchListApprovingCertificates = async () => {
        try {
            const response = await Function();
            if (response.status == 401) {
                return response.data.message
            } else {
                if (response.data.data) {
                    return response.data.data
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Get List of Approving Certificates",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }
            }
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchListApprovingCertificates };
};

export const ApprovingCertificates = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = ApproveCerificate()
    const approveCertificates = async (id: number) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Approve Certificate?",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, approve it!"
        })
        if (result.isConfirmed) {
            const response = await Function(id);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                } else {
                    if (response.data.status && response.data.data) {
                        return response.data.data
                    } else {
                        return Swal.fire({
                            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Approve Certificate?",
                            text: response.data.message,
                            icon: response.data.data == false && response.data.status == true ? "warning" : 'error',
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "Ok!"
                        })
                    }
                }
            }
        }
    }
    return { approveCertificates };
};