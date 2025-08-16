'use client';
import GroupManagement from '@/app/components/pages/Automation/GroupManagement/GroupManagement';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const GroupManagementPage = () => {
  return (
    <GroupManagement />
  )
}
export default WithAuth(GroupManagementPage); 