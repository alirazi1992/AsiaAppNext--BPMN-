'use client';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Button, CardBody, Tooltip } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import SearchIcon from '@mui/icons-material/Search';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import { DateObject } from 'react-multi-date-picker';
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import DateCard from '../../../Shared/DateCard';
import { LoadingModel } from '@/app/Domain/shared';
import { ArchiveSerachContext } from './Archive-MainContainer';
import { GetCategoriesModel, SearchArchiveModel } from '@/app/Domain/M_History/Archive';
import SelectOption from '../../../Shared/SelectOption';
import { useList } from '@/app/Application-AsiaApp/M_History/fetchCategoriesList';
import { ActionMeta, SingleValue } from 'react-select';
import { useArchive } from '@/app/Application-AsiaApp/M_History/fetchHistoryArchive';
import TextFieldItem from '../../../Shared/TextFieldItem';


const SearchHistory = forwardRef((props: any, ref) => {
    const { fetchHArchive } = useArchive()
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [categories, setCategories] = useState<GetCategoriesModel[]>([])
    const { setState, setLoadings, setPage } = useContext(ArchiveSerachContext)
    const { fetchCategoriesList } = useList()

    const schema = yup.object().shape({
        SearchArchive: yup.object(({
            vesselName: yup.string().optional(),
            AsiaCode: yup.string().optional(),
            sender: yup.string().optional(),
            comment: yup.string().optional(),
            receiver: yup.string().optional(),
            subject: yup.string().optional(),
            RegNo: yup.string().optional(),
            DocNo: yup.string().optional(),
            archiveStartDate: yup.string().optional(),
            archiveEndDate: yup.string().optional(),
            archiveCategoryId: yup.number().optional().nullable(),
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
    } = useForm<SearchArchiveModel>(
        {
            defaultValues: {
                SearchArchive: {
                    vesselName: '',
                    sender: '',
                    subject: '',
                    RegNo: '',
                    receiver: '',
                    comment: '',
                    AsiaCode: '',
                    DocNo: '',
                    archiveStartDate: '',
                    archiveEndDate: '',
                    archiveCategoryId: null
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;

    useImperativeHandle(ref, () => ({
        OnSubmit: (num: number) => {
            OnSubmit(num, { SearchArchive: getValues('SearchArchive') })
        }
    }))

    const OnSubmit = async (page: number, data: SearchArchiveModel) => {
        setPage(page)
        if (!errors.SearchArchive) {
            setLoadings((prev: LoadingModel) => ({ ...prev, respone: true }))
            const res = await fetchHArchive(page, data).then((result) => {
                if (result) {
                    setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                    typeof result == 'object' && 'hArchives' in result ? result.hArchives.length > 0 ? setState(result) :
                        setState({
                            pageNo: 0,
                            totalCount: 0,
                            hArchives: []
                        }) : undefined
                }
            })
        }
    }

    // useEffect(() => {
    //     const searchTabValues = getValues('SearchArchive');
    //     if (page > 0) OnSubmit({ SearchArchive: searchTabValues } as SearchArchiveModel);
    // }, [page]);

    const ConvertStartDate = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchArchive.archiveStartDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('SearchArchive.archiveStartDate')
    }
    const ConvertFinishDate = (date: DateObject, format: string = "YYYY/MM/DD HH:mm:ss") => {
        let object = { date, format };
        setValue('SearchArchive.archiveEndDate', new DateObject(object).convert(gregorian, gregorian_en).format())
        trigger('SearchArchive.archiveEndDate')
    }

    useEffect(() => {
        const loadCategories = async () => {

            const res = await fetchCategoriesList().then((result) => {
                if (result) {
                    if (Array.isArray(result)) {
                        setCategories(result);
                    } else {
                        setCategories([]);
                    }
                }
            })
        };
        loadCategories();
    }, [])

    return (
        <MyCustomComponent>
            <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} p-0`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                    dir='rtl'
                    // onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10] w-full'>
                    <div className="w-max ">
                        <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Search History Archive' placement="top">
                            <Button onClick={() => OnSubmit(1, { SearchArchive: getValues('SearchArchive') } as SearchArchiveModel)} size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SearchIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <section className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-x-1 w-full gap-y-4 my-2'>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='نام شناور' register={{ ...register(`SearchArchive.vesselName`) }} tabIndex={1}
                                error={errors && errors?.SearchArchive?.vesselName && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='RegNo' register={{ ...register(`SearchArchive.RegNo`) }} tabIndex={2}
                                error={errors && errors?.SearchArchive?.RegNo && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='AsiaCode' register={{ ...register(`SearchArchive.AsiaCode`) }} tabIndex={3}
                                error={errors && errors?.SearchArchive?.AsiaCode && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='موضوع' register={{ ...register(`SearchArchive.subject`) }} tabIndex={4}
                                error={errors && errors?.SearchArchive?.subject && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='شماره مدرک' register={{ ...register(`SearchArchive.DocNo`) }} tabIndex={5}
                                error={errors && errors?.SearchArchive?.DocNo && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='فرستنده' register={{ ...register(`SearchArchive.sender`) }} tabIndex={6}
                                error={errors && errors?.SearchArchive?.sender && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='گیرنده' register={{ ...register(`SearchArchive.receiver`) }} tabIndex={7}
                                error={errors && errors?.SearchArchive?.receiver && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='توضیحات' register={{ ...register(`SearchArchive.comment`) }} tabIndex={8}
                                error={errors && errors?.SearchArchive?.comment && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1'>
                            <SelectOption
                                {...register(`SearchArchive.archiveCategoryId`)}
                                placeholder={'Categories'}
                                className='z-[7468465436154635464]'
                                loading={categories != undefined ? false : true}
                                value={categories == undefined ? null : categories!.find((item: GetCategoriesModel) => item.id == getValues('SearchArchive.archiveCategoryId')) ? categories!.find((item: GetCategoriesModel) => item.id == getValues('SearchArchive.archiveCategoryId')) : null}
                                errorType={errors?.SearchArchive?.archiveCategoryId}
                                onChange={(option: SingleValue<GetCategoriesModel>, actionMeta: ActionMeta<GetCategoriesModel>) => {
                                    setValue(`SearchArchive.archiveCategoryId`, option!.id);
                                    trigger(`SearchArchive.archiveCategoryId`);
                                }}
                                options={categories == undefined ? [{
                                    id: 0, value: 0, label: 'no option found',
                                    faName: 'no option found',
                                    name: 'no option found'
                                }] : categories}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 md:col-span-4 lg:col-span-2'>
                            <DateCard
                                {...register(`SearchArchive.archiveStartDate`)}
                                valueTextField={watch('SearchArchive.archiveStartDate') ? new DateObject(watch('SearchArchive.archiveStartDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                                valueDatePickare={watch('SearchArchive.archiveStartDate') ? new DateObject(watch('SearchArchive.archiveStartDate')!) : undefined}
                                clearValue={() => {
                                    if (watch('SearchArchive.archiveStartDate')) {
                                        setValue('SearchArchive.archiveStartDate', '');
                                    }
                                }}
                                labelTextField='تاریخ شروع میلادی'
                                labelDatePickare='تاریخ شروع شمسی'
                                error={errors?.SearchArchive && errors?.SearchArchive.archiveStartDate && true}
                                convertDate={(date: DateObject) => ConvertStartDate(date)}
                                focused={watch('SearchArchive.archiveStartDate') ? true : false}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 md:col-span-4 lg:col-span-2 '>
                            <DateCard
                                {...register(`SearchArchive.archiveEndDate`)}
                                valueTextField={watch('SearchArchive.archiveEndDate') ? new DateObject(watch('SearchArchive.archiveEndDate')!).convert(gregorian, gregorian_en).format('YYYY/MM/DD HH:mm:ss') : ''}
                                valueDatePickare={watch('SearchArchive.archiveEndDate') ? new DateObject(watch('SearchArchive.archiveEndDate')!) : undefined}
                                clearValue={() => {
                                    if (watch('SearchArchive.archiveEndDate')) {
                                        setValue('SearchArchive.archiveEndDate', '');
                                    }
                                }}
                                labelTextField="تاریخ پایان میلادی"
                                labelDatePickare='تاریخ پایان شمسی'
                                error={errors?.SearchArchive && errors?.SearchArchive.archiveEndDate && true}
                                convertDate={(date: DateObject) => ConvertFinishDate(date)}
                                focused={watch('SearchArchive.archiveEndDate') ? true : false}
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