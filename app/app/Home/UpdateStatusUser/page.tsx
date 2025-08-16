'use client';
import UpdateUser from '@/app/components/pages/UserManagement/Status/UpdateStatus';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const UsersListPage = () => {
    return (
        <UpdateUser />
    )
}

export default WithAuth(UsersListPage); 