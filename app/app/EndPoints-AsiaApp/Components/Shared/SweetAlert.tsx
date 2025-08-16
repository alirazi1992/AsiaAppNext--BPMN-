'use client';
import React from 'react';
import Swal from 'sweetalert2';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";

type PropsType = {
    title: string,
    message: string,
    status: boolean
}

const CustomAlert = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const showAlert = ({ title, message, status }: PropsType) => {
        Swal.fire({
            background: themeMode!.stateMode ? "#22303c" : "#eee3d7",
            color: themeMode!.stateMode ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: title,
            text: message,
            icon: status ? "warning" : "error",
            confirmButtonColor: "#22c55e",
            confirmButtonText: "Ok!"
        });
    };
    return { showAlert }
};

export default CustomAlert;