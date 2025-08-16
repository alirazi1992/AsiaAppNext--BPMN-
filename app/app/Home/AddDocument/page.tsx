'use client';
import Archive from '@/app/components/pages/ArchiveComponent/ArchiveAddDocument/Archive';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const AddDocumentArchive = () => {
  return (
    <Archive />
  )
}
export default WithAuth(AddDocumentArchive)