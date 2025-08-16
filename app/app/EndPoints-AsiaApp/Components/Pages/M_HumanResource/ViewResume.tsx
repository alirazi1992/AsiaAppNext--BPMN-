"use client";
import AcsPdfViewer from "@/app/components/pdfViewer/AcsPdfViewer";
import IframeSkeleton from "@/app/components/shared/IframeSkeleton";
import { GetResumeFileModel } from "@/app/Domain/M_HumanRecourse/ManageResume";
import useStore from "@/app/hooks/useStore";
import themeStore from "@/app/zustandData/theme.zustand";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { CloseIcon } from "../../Shared/IconComponent";

const ViewResume = forwardRef(
  ({ data }: { data: GetResumeFileModel | null }, ref) => {
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
          } flex justify-between sticky top-0 left-0 z-[85855]`}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Resume File
          <CloseIcon onClick={() => handleOpen()} />
        </DialogHeader>
        <DialogBody
          className="w-full"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {data != null ? (
            <section className="w-full h-fit">
              <div style={{ height: "100vh", width: "100%" }}>
                <AcsPdfViewer base64={data.file} />
              </div>
            </section>
          ) : (
            <IframeSkeleton />
          )}
        </DialogBody>
      </Dialog>
    );
  }
);

ViewResume.displayName = "ViewResume";
export default ViewResume;
