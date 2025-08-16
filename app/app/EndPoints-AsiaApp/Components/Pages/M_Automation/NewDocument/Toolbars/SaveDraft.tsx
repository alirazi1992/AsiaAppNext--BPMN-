'use client';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui'
import { CloseIcon } from '@/app/EndPoints-AsiaApp/Components/Shared/IconComponent'
import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react'
import React, { forwardRef, useContext, useImperativeHandle, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonComponent from '@/app/components/shared/ButtonComponent';
import { InsertingDocumenttoDrafts } from '@/app/Application-AsiaApp/M_Automation/NewDocument/InsertDoctoDrafts';
import { TextField } from '@mui/material';
import { DataContext } from '../NewDocument-MainContainer';
import { GetDocumentDataModel } from '@/app/Domain/M_Automation/NewDocument/NewDocument';
import { LoadingModel } from '@/app/Domain/shared';
import TextFieldItem from '@/app/EndPoints-AsiaApp/Components/Shared/TextFieldItem';

const SaveDraft = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const [open, setOpen] = useState<boolean>(false)
    const { state, setLoadings } = useContext(DataContext)
    const handleOpen = () => setOpen(!open)
    const { SaveDocumenttoDraft } = InsertingDocumenttoDrafts()

    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            handleOpen()
        }
    }))
    const schema = yup.object().shape({
        draftName: yup.string().nonNullable().notRequired(),
    })

    const {
        register,
        handleSubmit,
        reset,
        trigger,
        getValues,
        setValue,
        formState,
    } = useForm<{ draftName?: string | null }>(
        {
            defaultValues: {
                draftName: ''
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    const OnSubmit = async (data: { draftName?: string | null }) => {
        handleOpen()
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        const res = await SaveDocumenttoDraft(JSON.parse(state.documentData.find((item: GetDocumentDataModel) => item.fieldName == "Passage")?.fieldValue as string).FileId, data.draftName ?? '').then((result) => {
            if (result) {
                reset()
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
            }
        })
    }

    return (
        <MyCustomComponent>
            <>
                <Dialog
                    dismiss={{
                        escapeKey: true, referencePress: true, referencePressEvent: 'click', outsidePress: false, outsidePressEvent: 'click', ancestorScroll: false, bubbles: true
                    }} size='sm' className={`absolute top-0  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                    <DialogHeader dir='rtl' className={` flex justify-between sticky top-0 left-0 z-[555555] ${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ذخیره پیش نویس
                        <CloseIcon onClick={() => handleOpen()} />
                    </DialogHeader>
                    <DialogBody className='w-full overflow-y-auto' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <form
                            dir='rtl'
                            onSubmit={handleSubmit(OnSubmit)}
                            className='relative z-[10]'>
                            <div className='p-1 relative'>
                                <TextFieldItem label="عنوان" register={{ ...register(`draftName`) }} tabIndex={1} />
                            </div>
                            <ButtonComponent type='submit'>تائید</ButtonComponent>
                        </form>
                    </DialogBody>
                </Dialog>
            </>
        </MyCustomComponent>
    )
})

SaveDraft.displayName = 'SaveDraft'
export default SaveDraft