'use client';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Button, CardBody, Tooltip } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddCategoryModel, SubmitAddCategoryProps } from "@/app/Domain/M_Education/Categories";
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui'

const AddCategory = forwardRef(({ onSubmit }: SubmitAddCategoryProps, ref) => {
  const themeMode = useStore(themeStore, (state) => state)
  const color = useStore(colorStore, (state) => state)
  const schema = yup.object().shape({
    AddCategory: yup.object(({
      name: yup.string().required('عنوان انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
      faName: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
    })).required(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState,
  } = useForm<AddCategoryModel>(
    {
      defaultValues: {
        AddCategory: {
          faName: '',
          name: ''
        },
      }, mode: 'all',
      resolver: yupResolver(schema)
    }
  );
  const errors = formState.errors;
  const OnSubmit = (data: AddCategoryModel) => {
    if (!errors.AddCategory) {
      onSubmit(data.AddCategory)
    }
  }

  useImperativeHandle(ref, () => ({
    ResetMethod: () => {
      reset()
    },
  }));



  return (
    <MyCustomComponent>
      <>
      <CardBody className={`w-[98%] my-3 mx-auto  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'carDLight'} `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <form
          dir='rtl'
          onSubmit={handleSubmit(OnSubmit)}
          className='relative z-[10]'>
          <div className="w-max ">
            <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Save Course Category' placement="top">
              <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <SaveIcon className='p-1' />
              </Button>
            </Tooltip>
          </div>
          <section className='grid grid-cols-1 md:grid-cols-5 gap-x-1 gap-y-5 my-2'>
            <div className='p-1 relative '>
              <TextField
                autoComplete='off'
                sx={{ fontFamily: 'FaLight' }}
                {...register(`AddCategory.faName`)}
                tabIndex={1}
                error={errors?.AddCategory && errors?.AddCategory?.faName && true}
                className='w-full lg:my-0 font-[FaLight]'
                dir='rtl'
                size='small'
                label='عنوان'
                InputProps={{
                  style: { color: errors?.AddCategory?.faName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                }}
              />
              <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddCategory && errors?.AddCategory!.faName?.message}</label>
            </div>
            <div className='p-1 relative '>
              <TextField
                autoComplete='off'
                sx={{ fontFamily: 'FaLight' }}
                {...register(`AddCategory.name`)}
                tabIndex={1}
                error={errors?.AddCategory && errors?.AddCategory?.name && true}
                className='w-full lg:my-0 font-[FaLight]'
                dir='ltr'
                size='small'
                label='عنوان انگلیسی'
                InputProps={{
                  style: { color: errors?.AddCategory?.name ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                }}
              />
              <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AddCategory && errors?.AddCategory!.name?.message}</label>
            </div>
          </section>
        </form>
      </CardBody>
      </>
    </MyCustomComponent >
  )
})
AddCategory.displayName = 'AddCategory'

export default AddCategory