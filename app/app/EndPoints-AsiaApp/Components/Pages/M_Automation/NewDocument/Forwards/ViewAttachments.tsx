"use client";
import AcsPdfViewer from "@/app/components/pdfViewer/AcsPdfViewer";
import IframeSkeleton from "@/app/components/shared/IframeSkeleton";
import { GetAttachmentPdfModel } from "@/app/Domain/M_Automation/NewDocument/Forwards";
import { CloseIcon } from "@/app/EndPoints-AsiaApp/Components/Shared/IconComponent";
import useStore from "@/app/hooks/useStore";
import themeStore from "@/app/zustandData/theme.zustand";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import Image from "next/image";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { DataContext } from "../NewDocument-MainContainer";

const ViewAttachmentPdf = forwardRef<{ handleOpen: () => void }, any>(
  (props, ref) => {
    const themeMode = useStore(themeStore, (state) => state);
    const [open, setOpen] = useState<boolean>(false);
    const { loadings } = useContext(DataContext);
    const handleOpen = () => setOpen(!open);
    const [attachment, setAttachment] = useState<GetAttachmentPdfModel | null>(
      null
    );
    useImperativeHandle(ref, () => ({
      handleOpen: () => {
        handleOpen();
      },
      viewAttachment: (item: GetAttachmentPdfModel) => {
        setAttachment(item);
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
          } flex justify-between sticky top-0 left-0 z-[8585]`}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {/* {attachment?.fileName} */}
          <CloseIcon onClick={() => handleOpen()} />
        </DialogHeader>
        <DialogBody
          className="w-full h-[88vh]"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {loadings.response == false && attachment?.file ? (
            attachment?.fileType === "image/jpg" ? (
              <figure className="min-h-[85vh] w-full bg-red-200 flex items-center justify-center">
                <Image
                  className="w-full h-full object-cover"
                  src={attachment.file}
                  alt="view-attachment"
                />
              </figure>
            ) : (
              <section className="w-full h-fit">
                <div style={{ height: "100vh", width: "100%" }}>
                  <AcsPdfViewer base64={attachment.file} />
                </div>
              </section>
            )
          ) : (
            <IframeSkeleton />
          )}
        </DialogBody>
      </Dialog>
    );
  }
);
ViewAttachmentPdf.displayName = "ViewAttachmentPdf";
export default ViewAttachmentPdf;
