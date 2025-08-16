'use client';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react'
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import useStore from "@/app/hooks/useStore";
import themeStore from '@/app/zustandData/theme.zustand';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import { GetCategoriesListModel } from '@/app/Domain/M_Education/Courses';
import { ActionMeta, SingleValue } from 'react-select';
import { CloseIcon } from '@/app/EndPoints-AsiaApp/Components/Shared/IconComponent';
import { GetDocLayouts, GetPrintModel } from '@/app/Domain/M_Automation/NewDocument/toolbars';
import { DataContext } from '../NewDocument-MainContainer';
import { useLayouts } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchDocLayouts';
import SelectOption from '@/app/EndPoints-AsiaApp/Components/Shared/SelectOption';
import ButtonComponent from '@/app/components/shared/ButtonComponent';
import { GetDocumentDataModel } from '@/app/Domain/M_Automation/NewDocument/NewDocument';
import { usePdf } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchDocumentPdf';
import ViewDocument from './ViewDocument';
import { LoadingModel } from '@/app/Domain/shared';
import Loading from '@/app/components/shared/loadingGetData';
import InputSkeleton from '@/app/components/shared/InputSkeleton';

const PrintDocument = forwardRef((props: any, ref) => {

    const themeMode = useStore(themeStore, (state) => state);
    const { docheapId, templateId, docTypeId, state, setState, setLoadings, loadings } = useContext(DataContext)
    const [open, setOpen] = useState<boolean>(false)
    const [layouts, setLayouts] = useState<GetDocLayouts[] | undefined>(undefined)
    const [data, setData] = useState<string>('')
    const { fetchDocumentPdf } = usePdf()
    const handleOpen = () => setOpen(!open)
    const { fetchDocLayoutes } = useLayouts()
    const ViewRef = useRef<{ handleOpen: () => void }>(null)
    const schema = yup.object().shape({
        layoutSize: yup.number().required('اجباری'),
    })

    const {
        register,
        handleSubmit,
        reset,
        trigger,
        getValues,
        setValue,
        formState,
    } = useForm<GetPrintModel>(
        {
            defaultValues: {
                layoutSize: Number(state.documentData?.find((item: GetDocumentDataModel) => item.fieldName === "TemplateId")?.fieldValue)
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    useEffect(() => {
        setValue('layoutSize', Number(state.documentData?.find((item: GetDocumentDataModel) => item.fieldName === "TemplateId")?.fieldValue))
    }, [state.documentData])


    const OnSubmit = async (data: GetPrintModel) => {
        handleOpen()
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        if (!errors.layoutSize) {
            const res = await fetchDocumentPdf(docheapId, data.layoutSize, docTypeId).then((result) => {
                if (result) {
                    setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                    if (typeof result == 'string') {
                        setData(result)
                        ViewRef.current ? ViewRef.current.handleOpen() : undefined
                    }
                    setValue('layoutSize', Number(state.documentData?.find((item: GetDocumentDataModel) => item.fieldName === 'TemplateId')?.fieldValue))
                }
            })
        }
    }

    useEffect(() => {
        const loadLayoutes = async () => {
            const res = await fetchDocLayoutes(docTypeId).then((result) => {
                if (result) {
                    if (Array.isArray(result)) {
                        setLayouts(result.map((item) => {
                            return {
                                id: item.id,
                                name: item.name,
                                path: item.path,
                                isMain: item.isMain,
                                label: item.name,
                                value: item.id
                            }
                        }))
                    }
                }
            })
            setState((prev: any) => ({ ...prev, layoutId: templateId }))
        }
        loadLayoutes()
    }, [docTypeId, setState, templateId])

    useImperativeHandle(ref, () => ({
        handleOpenPrint: () => {
            handleOpen()
        },
    }));


    return (
        <MyCustomComponent>
            <>
                <Dialog dir='rtl'
                    dismiss={{
                        escapeKey: true, referencePress: true, referencePressEvent: 'click', outsidePress: false, outsidePressEvent: 'click', ancestorScroll: false, bubbles: true
                    }} size='sm' className={`absolute aspect-video top-0  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                    {loadings.response == true && <Loading />}
                    <DialogHeader className={` flex justify-between ${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'} `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        خروجی pdf
                        <CloseIcon onClick={() => { handleOpen(), setValue('layoutSize', Number(state.documentData?.find((item: GetDocumentDataModel) => item.fieldName === 'TemplateId')?.fieldValue)) }} />
                    </DialogHeader>
                    <form
                        dir='rtl'
                        onSubmit={handleSubmit(OnSubmit)}
                        className='p-2'
                    >
                        <DialogBody className='w-full' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {layouts !== undefined ?
                                <SelectOption
                                    isRtl={false}
                                    className='w-full'
                                    {...register(`layoutSize`)}
                                    placeholder={'Select LayoutSize'}
                                    loading={layouts != undefined ? false : true}
                                    maxHeight={380}
                                    errorType={errors?.layoutSize}
                                    value={layouts!.find((item) => item.id == getValues('layoutSize')) ? layouts?.find((item) => item.id == getValues('layoutSize')) : null}
                                    onChange={(option: SingleValue<GetCategoriesListModel>, actionMeta: ActionMeta<GetCategoriesListModel>) => {
                                        setValue(`layoutSize`, option!.id)
                                        trigger(`layoutSize`)
                                        // setState((prev: InitializeStateModel) => ({ ...prev, layoutId: option!.id }))
                                    }}
                                    options={layouts == undefined ? [{
                                        id: 0, value: 0, label: 'no option found',
                                        faName: 'no option found',
                                        name: 'no option found'
                                    }] : layouts}
                                /> : <InputSkeleton />}
                            <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.layoutSize && errors?.layoutSize?.message}</label>
                        </DialogBody>
                        <DialogFooter className={`flex flex-col w-full absolute bottom-0 left-0 z-[0] + ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                            <ButtonComponent type='submit'>تائید</ButtonComponent>
                        </DialogFooter>
                    </form>
                </Dialog>
                <ViewDocument ref={ViewRef} data={data!} />
            </>
        </MyCustomComponent>
    )
})

PrintDocument.displayName = 'PrintDocument'
export default PrintDocument