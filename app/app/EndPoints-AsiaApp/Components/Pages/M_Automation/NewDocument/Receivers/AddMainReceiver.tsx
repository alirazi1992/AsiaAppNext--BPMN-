'use client'
import { useList } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchReceiversName';
import { GetMainReceiver, GetReceiversModel } from '@/app/Domain/M_Automation/NewDocument/Receivers';
import CustomAsyncSelect from '@/app/EndPoints-AsiaApp/Components/Shared/AsyncSelect'
import React, { useContext } from 'react';
import { DataContext, ReceiversType } from '../NewDocument-MainContainer';
import { ActionMeta, MultiValue } from 'react-select';
import MainReceiver from './MainReceiver';

const AddMainReceiver = () => {
  const { docTypeId, setReceivers } = useContext(DataContext)
  const { fetchReceiversList } = useList()
  let recieversTimeOut: any;
  const loadMainReceiverList = (
    searchKey: string,
    callback: (options: GetReceiversModel[] | undefined) => void
  ) => {
    clearTimeout(recieversTimeOut);
    recieversTimeOut = setTimeout(async () => {
      const result = await fetchReceiversList(searchKey, docTypeId == '1' ? 1 : 22)!;
      if (Array.isArray(result)) {
          callback(result);
      } else {
          callback(undefined); // Ensure callback is called with undefined if result is not an array
      }
    }, 1000);
  };

  return (
    <CustomAsyncSelect
      className='z-[999999999999]'
      cacheOptions={true}
      defaultOptions={true}
      placeholder="گیرندگان اصلی"
      loadOptions={loadMainReceiverList}
      onChange={(option: MultiValue<GetReceiversModel>, actionMeta: ActionMeta<GetReceiversModel>) => {
        {
          setReceivers((prev: ReceiversType) => {
            const newReceivers = option.filter(opt => !prev.mainReceivers.some(prevOpt => prevOpt.Id === opt.value)).map((item) => {
              return {
                ActionId: 1,
                ActionName: 'جهت امضاء',
                Description: null,
                EnValue: item.EnValue,
                Id: item.Id,
                Level: item.Level,
                Value: item.Value
              }
            });
            return { ...prev, mainReceivers: [...prev.mainReceivers, ...newReceivers] };
          });
        }
      }}
    />
  )
}

export default AddMainReceiver