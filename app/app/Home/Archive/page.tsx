'use client';
import ArchiveAutomation from '../../components/pages/Automation/Archive/Archive';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const ArchiveAutomationPage = () => {
  return (
    <ArchiveAutomation />
  )
}

export default WithAuth(ArchiveAutomationPage); 