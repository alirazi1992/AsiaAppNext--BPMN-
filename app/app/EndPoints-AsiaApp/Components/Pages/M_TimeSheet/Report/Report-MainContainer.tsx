'use client';
import React, { useEffect, useRef, useState } from 'react'
import MyCustomComponent from '../../../Shared/CustomTheme_Mui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button, CardBody, Tab, Tabs, TabsHeader, Tooltip } from '@material-tailwind/react';
import SearchIcon from '@mui/icons-material/Search';
import colorStore from '@/app/zustandData/color.zustand'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import useStore from '@/app/hooks/useStore';
import themeStore from '@/app/zustandData/theme.zustand'
import { FormControl, FormControlLabel, FormControlLabelProps, Radio, RadioGroup, RadioProps, styled, TextField, useRadioGroup } from '@mui/material';
import { BpRadioCom } from '../../../Shared/RedioButtonMui';
import SelectOption from '../../../Shared/SelectOption';
import { useBranchList } from '@/app/Application-AsiaApp/M_Timesheet/fetchBranchList';
import { GetBranchListModel, loading } from '@/app/Application-AsiaApp/Utils/shared';
import { useAcsUsers } from '@/app/Application-AsiaApp/M_Education/fetchForwardRecievers';
import { GetAcsUsersModel } from '@/app/Domain/M_Education/Participant';
import { ActionMeta, MultiValue } from 'react-select';
import DateCard from '../../../Shared/DateCard';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian"
import persian_en from "react-date-object/locales/persian_en"
import persian_fa from "react-date-object/locales/persian_fa"
import gregorian_en from "react-date-object/locales/gregorian_en";
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import { ReportTimesheet } from '@/app/Domain/M_Timesheet/model';
import { useTimesheetMainbyBranch } from '@/app/Application-AsiaApp/M_Timesheet/fetchTimesheetMainReportByBranch';
import { useTimesheetMainbyPeople } from '@/app/Application-AsiaApp/M_Timesheet/fetchTimesheetMainReportByPeople';
import { useTimesheetbyPeople } from '@/app/Application-AsiaApp/M_Timesheet/fetchTimesheetReportByPeople';
import { useTimesheetbyBranch } from '@/app/Application-AsiaApp/M_Timesheet/fetchTimesheetReportByBranch';
import DisplayReport from './DisplayReport';
import moment from 'jalali-moment';
import { LoadingModel } from '@/app/Domain/shared';
import Loading from '@/app/components/shared/loadingResponse';
import DatePickare from '../../../Shared/DatePickareComponent';


const ReportMainContainer = () => {
    const [activate, setActivate] = useState<string>('main')
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const [totalBranches, setTotalBranches] = useState<GetBranchListModel[]>([])
    const [users, setUsers] = useState<GetAcsUsersModel[]>([])
    const { fetchMainBranchTimesheet } = useTimesheetMainbyBranch()
    const { fetchMainPeopleTimesheet } = useTimesheetMainbyPeople()
    const { fetchPeopleTimesheet } = useTimesheetbyPeople()
    const { fetchBranchTimesheet } = useTimesheetbyBranch()
    const [loadings, setLoadings] = useState<LoadingModel>(loading)
    const viewReport = useRef<{ handleOpen: () => void, setData: (data: string) => void }>(null);

    const schema = yup.object().shape({
        GetTimesheet: yup.object().shape({
            byBranch: yup.bool().required(),
            byMonth: yup.bool().required(),
            branchId: yup.array().of(yup.number()).when('byBranch', ([byBranch], sch) => {
                return byBranch == true
                    ? sch
                        .required('شعب مورد نظر رو انتخاب کنید').min(1, 'انتخاب حداقل یک مورد اجباریست')
                    : sch.nullable().optional().notRequired();
            }),
            peopleId: yup.array().of(yup.string()).when('byBranch', ([byBranch], sch) => {
                return byBranch == false
                    ? sch
                        .required('افراد مورد نظر رو انتخاب کنید').min(1, 'انتخاب حداقل یک مورد اجباریست')
                    : sch.nullable().optional().notRequired();
            }),
            isMain: yup.bool().required(),
            startDate: yup.string().required('تاریخ شروع رو انتخاب کنید'),
            endDate: yup.string().required('تاریخ پایان رو انتخاب کنید'),
        })
    });

    const {
        handleSubmit,
        register,
        control,
        watch,
        reset,
        resetField,
        setValue,
        trigger,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            GetTimesheet: {
                branchId: [],
                peopleId: [],
                byBranch: false,
                byMonth: false,
                isMain: true,
                startDate: '',
                endDate: '',
                // selectMonth: ''
            }
        },
    });

    const { fetchBranchList } = useBranchList()
    const { fetchUsers } = useAcsUsers()



    useEffect(() => {
        const GetBranchList = async () => {
            const res = await fetchBranchList().then((result) => {
                if (result) {
                    setTotalBranches(Array.isArray(result) ? result : [])
                }
            })
        }

        const GetPeopleList = async () => {
            const res = await fetchUsers().then((result) => {
                if (result) {
                    setUsers(Array.isArray(result) ? result : [])
                }

            })
        }
        GetBranchList()
        GetPeopleList()
    }, [])

    const OnSubmit = async () => {
        setLoadings({ ...loadings, response: true })
        let res;
        if (getValues('GetTimesheet.isMain') == true) {
            watch('GetTimesheet.branchId') && watch('GetTimesheet.branchId')!.length > 0 ? res = await fetchMainBranchTimesheet({
                "startDate": watch('GetTimesheet.startDate'),
                "endDate": watch('GetTimesheet.endDate'),
                "branchId": watch('GetTimesheet.branchId')
            }) :
                res = await fetchMainPeopleTimesheet({
                    "startDate": watch('GetTimesheet.startDate'),
                    "endDate": watch('GetTimesheet.endDate'),
                    "peopleId": watch('GetTimesheet.peopleId')
                })
        } else {
            watch('GetTimesheet.branchId') && watch('GetTimesheet.branchId')!.length > 0 ? res = await fetchBranchTimesheet({
                "startDate": watch('GetTimesheet.startDate'),
                "endDate": watch('GetTimesheet.endDate'),
                "branchId": watch('GetTimesheet.branchId')
            }) :
                res = await fetchPeopleTimesheet({
                    "startDate": watch('GetTimesheet.startDate'),
                    "endDate": watch('GetTimesheet.endDate'),
                    "peopleId": watch('GetTimesheet.peopleId')
                })
        }
        if (res) {

            setLoadings({ ...loadings, response: false })
            if (typeof res == 'string' && res !== '') {
                viewReport.current?.handleOpen()
                viewReport?.current?.setData(res)
            }
        }
    }

    return (
        <>
            {loadings.response == true && <Loading />}
            <MyCustomComponent>
                <CardBody className={`w-[98%] my-3 mx-auto rounded-md shadow-lg ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <form
                        dir='rtl'
                        onSubmit={handleSubmit(OnSubmit)}
                        className='relative z-[10]'>
                        <div className="w-max ">
                            <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Get timesheet' placement="top">
                                <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <SearchIcon className='p-1' />
                                </Button>
                            </Tooltip>
                        </div>
                        <section>
                            <Tabs dir="rtl" value="main" className="max-w-[200px] mr-auto mb-3">
                                <TabsHeader
                                    className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'}`}
                                    indicatorProps={{
                                        style: { background: color?.color, color: "white" }, className: `shadow !text-gray-900`,
                                    }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
                                    <Tab style={{ color: watch('GetTimesheet.isMain') == true ? 'white' : '' }} className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} onClick={() => { reset(), setValue('GetTimesheet.isMain', true) }} value="main" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        اصلی
                                    </Tab>
                                    <Tab style={{ color: watch('GetTimesheet.isMain') == false ? 'white' : '' }} className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} onClick={() => { reset(), setValue('GetTimesheet.isMain', false) }} value="timesheet" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        تایم شیت
                                    </Tab>
                                </TabsHeader>
                            </Tabs>
                            <section>
                                <div className='flex'>
                                    <FormControl className='w-[50%] h-full px-2' >
                                        <RadioGroup
                                            row
                                            {...register(`GetTimesheet.byBranch`)}
                                            value={getValues('GetTimesheet.byBranch')}
                                            aria-labelledby="select"
                                            name="select1"
                                            className='font-[FaLight] '
                                        >< FormControlLabel
                                                defaultChecked={(getValues(`GetTimesheet.byBranch`) == true) ? true : false}
                                                onChange={() => { setValue('GetTimesheet.byBranch', true), resetField('GetTimesheet.peopleId') }}
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[FaLight]`}
                                                control={<BpRadioCom />}
                                                label='بر‌اساس شعب'
                                                value={true}
                                            />
                                            < FormControlLabel
                                                defaultChecked={(getValues(`GetTimesheet.byBranch`) == false) ? true : false}
                                                onChange={() => { setValue('GetTimesheet.byBranch', false), resetField('GetTimesheet.branchId') }}
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[FaLight]`}
                                                control={<BpRadioCom />}
                                                label='بر‌اساس افراد'
                                                value={false}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                    {watch('GetTimesheet.byBranch') == true ?
                                        <section className='relative w-full'>
                                            <SelectOption
                                                isMulti={true}
                                                isRtl={false}
                                                className='z-30'
                                                {...register(`GetTimesheet.branchId`)}
                                                placeholder={'براساس شعب'}
                                                loading={totalBranches != undefined ? false : true}
                                                errorType={errors?.GetTimesheet?.branchId}
                                                value={totalBranches == undefined ? null : totalBranches.filter((item: GetBranchListModel) => getValues('GetTimesheet.branchId')?.includes(item.id))}
                                                onChange={(option: MultiValue<GetBranchListModel>, actionMeta: ActionMeta<GetBranchListModel>) => {
                                                    setValue('GetTimesheet.branchId', option!.map((item) => {
                                                        return item.id
                                                    }));
                                                    trigger(`GetTimesheet.branchId`)
                                                }}
                                                options={totalBranches == undefined ? [{
                                                    id: 0, value: 0, label: 'no option found',
                                                    faName: 'no option found',
                                                    name: 'no option found'
                                                }] : totalBranches}
                                            />
                                            <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.GetTimesheet?.branchId && errors?.GetTimesheet?.branchId?.message}</label>
                                        </section>
                                        :
                                        <section className='relative w-full'>
                                            <SelectOption
                                                isRtl={false}
                                                isMulti={true}
                                                className='z-30'
                                                {...register(`GetTimesheet.peopleId`)}
                                                placeholder={'انتخاب بر‌اساس افراد'}
                                                loading={users != undefined ? false : true}
                                                errorType={errors?.GetTimesheet?.peopleId}
                                                value={users == undefined ? null : users.filter((item: GetAcsUsersModel) => getValues('GetTimesheet.peopleId')?.includes(item.id))}
                                                onChange={(option: MultiValue<GetAcsUsersModel>, actionMeta: ActionMeta<GetAcsUsersModel>) => {
                                                    setValue('GetTimesheet.peopleId', option!.map((item) => {
                                                        return item.id
                                                    }));
                                                    trigger(`GetTimesheet.peopleId`)
                                                }}
                                                options={users == undefined ? [{
                                                    id: 0, value: 0, label: 'no option found',
                                                    faName: 'no option found',
                                                    name: 'no option found'
                                                }] : users}
                                            />
                                            <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.GetTimesheet?.peopleId && errors?.GetTimesheet?.peopleId?.message}</label>
                                        </section>
                                    }
                                </div>
                                <div className='flex my-4'>
                                    <FormControl className='w-[50%] h-full px-2' >
                                        <RadioGroup
                                            row
                                            {...register(`GetTimesheet.byMonth`)}
                                            value={getValues('GetTimesheet.byMonth')}
                                            aria-labelledby="select"
                                            name="selet2"
                                            className='font-[FaLight] '
                                        >
                                            < FormControlLabel
                                                defaultChecked={getValues(`GetTimesheet.byMonth`) ? true : false}
                                                onChange={() => {
                                                    setValue('GetTimesheet', {
                                                        ...watch('GetTimesheet'),
                                                        startDate: '',
                                                        endDate: '',
                                                        byMonth: true
                                                    })
                                                }}
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[FaLight]`}
                                                control={<BpRadioCom />}
                                                label='بر‌اساس ماه'
                                                value={true}
                                            />
                                            < FormControlLabel
                                                defaultChecked={getValues('GetTimesheet.byMonth') == false ? true : false}
                                                onChange={() => {
                                                    setValue('GetTimesheet', {
                                                        ...watch('GetTimesheet'),
                                                        startDate: '',
                                                        endDate: '',
                                                        byMonth: false
                                                    })
                                                }}
                                                className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[FaLight]`}
                                                control={<BpRadioCom />}
                                                label='بر‌‌اساس بازه‌ی زمانی'
                                                value={false}
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    {watch('GetTimesheet.byMonth') == false ?
                                        <section className='grid grid-cols-2 gap-x-2 w-full'>
                                            <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='تاریخ شروع ' placement="top">
                                                <div className='p-1 relative'>
                                                    <DatePickare
                                                        register={{ ...register(`GetTimesheet.startDate`) }}
                                                        label='تاریخ شروع '
                                                        value={watch('GetTimesheet.startDate') ? watch('GetTimesheet.startDate') : undefined}
                                                        onChange={(date: DateObject) => {
                                                            setValue('GetTimesheet.startDate', new DateObject({ date, format: 'YYYY-MM-DD' }).convert(persian, persian_en).format())
                                                            trigger('GetTimesheet.startDate')
                                                        }}
                                                        error={errors?.GetTimesheet?.startDate && true}
                                                        focused={watch(`GetTimesheet.startDate`)}
                                                    />
                                                    <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.GetTimesheet && errors?.GetTimesheet!.startDate?.message}</label>
                                                </div>
                                            </Tooltip>
                                            <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='تاریخ شروع همکاری' placement="top">
                                                <div className='p-1 relative'>
                                                    <DatePickare
                                                        register={{ ...register(`GetTimesheet.endDate`) }}
                                                        label='تاریخ پایان '
                                                        value={watch('GetTimesheet.endDate') ? watch('GetTimesheet.endDate') : undefined}
                                                        onChange={(date: DateObject) => {
                                                            setValue('GetTimesheet.endDate', new DateObject({ date, format: 'YYYY-MM-DD' }).convert(persian, persian_en).format())
                                                            trigger('GetTimesheet.endDate')
                                                        }}
                                                        error={errors?.GetTimesheet?.endDate && true}
                                                        focused={watch(`GetTimesheet.endDate`)}
                                                    />
                                                    <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.GetTimesheet && errors?.GetTimesheet!.endDate?.message}</label>
                                                </div>
                                            </Tooltip>

                                        </section>

                                        :
                                        <DatePicker
                                            onlyMonthPicker
                                            render={<TextField
                                                {...register('GetTimesheet.startDate')}
                                                autoComplete='off'
                                                InputProps={{
                                                    style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                }}
                                                sx={{ fontFamily: 'FaLight', width: '100%' }}
                                                className={`w-full lg:my-0 font-[FaLight]`}
                                                dir='ltr'
                                                size='small'
                                                label={'براساس ماه'}
                                            />}
                                            range={false}
                                            onChange={(date: DateObject) =>
                                                setValue('GetTimesheet', {
                                                    ...watch('GetTimesheet'),
                                                    startDate: moment(`${date.year}-${date.month.number}-01`, 'jYYYY-jMM-jDD').format('jYYYY-jMM-jDD'),
                                                    endDate: moment(`${date.year}-${date.month.number}-${date.month.length}`, 'jYYYY-jMM-jDD').format('jYYYY-jMM-jDD')
                                                })
                                            }
                                            calendar={persian}
                                            locale={persian_fa}
                                            plugins={[
                                                // eslint-disable-next-line react/jsx-key
                                                <DatePanel />
                                            ]}
                                        />
                                    }
                                </div>
                            </section>
                        </section>
                    </form>
                </CardBody>
                <DisplayReport ref={viewReport} />
            </MyCustomComponent>
        </>
    )
}

export default ReportMainContainer