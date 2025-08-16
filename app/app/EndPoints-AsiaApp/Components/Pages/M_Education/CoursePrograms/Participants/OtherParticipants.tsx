'use client';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import * as yup from "yup";
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AcsParticipantsProps, AddParticipantsModel } from '@/app/Domain/M_Education/Participant';
import { Button, Tooltip } from '@material-tailwind/react';
import { TextField } from '@mui/material';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import SaveIcon from '@mui/icons-material/Save';

const OthersParticipants = forwardRef(({ id, onSubmit }: AcsParticipantsProps, ref) => {
  const themeMode = useStore(themeStore, (state) => state)
  const color = useStore(colorStore, (state) => state)

  const schema = yup.object().shape({
    AddParticipant: yup.array(yup.object().shape({
      name: yup.string().required('اجباری'),
      faName: yup.string().required('اجباری'),
      personnelId: yup.string().nullable(),
      nationalCode: yup.string().required('اجباری'),
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
        AddParticipant: [
          {
            name: '',
            faName: '',
            nationalCode: '',
            courseProgramId: id,
            personnelId: null
          }]
      }, mode: 'all',
      resolver: yupResolver(schema) as Resolver<AddParticipantsModel>
    }
  );
  const errors = formState.errors;

  useEffect(() => {
    setValue(`AddParticipant.${0}.courseProgramId`, id!)
  }, [id, setValue])

  const OnSubmit = (data: AddParticipantsModel) => {
    if (!errors.AddParticipant) {
      onSubmit(data!.AddParticipant)
    }
  }
  useImperativeHandle(ref, () => ({
    ResetMethod: () => {
      reset()
    },
  }));

  return (
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
      <section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-5'>
        <div className='p-1 relative '>
          <TextField
            autoComplete='off'
            sx={{ fontFamily: 'FaLight' }}
            {...register(`AddParticipant.${0}.faName`)}
            tabIndex={1}
            error={errors?.AddParticipant && errors?.AddParticipant[0]?.faName && true}
            className='w-full lg:my-0 font-[FaLight]'
            dir='rtl'
            size='small'
            label='نام فارسی'
            InputProps={{
              style: { color: errors?.AddParticipant && errors?.AddParticipant[0]!.faName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
            }}
          />
          <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddParticipant && errors?.AddParticipant[0]!.faName?.message}</label>
        </div>
        <div className='p-1 relative '>
          <TextField
            autoComplete='off'
            sx={{ fontFamily: 'FaLight' }}
            {...register(`AddParticipant.${0}.name`)}
            tabIndex={2}
            error={errors?.AddParticipant && errors?.AddParticipant[0]?.name && true}
            className='w-full lg:my-0 font-[FaLight]'
            dir='ltr'
            size='small'
            label='نام انگلیسی'
            InputProps={{
              style: { color: errors?.AddParticipant && errors?.AddParticipant[0]!.name ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
            }}
          />
          <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddParticipant && errors?.AddParticipant[0]!.name?.message}</label>
        </div>
        <div className='p-1 relative '>
          <TextField
            autoComplete='off'
            sx={{ fontFamily: 'FaLight' }}
            {...register(`AddParticipant.${0}.nationalCode`)}
            tabIndex={3}
            error={errors?.AddParticipant && errors?.AddParticipant[0]?.nationalCode && true}
            className='w-full lg:my-0 font-[FaLight]'
            dir='ltr'
            size='small'
            label='شماره ملی'
            InputProps={{
              style: { color: errors?.AddParticipant && errors?.AddParticipant[0]!.nationalCode ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
            }}
          />
          <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddParticipant && errors?.AddParticipant[0]!.nationalCode?.message}</label>
        </div>

      </section>
    </form>
  )
})


OthersParticipants.displayName = "OthersParticipants"
export default OthersParticipants