'use client'
import { useForwardReceivers } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchForwardReceivers';
import { GetForwardRecieversModel } from '@/app/Domain/M_Automation/NewDocument/toolbars';
import SelectOption from '@/app/EndPoints-AsiaApp/Components/Shared/SelectOption';
import React, { useContext, useEffect, useState } from 'react';
import { ActionMeta, MultiValue } from 'react-select';
import { ReceiversContext } from './MainContainer';

const SelectForwardReceiver = () => {
    const { fetchForwardReceivers } = useForwardReceivers()
    const { setForwardReceivers, forwardReceivers } = useContext(ReceiversContext)
    const [receivers, setReceivers] = useState<GetForwardRecieversModel[]>([])

    useEffect(() => {
        const loadForwardReceivers = async () => {
            const res = await fetchForwardReceivers().then((result) => {
                if (result) {
                    if (Array.isArray(result)) {
                        setReceivers(result.map((item: GetForwardRecieversModel) => ({
                            ...item,
                            desc: '',
                            actorName: item.title,
                            isChecked: false,
                            IsGroup: false,
                            isHidden: false,
                            receiveTypeId: 1,
                            value: item.actorId,
                            label: item.title
                        })))
                    } else {
                        setReceivers([])
                    }
                }
            })
        }
        loadForwardReceivers()
    }, [])


    return (
        <section dir='rtl' className='my-4'>
            <SelectOption
                isRtl={false}
                isMulti={true}
                className='w-full z-[999999999]'
                placeholder={'گیرندگان ارجاع'}
                loading={receivers != undefined ? false : true}
                onChange={(option: MultiValue<GetForwardRecieversModel>, actionMeta: ActionMeta<GetForwardRecieversModel>) => {
                    if (actionMeta.option) {
                        setForwardReceivers((prev: GetForwardRecieversModel[]) => {
                            const newReceivers = option.filter((opt: GetForwardRecieversModel) => !prev.some(prevOpt => prevOpt.actorId === opt.actorId));
                            return [...prev, ...newReceivers];
                        })
                    } else if (actionMeta.removedValue?.actorId) {
                        let newList = [...forwardReceivers]
                        newList.splice(forwardReceivers.indexOf(actionMeta.removedValue), 1)
                        setForwardReceivers([...newList])
                    }
                }}
                options={receivers == undefined ? [{
                    id: 0, value: 0, label: 'no option found',
                    faName: 'no option found',
                    name: 'no option found'
                }] : receivers}
            />
        </section>
    )
}

export default SelectForwardReceiver