'use client';
import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import Image from "next/image";
import themeStore from './../../../../zustandData/theme.zustand';
import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosResponse } from "axios";
import { ViewDocumentDownloadFile, Response } from "@/app/models/Archive/ViewDocumentListTable";
import useAxios from "@/app/hooks/useAxios";
import ArchiveJobFilterStore from './../../../../zustandData/ArchiveJobFilter.zustand';
import Swal from "sweetalert2";
import useStore from './../../../../hooks/useStore';
import ButtonComponent from "@/app/components/shared/ButtonComponent";

const ViewDocumentFile = (props: { optionId: number }) => {
    const { AxiosRequest } = useAxios()
    const [open, setOpen] = useState(true);
    const handleOpen = () => setOpen(open);
    const themeMode = useStore(themeStore, (state) => state);
    const WorkOrderId = ArchiveJobFilterStore.getState().WorkOrderId;
    const JobId = ArchiveJobFilterStore.getState().JobId;
    const imageUrlRef = useRef('')
    const ViewFile = useCallback(async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/download?Id=${props.optionId}&WorkOrderId=${WorkOrderId ?? 0}&JobId=${JobId}&AttachmentType=7`
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<ViewDocumentDownloadFile>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            if (typeof response.data.data == 'object' && response.data.data != null && response.data.status == true) {
                let base64String = `data:${response.data.data.fileType};base64,${response.data.data.file}`;
                const blob = new Blob([atob(response.data.data.file)], { type: `${response.data.data.fileType}` });
                imageUrlRef.current = URL.createObjectURL(blob);
            } else {
                Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "View Document!",
                    text: response.data.message,
                    icon: (response.data.status == true && response.data.data == null) ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "OK!"
                })
            }
        }
    }, [JobId, WorkOrderId, props.optionId, !themeMode || themeMode?.stateMode])

    useEffect(() => {
        ViewFile()
    }, [ViewFile])
    return (
        <Dialog className={` ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} overflow-x-auto m-auto`} size="xxl" open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <figure className='m-auto'>
                    <Image className='object-cover' src={imageUrlRef.current} alt="viewDoc" width={100} height={100} />
                </figure>
            </DialogBody>
            <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <ButtonComponent onClick={handleOpen}>بستن</ButtonComponent>
            </DialogFooter>
        </Dialog>
    )
}

export default ViewDocumentFile;