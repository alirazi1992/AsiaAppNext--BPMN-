'use client';
import EditInfoList from '../../components/pages/EditInformation/EditInfo';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const EditInformationPage = () => {
  return (
      <EditInfoList />
  )
}
export default WithAuth(EditInformationPage); 