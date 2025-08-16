'use client';
import Defects from '@/app/EndPoints-AsiaApp/Components/Pages/M_HumanResource/Defects/Defects-MainContainer';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const CategoriesPage = () => {
  return (
    <Defects />
  )
}

export default WithAuth(CategoriesPage); 