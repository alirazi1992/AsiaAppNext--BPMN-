'use client';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Button, CardBody, Tooltip } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import { DateObject } from 'react-multi-date-picker';
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import DateCard from '../../../Shared/DateCard';
import { SearchItemsModel } from '@/app/Domain/M_History/Tabs';
import { useTabs } from '@/app/Application-AsiaApp/M_History/fetchHistoryTabs';
import { HistorySerachContext } from './MainContainer';
import { LoadingModel } from '@/app/Domain/shared';


const SearchHistory = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const { setState, setLoadings, setPage } = useContext(HistorySerachContext)
    const schema = yup.object().shape({
        SearchTab: yup.object(({
            customerName: yup.string().optional(),
            nationaCode: yup.string().optional(),
            tabCodeId: yup.string().optional(),
            tabStartDate: yup.string().optional(),
            tabEndDate: yup.string().optional()
        })).required(),
    })

    const { fetchHistoryTabs } = useTabs()
    const {
        register,
        handleSubmit,
        reset,
        trigger,
        getValues,
        watch,
        setValue,
        formState,
    } = useForm<SearchItemsModel>(
        {
            defaultValues: {
                SearchTab: {
                    customerName: '',
                    nationaCode: '',
                    tabCodeId: '',
                    tabStartDate: '',
                    tabEndDate: ''
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;

    useImperativeHandle(ref, () => ({
        OnSubmit: (num: number) => {
            OnSubmit(num, { SearchTab: getValues('SearchTab') })
        }
    }))

    const OnSubmit = async (page: number, data: SearchItemsModel) => {
        if (!errors.SearchTab) {
            setPage(page)
            setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
            const res = await fetchHistoryTabs(page, data.SearchTab).then((result) => {
                if (result) {
                    setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                    typeof result == 'object' && 'tabs' in result ? result.tabs.length > 0 ? setState(result) :
                        setState({
                            pageNo: 0,
                            totalCount: 0,
                            tabs: []
                        }) : undefined
                }
            })
        }
    }

    const ConvertStartDate = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchTab.tabStartDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('SearchTab.tabStartDate')
    }
    const ConvertFinishDate = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchTab.tabEndDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('SearchTab.tabEndDate')
    }

    return (
        <MyCustomComponent>
            <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} p-0`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                    dir='rtl'
                    // onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10] w-full'>
                    <div className="w-max ">
                        <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Search Course program' placement="top">
                            <Button onClick={() => OnSubmit(1, { SearchTab: getValues('SearchTab') })} size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SearchIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <section className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-x-1 w-full gap-y-4 my-2'>
                        <div className='p-1 relative col-span-1 '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`SearchTab.customerName`)}
                                tabIndex={1}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='rtl'
                                size='small'
                                label='نام مالک'
                                InputProps={{
                                    style: { color: errors?.SearchTab?.customerName ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`SearchTab.nationaCode`)}
                                tabIndex={2}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='rtl'
                                size='small'
                                label='کدملی مالک'
                                InputProps={{
                                    style: { color: errors?.SearchTab?.nationaCode ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextField
                                autoComplete='off'
                                sx={{ fontFamily: 'FaLight' }}
                                {...register(`SearchTab.tabCodeId`)}
                                tabIndex={3}
                                className='w-full lg:my-0 font-[FaLight]'
                                dir='rtl'
                                size='small'
                                label='شماره صورتحساب'
                                InputProps={{
                                    style: { color: errors?.SearchTab?.tabCodeId ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                }}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 md:col-span-4 lg:col-span-2'>
                            <DateCard
                                {...register(`SearchTab.tabStartDate`)}
                                valueTextField={watch('SearchTab.tabStartDate') ? new DateObject(watch('SearchTab.tabStartDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                                valueDatePickare={watch('SearchTab.tabStartDate') ? new DateObject(watch('SearchTab.tabStartDate')!) : undefined}
                                clearValue={() => {
                                    if (watch('SearchTab.tabStartDate')) {
                                        setValue('SearchTab.tabStartDate', '');
                                    }
                                }}
                                labelTextField='تاریخ شروع میلادی'
                                labelDatePickare='تاریخ شروع شمسی'
                                error={errors?.SearchTab && errors?.SearchTab.tabStartDate && true}
                                convertDate={(date: DateObject) => ConvertStartDate(date)}
                                focused={watch('SearchTab.tabStartDate') ? true : false}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 md:col-span-4 lg:col-span-2 '>
                            <DateCard
                                {...register(`SearchTab.tabEndDate`)}
                                valueTextField={watch('SearchTab.tabEndDate') ? new DateObject(watch('SearchTab.tabEndDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                                valueDatePickare={watch('SearchTab.tabEndDate') ? new DateObject(watch('SearchTab.tabEndDate')!) : undefined}
                                clearValue={() => {
                                    if (watch('SearchTab.tabEndDate')) {
                                        setValue('SearchTab.tabEndDate', '');
                                    }
                                }}
                                labelTextField="تاریخ پایان میلادی"
                                labelDatePickare='تاریخ پایان شمسی'
                                error={errors?.SearchTab && errors?.SearchTab.tabEndDate && true}
                                convertDate={(date: DateObject) => ConvertFinishDate(date)}
                                focused={watch('SearchTab.tabEndDate') ? true : false}
                            />
                        </div>
                    </section>
                </form>
            </CardBody>
        </MyCustomComponent >
    )
})
SearchHistory.displayName = 'SearchHistory'
export default SearchHistory