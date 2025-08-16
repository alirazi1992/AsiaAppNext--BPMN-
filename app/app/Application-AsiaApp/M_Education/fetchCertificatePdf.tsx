import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetPdfCertificates from "@/app/Servises-AsiaApp/M_Education/GetCertificatePdf";

export const useCerificates = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetPdfCertificates()
    const fetchCertificatePdf = async (certNo: number) => {
        try {
            const response = await Function(certNo);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.status !== 401 && response.data.data != null) {
                return response.data.data
            } else {
                Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Participant Certificate Pdf",
                    text: response.data.message,
                    icon: response.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
            }}
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchCertificatePdf };
};