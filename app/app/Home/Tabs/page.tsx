'use client';
import Search from '@/app/EndPoints-AsiaApp/Components/Pages/M_History/Tabs/MainContainer';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const HistorySearchPage = () => {
  return (
    <Search />
  )
}
export default WithAuth(HistorySearchPage); 
