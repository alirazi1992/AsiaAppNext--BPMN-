'use client';
import Info from '@/app/components/pages/VesselsComponent/Info';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const StatusPage = () => {
    return (
            <Info />
    )
}

export default WithAuth(StatusPage); 