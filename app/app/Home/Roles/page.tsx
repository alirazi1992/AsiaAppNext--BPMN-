'use client';
import Roles from '@/app/components/pages/UserManagement/AcsUsers/ManageRoles/RolesSearch';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const RolesPage = () => {
    return (
        <Roles />
    )
}
export default WithAuth(RolesPage); 