'use client';
import Apply from '@/app/components/pages/RulesAndRegulation/Apply';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const NewRulePage = () => {
    return (
        <Apply />
    )
}

export default WithAuth(NewRulePage); 