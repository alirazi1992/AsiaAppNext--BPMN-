
'use client';
import Cartable from '../../components/pages/Automation/Cartable/Cartable';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const CartablePage = () => {
  return (
    <Cartable />
  )
}
export default WithAuth(CartablePage); 