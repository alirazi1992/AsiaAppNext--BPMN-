'use client';
import InitializeProject from '../../components/pages/ProjectManagement/InitializeProject';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const AuditPage = () => {
  return (

    <InitializeProject />

  )
}

export default WithAuth(AuditPage); 