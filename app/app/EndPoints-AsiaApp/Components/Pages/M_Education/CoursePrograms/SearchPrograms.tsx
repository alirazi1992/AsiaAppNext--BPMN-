'use client';
import React, { useMemo, useState } from 'react';
import { Button, CardBody, IconButton, Tooltip } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as yup from "yup";
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import dynamic from 'next/dynamic';
import { SearchCourseProgramsProps, SearchProgramsModel } from '@/app/Domain/M_Education/Programs';
import DateRangePicker from '@/app/components/shared/DatePicker/DateRangePicker';
import moment from 'jalali-moment';
import ClearIcon from '@mui/icons-material/Clear';
import { DateObject } from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_en from "react-date-object/locales/persian_en";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import DateCard from '../../../Shared/DateCard';

const SearchProgramForm: React.FC<SearchCourseProgramsProps> = ({ onSubmit }) => {
    const SelectOption = useMemo(() => { return dynamic(() => import('@/app/EndPoints-AsiaApp/Components/Shared/SelectOption'), { ssr: false }) }, [])
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)

    const schema = yup.object().shape({
        SearchProgram: yup.object(({
            categoryName: yup.string().nullable(),
            coachName: yup.string().nullable(),
            creationDateAfter: yup.string().nullable(),
            creationDateBefore: yup.string().nullable(),
            finishDateAfter: yup.string().nullable(),
            finishDateBefore: yup.string().nullable(),
            instituteName: yup.string().nullable(),
            name: yup.string().nullable(),
            participant: yup.string().nullable(),
            personnel: yup.string().nullable(),
            courseCode: yup.string().nullable()
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
    } = useForm<SearchProgramsModel>(
        {
            defaultValues: {
                SearchProgram: {
                    categoryName: '',
                    coachName: '',
                    creationDateAfter: '',
                    creationDateBefore: '',
                    finishDateAfter: '',
                    finishDateBefore: '',
                    instituteName: '',
                    name: '',
                    participant: '',
                    personnel: '',
                    courseCode: '',
                },
            }, mode: 'all',
            resolver: yupResolver(schema) as Resolver<SearchProgramsModel>
        }
    );
    const errors = formState.errors;


    const OnSubmit = (data: SearchProgramsModel) => {
        if (!errors.SearchProgram) {
            onSubmit(data!.SearchProgram)
        }
    }

    type DatePickareStateModel = {
        format: string;
        gregorian?: string;
        persian?: string;
        date?: DateObject | null;
    }
    const [state, setState] = useState<{
        CreateDateAfter: DatePickareStateModel,
        CreateDateBefore: DatePickareStateModel,
        FinishDateAfter: DatePickareStateModel,
        FinishDateBefore: DatePickareStateModel,
    }>({
        CreateDateAfter: { format: "YYYY/MM/DD HH:mm:ss" }, CreateDateBefore: { format: "YYYY/MM/DD HH:mm:ss" },
        FinishDateAfter: { format: "YYYY/MM/DD HH:mm:ss" }, FinishDateBefore: { format: "YYYY/MM/DD HH:mm:ss" },
    });

    const ConvertCreateAfter = (date: DateObject, format: string = state.CreateDateAfter.format) => {
        let object = { date, format };
        setValue('SearchProgram.creationDateAfter', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('SearchProgram.creationDateAfter')
        setState(prevState => ({
            ...prevState,
            CreateDateAfter: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }
    const ConvertCreateBefore = (date: DateObject, format: string = state.CreateDateBefore.format) => {
        let object = { date, format };
        setValue('SearchProgram.creationDateBefore', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('SearchProgram.creationDateBefore')
        setState(prevState => ({
            ...prevState,
            CreateDateBefore: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }
    const ConvertFinishAfter = (date: DateObject, format: string = state.FinishDateAfter.format) => {
        let object = { date, format };
        setValue('SearchProgram.finishDateAfter', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('SearchProgram.finishDateAfter')
        setState(prevState => ({
            ...prevState,
            FinishDateAfter: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }
    const ConvertFinishBefore = (date: DateObject, format: string = state.FinishDateBefore.format) => {
        let object = { date, format };
        setValue('SearchProgram.finishDateBefore', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('SearchProgram.finishDateBefore')
        setState(prevState => ({
            ...prevState,
            FinishDateBefore: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }


    return (
        <MyCustomComponent>
            <>
            <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} m-3`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                    dir='rtl'
                    onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10]'>
                    <div className="w-max ">
                        <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Search Course program' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SearchIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-x-2 gap-y-4 my-2'>
                        <div className='p-1 relative col-span-1 '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`SearchProgram.courseCode`)}
                                tabIndex={1}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='rtl'
                                size='small'
                                label='کد دوره'
                                InputProps={{
                                    style: { color: errors?.SearchProgram?.courseCode ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`SearchProgram.name`)}
                                tabIndex={2}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='rtl'
                                size='small'
                                label='نام دوره'
                                InputProps={{
                                    style: { color: errors?.SearchProgram?.name ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`SearchProgram.categoryName`)}
                                tabIndex={3}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='rtl'
                                size='small'
                                label='نام دسته بندی'
                                InputProps={{
                                    style: { color: errors?.SearchProgram?.categoryName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`SearchProgram.coachName`)}
                                tabIndex={4}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='rtl'
                                size='small'
                                label='نام مدرس'
                                InputProps={{
                                    style: { color: errors?.SearchProgram?.coachName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.SearchProgram && errors?.SearchProgram!.coachName?.message}</label>
                        </div>
                        <div className='p-1 relative '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`SearchProgram.instituteName`)}
                                tabIndex={5}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='rtl'
                                size='small'
                                label='نام موسسه'
                                InputProps={{
                                    style: { color: errors?.SearchProgram?.instituteName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                        </div>
                        <div className='p-1 relative'>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`SearchProgram.personnel`)}
                                tabIndex={6}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='ltr'
                                size='small'
                                label='نام شرکت کننده'
                                InputProps={{
                                    style: { color: errors?.SearchProgram?.personnel ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                        </div>
                    </section>
                    <section className='grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4 my-2'>
                        <DateCard
                            {...register(`SearchProgram.creationDateAfter`)}
                            valueTextField={watch('SearchProgram.creationDateAfter') ? new DateObject(watch('SearchProgram.creationDateAfter')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={state.CreateDateAfter.date}
                            clearValue={() => {
                                if (watch('SearchProgram.creationDateAfter')) {
                                    setValue('SearchProgram.creationDateAfter', '');
                                    setState(prevState => ({
                                        ...prevState,
                                        CreateDateAfter: {
                                            ...prevState.CreateDateAfter,
                                            gregorian: '',
                                            persian: '',
                                            date: null
                                        }
                                    }))
                                }
                            }}
                            labelTextField="تاریخ ایجاد میلادی بعد از"
                            labelDatePickare='تاریخ ایجاد شمسی بعد از'
                            error={errors?.SearchProgram && errors?.SearchProgram.creationDateAfter && true}
                            convertDate={(date: DateObject) => ConvertCreateAfter(date)}
                            focused={watch('SearchProgram.creationDateAfter') ? true : false}
                        />
                        <DateCard
                            {...register(`SearchProgram.creationDateBefore`)}
                            valueTextField={watch('SearchProgram.creationDateBefore') ? new DateObject(watch('SearchProgram.creationDateBefore')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={state.CreateDateBefore.date}
                            clearValue={() => {
                                if (watch('SearchProgram.creationDateBefore')) {
                                    setValue('SearchProgram.creationDateBefore', '');
                                    setState(prevState => ({
                                        ...prevState,
                                        CreateDateBefore: {
                                            ...prevState.CreateDateBefore,
                                            gregorian: '',
                                            persian: '',
                                            date: null
                                        }
                                    }))
                                }
                            }}
                            labelTextField="تاریخ ایجاد میلادی قبل از"
                            labelDatePickare='تاریخ ایجاد شمسی قبل از'
                            error={errors?.SearchProgram && errors?.SearchProgram.creationDateBefore && true}
                            convertDate={(date: DateObject) => ConvertCreateBefore(date)}
                            focused={watch('SearchProgram.creationDateBefore') ? true : false}
                        />
                        <DateCard
                            {...register(`SearchProgram.finishDateAfter`)}
                            valueTextField={watch('SearchProgram.finishDateAfter') ? new DateObject(watch('SearchProgram.finishDateAfter')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={state.FinishDateAfter.date}
                            clearValue={() => {
                                if (watch('SearchProgram.finishDateAfter')) {
                                    setValue('SearchProgram.finishDateAfter', '');
                                    setState(prevState => ({
                                        ...prevState,
                                        FinishDateAfter: {
                                            ...prevState.FinishDateAfter,
                                            gregorian: '',
                                            persian: '',
                                            date: null
                                        }
                                    }))
                                }
                            }}
                            labelTextField="تاریخ پایان میلادی بعد از"
                            labelDatePickare='تاریخ پایان شمسی بعد از'
                            error={errors?.SearchProgram && errors?.SearchProgram.finishDateAfter && true}
                            convertDate={(date: DateObject) => ConvertFinishAfter(date)}
                            focused={watch('SearchProgram.finishDateAfter') ? true : false}
                        />
                        <DateCard
                            {...register(`SearchProgram.finishDateBefore`)}
                            valueTextField={watch('SearchProgram.finishDateBefore') ? new DateObject(watch('SearchProgram.finishDateBefore')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={state.FinishDateBefore.date}
                            clearValue={() => {
                                if (watch('SearchProgram.finishDateBefore')) {
                                    setValue('SearchProgram.finishDateBefore', '');
                                    setState(prevState => ({
                                        ...prevState,
                                        FinishDateBefore: {
                                            ...prevState.FinishDateBefore,
                                            gregorian: '',
                                            persian: '',
                                            date: null
                                        }
                                    }))
                                }
                            }}
                            labelTextField="تاریخ پایان میلادی قبل از"
                            labelDatePickare='تاریخ پایان شمسی قبل از'
                            error={errors?.SearchProgram && errors?.SearchProgram.finishDateBefore && true}
                            convertDate={(date: DateObject) => ConvertFinishBefore(date)}
                            focused={watch('SearchProgram.finishDateBefore') ? true : false}
                        />
                    </section>
                </form>
            </CardBody>
            </>
        </MyCustomComponent >
    )
}

export default SearchProgramForm