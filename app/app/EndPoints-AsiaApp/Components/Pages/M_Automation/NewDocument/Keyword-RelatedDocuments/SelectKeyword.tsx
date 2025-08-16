'use client'
import { useDocKeywords, useKeywordsList } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchKeywordsList'
import { initializeKeywordsState } from '@/app/Application-AsiaApp/Utils/M_Automation/NewDocument/data'
import { InitializeStateModel, KeywordModel, SelectedKeywordsModel } from '@/app/Domain/M_Automation/NewDocument/Keywords'
import CreatableSelectComponenet from '@/app/EndPoints-AsiaApp/Components/Shared/CreatableSelect'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ActionMeta, MultiValue } from 'react-select'
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DataContext } from '../NewDocument-MainContainer'
import { useRemoveKeywords, useSaveKeywords } from '@/app/Application-AsiaApp/M_Automation/NewDocument/Keyword'
import InputSkeleton from '@/app/components/shared/InputSkeleton'

const SelectKeyword = () => {
    const { fetchDocKeywords } = useDocKeywords()
    const { fetchKeywords } = useKeywordsList()

    const { AddKeywordtoList } = useSaveKeywords()
    const { removeKeywordfromList } = useRemoveKeywords()
    const [state, setState] = useState<InitializeStateModel>(initializeKeywordsState)
    const schema = yup.object().shape({
        AddKeywords: yup.object(({
            keywordsList: yup.array().optional()
        })).required(),
    })
    const { docheapId, docTypeId } = useContext(DataContext)
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState,
        getValues,
        watch
    } = useForm<SelectedKeywordsModel>(
        {
            defaultValues: {
                AddKeywords: {
                    keywordsList: []
                },
            },
            mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;

    let recieversTimeOut: any;

    const loadKeywordsList = (
        searchKey: string,
        callback: (options: KeywordModel[] | undefined) => void
    ) => {
        clearTimeout(recieversTimeOut);
        recieversTimeOut = setTimeout(async () => {
            const result = await fetchKeywords(searchKey);
            if (Array.isArray(result)) {
                callback(result);
            } else {
                callback(undefined); // Ensure callback is called with undefined if result is not an array
            }
        }, 1000);
    };

    const loadInitialList = useCallback(async () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (docheapId !== null) {
            try {
                const result = await fetchDocKeywords(docheapId);
                if (result && Array.isArray(result)) {
                    setState({
                        selected: result.map((item) => ({
                            id: item.id,
                            label: item.title,
                            title: item.title,
                            value: item.id
                        })),
                    });
                }
            } catch (error) {
            
                console.error("Error fetching keywords:", error);
            }
        }
    }, [docheapId, fetchDocKeywords])
    useEffect(() => {
        { docheapId !== null && loadInitialList() }
    }, [])

    const handleKeyword = async (actionMeta: ActionMeta<KeywordModel>) => {
        if (actionMeta.action == 'select-option' || actionMeta.action == 'create-option') {
            const res = await AddKeywordtoList(actionMeta.option!.label, docheapId, docTypeId).then((result) => {
                if (result) {
                    if (typeof result == 'object' && 'keywordId' in result) {
                        let addedKeyword = {
                            id: result.docKeywordId,
                            label: result.title,
                            title: result.title,
                            value: result.docKeywordId
                        }
                        setState((prev) => ({
                            selected: [...prev.selected!, addedKeyword]
                        }))
                    }
                }
            })
        } else {
            const res = await removeKeywordfromList(actionMeta.removedValue!.id, docheapId, docTypeId).then((result) => {
                if (typeof result == 'boolean') {
                    let option = state.selected?.find(p => p.title == actionMeta.removedValue?.title)
                    let newSelected = [...state.selected ?? []]
                    let index = state.selected!.indexOf(option!)
                    newSelected.splice(index, 1)
                    setState(prev => ({ ...prev, selected: [...newSelected] }))
                }
            })
        }
    }

    return (
        <section className='grid grid-cols-1 ' >
            {state.selected !== undefined ? <div className='p-1 relative '>
                <CreatableSelectComponenet
                    className='z-[999999999999]'
                    cacheOptions={true}
                    placeholder="کلیدواژه ها"
                    onChange={(newValue: MultiValue<KeywordModel>, actionMeta: ActionMeta<KeywordModel>) => {
                        handleKeyword(actionMeta)
                        // const newKeyword = newValue.filter(opt => !state.selected?.some(prevOpt => prevOpt.value === opt.value))
                    }}
                    defaultValue={state.selected !== undefined ? state.selected?.length > 0 ? state.selected : null : null}
                    loadOptions={loadKeywordsList}
                    defaultOptions={undefined} />
            </div> : <InputSkeleton />}
        </section>
    )
}

export default SelectKeyword