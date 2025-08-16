'use client';
import React, { useRef, useState } from 'react';
import Addfilter from '@/app/EndPoints-AsiaApp/Components/Pages/M_HumanResource/Defects/filter'
import DefectsTable from '@/app/EndPoints-AsiaApp/Components/Pages/M_HumanResource/Defects/DefectsTable'
import { DefectanceModal } from '@/app/Domain/M_HumanRecourse/Defects';

const EducationCategory = () => {

  const [loading, setLoading] = useState(false);
  const [defectances, setDefectances] = useState<DefectanceModal[]>([]);
  const AddFilterRef = useRef<{ ResetMethod: () => void }>(null);

  return (
    <section className='p-1'>
      <Addfilter
        ref={AddFilterRef}
        setDefectances={setDefectances}
        setLoading={setLoading}
      />
      <DefectsTable data={defectances} loading={loading} />
    </section>
  )
}

export default EducationCategory

