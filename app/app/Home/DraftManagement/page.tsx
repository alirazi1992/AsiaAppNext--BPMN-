'use client';
import DraftManagement from '../../components/pages/Automation/DraftManagement/DraftManagement';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const DraftManagementPage = () => {
  return (
    <DraftManagement />
  )
}

export default WithAuth(DraftManagementPage); 