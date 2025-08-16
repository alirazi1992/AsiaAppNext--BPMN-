'use client';
import RulesAndRegulation from '../../components/pages/RulesAndRegulation/RulesAndRegulation';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const RulesAndRegulationPage = () => {
  return (
    <RulesAndRegulation />
  )
}

export default WithAuth(RulesAndRegulationPage); 