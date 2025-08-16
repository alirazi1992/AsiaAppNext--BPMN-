// components/alerts/showSimpleAlert.ts
import Swal from "sweetalert2";

interface SimpleAlertOptions {
  text: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmText?: string;
  themeMode?: { stateMode: boolean };
  allowOutsideClick?: boolean;
}

export const showSimpleAlert = ({
  text,
  icon = "info",
  confirmText = "باشه",
  themeMode,
  allowOutsideClick = false,
}: SimpleAlertOptions) => {
  Swal.fire({
    background: !themeMode || themeMode.stateMode ? "#22303c" : "#eee3d7",
    color: !themeMode || themeMode.stateMode ? "white" : "#463b2f",
    allowOutsideClick,
    text,
    icon,
    confirmButtonColor: "#22c55e",
    confirmButtonText: confirmText,
  });
};

// هشدار ساده
// showSimpleAlert({
//     text: "اطلاعات وارد شده کامل نیست!",
//     icon: "warning",
//     themeMode: { stateMode: true },
//   });