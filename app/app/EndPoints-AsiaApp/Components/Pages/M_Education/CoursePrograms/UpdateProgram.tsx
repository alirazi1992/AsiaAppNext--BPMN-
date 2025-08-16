'use client';
import { AddProgramModel, UpdateProgramProps } from '@/app/Domain/M_Education/Programs'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import MyCustomComponent from '../../../Shared/CustomTheme_Mui';
import { Button, Dialog, DialogBody, DialogHeader, IconButton, Tooltip } from '@material-tailwind/react';
import { TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import moment from 'jalali-moment';
import { ActionMeta, SingleValue } from 'react-select';
import { GetCategoriesListModel } from '@/app/Domain/M_Education/Courses';
import DatePickare from '../../../Shared/DatePickareComponent';
import { DateObject } from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_en from "react-date-object/locales/persian_en";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

const UpdateProgramComponent = forwardRef(({ courses, program, onSubmit }: UpdateProgramProps, ref) => {

    const SelectOption = useMemo(() => { return dynamic(() => import('@/app/EndPoints-AsiaApp/Components/Shared/SelectOption'), { ssr: false }) }, [])
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open)
    const [state, setState] = useState<{
        format: string;
        gregorian?: string;
        persian?: string;
        date?: DateObject | null;
    }>({ format: "MM/DD/YYYY" });

    const schema = yup.object().shape({
        AddProgram: yup.object(({
            durationUnit: yup.string().required('عنوان اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            finishDate: yup.string().required('اجباری'),
            instituteFaName: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            instituteName: yup.string().required('عنوان اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faDurationUnit: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            duration: yup.number().required('اجباری').min(1, 'اجباری'),
            educationalCourseId: yup.number().required('اجباری').min(1, 'اجباری'),
            validPeriod: yup.number().required('اجباری').min(1, 'اجباری'),
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
                    coachFaName: program?.faCouchName!,
                    coachName: program?.couchName!,
                    duration: program?.duration!,
                    durationUnit: program?.durationUnit!,
                    educationalCourseId: 0,
                    faDurationUnit: program?.faDurationUnit!,
                    finishDate: program?.finishDate!,
                    instituteFaName: program?.faInstitute!,
                    instituteName: program?.institute!,
                    page2Desc: program?.page2Desc!,
                    page2FaDesc: program?.faPage2Desc!,
                    validPeriod: program?.validPeriod,
                    id: program?.id!
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
    const TextEditor = useMemo(() => { return dynamic(() => import('@/app/EndPoints-AsiaApp/Components/Shared/TextEditor'), { ssr: false }) }, [])

    const OnSubmit = (data: AddProgramModel) => {
        if (!errors.AddProgram) {
            onSubmit(data.AddProgram)
            handleOpen()
            reset()
            setTextEditor({
                fa: '',
                en: ''
            })
        }
    }

    useEffect(() => {
        program != undefined && setTextEditor(
            {
                fa: program?.faPage2Desc,
                en: program?.page2Desc
            }
        );
        program != undefined && courses != undefined &&
            setValue('AddProgram', {
                id: program?.id,
                durationUnit: program?.durationUnit!,
                faDurationUnit: program?.faDurationUnit!,
                finishDate: program?.finishDate!,
                instituteFaName: program?.faInstitute!,
                instituteName: program?.institute!,
                coachFaName: program?.faCouchName,
                coachName: program?.couchName,
                page2Desc: program?.page2Desc,
                page2FaDesc: program?.faPage2Desc,
                educationalCourseId: courses?.find((item) => item.name == program?.name && item.faName == program?.faName)!.id!,
                duration: program?.duration!,
                validPeriod: program?.validPeriod!
            })

        program?.finishDate && setState(prevState => ({ ...prevState, date: new DateObject({ date: program!.finishDate! }) }))
    }, [program, courses, setValue])

    const handlePage2FaDesc = (data: any) => {
        setValue(`AddProgram.page2FaDesc`, data.html)
    }
    const handlePage2Desc = (data: any) => {
        setValue(`AddProgram.page2Desc`, data.html)
    }

    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            handleOpen()
        }
    }))


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
                    size='lg' className={`absolute top-0 bottom-0 overflow-y-scroll  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='rtl' className={` flex justify-between sticky top-0 left-0 z-[555555] ${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'} `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <IconButton variant="text" color="blue-gray" onClick={() => { handleOpen(); } }  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                    Update Course Program
                </DialogHeader>
                <DialogBody className='w-full overflow-y-auto'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                            <div className='p-1 relative w-full'>
                                <SelectOption
                                    isRtl
                                    {...register(`AddProgram.educationalCourseId`)}
                                    placeholder={'Educational Programs'}
                                    loading={courses != undefined ? false : true}
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
                            <section className='md:col-span-2 grid grid-cols-4 gap-x-1'>
                                <div className='p-1 relative '>
                                    <TextField
                                        autoComplete='off'
                                        sx={{ fontFamily: 'FaLight' }}
                                        {...register(`AddProgram.duration`)}
                                        tabIndex={1}
                                        error={errors?.AddProgram && errors?.AddProgram?.duration && true}
                                        className='w-full lg:my-0 font-[FaLight]'
                                        dir='ltr'
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
                                <div className='p-1 relative'>
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
                                        label='مدت اعتبار'
                                        InputProps={{
                                            style: { color: errors?.AddProgram?.validPeriod ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                        }}
                                    />
                                    <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddProgram && errors?.AddProgram!.validPeriod?.message}</label>
                                </div>
                            </section>
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
                            <div dir='ltr' className='p-1 relative my-3 '>
                                <TextEditor sendData={handlePage2Desc} {...register(`AddProgram.page2Desc`)} defaultValue={textEditor.en ?? ''} />
                            </div>
                        </Tooltip>
                    </form>
                </DialogBody>
            </Dialog>
            </>
        </MyCustomComponent>
    )
})

UpdateProgramComponent.displayName = 'UpdateProgramComponent'
export default UpdateProgramComponent