'use client';
import { Button, Dialog, DialogBody, DialogHeader, IconButton, Tooltip } from '@material-tailwind/react'
import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import useStore from "@/app/hooks/useStore";
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import SaveIcon from '@mui/icons-material/Save';
import { AddCategoryModel, UpdateCategoryProps } from '@/app/Domain/M_Education/Categories';
import { TextField } from '@mui/material';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';

const UpdateCategory = forwardRef(({ category, onSubmit }: UpdateCategoryProps, ref) => {
    const color = useStore(colorStore, (state) => state);
    const themeMode = useStore(themeStore, (state) => state);
    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open)
    const schema = yup.object().shape({
        AddCategory: yup.object(({
            name: yup.string().required('عنوان انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faName: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
        })).required(),
    })

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState,
    } = useForm<AddCategoryModel>(
        {
            defaultValues: {
                AddCategory: {
                    faName: category?.faName,
                    name: category?.name,
                    id: category?.id
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;

    const OnSubmit = (data: AddCategoryModel) => {
        if (!errors.AddCategory) {
            onSubmit(data.AddCategory)
            handleOpen()
            reset()
        }
    }

    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            handleOpen()
        }
    }))

    useEffect(() => {
        setValue('AddCategory', {
            faName: category?.faName ?? '',
            name: category?.name ?? '',
            id: category?.id
        })
    }, [category, setValue])

    return (
        <MyCustomComponent>
            <>
            <Dialog 
                    dismiss={{
                        escapeKey: true,
                        referencePress: true,
                        referencePressEvent: 'click',
                        outsidePress: false,
                        outsidePressEvent: 'click',
                        ancestorScroll: false,
                        bubbles: true
                    }}
                    size='sm' className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} absolute top-0 min-h-[50vh]`} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between sticky top-0 left-0`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <IconButton variant="text" color="blue-gray" onClick={() => handleOpen()}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </IconButton>
                    Update Course Category
                </DialogHeader>
                <DialogBody className='w-full'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <form
                        dir='rtl'
                        onSubmit={handleSubmit(OnSubmit)}
                        className='relative z-[10]'>
                        <div className="w-max ">
                            <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Course Category' placement="top">
                                <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <SaveIcon className='p-1' />
                                </Button>
                            </Tooltip>
                        </div>
                        <section className='grid grid-cols-1 gap-x-1 gap-y-5 my-2'>
                            <div className='p-1 relative '>
                                <TextField
                                    autoComplete='off'
                                    sx={{ fontFamily: 'FaLight' }}
                                    {...register(`AddCategory.faName`)}
                                    tabIndex={1}
                                    error={errors?.AddCategory && errors?.AddCategory?.faName && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    dir='rtl'
                                    size='small'
                                    label='عنوان'
                                    InputProps={{
                                        style: { color: errors?.AddCategory?.faName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddCategory && errors?.AddCategory!.faName?.message}</label>
                            </div>
                            <div className='p-1 relative '>
                                <TextField
                                    autoComplete='off'
                                    sx={{ fontFamily: 'FaLight' }}
                                    {...register(`AddCategory.name`)}
                                    tabIndex={1}
                                    error={errors?.AddCategory && errors?.AddCategory?.name && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    dir='ltr'
                                    size='small'
                                    label='عنوان انگلیسی'
                                    InputProps={{
                                        style: { color: errors?.AddCategory?.name ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px]` flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddCategory && errors?.AddCategory!.name?.message}</label>
                            </div>
                        </section>
                    </form>
                </DialogBody>
            </Dialog>
            </>
        </MyCustomComponent>
    )
})

UpdateCategory.displayName = "UpdateCategory"
export default UpdateCategory