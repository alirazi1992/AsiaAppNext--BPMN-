'use client';
import { Button, Typography, Input, Tooltip } from '@material-tailwind/react';
import styles from '@/app/assets/styles/LoginForm.module.css';
import useAxios from '@/app/hooks/useAxios';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';
import useStore from "@/app/hooks/useStore";
import Loading from '@/app/components/shared/loadingResponse';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import SaveIcon from '@mui/icons-material/Save';
import { ChangePassModel } from '@/app/models/HR/userInformation';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import { outlinedInputClasses, TextField } from '@mui/material';

const EditInfoForm = () => {
  const { AxiosRequest } = useAxios()
  const color = useStore(colorStore, (state) => state)
  const themeMode = useStore(themeStore, (state) => state)
  const [loading, setLoading] = useState<boolean>(false)
  const schema = yup.object().shape({
    ChangePass: yup.object(({
      currentPassword: yup.string().required('پسورد فعلی اجباری میباشد'),
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
      ,
      confirmPassword: yup.string()
        .required('تایید پسورد اجباری ').test('has-lowercase', 'حداقل یک حرف کوچک باید وجود داشته باشد', value =>
          /[a-z]/.test(value))
        .test('has-uppercase', 'حداقل یک حرف بزرگ باید وجود داشته باشد', value =>
          /[A-Z]/.test(value))
        .test('has-special-char', 'حداقل یک کاراکتر خاص باید وجود داشته باشد', value =>
          /[!@#$%^&*]/.test(value))
        .test('no-persian', 'پسورد نمی‌تواند شامل حروف فارسی باشد', value =>
          !/[آ-ی]/.test(value))
        .min(8, 'حداقل باید 8 کاراکتر باشد')
        .oneOf([yup.ref('password')], 'پسوردها باهم مطابقت ندارند'),
    })).required(),
  })

  const {
    unregister,
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    getValues,
    formState,
    trigger,
  } = useForm<ChangePassModel>(
    {
      defaultValues: {
        ChangePass: {
          currentPassword: '',
          password: '',
          confirmPassword: '',
        }
      }, mode: 'all',
      resolver: yupResolver(schema)
    }
  );

  const outerTheme = useTheme();
  const errors = formState.errors

  const router = useRouter()
  const OnSubmit = () => {
    if (!errors.ChangePass) {
      Swal.fire({
        background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
        color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
        allowOutsideClick: false,
        title: 'Change Password',
        text: 'Are you sure?!',
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#22c55e",
        confirmButtonText: "Yes, Update it!",
        cancelButtonColor: "#f43f5e",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/UpdatePasswordAsync`;
          let data = {
            "curentPassword": getValues('ChangePass.currentPassword'),
            "password": getValues('ChangePass.password'),
            "confirmPassword": getValues('ChangePass.confirmPassword')
          };
          let method = 'patch';
          setLoading(true)
          let res = AxiosRequest({ url, method, data, credentials: true }).then((res) => {
            setLoading(false);
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
              title: res.data.data == true && res.data.status == true ? "Updated!" : "Error!",
              text: res.data.message,
              icon: res.data.data == true && res.data.status == true ? "success" : "error"
            }
            ).then(result => {
              if (res.data.data == true && res.data.status == true) {
                let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/account`;
                let data = {};
                let method = 'delete';
                var resLogin = AxiosRequest({ url, method, data, credentials: true }).then((res) => {
                  router.push('/')
                })
              } else {
                setLoading(false)
                setValue('ChangePass', {
                  confirmPassword: '',
                  currentPassword: '',
                  password: ''
                })
              }
            });
          })
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          loading &&
            Swal.fire({
              background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Cancelled",
              text: "Your password has not changed",
              icon: "error",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK",
            });
        }
      });
    }
  }
  const Theme = (outerTheme: Theme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      typography: {
        fontFamily: 'FaLight',
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `
                  @font-face {
                    font-family: FaLight;
                    src: url('./assets/newFont/font/IranSansX\(Pro\)/FarsiFont/IRANSansXFaNum-Light.ttf') format('truetype'),
                  }
                `,
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '--TextField-brandBorderColor': '#607d8b',
              '--TextField-brandBorderHoverColor': '#607d8b',
              '--TextField-brandBorderFocusedColor': '#607d8b',
              '& label.Mui-focused': {
                color: 'var(--TextField-brandBorderFocusedColor)',
              },
              '& label': {
                color: 'var(--TextField-brandBorderFocusedColor)',
              },
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderHoverColor)',
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderFocusedColor)',
              },
              [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderFocusedColor)',
              },
            },
          },


        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: 'var(--TextField-brandBorderColor)',
            },
            root: {
              '--TextField-brandBorderColor': '#607d8b',
              '--TextField-brandBorderHoverColor': '#607d8b',
              '--TextField-brandBorderFocusedColor': '#607d8b',
              '& label.Mui-focused': {
                color: 'var(--TextField-brandBorderFocusedColor)',
              },
              '& label': {
                color: 'var(--TextField-brandBorderFocusedColor)',
              },
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderHoverColor)',
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderFocusedColor)',
              },
              [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderFocusedColor)',
              }
            },
          },
        },
        MuiFilledInput: {
          styleOverrides: {
            root: {
              '--TextField-brandBorderColor': '#607d8b',
              '--TextField-brandBorderHoverColor': '#607d8b',
              '--TextField-brandBorderFocusedColor': '#607d8b',
              '&::before, &::after': {
                borderBottom: '2px solid var(--TextField-brandBorderColor)',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
              },
              '&.Mui-focused:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
              '&.Mui-disabled:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              '--TextField-brandBorderColor': '#607d8b',
              '--TextField-brandBorderHoverColor': '#607d8b',
              '--TextField-brandBorderFocusedColor': '#607d8b',
              '&::before': {
                borderBottom: '2px solid var(--TextField-brandBorderColor)',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
              },
              '&.Mui-focused:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
              '&.Mui-disabled:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
            }
          },
        },
      },
    });
  return (
    <>
      {loading == true && <Loading />}
      <section className={'w-full min-h-[60vh] flex justify-center px-5 py-2' + styles.content}>
        <form className='w-full relative' onSubmit={handleSubmit(OnSubmit)}>
          <div dir='rtl' className="w-max ">
            <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='update password' placement="top">
              <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <SaveIcon className='p-1' />
              </Button>
            </Tooltip>
          </div>
          <ThemeProvider theme={Theme(outerTheme)}>
            <section className='flex flex-col gap-y-3 w-full md:w-4/6 lg:w-4/12 h-full'>
              <section className='my-1 relative w-full'>
                <TextField autoComplete="off"
                  sx={{ fontFamily: 'FaLight' }}
                  type='password'
                  {...register(`ChangePass.currentPassword`)}
                  tabIndex={1}
                  error={errors?.ChangePass && errors?.ChangePass?.currentPassword && true}
                  className='w-full lg:my-0 font-[FaLight]'
                  dir='ltr'
                  size='small'
                  label='current password'
                  InputProps={{
                    style: { color: errors?.ChangePass?.currentPassword ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                  }}
                />
                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.ChangePass?.currentPassword && errors?.ChangePass?.currentPassword?.message}</label>
              </section>
              <section className='my-1 relative w-full'>
                <TextField autoComplete="off"
                  type='password'
                  defaultValue={watch(`ChangePass.password`)}
                  sx={{ fontFamily: 'FaLight' }}
                  {...register(`ChangePass.password`)}
                  tabIndex={2}
                  error={errors?.ChangePass && errors?.ChangePass?.password && true}
                  className='w-full lg:my-0 font-[FaLight]'
                  dir='ltr'
                  size='small'
                  label='password'
                  InputProps={{
                    style: { color: errors?.ChangePass?.password ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                  }}
                />
                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.ChangePass?.password && errors?.ChangePass?.password?.message}</label>
              </section>
              <section className='my-1 relative w-full'>
                <TextField autoComplete="off"
                  type='password'
                  sx={{ fontFamily: 'FaLight' }}
                  {...register(`ChangePass.confirmPassword`)}
                  defaultValue={watch(`ChangePass.confirmPassword`)}
                  tabIndex={1}
                  error={errors?.ChangePass && errors?.ChangePass.confirmPassword && true}
                  className='w-full lg:my-0 font-[FaLight]'
                  dir='ltr'
                  size='small'
                  label='confirm Password'
                  InputProps={{
                    style: { color: errors?.ChangePass?.confirmPassword ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                  }}
                />
                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.ChangePass?.confirmPassword && errors?.ChangePass?.confirmPassword?.message}</label>
              </section>
            </section>
          </ThemeProvider>
        </form>
      </section>
    </>
  )
}
export default EditInfoForm;
