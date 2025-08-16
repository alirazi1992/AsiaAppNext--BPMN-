'use client';
import Resume from '@/app/EndPoints-AsiaApp/Components/Pages/M_HumanResource/MainContainer';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const ManageResume = () => {
    return (
        <Resume />
    )
}
export default WithAuth(ManageResume); 