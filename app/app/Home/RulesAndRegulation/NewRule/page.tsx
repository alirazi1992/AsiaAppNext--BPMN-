'use client';
import NewRule from '@/app/components/pages/RulesAndRegulation/NewRule';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const NewRulePage = () => {
  return (
      <NewRule />
  )
}

export default WithAuth(NewRulePage); 