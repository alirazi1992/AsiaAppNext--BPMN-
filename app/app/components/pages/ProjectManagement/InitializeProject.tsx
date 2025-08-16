'use client';
import React, { useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import ViewTable from './ViewTables';
import useStore from '@/app/hooks/useStore';
import Loading from '@/app/components/shared/loadingResponse';
import CustomerSearch from './CustomerSearch';

const InitializeProjectComponent = () => {
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const handleLoadingState = (state: boolean) => {
    setLoadingState(state);
  };
  return (
    <>
      {loadingState == true && <Loading />}
      <CustomerSearch loadingState={handleLoadingState} />
      <ViewTable loadingState={handleLoadingState} />
    </>
  )
}

export default InitializeProjectComponent; 