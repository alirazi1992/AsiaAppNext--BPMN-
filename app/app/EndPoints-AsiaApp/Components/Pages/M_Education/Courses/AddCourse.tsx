'use client';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Button, CardBody, Tooltip } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import { ActionMeta, SingleValue } from 'react-select';
import { AddCourseModel, GetCategoriesListModel, GetGeneralTemplateModel, SubmitAddCourseProps } from '@/app/Domain/M_Education/Courses';
import dynamic from 'next/dynamic';

const AddCourse = forwardRef(({ onSubmit, categories, templates }: SubmitAddCourseProps, ref) => {
    const SelectOption = useMemo(() => { return dynamic(() => import('@/app/EndPoints-AsiaApp/Components/Shared/SelectOption'), { ssr: false }) }, [])
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)

    const schema = yup.object().shape({
        AddCourse: yup.object(({
            name: yup.string().required('عنوان انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faName: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            courseCategoryId: yup.number().required('اجباری').min(1 , 'اجباری'),
            templateId: yup.number().required('اجباری').min(1 , 'اجباری'),
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
                    courseCode:''
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;

    const handleDataCourseDesc = (data: any) => {
        setValue('AddCourse.courseDesc', data.html)
    }
    const handleDatafaCourseDesc = (data: any) => {
        setValue('AddCourse.faCourseDesc', data.html)
    }
    const [textEditor, setTextEditor] = useState({
        fa: watch('AddCourse.faCourseDesc'),
        en: watch('AddCourse.courseDesc')
    })

    const OnSubmit = (data: AddCourseModel) => {
        if (!errors.AddCourse) {
            onSubmit(data.AddCourse)
        }
    }
    const TextEditor = useMemo(() => { return dynamic(() => import('@/app/EndPoints-AsiaApp/Components/Shared/TextEditor'), { ssr: false }) }, [textEditor])


    useImperativeHandle(ref, () => ({
        ResetMethod: () => {
            reset(),
                setTextEditor({
                    fa: '',
                    en: ''
                })
        },
    }));


    return (
        <MyCustomComponent>
            <>
            <CardBody className={`w-[98%] my-3 mx-auto  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'carDLight'} `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                    <section className='grid grid-cols-1 md:grid-cols-5 gap-x-1 gap-y-5 my-2'>
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
                                {...register(`AddCourse.courseCategoryId`)}
                                placeholder={'Categories'}
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
                                value={templates == undefined ? null : templates!.find((item: GetGeneralTemplateModel) => item.id == getValues('AddCourse.templateId')) ? templates!.find((item: GetGeneralTemplateModel) => item.id == getValues('AddCourse.templateId')) : null}
                                placeholder={'Templates'}
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
                        <div dir='ltr' className='p-1 relative my-3 EnFont '>
                            <TextEditor sendData={handleDataCourseDesc} {...register(`AddCourse.courseDesc`)} defaultValue={textEditor.en ?? ''} />
                        </div>
                    </Tooltip>
                </form>
            </CardBody>
            </>
        </MyCustomComponent >
    )
})

AddCourse.displayName = 'AddCourse'
export default AddCourse