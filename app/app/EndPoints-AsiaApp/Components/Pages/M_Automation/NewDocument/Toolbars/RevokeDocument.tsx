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
import { DataContext } from '../NewDocument-MainContainer';
import { LoadingModel } from '@/app/Domain/shared';
import TextFieldItem from '@/app/EndPoints-AsiaApp/Components/Shared/TextFieldItem';
import { RevokeDocs } from '@/app/Application-AsiaApp/M_Automation/NewDocument/RevokeDocument';
import { GetDocumentDataModel } from '@/app/Domain/M_Automation/NewDocument/NewDocument';

const RevokeDocumentComponent = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const [open, setOpen] = useState<boolean>(false)
    const { docTypeId, docheapId, setLoadings, state, setState } = useContext(DataContext)
    const handleOpen = () => setOpen(!open)
    const { RevokeDocument } = RevokeDocs()

    useImperativeHandle(ref, () => ({
        handleOpenRevoke: () => {
            handleOpen()
        }
    }))
    const schema = yup.object().shape({
        description: yup.string().nonNullable().notRequired(),
    })

    const {
        register,
        handleSubmit,
        reset,
        formState,
    } = useForm<{ description?: string | null }>(
        {
            defaultValues: {
                description: ''
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    const OnSubmit = async (data: { description?: string | null }) => {
        handleOpen()
        const res = await RevokeDocument(docTypeId, docheapId, data.description ?? '').then((result) => {
            setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
            if (result) {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                let option = state.documentData.find((item: GetDocumentDataModel) => item.fieldName == 'IsRevoked')
                let index = state?.documentData.indexOf(option)
                state?.documentData.splice(index, 1, {
                    ...option,
                    fieldValue: "True"
                })
                reset()
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
                        ابطال مدرک
                        <CloseIcon onClick={() => handleOpen()} />
                    </DialogHeader>
                    <DialogBody className='w-full overflow-y-auto' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <form
                            dir='rtl'
                            onSubmit={handleSubmit(OnSubmit)}
                            className='relative z-[10]'>
                            <div className='p-1 relative'>
                                <TextFieldItem label="توضیحات ابطال مدرک" register={{ ...register(`description`) }} tabIndex={1} />
                            </div>
                            <ButtonComponent type='submit'>تائید</ButtonComponent>
                        </form>
                    </DialogBody>
                </Dialog>
            </>
        </MyCustomComponent>
    )
})

RevokeDocumentComponent.displayName = 'RevokeDocumentComponent'
export default RevokeDocumentComponent