
'use client';
import { Button, Typography, Input, Dialog, DialogHeader, DialogBody } from '@material-tailwind/react';
import styles from './../../../assets/styles/LoginForm.module.css';
import colorTheme from './../../../zustandData/color.zustand';
import useStore from "./../../../hooks/useStore"
import { useRouter } from 'next/navigation';
import useAxios from '@/app/hooks/useAxios'
import { useState } from 'react';
import useLoginUserInfo from './../../../zustandData/useLoginUserInfo';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ActorsModel, Response, RoleModel } from '@/app/models/Home/model';
import { AxiosResponse } from 'axios';
import activeStore from '@/app/zustandData/activate.zustand';
import { useSignin } from '@/app/Application-AsiaApp/Shared/SigninUser';
import { useList } from '@/app/Application-AsiaApp/M_Search/fetchSearchesList';

const LoginForm = () => {
  const { AxiosRequest } = useAxios();
  const { LoginUser } = useSignin()
  const activeState = activeStore();
  const [isVisible, setIsVisible] = useState(false);
  const updateUserValues = {
    username: "",
    password: "",
  }
  const [loginUser, setLoginUser] = useState(updateUserValues);
  const [finalRes, setFinalRes] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false)
  const color = useStore(colorTheme, (state) => state)
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  // const notif = NotifStore();

  const Login = async () => {
    setLoading(true)
    const url = `${process.env.NEXT_PUBLIC_API_URL}/identity/account`;
    console.log('url', url)
    let data = { "username": loginUser.username, "password": loginUser.password };
    let method = 'post';
    var res: AxiosResponse<Response<RoleModel>> = await AxiosRequest({ url, method, data, credentials: true });
    setFinalRes(res.data);
    if (res) {
      if (res.data.data.isUserFound == true && res.data.data.signInSuccessfull == true && res.data.status == true) {
        useLoginUserInfo.setState({
          userInfo: {
            ...res.data.data,
            actors:
              res.data.data.actors.map((actor: ActorsModel) => ({
                value: actor.id,
                label: actor.roleName,
                claims: actor.claims,
                departementFaName: actor.departementFaName,
                departementFaTitle: actor.departementFaTitle,
                departementName: actor.departementName,
                departementTitle: actor.departementTitle,
                departmentId: actor.departmentId,
                faFirstName: actor.faFirstName,
                faLastName: actor.faLastName,
                faTitle: actor.faTitle,
                firstName: actor.firstName,
                genderId: actor.genderId,
                id: actor.id,
                isDefault: actor.isDefault,
                isSecretariate: actor.isSecretariate,
                lastName: actor.lastName,
                parentDepartementId: actor.parentDepartementId,
                roleId: actor.roleId,
                roleName: actor.roleName,
                title: actor.title,
                userId: actor.userId,
                userName: actor.userName
              }))
          }
        })
        activeStore.setState((state) => ({ ...state, activate: '', activeSubLink: '', activeSubMenu: '' }));
        setLoading(false)
        router.push('/Home')
      } else {
        setLoading(false)
        handleOpen()
      }
    }

  }


  // const Login = async () => {
  //   const {AxiosRequest} = useAxios()
  //   setLoading(true)
  //   const url = `${process.env.NEXT_PUBLIC_API_URL}/identity/account`;
  //   let data = { "username": loginUser.username, "password": loginUser.password };
  //   let method = 'post';
  //   var res: AxiosResponse<Response<RoleModel>> = await AxiosRequest({ url, method, data, credentials: true });
  //   setFinalRes(res.data);
  //   if (res.data.data.isUserFound == true && res.data.data.signInSuccessfull == true && res.data.status == true) {
  //     useLoginUserInfo.setState({
  //       userInfo: {
  //         ...res.data.data, actors:
  //           res.data.data.actors!.map((actor: ActorsModel) => ({
  //             value: actor.id,
  //             label: actor.roleName,
  //             claims: actor.claims,
  //             departementFaName: actor.departementFaName,
  //             departementFaTitle: actor.departementFaTitle,
  //             departementName: actor.departementName,
  //             departementTitle: actor.departementTitle,
  //             departmentId: actor.departmentId,
  //             faFirstName: actor.faFirstName,
  //             faLastName: actor.faLastName,
  //             faTitle: actor.faTitle,
  //             firstName: actor.firstName,
  //             genderId: actor.genderId,
  //             id: actor.id,
  //             isDefault: actor.isDefault,
  //             isSecretariate: actor.isSecretariate,
  //             lastName: actor.lastName,
  //             parentDepartementId: actor.parentDepartementId,
  //             roleId: actor.roleId,
  //             roleName: actor.roleName,
  //             title: actor.title,
  //             userId: actor.userId,
  //             userName: actor.userName
  //           }))
  //       }
  //     })
  //     activeStore.setState((state) => ({ ...state, activate: '', activeSubLink: '', activeSubMenu: '' }));
  //     router.push('/Home')
  //   } else {
  //     setLoading(false)
  //     handleOpen()
  //   }
  // };

  return (<>
    <section className={'LoginForm flex justify-center items-center lg:w-[41%] h-[100vh] ' + styles.content}>
      <Dialog dialog-background-color="transparent" style={{ background: "#748aaf10" }} className='absolute z-[999] top-0 left-2' open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <div id="toast-warning" className="absolute top-[50px] md:left-[50px] z-10 flex items-center w-[80%] max-w-xs p-4 rounded-lg shadow" style={{ background: "#748aaf10" }} role="alert">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
            </svg>
            <span className="sr-only">Warning icon</span>
          </div>
          <p className='text-[13px] text-white font-[300] w-full text-center'>{finalRes && finalRes.message}</p>
          <button onClick={handleOpen} type="button" className="ms-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-100 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>
      </Dialog>

      <form autoComplete="off" id='form' className="p-1 w-3/4 h-[300px] flex content-evenly flex-wrap justify-center">
        <Typography color="white" variant='h3' className={"asiaApp w[100%] font-bold capitalize text-center " + styles.asiaApp} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>AsiaApp</Typography>
        <Input autoComplete="off" id='user' crossOrigin="" value={loginUser.username} onChange={(e: any) => setLoginUser(state => ({ ...state, username: e.target.value }))} type='text' label="Username" variant="outlined" color='white' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        <Input autoComplete="off" id="pass" crossOrigin="" value={loginUser.password}
                 onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    Login();
                  }
              }}
        onChange={(e: any) => setLoginUser(state => ({ ...state, password: e.target.value }))} type={isVisible ? 'text' : 'password'} variant="outlined" color='white' label="Password" icon={isVisible ? <VisibilityIcon fontSize='small' onClick={() => setIsVisible((prevState) => !prevState)} className='text-white' /> : <VisibilityOffIcon fontSize='small' onClick={() => setIsVisible((prevState) => !prevState)} className='text-white' />} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        <Button disabled={loading == true ? true : false} type="button" onClick={() => { Login(); }} style={{ background: color?.color }} fullWidth className='relative flex justify-center capitalize px-4 w-[100%]' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {(loading == false) ? <div className='text-[14px]'>sign in</div> :
            <div className="loader p-0">
              <span style={{ background: color?.color }} className="barr"></span>
              <span style={{ background: color?.color }} className="barr"></span>
              <span style={{ background: color?.color }} className="barr"></span>
            </div>
          }
        </Button>
      </form>
    </section>
  </>
  )
};
export default LoginForm;

