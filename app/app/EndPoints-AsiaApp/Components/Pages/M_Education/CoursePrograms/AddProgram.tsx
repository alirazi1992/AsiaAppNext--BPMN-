'use client';
import React, { useMemo, useState, useImperativeHandle, forwardRef } from 'react';
import { Button, CardBody, Tooltip } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ActionMeta, SingleValue } from 'react-select';
import { GetCategoriesListModel } from '@/app/Domain/M_Education/Courses';
import dynamic from 'next/dynamic';
import { AddProgramModel, SubmitAddCourseProgramsProps } from '@/app/Domain/M_Education/Programs';
import  { DateObject } from "react-multi-date-picker";
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import "react-multi-date-picker/styles/layouts/mobile.css"
import persian from "react-date-object/calendars/persian"
import persian_en from "react-date-object/locales/persian_en";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import "react-multi-date-picker/styles/backgrounds/bg-gray.css"
import DatePickare from '../../../Shared/DatePickareComponent';

const AddProgramForm = forwardRef(({ onSubmit, courses }: SubmitAddCourseProgramsProps, ref) => {
    useImperativeHandle(ref, () => ({ onSubmit, courses }));

    const SelectOption = useMemo(() => dynamic(() => import('@/app/EndPoints-AsiaApp/Components/Shared/SelectOption'), { ssr: false }), [])
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)

    const schema = yup.object().shape({
        AddProgram: yup.object(({
            durationUnit: yup.string().required('عنوان اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            finishDate: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            instituteFaName: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            instituteName: yup.string().required('عنوان اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faDurationUnit: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            duration: yup.number().required('مدت دوره اجباری').min(1, 'مدت دوره اجباری').typeError('مدت دوره اجباری'),
            educationalCourseId: yup.number().required('اجباری').min(1, 'اجباری'),
            validPeriod: yup.number().required('مدت اعتبار اجباری').min(1, 'مدت اعتبار اجباری'),
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
    } = useForm<AddProgramModel>(
        {
            defaultValues: {
                AddProgram: {
                    coachFaName: '',
                    coachName: '',
                    duration: 0,
                    durationUnit: '',
                    educationalCourseId: 0,
                    faDurationUnit: '',
                    finishDate: '',
                    instituteFaName: '',
                    instituteName: '',
                    page2Desc: '',
                    page2FaDesc: '',
                    validPeriod: 0
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;

    const [textEditor, setTextEditor] = useState({
        fa: watch('AddProgram.page2FaDesc'),
        en: watch('AddProgram.page2Desc')
    })

    const OnSubmit = (data: AddProgramModel) => {
        if (!errors.AddProgram) {
            onSubmit(data!.AddProgram)
        }
    }

    useImperativeHandle(ref, () => ({
        ResetMethod: () => {
            setState((prev) => ({ ...prev, date: null }))
            reset()
            setTextEditor({
                fa: '',
                en: ''
            })
        },
    }));

    const TextEditor = useMemo(() => { return dynamic(() => import('@/app/EndPoints-AsiaApp/Components/Shared/TextEditor'), { ssr: false }) }, [textEditor])

    const handlePage2FaDesc = (data: any) => {
        setValue(`AddProgram.page2FaDesc`, data.html)
    }
    const handlePage2Desc = (data: any) => {
        setValue(`AddProgram.page2Desc`, data.html)
    }
    const [state, setState] = useState<{
        format: string;
        gregorian?: string;
        persian?: string;
        date?: DateObject | null;
    }>({ format: "MM/DD/YYYY" });

    const convert = (date: DateObject, format: string = state.format) => {
        let object = { date, format };
        setValue('AddProgram.finishDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('AddProgram.finishDate')
        setState({
            gregorian: new DateObject(object).format(),
            persian: new DateObject(object).convert(persian, persian_en).format(),
            ...object
        })
    }

    return (
        <MyCustomComponent>
            <>
            <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} w-[98%] mx-auto`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                    dir='rtl'
                    onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10]'>
                    <div className="w-max ">
                        <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save Course Program' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SaveIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <section className='grid md:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-4 my-2'>
                        <div className='p-1 relative'>
                            <SelectOption
                                isRtl
                                className='w-full'
                                {...register(`AddProgram.educationalCourseId`)}
                                placeholder={'Educational Courses'}
                                loading={courses != undefined ? false : true}
                                defaultValue={courses == undefined ? null : courses!.find((item: GetCategoriesListModel) => item.id == getValues('AddProgram.educationalCourseId')) ? courses!.find((item: GetCategoriesListModel) => item.id == getValues('AddProgram.educationalCourseId')) : null}
                                value={courses == undefined ? null : courses!.find((item: GetCategoriesListModel) => item.id == getValues('AddProgram.educationalCourseId')) ? courses!.find((item: GetCategoriesListModel) => item.id == getValues('AddProgram.educationalCourseId')) : null}
                                errorType={errors?.AddProgram?.educationalCourseId}
                                onChange={(option: SingleValue<GetCategoriesListModel>, actionMeta: ActionMeta<GetCategoriesListModel>) => {
                                    setValue(`AddProgram.educationalCourseId`, option!.id);
                                    trigger(`AddProgram.educationalCourseId`);
                                }}
                                options={courses == undefined ? [{
                                    id: 0, value: 0, label: 'no option found',
                                    faName: 'no option found',
                                    name: 'no option found'
                                }] : courses}
                            />
                            <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.AddProgram?.educationalCourseId && errors?.AddProgram?.educationalCourseId?.message}</label>
                        </div>
                        <div className='p-1 relative'>
                            <DatePickare
                                {...register(`AddProgram.finishDate`)}
                                label='تاریخ پایان دوره'
                                value={state.date}
                                onChange={(date: DateObject) => convert(date)}
                                error={errors?.AddProgram && errors?.AddProgram?.finishDate && true}
                                focused={watch('AddProgram.finishDate')} // or true based on your logic
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddProgram && errors?.AddProgram!.finishDate?.message}</label>
                        </div>
                        <section className='md:col-span-2 grid grid-cols-1 gap-y-4 lg:gap-y-0 md:grid-cols-2 lg:grid-cols-4 gap-x-1'>
                            <div className='p-1 relative '>
                                <TextField
                                    autoComplete='off'
                                    sx={{ fontFamily: 'FaLight' }}
                                    {...register(`AddProgram.validPeriod`)}
                                    tabIndex={1}
                                    error={errors?.AddProgram && errors?.AddProgram?.validPeriod && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    dir='ltr'
                                    size='small'
                                    type='number'
                                    placeholder='ماه'
                                    label='مدت اعتبار (ماه)'
                                    InputProps={{
                                        style: { color: errors?.AddProgram?.validPeriod ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddProgram && errors?.AddProgram!.validPeriod?.message}</label>
                            </div>
                            <div className='p-1 relative '>
                                <TextField
                                    autoComplete='off'
                                    sx={{ fontFamily: 'FaLight' }}
                                    {...register(`AddProgram.duration`)}
                                    tabIndex={1}
                                    error={errors?.AddProgram && errors?.AddProgram?.duration && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    dir='ltr'
                                    type='number'
                                    size='small'
                                    label='مدت دوره'
                                    InputProps={{
                                        style: { color: errors?.AddProgram?.duration ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddProgram && errors?.AddProgram!.duration?.message}</label>
                            </div>
                            <div className='p-1 relative '>
                                <TextField
                                    autoComplete='off'
                                    sx={{ fontFamily: 'FaLight' }}
                                    {...register(`AddProgram.faDurationUnit`)}
                                    tabIndex={1}
                                    error={errors?.AddProgram && errors?.AddProgram?.faDurationUnit && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    dir='rtl'
                                    size='small'
                                    label='واحد دوره'
                                    InputProps={{
                                        style: { color: errors?.AddProgram?.faDurationUnit ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddProgram && errors?.AddProgram!.faDurationUnit?.message}</label>
                            </div>
                            <div className='p-1 relative '>
                                <TextField
                                    autoComplete='off'
                                    sx={{ fontFamily: 'FaLight' }}
                                    {...register(`AddProgram.durationUnit`)}
                                    tabIndex={1}
                                    error={errors?.AddProgram && errors?.AddProgram?.durationUnit && true}
                                    className='w-full lg:my-0 font-[FaLight]'
                                    dir='ltr'
                                    size='small'
                                    label='واحد لاتین دوره'
                                    InputProps={{
                                        style: { color: errors?.AddProgram?.durationUnit ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddProgram && errors?.AddProgram!.durationUnit?.message}</label>
                            </div>

                        </section>
                        <div className='p-1 relative '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`AddProgram.coachFaName`)}
                                tabIndex={1}
                                error={errors?.AddProgram && errors?.AddProgram?.coachFaName && true}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='rtl'
                                size='small'
                                label='نام مدرس'
                                InputProps={{
                                    style: { color: errors?.AddProgram?.coachFaName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddProgram && errors?.AddProgram!.coachFaName?.message}</label>
                        </div>
                        <div className='p-1 relative '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`AddProgram.coachName`)}
                                tabIndex={2}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='ltr'
                                size='small'
                                label='نام انگلیسی مدرس'
                                InputProps={{
                                    style: { color: errors?.AddProgram?.coachName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                        </div>
                        <div className='p-1 relative '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`AddProgram.instituteFaName`)}
                                tabIndex={1}
                                error={errors?.AddProgram && errors?.AddProgram?.instituteFaName && true}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='rtl'
                                size='small'
                                label='نام موسسه'
                                InputProps={{
                                    style: { color: errors?.AddProgram?.instituteFaName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddProgram && errors?.AddProgram!.instituteFaName?.message}</label>
                        </div>
                        <div className='p-1 relative '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`AddProgram.instituteName`)}
                                error={errors?.AddProgram && errors?.AddProgram?.instituteName && true}
                                tabIndex={2}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='ltr'
                                size='small'
                                label='نام انگلیسی موسسه'
                                InputProps={{
                                    style: { color: errors?.AddProgram?.instituteName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddProgram && errors?.AddProgram!.instituteName?.message}</label>
                        </div>
                    </section>
                    <Tooltip className={`${!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}  z-[999999]`} content='ضمائم صفحه دوم' placement="top">
                        <div dir='ltr' className='p-1 relative my-3 '>
                            <TextEditor sendData={handlePage2FaDesc} {...register(`AddProgram.page2FaDesc`)} defaultValue={textEditor.fa ?? ''} />
                        </div>
                    </Tooltip>
                    <Tooltip className={`${!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}  z-[999999]`} content='ضمائم انگلیسی صفحه دوم' placement="top">
                        <div dir='ltr' className='p-1 relative my-3 EnFont '>
                            <TextEditor sendData={handlePage2Desc} {...register(`AddProgram.page2Desc`)} defaultValue={textEditor.en ?? ''} />
                        </div>
                    </Tooltip>
                </form>
            </CardBody>
            </>
        </MyCustomComponent >
    )
})
AddProgramForm.displayName = 'AddProgramForm'

export default AddProgramForm