'use client';
import ApproveCertificate from '@/app/EndPoints-AsiaApp/Components/Pages/M_Education/ApproveCertificate/ApprovingCertificateTable';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const ArchiveAutomationPage = () => {
    return (
        <ApproveCertificate />
    )
}

export default WithAuth(ArchiveAutomationPage); 