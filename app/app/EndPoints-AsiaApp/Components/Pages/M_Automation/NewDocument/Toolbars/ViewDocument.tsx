"use client";
import AcsPdfViewer from "@/app/components/pdfViewer/AcsPdfViewer";
import IframeSkeleton from "@/app/components/shared/IframeSkeleton";
import { CloseIcon } from "@/app/EndPoints-AsiaApp/Components/Shared/IconComponent";
import useStore from "@/app/hooks/useStore";
import themeStore from "@/app/zustandData/theme.zustand";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { DataContext } from "../NewDocument-MainContainer";

const ViewDocument = forwardRef(({ data }: { data: string }, ref) => {
  const themeMode = useStore(themeStore, (state) => state);
  const { loadings } = useContext(DataContext);
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
      className={`absolute top-0  ${
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
        className={` flex justify-between sticky top-0 bottom-0 left-0 z-[555555] ${
          !themeMode || themeMode?.stateMode
            ? "lightText cardDark"
            : "darkText cardLight"
        }`}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <CloseIcon onClick={() => handleOpen()} />
      </DialogHeader>
      <DialogBody
        className="w-full overflow-y-auto"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {data != "" || loadings.response == false ? (
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
ViewDocument.displayName = "ViewDocument";

export default ViewDocument;
