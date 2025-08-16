'use client';
import Audit from '@/app/EndPoints-AsiaApp/Components/Pages/M_Audit/MainContainer';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const AuditPage = () => {
  return (
      <Audit />
  )
}

export default WithAuth(AuditPage); 