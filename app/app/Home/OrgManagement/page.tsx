'use client';
import Organization from '@/app/components/pages/UserManagement/AcsUsers/OrganizationM/Subset';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const OrgManagementPage = () => {
    return (
        <Organization />
    )
}

export default WithAuth(OrgManagementPage); 