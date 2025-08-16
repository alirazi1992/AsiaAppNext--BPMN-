'use client';
import { Button, Dialog, DialogBody, DialogHeader, IconButton, Tooltip } from '@material-tailwind/react'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import useStore from "@/app/hooks/useStore";
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import SaveIcon from '@mui/icons-material/Save';
import { TextField } from '@mui/material';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import { AddCourseModel, GetCategoriesListModel, GetGeneralTemplateModel, UpdateCourseProps } from '@/app/Domain/M_Education/Courses';
import dynamic from 'next/dynamic';
import { ActionMeta, SingleValue } from 'react-select';

const UpdateCourseComponent = forwardRef(({ course, onSubmit, categories, templates }: UpdateCourseProps, ref) => {
    const SelectOption = useMemo(() => { return dynamic(() => import('@/app/EndPoints-AsiaApp/Components/Shared/SelectOption'), { ssr: false }) }, [])
    const color = useStore(colorStore, (state) => state);
    const themeMode = useStore(themeStore, (state) => state);

    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open)

    const schema = yup.object().shape({
        AddCourse: yup.object(({
            name: yup.string().required('عنوان انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faName: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            courseCategoryId: yup.number().required('اجباری'),
            templateId: yup.number().required('اجباری'),
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
    } = useForm<AddCourseModel>(
        {
            defaultValues: {
                AddCourse: {
                    faName: '',
                    name: '',
                    courseDesc: '',
                    faCourseDesc: '',
                    courseCategoryId: 0,
                    templateId: 0,
                    courseCode: ''
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;

    const [textEditor, setTextEditor] = useState({
        fa: watch('AddCourse.faCourseDesc'),
        en: watch('AddCourse.courseDesc')
    })
    const TextEditor = useMemo(() => { return dynamic(() => import('@/app/EndPoints-AsiaApp/Components/Shared/TextEditor'), { ssr: false }) }, [])

    const OnSubmit = (data: AddCourseModel) => {
        if (!errors.AddCourse) {
            onSubmit(data.AddCourse)
            handleOpen()
            reset()
        }
    }

    useEffect(() => {
        course != undefined && setTextEditor(
            {
                fa: course?.courseFaDesc,
                en: course?.courseDesc,
            }
        );
        course != undefined && templates != undefined && setValue('AddCourse', {
            faName: course!.faName,
            name: course!.name,
            courseDesc: course!.courseDesc,
            courseCategoryId: categories!.find((item) => item.name == course?.categoryName)!.id!,
            templateId: templates!.find((item) => item.name == course?.templateName)!.id!,
            faCourseDesc: course!.courseFaDesc,
            id: course!.id,
            courseCode: course!.courseCode == null ? '' : course!.courseCode

        })
    }, [categories, course, setValue, templates])

    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            handleOpen()
        },
    }));

    const handleDataCourseDesc = (data: any) => {
        setValue('AddCourse.courseDesc', data.html)
    }
    const handleDatafaCourseDesc = (data: any) => {
        setValue('AddCourse.faCourseDesc', data.html)
    }

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
                    size='lg' className={`absolute top-0 bottom-0 overflow-y-scroll  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
                <DialogHeader dir='rtl' className={` flex justify-between sticky top-0 left-0 z-[555555] ${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'} `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                    Update Educational Course
                </DialogHeader>
                <DialogBody className='w-full overflow-y-auto'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <form
                        dir='rtl'
                        onSubmit={handleSubmit(OnSubmit)}
                        className='relative z-[10]'>
                        <div className="w-max ">
                            <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save Course' placement="top">
                                <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <SaveIcon className='p-1' />
                                </Button>
                            </Tooltip>
                        </div>
                        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-5 my-2'>
                            <div className='p-1 relative '>
                                <TextField
                                    autoComplete='off'
                                    sx={{ fontFamily: 'FaLight' }}
                                    {...register(`AddCourse.faName`)}
                                    tabIndex={1}
                                    error={errors?.AddCourse && errors?.AddCourse?.faName && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    dir='rtl'
                                    size='small'
                                    label='عنوان'
                                    InputProps={{
                                        style: { color: errors?.AddCourse?.faName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddCourse && errors?.AddCourse!.faName?.message}</label>
                            </div>
                            <div className='p-1 relative '>
                                <TextField
                                    autoComplete='off'
                                    sx={{ fontFamily: 'FaLight' }}
                                    {...register(`AddCourse.courseCode`)}
                                    tabIndex={1}
                                    error={errors?.AddCourse && errors?.AddCourse?.courseCode && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    dir='rtl'
                                    size='small'
                                    label='کد دوره'
                                    InputProps={{
                                        style: { color: errors?.AddCourse?.courseCode ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddCourse && errors?.AddCourse!.courseCode?.message}</label>
                            </div>
                            <div className='p-1 relative '>
                                <TextField
                                    autoComplete='off'
                                    sx={{ fontFamily: 'FaLight' }}
                                    {...register(`AddCourse.name`)}
                                    tabIndex={1}
                                    error={errors?.AddCourse && errors?.AddCourse?.name && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    dir='ltr'
                                    size='small'
                                    label='عنوان انگلیسی'
                                    InputProps={{
                                        style: { color: errors?.AddCourse?.name ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddCourse && errors?.AddCourse!.name?.message}</label>
                            </div>
                            <div className='p-1 relative'>
                                <SelectOption
                                    isRtl
                                    className='z-[999999999]'
                                    {...register(`AddCourse.courseCategoryId`)}
                                    placeholder={'Select Category'}
                                    loading={categories != undefined ? false : true}
                                    value={categories == undefined ? null : categories!.find((item: GetCategoriesListModel) => item.id == getValues('AddCourse.courseCategoryId')) ? categories!.find((item: GetCategoriesListModel) => item.id == getValues('AddCourse.courseCategoryId')) : null}
                                    errorType={errors?.AddCourse?.courseCategoryId}
                                    onChange={(option: SingleValue<GetCategoriesListModel>, actionMeta: ActionMeta<GetCategoriesListModel>) => {
                                        setValue(`AddCourse.courseCategoryId`, option!.id);
                                        trigger(`AddCourse.courseCategoryId`);
                                    }}
                                    options={categories == undefined ? [{
                                        id: 0, value: 0, label: 'no option found',
                                        faName: 'no option found',
                                        name: 'no option found'
                                    }] : categories}
                                />
                                <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.AddCourse?.courseCategoryId && errors?.AddCourse?.courseCategoryId?.message}</label>
                            </div>
                            <div className='p-1 relative'>
                                <SelectOption
                                    isRtl
                                    loading={templates != undefined ? false : true}
                                    {...register(`AddCourse.templateId`)}
                                    placeholder={'Select Template'}
                                    value={templates == undefined ? null : templates!.find((item: GetGeneralTemplateModel) => item.id == getValues('AddCourse.templateId')) ? templates!.find((item: GetGeneralTemplateModel) => item.id == getValues('AddCourse.templateId')) : null}
                                    errorType={errors?.AddCourse?.templateId}
                                    onChange={(option: SingleValue<GetGeneralTemplateModel>, actionMeta: ActionMeta<GetGeneralTemplateModel>) => {
                                        setValue(`AddCourse.templateId`, option!.id);
                                        trigger(`AddCourse.templateId`);
                                    }}
                                    options={templates == undefined ? [{
                                        id: 0, value: 0, label: 'no option found',
                                        name: 'no option found'
                                    }] : templates}
                                />
                                <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.AddCourse?.templateId && errors?.AddCourse?.templateId?.message}</label>
                            </div>
                        </section>
                        <Tooltip className={`${!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}  z-[999999]`} content='توضیحات' placement="top">
                            <div dir='ltr' className='p-1 relative my-3 '>
                                <TextEditor sendData={handleDatafaCourseDesc} {...register(`AddCourse.faCourseDesc`)} defaultValue={textEditor.fa ?? ''} />
                            </div>
                        </Tooltip>
                        <Tooltip className={`${!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}  z-[999999]`} content='توضیحات انگلیسی' placement="top">
                            <div dir='ltr' className='p-1 relative my-3 '>
                                <TextEditor sendData={handleDataCourseDesc}  {...register(`AddCourse.courseDesc`)} defaultValue={textEditor.en ?? ''} />
                            </div>
                        </Tooltip>
                    </form>
                </DialogBody>
            </Dialog>
            </>
        </MyCustomComponent>
    )
})

UpdateCourseComponent.displayName = 'UpdateCourseComponent'
export default UpdateCourseComponent