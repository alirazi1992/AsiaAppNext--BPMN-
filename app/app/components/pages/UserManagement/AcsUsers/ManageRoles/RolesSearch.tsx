'use client'
import React, { useState } from 'react'
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Button, CardBody, Dialog,
    DialogBody, DialogHeader,
    IconButton, Popover,
    PopoverContent, PopoverHandler, Tooltip
} from '@material-tailwind/react';
import Box from '@mui/material/Box';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Typography } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import Groups3Icon from '@mui/icons-material/Groups3';
import MenuIcon from '@mui/icons-material/Menu';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { createTheme, ThemeProvider, Theme, useTheme, styled } from '@mui/material/styles';
import AsyncSelect from 'react-select/async';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import FolderIcon from '@mui/icons-material/Folder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { TreeItem, TreeItemProps, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import SaveIcon from '@mui/icons-material/Save';
import TitleComponent from '@/app/components/shared/TitleComponent';
import ApartmentIcon from '@mui/icons-material/Apartment';
import useAxios from '@/app/hooks/useAxios';
import { AxiosResponse } from 'axios';
import { Response } from '@/app/models/HR/sharedModels';
import { CustomerOptionProps, CustomerProps } from '@/app/models/UserManagement/AddOrganization.models';
import { FormControlLabel, TextField, Checkbox } from '@mui/material';
import { AddNewRoleModel, GetOrganizationRoleModel, GetRelatedDepartmentList, GetRolesHierarchyByOrgIdModel } from '@/app/models/UserManagement/Role';
import { TreeView } from '@mui/x-tree-view/TreeView';
import Swal from 'sweetalert2';
import Loading from '@/app/components/shared/loadingResponse';
import RolesClaims from './setRolesClaims';
import UsersByRoleId from './UsersByRoleId';
import { getAllDepartmentIds } from './manageRolesUtils';
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
                    <Typography className='pr-2' style={{ color: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}` }} variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
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

const RolesSearch = () => {
    const { AxiosRequest } = useAxios()
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const [activeItem, setActiveItem] = useState<string>('')
    const [addRole, setAddRole] = useState<boolean>(false)
    const [addClaims, setAddClaims] = useState<boolean>(false)
    const handleAddRole = () => setAddRole(!addRole)
    const handleClaims = () => setAddClaims(!addClaims)
    const [update, setUpdate] = useState<boolean>(false)
    const [accordion, setAccordion] = useState<number>(1);
    const handleAccordion = (value: any) => setAccordion(accordion)
    let customerTimeOut: any;
    type Loading = {
        loadingTable: boolean,
        loadingResponse: boolean
    }
    let loading = {
        loadingTable: false,
        loadingResponse: false
    }

    const [loadings, setLoadings] = useState<Loading>(loading)
    const [openList, setOpenList] = useState<boolean>(false)
    const handleOpenList = () => setOpenList(!openList);
    let options: any = [{ faName: 'ندارد', id: 0, label: 'ندارد', name: 'ندارد', nationalCode: "", value: 0 }]
    const filterSearchCustomers = async (searchinputValue: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/searchCustomers?searchkey=${searchinputValue}`;
        let method = 'get';
        let data = {};
        if (searchinputValue && searchinputValue != null && searchinputValue.trim() != '') {
            let response: AxiosResponse<Response<CustomerOptionProps[]>> = await AxiosRequest({ url, method, data, credentials: true })
            options = (response.data.data != null && response.data.data.length > 0) && [...response.data.data.map((item: CustomerProps, index: number) => {
                return {
                    value: item.id,
                    label: item.nationalCode != null ? item.faName + ` _ ` + item.nationalCode : item.faName,
                    name: item.name,
                    faName: item.faName,
                    nationalCode: item.nationalCode,
                    id: item.id
                }
            })]
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
    //
    const schema = yup.object().shape({
        AddNewRole: yup.object(({
            name: yup.string().required('نام انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faName: yup.string().required('نام اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            title: yup.string().required('عنوان انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faTitle: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            artemisAspNetDepartmentId: yup.number()
                .required('اجباری')
                .test('is-valid-department', 'لطفا دپارتمان خود را وارد کنید.', function (value) {
                    const { createError } = this;
                    const departmentExists = getAllDepartmentIds(allDepartments)?.some((departmentId) => departmentId === value);
                    // const departmentExists = allDepartments.some(department => department.id === value);
                    return departmentExists || createError({ message: 'لطفا دپارتمان خود را وارد کنید.' });
                }),
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
    const errors = formState.errors;

    const EditedRoles = (newRole: GetRolesHierarchyByOrgIdModel, allRoles: GetRolesHierarchyByOrgIdModel[] = state.Roles) => {
        if (newRole.parentArtemisAspNetRolesId == null) {
            allRoles.push(newRole)
            return;
        }
        let isExist = allRoles.find(p => p.id == newRole.parentArtemisAspNetRolesId);
        if (isExist && isExist != null) {
            if (isExist.subRoles.length == 0) {
                isExist.subRoles = [{ ...newRole }]
            } else {
                isExist.subRoles!.push(newRole);
            }
            return;
        } else {
            allRoles.map((role: GetRolesHierarchyByOrgIdModel) => {
                if (role.subRoles != null && role.subRoles.length > 0) {
                    EditedRoles(newRole, role.subRoles)
                }
            })
        }
    }

    const UpdateRolesState = (roles: GetRolesHierarchyByOrgIdModel[]) => {
        let isExist = roles.find(p => p.id == updateRole!.parentArtemisAspNetRolesId)
        if (isExist && isExist != null) {
            let newRole: GetRolesHierarchyByOrgIdModel = {
                department: {
                    faName: getValues('AddNewRole.artemisAspNetDepartmentFaName') ?? null,
                    id: getValues('AddNewRole.artemisAspNetDepartmentId'),
                    name: getValues('AddNewRole.artemisAspNetDepartmentName') ?? null
                },
                faName: getValues('AddNewRole.faName'),
                faTitle: getValues('AddNewRole.faTitle'),
                id: updateRole!.id,
                isConfirmed: getValues('AddNewRole.isConfirmed') ?? false,
                name: getValues('AddNewRole.name'),
                parentArtemisAspNetRolesId: getValues('AddNewRole.parentArtemisAspNetRolesId')!,
                subRoles: updateRole!.subRoles,
                title: getValues('AddNewRole.title')
            };
            let changedItem = isExist.subRoles.find((item) => item.id == updateRole!.id)!
            let index = isExist.subRoles.indexOf(changedItem);
            if (isExist.id == newRole.parentArtemisAspNetRolesId) {
                isExist.subRoles.splice(index, 1, newRole);
                return;
            }
            else {
                isExist.subRoles.splice(index, 1);
                EditedRoles(newRole);
                return;
            }
        }
        else {
            if (updateRole!.parentArtemisAspNetRolesId == null) {
                let index = roles.indexOf(roles.find(p => p.id == updateRole!.id)!)
                let newRole: GetRolesHierarchyByOrgIdModel = {
                    department: {
                        faName: getValues('AddNewRole.artemisAspNetDepartmentFaName') ?? null,
                        id: getValues('AddNewRole.artemisAspNetDepartmentId'),
                        name: getValues('AddNewRole.artemisAspNetDepartmentName') ?? null
                    },
                    faName: getValues('AddNewRole.faName'),
                    faTitle: getValues('AddNewRole.faTitle'),
                    id: updateRole!.id,
                    isConfirmed: getValues('AddNewRole.isConfirmed') ?? false,
                    name: getValues('AddNewRole.name'),
                    parentArtemisAspNetRolesId: getValues('AddNewRole.parentArtemisAspNetRolesId')!,
                    subRoles: updateRole!.subRoles,
                    title: getValues('AddNewRole.title')
                };
                roles.splice(index, 1);
                EditedRoles(newRole);
            } else {
                for (let role of roles) {
                    if (role.subRoles != null && role.subRoles.length > 0) {
                        UpdateRolesState(role.subRoles);
                    }

                }
            }
        }
    }

    const OnSubmit = async () => {
        if (update == false) {
            Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "افزودن سمت",
                text: "آیا از افزودن سمت جدید اطمینان دارید!؟",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#22c55e",
                confirmButtonText: "yes, add Role!",
                cancelButtonColor: "#f43f5e",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoadings((state) => ({ ...state, loadingResponse: true }))
                    if (!errors.AddNewRole) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/AddRole`;
                        let method = 'put';
                        let data = {
                            "name": getValues('AddNewRole.name'),
                            "faName": getValues('AddNewRole.faName'),
                            "title": getValues('AddNewRole.title'),
                            "faTitle": getValues('AddNewRole.faTitle'),
                            "isConfirmed": getValues('AddNewRole.isConfirmed'),
                            "artemisAspNetDepartmentId": getValues('AddNewRole.artemisAspNetDepartmentId'),
                            "parentArtemisAspNetRolesId": getValues('AddNewRole.parentArtemisAspNetRolesId')
                        };
                        let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true });
                        if (response) {
                            setLoadings((state) => ({ ...state, loadingResponse: false }))
                            if (response.data.status && response.data.data != null) {
                                if (selectedAddRole != null) {
                                    if (selectedAddRole.subRoles != null) {
                                        selectedAddRole.subRoles.push({
                                            department: {
                                                faName: getValues('AddNewRole.artemisAspNetDepartmentFaName') ?? null,
                                                id: getValues('AddNewRole.artemisAspNetDepartmentId'),
                                                name: getValues('AddNewRole.artemisAspNetDepartmentName') ?? null,
                                            },
                                            faName: getValues('AddNewRole.faName'),
                                            faTitle: getValues('AddNewRole.faTitle'),
                                            id: response.data.data,
                                            isConfirmed: getValues('AddNewRole.isConfirmed')!,
                                            name: getValues('AddNewRole.name'),
                                            parentArtemisAspNetRolesId: getValues('AddNewRole.parentArtemisAspNetRolesId')!,
                                            subRoles: [],
                                            title: getValues('AddNewRole.title')
                                        })
                                    } else {
                                        selectedAddRole.subRoles = [
                                            {
                                                department: {
                                                    faName: getValues('AddNewRole.artemisAspNetDepartmentFaName') ?? null,
                                                    id: getValues('AddNewRole.artemisAspNetDepartmentId'),
                                                    name: getValues('AddNewRole.artemisAspNetDepartmentName') ?? null,
                                                },
                                                faName: getValues('AddNewRole.faName'),
                                                faTitle: getValues('AddNewRole.faTitle'),
                                                id: response.data.data,
                                                isConfirmed: getValues('AddNewRole.isConfirmed')!,
                                                name: getValues('AddNewRole.name'),
                                                parentArtemisAspNetRolesId: getValues('AddNewRole.parentArtemisAspNetRolesId')!,
                                                subRoles: [],
                                                title: getValues('AddNewRole.title')
                                            }
                                        ]
                                    }
                                } else {
                                    state.Roles.length > 0 ?
                                        state.Roles.push({
                                            department: {
                                                faName: getValues('AddNewRole.artemisAspNetDepartmentFaName') ?? null,
                                                id: getValues('AddNewRole.artemisAspNetDepartmentId'),
                                                name: getValues('AddNewRole.artemisAspNetDepartmentName') ?? null,
                                            },
                                            faName: getValues('AddNewRole.faName'),
                                            faTitle: getValues('AddNewRole.faTitle'),
                                            id: response.data.data,
                                            isConfirmed: getValues('AddNewRole.isConfirmed')!,
                                            name: getValues('AddNewRole.name'),
                                            parentArtemisAspNetRolesId: getValues('AddNewRole.parentArtemisAspNetRolesId')!,
                                            subRoles: [],
                                            title: getValues('AddNewRole.title')
                                        }) :
                                        state.Roles = [
                                            {
                                                department: {
                                                    faName: getValues('AddNewRole.artemisAspNetDepartmentFaName') ?? null,
                                                    id: getValues('AddNewRole.artemisAspNetDepartmentId'),
                                                    name: getValues('AddNewRole.artemisAspNetDepartmentName') ?? null,
                                                },
                                                faName: getValues('AddNewRole.faName'),
                                                faTitle: getValues('AddNewRole.faTitle'),
                                                id: response.data.data,
                                                isConfirmed: getValues('AddNewRole.isConfirmed')!,
                                                name: getValues('AddNewRole.name'),
                                                parentArtemisAspNetRolesId: getValues('AddNewRole.parentArtemisAspNetRolesId')!,
                                                subRoles: [],
                                                title: getValues('AddNewRole.title')
                                            }
                                        ]
                                }
                                setState((state) => ({ ...state, Roles: [...state.Roles] }))
                            } else {
                                Swal.fire({
                                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: "افزودن سمت",
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK"
                                })
                            }
                            handleAddRole()
                            reset()
                        }
                    }
                }
            })
        } else {
            Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
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
                    setLoadings((state) => ({ ...state, loadingResponse: true }))
                    let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/EditRole`;
                    let method = "patch";
                    let data = {
                        "id": updateRole?.id,
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
                        setLoadings((state) => ({ ...state, loadingResponse: false }))
                        handleAddRole()
                        if (response.data.status && response.data.data != 0) {
                            UpdateRolesState(state.Roles)
                            let findOption = getAllRoles.find(i => i.id == updateRole!.id);
                            let indexOption = getAllRoles.indexOf(findOption!)
                            let all = getAllRoles
                            let newOption: GetOrganizationRoleModel = {
                                departmentName: getValues('AddNewRole.artemisAspNetDepartmentName') ?? null,
                                faDepartmentName: getValues('AddNewRole.artemisAspNetDepartmentFaName') ?? null,
                                faName: getValues('AddNewRole.faName'),
                                faOrganizationName: options.find((item: any) => item.id == getValues('AddNewRole.orgId')).faName,
                                faTitle: getValues('AddNewRole.faTitle'),
                                id: updateRole!.id,
                                label: getValues('AddNewRole.faName'),
                                name: getValues('AddNewRole.name'),
                                organizationName: options.find((item: any) => item.id == getValues('AddNewRole.orgId')).name,
                                title: getValues('AddNewRole.title'),
                                value: updateRole!.id
                            }
                            all.splice(indexOption, 1);
                            all.push(newOption)
                            setGetAllRoles([...all])
                            reset()
                        } else {
                            Swal.fire({
                                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                                allowOutsideClick: false,
                                title: 'ویرایش سمت',
                                text: response.data.message,
                                icon: response.data.status ? "warning" : 'error',
                                confirmButtonColor: "#22c55e",
                                confirmButtonText: "OK"
                            })
                            reset()
                        }

                    }
                }
            })
        }
    }
    //
    const outerTheme = useTheme();
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

    const [getAllRoles, setGetAllRoles] = useState<GetOrganizationRoleModel[]>([])
    //Select-ParentOrganization
    const GetOrganizationRole = async (orgId: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/profile/GetOrganizationRole?orgId=${orgId}`;
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
    //HierarchyRoles
    type GetAllRoles = {
        Roles: GetRolesHierarchyByOrgIdModel[],
    }
    let getRolesByOrgId = {
        Roles: [],
    }
    const [state, setState] = useState<GetAllRoles>(getRolesByOrgId);
    const GetRolesHierarchyByOrgId = async (orgId: number) => {
        setLoadings((state) => ({ ...state, loadingResponse: true }))
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetRolesHierarchyByOrgId?orgId=${orgId}`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetRolesHierarchyByOrgIdModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
            setLoadings((state) => ({ ...state, loadingResponse: false }))
            if (response.data.status && response.data.data?.length > 0) {
                setState((state) => ({
                    ...state, Roles:
                        response.data.data.map((item) => {
                            return {
                                department: item.department,
                                faName: item.faName,
                                faTitle: item.faTitle,
                                id: item.id,
                                isConfirmed: item.isConfirmed,
                                name: item.name,
                                parentArtemisAspNetRolesId: item.parentArtemisAspNetRolesId,
                                subRoles: item.subRoles,
                                title: item.faTitle,
                            }
                        })
                }))
            } else {
                setState((state) => ({
                    ...state, Roles: []
                }))
            }
        }
    }
    const GetUsers = (id: string) => {
        setValue('AddNewRole.roleId', id);
        handleOpenList();
    }

    const [allDepartments, setAllDepartments] = useState<GetRelatedDepartmentList[]>([])
    const GetRelatedDepartmentList = async (departmentId: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetRelatedDepartmentsList?departmentId=${departmentId}`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetRelatedDepartmentList[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
            if (response.data.status && response.data.data) {
                setAllDepartments(response.data.data)
            }
        }
    }
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

    function CreateFolderChild(subRoles: GetRolesHierarchyByOrgIdModel[]) {
        return (
            subRoles.map((item: GetRolesHierarchyByOrgIdModel, index: number) => {
                return (
                    <StyledTreeItem
                        id={"folder_" + item.id}
                        key={"folder_" + item.id}
                        nodeId={item.id.toString()}
                        labelText={item.department.faName != null ? (item.faName + ' ' + item.department.faName) : item.faName}
                        labelIcon={FolderIcon}
                        labelInfo={
                            <>
                                <Popover placement="right" key={"menu_" + item.id} >
                                    <PopoverHandler>
                                        <MenuIcon
                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                        />
                                    </PopoverHandler>
                                    <PopoverContent className={!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                        <ul>
                                            <li onClick={() => { DeleteRole(item), setActiveItem('delete') }} dir='rtl' style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف سمت</span></li>
                                            <li onClick={() => { setSelectedAddRole(item), setValue('AddNewRole.parentArtemisAspNetRolesId', item.id), setActiveItem('add'), GetRelatedDepartmentList(item.department.id), handleAddRole() }} dir='rtl' style={{ background: `${activeItem == "add" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><AddIcon /> <span className='mx-2'>افزودن سمت</span></li>
                                            <li onClick={() => { UpdateRole(item) }} dir='rtl' style={{ background: `${activeItem == "update" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <EditIcon /> <span className='mx-2'>ویرایش سمت</span></li>
                                            <li onClick={() => { setValue('AddNewRole.parentArtemisAspNetRolesId', item.id), setActiveItem('claims'), handleClaims() }} dir='rtl' style={{ background: `${activeItem == "claims" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <LockOpenIcon /> <span className='mx-2'>دسترسی ها</span></li>
                                            <li onClick={() => GetUsers(item.id)} dir='rtl' style={{ background: `${activeItem == "claims" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <Groups3Icon /> <span className='mx-2'>کاربران</span></li>
                                        </ul>
                                    </PopoverContent>
                                </Popover>
                            </>
                        }
                    >
                        {item.subRoles != null ? CreateFolderChild(item.subRoles) : null}
                    </StyledTreeItem >
                );
            }
            )
        );
    }
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

    const [selectedAddRole, setSelectedAddRole] = useState<GetRolesHierarchyByOrgIdModel | null>(null)

    const FindRoles = (id: string, parentId: string, array: GetRolesHierarchyByOrgIdModel[]) => {
        let isExist = array.find(p => p.id == parentId);
        if (parentId == null) {
            let result = array.filter((item) => item.id != id)
            return setState((state) => ({ ...state, Roles: [...result] }))
        }
        else if (isExist != null) {
            isExist.subRoles = [...isExist.subRoles!.filter(p => p.id != id)]
            setState((state) => ({ ...state, Roles: [...state.Roles] }))
            return
        } else {
            array.map((option: GetRolesHierarchyByOrgIdModel, index: number) => {
                if (option.subRoles != null) {
                    FindRoles(id, parentId, option.subRoles);
                }
            })
        }
    }

    const DeleteRole = async (removedRole: GetRolesHierarchyByOrgIdModel) => {
        Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'حذف سمت',
            text: "آیا از حذف این سمت اطمینان دارید؟",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadings((state) => ({ ...state, loadingResponse: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/DeleteRole?roleId=${removedRole.id}`;
                let method = "delete";
                let data = {};
                let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    setLoadings((state) => ({ ...state, loadingResponse: false }))
                    if (response.data.data && response.data.status) {
                        FindRoles(removedRole.id, removedRole.parentArtemisAspNetRolesId!, state.Roles)
                    } else {
                        Swal.fire({
                            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: 'حذف سمت',
                            text: response.data.message,
                            icon: response.data.status ? "warning" : 'error',
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "OK"
                        })
                    }
                }
            }
        });
    }

    const AddNewRole = () => {
        if (getValues('AddNewRole.orgId') == 0 || getValues('AddNewRole.orgId') == null) {
            Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: 'افزودن سمت',
                text: 'لطفا سازمان مربوطه را انتخاب نمایید',
                icon: "warning",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK",
            });
        } else {
            GetDepartmentsHierarchyByOrgId(getValues('AddNewRole.orgId')!), handleAddRole()
        }
    }

    const UpdateRole = (option: GetRolesHierarchyByOrgIdModel) => {
        GetDepartmentsHierarchyByOrgId(getValues('AddNewRole.orgId')!)
        setActiveItem('update')
        setUpdateRole(option)
        setUpdate(true)
        setValue('AddNewRole', {
            ...getValues('AddNewRole'),
            artemisAspNetDepartmentFaName: option.department!.faName ?? null,
            artemisAspNetDepartmentId: option.department.id,
            artemisAspNetDepartmentName: option.department!.name ?? null,
            faName: option.faName,
            faTitle: option.faTitle,
            name: option.name,
            title: option.title,
            isConfirmed: option.isConfirmed,
            parentArtemisAspNetRolesId: option.parentArtemisAspNetRolesId
        }),
            handleAddRole()
    }
    const [updateRole, setUpdateRole] = useState<GetRolesHierarchyByOrgIdModel | null>(null)

    return (
        <>
            {loadings.loadingResponse == true && <Loading />}
            <CardBody className={`w-[98%] my-3 mx-auto  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'carDLight'} `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <div className="w-full">
                    <div className="container-fluid mx-auto">
                        <div className="flex flex-col md:flex-row justify-end md:justify-between items-center">
                            <div className='w-[98%] md:w-[35%] flex justify-start my-2 md:my-0  '>
                                <Tooltip content="افزودن سمت" className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                                    <IconButton onClick={() => { AddNewRole(), setUpdate(false); }} style={{ background: color?.color }} size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><i className=" bi bi-plus-lg"></i>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className='w-[98%] md:w-[50%] flex justify-end my-2 md:my-0 '>
                                <AsyncSelect isRtl className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] disabled:opacity-[5px]`} cacheOptions defaultOptions placeholder="سازمان مرجع"
                                    loadOptions={loadSearchedCustomerOptions}
                                    onChange={(option: SingleValue<CustomerOptionProps>, actionMeta: ActionMeta<CustomerOptionProps>) => {
                                        GetDepartmentsHierarchyByOrgId(option!.id),
                                            GetRolesHierarchyByOrgId(option!.id), GetOrganizationRole(option!.id),
                                            setValue('AddNewRole.orgId', option!.id)
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
                                            neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                            neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                            neutral20: '#607d8b',
                                            neutral30: '#607d8b',
                                            neutral50: '#607d8b',

                                        },
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardBody dir='rtl' className='w-[98%]  mx-auto relative rounded-lg overflow-auto p-0' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <TreeView
                    aria-label="AsiaApp"
                    // defaultExpanded={idShow}
                    defaultCollapseIcon={<ArrowDropDownIcon style={{ color: `${color?.color}` }} />}
                    defaultExpandIcon={<ArrowRightIcon style={{ color: `${color?.color}` }} />}
                    defaultEndIcon={<div style={{ width: 24 }} />}
                    sx={{ height: "100%", flexGrow: 1, maxWidth: "100%", overflowY: 'auto', padding: "10px" }}
                >
                    {state.Roles?.map((option: GetRolesHierarchyByOrgIdModel, index: number) => {
                        if (option.subRoles != undefined) {
                            return (
                                <StyledTreeItem
                                    key={index}
                                    nodeId={option.id.toString()}
                                    labelText={option.department.faName != null ? option.faName + ' ' + option.department.faName : option.faName}
                                    labelIcon={FolderIcon}
                                    labelInfo={
                                        <Popover placement="right" >
                                            <PopoverHandler>
                                                <MenuIcon
                                                    onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                    onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                />
                                            </PopoverHandler>
                                            <PopoverContent className={!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                <ul>
                                                    <li onClick={() => { DeleteRole(option), setActiveItem('delete') }} dir='rtl' style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف سمت</span></li>
                                                    <li onClick={() => { setSelectedAddRole(option), setValue('AddNewRole.parentArtemisAspNetRolesId', option.id), setActiveItem('add'), GetRelatedDepartmentList(option.department.id), handleAddRole() }} dir='rtl' style={{ background: `${activeItem == "add" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><AddIcon /> <span className='mx-2'>افزودن سمت</span></li>
                                                    <li onClick={() => { UpdateRole(option) }} dir='rtl' style={{ background: `${activeItem == "update" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <EditIcon /> <span className='mx-2'>ویرایش سمت</span></li>
                                                    <li onClick={() => { setValue('AddNewRole.parentArtemisAspNetRolesId', option.id), setActiveItem('claims'), handleClaims() }} dir='rtl' style={{ background: `${activeItem == "claims" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <LockOpenIcon /> <span className='mx-2'>دسترسی ها</span></li>
                                                    <li onClick={() => GetUsers(option.id)} dir='rtl' style={{ background: `${activeItem == "claims" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <Groups3Icon /> <span className='mx-2'>کاربران</span></li>
                                                </ul>
                                            </PopoverContent>
                                        </Popover>

                                    }
                                >
                                    {option.subRoles && CreateFolderChild(option.subRoles)}
                                </StyledTreeItem>
                            )
                        }
                        else {
                            return (
                                <StyledTreeItem
                                    key={index}
                                    nodeId={option.id.toString()}
                                    labelText={option.department.faName != null ? option.faName + ' ' + option.department.faName : option.faName}
                                    labelIcon={FolderIcon}
                                    labelInfo={
                                        <Popover placement="right" >
                                            <PopoverHandler>
                                                <MenuIcon
                                                    onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                    onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                />
                                            </PopoverHandler>
                                            <PopoverContent className={!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                                <ul>
                                                    <li onClick={() => { DeleteRole(option), setActiveItem('delete') }} dir='rtl' style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف سمت</span></li>
                                                    <li onClick={() => { setSelectedAddRole(option), setValue('AddNewRole.parentArtemisAspNetRolesId', option.id), setActiveItem('add'), GetRelatedDepartmentList(option.department.id), handleAddRole() }} dir='rtl' style={{ background: `${activeItem == "add" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><AddIcon /> <span className='mx-2'>افزودن سمت</span></li>
                                                    <li onClick={() => { UpdateRole(option) }} dir='rtl' style={{ background: `${activeItem == "update" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <EditIcon /> <span className='mx-2'>ویرایش سمت</span></li>
                                                    <li onClick={() => { setValue('AddNewRole.parentArtemisAspNetRolesId', option.id), setActiveItem('claims'), handleClaims() }} dir='rtl' style={{ background: `${activeItem == "claims" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <LockOpenIcon /> <span className='mx-2'>دسترسی ها</span></li>
                                                    <li onClick={() => GetUsers(option.id)} dir='rtl' style={{ background: `${activeItem == "claims" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <Groups3Icon /> <span className='mx-2'>کاربران</span></li>
                                                </ul>
                                            </PopoverContent>
                                        </Popover>
                                    }
                                />
                            )
                        }
                    })
                    }
                </TreeView >
            </CardBody >
            <Dialog dismiss={{
                escapeKey: true,
                referencePress: true,
                referencePressEvent: 'click',
                outsidePress: false,
                outsidePressEvent: 'click',
                ancestorScroll: false,
                bubbles: true
            }} size='xl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} absolute top-0`} open={addRole} handler={handleAddRole} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} flex justify-between`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    {update == false ? 'افزودن سمت' : 'ویرایش سمت'}
                    <IconButton variant="text" color="blue-gray" onClick={() => { handleAddRole(), setUpdate(false); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                <DialogBody dir='rtl' className=" h-full relative overflow-y-scroll " placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} h-full relative rounded-lg overflow-auto`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <section className='w-full h-full flex flex-col md:flex-row md:justify-between '>
                            <form onSubmit={handleSubmit(OnSubmit)} className='h-full w-full'>
                                <div dir='rtl' className="w-full">
                                    <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Add Organization' placement="top">
                                        <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                                        style: { color: errors?.AddNewRole?.faName ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
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
                                                        style: { color: errors?.AddNewRole?.faTitle ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddNewRole?.faTitle && errors?.AddNewRole?.faTitle?.message}</label>
                                            </section>
                                            <section className='my-2 relative w-full border-select-group py-0'>
                                                <FormControlLabel
                                                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} p-0`}
                                                    control={<Checkbox
                                                        sx={{
                                                            color: color?.color,
                                                            '&.Mui-checked': {
                                                                color: color?.color,
                                                            },
                                                        }} {...register('AddNewRole.isConfirmed')}
                                                        defaultChecked={getValues('AddNewRole.isConfirmed') == true ? true : false}
                                                        onChange={(event) => { setValue('AddNewRole.isConfirmed', event.target.checked), trigger() }} />} label="تائید شده" />

                                            </section>
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
                                                        style: { color: errors?.AddNewRole?.name ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
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
                                                        style: { color: errors?.AddNewRole?.title ? '#b91c1c' : !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' },
                                                    }}
                                                />
                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddNewRole?.title && errors?.AddNewRole?.title?.message}</label>
                                            </section>
                                            <Tooltip content='test'>
                                                <section className='relative my-1.5 w-full'>
                                                    <Select isRtl
                                                        maxMenuHeight={300}
                                                        isDisabled={update == false ? true : false}
                                                        placeholder='سمت مافوق'
                                                        className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] `}
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
                                                                neutral0: `${!themeMode || themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
                                                                neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`,
                                                                neutral20: errors?.AddNewRole?.parentArtemisAspNetRolesId ? '#d32f3c' : '#607d8b',
                                                                neutral30: errors?.AddNewRole?.parentArtemisAspNetRolesId ? '#d32f3c' : '#607d8b',
                                                                neutral50: errors?.AddNewRole?.parentArtemisAspNetRolesId ? '#d32f3c' : '#607d8b',
                                                            },
                                                        })}
                                                    />
                                                    <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddNewRole?.parentArtemisAspNetRolesId && errors?.AddNewRole?.parentArtemisAspNetRolesId?.message}</label>
                                                </section>
                                            </Tooltip>
                                        </section>
                                    </section>
                                </ThemeProvider>
                                <Accordion open={accordion === 1} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <AccordionHeader className={`h-[45px] border-none ${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'}`} onClick={() => handleAccordion(1)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        <TitleComponent >
                                            <IconButton style={{ background: color?.color }} size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                <ApartmentIcon />
                                            </IconButton>
                                            <span className='px-4'> انتخاب واحد</span>

                                        </TitleComponent>
                                    </AccordionHeader>
                                    <section dir='ltr' className='w-[98%] max-h-[40vh] relative mx-auto overflow-auto p-0 my-3' >
                                        <AccordionBody dir='rtl'>
                                            {
                                                errors?.AddNewRole?.artemisAspNetDepartmentId && (
                                                    <p className='text-xs text-[#d32f3c]'>
                                                        {
                                                            errors?.AddNewRole?.artemisAspNetDepartmentId?.message
                                                        }
                                                    </p>
                                                )
                                            }
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
            }} size='xl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} absolute top-0 bottom-0 overflow-y-scroll `} open={addClaims} handler={handleClaims} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'cardLight darkText'} flex justify-between z-[100] sticky top-0 left-0 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    دسترسی ها
                    <IconButton variant="text" color="blue-gray" onClick={() => { handleClaims(); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                <DialogBody dir='rtl' className="relative" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <CardBody className={'h-full relative rounded-lg overflow-auto '} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <RolesClaims props={getValues('AddNewRole.parentArtemisAspNetRolesId')} />
                    </CardBody>
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
            }} size='xl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} absolute top-0 bottom-0 overflow-y-scroll `} open={openList} handler={handleOpenList} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'cardLight darkText'} flex justify-between z-[100] sticky top-0 left-0 `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    کاربران
                    <IconButton variant="text" color="blue-gray" onClick={() => { handleOpenList(); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                <DialogBody dir='rtl' className="relative" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <CardBody className={'h-full relative rounded-lg overflow-auto '} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <UsersByRoleId roleId={getValues('AddNewRole.roleId')!} />
                    </CardBody>
                </DialogBody>
            </Dialog>

        </>
    )
}

export default RolesSearch