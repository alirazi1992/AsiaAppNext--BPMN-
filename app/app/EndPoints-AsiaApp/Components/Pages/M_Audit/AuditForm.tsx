'use client'
import React, { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from 'react'
import { Card, CardBody, IconButton } from '@material-tailwind/react'
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import colorStore from '@/app/zustandData/color.zustand';
import * as yup from "yup";
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectOption from '../../Shared/SelectOption';
import { ActionMeta, SingleValue } from 'react-select';
import SearchIcon from '@mui/icons-material/Search';
import { DateObject } from "react-multi-date-picker";
import "react-multi-date-picker/styles/layouts/mobile.css"
import persian from "react-date-object/calendars/persian"
import persian_en from "react-date-object/locales/persian_en";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import "react-multi-date-picker/styles/backgrounds/bg-gray.css"
import { AuditContext } from './MainContainer';
import TextFieldItem from '../../Shared/TextFieldItem';
import DateCard from '../../Shared/DateCard';
import { FilterItemsModdel, GetActionsModel, GetActorsModel, GetModulesModel, GetSourceListModel, InitializeState } from '@/app/Domain/M_Audit/logTable';
import { useAuditActionList } from '@/app/Application-AsiaApp/M_Audit/fetchActionsList';
import { useAuditActors } from '@/app/Application-AsiaApp/M_Audit/fetchActors';
import { useAuditModules } from '@/app/Application-AsiaApp/M_Audit/fetchModules';
import { useAuditSourseList } from '@/app/Application-AsiaApp/M_Audit/fetchSourceList';
import { initialStateAudit } from '@/app/Application-AsiaApp/Utils/M_Audit/data';

const AuditForm = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [data, setData] = useState<InitializeState>(initialStateAudit)
    const { fetchActionList } = useAuditActionList()
    const { fetchActors } = useAuditActors()
    const { fetchModules } = useAuditModules()
    const { fetchSourceList } = useAuditSourseList()

    const { GetLogs, setItem } = useContext(AuditContext)
    const schema = yup.object().shape({
        Audit: yup.object().shape({
            actorId: yup.number().required('اجباری'),
            actionId: yup.number().required('اجباری').min(1, 'اجباری'),
            sourceId: yup.number().required('اجباری').min(1, 'اجباری'),
            moduleId: yup.number().required('اجباری').min(1, 'اجباری'),
            startDate: yup.string(),
            endDate: yup.string(),
            searchText: yup.string(),
        })
    }).required()
    const {
        register,
        handleSubmit,
        reset,
        watch,
        resetField,
        getValues,
        trigger,
        setValue,
        formState,
    } = useForm<FilterItemsModdel>(
        {
            defaultValues: {
                Audit: {
                    actorId: 0,
                    actionId: 0,
                    moduleId: 0,
                    sourceId: 0,
                    startDate: '',
                    endDate: '',
                    searchText: ''
                }
            }, mode: 'all',
            resolver: yupResolver(schema) as Resolver<FilterItemsModdel>
        }
    );

    const errors = formState.errors;

    const GetSourceList = useCallback(async (id: number) => {
        const res = await fetchSourceList(id).then((res) => {
            if (res) {
                if (Array.isArray(res)) {
                    setValue('Audit.sourceId', res![0].id),
                        GetActionList(res![0].id),
                        setData((prev) => ({ ...prev, sourceList: res }))
                } else {
                    setData((prev) => ({ ...prev, sourceList: [], actionList: [] }))
                    setValue('Audit.sourceId', 0)
                    setValue('Audit.actionId', 0)
                }
            }
        })
    }, [fetchSourceList, setValue])

    const GetActionList = useCallback(async (id: number) => {
        const res = await fetchActionList(id).then((res) => {
            if (res) {
                Array.isArray(res) && res.length > 0 ? setValue('Audit.actionId', res![0].id) : setValue('Audit.actionId', 0)
                setData((prev) => ({ ...prev, actionList: Array.isArray(res) && res.length > 0 ? res : [] }))
            }
        })
    }, [fetchActionList, setValue])

    useEffect(() => {
        const loadInitialActors = async () => {
            const res = await fetchActors().then(res => {
                if (res) {
                    setData((prev) => ({ ...prev, actors: Array.isArray(res) ? res : [] }));
                }
            })
            const remodule = await fetchModules().then(res => {
                if (res) {
                    setData((prev) => ({ ...prev, modules: Array.isArray(res) ? res : [] }));
                }
            })
        };
        loadInitialActors();
    }, [])
    useImperativeHandle(ref, () => ({
        reset: () => {
            reset()
            setData((prev) => ({ ...prev, actionList: [], sourceList: [] }));
            setValue('Audit.moduleId', 0)
        },
    }));

    type DatePickareStateModel = {
        format: string;
        gregorian?: string;
        persian?: string;
        date?: DateObject | null;
    }
    const [state, setState] = useState<{
        DateAfter: DatePickareStateModel,
        DateBefore: DatePickareStateModel,
    }>({
        DateAfter: { format: "YYYY/MM/DD HH:mm:ss" }, DateBefore: { format: "YYYY/MM/DD HH:mm:ss" },
    });

    const ConvertDateAfter = (date: DateObject, format: string = state.DateAfter.format) => {
        let object = { date, format };
        setValue('Audit.startDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('Audit.startDate')
        setState(prevState => ({
            ...prevState,
            DateAfter: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }
    const ConvertDateBefore = (date: DateObject, format: string = state.DateBefore.format) => {
        let object = { date, format };
        setValue('Audit.endDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('Audit.endDate')
        setState(prevState => ({
            ...prevState,
            DateBefore: {
                gregorian: new DateObject(object).format(),
                persian: new DateObject(object).convert(persian, persian_en).format(),
                ...object
            }
        }))
    }


    const OnSubmit = async (data: FilterItemsModdel) => {
        setItem(data.Audit);
        GetLogs(1, data.Audit);
    }

    return (

        <CardBody style={{ outline: 'none' }} tabIndex={0} onKeyDown={(e: React.KeyboardEvent) => (e.key === 'Enter') && handleSubmit(OnSubmit)()}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <form
                dir='rtl'
                onSubmit={handleSubmit(OnSubmit)}
                className='relative z-[10]'>
                <section className='grid grid-cols-1 gap-y-3 my-1'>
                    <div className='p-1 relative '>
                        <SelectOption
                            isRtl={false}
                            className='z-50'
                            {...register(`Audit.actorId`)}
                            placeholder={'انتخاب'}
                            loading={data.actors != undefined ? false : true}
                            value={data.actors == undefined ? null : data.actors!.find((item: GetActorsModel) => item.value == getValues('Audit.actorId')) ? data.actors!.find((item: GetActorsModel) => item.value == getValues('Audit.actorId')) : 0}
                            errorType={errors?.Audit?.actorId}
                            onChange={(option: SingleValue<GetActorsModel>, actionMeta: ActionMeta<GetActorsModel>) => {
                                setValue(`Audit.actorId`, option!.value);
                                trigger(`Audit.actorId`);
                            }}
                            options={data.actors == undefined ? [{
                                id: 0, value: 0, label: 'no option found',
                                faName: 'no option found',
                                name: 'no option found'
                            }] : data.actors}
                        />
                    </div>
                    <div className='p-1 relative '>
                        <SelectOption
                            isRtl={false}
                            className='z-40'
                            {...register(`Audit.moduleId`)}
                            placeholder={'انتخاب ماژول'}
                            loading={data.modules != undefined ? false : true}
                            value={data.modules?.find((item: GetModulesModel) => item.id === getValues('Audit.moduleId')) ? data.modules?.find((item: GetModulesModel) => item.id === getValues('Audit.moduleId')) : null}
                            errorType={errors?.Audit?.moduleId}
                            onChange={(option: SingleValue<GetModulesModel>, actionMeta: ActionMeta<GetModulesModel>) => {
                                GetSourceList(option!.id)
                                setValue(`Audit.moduleId`, option!.id);
                                trigger(`Audit.moduleId`)
                            }}
                            options={data.modules == undefined ? [{
                                id: 0, value: 0, label: 'no option found',
                                faName: 'no option found',
                                name: 'no option found'
                            }] : data.modules}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.Audit && errors?.Audit.moduleId?.message}</label>
                    </div>
                    <div className='p-1 relative '>
                        <SelectOption
                            isRtl={false}
                            className='z-30'
                            {...register(`Audit.sourceId`)}
                            placeholder={'انتخاب صفحه'}
                            loading={data.sourceList != undefined ? false : true}
                            value={data.sourceList?.find((item: GetSourceListModel) => item.id === getValues('Audit.sourceId')) ? data.sourceList?.find((item: GetSourceListModel) => item.id === getValues('Audit.sourceId')) : null}
                            errorType={errors?.Audit?.sourceId}
                            onChange={(option: SingleValue<GetSourceListModel>, actionMeta: ActionMeta<GetSourceListModel>) => {
                                setValue(`Audit.sourceId`, option!.id);
                                GetActionList(option!.id)
                                trigger(`Audit.sourceId`);
                            }}
                            options={data.sourceList == undefined ? [{
                                id: 0, value: 0, label: 'no option found',
                                faName: 'no option found',
                                name: 'no option found'
                            }] : data.sourceList}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.Audit && errors?.Audit.sourceId?.message}</label>
                    </div>
                    <div className='p-1 relative '>
                        <SelectOption
                            isRtl={false}
                            className='z-20'
                            {...register(`Audit.actionId`)}
                            placeholder={'انتخاب فعالیت'}
                            loading={data.actionList != undefined ? false : true}
                            value={data.actionList?.find((item: GetActionsModel) => item.id === getValues('Audit.actionId')) ? data.actionList?.find((item: GetActionsModel) => item.id === getValues('Audit.actionId')) : null}
                            errorType={errors?.Audit?.actionId}
                            onChange={(option: SingleValue<GetActionsModel>, actionMeta: ActionMeta<GetActionsModel>) => {
                                setValue(`Audit.actionId`, option!.id);
                                trigger(`Audit.actionId`);
                            }}
                            options={data.actionList == undefined ? [{
                                id: 0, value: 0, label: 'no option found',
                                faName: 'no option found',
                                name: 'no option found'
                            }] : data.actionList}
                        />
                        <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.Audit && errors?.Audit.actionId?.message}</label>
                    </div>
                    <div className='p-1 relative '>
                        <TextFieldItem
                            label="توضیحات"
                            register={{ ...register(`Audit.searchText`) }}
                            tabIndex={9}
                            error={errors && errors?.Audit?.searchText && true}
                        />
                    </div>
                    <Card shadow className={`p-2 gap-3 w-full lg:w-auto ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <DateCard
                            {...register(`Audit.startDate`)}
                            valueTextField={watch('Audit.startDate') ? new DateObject(watch('Audit.startDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={state.DateAfter.date}
                            clearValue={() => {
                                if (watch('Audit.startDate')) {
                                    setValue('Audit.startDate', '');
                                    setState(prevState => ({
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
                            error={errors?.Audit && errors?.Audit?.endDate && true}
                            convertDate={(date: DateObject) => ConvertDateAfter(date)}
                            focused={watch('Audit.startDate') ? true : false}
                        />
                        <DateCard
                            {...register(`Audit.endDate`)}
                            valueTextField={watch('Audit.endDate') ? new DateObject(watch('Audit.endDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                            valueDatePickare={state.DateBefore.date}
                            clearValue={() => {
                                if (watch('Audit.endDate')) {
                                    setValue('Audit.endDate', '');
                                    setState(prevState => ({
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
                            error={errors?.Audit && errors?.Audit.startDate && true}
                            convertDate={(date: DateObject) => ConvertDateBefore(date)}
                            focused={watch('Audit.endDate') ? true : false}
                        />
                    </Card>
                </section>
                <section style={{ background: `linear-gradient(to top, ${!themeMode ||themeMode?.stateMode ? '#1b2b39' : '#ded6ce'} 50% , transparent)` }} dir='ltr' className='sticky bottom-0 left-10 my-28 z-[500] '>
                    <IconButton
                        type='submit' size='lg' style={{ background: color?.color }} className="rounded-full m-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
AuditForm.displayName = 'AuditForm'

export default AuditForm