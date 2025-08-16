'use client';
import DepartmentManagement from '@/app/components/pages/UserManagement/AcsUsers/DepartmentManagement/departments';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const DraftManagementPage = () => {
    return (
        <DepartmentManagement />
    )
}

export default WithAuth(DraftManagementPage); 