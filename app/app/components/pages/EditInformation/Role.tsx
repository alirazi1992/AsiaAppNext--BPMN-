'use client';
import { Button, CardBody, Dialog, DialogBody, DialogHeader, IconButton, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import Select, { ActionMeta, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { Checkbox, FormControlLabel } from '@mui/material';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import useAxios from '@/app/hooks/useAxios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useLoginUserInfo from './../../../zustandData/useLoginUserInfo';
import { useFieldArray, useForm } from 'react-hook-form';
import { AxiosResponse } from 'axios';
import { GetOrganizationRoleMoleds, Response } from '@/app/models/UserManagement/Role';
import { SelectRoleType } from '@/app/models/HR/userInformation';
import Swal from 'sweetalert2';
import { GetUserRolesModel } from '@/app/models/UserManagement/Role';
import TableSkeleton from '../../shared/TableSkeleton';
import Loading from '../../shared/loadingResponse';
import { CustomerOptionProps, CustomerProps } from '@/app/models/UserManagement/AddOrganization.models';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import UpdateRole from './UpdateRole';
import UpdateRoleClaims from './UpdateRoleClaims';

const RolesClaims = () => {
    const { AxiosRequest } = useAxios()
    const [open, setOpen] = useState<boolean>(false)
    const handleUpdateDoc = () => setOpen(!open)
    const CurrentUserId = useLoginUserInfo((state) => state.userInfo?.actors?.length > 0 ? state.userInfo.actors[0]?.userId : '');
    const User = UpdateUsersStore((state) => state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const [activeTab, setActiveTab] = useState<string>('currentRole')
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const [openClaims, setOpenClaims] = useState<boolean>(false)
    const handleOpenClaims = () => setOpenClaims(!openClaims)
    const [openUpdateRole, setOpenUpdateRole] = useState<boolean>(false)
    const handleUpdateRole = () => setOpenUpdateRole(!openUpdateRole)
    const handleOpenUpdate = () => setOpenUpdate(!openUpdate)
    type Loading = {
        loadingTable: boolean,
        loadingResponse: boolean
    }
    type States = {
        OrgRoleList: GetOrganizationRoleMoleds[]
        UserRoles: GetUserRolesModel[]
    }
    let loadings = {
        loadingTable: false,
        loadingResponse: false
    }
    let RoleClaimsState = {
        OrgRoleList: [],
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
            parentOrganizationId: yup.number().required('انتخاب سازمان اجباری'),
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
    } = useForm<SelectRoleType>(
        {
            defaultValues: {
                SelectRole: {
                    parentOrganizationId: 0,
                    RoleName: '',
                    isDefault: false,
                    isActive: false,
                    roleId: ''
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    useEffect(() => {
        const GetUserRoles = async () => {
            setLoading((state) => ({ ...state, loadingTable: true }))
            let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/GetUserRoles?userId=${User.userId != null ? User.userId : CurrentUserId}`;
            let method = 'get';
            let data = {}
            let response: AxiosResponse<Response<GetUserRolesModel[]>> = await AxiosRequest({ url, data, method, credentials: true });
            if (response) {
                setLoading((state) => ({ ...state, loadingTable: false }))
                if (response.data.status && response.data.data.length > 0) {
                    setState((state) => ({ ...state, UserRoles: response.data.data }))
                }
            }
        }
        GetUserRoles()
    }, [CurrentUserId, User.userId, User.userName])


    const GetOrganizationRole = async (orgId: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/GetOrganizationRole?orgId=${orgId}`;
        let method = 'get';
        let data = {};
        if (getValues('SelectRole.parentOrganizationId') != 0 && getValues('SelectRole.parentOrganizationId') != null) {
            let response: AxiosResponse<Response<GetOrganizationRoleMoleds[]>> = await AxiosRequest({ url, data, method, credentials: true });
            if (response) {
                if (response.data.status && response.data.data) {
                    setState((state) => ({
                        ...state, OrgRoleList: response.data.data.map((item: GetOrganizationRoleMoleds) => {
                            return {
                                departmentName: item.departmentName,
                                faDepartmentName: item.faDepartmentName,
                                faName: item.faName,
                                faOrganizationName: item.faOrganizationName,
                                faTitle: item.faTitle,
                                id: item.id,
                                label: item.name,
                                name: item.name,
                                organizationName: item.organizationName,
                                title: item.title,
                                value: item.id
                            }
                        })
                    }))
                }
            }
        }
    }

    const OnSubmit = async () => {
        if (!errors.SelectRole) {
            Swal.fire({
                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "افزودن سمت به کاربر",
                text: "آیا از افزودن سمت جدید اطمینان دارید!؟",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#22c55e",
                confirmButtonText: "yes, Add Role!",
                cancelButtonColor: "#f43f5e",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading((state) => ({ ...state, loadingResponse: true }))
                    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/AddUserRoleAsync`;
                    let method = 'put';
                    let data = {
                        "userId": User.userId != null ? User.userId : CurrentUserId,
                        "roleId": getValues('SelectRole.RoleName'),
                        "isActive": getValues('SelectRole.isActive'),
                        "isDefault": getValues('SelectRole.isDefault')
                    }
                    let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                    if (response) {
                        setLoading((state) => ({ ...state, loadingResponse: false }))
                        if (response.data.status && response.data.data != 0) {
                            setState((state) => ({
                                ...state, UserRoles: [...state.UserRoles, {
                                    isActive: data.isActive!,
                                    isDefault: data.isDefault!,
                                    roleId: data.roleId,
                                    roleName: state.OrgRoleList.find((role) => role.id == data.roleId)!.name,
                                    id: response.data.data
                                }]
                            }))
                            setValue('SelectRole', {
                                parentOrganizationId: 0,
                                RoleName: '',
                                isActive: false,
                                isDefault: false
                            });
                            reset();
                        } else {
                            Swal.fire({
                                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: "افزودن سمت به کاربر",
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
    }
    let options: any = [];
    let customerTimeOut: any;
    const filterSearchCustomers = async (searchinputValue: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/searchCustomers?searchkey=${searchinputValue}`;
        let method = 'get';
        let data = {};
        if (searchinputValue && searchinputValue != null && searchinputValue.trim() != '') {
            let response: AxiosResponse<Response<CustomerOptionProps[]>> = await AxiosRequest({ url, method, data, credentials: true })
            options = response.data.data.map((item: CustomerProps, index: number) => {
                return { value: item.id, label: item.nationalCode != null ? item.faName + ` _ ` + item.nationalCode : item.faName, name: item.name, faName: item.faName, nationalCode: item.nationalCode, id: item.id }
            })

            return options.filter((i: CustomerOptionProps) =>
                i.label.toLowerCase().includes(searchinputValue.toLowerCase())
            );
        } else {
            return []
        }
    };

    const loadSearchedCustomerOptions = (
        searchinputValue: string,
        callback: (options: CustomerOptionProps[]) => void
    ) => {
        clearTimeout(customerTimeOut);
        customerTimeOut = setTimeout(async () => {
            callback(await filterSearchCustomers(searchinputValue));
        }, 1000);
    };

    const UpdateUserRole = async () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ویرایش سمت',
            text: "آیا از ویرایش سمت اطمینان دارید!؟",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, Update it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading((state) => ({ ...state, loadingResponse: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/UpdateUserRole`;
                let method = 'patch';
                let data = {
                    "id": update.id,
                    "roleId": update.roleId,
                    "userId": User.userId != null ? User.userId : CurrentUserId,
                    "isActive": update.isActive,
                    "isDefault": update.isDefault
                }
                let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true });
                if (response) {
                    handleOpenUpdate()
                    setLoading((state) => ({ ...state, loadingResponse: false }))
                    if (response.data.status && response.data.data != null) {
                        let index = state.UserRoles.indexOf(state.UserRoles.find((item) => item.id == update.id)!);
                        let newOption: GetUserRolesModel = {
                            id: update.id,
                            roleId: update.roleId,
                            isActive: update.isActive,
                            isDefault: update.isDefault,
                            roleName: update.roleName
                        };
                        state.UserRoles.splice(index, 1);
                        state.UserRoles.push(newOption)
                        setState((state) => ({ ...state, UserRoles: [...state.UserRoles] }))
                    } else {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: 'ویرایش سمت',
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

    const UpdateThisRole = (role: GetUserRolesModel) => {
        setValue('SelectRole.roleId', role.roleId)
        handleUpdateRole()
    }

    const handleClaim = (role: GetUserRolesModel) => {
        setValue('SelectRole.roleId', role.roleId)
        handleOpenClaims()
    }
    const handleState = (data: boolean) => {
        setOpenUpdateRole(data);
    };

    return (
        <>
            {loading.loadingResponse == true && <Loading />}
            <section>
                <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} h-full mx-auto `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                        <section dir='rtl' className='grid grid-cols-1 md:grid-cols-6 md:gap-x-3 md:gap-y-5 my-2'>
                            <div className='relative col-span-2'>
                                <AsyncSelect isRtl className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] disabled:opacity-[5px]`} cacheOptions defaultOptions placeholder="سازمان مرجع"
                                    // value={options.find((item: any) => item.id == watch(`SelectRole.parentOrganizationId`)) ?? null}
                                    loadOptions={loadSearchedCustomerOptions}
                                    onChange={(option: SingleValue<CustomerOptionProps>, actionMeta: ActionMeta<CustomerOptionProps>) => {
                                        setValue('SelectRole.parentOrganizationId', option!.id),
                                            GetOrganizationRole(option!.id),
                                            trigger()
                                    }}
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
                                            neutral20: '#607d8b',
                                            neutral30: '#607d8b',
                                            neutral50: '#607d8b',

                                        },
                                    })}
                                />
                                <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >
                                    {errors?.SelectRole && errors?.SelectRole?.parentOrganizationId?.message}</label>
                            </div>
                            <div className='relative col-span-2'>
                                <Select isSearchable
                                    value={state.OrgRoleList.find((item) => item.id == watch(`SelectRole.RoleName`)) ?? null}
                                    {...register(`SelectRole.RoleName`)}
                                    minMenuHeight={300}
                                    options={state.OrgRoleList}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full absolute z-[90000]`} placeholder="سمت ها"
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
                                    onChange={(option: SingleValue<GetOrganizationRoleMoleds>, actionMeta: ActionMeta<GetOrganizationRoleMoleds>) => {
                                        setValue(`SelectRole.RoleName`, option!.id)
                                        trigger()
                                    }
                                    }
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
                                        {...register(`SelectRole.isDefault`)}
                                        checked={watch('SelectRole.isDefault')}
                                        onChange={(event) => { setValue(`SelectRole.isDefault`, event.target.checked), trigger() }}
                                    />} label="is Default" />
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
                                                        is Default
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
                                        <tbody className={`statusTable divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                                            {state.UserRoles.filter((item) => item.isActive == true).map((role: GetUserRolesModel, index: number) => (
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
                                                            {role.roleName}
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
                                                    <td style={{ width: '25%' }} className='h-full relative'>
                                                        <FormControlLabel
                                                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                            control={<Checkbox
                                                                checked={role.isDefault == true ? true : false}
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
                                                    <td style={{ width: '8%' }} className='p-1'>
                                                        <div className='container-fluid mx-auto p-0.5'>
                                                            <div className="flex flex-row justify-evenly">
                                                                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update User Role' placement="left">
                                                                    <Button
                                                                        onClick={() => {
                                                                            setUpdate({
                                                                                id: role.id,
                                                                                isActive: role.isActive,
                                                                                isDefault: role.isDefault,
                                                                                roleId: role.roleId,
                                                                                roleName: role.roleName
                                                                            }),
                                                                                handleOpenUpdate();
                                                                        } }
                                                                        style={{ background: color?.color }} size="sm"
                                                                        className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                                        <ManageAccountsIcon
                                                                            fontSize='small'
                                                                            className='p-1'
                                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                        />
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Role' placement="left">
                                                                    <Button
                                                                        onClick={() => UpdateThisRole(role)}
                                                                        style={{ background: color?.color }} size="sm"
                                                                        className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                                        <SettingsIcon
                                                                            fontSize='small'
                                                                            className='p-1'
                                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                        />
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Role Claims' placement="left">
                                                                    <Button
                                                                        onClick={() => handleClaim(role)}
                                                                        style={{ background: color?.color }} size="sm"
                                                                        className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                                        <SettingsSuggestIcon
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
                                                        is Default
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
                                        <tbody className={` divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                                            {state.UserRoles.filter((item) => item.isActive == false).map((role: GetUserRolesModel, index: number) => (
                                                <tr key={'role' + index}
                                                    className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`}
                                                >
                                                    <td style={{ width: '5%' }} className='p-1 statusTable'>
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
                                                            {role.roleName}
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
                                                    <td style={{ width: '25%' }} className='h-full relative'>
                                                        <FormControlLabel
                                                            className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                            control={<Checkbox
                                                                checked={role.isDefault == true ? true : false}
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
                                                    <td style={{ width: '8%' }} className='p-1'>
                                                        <div className='container-fluid mx-auto p-0.5'>
                                                            <div className="flex flex-row justify-evenly">
                                                                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update User Role' placement="left">
                                                                    <Button
                                                                        onClick={() => {
                                                                            setUpdate({
                                                                                id: role.id,
                                                                                isActive: role.isActive,
                                                                                isDefault: role.isDefault,
                                                                                roleId: role.roleId,
                                                                                roleName: role.roleName
                                                                            }),
                                                                                handleOpenUpdate();
                                                                        } }
                                                                        style={{ background: color?.color }} size="sm"
                                                                        className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                                        <ManageAccountsIcon
                                                                            fontSize='small'
                                                                            className='p-1'
                                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                        />
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Update Role' placement="left">
                                                                    <Button
                                                                        onClick={() => UpdateThisRole(role)}
                                                                        style={{ background: color?.color }} size="sm"
                                                                        className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                                        <SettingsIcon
                                                                            fontSize='small'
                                                                            className='p-1'
                                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                        />
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Role Claims' placement="left">
                                                                    <Button
                                                                        onClick={() => handleClaim(role)}
                                                                        style={{ background: color?.color }} size="sm"
                                                                        className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                                        <SettingsSuggestIcon
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
                        </TabPanel>
                    </TabsBody>
                </Tabs>
                <Dialog dismiss={{
                    escapeKey: true,
                    referencePress: true,
                    referencePressEvent: 'click',
                    outsidePress: false,
                    outsidePressEvent: 'click',
                    ancestorScroll: false,
                    bubbles: true
                }} size='sm' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} absolute top-0 `} open={openUpdate} handler={handleOpenUpdate}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <DialogHeader dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} flex justify-between capitalize`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        edit base info
                        <IconButton variant="text" color="blue-gray" onClick={() => handleOpenUpdate()}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                    <DialogBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <form
                            className='relative z-[10]'>
                            <div dir='rtl' className="w-full">
                                <Button onClick={() => UpdateUserRole()} size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <SaveIcon className='p-1' />
                                </Button>
                            </div>
                            <section className='flex flex-col md:flex-row md:justify-around px-0 my-1.5 w-full'>

                                <FormControlLabel
                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                    control={<Checkbox
                                        defaultChecked={update.isActive == true ? true : false}
                                        sx={{
                                            color: color?.color,
                                            '&.Mui-checked': {
                                                color: color?.color,
                                            },
                                        }}
                                        onChange={(event) => { setUpdate({ ...update, isActive: event.target.checked }) }} />} label="isActive" />
                                <FormControlLabel
                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                    control={<Checkbox
                                        defaultChecked={update.isDefault == true ? true : false}
                                        sx={{
                                            color: color?.color,
                                            '&.Mui-checked': {
                                                color: color?.color,
                                            },
                                        }}
                                        onChange={(event) => { setUpdate({ ...update, isDefault: event.target.checked }) }} />} label="isDefault" />
                            </section>
                        </form>
                    </DialogBody>
                </Dialog>
                <Dialog dismiss={{
                    escapeKey: true,
                    referencePress: true,
                    referencePressEvent: 'click',
                    outsidePress: false,
                    outsidePressEvent: 'click',
                    ancestorScroll: false,
                    bubbles: true
                }} size='xl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} absolute top-0 `} open={openUpdateRole} handler={handleUpdateRole}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                    <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} flex justify-between`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ویرایش سمت
                        <IconButton variant="text" color="blue-gray" onClick={() => handleUpdateRole()}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                    <DialogBody dir='rtl' className=" h-full relative overflow-y-scroll "  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <UpdateRole roleId={getValues('SelectRole.roleId')!} state={handleState} />

                    </DialogBody >
                </Dialog >
                <Dialog dismiss={{
                    escapeKey: true,
                    referencePress: true,
                    referencePressEvent: 'click',
                    outsidePress: false,
                    outsidePressEvent: 'click',
                    ancestorScroll: false,
                    bubbles: true
                }} size='xl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} absolute top-0 `} open={openClaims} handler={handleUpdateRole}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                    <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} flex justify-between`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        دسترسی ها
                        <IconButton variant="text" color="blue-gray" onClick={() => handleOpenClaims()}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                    <DialogBody dir='rtl' className=" h-full relative overflow-y-scroll "  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <UpdateRoleClaims roleId={getValues('SelectRole.roleId')!} />
                    </DialogBody >
                </Dialog >
            </section >
        </>

    )
}

export default RolesClaims