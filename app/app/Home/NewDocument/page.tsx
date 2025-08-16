"use client";
import NewDocument from "@/app/EndPoints-AsiaApp/Components/Pages/M_Automation/NewDocument/NewDocument-MainContainer";
// import NewDocument from '@/app/components/pages/Automation/NewDocument/NewDocument';
import WithAuth from "@/app/EndPoints-AsiaApp/Components/Layout/HOC";
import { useSearchParams } from "next/navigation";
const NewDocumentPage = () => {
  const searchParams = useSearchParams();
  const docTypeId = searchParams.get("doctypeid");
  const layoutType = searchParams.get("layoutsize");
  const draftId = searchParams.get("id");
  const templateId = searchParams.get("templateId");
  return (
    <NewDocument
      key={`${docTypeId}-${layoutType}-${draftId}-${templateId}-${Math.random()}`}
    />
  );
};
export default WithAuth(NewDocumentPage);
