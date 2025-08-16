'use client'
import React, { forwardRef, useContext, useImperativeHandle, useState } from 'react'
import { Card, Button, CardBody, IconButton, Typography } from '@material-tailwind/react'
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import colorStore from '@/app/zustandData/color.zustand';
import { Checkbox, FormControlLabel } from '@mui/material';
import * as yup from "yup";
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SearchDocsResultModel, SearchFilterModel } from '@/app/Domain/M_Search/search';
import SelectOption from '../../Shared/SelectOption';
import { docTypes } from '@/app/Application-AsiaApp/Utils/M_Search/data';
import { LoadingModel, SelectOptionModel } from '@/app/Domain/shared';
import { ActionMeta, SingleValue } from 'react-select';
import SearchIcon from '@mui/icons-material/Search';
import { DateObject } from "react-multi-date-picker";
import "react-multi-date-picker/styles/layouts/mobile.css"
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import "react-multi-date-picker/styles/backgrounds/bg-gray.css"
import { SearchContext } from './MainContainer';
import TextFieldItem from '../../Shared/TextFieldItem';
import DateCard from '../../Shared/DateCard';
import { useList } from '@/app/Application-AsiaApp/M_Search/fetchSearchesList';
import { SweetAlertResult } from 'sweetalert2';

const SearchForm = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const { fetchSearchedList } = useList()
    const { setPage, FilterRef, setLoadings, setResult, FormRef } = useContext(SearchContext)
    const schema = yup.object().shape({
        SearchItem: yup.object().shape({
            IsRevoked: yup.bool(),
            Indicator: yup.string(),
            Passage: yup.string(),
            Keyword: yup.string(),
            MainReceiver: yup.string(),
            CopyReceiver: yup.string(),
            Sender: yup.string(),
            DocTypeId: yup.number().required(),
            Subject: yup.string(),
            SubmitIndicator: yup.string(),
            ImportSubmitNo: yup.string(),
            CreateDateAfter: yup.object().nullable(),
            CreateDateBefore: yup.object().nullable(),
            SignDateAfter: yup.object().nullable(),
            SignDateBefore: yup.object().nullable(),
            SubmitDateAfter: yup.object().nullable(),
            SubmitDateBefore: yup.object().nullable(),
            ImportSubmitDateAfter: yup.object().nullable(),
            ImportSubmitDateBefore: yup.object().nullable()
        })
    }).required()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        getValues,
        trigger,
        setValue,
        formState,
    } = useForm<SearchFilterModel>(
        {
            defaultValues: {
                SearchItem: {
                    IsRevoked: false,
                    Indicator: '',
                    Passage: '',
                    Keyword: '',
                    MainReceiver: '',
                    CopyReceiver: '',
                    Sender: '',
                    DocTypeId: 1,
                    Subject: '',
                    SubmitIndicator: '',
                    ImportSubmitNo: '',
                    CreateDateAfter: null,
                    CreateDateBefore: null,
                    SignDateAfter: null,
                    SignDateBefore: null,
                    SubmitDateAfter: null,
                    SubmitDateBefore: null,
                    ImportSubmitDateAfter: null,
                    ImportSubmitDateBefore: null
                }
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );

    const errors = formState.errors;

    const ConvertCreateAfter = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchItem.CreateDateAfter', { CreateDate: new DateObject(object).convert(gregorian, gregorian_en).format(), IsBefore: false })
        trigger('SearchItem.CreateDateAfter')
    }
    const ConvertCreateBefore = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchItem.CreateDateBefore', { CreateDate: new DateObject(object).convert(gregorian, gregorian_en).format(), IsBefore: true })
        trigger('SearchItem.CreateDateBefore')
    }
    const ConvertSignAfter = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchItem.SignDateAfter', { LockDate: new DateObject(object).convert(gregorian, gregorian_en).format(), IsBefore: false })
        trigger('SearchItem.SignDateAfter')
    }
    const ConvertSignBefore = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchItem.SignDateBefore', { LockDate: new DateObject(object).convert(gregorian, gregorian_en).format(), IsBefore: true })
        trigger('SearchItem.SignDateBefore')

    }
    const ConvertSubmitAfter = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchItem.SubmitDateAfter', { SubmitDate: new DateObject(object).convert(gregorian, gregorian_en).format(), IsBefore: false })
        trigger('SearchItem.SubmitDateAfter')
    }
    const ConvertSubmitBefore = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchItem.SubmitDateBefore', { SubmitDate: new DateObject(object).convert(gregorian, gregorian_en).format(), IsBefore: true })
        trigger('SearchItem.SubmitDateBefore')
    }
    const ConvertImportSubmitAfter = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchItem.ImportSubmitDateAfter', { ImportSubmitDate: new DateObject(object).convert(gregorian, gregorian_en).format(), IsBefore: false })
        trigger('SearchItem.ImportSubmitDateAfter')
    }
    const ConvertImportSubmitBefore = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchItem.ImportSubmitDateBefore', { ImportSubmitDate: new DateObject(object).convert(gregorian, gregorian_en).format(), IsBefore: true })
        trigger('SearchItem.ImportSubmitDateBefore')
    }

    const OnSubmit = async (data: SearchFilterModel, page: number) => {
        setPage(page)
        if (!data.SearchItem.CreateDateAfter?.CreateDate) {
            data.SearchItem.CreateDateAfter = null;
        }
        if (!data.SearchItem.CreateDateBefore?.CreateDate) {
            data.SearchItem.CreateDateBefore = null;
        }
        if (!data.SearchItem.SignDateAfter?.LockDate) {
            data.SearchItem.SignDateAfter = null;
        }
        if (!data.SearchItem.SignDateBefore?.LockDate) {
            data.SearchItem.SignDateBefore = null;
        }
        if (!data.SearchItem.SubmitDateAfter?.SubmitDate) {
            data.SearchItem.SubmitDateAfter = null;
        }
        if (!data.SearchItem.SubmitDateBefore?.SubmitDate) {
            data.SearchItem.SubmitDateBefore = null;
        }
        if (!data.SearchItem.ImportSubmitDateAfter?.ImportSubmitDate) {
            data.SearchItem.ImportSubmitDateAfter = null;
        }
        if (!data.SearchItem.ImportSubmitDateBefore?.ImportSubmitDate) {
            data.SearchItem.ImportSubmitDateBefore = null;
        }
        setLoadings((prev: LoadingModel) => ({ ...prev, table: true }))
        const res = await fetchSearchedList(JSON.stringify(data.SearchItem), page).then((result: SearchDocsResultModel[] | SweetAlertResult<any> | string | undefined) => {
            if (result) {
                if (FilterRef.current) {
                    FilterRef.current.handleClose()
                }
                setLoadings((prev: LoadingModel) => ({ ...prev, table: false }))
                if (Array.isArray(result)) {
                    if (result && result.length > 0) {
                        setResult(result)
                    }
                } else {
                    setResult([])
                }
            }
        })
    }

    useImperativeHandle(ref, () => ({
        OnSubmit: (num: number) => {
            OnSubmit({ SearchItem: getValues('SearchItem') }, num)
        }
    }));

    return (
        <CardBody style={{ outline: 'none' }} tabIndex={0} placeholder="placeholder" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
            onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                    OnSubmit({ SearchItem: getValues('SearchItem') }, 1)
                }
            }} >
            <form
                dir='rtl'
                className='relative z-[10]'>
                <section className='grid grid-cols-1 gap-y-1 my-1'>
                    <section className='flex flex-col px-0  w-full'>
                        <FormControlLabel
                            className={!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}
                            control={<Checkbox sx={{
                                color: color?.color,
                                '&.Mui-checked': {
                                    color: color?.color,
                                },
                            }} {...register('SearchItem.IsRevoked')}
                                onChange={(event) => { setValue('SearchItem.IsRevoked', event.target.checked), trigger() }} />} label="وضعیت ابطال" />
                    </section>
                    <div className='p-1 relative '>
                        <TextFieldItem
                            label="شماره وارده/ صادره"
                            register={{ ...register(`SearchItem.SubmitIndicator`) }}
                            tabIndex={1}
                            error={errors && errors?.SearchItem?.SubmitIndicator && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem
                            label="شماره صادره نامه وارده"
                            register={{ ...register(`SearchItem.ImportSubmitNo`) }}
                            tabIndex={2}
                            error={errors && errors?.SearchItem?.ImportSubmitNo && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem
                            label="شماره مدرک"
                            register={{ ...register(`SearchItem.Indicator`) }}
                            tabIndex={3}
                            error={errors && errors?.SearchItem?.Indicator && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <SelectOption
                            isRtl={false}
                            className='z-[99]'
                            {...register(`SearchItem.DocTypeId`)}
                            placeholder={'نوع مدرک'}
                            loading={docTypes != undefined ? false : true}
                            value={docTypes == undefined ? null : docTypes!.find((item: SelectOptionModel<number>) => item.value == getValues('SearchItem.DocTypeId')) ? docTypes!.find((item: SelectOptionModel<number>) => item.value == getValues('SearchItem.DocTypeId')) : 1}
                            errorType={errors?.SearchItem?.DocTypeId}
                            onChange={(option: SingleValue<SelectOptionModel<number>>, actionMeta: ActionMeta<SelectOptionModel<number>>) => {
                                setValue(`SearchItem.DocTypeId`, option!.value);
                                trigger(`SearchItem.DocTypeId`);
                            }}
                            options={docTypes == undefined ? [{
                                id: 0, value: 0, label: 'no option found',
                                faName: 'no option found',
                                name: 'no option found'
                            }] : docTypes}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem
                            label='کلید واژه'
                            register={{ ...register(`SearchItem.Keyword`) }}
                            tabIndex={4}
                            error={errors && errors?.SearchItem?.Keyword && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem
                            label="متن"
                            register={{ ...register(`SearchItem.Passage`) }}
                            tabIndex={5}
                            error={errors && errors?.SearchItem?.Passage && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem
                            label="موضوع"
                            register={{ ...register(`SearchItem.Subject`) }}
                            tabIndex={6}
                            error={errors && errors?.SearchItem?.Subject && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem
                            label="فرستنده"
                            register={{ ...register(`SearchItem.Sender`) }}
                            tabIndex={7}
                            error={errors && errors?.SearchItem?.Sender && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem
                            label="گیرندگان رونوشت"
                            register={{ ...register(`SearchItem.CopyReceiver`) }}
                            tabIndex={8}
                            error={errors && errors?.SearchItem?.CopyReceiver && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem
                            label="گیرندگان"
                            register={{ ...register(`SearchItem.MainReceiver`) }}
                            tabIndex={9}
                            error={errors && errors?.SearchItem?.MainReceiver && true}
                        />
                    </div>
                    <Card shadow className={`p-2 gap-3 w-full lg:w-auto ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <Typography dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[700] text-[14px] mb-2`} variant='h6' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            تاریخ ایجاد
                        </Typography>
                        <DateCard
                            {...register(`SearchItem.CreateDateAfter.CreateDate`)}
                            valueTextField={watch('SearchItem.CreateDateAfter.CreateDate') ? new DateObject(watch('SearchItem.CreateDateAfter.CreateDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={watch('SearchItem.CreateDateAfter.CreateDate') ? new DateObject(watch('SearchItem.CreateDateAfter.CreateDate')!) : undefined}
                            clearValue={() => {
                                if (watch('SearchItem.CreateDateAfter.CreateDate')) {
                                    setValue('SearchItem.CreateDateAfter.CreateDate', '')
                                }
                            }}
                            labelTextField="تاریخ میلادی بعد از"
                            labelDatePickare='تاریخ شمسی بعد از'
                            error={errors?.SearchItem && errors?.SearchItem?.CreateDateAfter && true}
                            convertDate={(date: DateObject) => ConvertCreateAfter(date)}
                            focused={watch('SearchItem.CreateDateAfter.CreateDate') ? true : false}
                        />
                        <DateCard
                            {...register(`SearchItem.CreateDateBefore.CreateDate`)}
                            valueTextField={watch('SearchItem.CreateDateBefore.CreateDate') ? new DateObject(watch('SearchItem.CreateDateBefore.CreateDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={watch('SearchItem.CreateDateBefore.CreateDate') ? new DateObject(watch('SearchItem.CreateDateBefore.CreateDate')!) : undefined}
                            clearValue={() => {
                                if (watch('SearchItem.CreateDateBefore.CreateDate')) {
                                    setValue('SearchItem.CreateDateBefore.CreateDate', '');
                                }
                            }}
                            labelTextField="تاریخ میلادی قبل از"
                            labelDatePickare='تاریخ شمسی قبل از'
                            error={errors?.SearchItem && errors?.SearchItem?.CreateDateBefore && true}
                            convertDate={(date: DateObject) => ConvertCreateBefore(date)}
                            focused={watch('SearchItem.CreateDateBefore.CreateDate') ? true : false}
                        />
                    </Card>
                    <Card shadow className={`p-2 gap-3 w-full lg:w-auto ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <Typography dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[700] text-[14px] mb-2`} variant='h6' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            تاریخ امضاء
                        </Typography>
                        <DateCard
                            {...register(`SearchItem.SignDateAfter.LockDate`)}
                            valueTextField={watch('SearchItem.SignDateAfter.LockDate') ? new DateObject(watch('SearchItem.SignDateAfter.LockDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={watch('SearchItem.SignDateAfter.LockDate') ? new DateObject(watch('SearchItem.SignDateAfter.LockDate')!) : undefined}
                            clearValue={() => {
                                if (watch('SearchItem.SignDateAfter.LockDate')) {
                                    setValue('SearchItem.SignDateAfter.LockDate', '');
                                }
                            }}
                            labelTextField="تاریخ میلادی بعد از"
                            labelDatePickare='تاریخ شمسی بعد از'
                            error={errors?.SearchItem && errors?.SearchItem?.SignDateAfter && true}
                            convertDate={(date: DateObject) => ConvertSignAfter(date)}
                            focused={watch('SearchItem.SignDateAfter.LockDate') ? true : false}
                        />
                        <DateCard
                            {...register('SearchItem.SignDateBefore.LockDate')}
                            valueTextField={watch('SearchItem.SignDateBefore.LockDate') ? new DateObject(watch('SearchItem.SignDateBefore.CreateDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={watch('SearchItem.SignDateBefore.LockDate') ? new DateObject(watch('SearchItem.SignDateBefore.LockDate')!) : undefined}
                            clearValue={() => {
                                if (watch('SearchItem.SignDateBefore.LockDate')) {
                                    setValue('SearchItem.SignDateBefore.LockDate', '');
                                }
                            }}
                            labelTextField="تاریخ میلادی قبل از"
                            labelDatePickare='تاریخ شمسی قبل از'
                            error={errors?.SearchItem && errors?.SearchItem?.SignDateBefore && true}
                            convertDate={(date: DateObject) => ConvertSignBefore(date)}
                            focused={watch('SearchItem.SignDateBefore.LockDate') ? true : false}
                        />
                    </Card>
                    <Card shadow className={`p-2 gap-3 w-full lg:w-auto ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <Typography dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[700] text-[14px] mb-2`} variant='h6' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            تاریخ صادره
                        </Typography>
                        <DateCard
                            {...register('SearchItem.SubmitDateAfter.SubmitDate')}
                            valueTextField={watch('SearchItem.SubmitDateAfter.SubmitDate') ? new DateObject(watch('SearchItem.SubmitDateAfter.SubmitDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={watch('SearchItem.SubmitDateAfter.SubmitDate') ? new DateObject(watch('SearchItem.SubmitDateAfter.SubmitDate')!) : undefined}
                            clearValue={() => {
                                if (watch('SearchItem.SubmitDateAfter.SubmitDate')) {
                                    setValue('SearchItem.SubmitDateAfter.SubmitDate', '');
                                }
                            }}
                            labelTextField="تاریخ میلادی بعد از"
                            labelDatePickare='تاریخ شمسی بعد از'
                            error={errors?.SearchItem && errors?.SearchItem?.SubmitDateAfter && true}
                            convertDate={(date: DateObject) => ConvertSubmitAfter(date)}
                            focused={watch('SearchItem.SubmitDateAfter.SubmitDate') ? true : false}
                        />
                        <DateCard
                            {...register('SearchItem.SubmitDateBefore.SubmitDate')}
                            valueTextField={watch('SearchItem.SubmitDateBefore.SubmitDate') ? new DateObject(watch('SearchItem.SubmitDateBefore.SubmitDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={watch('SearchItem.SubmitDateBefore.SubmitDate') ? new DateObject(watch('SearchItem.SubmitDateBefore.SubmitDate')!) : undefined}
                            clearValue={() => {
                                if (watch('SearchItem.SubmitDateBefore.SubmitDate')) {
                                    setValue('SearchItem.SubmitDateBefore.SubmitDate', '')
                                }
                            }}
                            labelTextField="تاریخ میلادی قبل از"
                            labelDatePickare='تاریخ شمسی قبل از'
                            error={errors?.SearchItem && errors?.SearchItem.SubmitDateBefore && true}
                            convertDate={(date: DateObject) => ConvertSubmitBefore(date)}
                            focused={watch('SearchItem.SubmitDateBefore.SubmitDate') ? true : false}
                        />

                    </Card>
                    <Card shadow className={`p-2 gap-3 w-full lg:w-auto ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <Typography dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[700] text-[14px] mb-2`} variant='h6' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            تاریخ وارده
                        </Typography>
                        <DateCard
                            {...register('SearchItem.ImportSubmitDateAfter.ImportSubmitDate')}
                            valueTextField={watch('SearchItem.ImportSubmitDateAfter.ImportSubmitDate') ? new DateObject(watch('SearchItem.ImportSubmitDateAfter.ImportSubmitDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={watch('SearchItem.ImportSubmitDateAfter.ImportSubmitDate') ? new DateObject(watch('SearchItem.ImportSubmitDateAfter.ImportSubmitDate')!) : undefined}
                            clearValue={() => {
                                if (watch('SearchItem.ImportSubmitDateAfter.ImportSubmitDate')) {
                                    setValue('SearchItem.ImportSubmitDateAfter.ImportSubmitDate', '');
                                }
                            }}
                            labelTextField="تاریخ میلادی بعد از"
                            labelDatePickare='تاریخ شمسی بعد از'
                            error={errors?.SearchItem && errors?.SearchItem?.ImportSubmitDateAfter && true}
                            convertDate={(date: DateObject) => ConvertImportSubmitAfter(date)}
                            focused={watch('SearchItem.ImportSubmitDateAfter.ImportSubmitDate') ? true : false}
                        />
                        <DateCard
                            {...register('SearchItem.ImportSubmitDateBefore.ImportSubmitDate')}
                            valueTextField={watch('SearchItem.ImportSubmitDateBefore.ImportSubmitDate') ? new DateObject(watch('SearchItem.ImportSubmitDateBefore.ImportSubmitDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={watch('SearchItem.ImportSubmitDateBefore.ImportSubmitDate') ? new DateObject(watch('SearchItem.ImportSubmitDateBefore.ImportSubmitDate')!) : undefined}
                            clearValue={() => {
                                if (watch('SearchItem.ImportSubmitDateBefore.ImportSubmitDate')) {
                                    setValue('SearchItem.ImportSubmitDateBefore.ImportSubmitDate', '');
                                }
                            }}
                            labelTextField="تاریخ میلادی قبل از"
                            labelDatePickare='تاریخ شمسی قبل از'
                            error={errors?.SearchItem && errors?.SearchItem?.ImportSubmitDateBefore && true}
                            convertDate={(date: DateObject) => ConvertImportSubmitBefore(date)}
                            focused={watch('SearchItem.ImportSubmitDateBefore.ImportSubmitDate') ? true : false}
                        />
                    </Card>
                </section>
                <section style={{ background: `linear-gradient(to top, ${!themeMode || themeMode?.stateMode ? '#1b2b39' : '#ded6ce'} 50% , transparent)` }} dir='ltr' className='sticky bottom-0 left-10 z-[500]'>
                    <IconButton
                        onClick={() => OnSubmit({ SearchItem: getValues('SearchItem') }, 1)}
                        size='lg' style={{ background: color?.color }} className="rounded-full m-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <SearchIcon
                            className='p-2/4'
                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                    </IconButton>
                </section>
            </form>
        </CardBody >
    )
})
SearchForm.displayName = 'SearchForm'

export default SearchForm