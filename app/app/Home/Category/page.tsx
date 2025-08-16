'use client';
import Category from '@/app/EndPoints-AsiaApp/Components/Pages/M_Education/Categories/Category-MainContainer';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const CategoriesPage = () => {
  return (
    <Category />
  )
}

export default WithAuth(CategoriesPage); 