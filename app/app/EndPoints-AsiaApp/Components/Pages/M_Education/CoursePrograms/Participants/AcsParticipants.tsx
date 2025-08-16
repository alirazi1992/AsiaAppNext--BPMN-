'use client';
import dynamic from 'next/dynamic';
import React, { forwardRef, useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';
import * as yup from "yup";
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AcsParticipantsProps, AddParticipantsModel } from '@/app/Domain/M_Education/Participant';
import { GetAcsUsersModel } from '@/app/Domain/M_Education/Participant';
import { ActionMeta, MultiValue } from 'react-select';
import { Button, Tooltip } from '@material-tailwind/react';
import SaveIcon from '@mui/icons-material/Save';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { useAcsUsers } from '@/app/Application-AsiaApp/M_Education/fetchForwardRecievers';

const AcsParticipants = forwardRef(({ id, onSubmit }: AcsParticipantsProps, ref) => {
  const [participants, setParticipants] = useState<GetAcsUsersModel[] | null>(null)
  const SelectOption = useMemo(() => { return dynamic(() => import('@/app/EndPoints-AsiaApp/Components/Shared/SelectOption'), { ssr: false }) }, [])
  const { fetchUsers } = useAcsUsers()
  let list: GetAcsUsersModel[] | undefined
  const [state, setState] = useState<GetAcsUsersModel[] | undefined>()
  const themeMode = useStore(themeStore, (state) => state)
  const color = useStore(colorStore, (state) => state)

  useEffect(() => {
    const GetParticipants = async () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const res = await fetchUsers().then((result) => {
        if (result) {
          if (Array.isArray(result)) {
            setState(result)
          }
        }
      })
    }
    GetParticipants()
  }, [])

  const schema = yup.object().shape({
    AddParticipant: yup.array(yup.object().shape({
      name: yup.string().required('اجباری'),
      faName: yup.string().required('اجباری'),
      personnelId: yup.string().nullable(),
      nationalCode: yup.string().nullable(),
      courseProgramId: yup.number().min(1, 'اجباری').required('اجباری'),
    })).required().default([]),
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
  } = useForm<AddParticipantsModel>(
    {
      defaultValues: {
        AddParticipant: []
      }, mode: 'all',
      resolver: yupResolver(schema) as Resolver<AddParticipantsModel>
    }
  );
  const errors = formState.errors;
  useEffect(() => {
    setValue(`AddParticipant.${0}.courseProgramId`, id!)
  }, [id, setValue])

  useEffect(() => {
    participants != null && setValue('AddParticipant', participants!.map(item => {
      return {
        name: item.name,
        faName: item.faName,
        personnelId: item.id,
        nationalCode: null,
        courseProgramId: id!
      }
    }))
  }, [id, participants, setValue])

  const OnSubmit = () => {
    onSubmit(watch('AddParticipant'))
  }

  useImperativeHandle(ref, () => ({
    customMethod: () => {
      setParticipants(null)
    },
  }));

  return (
    <form
      dir='rtl'
      onSubmit={handleSubmit(OnSubmit)}
      className='relative z-[10]'>
      <div className="w-max ">
        <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save Course Program' placement="top">
          <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <SaveIcon className='p-1' />
          </Button>
        </Tooltip>
      </div>
      <section className='grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-5'>
        <div className='p-1 relative '>
          <SelectOption
            isRtl
            isMulti={true}
            className='w-full z-[999999999]'
            {...register(`AddParticipant`)}
            placeholder={'Educational Courses'}
            loading={state != undefined ? false : true}
            errorType={errors?.AddParticipant}
            maxMenuHeight={400}
            onChange={(option: MultiValue<GetAcsUsersModel>, actionMeta: ActionMeta<GetAcsUsersModel>) => {
              setParticipants([...option])
            }}
            value={participants != null ? participants : []}
            options={state == undefined ? [{
              id: 0, value: 0, label: 'no option found',
              faName: 'no option found',
              name: 'no option found'
            }] : state}
          />
          <label className='absolute top-[100%] left-0 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.AddParticipant && errors?.AddParticipant?.message}</label>
        </div>
      </section>
    </form>
  )
})

// export default AcsParticipants
AcsParticipants.displayName = 'AcsParticipants';
export default AcsParticipants