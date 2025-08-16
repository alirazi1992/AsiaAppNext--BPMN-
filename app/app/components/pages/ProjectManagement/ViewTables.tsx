
'use client';
import { CardBody } from '@material-tailwind/react';
import React, { useState } from 'react';
import themeStore from '../../../zustandData/theme.zustand';
import OrderServicesTable from './OrderServicesTable';
import JobsTable from './JobsTable';
import useStore from './../../../hooks/useStore';
const ViewTable = ({ loadingState }: any) => {
  
   
  const themeMode = useStore(themeStore, (state) => state);
  return (  
    <CardBody className={"w-[98%]  mx-auto "}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <JobsTable loadingJobs={loadingState} />
      <OrderServicesTable loadingJobs={loadingState} />
    </CardBody>
  )
}

export default ViewTable; 