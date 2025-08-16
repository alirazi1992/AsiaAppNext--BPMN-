"use client";
import { ImageTypes } from "@/app/Application-AsiaApp/Utils/shared";
import AcsPdfViewer from "@/app/components/pdfViewer/AcsPdfViewer";
import { GetHArchiveFileModel } from "@/app/Domain/M_History/Archive";
import useStore from "@/app/hooks/useStore";
import themeStore from "@/app/zustandData/theme.zustand";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useState } from "react";
import { CloseIcon } from "../../../Shared/IconComponent";

const ViewArchive = forwardRef((props: any, ref) => {
  const themeMode = useStore(themeStore, (state) => state);
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<GetHArchiveFileModel | null>(null);
  const handleOpen = () => setOpen(!open);

  useImperativeHandle(ref, () => ({
    handleOpenTab: () => {
      handleOpen();
    },
    setData: (data: GetHArchiveFileModel) => {
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
        } flex justify-between sticky top-0 z-[8585] left-0`}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Archive File
        <CloseIcon
          onClick={() => {
            handleOpen(), setData(null);
          }}
        />
      </DialogHeader>
      {data !== null ? (
        <DialogBody
          className="w-full h-[88vh]"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <figure className="h-full w-full">
            {ImageTypes.includes(data!.fileType) ? (
              <Image
                className="w-full h-full"
                src={data?.file}
                alt="view-attachment"
                width={100}
                height={100}
              />
            ) : (
              <section className="w-full h-fit">
                <div style={{ height: "100vh", width: "100%" }}>
                  <AcsPdfViewer base64={data.file} />
                </div>
              </section>
            )}
          </figure>
        </DialogBody>
      ) : undefined}
    </Dialog>
  );
});

ViewArchive.displayName = "ViewArchive";
export default ViewArchive;
