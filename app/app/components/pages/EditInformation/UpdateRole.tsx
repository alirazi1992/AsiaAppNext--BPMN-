import { Accordion, AccordionBody, AccordionHeader, Button, CardBody, IconButton, Tooltip } from '@material-tailwind/react';
import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TitleComponent from '../../shared/TitleComponent';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import SaveIcon from '@mui/icons-material/Save';
import { createTheme, ThemeProvider, Theme, useTheme, styled } from '@mui/material/styles';
import AsyncSelect from 'react-select/async';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import * as yup from "yup";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { AddNewRoleModel, GetOrganizationRoleModel, GetRoleByRoleIdModel } from '@/app/models/UserManagement/Role';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { GetRelatedDepartmentList } from '@/app/models/UserManagement/DepartmentModels';
import { TreeItem, TreeItemProps, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { AxiosResponse } from 'axios';
import useAxios from '@/app/hooks/useAxios';
import FolderIcon from '@mui/icons-material/Folder';
import { Response } from '@/app/models/HR/sharedModels';
import { TreeView } from '@mui/x-tree-view/TreeView';
import Swal from 'sweetalert2';
import InputSkeleton from '../../shared/InputSkeleton';
declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}
type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    bgColorForDarkMode?: string;
    color?: string;
    colorForDarkMode?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: any;
    labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'dark',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        paddingRight: theme.spacing(1),
        [`& .${treeItemClasses.content}`]: {
            paddingRight: theme.spacing(3),
        },
    },
})) as unknown as typeof TreeItem;

const StyledTreeItem = React.forwardRef(function StyledTreeItem(
    props: StyledTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
) {
    const theme = useTheme();
    const {
        bgColor,
        labelIcon: LabelIcon,
        labelInfo,
        labelText,
        colorForDarkMode,
        bgColorForDarkMode,
        ...other
    } = props;

    const styleProps = {
        '--tree-view-color': theme.palette.mode !== 'dark' ? "" : "",
        '--tree-view-bg-color':
            theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    };
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state);
    return (
        <StyledTreeItemRoot
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.5,
                        pr: 0.5,
                    }}
                >
                    <Box component={LabelIcon} style={{ color: `${LabelIcon == InsertDriveFileIcon ? "#667dd1e5" : "#d1a72a"}` }} sx={{ mr: 1 }} />
                    <Typography className='pr-2' style={{ color: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}` }} variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" style={{ color: `${color?.color}` }}>
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={styleProps}
            {...other}
            ref={ref}
        />
    );
});

type Props = {
    roleId: string,
    state: (data: boolean) => void
}

const UpdateRole = (props: Props) => {
    const { AxiosRequest } = useAxios()
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [accordion, setAccordion] = useState<number>(1);
    const handleAccordion = (value: any) => setAccordion(accordion)
    const outerTheme = useTheme();
    const schema = yup.object().shape({
        AddNewRole: yup.object(({
            name: yup.string().required('نام انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faName: yup.string().required('نام اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            title: yup.string().required('عنوان انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faTitle: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            artemisAspNetDepartmentId: yup.number().required('اجباری'),
        })).required(),
    })
    const {
        unregister,
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        getValues,
        formState,
        trigger,
    } = useForm<AddNewRoleModel>(
        {
            defaultValues: {
                AddNewRole: {
                    faName: '',
                    faTitle: '',
                    name: '',
                    title: '',
                    isConfirmed: false,
                    parentArtemisAspNetRolesId: null,
                    artemisAspNetDepartmentId: 0,
                    orgId: 0,
                    artemisAspNetDepartmentName: '',
                    artemisAspNetDepartmentFaName: '',
                    roleId: null

                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );

    useEffect(() => {
        const GetSelctedRole = async () => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetRoleById?roleId=${props.roleId}`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<GetRoleByRoleIdModel>> = await AxiosRequest({ url, method, data, credentials: true });
            if (response) {
                if (response.data.status && response.data.data != null) {
                    GetOrganizationRole(response.data.data.orgId)
                    GetDepartmentsHierarchyByOrgId(response.data.data.orgId)
                    setValue('AddNewRole', {
                        artemisAspNetDepartmentId: response.data.data.departmentId,
                        faName: response.data.data.faName,
                        faTitle: response.data.data.faTitle,
                        name: response.data.data.name,
                        title: response.data.data.title,
                        parentArtemisAspNetRolesId: response.data.data.parentId,
                        isConfirmed: response.data.data.isConfirmed,
                        orgId: response.data.data.orgId
                    })
                }
            }
        }
        GetSelctedRole()

    }, [props, setValue])

    const [getAllRoles, setGetAllRoles] = useState<GetOrganizationRoleModel[]>([])
    const GetOrganizationRole = async (id: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/GetOrganizationRole?orgId=${id}`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetOrganizationRoleModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
            if (response.data.status && response.data.data) {
                setGetAllRoles(response.data.data.map((item) => {
                    return {
                        departmentName: item.departmentName,
                        faDepartmentName: item.faDepartmentName,
                        faName: item.faName,
                        faOrganizationName: item.faOrganizationName,
                        faTitle: item.faTitle,
                        id: item.id,
                        value: item.id,
                        label: item.faDepartmentName != null ? item.faName + ' ' + item.faDepartmentName : item.faName,
                        name: item.name,
                        organizationName: item.faOrganizationName,
                        title: item.faTitle,
                    }
                }))
                setGetAllRoles((state) => ([...state, {
                    departmentName: '',
                    faDepartmentName: '',
                    faName: '',
                    faOrganizationName: "",
                    faTitle: '',
                    id: '',
                    value: '',
                    label: 'ندارد',
                    name: '',
                    organizationName: '',
                    title: ""
                }]))
            } else {
                setGetAllRoles([])
            }
        }
    }
    const [allDepartments, setAllDepartments] = useState<GetRelatedDepartmentList[]>([])
    const GetDepartmentsHierarchyByOrgId = async (orgId: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetDepartmentsHierarchyByOrgId?orgId=${orgId}`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetRelatedDepartmentList[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
            if (response.data.status && response.data.data) {
                setAllDepartments(response.data.data)
            }
        }
    }

    const errors = formState.errors;
    const customTheme = (outerTheme: Theme) =>
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
    function CreateFolderDepartmentChild(subDepartments: GetRelatedDepartmentList[]) {
        return (
            subDepartments.map((item: GetRelatedDepartmentList, index: number) => {
                return (
                    <StyledTreeItem
                        id={"folder_" + item.id}
                        key={"folder_" + item.id}
                        nodeId={item.id.toString()}
                        labelText={item.faName ?? item.faTitle}
                        labelIcon={FolderIcon}
                        labelInfo={(<Checkbox
                            sx={{
                                color: color?.color,
                                '&.Mui-checked': {
                                    color: color?.color,
                                },
                            }}
                            defaultChecked={item.id == getValues('AddNewRole.artemisAspNetDepartmentId') ? true : false}
                            onChange={() => {
                                setValue('AddNewRole', {
                                    ...getValues('AddNewRole'), artemisAspNetDepartmentId: item.id, artemisAspNetDepartmentFaName: item.faName, artemisAspNetDepartmentName: item.name
                                }), trigger()
                            }}
                        />)}>
                        {item.subDepartements != null ? CreateFolderDepartmentChild(item.subDepartements) : null}
                    </StyledTreeItem>
                );
            }
            )
        );
    }
    const OnSubmit = () => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ویرایش سمت',
            text: "آیا از ویرایش این سمت اطمینان دارید؟",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, ,update it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/EditRole`;
                let method = "patch";
                let data = {
                    "id": props.roleId,
                    "title": getValues('AddNewRole.title'),
                    "faTitle": getValues('AddNewRole.faTitle'),
                    "faName": getValues('AddNewRole.faName'),
                    "name": getValues('AddNewRole.name'),
                    "artemisAspNetDepartmentId": getValues('AddNewRole.artemisAspNetDepartmentId'),
                    "isConfirmed": getValues('AddNewRole.isConfirmed'),
                    "isDeleted": false,
                    "parentArtemisAspNetRolesId": getValues('AddNewRole.parentArtemisAspNetRolesId')
                };
                let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    props.state(false)
                    reset()
                    if (response.data.data == 0) {
                        props.state(false)
                        reset()
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: 'ویرایش سمت',
                            text: response.data.message,
                            icon: response.data.status && response.data.data == 0 ? 'warning' : 'error',
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK"
                        })
                    }
                }
            }
        })
    }
    return (
        <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} h-full relative rounded-lg overflow-auto`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <section className='w-full h-full flex flex-col md:flex-row md:justify-between '>
                <form onSubmit={handleSubmit(OnSubmit)} className='h-full w-full'>
                    <div dir='rtl' className="w-full">
                        <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Add Organization' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SaveIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <ThemeProvider theme={customTheme(outerTheme)}>
                        <section dir='rtl' className='w-full max-h-[58vh] gap-x-4 p-3 grid md:grid-cols-2'>
                            <section className='flex flex-col gap-y-2 w-[100%] h-full'>
                                <section className='my-1 relative w-full'>
                                    <TextField
                                        autoComplete='off'
                                        sx={{ fontFamily: 'FaLight' }}
                                        {...register(`AddNewRole.faName`)}
                                        tabIndex={1}
                                        error={errors?.AddNewRole && errors?.AddNewRole?.faName && true}
                                        className='w-full lg:my-0 font-[FaLight]'
                                        dir='rtl'
                                        size='small'
                                        label='نام'
                                        InputProps={{
                                            style: { color: errors?.AddNewRole?.faName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                        }}
                                    />
                                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddNewRole?.faName && errors?.AddNewRole?.faName?.message}</label>
                                </section>
                                <section className='my-1 relative w-full'>
                                    <TextField
                                        autoComplete='off'
                                        sx={{ fontFamily: 'FaLight' }}
                                        {...register(`AddNewRole.faTitle`)}
                                        tabIndex={3}
                                        error={errors?.AddNewRole && errors?.AddNewRole?.faTitle && true}
                                        className='w-full lg:my-0 font-[FaLight]'
                                        dir='rtl'
                                        size='small'
                                        label='عنوان'
                                        InputProps={{
                                            style: { color: errors?.AddNewRole?.faTitle ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                        }}
                                    />
                                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddNewRole?.faTitle && errors?.AddNewRole?.faTitle?.message}</label>
                                </section>
                                {getValues('AddNewRole.orgId') !== 0 ? <section className='my-2 relative w-full border-select-group py-0'>
                                    <FormControlLabel
                                        className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} p-0`}
                                        control={<Checkbox
                                            sx={{
                                                color: color?.color,
                                                '&.Mui-checked': {
                                                    color: color?.color,
                                                },
                                            }} {...register('AddNewRole.isConfirmed')}
                                            defaultChecked={getValues('AddNewRole.isConfirmed') == true ? true : false}
                                            onChange={(event) => { setValue('AddNewRole.isConfirmed', event.target.checked), trigger() }} />} label="تائید شده" />
                                </section> : <InputSkeleton />}
                            </section>
                            <section className='flex flex-col h-full gap-y-2 w-[100%]'>
                                <section className='relative my-1 w-full'>
                                    <TextField
                                        autoComplete='off'
                                        tabIndex={9}
                                        {...register(`AddNewRole.name`)}
                                        error={errors?.AddNewRole && errors?.AddNewRole?.name && true}
                                        className='w-full lg:my-0 font-[FaLight]'
                                        size='small'
                                        dir='ltr'
                                        sx={{ fontFamily: 'FaLight' }}
                                        label="Name"
                                        InputProps={{
                                            style: { color: errors?.AddNewRole?.name ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                        }}
                                    />
                                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddNewRole?.name && errors?.AddNewRole?.name?.message}</label>
                                </section>
                                <section className='my-1 relative w-full'>
                                    <TextField
                                        autoComplete='off'
                                        dir='ltr'
                                        sx={{ fontFamily: 'FaLight' }}
                                        {...register(`AddNewRole.title`)}
                                        tabIndex={11}
                                        error={errors?.AddNewRole && errors?.AddNewRole?.title && true}
                                        className='w-full lg:my-0 font-[FaLight]'
                                        size='small'
                                        label='title'
                                        InputProps={{
                                            style: { color: errors?.AddNewRole?.title ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                        }}
                                    />
                                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddNewRole?.title && errors?.AddNewRole?.title?.message}</label>
                                </section>
                                {getAllRoles.length > 0 ? <section className='relative my-1.5 w-full'>
                                    <Select isRtl
                                        maxMenuHeight={300}
                                        placeholder='سمت مافوق'
                                        className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] `}
                                        options={getAllRoles}
                                        {...register('AddNewRole.parentArtemisAspNetRolesId')}
                                        defaultValue={getAllRoles.find((item: GetOrganizationRoleModel) => item.id == getValues('AddNewRole.parentArtemisAspNetRolesId')) != null
                                            ? getAllRoles.find((item: GetOrganizationRoleModel) => item.id == getValues('AddNewRole.parentArtemisAspNetRolesId')) :
                                            getAllRoles.find((item) => item.label == 'ندارد')}
                                        onChange={(option: SingleValue<GetOrganizationRoleModel>, actionMeta: ActionMeta<GetOrganizationRoleModel>) => {
                                            setValue('AddNewRole.parentArtemisAspNetRolesId', option!.id)
                                        }}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                backgroundColor: 'transparent',
                                                borderColor: '#607d8b',
                                                boxShadow: '#607d8b',
                                                '&:hover': {
                                                    borderColor: errors?.AddNewRole?.parentArtemisAspNetRolesId ? '#d32f3c' : '#607d8b',
                                                },
                                            })
                                        }}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                color: '#607d8b',
                                                neutral10: `${color?.color}`,
                                                primary25: `${color?.color}`,
                                                primary: '#607d8b',
                                                neutral0: `${!themeMode ||themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                neutral80: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                neutral20: errors?.AddNewRole?.parentArtemisAspNetRolesId ? '#d32f3c' : '#607d8b',
                                                neutral30: errors?.AddNewRole?.parentArtemisAspNetRolesId ? '#d32f3c' : '#607d8b',
                                                neutral50: errors?.AddNewRole?.parentArtemisAspNetRolesId ? '#d32f3c' : '#607d8b',
                                            },
                                        })}
                                    />
                                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddNewRole?.parentArtemisAspNetRolesId && errors?.AddNewRole?.parentArtemisAspNetRolesId?.message}</label>
                                </section> : <InputSkeleton />}
                            </section>
                        </section>
                    </ThemeProvider>
                    <Accordion open={accordion === 1}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <AccordionHeader className={`h-[45px] border-none ${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'}`} onClick={() => handleAccordion(1)}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <TitleComponent >
                                <IconButton style={{ background: color?.color }} size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <ApartmentIcon />
                                </IconButton>
                                <span className='px-4'> انتخاب واحد</span>
                            </TitleComponent>
                        </AccordionHeader>
                        <section dir='ltr' className='w-[98%] max-h-[40vh] relative mx-auto overflow-auto p-0 my-3' >
                            <AccordionBody dir='rtl'>
                                <TreeView
                                    aria-label="AsiaAppDepartments"
                                    defaultCollapseIcon={<ArrowDropDownIcon style={{ color: `${color?.color}` }} />}
                                    defaultExpandIcon={<ArrowRightIcon style={{ color: `${color?.color}` }} />}
                                    defaultEndIcon={<div style={{ width: 24 }} />}
                                    sx={{ height: "100%", flexGrow: 1, maxWidth: "100%", overflowY: 'auto', padding: "10px" }}
                                >
                                    {
                                        allDepartments?.map((option: GetRelatedDepartmentList, index: number) => {
                                            if (option.subDepartements != undefined) {
                                                return (
                                                    <StyledTreeItem
                                                        key={index}
                                                        nodeId={option.id.toString()}
                                                        labelText={option.faName ?? option.faTitle}
                                                        labelIcon={FolderIcon}
                                                        labelInfo={(<Checkbox
                                                            sx={{
                                                                color: color?.color,
                                                                '&.Mui-checked': {
                                                                    color: color?.color,
                                                                },
                                                            }}
                                                            defaultChecked={option.id == getValues('AddNewRole.artemisAspNetDepartmentId') ? true : false}
                                                            onChange={() => {
                                                                setValue('AddNewRole', {
                                                                    ...getValues('AddNewRole'), artemisAspNetDepartmentId: option.id, artemisAspNetDepartmentFaName: option.faName, artemisAspNetDepartmentName: option.name
                                                                }), trigger()
                                                            }}
                                                        />)}>
                                                        {option.subDepartements && CreateFolderDepartmentChild(option.subDepartements)}
                                                    </StyledTreeItem>
                                                )
                                            }
                                            else {
                                                return (
                                                    <StyledTreeItem
                                                        key={index}
                                                        nodeId={option.id.toString()}
                                                        labelText={option.faName ?? option.faTitle}
                                                        labelIcon={FolderIcon}
                                                        labelInfo={(<Checkbox
                                                            sx={{
                                                                color: color?.color,
                                                                '&.Mui-checked': {
                                                                    color: color?.color,
                                                                },
                                                            }}
                                                            defaultChecked={option.id == getValues('AddNewRole.artemisAspNetDepartmentId') ? true : false}
                                                            onChange={() => {
                                                                setValue('AddNewRole', {
                                                                    ...getValues('AddNewRole'), artemisAspNetDepartmentId: option.id, artemisAspNetDepartmentFaName: option.faName, artemisAspNetDepartmentName: option.name
                                                                }), trigger()
                                                            }}
                                                        />)}
                                                    />
                                                )
                                            }
                                        })
                                    }
                                </TreeView >
                            </AccordionBody>
                        </section>
                    </Accordion>
                </form>
            </section>
        </CardBody>
    )
}

export default UpdateRole