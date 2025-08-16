'use client';
import { CardBody } from '@material-tailwind/react';
import React, { useContext } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { AuditContext } from './MainContainer';
import { Td, Th } from '../../Shared/TableComponent';
import { LogsModel } from '@/app/Domain/M_Audit/logTable';
import moment from 'jalali-moment';

const AuditList = () => {
  const themeMode = useStore(themeStore, (state) => state);
  const { result } = useContext(AuditContext)

  return (
    <>
      {result && result?.logs.length > 0 && <CardBody className='w-[98%] lg:w-[96%] mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
        <table dir="rtl" className={`w-full relative text-center ${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} `}>
          <thead>
            <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
              <Th value={'#'} />
              <Th value={'زمان'} />
              <Th value={'عامل'} />
              <Th value={'توضیحات'} />
            </tr>
          </thead>
          <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
            {result && result.logs.map((item: LogsModel, index: number) => {
              return (
                <tr key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                  <Td style={{ width: '5%' }} value={Number(index) + Number(1)} />
                  <Td style={{ width: '10%' }} value={moment(item.actionDate).format('HH:mm:ss jYYYY/jMM/jDD')} />
                  <Td style={{ width: '40%' }} value={item.actorName} />
                  <Td style={{ width: '40%' }} value={item.actionDesc ?? "-"} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody >}
    </>
  )
}
export default AuditList; 