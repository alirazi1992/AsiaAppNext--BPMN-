'use client';
import ArchiveHistory from '@/app/EndPoints-AsiaApp/Components/Pages/M_History/Archives/Archive-MainContainer';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const HistoryArchivePage = () => {
  return (
    <ArchiveHistory />
  )
}
export default WithAuth(HistoryArchivePage); 
