'use client';
import ViewArchive from '../../components/pages/ArchiveComponent/ArchiveViewDocument/ViewDocument'
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const ViewDocumentArchive = () => {
  return (

    <ViewArchive />

  )
}

export default WithAuth(ViewDocumentArchive); 