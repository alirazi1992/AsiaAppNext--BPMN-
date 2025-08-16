'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, CardBody, Dialog, DialogBody, DialogFooter, Input, Typography } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import UpdateStatusUsers from '@/app/zustandData/UpdateStatusUsers';
import UpdateStatusUser from '@/app/zustandData/UpdateStatusUser';
import ButtonComponent from '@/app/components/shared/ButtonComponent';
import useStore from '@/app/hooks/useStore';
import Loading from '@/app/components/shared/loadingResponse';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import SearchIcon from '@mui/icons-material/Search';
import { Response, UsersListItemsModel } from '@/app/models/UserManagement/UsersListModel';
import Swal from 'sweetalert2';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import { Pagination, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { GetStatusUsers, GetStatusUsersModel } from '@/app/models/UserManagement/StatusUsers/statusTypes';

const UsersListTable = () => {
    const { AxiosRequest } = useAxios()
    type SelectedUser = {
        username: string,
        userId: string
    }
    type Loadings = {
        loadingTable: boolean,
        loadingResponse: boolean
    }
    let loading = {
        loadingTable: false,
        loadingResponse: false
    }
    const router = useRouter();
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const User = useStore(UpdateStatusUsers, (state) => state)
    const Update = useStore(UpdateStatusUser, (state) => state)
    const [open, setOpen] = useState(false);
    const [edited, setEdited] = useState<SelectedUser>({
        username: '',
        userId: ''
    })
    const [searchKey, setSearchKey] = useState<string | null>(null)
    const [loadings, setLoadings] = useState<Loadings>(loading)
    const [count, setCount] = useState<number>(0)
    const [usersList, setUsersList] = useState<GetStatusUsers[]>([])
    const handleOpen = () => setOpen(!open);
    const updateValues = {
        newPassword: "",
        confirmPassword: ""
    }
    const [updatePassword, setUpdatePassword] = useState(updateValues)

    const GetUsers = useCallback(async (index: number = 1) => {
        setLoadings((state) => ({ ...state, loadingTable: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/statusidentity/ManageUser/GetStatusUsers?searchKey=${searchKey}&pageNo=${index}&pageSize=10`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetStatusUsersModel>> = await AxiosRequest({ url, data, method, credentials: true });
        if (response) {
            setLoadings((state) => ({ ...state, loadingTable: false }))
            if (response.data.status && response.data.data != null) {
                let paginationCount = Math.ceil(Number(response.data.data.totalCount) / Number(10));
                setCount(paginationCount)
                setUsersList(response.data.data.usersList)
            }
        }
    }, [searchKey])

    const DeleteStatusUser = async (user: GetStatusUsers) => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'حذف کاربر',
            text: `آیا از حذف این کاربر اطمینان دارید؟`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, Delete user!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadings((state) => ({ ...state, loadingResponse: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/statusidentity/ManageUser/DeleteStatusUser?userId=${user.id}`;
                let method = 'delete';
                let data = {};
                let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, data, method, credentials: true })
                if (response) {
                    setLoadings((state) => ({ ...state, loadingResponse: false }))
                    if (response.data.data == false) {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: 'حذف کاربر',
                            text: response.data.message,
                            icon: response.data.status ? "warning" : 'error',
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK"
                        })
                    }
                }
            }
        })
    }

    const changeUsersPassword = async () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'Change Password',
            text: 'Are You sure?!',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, Change it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadings((state) => ({ ...state, loadingResponse: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/statusidentity/ManageUser/UpdateStatusPasswordAsync`;
                let data = {
                    "userId": edited.userId,
                    "password": updatePassword.newPassword,
                    "confirmPassword": updatePassword.confirmPassword
                };
                let method = 'patch';
                let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
                if (response) {
                    setLoadings((state) => ({ ...state, loadingResponse: false }))
                    if (response.data.data == false) {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: 'Change Password',
                            text: response.data.message,
                            icon: response.data.status ? "warning" : 'error',
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK"
                        })
                    }
                    handleOpen()
                }
            }
        })
    }

    return (
        <>
            {loadings.loadingResponse == true && <Loading />}
            <CardBody onKeyUp={(event) => event.key == 'Enter' && GetUsers()} className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} w-[98%] my-2 mx-auto`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <div className="flex flex-col md:flex-row justify-end  items-center">
                    <div className="relative w-[95%] md:w-[45%] justify-start flex">
                        <Input
                            onChange={(e: any) => setSearchKey(e.target.value)}
                            crossOrigin=""
                            style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
                            type="text"
                            label="search"
                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} pr-10 `}
                            containerProps={{
                                className: !themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'
                            }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        />
                        <Button
                            onClick={() => GetUsers()}
                            size="sm"
                            className="!absolute right-1 top-1 rounded p-1"
                            style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                            <SearchIcon
                                className='p-1'
                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                            />
                        </Button>
                    </div>
                </div>
            </CardBody>
            <CardBody className='w-[98%] h-[70vh] mt-3 mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {loadings.loadingTable == true ? <TableSkeleton /> : usersList.length > 0 && <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[71vh] `}>
                    <thead >
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    No.
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    UserName
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    AccessFailedCount
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    LockedOutEnabled
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    IsActive
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Action
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {usersList.map((option: UsersListItemsModel, index) => {
                            return (
                                <tr style={{ height: "40px" }} key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[700] text-[13px] p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {index + 1}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {option.username}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {option.accessFailedCount}
                                        </Typography>
                                    </td>
                                    <td style={{ width: "5%" }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {option.lockoutEnabled}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {option.isActive}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '7%' }} className='p-1'>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <Button
                                                    onClick={() => DeleteStatusUser(option)}
                                                    style={{ background: color?.color }}
                                                    size="sm"
                                                    className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <DeleteIcon
                                                        fontSize='small'
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                </Button>
                                                <Button
                                                    onClick={() => { User!.setState({ userName: option.username, userId: option.id }), router.push('/Home/UpdateStatusUser'); } }
                                                    style={{ background: color?.color }}
                                                    size="sm"

                                                    className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <SettingsIcon
                                                        fontSize='small'
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                </Button>
                                                <Button
                                                    onClick={() => { setEdited(() => ({ userId: option.id, username: option.username })), handleOpen(); } }
                                                    style={{ background: color?.color }}
                                                    size="sm"
                                                    className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <KeyIcon
                                                        fontSize='small'
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                </Button>
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
                }} size='sm' className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <DialogBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <section className='flex flex-col gap-6'>
                            <Typography variant='h6' color="blue-gray" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >{edited.username}</Typography>
                            <Input value={updatePassword.newPassword} onChange={(e: any) => setUpdatePassword(state => ({ ...state, newPassword: e.target.value }))} dir="ltr" crossOrigin="" size="md" label="Password" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            <Input value={updatePassword.confirmPassword} onChange={(e: any) => setUpdatePassword(state => ({ ...state, confirmPassword: e.target.value }))} dir="ltr" crossOrigin="" size="md" label="Confirm password" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        </section>
                    </DialogBody>
                    <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <section className='flex justify-center'>
                            <ButtonComponent onClick={() => { setEdited({ userId: '', username: "" }), handleOpen() }}>انصراف</ButtonComponent>
                        </section>
                        <section className='flex justify-center'>
                            <ButtonComponent onClick={() => changeUsersPassword()}>ذخیره</ButtonComponent>
                        </section>
                    </DialogFooter>
                </Dialog>
            </CardBody >
        </>
    )
}
export default UsersListTable;