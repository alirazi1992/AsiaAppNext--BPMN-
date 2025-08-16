'use client';
import AddUser from '@/app/components/pages/UserManagement/Status/addUser';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const ArchiveAutomationPage = () => {
    return (
        <AddUser />
    )
}

export default WithAuth(ArchiveAutomationPage); 