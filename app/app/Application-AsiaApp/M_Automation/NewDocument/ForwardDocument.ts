import Swal from "sweetalert2";
import themeStore from "@/app/zustandData/theme.zustand";
import useStore from "@/app/hooks/useStore";
import { AddForwardReceiver } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import ForwardDocument from "@/app/Servises-AsiaApp/M_Automation/NewDocument/ForwardDocument";
import ConfirmForwardDocument from "@/app/Servises-AsiaApp/M_Automation/NewDocument/ConfirmForward";

export const useDocument = () => {
  const themeMode = useStore(themeStore, (state) => state);
  const { Function } = ForwardDocument();
  const Forward = async (
    receivers: AddForwardReceiver,
    docheapId: string,
    subject: string,
    forwardParentId: number,
    indicator: string,
    docTypeId: string
  ) => {
    const response = await Function(receivers, docheapId, subject, forwardParentId, indicator, docTypeId);
    if (response) {
      if (response.status == 401) {
        return response.data.message;
      } else {
        if (response.data.status && response.data.data) {
          return response.data.data;
        } else {
          const res = Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Forward Document!",
            text: response.data.message,
            icon: response.data.status ? "warning" : "error",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Ok!",
          });
          return res;
        }
      }
    }
  };
  return { Forward };
};
export const useConfirmForwardDocument = () => {
  const themeMode = useStore(themeStore, (state) => state);
  const { Function } = ConfirmForwardDocument();
  const ConfirmForward = async (
    receivers: AddForwardReceiver,
    docheapId: string,
    subject: string,
    forwardParentId: number,
    indicator: string,
    docTypeId: string
  ) => {
    const response = await Function(receivers, docheapId, subject, forwardParentId, indicator, docTypeId);
    if (response) {
      if (response.status == 401) {
        return response.data.message;
      } else {
        if (response.data.data) {
          return response.data.data;
        } else {
          const res = Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Confirm and Forward Document!",
            text: response.data.message,
            icon: response.data.status ? "warning" : "error",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Ok!",
          });
          return res;
        }
      }
    }
  };
  return { ConfirmForward };
};
