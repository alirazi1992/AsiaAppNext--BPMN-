'use client';
import Details from '@/app/components/pages/UserManagement/AcsUsers/BaseInfoManagement/Details';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const BaseInfoDetailsPage = () => {
    return (
        <Details />
    )
}

export default WithAuth(BaseInfoDetailsPage); 