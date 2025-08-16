'use client';
import { Button, CardBody, Tooltip, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import UpdateUsersStore from '@/app/zustandData/updateUsers';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import Select, { ActionMeta, SingleValue } from 'react-select';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import DeleteIcon from '@mui/icons-material/Delete';
import useStore from '@/app/hooks/useStore';
import useAxios from '@/app/hooks/useAxios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useLoginUserInfo from '@/app/zustandData/useLoginUserInfo';
import { useFieldArray, useForm } from 'react-hook-form';
import { AxiosResponse } from 'axios';
import { GetBaseType, GetBaseValueTypes, Response, UserClaimsModel } from '@/app/models/UserManagement/Role';
import { SelectUserClaimsType } from '@/app/models/HR/userInformation';
import Swal from 'sweetalert2';
import { GetUserRolesModel } from '@/app/models/UserManagement/Role';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import Loading from '@/app/components/shared/loadingResponse';

const RolesClaims = () => {
    const { AxiosRequest } = useAxios()
    const CurrentUserId = useLoginUserInfo((state) => state.userInfo?.actors?.length > 0 ? state.userInfo.actors[0]?.userId : '');
    const CurrentUserName = useLoginUserInfo((state) => state.userInfo?.actors?.length > 0 ? state.userInfo.actors[0]?.userName : '');
    const User = UpdateUsersStore((state)=>state);
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    type Loading = {
        loadingTable: boolean,
        loadingResponse: boolean
    }
    type States = {
        ClaimsType: GetBaseType[],
        ClaimsValue: GetBaseValueTypes[],
        UserClaims: UserClaimsModel[]
    }
    let loadings = {
        loadingTable: false,
        loadingResponse: false
    }
    let ClaimsState = {
        ClaimsType: [],
        ClaimsValue: [],
        UserClaims: []
    }
    const [state, setState] = useState<States>(ClaimsState)
    const [loading, setLoading] = useState<Loading>(loadings)

    const schema = yup.object({
        SelectUserClaims: yup.object().shape({
            claimType: yup.number().required().min(1, 'اجباری'),
            claimValue: yup.number().required().min(1, 'اجباری'),
        }).required(),
    })

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState,
        control,
        watch,
        trigger,
    } = useForm<SelectUserClaimsType>(
        {
            defaultValues: {
                SelectUserClaims: {
                    claimType: 0,
                    claimValue: 0
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    useEffect(() => {
        const GetUserRoles = async () => {
            setLoading((state) => ({ ...state, loadingTable: true }))
            let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetUserClaims?userId=${User.userId != null ? User.userId : CurrentUserId}`;
            let method = 'get';
            let data = {}
            let response: AxiosResponse<Response<UserClaimsModel[]>> = await AxiosRequest({ url, data, method, credentials: true });
            if (response) {
                setLoading((state) => ({ ...state, loadingTable: false }))
                if (response.data.status && response.data.data && response.data.data.length > 0) {
                    setState((state) => ({ ...state, UserClaims: response.data.data }))
                }
            }
        }
        GetUserRoles()
    }, [User.userId, CurrentUserId])

    useEffect(() => {
        const GetBaseTypes = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/GetBaseTypes`;
            let method = 'get';
            let data = {}
            let response: AxiosResponse<Response<GetBaseType[]>> = await AxiosRequest({ url, data, method, credentials: true });
            if (response) {
                if (response.data.status && response.data.data.length > 0) {
                    setState((state) => ({
                        ...state, ClaimsType: response.data.data.map((item) => {
                            return {
                                id: item.id,
                                label: item.title,
                                title: item.title,
                                type: item.type,
                                value: item.value,
                            }
                        })
                    }))
                }
            }
        }
        GetBaseTypes()
    }, [])

    const GetBaseValueType = async (id: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/GetBaseValueTypes?baseTypeId=${id}`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetBaseValueTypes[]>> = await AxiosRequest({ url, data, method, credentials: true });
        if (response) {
            if (response.data.status && response.data.data.length > 0) {
                setState((state) => ({
                    ...state, ClaimsValue: response.data.data.map((item: GetBaseValueTypes) => {
                        return {
                            id: item.id,
                            value: item.value,
                            label: item.value,
                            Value: item.id
                        }
                    })
                }))
            }
        }
    }


    const OnSubmit = async () => {
        if (!errors.SelectUserClaims) {
            Swal.fire({
                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "افزودن دسترسی به کاربر",
                text: "آیا از افزودن دسترسی جدید اطمینان دارید!؟",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#22c55e",
                confirmButtonText: "yes, Add Claim!",
                cancelButtonColor: "#f43f5e",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading((state) => ({ ...state, loadingResponse: true }))
                    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/AddClaimToUser`;
                    let method = 'put';
                    let data = {
                        "userId": User.userId != null ? User.userId : CurrentUserId,
                        "claimType": state.ClaimsType.find((item) => item.id == getValues('SelectUserClaims.claimType'))!.title,
                        "claimValue": state.ClaimsValue.find((item) => item.id == getValues('SelectUserClaims.claimValue'))!.value,
                    }
                    let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                    if (response) {
                        setLoading((state) => ({ ...state, loadingResponse: false }))
                        if (response.data.status && response.data.data != 0) {
                            state.UserClaims.push({
                                type: state.ClaimsType.find((item) => item.id == getValues('SelectUserClaims.claimType'))!.title,
                                value: state.ClaimsValue.find((item) => item.id == getValues('SelectUserClaims.claimValue'))!.value,
                                id: response.data.data
                            })
                            setState((state) => ({ ...state, UserClaims: [...state.UserClaims] }))
                            setValue('SelectUserClaims.claimType', 0)
                            setValue('SelectUserClaims.claimValue', 0)
                            reset()
                        } else {
                            Swal.fire({
                                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: "افزودن دسترسی به کاربر",                               
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

    const DeleteUserClaims = (claimsId: number) => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "حذف دسترسی از کاربر",
            text: "آیا از حذف این دسترسی اطمینان دارید!؟",
            icon: "question",          
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            confirmButtonText: "yes, Delete it!",
            cancelButtonColor: "#f43f5e",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading((state) => ({ ...state, loadingResponse: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/DeleteUserClaim?claimId=${claimsId}`;
                let method = 'delete';
                let data = {};
                let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    setLoading((state) => ({ ...state, loadingResponse: false }))
                    if (response.data.status && response.data.data != 0) {
                        let index = state.UserClaims.indexOf(state.UserClaims.find((item) => item.id == claimsId)!);
                        state.UserClaims.splice(index, 1)
                        setState((state) => ({ ...state }))
                    } else {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "حذف دسترسی از کاربر",                          
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



    return (
        <>
            {loading.loadingResponse && <Loading />}
            <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} h-auto mx-auto `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                    onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10]'>
                    <div dir='rtl' className="w-max">
                        <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Add Claims To User' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SaveIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <section className='grid grid-cols-1 md:grid-cols-2 md:gap-x-2 md:gap-y-5 my-2'>
                        <div className='p-1  relative'>
                            <Select
                                value={state.ClaimsType.find((item) => item.id == watch(`SelectUserClaims.claimType`)) ?? null}
                                isSearchable
                                {...register(`SelectUserClaims.claimType`)}
                                minMenuHeight={300}
                                options={state.ClaimsType}
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full z-[90000]`} placeholder="Claims Type"
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
                                        neutral20: errors?.SelectUserClaims?.claimType ? '#d32f3c' : '#607d8b',
                                        neutral30: errors?.SelectUserClaims?.claimType ? '#d32f3c' : '#607d8b',
                                        neutral50: errors?.SelectUserClaims?.claimType ? '#d32f3c' : '#607d8b',
                                    },
                                })}
                                onChange={(option: SingleValue<GetBaseType>, actionMeta: ActionMeta<GetBaseType>) => {
                                    setValue(`SelectUserClaims.claimType`, option!.id),
                                        GetBaseValueType(option!.id)
                                    trigger()
                                }
                                }
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >
                                {errors?.SelectUserClaims && errors?.SelectUserClaims?.claimType?.message}</label>
                        </div>
                        <div className='p-1  relative'>
                            <Select isSearchable
                                value={state.ClaimsValue.find((item) => item.id == watch(`SelectUserClaims.claimValue`)) ?? null}
                                {...register(`SelectUserClaims.claimValue`)}
                                minMenuHeight={300}
                                options={state.ClaimsValue}
                                className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full z-[90000]`} placeholder="Claims Value"
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
                                        neutral20: errors?.SelectUserClaims?.claimValue ? '#d32f3c' : '#607d8b',
                                        neutral30: errors?.SelectUserClaims?.claimValue ? '#d32f3c' : '#607d8b',
                                        neutral50: errors?.SelectUserClaims?.claimValue ? '#d32f3c' : '#607d8b',
                                    },
                                })}
                                onChange={(option: SingleValue<GetBaseValueTypes>, actionMeta: ActionMeta<GetBaseValueTypes>) => {
                                    setValue(`SelectUserClaims.claimValue`, option!.id),
                                        trigger()
                                }
                                }
                            />
                            <label className='text-[10px] flex w-full absolute top-[100%] left-0 justify-end font-[FaBold] text-start text-red-400' >
                                {errors?.SelectUserClaims && errors?.SelectUserClaims?.claimValue?.message}</label>
                        </div>
                    </section>
                </form>
            </CardBody>
            <section dir='ltr' className='w-[100%] h-[72vh] mx-auto overflow-auto p-0 my-3' >
                {loading.loadingTable == false ?
                    state.UserClaims.length > 0 && <table className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[70vh] relative text-center `}>
                        <thead >
                            <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        color="blue-gray"
                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        #
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        color="blue-gray"
                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Claim Type
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        color="blue-gray"
                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Claim Value
                                    </Typography>
                                </th>
                                <th style={{ borderBottomColor: color?.color }}
                                    className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                >
                                    <Typography
                                        color="blue-gray"
                                        className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        Action
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`statusTable divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                            {state.UserClaims.map((claim: UserClaimsModel, index: number) => (
                                <tr key={'role' + index}
                                    className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`}
                                >
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <Typography
                                            dir='ltr'
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >{index + 1}
                                        </Typography>
                                    </td>
                                    <td style={{ minWidth: '110px', width: "20%" }} className=' relative'>
                                        <Typography
                                            dir='ltr'
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {claim.type}
                                        </Typography>

                                    </td>
                                    <td style={{ width: '25%' }} className='py-3 h-full relative'>
                                        <Typography
                                            dir='ltr'
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {claim.value}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '5%' }} className='p-1'>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <Button 
                                                    onClick={() => DeleteUserClaims(claim.id)}
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
        </>


    )
}

export default RolesClaims