'use client'
import { useParaphList } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchParaphsList'
import { initializeParaphState } from '@/app/Application-AsiaApp/Utils/M_Automation/NewDocument/data'
import { InitializeParaphStateModel, ParaphItemModel } from '@/app/Domain/M_Automation/NewDocument/Paraph'
import React, { useContext, useEffect, useRef, useState } from 'react';
import AddParaph from './AddParaph'
import ParaphList from './ParaphList'
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import Loading from '@/app/components/shared/loadingResponse';
import { InsertingParaph } from '@/app/Application-AsiaApp/M_Automation/NewDocument/InsertParaphtoList';
import { RemovingPraraph } from '@/app/Application-AsiaApp/M_Automation/NewDocument/RemoveParaph';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import { DataContext } from '../NewDocument-MainContainer';


const ParaphsMainContainer = () => {
    const { fetchParaphList } = useParaphList()
    const { RemoveParaphList } = RemovingPraraph()
    const { InsertParaph } = InsertingParaph()
    const [state, setState] = useState<InitializeParaphStateModel>(initializeParaphState)
    const [loadings, setLoadings] = useState(loading)
    const AddParaphRef = useRef<{ ResetMethod: () => void }>(null);
    const { docheapId, setParaphLength } = useContext(DataContext)

    useEffect(() => {
        const loadInitialList = async () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setLoadings((state) => ({ ...state, table: true }))
            const res = await fetchParaphList(docheapId!).then((result) => {
                if (result) {
                    setLoadings((state) => ({ ...state, table: false }))
                    if (Array.isArray(result)) {
                        setState((prev) => ({ ...prev, paraphsList: result }))
                        setParaphLength(result.length)
                    }
                }
            }
            )
        }
        loadInitialList()
    }, [])

    const handleRemoveParaph = async (id: number) => {
        setLoadings((state) => ({ ...state, response: true }))
        let index = state.paraphsList!.indexOf(state.paraphsList!.find((item) => item.id == id)!)
        const res = await RemoveParaphList(docheapId!, id).then((res) => {
            if (res) {
                setLoadings((state) => ({ ...state, response: false }))
                if (typeof res == 'number') {
                    index != -1 && state.paraphsList?.splice(index, 1)
                    setParaphLength((prev: number) => prev - 1)
                }
            }
        })
    }
    const handleAddParaph = async (data: ParaphItemModel) => {
        setLoadings((state) => ({ ...state, response: true }))
        const res = await InsertParaph(docheapId!, data).then((result) => {
            if (result) {
                setLoadings((state) => ({ ...state, response: false }));
                if (typeof result === 'object' && 'docParaphId' in result) {
                    setState((prev) => ({
                        ...prev, paraphsList: prev.paraphsList.length > 0 ? [...prev.paraphsList, {
                            id: result?.docParaphId,
                            contact: '',
                            desc: result.desc,
                            paraphDate: result?.date,
                            forwardDesc: '',
                            paraphType: result?.paraphType,
                            personalDesc: '',
                            writer: result?.writer
                        }] : [{
                            id: result?.docParaphId,
                            contact: '',
                            desc: result?.desc,
                            paraphDate: result?.date,
                            forwardDesc: '',
                            paraphType: result?.paraphType,
                            personalDesc: '',
                            writer: result?.writer
                        }]
                    }));
                    setParaphLength((prev: number) => prev + 1)
                }
                if (AddParaphRef.current) {
                    AddParaphRef.current.ResetMethod()
                }
            }
        })
    }




    return (
        <>
            {loadings.response == true && <Loading />}
            <section dir='rtl' className='grid grid-cols-1 md:grid-cols-5 my-4'>
                <section className='col-span-1'>
                    <AddParaph ref={AddParaphRef} onSubmit={handleAddParaph} />
                </section>
                {loadings.table == false ? <section className='col-span-4'>
                    <ParaphList removeParaphId={handleRemoveParaph} data={state.paraphsList} />
                </section> : <TableSkeleton />}
            </section>
        </>
    )
}

export default ParaphsMainContainer