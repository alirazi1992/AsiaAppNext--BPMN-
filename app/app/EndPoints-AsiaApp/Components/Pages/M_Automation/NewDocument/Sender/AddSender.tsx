'use client'
import { useList } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchReceiversName';
import { GetReceiversModel } from '@/app/Domain/M_Automation/NewDocument/Receivers';
import CustomAsyncSelect from '@/app/EndPoints-AsiaApp/Components/Shared/AsyncSelect'
import React, { useContext } from 'react';
import { DataContext, ReceiversType } from '../NewDocument-MainContainer';
import { ActionMeta, MultiValue } from 'react-select';

const AddSender = () => {
    const { docTypeId, receivers, setReceivers } = useContext(DataContext)

    const { fetchReceiversList } = useList()
    let recieversTimeOut: any;
    const loadMainReceiverList = (
        searchKey: string,
        callback: (options: GetReceiversModel[] | undefined) => void
    ) => {
        clearTimeout(recieversTimeOut);
        recieversTimeOut = setTimeout(async () => {
            const result = await fetchReceiversList(searchKey, docTypeId == '1' ? 1 : 22);
            if (Array.isArray(result)) {
                callback(result);
            } else {
                callback(undefined); // Handle the case where result is not an array
            }
        }, 1000);
    };

    return (
        <CustomAsyncSelect
            className='z-[888888]'
            cacheOptions={true}
            defaultOptions={true}
            placeholder="فرستنده"
            loadOptions={loadMainReceiverList}
            onChange={(option: MultiValue<GetReceiversModel>, actionMeta: ActionMeta<GetReceiversModel>) => {
                setReceivers((prev: ReceiversType) => {
                    const newReceivers = option.filter(opt => !prev.senders!.some(prevOpt => prevOpt.Id === opt.value)).map((item) => {
                        return {
                            ActionId: undefined,
                            ActionName: undefined,
                            Description: null,
                            EnValue: item.EnValue,
                            Id: item.Id,
                            Level: item.Level,
                            Value: item.Value
                        }
                    });
                    return { ...prev, senders: [...prev.senders!, ...newReceivers] };
                });
            }}
        />
    )
}

export default AddSender