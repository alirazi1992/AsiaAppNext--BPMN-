"use client";
import AcsPdfViewer from "@/app/components/pdfViewer/AcsPdfViewer";
import IframeSkeleton from "@/app/components/shared/IframeSkeleton";
import useStore from "@/app/hooks/useStore";
import themeStore from "@/app/zustandData/theme.zustand";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { CloseIcon } from "../../../Shared/IconComponent";

const ViewTab = forwardRef((props: any, ref) => {
  const themeMode = useStore(themeStore, (state) => state);
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<string | null>("");
  const handleOpen = () => setOpen(!open);

  useImperativeHandle(ref, () => ({
    handleOpenTab: () => {
      handleOpen();
    },
    setData: (data: string) => {
      setData(data);
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
        } flex justify-between sticky top-0 left-0 z-[787878878]`}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Tab Pdf
        <CloseIcon
          onClick={() => {
            handleOpen(), setData("");
          }}
        />
      </DialogHeader>
      <DialogBody
        className="w-full"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {data ? (
          <section className="w-full h-fit">
            <div style={{ height: "100vh", width: "100%" }}>
              <AcsPdfViewer base64={data} />
            </div>
          </section>
        ) : (
          <IframeSkeleton />
        )}
      </DialogBody>
    </Dialog>
  );
});

ViewTab.displayName = "ViewTab";
export default ViewTab;
