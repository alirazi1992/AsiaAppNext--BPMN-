import React, { useEffect, useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { GetUsersByRoleIdModel } from '@/app/models/UserManagement/Role';
import { AxiosResponse } from 'axios';
import { Response } from '@/app/models/Home/model';
import useAxios from '@/app/hooks/useAxios';
import { Button, Tooltip, Typography } from '@material-tailwind/react';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UpdateUserStore from '@/app/zustandData/updateUsers';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
type Props = {
    roleId: string
}
const UsersByRoleId = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const router = useRouter()
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [users, setUsers] = useState<GetUsersByRoleIdModel[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const User = useStore(UpdateUserStore, (state) => state)

    useEffect(() => {
        const GetUsersByRoleId = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetUsersByRoleId?roleId=${props.roleId}`;
            let method = 'get';
            let data = {}
            let response: AxiosResponse<Response<GetUsersByRoleIdModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                setLoading(false)
                if (response.data.status && response.data.data.length > 0) {
                    setUsers(response.data.data)
                } else {
                    Swal.fire({
                        background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'لیست کاربران',
                        text: response.data.message,
                        icon: response.data.status ? "warning" : 'error',
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "OK"
                    })

                }
            }
        }
        GetUsersByRoleId()
    })
    return (
        <section dir='ltr' className='w-[100%] mx-auto overflow-auto p-0 my-3' >
            {loading == false ?
                users.length > 0 && <table className={` ${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center `}>
                    <thead>
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    #
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    userName
                                </Typography>
                            </th>

                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    color="blue-gray"
                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    Action
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`statusTable divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {users.map((user: GetUsersByRoleIdModel, index: number) => (
                            <tr key={'role' + index}
                                className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`}
                            >
                                <td style={{ width: '5%' }} className='p-1'>
                                    <Typography
                                        dir='ltr'
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >{index + 1}
                                    </Typography>
                                </td>
                                <td style={{ width: '25%' }} className='p-1 relative'>
                                    <Typography
                                        dir='ltr'
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        {user.userName}
                                    </Typography>

                                </td>
                                <td style={{ width: '8%' }} className='p-1'>
                                    <div className='container-fluid mx-auto p-0.5'>
                                        <div className="flex flex-row justify-evenly">
                                            <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='go to profle' placement="left">
                                                <Button
                                                    onClick={async () => { await User?.setState({ userName: user.userName, userId: user.userId }), router.push('/Home/EditInformation'); } }
                                                    style={{ background: color?.color }} size="sm"
                                                    className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    <AccountCircleIcon
                                                        fontSize='small'
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                    />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </td>
                            </tr>))}
                    </tbody>
                </table> : <TableSkeleton />}
        </section>
    )
}

export default UsersByRoleId