'use client';
import SelectOption from '@/app/EndPoints-AsiaApp/Components/Shared/SelectOption';
import React, { forwardRef, useContext, useImperativeHandle, useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { relationOptions } from '@/app/Application-AsiaApp/Utils/M_Automation/NewDocument/data';
import * as yup from "yup";
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ActionMeta, SingleValue } from 'react-select';
import { InitializeStateModel } from '@/app/Domain/searchDocs';
import { LoadingModel, SelectOptionModel } from '@/app/Domain/shared';
import { AddRelationYupModel } from '@/app/Domain/M_Automation/NewDocument/Keywords';
import { Dialog, DialogBody, DialogFooter, DialogHeader, IconButton } from '@material-tailwind/react';
import ButtonComponent from '@/app/components/shared/ButtonComp';
import { SearchDocContext } from '@/app/EndPoints-AsiaApp/Components/Shared/SearchDocs/MainContainer';
import { CloseIcon } from '@/app/EndPoints-AsiaApp/Components/Shared/IconComponent';
import { InsertingRelationDoc } from '@/app/Application-AsiaApp/M_Automation/NewDocument/InsertRelationDocument';
import { DataContext } from '../NewDocument-MainContainer';
import { KeywordsContext } from './MainContainers';

const SelectRelationType = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open)
    const [relatedDocHeapId, setRelatedDocHeapId] = useState<number>(0)
    const { state, setState, DialogRef } = useContext(SearchDocContext)
    const { docheapId, setLoadings } = useContext(DataContext)
    const { relatedDocs, setRelatedDocs } = useContext(KeywordsContext)
    const { InsertRelation } = InsertingRelationDoc()
    const schema = yup.object().shape({
        AddRelation: yup.object(({
            RelationDoc: yup.object().required('انتخاب نوع ارتباط اجباری میباشد')
        })).required(),
    })
    const {
        register,
        handleSubmit,
        reset,
        trigger,
        getValues,
        watch,
        setValue,
        formState,
    } = useForm<AddRelationYupModel>(
        {
            defaultValues: {
                AddRelation: {
                    RelationDoc: null
                },
            }, mode: 'all',
            resolver: yupResolver(schema) as unknown as Resolver<AddRelationYupModel>
        }
    );
    const errors = formState.errors;

    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            handleOpen()
        },
        setDocHeapId: (docheapId: number) => {
            setRelatedDocHeapId(docheapId)
        }
    }));

    const OnSubmit = (data: AddRelationYupModel) => {
        if (!errors.AddRelation) {
            const res = InsertRelation(docheapId, relatedDocHeapId, data.AddRelation.RelationDoc!.value, state.isNext).then((result) => {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
                if (result) {
                    setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                    handleOpen()
                    if (typeof result === 'object' && 'relationId' in result) {
                        setRelatedDocs([...relatedDocs, {
                            id: result.relationId,
                            createDate: null,
                            relatedDocHeapId: result.relatedDocHeapId,
                            isNext: state.isNext,
                            docRelationType: result.relationType,
                            relatedDocIndicator: result.relatedIndicator,
                            docTypeId: result.docTypeId,
                            docTypeTitle: result.docTypeTitle
                        }])
                        if (DialogRef.current) {
                            DialogRef.current.handleOpen()
                        }
                        // setState((prev: InitializeStateModel) => ({ ...prev, docs: [] }))
                    }

                }
            })
        }
    }

    return (
        <Dialog dismiss={{ escapeKey: true, referencePress: true, referencePressEvent: 'click', outsidePress: false, outsidePressEvent: 'click', ancestorScroll: false, bubbles: true }}
            size='sm' className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} absolute top-0 min-h-[50vh] `} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between sticky top-0 left-0 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                انتخاب نوع ارتباط
                <CloseIcon onClick={() => { handleOpen() }} />
            </DialogHeader>
            <DialogBody className='w-full' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                    onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10]'>
                    <div className='p-1 relative'>
                        <SelectOption
                            isRtl
                            loading={relationOptions != undefined ? false : true}
                            {...register(`AddRelation.RelationDoc`)}
                            placeholder={'Select Relation type'}
                            errorType={errors?.AddRelation?.RelationDoc}
                            onChange={(option: SingleValue<SelectOptionModel<number>>, actionMeta: ActionMeta<SelectOptionModel<number>>) => {
                                setValue(`AddRelation.RelationDoc`, option!);
                                trigger(`AddRelation.RelationDoc`);
                            }}
                            options={relationOptions == undefined ? [{
                                id: 0, value: 0, label: 'no option found',
                                name: 'no option found'
                            }] : relationOptions}
                        />
                        <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.AddRelation?.RelationDoc && errors?.AddRelation?.RelationDoc?.message}</label>
                    </div>
                    <DialogFooter className='w-full flex flex-row flex-nowrap justify-evenly items-center' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <ButtonComponent type='submit'>تائید</ButtonComponent>
                    </DialogFooter>
                </form>
            </DialogBody>
        </Dialog>
    )
})
SelectRelationType.displayName = 'SelectRelationType'
export default SelectRelationType