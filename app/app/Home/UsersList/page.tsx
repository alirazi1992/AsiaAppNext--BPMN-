'use client';
import UsersList from '@/app/components/pages/UserManagement/AcsUsers/UsersList/UsersTable';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const UsersListPage = () => {
    return (
        <UsersList />
    )
}

export default WithAuth(UsersListPage); 