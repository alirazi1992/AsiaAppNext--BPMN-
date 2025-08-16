'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Tooltip, Typography } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import UpdateUserStore, { UpdateUserData } from '@/app/zustandData/updateUsers';
import ButtonComponent from '@/app/components/shared/ButtonComponent';
import useStore from '@/app/hooks/useStore';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SaveIcon from '@mui/icons-material/Save';
import * as yup from "yup";
import useLoginUserInfo from '@/app/zustandData/useLoginUserInfo';
//icons
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import SearchIcon from '@mui/icons-material/Search';
import { GetUserListodel, Response, UsersListItemsModel } from '@/app/models/UserManagement/UsersListModel';
import Swal from 'sweetalert2';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import { Pagination, Stack, TextField, outlinedInputClasses } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ChangeUserPassModel } from '@/app/models/HR/userInformation';

const UsersListTable = () => {
    const { AxiosRequest } = useAxios()
    const router = useRouter();
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const User = useStore(UpdateUserStore, (state) => state)
    const [open, setOpen] = useState(false);
    type SelectedUser = {
        username: string,
        userId: string
    }
    const [edited, setEdited] = useState<SelectedUser>({
        username: '',
        userId: ''
    })
    const CurrentUser = useLoginUserInfo.getState();
    const [searchKey, setSearchKey] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [state, setState] = useState<boolean>(false)
    const [count, setCount] = useState<number>(0)
    const [usersList, setUsersList] = useState<UsersListItemsModel[]>([])
    const handleOpen = () => setOpen(!open);
    const handleOpenAddUser = () => setState(!state);
    const schema = yup.object().shape({
        ChangePass: yup.object(({
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
        control,
        getValues,
        reset,
        formState,
        trigger,
    } = useForm<ChangeUserPassModel>(
        {
            defaultValues: {
                ChangePass: {
                    password: '',
                    confirmPassword: '',
                }
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    const outerTheme = useTheme();
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

    const GetUsers =  async(index: number = 1) => {
        setLoading(true)
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetUsers?searchKey=${searchKey}&pageNo=${index}&pageSize=10`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetUserListodel>> = await AxiosRequest({ url, data, method, credentials: true });
        if (response) {
            setLoading(false)
            if (response.data.status && response.data.data != null) {
                let paginationCount = Math.ceil(Number(response.data.data.totalCount) / Number(10));
                setCount(paginationCount)
                setUsersList(response.data.data.usersList)
            }
        }
    }


    useEffect(() => {
        GetUsers()
    }, [])

    const DeleteUser = async (user: UsersListItemsModel) => {
        Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'حذف کاربر',
            text: `آیا از حذف این کاربر اطمینان دارید؟`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)
                let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/DeleteUser?userId=${user.id}`;
                let method = 'delete';
                let data = {};
                let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, data, method, credentials: true })
                if (response) {
                    setLoading(false)
                    if (response.data.data == false) {
                        Swal.fire({
                            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: 'حذف کاربر',
                            text: response.data.message,
                            icon: response.data.status && response.data.data == false ? "warning" : 'error',
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK"
                        })
                    }
                }
            }
        })
    }

    const OnSubmit = async () => {
        if (!errors.ChangePass) {
            Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: 'Change Password',
                text: 'Are you sure?!',
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#22c55e",
                confirmButtonText: "yes, change it!",
                cancelButtonColor: "#f43f5e",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/ChangePassword`;
                    let data = {
                        "userId": edited.userId,
                        "password": getValues('ChangePass.password'),
                        "confirmPassword": getValues('ChangePass.confirmPassword')
                    };
                    let method = 'patch';
                    setLoading(true)
                    let res: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
                    setLoading(false);
                    handleOpen()
                    if (res.data.data == false) {
                        Swal.fire({
                            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: 'Change Password',
                            text: res.data.message,
                            icon: res.data.status ? 'warning' : 'error',
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK",
                        })
                    }
                    reset()
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    loading &&
                        Swal.fire({
                            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
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





    return (
        <>
            <CardBody
                className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} w-[98%]  my-3 mx-auto`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <div className="w-full">
                    <div className="container-fluid mx-auto">
                        <div className="flex flex-col md:flex-row justify-end md:justify-between items-center">
                            <div className="relative w-[95%] md:w-[35%] justify-start flex">
                                <Input
                                    onBlur={(e: any) => setSearchKey(e.target.value)}
                                    crossOrigin=""
                                    style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
                                    type="text"
                                    label="search"
                                    value={searchKey}
                                    onChange={(e: any)=> setSearchKey(e.target.value)}
                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} pr-10 `}
                                    containerProps={{
                                        className: !themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'
                                    }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            GetUsers();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={() => GetUsers()}
                                    size="sm"
                                    className="!absolute right-1 top-1 rounded p-1"
                                    style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    <SearchIcon
                                        className='p-1'
                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody >
            <CardBody className='w-[98%] h-[70vh] mx-auto relative rounded-lg overflow-auto p-0' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {loading == true ? <TableSkeleton /> : <table className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[71vh] `}>
                    <thead >
                        <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    No.
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    UserName
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    AccessFailedCount
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    LockedOutEnabled
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    IsActive
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Action
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {usersList.map((option: UsersListItemsModel, index) => {
                            return (
                                <tr style={{ height: "40px" }} key={index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[700] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {index + 1}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {option.username}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {option.accessFailedCount}
                                        </Typography>
                                    </td>
                                    <td style={{ width: "5%" }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {option.lockoutEnabled}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {option.isActive}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '7%' }} className='p-1'>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                {CurrentUser && CurrentUser.userInfo && CurrentUser.userInfo.actors.some((actor: any) => actor.claims.some((claim: any) => (claim.key == "UserManagement" && claim.value == "Admin"))) && <Button
                                                    onClick={() => DeleteUser(option)}
                                                    style={{ background: color?.color }}
                                                    size="sm"
                                                    className="p-1 mx-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <DeleteIcon
                                                        fontSize='small'
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                </Button>}
                                                <Button
                                                    onClick={async () => { await User?.setState({ userName: option.username, userId: option.id }), router.push('/Home/EditInformation'); }}
                                                    style={{ background: color?.color }}
                                                    size="sm"
                                                    className="p-1 mx-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>

                                                    <SettingsIcon
                                                        fontSize='small'
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                </Button>
                                                {CurrentUser && CurrentUser.userInfo && CurrentUser.userInfo.actors.some((actor: any) => actor.claims.some((claim: any) => (claim.key == "UserManagement" && claim.value == "Admin"))) && <Button
                                                    onClick={() => { setEdited(() => ({ userId: option.id, username: option.username })), handleOpen(); }}
                                                    style={{ background: color?.color }}
                                                    size="sm"
                                                    className="p-1 mx-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <KeyIcon
                                                        fontSize='small'
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                </Button>}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>}
                {count > 1 && <section className='flex justify-center my-3'>
                    <Stack onClick={(e: any) => { GetUsers(e.target.innerText) }} spacing={1}>
                        <Pagination hidePrevButton hideNextButton count={count} variant="outlined" size="small" shape="rounded" />
                    </Stack>
                </section>}
                <Dialog dismiss={{
                    escapeKey: true,
                    referencePress: true,
                    referencePressEvent: 'click',
                    outsidePress: false,
                    outsidePressEvent: 'click',
                    ancestorScroll: false,
                    bubbles: true
                }} size='sm' className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} flex justify-between`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ویرایش رمز عبور
                        <IconButton variant="text" color="blue-gray" onClick={() => { handleOpen(); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </IconButton>
                    </DialogHeader>
                    <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <form className='w-full relative' onSubmit={handleSubmit(OnSubmit)}>
                            <div dir='rtl' className="w-full">
                                <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='update password' placement="top">
                                    <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        <SaveIcon className='p-1' />
                                    </Button>
                                </Tooltip>
                            </div>
                            <ThemeProvider theme={Theme(outerTheme)}>
                                <section className='flex flex-col gap-y-3 w-full my-2 h-full'>
                                    <section className='my-1 relative w-full'>
                                        <TextField autoComplete="off"
                                            type='password'
                                            sx={{ fontFamily: 'FaLight' }}
                                            {...register(`ChangePass.password`)}
                                            tabIndex={2}
                                            error={errors?.ChangePass && errors?.ChangePass?.password && true}
                                            className='w-full lg:my-0 font-[FaLight]'
                                            dir='ltr'
                                            size='small'
                                            label='password'
                                            InputProps={{
                                                style: { color: errors?.ChangePass?.password ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                            }}
                                        />
                                        <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.ChangePass?.password && errors?.ChangePass?.password?.message}</label>
                                    </section>
                                    <section className='my-1 relative w-full'>
                                        <TextField autoComplete="off"
                                            type='password'
                                            sx={{ fontFamily: 'FaLight' }}
                                            {...register(`ChangePass.confirmPassword`)}
                                            tabIndex={1}
                                            error={errors?.ChangePass && errors?.ChangePass.confirmPassword && true}
                                            className='w-full lg:my-0 font-[FaLight]'
                                            dir='ltr'
                                            size='small'
                                            label='confirm Password'
                                            InputProps={{
                                                style: { color: errors?.ChangePass?.confirmPassword ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                            }}
                                        />
                                        <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.ChangePass?.confirmPassword && errors?.ChangePass?.confirmPassword?.message}</label>
                                    </section>
                                </section>
                            </ThemeProvider>
                        </form>
                    </DialogBody>
                </Dialog>
            </CardBody >
        </>
    )
}
export default UsersListTable;