'use client';
import SearchVessel from '@/app/components/pages/RulesAndRegulation/SearchVessels';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const SearchVesselPage = () => {
    return (
        <SearchVessel />
    )
}

export default WithAuth(SearchVesselPage); 