// components/alerts/showConfirmAlert.ts
import Swal from "sweetalert2";

interface ConfirmAlertOptions {
  title: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmText?: string;
  cancelText?: string;
  themeMode?: { stateMode: boolean };
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const showConfirmAlert = ({
  title,
  text,
  icon = "warning",
  confirmText = "تأیید",
  cancelText = "انصراف",
  themeMode,
  onConfirm,
  onCancel,
}: ConfirmAlertOptions) => {
  Swal.fire({
    background: !themeMode || themeMode.stateMode ? "#22303c" : "#eee3d7",
    color: !themeMode || themeMode.stateMode ? "white" : "#463b2f",
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#22c55e",
    cancelButtonColor: "#f43f5e",
  }).then((result) => {
    if (result.isConfirmed) onConfirm?.();
    else if (result.dismiss === Swal.DismissReason.cancel) onCancel?.();
  });
};



// هشدار با تأیید/انصراف
// showConfirmAlert({
//     title: "حذف کاربر",
//     text: "آیا مطمئن هستید؟",
//     onConfirm: () => console.log("تأیید شد"),
//     onCancel: () => console.log("لغو شد"),
//     themeMode: { stateMode: false },
//   });