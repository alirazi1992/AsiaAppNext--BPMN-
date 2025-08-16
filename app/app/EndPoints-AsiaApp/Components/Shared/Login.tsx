'use client';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import MyCustomComponent from './CustomTheme_Mui'
import TextFieldItem from './TextFieldItem';
import { Button, Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import { LoadingModel, LoginData } from '@/app/Domain/shared';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { img, loading } from '@/app/Application-AsiaApp/Utils/shared';
import { useSignin } from '@/app/Application-AsiaApp/Shared/SigninUser';
import Image from 'next/image';
import src from '@/app/assets/images/login.svg';
import useLoginUserInfo from '@/app/zustandData/useLoginUserInfo';
import AuthorizeStore from '@/app/zustandData/Authorization'

const Login = forwardRef((props: any, ref) => {
  const AuthorizationState = useStore(AuthorizeStore, (state) => state)
  const [loadings, setLoadings] = useState<LoadingModel>(loading)
  const color = useStore(colorStore, (state) => state)
  const themeMode = useStore(themeStore, (state) => state)
  const [open, setOpen] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const { LoginUser } = useSignin()
  const CurrentUser = useLoginUserInfo.getState();

  useImperativeHandle(ref, () => ({
    handleOpen: (state: boolean) => {
      setOpen(state)
    }
  }));


  const schema = yup.object().shape({
    User: yup.object(({
      username: yup.string().required('نام کاربری اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
      password: yup.string()
        .required('پسورد اجباری است')
        .test('has-lowercase', 'حداقل یک حرف کوچک باید وجود داشته باشد', value =>
          /[a-z]/.test(value))
        .test('has-uppercase', 'حداقل یک حرف بزرگ باید وجود داشته باشد', value =>
          /[A-Z]/.test(value))
        .test('has-special-char', 'حداقل یک کاراکتر خاص باید وجود داشته باشد', value =>
          /[!@#$%^&*]/.test(value))
        .test('no-persian', 'پسورد نمی‌تواند شامل حروف فارسی باشد', value =>
          !/[آ-ی]/.test(value))
        .min(8, 'حداقل باید 8 کاراکتر باشد')
    })).required(),
  })

  const {
    register,
    handleSubmit,
    formState,
    clearErrors,
    trigger,
    setError,
  } = useForm<LoginData>(
    {
      defaultValues: {
        User: {
          password: '',
          username: (CurrentUser && CurrentUser.userInfo && CurrentUser.userInfo.actors) ? CurrentUser.userInfo.actors[0].userName.toLowerCase() : "",
        }
      }, mode: 'all',
      resolver: yupResolver(schema) as Resolver<LoginData>
    }
  );

  const errors = formState.errors as any

  const OnSubmit = async (data: LoginData) => {
    setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
    if (CurrentUser && CurrentUser.userInfo && (CurrentUser?.userInfo?.actors?.[0]?.userName)?.toLowerCase() == data.User.username.toLowerCase()) {
      const res = await LoginUser(data).then((result) => {
        if (result) {
          if (typeof result === 'string') {
            setError('User.password', { type: 'validate', message: result })
          }
          setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
          if (typeof result === 'object' && 'isUserFound' in result && result.isUserFound == true) {
            handleOpen(),
              clearErrors(),
              AuthorizationState?.changeState()
          }
        }
      })
    }
  }


  return (
    <MyCustomComponent color='white' dir='ltr'>
      <Dialog size='xs'
        dismiss={{
          escapeKey: true,
          referencePress: true,
          referencePressEvent: 'click',
          outsidePress: false,
          outsidePressEvent: 'click',
          ancestorScroll: false,
          bubbles: true
        }}
        className=' bg-gray-600/40 p-4 shadow-gray-400/20 shadow-md border border-gray-400' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} open={open} handler={handleOpen}>
        <DialogHeader className={`${themeMode?.mode ? 'lightText' : 'darkText'} flex justify-between`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Sign in
          <figure className='h-12 w-12'>
            <Image
              width={100}
              height={100}
              src={src}
              style={img}
              alt={'login'}
            />
          </figure>
        </DialogHeader>
        <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
          <form dir='rtl'
            onSubmit={handleSubmit(OnSubmit)}
            className='relative z-[10]'>
            <section className='flex flex-col gap-y-3 w-full my-3 h-full'>
              <section className='my-1 relative w-full'>
                <TextFieldItem
                  dir='ltr'
                  color={'white'}
                  label='username' register={{ ...register(`User.username`) }} tabIndex={1}
                  error={errors && errors?.User?.username && true}
                  onFocus={(e) => e.target.blur()} />
                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.User && errors?.User.username?.message}</label>
              </section>
              <section className='my-1 relative w-full'>
                <TextFieldItem
                  color={'white'}
                  type='password'
                  dir='ltr'
                  label='password' register={{ ...register(`User.password`) }} tabIndex={2}
                  error={errors && errors?.User?.password && true} />
                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.User && errors?.User.password?.message}</label>
              </section>
            </section>
            <Button disabled={loadings.response == true ? true : false} type="submit" style={{ background: color?.color }} fullWidth className='relative flex justify-center capitalize px-4 w-[100%]' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {(loadings.response == false) ? <div className='text-[14px]'>sign in</div> :
                <div className="loader p-0">
                  <span style={{ background: color?.color }} className="barr"></span>
                  <span style={{ background: color?.color }} className="barr"></span>
                  <span style={{ background: color?.color }} className="barr"></span>
                </div>
              }
            </Button>
          </form>
        </DialogBody>
      </Dialog>
    </MyCustomComponent>
  )
})
Login.displayName = 'Login'
export default Login