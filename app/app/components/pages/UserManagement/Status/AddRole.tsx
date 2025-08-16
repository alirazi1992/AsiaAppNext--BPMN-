'use client';
import { Button, CardBody, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip, Typography } from '@material-tailwind/react';
import React, { useCallback, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { Checkbox, FormControlLabel } from '@mui/material';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import useAxios from '@/app/hooks/useAxios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { AxiosResponse } from 'axios';
import { GetResponseAddRole, GetStatusRolesListModels, GetUserRoles, Response } from '@/app/models/UserManagement/Role';
import { SelectStatusRoleType } from '@/app/models/HR/userInformation';
import { GetUserRolesModel } from '@/app/models/UserManagement/Role';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import Loading from '@/app/components/shared/loadingResponse';
import UpdateStatusUser from '@/app/zustandData/UpdateStatusUser';
import Swal from 'sweetalert2';

const AddRole = () => {
    const { AxiosRequest } = useAxios()
    const Update = UpdateStatusUser((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const [activeTab, setActiveTab] = useState<string>('currentRole')
    type Loading = {
        loadingTable: boolean,
        loadingResponse: boolean
    }
    type States = {
        RoleList: GetStatusRolesListModels[]
        UserRoles: GetUserRoles[]
    }
    let loadings = {
        loadingTable: false,
        loadingResponse: false
    }
    let RoleClaimsState = {
        RoleList: [],
        UserRoles: []
    }
    const [state, setState] = useState<States>(RoleClaimsState)
    const [loading, setLoading] = useState<Loading>(loadings)
    let updateUser = {
        id: 0,
        roleId: '',
        isActive: false,
        isDefault: false,
        roleName: ''
    }
    const [update, setUpdate] = useState<GetUserRolesModel>(updateUser)

    const schema = yup.object({
        SelectRole: yup.object().shape({
            RoleName: yup.string().required('انتخاب سمت اجباری'),
        }).required(),
    })

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState,
        reset,
        control,
        watch,
        trigger,
    } = useForm<SelectStatusRoleType>(
        {
            defaultValues: {
                SelectRole: {
                    RoleName: '',
                    isDefault: false,
                    isActive: false,
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    const GetUserRoles = useCallback(async () => {
        setLoading((state) => ({ ...state, loadingTable: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/statusidentity/ManageUser/GetUserRoles?userId=${Update.id}`;
        let method = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetUserRoles[]>> = await AxiosRequest({ url, data, method, credentials: true });
        if (response) {
            setLoading((state) => ({ ...state, loadingTable: false }))
            if (response.data.status && response.data.data.length > 0) {
                setState((state) => ({ ...state, UserRoles: response.data.data }))
            }
        }
    }, [Update])
    useEffect(() => {
        GetUserRoles()
    }, [GetUserRoles, Update])

    useEffect(() => {
        const GetRolesList = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/statusidentity/ManageUser/GetRolesList`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<GetStatusRolesListModels[]>> = await AxiosRequest({ url, data, method, credentials: true });
            if (response) {
                if (response.data.status && response.data.data) {
                    setState((state) => ({
                        ...state, RoleList: response.data.data.map((item: GetStatusRolesListModels) => {
                            return {
                                id: item.id,
                                value: item.value,
                                name: item.name,
                                label: item.name
                            }
                        })
                    }))
                }
            }
        }
        GetRolesList()
    }, [])

    const DeleteUserRole = async (item: GetUserRoles) => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Remove Role",
            text: "Are you sure?!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "yes!",
            cancelButtonColor: "#d33",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading((state) => ({ ...state, loadingResponse: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/statusidentity/ManageUser/ToggleRoleActivity?userId=${item.userId}&RoleName=${state.RoleList.find((x => x.id == item.roleId))?.name}&isActive=${!item.isActive}`;
                let method = 'delete';
                let data = {};
                let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, data, method, credentials: true });
                if (response) {
                    setLoading((state) => ({ ...state, loadingResponse: false }))
                    if (response.data.status && response.data.data) {
                        let index = state.UserRoles.indexOf(state.UserRoles.find((option) => option.id == item.id)!);
                        let newOption: GetUserRoles = {
                            id: item.id,
                            isActive: !item.isActive,
                            roleId: item.roleId,
                            userId: item.userId
                        };
                        state.UserRoles.splice(index, 1);
                        state.UserRoles.push(newOption)
                        setState((state) => ({ ...state, UserRoles: [...state.UserRoles] }))
                    } else {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Remove Role",
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK",
                            text: response.data.message,
                            icon: response.data.status ? "warning" : "error",
                        })
                    }
                }
            }
        })
    }


    const OnSubmit = async () => {
        if (!errors.SelectRole) {
            Swal.fire({
                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "Add Role to User",
                text: "Are you sure?!",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#22c55e",
                confirmButtonText: "yes, Add Role!",
                cancelButtonColor: "#f43f5e",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading((state) => ({ ...state, loadingResponse: true }))
                    let url = `${process.env.NEXT_PUBLIC_API_URL}/statusidentity/ManageUser/AddRoleToUser`;
                    let method = 'put';
                    let data = {
                        "userId": Update.id,
                        "roleId": getValues('SelectRole.RoleName'),
                        "isActive": getValues('SelectRole.isActive')
                    }
                    let response: AxiosResponse<Response<GetResponseAddRole>> = await AxiosRequest({ url, method, data, credentials: true })
                    if (response) {
                        setLoading((state) => ({ ...state, loadingResponse: false }))
                        if (response.data.status && response.data.data != null) {
                            setState((state) => ({
                                ...state, UserRoles: [...state.UserRoles, {
                                    id: response.data.data.id,
                                    isActive: response.data.data.isActive,
                                    roleId: response.data.data.roleId,
                                    userId: response.data.data.userId
                                }]
                            }))
                            reset()
                        } else {
                            Swal.fire({
                                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: "Add Role to User",
                                text: response.data.message,
                                icon: response.data.status ? "warning" : "error",
                                confirmButtonColor: "#22c55e",
                                confirmButtonText: "OK"
                            })
                        }

                    }
                }
            })
        }
    }

    return (
        <>
            {loading.loadingResponse == true && <Loading />}
            <section>
                <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} h-full my-2`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <form
                        onSubmit={handleSubmit(OnSubmit)}
                        className='relative z-[10]'>
                        <div dir='rtl' className="w-max">
                            <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Add User Role' placement="top">
                                <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <SaveIcon className='p-1' />
                                </Button>
                            </Tooltip>
                        </div>
                        <section className='grid grid-cols-1 md:grid-cols-3 md:gap-x-2 md:gap-y-5 my-2'>
                            <div className='relative'>
                                <Select isSearchable
                                    value={state.RoleList.find((item) => item.id == watch(`SelectRole.RoleName`)) ?? null}
                                    {...register(`SelectRole.RoleName`)}
                                    minMenuHeight={300}
                                    options={state.RoleList}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full absolute z-[90000]`} placeholder="Role"
                                    theme={(theme) => ({
                                        ...theme,
                                        height: 10,
                                        borderRadius: 5,
                                        colors: {
                                            ...theme.colors,
                                            color: '#607d8b',
                                            neutral10: `${color?.color}`,
                                            primary25: `${color?.color}`,
                                            primary: '#607d8b',
                                            neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                            neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`,
                                            neutral20: errors?.SelectRole?.RoleName ? '#d32f3c' : '#607d8b',
                                            neutral30: errors?.SelectRole?.RoleName ? '#d32f3c' : '#607d8b',
                                            neutral50: errors?.SelectRole?.RoleName ? '#d32f3c' : '#607d8b',
                                        },
                                    })}
                                    onChange={(option: SingleValue<GetStatusRolesListModels>, actionMeta: ActionMeta<GetStatusRolesListModels>) => {
                                        setValue(`SelectRole.RoleName`, option!.id),
                                            trigger()
                                    }}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >
                                    {errors?.SelectRole && errors?.SelectRole?.RoleName?.message}</label>
                            </div>
                            <div className='flex md:justify-center'>
                                <FormControlLabel
                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                    control={<Checkbox
                                        sx={{
                                            color: color?.color,
                                            '&.Mui-checked': {
                                                color: color?.color,
                                            },
                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        {...register(`SelectRole.isActive`)}
                                        checked={watch('SelectRole.isActive')}
                                        onChange={(event) => { setValue(`SelectRole.isActive`, event.target.checked), trigger() }}
                                    />}
                                    label="is Active" />
                            </div>
                        </section>
                    </form>
                </CardBody>
                <Tabs value="currentRole" className="my-3 h-full relative z-[5]">
                    <TabsHeader
                        dir='rtl'
                        className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} w-full md:w-[400px] flex flex-col md:flex-row md:justify-end`}
                        indicatorProps={{
                            style: {
                                background: color?.color,
                            },
                            className: `shadow !text-gray-900`,
                        }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                        <Tab onClick={() => setActiveTab('PreviousRole')} className='min-w-max' value="PreviousRole"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}  >
                            <Typography variant='h6' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] font-thin`} style={{ color: activeTab == 'PreviousRole' ? 'white' : '' }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Previous Role</Typography>
                        </Tab>
                        <Tab onClick={() => setActiveTab('currentRole')} className='min-w-max' value="currentRole"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                            <Typography variant='h6' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] font-thin`} style={{ color: activeTab == 'currentRole' ? 'white' : '' }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>current Role</Typography>
                        </Tab>
                    </TabsHeader>
                    <TabsBody
                        animate={{
                            initial: { y: 10 },
                            mount: { y: 0 },
                            unmount: { y: 250 },
                        }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                        <TabPanel value='currentRole' className="p-0 w-full">
                            <section dir='ltr' className='w-[100%] h-[72vh] mx-auto overflow-auto p-0 my-3' >
                                {loading.loadingTable == false ?
                                    state.UserRoles.length > 0 && <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[70vh] relative text-center `}>
                                        <thead >
                                            <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                                                <th style={{ borderBottomColor: color?.color }}
                                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                >
                                                    <Typography
                                                        color="blue-gray"
                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        #
                                                    </Typography>
                                                </th>
                                                <th style={{ borderBottomColor: color?.color }}
                                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                >
                                                    <Typography
                                                        color="blue-gray"
                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        Role Name
                                                    </Typography>
                                                </th>

                                                <th style={{ borderBottomColor: color?.color }}
                                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                >
                                                    <Typography
                                                        color="blue-gray"
                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        is Active
                                                    </Typography>
                                                </th>
                                                <th style={{ borderBottomColor: color?.color }}
                                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                >
                                                    <Typography
                                                        color="blue-gray"
                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        Action
                                                    </Typography>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                                            {state.UserRoles.filter((item) => item.isActive == true).map((role: GetUserRoles, index: number) => (
                                                <tr key={'role' + index}
                                                    className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`}
                                                >
                                                    <td style={{ width: '5%' }} className='p-1'>
                                                        <Typography
                                                            dir='ltr'
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >{index + 1}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ width: '25%' }} className='p-1 relative'>
                                                        <Typography
                                                            dir='ltr'
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >
                                                            {state.RoleList.length > 0 ? state.RoleList.find((item) => item.id == role.roleId)!.label : ''}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ minWidth: '110px', width: "20%" }} className=' relative'>

                                                        <FormControlLabel
                                                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                            control={<Checkbox
                                                                checked={role.isActive == true ? true : false}
                                                                sx={{
                                                                    color: color?.color,
                                                                    '&.Mui-checked': {
                                                                        color: color?.color,
                                                                    },
                                                                }}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                            />}
                                                            label="" />
                                                    </td>
                                                    <td style={{ width: '5%' }} className='p-1'>
                                                        <div className='container-fluid mx-auto p-0.5'>
                                                            <div className="flex flex-row justify-evenly">
                                                                <Button
                                                                    onClick={() => { DeleteUserRole(role); } }
                                                                    style={{ background: color?.color }} size="sm"
                                                                    className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                                    <DeleteIcon
                                                                        fontSize='small'
                                                                        className='p-1'
                                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>))}
                                        </tbody>
                                    </table> : <TableSkeleton />}
                            </section>
                        </TabPanel>
                        <TabPanel value='PreviousRole' className="p-0 w-full">
                            <section dir='ltr' className='w-[100%] h-[72vh] mx-auto overflow-auto p-0 my-3' >
                                {loading.loadingTable == false ?
                                    state.UserRoles.length > 0 && <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[70vh] relative text-center `}>
                                        <thead >
                                            <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                                                <th style={{ borderBottomColor: color?.color }}
                                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                >
                                                    <Typography
                                                        color="blue-gray"
                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        #
                                                    </Typography>
                                                </th>
                                                <th style={{ borderBottomColor: color?.color }}
                                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                >
                                                    <Typography
                                                        color="blue-gray"
                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        Role Name
                                                    </Typography>
                                                </th>

                                                <th style={{ borderBottomColor: color?.color }}
                                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                >
                                                    <Typography
                                                        color="blue-gray"
                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        is Active
                                                    </Typography>
                                                </th>

                                                <th style={{ borderBottomColor: color?.color }}
                                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                >
                                                    <Typography
                                                        color="blue-gray"
                                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        Action
                                                    </Typography>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                                            {state.UserRoles.filter((item) => item.isActive == false).map((role: GetUserRoles, index: number) => (
                                                <tr key={'role' + index}
                                                    className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`}
                                                >
                                                    <td style={{ width: '5%' }} className='p-1'>
                                                        <Typography
                                                            dir='ltr'
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >{index + 1}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ width: '25%' }} className='p-1 relative'>
                                                        <Typography
                                                            dir='ltr'
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >
                                                            {state.RoleList.length > 0 ? state.RoleList.find((item) => item.id == role.roleId)!.label : ''}
                                                        </Typography>

                                                    </td>
                                                    <td style={{ minWidth: '110px', width: "20%" }} className=' relative'>

                                                        <FormControlLabel
                                                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                            control={<Checkbox
                                                                checked={role.isActive == true ? true : false}
                                                                sx={{
                                                                    color: color?.color,
                                                                    '&.Mui-checked': {
                                                                        color: color?.color,
                                                                    },
                                                                }}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                            />}
                                                            label="" />

                                                    </td>

                                                    <td style={{ width: '5%' }} className='p-1'>
                                                        <div className='container-fluid mx-auto p-0.5'>
                                                            <div className="flex flex-row justify-evenly">
                                                                <Button
                                                                    onClick={() => { DeleteUserRole(role); } }
                                                                    style={{ background: color?.color }} size="sm"
                                                                    className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                                    <DeleteIcon
                                                                        fontSize='small'
                                                                        className='p-1'
                                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>))}
                                        </tbody>
                                    </table> : <TableSkeleton />}
                            </section>
                        </TabPanel>
                    </TabsBody>
                </Tabs>

                {/* <section dir='ltr' className='w-[100%] h-[72vh] mx-auto overflow-auto p-0 my-3' >
                    {loading.loadingTable == false ?
                        state.UserRoles.length > 0 && <table className={"w-full max-h-[70vh] relative text-center " + themeMode?.themeTable}>
                            <thead >
                                <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                                    <th style={{ borderBottomColor: color?.color }}
                                        className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                    >
                                        <Typography
                                            color="blue-gray"
                                            className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        >
                                            #
                                        </Typography>
                                    </th>
                                    <th style={{ borderBottomColor: color?.color }}
                                        className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                    >
                                        <Typography
                                            color="blue-gray"
                                            className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        >
                                            Role Name
                                        </Typography>
                                    </th>

                                    <th style={{ borderBottomColor: color?.color }}
                                        className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                    >
                                        <Typography
                                            color="blue-gray"
                                            className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        >
                                            is Active
                                        </Typography>
                                    </th>
                                    <th style={{ borderBottomColor: color?.color }}
                                        className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                    >
                                        <Typography
                                            color="blue-gray"
                                            className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                        >
                                            Action
                                        </Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                                {state.UserRoles.filter((item) => item.isActive == true).map((role: GetUserRoles, index: number) => (
                                    <tr key={'role' + index}
                                        className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`}
                                    >
                                        <td style={{ width: '5%' }} className='p-1'>
                                            <Typography
                                                dir='ltr'
                                                variant="small"
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                            >{index + 1}
                                            </Typography>
                                        </td>
                                        <td style={{ width: '25%' }} className='p-1 relative'>
                                            <Typography
                                                dir='ltr'
                                                variant="small"
                                                color="blue-gray"
                                                className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                            >
                                                {state.RoleList.find((item) => item.id == role.roleId)!.label}
                                            </Typography>

                                        </td>
                                        <td style={{ minWidth: '110px', width: "20%" }} className=' relative'>

                                            <FormControlLabel
                                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                control={<Checkbox
                                                    checked={role.isActive == true ? true : false}
                                                    sx={{
                                                        color: color?.color,
                                                        '&.Mui-checked': {
                                                            color: color?.color,
                                                        },
                                                    }}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />}
                                                label="" />

                                        </td>
                                        <td style={{ width: '5%' }} className='p-1'>
                                            <div className='container-fluid mx-auto p-0.5'>
                                                <div className="flex flex-row justify-evenly">
                                                    <Button
                                                        onClick={() => { DeleteUserRole(role) }}
                                                        style={{ background: color?.color }} size="sm"
                                                        className="p-1 mx-1">
                                                        <DeleteIcon
                                                            fontSize='small'
                                                            className='p-1'
                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                        />
                                                    </Button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>))}
                            </tbody>
                        </table> : <TableSkeleton />}
                </section> */}
            </section>
        </>

    )
}

export default AddRole