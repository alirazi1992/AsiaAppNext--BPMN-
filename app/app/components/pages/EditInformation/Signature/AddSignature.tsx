
'use client';
import React, { useContext, useRef } from 'react';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { Button, CardBody, Tooltip } from '@material-tailwind/react';
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { AddSignatureFile } from '@/app/models/HR/models';
import { SignatureContext } from './MainContainer';
import { InsertingSignature } from '@/app/Application-AsiaApp/M_HumanRecourse/InsertSignaturetoList';
import useLoginUserInfo from '@/app/zustandData/useLoginUserInfo';
import UpdateUserStore from '@/app/zustandData/updateUsers';
import { GetUserSignaturesResulltModel } from '@/app/Domain/M_HumanRecourse/UserProfile';
const AddSignature = () => {
    const CurrentUser = useLoginUserInfo.getState();
    const User = UpdateUserStore.getState();
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const { setList, setLoading } = useContext(SignatureContext)

    const { AddSignaturetoList } = InsertingSignature()

    const schema = yup.object().shape({
        attachmentFile: yup.string().required('فایل امضاء اجباری'),
        attachmentType: yup.string().required('نوع فایل اجباری'),
        attachmentName: yup.string().required('نام فایل اجباری')
    });


    const {
        register,
        handleSubmit,
        setValue,
        reset,
        resetField,
        formState: { errors },
        trigger,
    } = useForm<AddSignatureFile>(
        {
            defaultValues: {
                attachmentFile: '',
                attachmentType: '',
                attachmentName: ''

            }, mode: 'onChange',
            resolver: yupResolver(schema)
        }
    );

    const fileRef = useRef() as any;
    const handleFile = async () => {
        const file = fileRef.current?.files && fileRef.current?.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                let base64String = reader!.result!.toString();
                base64String = base64String.split(",")[1];
                setValue(`attachmentName`, fileRef.current.files[0]?.name);
                setValue(`attachmentType`, file.type);
                setValue(`attachmentFile`, base64String);
                trigger([`attachmentName`, `attachmentType`, `attachmentFile`])
            }
        }
    }

    const OnSubmit = async (data: AddSignatureFile) => {
        setLoading(true)
        let id = User && User.userId ? User.userId : CurrentUser.userInfo.actors[0].userId 
        const res = await AddSignaturetoList(data.attachmentName, data.attachmentFile, data.attachmentType, id).then((result) => {
            setLoading(false)
            if (result && result !== 0) {
                setList((prev: GetUserSignaturesResulltModel[]) => ([...prev, { id: result, title: data.attachmentName, fileType: data.attachmentType }
                ]))
                reset()
                resetField('attachmentFile')
                resetField('attachmentName')
                resetField('attachmentType')
            }
        })
    }

    return (
        <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} h-full mx-auto `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <form
                dir='rtl'
                onSubmit={handleSubmit(OnSubmit)}
                className='relative z-[10]'>
                <div className="w-max ">
                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save Personnel Files' placement="top">
                        <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <SaveIcon className='p-1' />
                        </Button>
                    </Tooltip>
                </div>
                <section className='grid grid-cols-1 md:grid-cols-3 md:gap-y-5 my-2'>
                    <div className='p-1 relative'>
                        <input type='file' autoComplete='off'
                            {...register(`attachmentFile`)}
                            ref={fileRef}
                            onChange={async () => await handleFile()}
                            className={errors?.attachmentFile ? `${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400 ` : `${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused `} />
                        <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.attachmentFile?.message}</label>
                    </div>
                </section>
            </form>
        </CardBody>
    )
}

export default AddSignature