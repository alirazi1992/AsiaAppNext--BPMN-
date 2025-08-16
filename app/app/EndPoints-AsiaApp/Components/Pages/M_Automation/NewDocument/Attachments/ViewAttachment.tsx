"use client";
import { ImageTypes } from "@/app/Application-AsiaApp/Utils/shared";
import AcsPdfViewer from "@/app/components/pdfViewer/AcsPdfViewer";
import { DownloadAttachment } from "@/app/Domain/M_Automation/NewDocument/Attachments";
import { CloseIcon } from "@/app/EndPoints-AsiaApp/Components/Shared/IconComponent";
import useStore from "@/app/hooks/useStore";
import themeStore from "@/app/zustandData/theme.zustand";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useState } from "react";

const ViewAttachmentComponent = forwardRef<
  { handleOpen: () => void },
  { file: DownloadAttachment }
>(({ file }, ref) => {
  const themeMode = useStore(themeStore, (state) => state);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(!open);
  useImperativeHandle(ref, () => ({
    handleOpen: () => {
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
      className={`absolute top-0 bottom-0 overflow-auto ${
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
        } flex justify-between sticky top-0 left-0 z-[4645]`}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {file?.fileName}
        <CloseIcon onClick={() => handleOpen()} />
      </DialogHeader>
      <DialogBody
        className="w-full h-[88vh]"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <figure className="h-full w-full">
          {ImageTypes.includes(file!.fileType) ? (
            <Image
              className="w-full h-full"
              src={file?.file}
              alt="view-attachment"
              width={100}
              height={100}
            />
          ) : (
            <section className="w-full h-fit">
              <div style={{ height: "100vh", width: "100%" }}>
                <AcsPdfViewer base64={file.file} />
              </div>
            </section>
          )}
        </figure>
      </DialogBody>
    </Dialog>
  );
});
ViewAttachmentComponent.displayName = "ViewAttachmentComponent";
export default ViewAttachmentComponent;
