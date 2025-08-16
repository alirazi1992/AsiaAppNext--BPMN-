
'use client';
import EnterDate from '@/app/EndPoints-AsiaApp/Components/Pages/M_TimeSheet/EnterDate/EnterData-MainContainer'
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC';
const EnterDatePage = () => {
  return (
    <EnterDate />
  )
}

export default WithAuth(EnterDatePage); 