
'use client';
import Report from '@/app/EndPoints-AsiaApp/Components/Pages/M_TimeSheet/Report/Report-MainContainer';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const ReportPage = () => {
    return (
        <Report />
    )
}
export default WithAuth(ReportPage);