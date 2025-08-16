'use client';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui'
import { CloseIcon } from '@/app/EndPoints-AsiaApp/Components/Shared/IconComponent'
import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react'
import React, { forwardRef, useContext, useImperativeHandle, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonComponent from '@/app/components/shared/ButtonComponent';
import { InsertingDocumenttoDrafts } from '@/app/Application-AsiaApp/M_Automation/NewDocument/InsertDoctoDrafts';
import { DataContext } from '../NewDocument-MainContainer';
import { GetDocumentDataModel } from '@/app/Domain/M_Automation/NewDocument/NewDocument';
import { LoadingModel } from '@/app/Domain/shared';
// import Textarea from '@mui/joy/Textarea';
import { Documents } from '@/app/Application-AsiaApp/M_Automation/NewDocument/setDocumentState';


const ReplyDocument = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [open, setOpen] = useState<boolean>(false)
    const [item, setItem] = useState<{ title: string, stateId: number }>({ title: '', stateId: 0 })
    const { forwardParentId, docheapId, setLoadings } = useContext(DataContext)
    const handleOpen = () => setOpen(!open)
    const { SetDocState } = Documents()

    useImperativeHandle(ref, () => ({
        handleOpenReply: () => {
            handleOpen()
        },
        setItems: (title: string, stateId: number) => {
            setItem({ title: title, stateId: stateId })
        }
    }))
    const schema = yup.object().shape({
        description: yup.string().nonNullable().notRequired(),
    })

    const {
        register,
        handleSubmit,
        reset,
        trigger,
        getValues,
        setValue,
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
        const res = await SetDocState(forwardParentId, item.stateId, docheapId, data.description ?? '').then((result) => {
            setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
            if (result) {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
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
                        {item.title}
                        <CloseIcon onClick={() => handleOpen()} />
                    </DialogHeader>
                    <DialogBody className='w-full overflow-y-auto' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <form
                            dir='rtl'
                            onSubmit={handleSubmit(OnSubmit)}
                            className='relative z-[10]'>
                            <div className='p-1 relative'>
                                <textarea
                                    onFocus={(e) => e.target.rows = 4} rows={1}
                                    {...register(`description`)}
                                    className={errors?.description ? `${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400` : `${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused`}
                                    placeholder="توضیحات..."
                                />
                            </div>
                            <ButtonComponent type='submit'>تائید</ButtonComponent>
                        </form>
                    </DialogBody>
                </Dialog>
            </>
        </MyCustomComponent>
    )
})

ReplyDocument.displayName = 'ReplyDocument'
export default ReplyDocument
