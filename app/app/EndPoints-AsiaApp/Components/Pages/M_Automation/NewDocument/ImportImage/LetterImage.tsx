import AcsPdfViewer from "@/app/components/pdfViewer/AcsPdfViewer";
import IframeSkeleton from "@/app/components/shared/IframeSkeleton";
import { useContext } from "react";
import { DataContext } from "../NewDocument-MainContainer";
const LetterImage = ({ content }: { content: string }) => {
  const { loadings } = useContext(DataContext);

  return (
    <>
      {content !== "" && loadings.response == false ? (
        <section className="w-full h-full p-2">
          <div style={{ height: "100vh", width: "100%" }}>
            <AcsPdfViewer base64={content} />
          </div>
        </section>
      ) : (
        <IframeSkeleton />
      )}
    </>
  );
};
export default LetterImage;
