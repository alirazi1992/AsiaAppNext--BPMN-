"use client";
import AcsPdfViewer from "@/app/components/pdfViewer/AcsPdfViewer";
import IframeSkeleton from "@/app/components/shared/IframeSkeleton";
import useStore from "@/app/hooks/useStore";
import themeStore from "@/app/zustandData/theme.zustand";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
} from "@material-tailwind/react";
import { forwardRef, useImperativeHandle, useState } from "react";

const ViewCertificateAttachment = forwardRef((props: any, ref) => {
  const themeMode = useStore(themeStore, (state) => state);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(!open);

  useImperativeHandle(ref, () => ({
    handleOpenAttachment: () => {
      handleOpen();
    },
  }));
  return (
    <Dialog
      dismiss={{
        escapeKey: true,
        referencePress: true,
        referencePressEvent: "click",
        outsidePress: false,
        outsidePressEvent: "click",
        ancestorScroll: false,
        bubbles: true,
      }}
      size="xl"
      className={`absolute top-0 bottom-0 ${
        !themeMode || themeMode?.stateMode ? "cardDark" : "cardLight"
      }`}
      open={open}
      handler={handleOpen}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <DialogHeader
        dir="rtl"
        className={`${
          !themeMode || themeMode?.stateMode
            ? "cardDark lightText"
            : "cardLight darkText"
        } flex justify-between sticky top-0 left-0`}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Certificate Attachment Pdf
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => handleOpen()}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </DialogHeader>
      <DialogBody
        className="w-full"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {props.data != null && props.data.file !== null ? (
          <section className="w-full h-fit p-2">
            <div style={{ height: "100vh", width: "100%" }}>
              <AcsPdfViewer
                base64={`data:${props.data.fileType};base64,${props.data.file}`}
              />
            </div>
          </section>
        ) : (
          <IframeSkeleton />
        )}
      </DialogBody>
    </Dialog>
  );
});

ViewCertificateAttachment.displayName = "ViewCertificateAttachment";
export default ViewCertificateAttachment;
