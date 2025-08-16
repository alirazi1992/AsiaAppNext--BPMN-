'use client';
import React, { createContext, useRef, useState } from 'react'
import DefineTimesheet from './Timesheet'
import EnterdataList from './EnterdataList';
import MyCustomComponent from '../../../Shared/CustomTheme_Mui';
import SubgroupList from './SubgroupList';
import SaveIcon from '@mui/icons-material/Save';
import { GetTimeSheetSumValuesModel, GetUnderneathUserNamesModel, GetUserTimesheetDetails, TimesheetDetailsModel } from '@/app/Domain/M_Timesheet/model';
import themeStore from '@/app/zustandData/theme.zustand'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { DateObject } from 'react-multi-date-picker';
import { Button } from '@material-tailwind/react';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { FormControlLabel } from '@mui/material';
import { ConfirmTimesheet } from '@/app/Application-AsiaApp/M_Timesheet/ConfirmTimeSheet';
import { InsertingTimeSheetDetails } from '@/app/Application-AsiaApp/M_Timesheet/InsertTimeSheetDetail';
import useLoginUserInfo from '@/app/zustandData/useLoginUserInfo';
import Switches from '../../../Shared/SwitchMuiComponent';
import { LoadingModel } from '@/app/Domain/shared';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import Loading from '@/app/components/shared/loadingResponse';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import CustomizedSearched from '../../../Shared/SearchComponent';

interface EnterDataContextModel {
  setDays: (days: any) => void;
  days: [];
  call: boolean;
  setCall: any;
  setSubgroupList: (subgroupList: GetUnderneathUserNamesModel[]) => void;
  subgroupList: GetUnderneathUserNamesModel[],
  setValue: any,
  getValues: any,
  register: any,
  calendarRef: any,
  watch: any,
  control: any,
  initialData: GetUserTimesheetDetails,
  loadings: LoadingModel,
  setLoadings: any,
  resetField: any,
  selected: string,
  setSelected: any,
  date: DateObject,
  setDate: any,
  errors: any
  setInitialData: (initialData: GetUserTimesheetDetails) => void
}

export const EnterDataContext = createContext<EnterDataContextModel>({
  days: [],
  setSelected: () => { },
  selected: '',
  setDays: () => { },
  call: false,
  setCall: () => { },
  resetField: () => { },
  setSubgroupList: () => { },
  subgroupList: [],
  setValue: () => { },
  control: () => { },
  getValues: () => ({}),
  register: () => ({}),
  watch: () => ({}),
  calendarRef: null,
  initialData: { details: [], masterId: 0, isConfirmed: false },
  setInitialData: () => { },
  loadings: { iframeLoading: false, response: false, table: false },
  setLoadings: () => { },
  date: new DateObject().setLocale(persian_fa).setCalendar(persian),
  setDate: () => { },
  errors: null
}
)

const EnterDataMainContainer = () => {
  const themeMode = useStore(themeStore, (state) => state)
  const [initialData, setInitialData] = useState<GetUserTimesheetDetails>({ masterId: 0, details: [], isConfirmed: false })
  const color = useStore(colorStore, (state) => state)
  // const [checked, setChecked] = useState<boolean>(false)
  const [call, setCall] = useState<boolean>(false)
  const { Confirm } = ConfirmTimesheet()
  const [date, setDate] = useState(new DateObject().setLocale(persian_fa).setCalendar(persian));
  const { InsertTimeSheetDetail } = InsertingTimeSheetDetails()
  const [loadings, setLoadings] = useState<LoadingModel>(loading)
  const calendarRef = useRef<{ date: DateObject; set: (key: string, value: number) => void } | null>(null);
  const [days, setDays] = useState<any>([])
  const [subgroupList, setSubgroupList] = useState<GetUnderneathUserNamesModel[]>([])
  const CurrentUser = useLoginUserInfo.getState();
  const [selected, setSelected] = useState<string>('')
  const schema = yup.object().shape({
    times: yup.array().of(
      yup.array().of(
        yup.object<TimesheetDetailsModel>().shape({
          time: yup.string().optional(),
          boundryItemId: yup.number().optional(),
          timeSpendDate: yup.string().optional(),

        })
      )
    ),
    totalTime: yup.array().of(
      yup.array().of(
        yup.object<GetTimeSheetSumValuesModel>().shape({
          day: yup.number().optional(),
          totalSumValue: yup.string().optional(),
          totalStandardValue: yup.string().optional(),
          totalOverWorkValue: yup.string().optional(),
          totalWorkDeductionValue: yup.string().optional()

        })
      )
    )
  });

  const {
    handleSubmit,
    register,
    control,
    watch,
    resetField,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      times: initialData.details
    },
  });



  const OnSubmit = async (data: any) => {
    setLoadings({ ...loadings, response: true })
    const res = await InsertTimeSheetDetail(
      watch(`times`)?.flat().filter((item: any) => item.time !== "")
      , initialData.masterId).then((result) => {
        if (result) {
          setLoadings({ ...loadings, response: false })
          setCall(true)
        }
      })
  }

  const ManagementApproval = async () => {
    setLoadings({ ...loadings, response: true })
    const res = await Confirm(initialData.masterId, initialData.isConfirmed).then((result) => {
      if (result) {
        setLoadings({ ...loadings, response: false })
        result == true ? setInitialData({ ...initialData, isConfirmed: !initialData.isConfirmed }) : null
      }
    })
  }

  return (
    <>
      {loadings.response == true && <Loading />}
      <EnterDataContext.Provider value={{
        selected, setSelected,
        date, setDate, resetField,
        loadings, setLoadings,
        control, call, setCall, errors, initialData, watch, setInitialData, calendarRef, setDays, days, subgroupList, setSubgroupList, setValue, getValues, register
      }}>
        <MyCustomComponent>
          <DefineTimesheet />
        </MyCustomComponent>
        <MyCustomComponent dir='ltr'>
          <form className='w-full relative' onSubmit={handleSubmit(OnSubmit)} >
            <section className=' px-3'>
              <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <SaveIcon className='p-1' />
              </Button>
              {CurrentUser && CurrentUser.userInfo && CurrentUser.userInfo.actors.some((actor: any) => actor.claims.some((claim: any) => (claim.key == "Timesheet" && claim.value == "Administrator"))) &&
                <FormControlLabel
                  sx={{ color: themeMode?.stateMode ? 'white' : '#463b2f' }}
                  control={
                    <Switches checked={initialData.isConfirmed} onChange={() => ManagementApproval()} name="confirm" />
                  } label="تائید مدیریت" />}
            </section>
            <section dir='rtl' className='w-full px-3 grid grid-cols-1 md:grid-cols-7 lg:grid-cols-12 my-2 gap-x-3'>
              <div className='col-span-1 md:col-span-3 lg:col-span-2  '>
                <SubgroupList />
              </div>
              <section className={initialData.details !== null && initialData.masterId !== 0 ? 'col-span-1 md:col-span-4 lg:col-span-10 visible my-2 md:my-0' : 'hidden'}>
                <EnterdataList />
              </section>
            </section>
          </form>
        </MyCustomComponent>
      </EnterDataContext.Provider>
    </>
  )
}

export default EnterDataMainContainer