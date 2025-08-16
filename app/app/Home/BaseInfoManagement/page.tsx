'use client';
import BaseInfoManagement from '@/app/components/pages/UserManagement/AcsUsers/BaseInfoManagement/BaseInfoManagement';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const BaseInfoManagementPage = () => {
  return (
    <BaseInfoManagement />
  )
}

export default WithAuth(BaseInfoManagementPage); 