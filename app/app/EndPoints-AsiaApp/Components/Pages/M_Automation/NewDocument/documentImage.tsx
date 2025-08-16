"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { useNewDocumentDataContext } from "./useNewDocumentDataContext";
import Loading from "@/app/Home/loading";
import AcsPdfViewer from "@/app/components/pdfViewer/AcsPdfViewer";

const DocumentImage = forwardRef<{ setItems: (item: string) => void }, any>((props, ref) => {
  const [data, setData] = useState<string | null>(null);
  const { loadings, state } = useNewDocumentDataContext();
  useImperativeHandle(ref, () => ({
    setItems: (item: string) => {
      setData(item);
    },
  }));
  if (!data) {
    return <Loading />;
  }
  return (
    <>
      {data !== "" && loadings.iframeLoading == false && state.documentData && state.documentData.length > 0 ? (
        <section className="w-full h-fit">
          <div style={{ height: "100%", width: "100%" }}>
            <AcsPdfViewer base64={data} />
          </div>
        </section>
      ) : (
        <Loading />
      )}
    </>
  );
});
DocumentImage.displayName = "DocumentImage";
export default DocumentImage;
