'use client';
import React, { useEffect } from 'react';
import * as yup from "yup";
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddParticipantsModel, SearchParticipantsModel } from '@/app/Domain/M_Education/Participant';
import { Button, Tooltip } from '@material-tailwind/react';
import { TextField } from '@mui/material';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import SearchIcon from '@mui/icons-material/Search';


const SearchParticipants: React.FC<any> = ({ id, onSubmit }) => {
  const themeMode = useStore(themeStore, (state) => state)
  const color = useStore(colorStore, (state) => state)

  const schema = yup.object().shape({
    Participant: yup.object().shape({
      name: yup.string(),
      faName: yup.string(),
      personnelId: yup.string().nullable(),
      nationalCode: yup.string().nullable(),
      courseProgramId: yup.number().required('اجباری'),
    })
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
  } = useForm<SearchParticipantsModel>(
    {
      defaultValues: {
        Participant: {
          name: '',
          faName: '',
          nationalCode: '',
          courseProgramId: id,
        }
      }, mode: 'all',
      resolver: yupResolver(schema) as Resolver<SearchParticipantsModel>
    }
  );
  const errors = formState.errors;

  useEffect(() => {
    setValue(`Participant.courseProgramId`, id)
  }, [id, setValue])

  const OnSubmit = (data: SearchParticipantsModel) => {
    if (!errors.Participant) {
      onSubmit(data!.Participant)
    }
  }
  return (
    <form
      dir='rtl'
      onSubmit={handleSubmit(OnSubmit)}
      className='relative z-[10]'>
      <div className="w-max ">
        <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save Course Program' placement="top">
          <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <SearchIcon className='p-1' />
          </Button>
        </Tooltip>
      </div>
      <section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-5'>
        <div className='p-1 relative '>
          <TextField
            autoComplete='off'
            sx={{ fontFamily: 'FaLight' }}
            {...register(`Participant.faName`)}
            tabIndex={1}
            className='w-full lg:my-0 font-[FaLight]'
            dir='rtl'
            size='small'
            label='نام فارسی'
            InputProps={{
              style: { color: errors?.Participant && errors?.Participant!.faName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
            }}
          />
        </div>
        <div className='p-1 relative '>
          <TextField
            autoComplete='off'
            sx={{ fontFamily: 'FaLight' }}
            {...register(`Participant.name`)}
            tabIndex={2}
            className='w-full lg:my-0 font-[FaLight]'
            dir='ltr'
            size='small'
            label='نام انگلیسی'
            InputProps={{
              style: { color: errors?.Participant && errors?.Participant!.name ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
            }}
          />
        </div>
        <div className='p-1 relative '>
          <TextField
            autoComplete='off'
            sx={{ fontFamily: 'FaLight' }}
            {...register(`Participant.nationalCode`)}
            tabIndex={3}
            className='w-full lg:my-0 font-[FaLight]'
            dir='ltr'
            size='small'
            label='شماره ملی'
            InputProps={{
              style: { color: errors?.Participant && errors?.Participant!.nationalCode ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
            }}
          />
        </div>

      </section>
    </form>
  )
}

export default SearchParticipants