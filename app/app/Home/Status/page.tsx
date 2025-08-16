'use client';
import Status from '../../components/pages/VesselsComponent/Status';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const StatusPage = () => {
  return (
    <Status />
  )
}

export default WithAuth(StatusPage); 