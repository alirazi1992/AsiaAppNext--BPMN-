'use client';
import SearchAutomation from '@/app/EndPoints-AsiaApp/Components/Pages/M_Search/MainContainer';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const SearchAutomationPage = () => {
  return (
    <SearchAutomation />
  )
}

export default WithAuth(SearchAutomationPage); 