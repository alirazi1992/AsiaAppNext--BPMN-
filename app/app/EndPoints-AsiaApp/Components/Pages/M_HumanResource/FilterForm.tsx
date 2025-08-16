'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { Card, CardBody, IconButton } from '@material-tailwind/react';
import TextFieldItem from '../../Shared/TextFieldItem';
import SelectOption from '../../Shared/SelectOption';
import DateCard from '../../Shared/DateCard';
import SearchIcon from '@mui/icons-material/Search';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import { ActionMeta, MultiValue } from 'react-select';
import { FilterResumeModel, GetJobBrancheslistModel, GetJobVacanciesListModel, StateModel } from '@/app/Domain/M_HumanRecourse/ManageResume';
import { DateObject } from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_en from "react-date-object/locales/persian_en";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { ResumeContext } from './MainContainer';
import { useJobBranches } from '@/app/Application-AsiaApp/M_HumanRecourse/fetchJobBranchesList';
import { useJobVacancies } from '@/app/Application-AsiaApp/M_HumanRecourse/fetchJobVacanciesList';

const FilterForm = () => {
    const { fetchJobBranchesList } = useJobBranches()
    const { fetchJobVacancies } = useJobVacancies()
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const { state, setState, SearchResume } = useContext(ResumeContext)
    const schema = yup.object().shape({
        FilterResume: yup.object(({})).nullable(),
    })
    const {
        unregister,
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        watch,
        getValues,
        formState,
        trigger,
    } = useForm<{ FilterResume?: FilterResumeModel }>(
        {
            defaultValues: {
                FilterResume: {
                    isSelect: false
                }
            }, mode: 'all',
            resolver: yupResolver(schema) as unknown as Resolver<{ FilterResume?: FilterResumeModel }>
        }
    );
    const errors = formState.errors;


    const OnSubmit = (data: { FilterResume?: FilterResumeModel }) => {
        SearchResume(data.FilterResume, 1)
        setState((prev: StateModel) => ({ ...prev, items: data.FilterResume }))
    }

    type DatePickareStateModel = {
        format: string;
        gregorian?: string;
        persian?: string;
        date?: DateObject | null;
    }
    const [dateState, setDateState] = useState<{
        DateAfter: DatePickareStateModel,
        DateBefore: DatePickareStateModel,
    }>({
        DateAfter: { format: "YYYY/MM/DD HH:mm:ss" }, DateBefore: { format: "YYYY/MM/DD HH:mm:ss" },
    });

    const ConvertDateAfter = (date: DateObject, format: string = dateState.DateAfter.format) => {
        let object = { date, format };
        setValue('FilterResume.startDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('FilterResume.startDate')
        setDateState(prevState => ({
            ...prevState,
            DateAfter: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }
    const ConvertDateBefore = (date: DateObject, format: string = dateState.DateBefore.format) => {
        let object = { date, format };
        setValue('FilterResume.endDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('FilterResume.endDate')
        setDateState(prevState => ({
            ...prevState,
            DateBefore: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }

    useEffect(() => {
        const loadJobBranches = async () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            let res = await fetchJobBranchesList().then((result: GetJobBrancheslistModel[] | undefined | string) => {
                if (result) {
                    if (Array.isArray(result)) {
                        setState((prev: StateModel) => ({ ...prev, branches: result }))
                    }
                }
            })
        };
        const loadJobVacancies = async () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            let res = await fetchJobVacancies().then((result: GetJobVacanciesListModel[] | undefined | string) => {
                if (result) {
                    if (Array.isArray(result)) {
                        setState((prev: StateModel) => ({ ...prev, vacancies: result }))
                    }
                }
            })
        };
        loadJobBranches()
        loadJobVacancies()
    }, [])

    return (
        <CardBody style={{ outline: 'none' }} tabIndex={0} onKeyDown={(e: React.KeyboardEvent) => (e.key === 'Enter') && handleSubmit(OnSubmit)()} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <form
                dir='rtl'
                onSubmit={handleSubmit(OnSubmit)}
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
                            }} {...register('FilterResume.isSelect')}
                                onChange={(event) => { setValue('FilterResume.isSelect', event.target.checked), trigger() }} />} label="نشان شده ها" />
                    </section>
                    <div className='p-1 relative '>
                        <TextFieldItem label="نام" register={{ ...register(`FilterResume.faName`) }} tabIndex={1} error={errors && errors?.FilterResume?.faName && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem label="نام خانوادگی" register={{ ...register(`FilterResume.faLastname`) }} tabIndex={2} error={errors && errors?.FilterResume?.faLastname && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem label="نام انگلیسی" register={{ ...register(`FilterResume.name`) }} tabIndex={3} error={errors && errors?.FilterResume?.name && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem label="نام خانوادگی انگلیسی" register={{ ...register(`FilterResume.lastname`) }} tabIndex={4} error={errors && errors?.FilterResume?.lastname && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem label="کد ملی" register={{ ...register(`FilterResume.nationalCode`) }} tabIndex={5} error={errors && errors?.FilterResume?.nationalCode && true}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <SelectOption
                            isRtl={false}
                            isMulti={true}
                            className='z-[100]'
                            {...register(`FilterResume.jobVacancyId`)}
                            placeholder={'زمینه شغلی'}
                            loading={state.vacancies != undefined ? false : true}
                            errorType={errors?.FilterResume?.jobVacancyId}
                            onChange={(option: MultiValue<GetJobVacanciesListModel>, actionMeta: ActionMeta<GetJobVacanciesListModel>) => {
                                setValue('FilterResume.jobVacancyId', option!.map((item) => {
                                    return item.id
                                }));
                                trigger(`FilterResume.jobVacancyId`);
                            }}
                            options={state.vacancies == undefined ? [{
                                id: 0, value: 0, label: 'no option found',
                                faName: 'no option found',
                                name: 'no option found'
                            }] : state.vacancies}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <SelectOption
                            isRtl={false}
                            isMulti={true}
                            className='z-[95]'
                            {...register(`FilterResume.jobBranchId`)}
                            placeholder={'محل خدمت'}
                            loading={state.branches != undefined ? false : true}
                            errorType={errors?.FilterResume?.jobBranchId}
                            onChange={(option: MultiValue<GetJobBrancheslistModel>, actionMeta: ActionMeta<GetJobBrancheslistModel>) => {
                                setValue('FilterResume.jobBranchId', option.map((item) => {
                                    return item.id
                                }));
                                trigger(`FilterResume.jobBranchId`);
                            }}
                            options={state.branches == undefined ? [{
                                id: 0, value: 0, label: 'no option found',
                                faName: 'no option found',
                                name: 'no option found'
                            }] : state.branches}
                        />
                    </div>
                    <Card shadow className={`p-2 gap-3 w-full lg:w-auto ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <DateCard
                            {...register(`FilterResume.startDate`)}
                            valueTextField={watch(`FilterResume.startDate`) ? new DateObject(watch('FilterResume.startDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={dateState.DateAfter.date}
                            clearValue={() => {
                                if (watch(`FilterResume.startDate`)) {
                                    setValue(`FilterResume.startDate`, '');
                                    setDateState(prevState => ({
                                        ...prevState,
                                        DateAfter: {
                                            ...prevState.DateAfter,
                                            gregorian: '',
                                            persian: '',
                                            date: null
                                        }
                                    }))
                                }
                            }}
                            labelTextField="تاریخ میلادی بعد از"
                            labelDatePickare='تاریخ شمسی بعد از'
                            error={errors?.FilterResume && errors?.FilterResume?.startDate && true}
                            convertDate={(date: DateObject) => ConvertDateAfter(date)}
                            focused={watch(`FilterResume.startDate`) ? true : false}
                        />
                        <DateCard
                            {...register(`FilterResume.endDate`)}
                            valueTextField={watch('FilterResume.endDate') ? new DateObject(watch(`FilterResume.endDate`)!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={dateState.DateBefore.date}
                            clearValue={() => {
                                if (watch(`FilterResume.endDate`)) {
                                    setValue(`FilterResume.endDate`, '');
                                    setDateState(prevState => ({
                                        ...prevState,
                                        DateBefore: {
                                            ...prevState.DateBefore,
                                            gregorian: '',
                                            persian: '',
                                            date: null
                                        }
                                    }))
                                }
                            }}
                            labelTextField="تاریخ میلادی قبل از"
                            labelDatePickare='تاریخ شمسی قبل از'
                            error={errors?.FilterResume && errors?.FilterResume.endDate && true}
                            convertDate={(date: DateObject) => ConvertDateBefore(date)}
                            focused={watch(`FilterResume.endDate`) ? true : false}
                        />
                    </Card>
                </section>
                <section style={{ background: `linear-gradient(to top, ${!themeMode || themeMode?.stateMode ? '#1b2b39' : '#ded6ce'} 50% , transparent)` }} dir='ltr' className='sticky bottom-0 left-10 z-[80] bg-red-400'>
                    <IconButton
                        type='submit' size='lg' style={{ background: color?.color }} className="rounded-full m-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <SearchIcon
                            className='p-2/4'
                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                    </IconButton>
                </section>
            </form>
        </CardBody >
    )
}

export default FilterForm