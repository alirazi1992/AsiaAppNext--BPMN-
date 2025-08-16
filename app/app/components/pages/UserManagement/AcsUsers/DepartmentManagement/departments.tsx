'use client'
import Loading from '@/app/components/shared/loadingResponse';
import React, { useEffect, useState } from 'react';
import useStore from '@/app/hooks/useStore';
import MenuIcon from '@mui/icons-material/Menu';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import { AxiosResponse } from 'axios';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import AsyncSelect from 'react-select/async';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { Response } from '@/app/models/HR/sharedModels';
import useAxios from '@/app/hooks/useAxios';
import SaveIcon from '@mui/icons-material/Save';
import { SvgIconProps } from '@mui/material/SvgIcon';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { TreeView } from '@mui/x-tree-view/TreeView';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Checkbox, FormControl, FormControlLabel, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import EmailIcon from '@mui/icons-material/Email';
import * as yup from "yup";
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import {
    Button, CardBody, Dialog,
    DialogBody, DialogHeader,
    IconButton, Popover,
    PopoverContent, PopoverHandler, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Tooltip
} from '@material-tailwind/react';
import { TreeItem, TreeItemProps, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { createTheme, ThemeProvider, Theme, useTheme, styled } from '@mui/material/styles';
import { CustomerOptionProps, CustomerProps } from '@/app/models/UserManagement/AddOrganization.models';
import Swal from 'sweetalert2';
import { AddDepartmentModel, DepartmentListByOrgId, EmailModel, GetRelatedDepartmentList, GetSecreteriateList, PhoneType } from '@/app/models/UserManagement/DepartmentModels';
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

const DepartmentComponent = () => {
    const { AxiosRequest } = useAxios()
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    let customerTimeOut: any;
    type Loading = {
        loadingTable: boolean,
        loadingResponse: boolean
    }
    let loading = {
        loadingTable: false,
        loadingResponse: false
    }
    let options: any = [{ faName: 'ندارد', id: 0, label: 'ندارد', name: 'ندارد', nationalCode: "", value: 0 }]
    const [activeItem, setActiveItem] = useState<string>('')
    const [activeTab, setActiveTab] = useState<string>('')
    const [loadings, setLoadings] = useState<Loading>(loading)
    const [allDepartments, setAllDepartments] = useState<GetRelatedDepartmentList[]>([])
    const [selectedDepartment, setSelectedDepartment] = useState<GetRelatedDepartmentList | null>(null)
    const [addDepartment, setAddDepartment] = useState<boolean>(false)
    const handleAddDepartment = () => setAddDepartment(!addDepartment)
    const [update, setUpdate] = useState<boolean>(false)


    const schema = yup.object().shape({
        DepartmentInfo: yup.object(({
            title: yup.string().required('عنوان انگلیسی اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            faTitle: yup.string().required('عنوان اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            artemisAspNetOrganizationId: yup.number().required().min(1, 'اجباری'),
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
    } = useForm<AddDepartmentModel>(
        {
            defaultValues: {
                DepartmentInfo: {
                    faName: '',
                    faTitle: '',
                    name: '',
                    title: '',
                    isSecretariat: false,
                    isConfirmed: false,
                    isCentral: false,
                    parentDepartementId: null,
                    artemisAspNetOrganizationId: 0,
                    secretariatId: null
                },
                phoneNumbers: [],
                emails: []
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    const PhoneItems = useFieldArray({
        name: "phoneNumbers",
        control
    });
    const EmailItems = useFieldArray({
        name: "emails",
        control
    });
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

    const GetDepartmentsHierarchyByOrgId = async (orgId: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetDepartmentsHierarchyByOrgId?orgId=${orgId}`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetRelatedDepartmentList[]>> = await AxiosRequest({ url, method, data, credentials: true });
        if (response) {
            if (response.data.status && response.data.data) {
                setAllDepartments(response.data.data)
            } else {
                setAllDepartments([])
            }
        }
    }
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
    const [relatedDepartment, setRelatedDepartment] = useState<DepartmentListByOrgId[]>([{
        id: 0,
        title: '',
        faName: 'ندارد',
        faTitle: 'ندارد',
        isCentral: false,
        isConfirmed: false,
        isSecretariat: false,
        name: '',
        parentDepartementId: 0,
        secretariatId: null,
        label: 'ندارد',
        value: 0
    }])
    const GetAllDepartmentList = async (orgId: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetDepartmentsList?orgId=${orgId}`;
        let method = 'get';
        let data = {};
        let response: AxiosResponse<Response<DepartmentListByOrgId[]>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
            if (response.data.status && response.data.data) {
                setRelatedDepartment([...relatedDepartment, ...response.data.data.map((item) => {
                    return {
                        id: item.id,
                        faName: item.faName,
                        faParentDepartmentName: null,
                        faTitle: item.faTitle,
                        isCentral: item.isCentral,
                        isConfirmed: item.isConfirmed,
                        isSecretariat: item.isSecretariat,
                        label: item.faTitle,
                        name: item.name,
                        parentDepartementId: item.parentDepartementId,
                        parentDepartmentName: null,
                        secretariatId: item.secretariatId,
                        title: item.title,
                        value: item.id
                    }
                })])
            } else {
                setRelatedDepartment([])
            }
        }

    }
    const [secretariates, setSecretariates] = useState<GetSecreteriateList[]>([])


    useEffect(() => {
        const GetSecretariatesByOrgId = async (orgId: number) => {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetSecretariatesByOrgId?orgId=${orgId}`;
            let method = 'get';
            let data = {};
            let response: AxiosResponse<Response<GetSecreteriateList[]>> = await AxiosRequest({ url, method, data, credentials: true })
            if (response) {
                if (response.data.status && response.data.data) {
                    setSecretariates(response.data.data.map((item) => {
                        return {
                            faName: item.faName,
                            faTitle: item.faTitle,
                            id: item.id,
                            label: item.faName ?? item.faTitle,
                            name: item.name,
                            title: item.title,
                            value: item.id
                        }
                    }))
                } else {
                    setSecretariates([])
                }
            }

        }
        if (getValues('DepartmentInfo.artemisAspNetOrganizationId') != null && getValues('DepartmentInfo.artemisAspNetOrganizationId') != 0) {
            GetSecretariatesByOrgId(getValues('DepartmentInfo.artemisAspNetOrganizationId'))
        }
    }, [getValues('DepartmentInfo.artemisAspNetOrganizationId')])

    const loadSearchedCustomerOptions = (
        searchinputValue: string,
        callback: (options: CustomerOptionProps[]) => void
    ) => {
        clearTimeout(customerTimeOut);
        customerTimeOut = setTimeout(async () => {
            callback(await filterSearchCustomers(searchinputValue));
        }, 1000);
    };
    function CreateFolderDepartmentChild(subDepartments: GetRelatedDepartmentList[]) {
        return (
            subDepartments.map((item: GetRelatedDepartmentList, index: number) => {
                return (
                    <StyledTreeItem
                        id={"folder_" + item.id}
                        key={"folder_" + item.id}
                        nodeId={item.id.toString()}
                        labelText={item.faTitle}
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
                                    <PopoverContent aria-hidden="false" className={!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                        <ul>
                                            <li onClick={() => { setActiveItem('delete'), DeleteDepartment(item) }} dir='rtl' style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف واحد</span></li>
                                            <li onClick={() => { GetAllDepartmentList((getValues('DepartmentInfo.artemisAspNetOrganizationId')!)), setSelectedDepartment(item), setValue('DepartmentInfo.parentDepartementId', item.id), setActiveItem('add'), handleAddDepartment() }} dir='rtl' style={{ background: `${activeItem == "add" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}><AddIcon /> <span className='mx-2'>افزودن واحد</span></li>
                                            <li onClick={() => { UpdateDepartment(item) }} dir='rtl' style={{ background: `${activeItem == "update" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <EditIcon /> <span className='mx-2'>ویرایش واحد</span></li>
                                        </ul>
                                    </PopoverContent>
                                </Popover>
                            </>
                        }>
                        {item.subDepartements != null ? CreateFolderDepartmentChild(item.subDepartements) : null}
                    </StyledTreeItem >
                );
            }
            )
        );
    }
    const outerTheme = useTheme();
    const FindDepartment = (id: number, parentId: number, array: GetRelatedDepartmentList[]) => {
        let isExist = array.find(p => p.id == parentId);
        if (parentId == null) {
            let result = array.filter((item) => item.id != id)
            return setAllDepartments([...result])
        }
        else if (isExist != null) {
            isExist.subDepartements = [...isExist.subDepartements!.filter(p => p.id != id)]
            setAllDepartments([...allDepartments])
            return
        } else {
            array.map((option: GetRelatedDepartmentList) => {
                if (option.subDepartements != null) {
                    FindDepartment(id, parentId, option.subDepartements);
                }
            })
        }
    }



    const DeleteDepartment = async (removed: GetRelatedDepartmentList) => {
        Swal.fire({
            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'حذف واحد',
            text: "آیا از حذف این واحد اطمینان دارید؟",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadings((state) => ({ ...state, loadingResponse: true }))
                let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/DeleteDepartment?departmentId=${removed.id}`;
                let method = "delete";
                let data = {};
                let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true })
                if (response) {
                    setLoadings((state) => ({ ...state, loadingResponse: false }))
                    if (response.data.data && response.data.status) {
                        FindDepartment(removed.id, removed.parentDepartementId!, allDepartments)
                    } else {
                        Swal.fire({
                            background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: 'حذف واحد',
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

    const EditedDepartments = (newDeps: GetRelatedDepartmentList, allDeps: GetRelatedDepartmentList[] = allDepartments) => {
        if (newDeps.parentDepartementId == null) {
            allDeps.push(newDeps)
            return;
        }
        let isExist = allDeps.find(p => p.id == newDeps.parentDepartementId);
        if (isExist && isExist != null) {
            if (isExist.subDepartements.length == 0) {
                isExist.subDepartements = [{ ...newDeps }]
            } else {
                isExist.subDepartements!.push(newDeps);
            }
            return;
        } else {
            allDeps.map((deps: GetRelatedDepartmentList) => {
                if (deps.subDepartements != null && deps.subDepartements.length > 0) {
                    EditedDepartments(newDeps, deps.subDepartements)
                }
            })
        }
    }
    const UpdateDepartmentState = (departments: GetRelatedDepartmentList[]) => {
        let isExist = departments.find(p => p.id == selectedDepartment!.parentDepartementId)
        if (isExist && isExist != null) {
            let newDepartment: GetRelatedDepartmentList = {
                emails: getValues('emails')?.map((item) => {
                    return {
                        id: item.id,
                        address: item.address,
                        artemisAspNetDepartmentId: item.artemisAspNetDepartmentId,
                        isDefault: item.isDefault
                    }
                }) ?? [],
                faName: getValues('DepartmentInfo.faName')!,
                faTitle: getValues('DepartmentInfo.faTitle')!,
                isCentral: getValues('DepartmentInfo.isCentral')!,
                isConfirmed: getValues('DepartmentInfo.isConfirmed')!,
                id: selectedDepartment!.id,
                isSecretariat: getValues('DepartmentInfo.isSecretariat')!,
                name: getValues('DepartmentInfo.name')!,
                secretariatId: getValues('DepartmentInfo.secretariatId') ?? null,
                title: getValues('DepartmentInfo.title'),
                parentDepartementId: getValues('DepartmentInfo.parentDepartementId') == 0 ? null : getValues('DepartmentInfo.parentDepartementId')!,
                phoneNumbers: getValues('phoneNumbers')?.map((item) => {
                    return {
                        id: item.id,
                        artemisAspNetDepartmentId: item.artemisAspNetDepartmentId,
                        isDefault: item.isDefault,
                        isFax: item.isFax,
                        isMobile: item.isMobile,
                        number: item.number,
                    }
                }) ?? [],
                subDepartements: selectedDepartment!.subDepartements,
                artemisAspNetOrganization: null
            };

            let changedItem = isExist.subDepartements.find((item) => item.id == selectedDepartment?.id)!
            let index = isExist.subDepartements.indexOf(changedItem);
            if (isExist.id == newDepartment.parentDepartementId) {
                isExist.subDepartements.splice(index, 1, newDepartment);
                return;
            }
            else {
                isExist.subDepartements.splice(index, 1);
                EditedDepartments(newDepartment);
                return;
            }
        }
        else {
            if (selectedDepartment!.parentDepartementId == null) {
                let index = departments.indexOf(departments.find(p => p.id == selectedDepartment!.id)!)
                let newParentItem: GetRelatedDepartmentList = {
                    emails: getValues('emails')?.map((item) => {
                        return {
                            id: item.id,
                            address: item.address,
                            artemisAspNetDepartmentId: item.artemisAspNetDepartmentId,
                            isDefault: item.isDefault
                        }
                    }) ?? [],
                    faName: getValues('DepartmentInfo.faName')!,
                    faTitle: getValues('DepartmentInfo.faTitle')!,
                    isCentral: getValues('DepartmentInfo.isCentral')!,
                    isConfirmed: getValues('DepartmentInfo.isConfirmed')!,
                    id: selectedDepartment!.id,
                    isSecretariat: getValues('DepartmentInfo.isSecretariat')!,
                    name: getValues('DepartmentInfo.name')!,
                    secretariatId: getValues('DepartmentInfo.secretariatId') ?? null,
                    title: getValues('DepartmentInfo.title'),
                    parentDepartementId: getValues('DepartmentInfo.parentDepartementId') == 0 ? null : getValues('DepartmentInfo.parentDepartementId')!,
                    phoneNumbers: getValues('phoneNumbers')?.map((item) => {
                        return {
                            id: item.id,
                            artemisAspNetDepartmentId: item.artemisAspNetDepartmentId,
                            isDefault: item.isDefault,
                            isFax: item.isFax,
                            isMobile: item.isMobile,
                            number: item.number,
                        }
                    }) ?? [],
                    subDepartements: selectedDepartment!.subDepartements,
                    artemisAspNetOrganization: null
                }
                departments.splice(index, 1);
                EditedDepartments(newParentItem);
            } else {
                for (let deps of departments) {
                    if (deps.subDepartements != null && deps.subDepartements.length > 0) {
                        UpdateDepartmentState(deps.subDepartements);
                    }

                }
            }
        }
    }

    const UpdateDepartment = (option: GetRelatedDepartmentList) => {
        setActiveItem('update')
        GetAllDepartmentList((getValues('DepartmentInfo.artemisAspNetOrganizationId')!))
        setSelectedDepartment(option)
        setUpdate(true)
        setValue('DepartmentInfo', {
            ...getValues('DepartmentInfo'),
            faTitle: option.faTitle,
            title: option.title,
            faName: option.faName,
            isCentral: option.isCentral,
            isConfirmed: option.isConfirmed,
            isSecretariat: option.isSecretariat,
            name: option.name,
            secretariatId: option.secretariatId ?? undefined,
            parentDepartementId: option.parentDepartementId ?? null
        }),
            setValue('emails', option.emails.map((item) => {
                return {
                    address: item.address,
                    artemisAspNetDepartmentId: item.artemisAspNetDepartmentId,
                    id: item.id,
                    isDefault: item.isDefault
                }
            })),
            setValue('phoneNumbers', option.phoneNumbers.map((item) => {
                return {
                    artemisAspNetDepartmentId: item.artemisAspNetDepartmentId,
                    id: item.id,
                    isDefault: item.isDefault,
                    isFax: item.isFax,
                    isMobile: item.isMobile,
                    number: item.number
                }
            }))
        handleAddDepartment()
        // if (option.isSecretariat == true) {
        //    
        // } else {
        // }
    }

    const OnSubmit = () => {
        if (update == false) {
            Swal.fire({
                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "افزودن واحد",
                text: "آیا از افزودن واحد جدید اطمینان دارید!؟",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#22c55e",
                confirmButtonText: "yes, add department!",
                cancelButtonColor: "#f43f5e",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoadings((state) => ({ ...state, loadingResponse: true }))
                    if (!errors.DepartmentInfo) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/AddDepartment`;
                        let method = 'put';
                        let data = {
                            "name": getValues('DepartmentInfo.name'),
                            "faName": getValues('DepartmentInfo.faName'),
                            "title": getValues('DepartmentInfo.title'),
                            "faTitle": getValues('DepartmentInfo.faTitle'),
                            "parentDepartementId": getValues('DepartmentInfo.parentDepartementId') == 0 ? null : getValues('DepartmentInfo.parentDepartementId'),
                            "artemisAspNetOrganizationId": getValues('DepartmentInfo.artemisAspNetOrganizationId'),
                            "isSecretariat": getValues('DepartmentInfo.isSecretariat'),
                            "isCentral": getValues('DepartmentInfo.isCentral'),
                            "secretariatId": getValues('DepartmentInfo.secretariatId') == 0 ? null : getValues('DepartmentInfo.secretariatId'),
                            "isConfirmed": getValues('DepartmentInfo.isConfirmed'),
                            "phoneNumbers": (getValues('phoneNumbers') && getValues('phoneNumbers')!.length > 0) ? getValues('phoneNumbers')?.map((item: PhoneType) => {
                                return {
                                    isDefault: item.isDefault,
                                    isFax: item.isFax,
                                    isMobile: item.isMobile,
                                    number: item.number,
                                }
                            }) : [],
                            "emails": (getValues('emails') && getValues('emails')!.length > 0) ? getValues('emails')?.map((item: EmailModel) => {
                                return {
                                    ...item,
                                    address: item.address,
                                    isDefault: item.isDefault,
                                }
                            }) : []
                        }
                        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
                        if (response) {
                            setLoadings((state) => ({ ...state, loadingResponse: false }))
                            if (response.data.status && response.data.data != 0) {
                                if (selectedDepartment != null) {
                                    if (selectedDepartment.subDepartements != null) {
                                        selectedDepartment.subDepartements.push({
                                            emails: (getValues('emails') && getValues('emails')!.length > 0) ? getValues('emails')!.map((item: EmailModel) => {
                                                return {
                                                    ...item,
                                                    address: item.address,
                                                    isDefault: item.isDefault,
                                                    artemisAspNetDepartmentId: item.artemisAspNetDepartmentId,
                                                    id: item.id
                                                }
                                            }) : [],
                                            phoneNumbers: getValues('phoneNumbers')!,
                                            faName: getValues('DepartmentInfo.faName') ?? '',
                                            faTitle: getValues('DepartmentInfo.faTitle'),
                                            isCentral: getValues('DepartmentInfo.isCentral') ?? false,
                                            isConfirmed: getValues('DepartmentInfo.isConfirmed') ?? false,
                                            isSecretariat: getValues('DepartmentInfo.isSecretariat') ?? false,
                                            parentDepartementId: getValues('DepartmentInfo.parentDepartementId') ?? null,
                                            secretariatId: getValues('DepartmentInfo.secretariatId') ?? null,
                                            subDepartements: [],
                                            id: response.data.data,
                                            name: getValues('DepartmentInfo.name') ?? '',
                                            artemisAspNetOrganization: {
                                                faName: '',
                                                id: 0,
                                                name: ''
                                            },
                                            title: getValues('DepartmentInfo.title')
                                        })
                                    } else {
                                        selectedDepartment.subDepartements = [
                                            {
                                                emails: (getValues('emails') && getValues('emails')!.length > 0) ? getValues('emails')!.map((item: EmailModel) => {
                                                    return {
                                                        ...item,
                                                        address: item.address,
                                                        isDefault: item.isDefault,
                                                        artemisAspNetDepartmentId: item.artemisAspNetDepartmentId,
                                                        id: item.id
                                                    }
                                                }) : [],
                                                phoneNumbers: getValues('phoneNumbers')!,
                                                faName: getValues('DepartmentInfo.faName') ?? '',
                                                faTitle: getValues('DepartmentInfo.faTitle'),
                                                isCentral: getValues('DepartmentInfo.isCentral') ?? false,
                                                isConfirmed: getValues('DepartmentInfo.isConfirmed') ?? false,
                                                isSecretariat: getValues('DepartmentInfo.isSecretariat') ?? false,
                                                parentDepartementId: getValues('DepartmentInfo.parentDepartementId') ?? null,
                                                secretariatId: getValues('DepartmentInfo.secretariatId') ?? null,
                                                subDepartements: [],
                                                id: response.data.data,
                                                name: getValues('DepartmentInfo.name') ?? '',
                                                artemisAspNetOrganization: {
                                                    faName: '',
                                                    id: 0,
                                                    name: ''
                                                },
                                                title: getValues('DepartmentInfo.title')
                                            }
                                        ]
                                    }
                                } else {
                                    allDepartments.push({
                                        emails: (getValues('emails') && getValues('emails')!.length > 0) ? getValues('emails')!.map((item: EmailModel) => {
                                            return {
                                                ...item,
                                                address: item.address,
                                                isDefault: item.isDefault,
                                                artemisAspNetDepartmentId: item.artemisAspNetDepartmentId,
                                                id: item.id
                                            }
                                        }) : [],
                                        phoneNumbers: getValues('phoneNumbers')!,
                                        faName: getValues('DepartmentInfo.faName') ?? '',
                                        faTitle: getValues('DepartmentInfo.faTitle'),
                                        isCentral: getValues('DepartmentInfo.isCentral') ?? false,
                                        isConfirmed: getValues('DepartmentInfo.isConfirmed') ?? false,
                                        isSecretariat: getValues('DepartmentInfo.isSecretariat') ?? false,
                                        parentDepartementId: null,
                                        secretariatId: getValues('DepartmentInfo.secretariatId') ?? null,
                                        subDepartements: [],
                                        id: response.data.data,
                                        name: getValues('DepartmentInfo.name') ?? '',
                                        artemisAspNetOrganization: {
                                            faName: '',
                                            id: 0,
                                            name: ''
                                        },
                                        title: getValues('DepartmentInfo.title')
                                    })
                                }
                                setAllDepartments([...allDepartments])
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: "افزودن واحد",
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK"
                                })
                            }
                        }
                    }
                }
            })
        } else {
            Swal.fire({
                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "ویرایش واحد",
                text: "آیا از ویرایش این واحد اطمینان دارید!؟",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#22c55e",
                confirmButtonText: "yes, update it!",
                cancelButtonColor: "#f43f5e",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoadings((state) => ({ ...state, loadingResponse: true }))
                    if (!errors.DepartmentInfo) {
                        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/UpdateDepartment`;
                        let method = 'patch';
                        let data = {
                            "id": selectedDepartment?.id,
                            "name": getValues('DepartmentInfo.name'),
                            "faName": getValues('DepartmentInfo.faName'),
                            "title": getValues('DepartmentInfo.title'),
                            "faTitle": getValues('DepartmentInfo.faTitle'),
                            "parentDepartementId": getValues('DepartmentInfo.parentDepartementId') == 0 ? null : getValues('DepartmentInfo.parentDepartementId'),
                            "artemisAspNetOrganizationId": getValues('DepartmentInfo.artemisAspNetOrganizationId'),
                            "isSecretariat": getValues('DepartmentInfo.isSecretariat'),
                            "isCentral": getValues('DepartmentInfo.isCentral'),
                            "secretariatId": getValues('DepartmentInfo.secretariatId'),
                            "isConfirmed": getValues('DepartmentInfo.isConfirmed'),
                            "phoneNumbers": getValues('phoneNumbers')?.map((item) => {
                                return {
                                    "id": item.id,
                                    "number": item.number,
                                    "isMobile": item.isMobile,
                                    "isDefault": item.isDefault,
                                    "isDeleted": false,
                                    "isFax": item.isFax
                                }
                            }),
                            "emails": getValues('emails')?.map((item) => {
                                return {
                                    "address": item.address,
                                    "isDefault": item.isDefault,
                                    "isDeleted": false,
                                    "id": item.id
                                }
                            })
                        };
                        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
                        if (response) {
                            setLoadings((state) => ({ ...state, loadingResponse: false }))
                            if (response.data.status && response.data.data != 0) {
                                let findOption = relatedDepartment.find(i => i.id == selectedDepartment!.id);
                                UpdateDepartmentState(allDepartments)
                                let indexOption = relatedDepartment.indexOf(findOption!)
                                let all = relatedDepartment
                                let newOption: DepartmentListByOrgId = {
                                    faName: getValues('DepartmentInfo.faName')!,
                                    faTitle: getValues('DepartmentInfo.faTitle')!,
                                    id: selectedDepartment?.id!,
                                    isCentral: getValues('DepartmentInfo.isCentral')!,
                                    name: getValues('DepartmentInfo.name')!,
                                    parentDepartementId: getValues('DepartmentInfo.parentDepartementId') == 0 ? null : getValues('DepartmentInfo.parentDepartementId')!,
                                    isSecretariat: getValues('DepartmentInfo.isSecretariat') ?? false,
                                    title: getValues('DepartmentInfo.title'),
                                    isConfirmed: getValues('DepartmentInfo.isConfirmed') ?? false,
                                    secretariatId: getValues('DepartmentInfo.secretariatId')!,
                                    value: selectedDepartment?.id!,
                                    label: getValues('DepartmentInfo.faTitle'),
                                }
                                all.splice(indexOption, 1);
                                all.push(newOption)
                                setRelatedDepartment([...all])
                            } else {
                                Swal.fire({
                                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                                    allowOutsideClick: false,
                                    title: "ویرایش واحد",
                                    text: response.data.message,
                                    icon: response.data.status ? "warning" : 'error',
                                    confirmButtonColor: "#22c55e",
                                    confirmButtonText: "OK"
                                })
                            }
                            handleAddDepartment()
                        }
                    }
                }
            })
        }
        handleAddDepartment()
    }


    const AddEmailItem = () => {
        EmailItems.append({
            address: '',
            isDefault: false,
            artemisAspNetDepartmentId: 0,
            id: 0
        })
    }

    const DeleteEmail = (index: number) => {
        EmailItems.remove(index)
    }

    const AddPhoneItem = () => {
        !errors.phoneNumbers ? PhoneItems.append({
            number: '',
            isDefault: false,
            isFax: false,
            isMobile: false,
            artemisAspNetDepartmentId: 0,
            id: 0

        })
            :
            Swal.fire({
                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "افزودن شماره تماس",
                text: 'از درستی و تکمیل مورد قبلی اطمینان حاصل فرمایید و مجددا تلاش کنید',
                icon: "warning",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK"
            })
    }

    const DeletePhone = (index: number) => {
        PhoneItems.remove(index)
    }

    const AddDepartment = () => {
        if (getValues('DepartmentInfo.artemisAspNetOrganizationId') == 0 || getValues('DepartmentInfo.artemisAspNetOrganizationId') == null) {
            Swal.fire({
                background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: 'افزودن سمت',
                text: 'لطفا سازمان مربوطه را انتخاب نمایید',
                icon: "warning",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK",
            });
        } else {
            handleAddDepartment(),
                setValue('DepartmentInfo.parentDepartementId', 0),
                update == true && GetAllDepartmentList((getValues('DepartmentInfo.artemisAspNetOrganizationId')!))
        }
    }



    return (
        <>
            {loadings.loadingResponse == true && <Loading />}
            <CardBody className={`w-[98%] my-3 mx-auto  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'carDLight'} `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <div className="w-full">
                    <div className="container-fluid mx-auto">
                        <div className="flex flex-col md:flex-row justify-end md:justify-between items-center">
                            <div className='w-[98%] md:w-[35%] flex justify-start my-2 md:my-0  '>
                                <Tooltip content="افزودن واحد" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                                    <IconButton onClick={() => AddDepartment()} style={{ background: color?.color }} size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><i className=" bi bi-plus-lg"></i>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className='w-[98%] md:w-[50%] flex justify-end my-2 md:my-0 '>
                                <AsyncSelect isRtl className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] disabled:opacity-[5px]`} cacheOptions defaultOptions placeholder="سازمان مرجع"
                                    loadOptions={loadSearchedCustomerOptions}
                                    onChange={(option: SingleValue<CustomerOptionProps>, actionMeta: ActionMeta<CustomerOptionProps>) => {
                                        setValue('DepartmentInfo.artemisAspNetOrganizationId', option!.id),
                                            setValue('DepartmentInfo.parentDepartementId', 0),
                                            GetDepartmentsHierarchyByOrgId(option!.id),
                                            setRelatedDepartment([{
                                                id: 0,
                                                title: '',
                                                faName: 'ندارد',
                                                faTitle: 'ندارد',
                                                isCentral: false,
                                                isConfirmed: false,
                                                isSecretariat: false,
                                                name: '',
                                                parentDepartementId: 0,
                                                secretariatId: null,
                                                label: 'ندارد',
                                                value: 0
                                            }])
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
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardBody dir='rtl' className='w-[98%]  mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                        labelText={option.faTitle}
                                        labelIcon={FolderIcon}
                                        labelInfo={
                                            <>
                                                <Popover placement="right" key={"menu_" + option.id} >
                                                    <PopoverHandler>
                                                        <MenuIcon
                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                        />
                                                    </PopoverHandler>
                                                    <PopoverContent aria-hidden="false" className={!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                                        <ul>
                                                            <li onClick={() => { setActiveItem('delete'), DeleteDepartment(option) }} dir='rtl' style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف واحد</span></li>
                                                            <li onClick={() => { GetAllDepartmentList((getValues('DepartmentInfo.artemisAspNetOrganizationId')!)), setSelectedDepartment(option), setValue('DepartmentInfo.parentDepartementId', option.id), setActiveItem('add'), handleAddDepartment() }} dir='rtl' style={{ background: `${activeItem == "add" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}><AddIcon /> <span className='mx-2'>افزودن واحد</span></li>
                                                            <li onClick={() => { UpdateDepartment(option) }} dir='rtl' style={{ background: `${activeItem == "update" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <EditIcon /> <span className='mx-2'>ویرایش واحد</span></li>
                                                        </ul>
                                                    </PopoverContent>
                                                </Popover>
                                            </>
                                        }>
                                        {option.subDepartements && CreateFolderDepartmentChild(option.subDepartements)}
                                    </StyledTreeItem>
                                )
                            }
                            else {
                                return (
                                    <StyledTreeItem
                                        key={index}
                                        nodeId={option.id.toString()}
                                        labelText={option.faTitle}
                                        labelIcon={FolderIcon}
                                        labelInfo={
                                            <>
                                                <Popover placement="right" key={"menu_" + option.id} >
                                                    <PopoverHandler>
                                                        <MenuIcon
                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                        />
                                                    </PopoverHandler>
                                                    <PopoverContent aria-hidden="false" className={!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                                        <ul>
                                                            <li onClick={() => { setActiveItem('delete'), DeleteDepartment(option) }} dir='rtl' style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف واحد</span></li>
                                                            <li onClick={() => { GetAllDepartmentList((getValues('DepartmentInfo.artemisAspNetOrganizationId')!)), setSelectedDepartment(option), setValue('DepartmentInfo.parentDepartementId', option.id), setActiveItem('add'), handleAddDepartment() }} dir='rtl' style={{ background: `${activeItem == "add" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}><AddIcon /> <span className='mx-2'>افزودن واحد</span></li>
                                                            <li onClick={() => { UpdateDepartment(option) }} dir='rtl' style={{ background: `${activeItem == "update" ? color?.color : ""}`, color: `${activeItem == "delete" ? 'white' : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <EditIcon /> <span className='mx-2'>ویرایش واحد</span></li>
                                                        </ul>
                                                    </PopoverContent>
                                                </Popover>
                                            </>
                                        }
                                    />
                                )
                            }
                        })
                    }
                </TreeView >
            </CardBody>
            <Dialog dismiss={{
                escapeKey: true,
                referencePress: true,
                referencePressEvent: 'click',
                outsidePress: false,
                outsidePressEvent: 'click',
                ancestorScroll: false,
                bubbles: true
            }} size='xl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} absolute top-0 `} open={addDepartment} handler={handleAddDepartment}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} flex justify-between`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    {update == false ? 'افزودن واحد' : 'ویرایش واحد'}
                    <IconButton variant="text" color="blue-gray" onClick={() => {
                        handleAddDepartment(), setUpdate(false), setValue('DepartmentInfo', {
                            artemisAspNetOrganizationId: watch('DepartmentInfo.artemisAspNetOrganizationId'),
                            faTitle: '',
                            parentDepartementId: 0,
                            secretariatId: 0,
                            title: '',
                            faName: '',
                            isCentral: false,
                            isConfirmed: false,
                            isSecretariat: false,
                            name: ""
                        });
                        setValue('phoneNumbers', []);
                        setValue('emails', []);
                    } }  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                <DialogBody dir='rtl' className=" h-full m-3 relative overflow-y-scroll "  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} h-full relative rounded-lg overflow-auto`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <section className='w-full h-full flex flex-col md:flex-row md:justify-between '>
                            <Tabs dir="ltr" value="OrgInfo" className="w-full mb-3">
                                <form onSubmit={handleSubmit(OnSubmit)} className='h-full w-full'>
                                    <div dir='rtl' className="w-full">
                                        <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Add Organization' placement="top">
                                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                <SaveIcon className='p-1' />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                    <TabsHeader
                                        className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} max-w-[120px]`}
                                        indicatorProps={{
                                            style: {
                                                background: color?.color,
                                                color: "white",
                                            },
                                            className: `shadow `,
                                        }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        <Tab onClick={() => {
                                            // setActiveTab('OrgInfo')
                                        } } value="OrgInfo"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                            <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='مشخصات فردی' placement="top">
                                                <ApartmentIcon fontSize='small' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activeTab == "OrgInfo" ? "white" : ""}` }} />
                                            </Tooltip>
                                        </Tab>
                                        <Tab onClick={() => {
                                            setActiveTab('phoneInfo');
                                        } } value="phoneInfo"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                            <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='شماره تماس' placement="top">
                                                < LocalPhoneIcon fontSize='small' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activeTab == "phoneInfo" ? "white" : ""}` }} />
                                            </Tooltip>
                                        </Tab>
                                        <Tab onClick={() => {
                                            setActiveTab('OrgInfoEmail');
                                        } } value="OrgInfoEmail"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                            <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='ایمیل ها' placement="top">
                                                <EmailIcon fontSize='small' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`} style={{ color: `${activeTab == "OrgInfoEmail" ? "white" : ""}` }} />
                                            </Tooltip>
                                        </Tab>
                                    </TabsHeader>
                                    <TabsBody
                                        animate={{
                                            initial: { y: 10 },
                                            mount: { y: 0 },
                                            unmount: { y: 250 },
                                        }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        <TabPanel value='phoneInfo' className="p-0 w-full">
                                            <section dir='ltr' className='w-[98%] h-[60vh] relative mx-auto overflow-auto p-0 my-3' >
                                                <table dir="rtl" className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[58vh] relative text-center`}>
                                                    <thead className='sticky z-[30] top-0 left-0 w-full'>
                                                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>

                                                            <th style={{ borderBottomColor: color?.color }}
                                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                            >
                                                                <Typography
                                                                    color="blue-gray"
                                                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                >
                                                                    شماره
                                                                </Typography>
                                                            </th>
                                                            <th style={{ borderBottomColor: color?.color }}
                                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                            >
                                                                <Typography
                                                                    color="blue-gray"
                                                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                >
                                                                    isDefault
                                                                </Typography>
                                                            </th>
                                                            <th style={{ borderBottomColor: color?.color }}
                                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                            >
                                                                <Typography
                                                                    color="blue-gray"
                                                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                >
                                                                    isMobile
                                                                </Typography>
                                                            </th>
                                                            <th style={{ borderBottomColor: color?.color }}
                                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                            >
                                                                <Typography
                                                                    color="blue-gray"
                                                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                >
                                                                    isFax
                                                                </Typography>
                                                            </th>

                                                            <th style={{ borderBottomColor: color?.color }}
                                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                            >
                                                                <Typography
                                                                    color="blue-gray"
                                                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                >
                                                                    عملیات
                                                                </Typography>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>

                                                        {
                                                            PhoneItems.fields.length > 0 && PhoneItems.fields.map((item: PhoneType, index: number) => {
                                                                return (
                                                                    <tr key={'phone' + index} style={{ height: '60px' }} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'braedDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} py-5 border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                                                        <td style={{ minWidth: '120px', width: '25%' }} className='p-1 relative'>
                                                                            <input
                                                                                autoComplete='off'
                                                                                dir='ltr'
                                                                                {...register(`phoneNumbers.${index}.number`)}
                                                                                className={errors?.phoneNumbers?.[index] && errors?.phoneNumbers?.[index]!.number ? `${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400` : `${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md  rinng-0 outline-none shadow-none bg-inherit focused`}  />
                                                                            <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.phoneNumbers?.[index] && errors?.phoneNumbers?.[index]!.number?.message}</label>
                                                                        </td>


                                                                        <td style={{ width: '10%' }} className=' relative'>
                                                                            <Checkbox
                                                                                {...register(`phoneNumbers.${index}.isDefault`)}
                                                                                sx={{
                                                                                    color: color?.color,
                                                                                    '&.Mui-checked': {
                                                                                        color: color?.color,
                                                                                    },
                                                                                }}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                                onChange={(event) => { setValue(`phoneNumbers.${index}.isDefault`, event.target.checked), trigger() }}
                                                                            />

                                                                        </td>
                                                                        <td style={{ width: '10%' }} className=' relative'>
                                                                            <Checkbox
                                                                                {...register(`phoneNumbers.${index}.isMobile`)}
                                                                                sx={{
                                                                                    color: color?.color,
                                                                                    '&.Mui-checked': {
                                                                                        color: color?.color,
                                                                                    },
                                                                                }}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                                onChange={(event) => { setValue(`phoneNumbers.${index}.isMobile`, event.target.checked), trigger() }}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: '10%' }} className=' relative'>
                                                                            <Checkbox
                                                                                {...register(`phoneNumbers.${index}.isFax`)}
                                                                                defaultChecked={item.isFax ? true : false}
                                                                                sx={{
                                                                                    color: color?.color,
                                                                                    '&.Mui-checked': {
                                                                                        color: color?.color,
                                                                                    },
                                                                                }}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                                onChange={(event) => { setValue(`phoneNumbers.${index}.isFax`, event.target.checked), trigger() }}
                                                                            />

                                                                        </td>
                                                                        <td style={{ width: "3%" }} className='px-1'>
                                                                            <div className='container-fluid mx-auto px-0.5'>
                                                                                <div className="flex flex-row justify-evenly">
                                                                                    <Button
                                                                                        onClick={() => DeletePhone(index)}
                                                                                        size="sm"
                                                                                        className="p-1 mx-1"
                                                                                        style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                                    >
                                                                                        <DeleteIcon
                                                                                            fontSize='small'
                                                                                            sx={{ color: 'white' }}
                                                                                            className='p-1'
                                                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                                        />
                                                                                    </Button>
                                                                                </div></div></td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                                <section dir='ltr'>
                                                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='افزودن شماره جدید' placement="right">
                                                        <Button
                                                            onClick={() => AddPhoneItem()}
                                                            style={{ background: color?.color }}
                                                            className='mx-1 my-3 p-1 w-[30px]' size="lg"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                            <AddIcon
                                                                sx={{ color: 'white' }}
                                                                fontSize="small"
                                                                className='p-1'
                                                            />
                                                        </Button>
                                                    </Tooltip>
                                                </section>
                                            </section>
                                        </TabPanel>
                                        <TabPanel value='OrgInfo' className="p-0 w-full">
                                            <ThemeProvider theme={customTheme(outerTheme)}>
                                                <section className='h-[60vh] overflow-y-auto w-full'
                                                >
                                                    <section dir='rtl' className='w-full max-h-[58vh] gap-x-4 p-3 grid md:grid-cols-2'>
                                                        <section className='flex flex-col gap-y-2 w-[100%] h-full'>
                                                            <section className='my-1 relative w-full'>
                                                                <TextField
                                                                    autoComplete='off'
                                                                    sx={{ fontFamily: 'FaLight' }}
                                                                    {...register(`DepartmentInfo.faName`)}
                                                                    tabIndex={1}
                                                                    error={errors?.DepartmentInfo && errors?.DepartmentInfo?.faName && true}
                                                                    className='w-full lg:my-0 font-[FaLight]'
                                                                    dir='rtl'
                                                                    size='small'
                                                                    label='نام'
                                                                    InputProps={{
                                                                        style: { color: errors?.DepartmentInfo?.faName ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                                                    }}
                                                                />
                                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.DepartmentInfo?.faName && errors?.DepartmentInfo?.faName?.message}</label>
                                                            </section>
                                                            <section className='my-1 relative w-full'>
                                                                <TextField
                                                                    autoComplete='off'
                                                                    sx={{ fontFamily: 'FaLight' }}
                                                                    {...register(`DepartmentInfo.faTitle`)}
                                                                    tabIndex={3}
                                                                    error={errors?.DepartmentInfo && errors?.DepartmentInfo?.faTitle && true}
                                                                    className='w-full lg:my-0 font-[FaLight]'
                                                                    dir='rtl'
                                                                    size='small'
                                                                    label='عنوان'
                                                                    InputProps={{
                                                                        style: { color: errors?.DepartmentInfo?.faTitle ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                                                    }}
                                                                />
                                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.DepartmentInfo?.faTitle && errors?.DepartmentInfo?.faTitle?.message}</label>
                                                            </section>
                                                            <section className='grid grid-cols-2 border-select-group py-0 my-1.5 w-full'>
                                                                <FormControlLabel
                                                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                    control={<Checkbox
                                                                        defaultChecked={getValues('DepartmentInfo.isSecretariat') == true ? true : false}
                                                                        sx={{
                                                                            color: color?.color,
                                                                            '&.Mui-checked': {
                                                                                color: color?.color,
                                                                            },
                                                                        }} {...register('DepartmentInfo.isSecretariat')}
                                                                        onChange={(event) => { setValue('DepartmentInfo.isSecretariat', event.target.checked), trigger() }} />} label="دبیرخانه" />
                                                            </section>
                                                            <section className='grid grid-cols-2 border-select-group py-0 my-1.5 w-full'>
                                                                <FormControlLabel
                                                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                    control={<Checkbox
                                                                        defaultChecked={getValues('DepartmentInfo.isCentral') == true ? true : false}
                                                                        sx={{
                                                                            color: color?.color,
                                                                            '&.Mui-checked': {
                                                                                color: color?.color,
                                                                            },
                                                                        }} {...register('DepartmentInfo.isCentral')}
                                                                        onChange={(event) => { setValue('DepartmentInfo.isCentral', event.target.checked), trigger() }} />} label="مرکزی" />
                                                            </section>
                                                            <section className='my-2 relative w-full border-select-group'>
                                                                <FormControlLabel
                                                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                    control={<Checkbox
                                                                        defaultChecked={getValues('DepartmentInfo.isConfirmed') == true ? true : false}
                                                                        sx={{
                                                                            color: color?.color,
                                                                            '&.Mui-checked': {
                                                                                color: color?.color,
                                                                            },
                                                                        }} {...register('DepartmentInfo.isConfirmed')}
                                                                        onChange={(event) => { setValue('DepartmentInfo.isConfirmed', event.target.checked), trigger() }} />} label="تائید شده" />

                                                            </section>
                                                        </section>
                                                        <section className='flex flex-col h-full gap-y-2 w-[100%]'>
                                                            <section className='relative my-1 w-full'>
                                                                <TextField
                                                                    autoComplete='off'
                                                                    tabIndex={9}
                                                                    {...register(`DepartmentInfo.name`)}
                                                                    error={errors?.DepartmentInfo && errors?.DepartmentInfo?.name && true}
                                                                    className='w-full lg:my-0 font-[FaLight]'
                                                                    size='small'
                                                                    dir='ltr'
                                                                    sx={{ fontFamily: 'FaLight' }}
                                                                    label="نام انگلیسی"
                                                                    InputProps={{
                                                                        style: { color: errors?.DepartmentInfo?.name ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                                                    }}
                                                                />
                                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.DepartmentInfo?.name && errors?.DepartmentInfo?.name?.message}</label>
                                                            </section>

                                                            <section className='my-1 relative w-full'>
                                                                <TextField
                                                                    autoComplete='off'
                                                                    dir='ltr'
                                                                    sx={{ fontFamily: 'FaLight' }}
                                                                    {...register(`DepartmentInfo.title`)}
                                                                    tabIndex={11}
                                                                    error={errors?.DepartmentInfo && errors?.DepartmentInfo?.title && true}
                                                                    className='w-full lg:my-0 font-[FaLight]'
                                                                    size='small'
                                                                    label='title'
                                                                    InputProps={{
                                                                        style: { color: errors?.DepartmentInfo?.title ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                                                                    }}
                                                                />
                                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.DepartmentInfo?.title && errors?.DepartmentInfo?.title?.message}</label>
                                                            </section>
                                                            <section className='relative my-1.5 w-full flex flex-col md:flex-row md:items-center md:justify-between '>
                                                                <label className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm whitespace-nowrap`}>دبیرخانه</label>
                                                                <Select isRtl
                                                                    maxMenuHeight={300}
                                                                    // isDisabled={update == false ? secretariates.length > 0 ? false : true : false}
                                                                    placeholder="دبیرخانه مربوطه"
                                                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full md:w-10/12 `}
                                                                    options={secretariates}
                                                                    {...register('DepartmentInfo.secretariatId')}
                                                                    defaultValue={secretariates.find((item: GetSecreteriateList) => item.id == watch('DepartmentInfo.secretariatId')) != null
                                                                        ? secretariates.find((item: GetSecreteriateList) => item.id == watch('DepartmentInfo.secretariatId')) :
                                                                        secretariates.find((item) => item.label == 'ندارد')}
                                                                    onChange={(option: SingleValue<GetSecreteriateList>, actionMeta: ActionMeta<GetSecreteriateList>) => {
                                                                        setValue('DepartmentInfo.secretariatId', option!.id)
                                                                    }}
                                                                    styles={{
                                                                        control: (provided) => ({
                                                                            ...provided,
                                                                            backgroundColor: 'transparent',
                                                                            borderColor: '#607d8b',
                                                                            boxShadow: '#607d8b',
                                                                            '&:hover': {
                                                                                borderColor: errors?.DepartmentInfo?.secretariatId ? '#d32f3c' : '#607d8b',
                                                                            },
                                                                        })
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
                                                                            neutral20: errors?.DepartmentInfo?.secretariatId ? '#d32f3c' : '#607d8b',
                                                                            neutral30: errors?.DepartmentInfo?.secretariatId ? '#d32f3c' : '#607d8b',
                                                                            neutral50: errors?.DepartmentInfo?.secretariatId ? '#d32f3c' : '#607d8b',

                                                                        },
                                                                    })}
                                                                />
                                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.DepartmentInfo?.secretariatId && errors?.DepartmentInfo?.secretariatId?.message}</label>
                                                            </section>
                                                            <section className='relative my-1.5 w-full flex flex-col md:flex-row md:items-center md:justify-between '>
                                                                <label className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm whitespace-nowrap`}>واحد مرجع</label>
                                                                <Select<DepartmentListByOrgId, false, any>
                                                                    isRtl
                                                                    isDisabled={update == false ? true : false}
                                                                    defaultValue={getValues('DepartmentInfo.parentDepartementId') != null ? relatedDepartment.find((item: DepartmentListByOrgId) => item.id == getValues('DepartmentInfo.parentDepartementId')) : relatedDepartment.find((item: DepartmentListByOrgId) => item.id == 0)}
                                                                    menuPosition='absolute'
                                                                    maxMenuHeight={400}
                                                                    options={relatedDepartment}
                                                                    className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} w-full md:w-10/12 `}
                                                                    {...register('DepartmentInfo.parentDepartementId')}
                                                                    onChange={(option: SingleValue<DepartmentListByOrgId>, actionMeta: ActionMeta<DepartmentListByOrgId>) => {
                                                                        setValue('DepartmentInfo.parentDepartementId', option!.id),
                                                                            trigger()
                                                                    }}
                                                                    value={relatedDepartment.find((item) => item.id == getValues('DepartmentInfo.parentDepartementId'))}
                                                                    placeholder="واحد مرجع"
                                                                    styles={{
                                                                        control: (provided) => ({
                                                                            ...provided,
                                                                            backgroundColor: 'transparent',
                                                                            borderColor: '#607d8b',
                                                                            boxShadow: '#607d8b',
                                                                            '&:hover': {
                                                                                borderColor: errors?.DepartmentInfo?.parentDepartementId ? '#d32f3c' : '#607d8b',
                                                                            },
                                                                        })
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
                                                                            neutral20: errors?.DepartmentInfo?.parentDepartementId ? '#d32f3c' : '#607d8b',
                                                                            neutral30: errors?.DepartmentInfo?.parentDepartementId ? '#d32f3c' : '#607d8b',
                                                                            neutral50: errors?.DepartmentInfo?.parentDepartementId ? '#d32f3c' : '#607d8b',
                                                                        },
                                                                    })}
                                                                />
                                                                <label className='absolute bottom-[-15px] left-3 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.DepartmentInfo?.parentDepartementId && errors?.DepartmentInfo?.parentDepartementId?.message}</label>
                                                            </section>
                                                        </section>
                                                    </section>
                                                </section>
                                            </ThemeProvider >
                                        </TabPanel>
                                        <TabPanel value='OrgInfoEmail' className="p-0 w-full">
                                            <section dir='ltr' className='w-[98%] h-[60vh] relative mx-auto overflow-auto p-0 my-3' >
                                                <table dir="rtl" className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full max-h-[58vh] relative text-center `}>
                                                    <thead className='sticky z-[30] top-0 left-0 w-full'>
                                                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>

                                                            <th style={{ borderBottomColor: color?.color }}
                                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                            >
                                                                <Typography
                                                                    color="blue-gray"
                                                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                >
                                                                    ایمیل
                                                                </Typography>
                                                            </th>
                                                            <th style={{ borderBottomColor: color?.color }}
                                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                            >
                                                                <Typography
                                                                    color="blue-gray"
                                                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                >
                                                                    isDefault
                                                                </Typography>
                                                            </th>
                                                            <th style={{ borderBottomColor: color?.color }}
                                                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                                                            >
                                                                <Typography
                                                                    color="blue-gray"
                                                                    className={`p-1.5 text-sm font-[FaBold] leading-none ${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                                                                >
                                                                    عملیات
                                                                </Typography>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>

                                                        {
                                                            EmailItems.fields.length > 0 && EmailItems.fields.map((item: EmailModel, index: number) => {
                                                                return (
                                                                    <tr key={'email' + index} style={{ height: '60px' }} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} py-5 border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                                                        <td style={{ minWidth: '120px' }} className='p-1 relative'>
                                                                            <input
                                                                                autoComplete='off'
                                                                                dir='ltr'
                                                                                {...register(`emails.${index}.address`)}
                                                                                className={errors?.emails?.[index] && errors?.emails?.[index]!.address ? `${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400` : `${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused`} />
                                                                            <label className='absolute top-[100%] left-3 text-[10px] font-[FaBold] text-start text-red-400' >{errors?.emails?.[index] && errors?.emails?.[index]!.address?.message}</label>
                                                                        </td>
                                                                        <td style={{ width: '5%' }} className=' relative'>
                                                                            <Checkbox
                                                                                {...register(`emails.${index}.isDefault`)}
                                                                                onChange={(event) => { setValue(`emails.${index}.isDefault`, event.target.checked), trigger() }}
                                                                                sx={{
                                                                                    color: color?.color,
                                                                                    '&.Mui-checked': {
                                                                                        color: color?.color,
                                                                                    },
                                                                                }}

                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                            />

                                                                        </td>
                                                                        <td style={{ width: "3%" }} className='px-1'>
                                                                            <div className='container-fluid mx-auto px-0.5'>
                                                                                <div className="flex flex-row justify-evenly">
                                                                                    <Button
                                                                                        onClick={() => DeleteEmail(index)}
                                                                                        size="sm"
                                                                                        className="p-1 mx-1"
                                                                                        style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                                    >
                                                                                        <DeleteIcon
                                                                                            fontSize='small'
                                                                                            sx={{ color: 'white' }}
                                                                                            className='p-1'
                                                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                                        />
                                                                                    </Button>
                                                                                </div></div></td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                                <section dir='ltr'>
                                                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='افزودن شماره جدید' placement="right">
                                                        <Button
                                                            onClick={() => AddEmailItem()}
                                                            style={{ background: color?.color }}
                                                            className='mx-1 my-3 p-1 w-[30px]' size="lg"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                            <AddIcon
                                                                sx={{ color: 'white' }}
                                                                fontSize="small"
                                                                className='p-1'
                                                            />
                                                        </Button>
                                                    </Tooltip>
                                                </section>
                                            </section>
                                        </TabPanel>
                                    </TabsBody>
                                </form>
                            </Tabs>
                        </section>
                    </CardBody>
                </DialogBody>
            </Dialog >
        </>
    )
}

export default DepartmentComponent