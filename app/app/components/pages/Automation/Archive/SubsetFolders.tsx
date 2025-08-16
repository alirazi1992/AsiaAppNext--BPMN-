

"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import themeStore from '@/app/zustandData/theme.zustand';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EditIcon from '@mui/icons-material/Edit';
import colorStore from '@/app/zustandData/color.zustand';
import Box from '@mui/material/Box';
import useStore from "@/app/hooks/useStore";
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MenuIcon from '@mui/icons-material/Menu';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, TreeItemProps, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import useAxios from '@/app/hooks/useAxios';
import activeStore from '@/app/zustandData/activate.zustand';
import Select2, { ActionMeta, SingleValue } from 'react-select';
import {
  Button, CardBody, Dialog,
  DialogBody, DialogFooter, DialogHeader,
  IconButton, Input, Popover,
  PopoverContent, PopoverHandler, Tooltip
} from '@material-tailwind/react';
import axios, { AxiosResponse } from 'axios';
import {
  ArchiveAutomationModel, Response,
  ArchiveDocsModels, UpdateArchiveResponseModel,
  SelectOptionModel, GroupedOption,
  LoadingModel
} from '@/app/models/Automation/ArchiveAutomationModel';
import Swal from 'sweetalert2';
import ButtonComponent from '@/app/components/shared/ButtonComponent';
import ButtonComp from '@/app/components/shared/ButtonComp';
import { UnArchiveDocList, UnArchiveSraechDocs } from '@/app/models/Archive/AddDocumentUnArchiveTable';
import { Pagination, Stack } from '@mui/material';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import ResLoading from '@/app/components/shared/loadingResponse';
import IframeSkeleton from '@/app/components/shared/IframeSkeleton';
import InputSkeleton from '@/app/components/shared/InputSkeleton';
// icons***
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import TaskIcon from '@mui/icons-material/Task';
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

const SubsetArchive = () => {
  const { AxiosRequest } = useAxios()
  const activeState = activeStore();
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state)
  let [archiveAutomationState, setArchiveAutomationState] = useState<ArchiveAutomationModel[]>([])
  const [activeItem, setActiveItem] = useState<string>("");
  const [open, setOpen] = React.useState(false);
  const handleAddFolderArchive = () => setOpen(!open);
  const [openDocument, setOpenDocument] = React.useState(false);
  const addDocument = () => setOpenDocument(!openDocument);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchDocTable, setSearchDocTable] = useState<UnArchiveDocList[]>();
  const [selectedArchive, setSelectedArchive] = useState<number>(0);
  const [selectedFolder, setSelectedFolder] = useState<ArchiveAutomationModel>({ archiveDocs: [], archiveName: "", id: 0, parentId: null, subArchives: [] });
  const [folderName, setFolderName] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<ArchiveDocsModels>()
  const [addParent, setAddParent] = useState(false)
  const handleAddparentFolderArchive = () => setAddParent(!addParent);
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const handleEditFolder = () => setEditOpen(!editOpen)
  const [count, setCount] = useState<number>(0)
  const [searchText, setSearchText] = useState<string>("")

  let loading = {
    loadingResponse: false,
    loadingSearch: false
  }
  const [loadings, setLoadings] = useState<LoadingModel>(loading)
  function CreateFolderChild(subArchives: ArchiveAutomationModel[]) {
    return (
      subArchives.map((item: ArchiveAutomationModel, index: number) => {
        return (
          <StyledTreeItem
            id={"folder_" + item.id}
            key={"folder_" + item.id}
            nodeId={item.id.toString()}
            labelText={item.archiveName}
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
                      <li dir='rtl' onClick={() => DeleteFolder(item)} onMouseEnter={(e: any) => setActiveItem("delete")} style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف</span></li>
                      <li dir='rtl' onClick={() => AddFolderArchive(item)} onMouseEnter={(e: any) => setActiveItem("folder")} style={{ background: `${activeItem == "folder" ? color?.color : ""}`, color: `${activeItem == "folder" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><CreateNewFolderIcon /> <span className='mx-2'>افزودن پوشه</span></li>
                      <li dir='rtl' onClick={() => AddDocumentArchive(item)} onMouseEnter={(e: any) => setActiveItem("file")} style={{ background: `${activeItem == "file" ? color?.color : ""}`, color: `${activeItem == "file" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <NoteAddIcon /> <span className='mx-2'>افزودن مدرک</span></li>
                      <li dir='rtl' onClick={() => { handleEditFolder(), setSelectedFolder(item) }} onMouseEnter={(e: any) => setActiveItem("edit")} style={{ background: `${activeItem == "edit" ? color?.color : ""}`, color: `${activeItem == "edit" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <EditIcon /> <span className='mx-2'>ویرایش پوشه</span></li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </>
            }
          >
            {item.subArchives != null ? CreateFolderChild(item.subArchives) : null}
            {item.archiveDocs != null ? CreateFileChild(item.archiveDocs, item.id) : null}
          </StyledTreeItem>
        );
      }
      )
    );
  }

  const FindFolder = (id: number, parentId: number, array: ArchiveAutomationModel[]) => {
    let isExist = array.find(p => p.id == parentId);
    if (parentId == null) {
      let result = array.filter((item) => item.id != id)
      return setArchiveAutomationState([...result])
    }
    else if (isExist != null) {
      isExist.subArchives = [...isExist.subArchives!.filter(p => p.id != id)]
      setArchiveAutomationState([...archiveAutomationState])
      return
    } else {
      array.map((option: ArchiveAutomationModel, index: number) => {
        if (option.subArchives != null) {
          FindFolder(id, parentId, option.subArchives);
        }
      })
    }
  }

  const DeleteFolder = async (removedFolder: ArchiveAutomationModel) => {
    setSelectedFolder(removedFolder)
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removearchive`;
    let method = "delete";
    let data = { "id": removedFolder.id, "name": removedFolder.archiveName };
    Swal.fire({
      background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Delete Archive!",
      text: "Are you sure you want to Delete this Archive?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }))
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }))
          if (response.data.data != 0 && response.data.status) {
            FindFolder(removedFolder.id, removedFolder.parentId!, archiveAutomationState)
          } else {
            Swal.fire({
              background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Delete Archive!",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
              text: response.data.message,
              icon: (response.data.status && response.data.data == null) ? "warning" : "error"
            })
          }
        }
      }
    });
  }

  function CreateFileChild(archiveDocs: ArchiveDocsModels[], parentId: number) {
    return (
      archiveDocs.map((option: ArchiveDocsModels, index: number) => {
        return (
          <StyledTreeItem
            className=''
            key={"document_" + option.id}
            id={"document_" + option.id}
            nodeId={option.id.toString()}
            labelText={option.docSubject + "-" + option.docIndicatorId}
            labelIcon={InsertDriveFileIcon}
            labelInfo={
              <>
                <Popover placement="right" key={"document_menu_" + option.id} >
                  <PopoverHandler>
                    <MenuIcon
                      onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                      onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                    />
                  </PopoverHandler>
                  <PopoverContent className={!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                    <ul>
                      <li dir='rtl' onClick={() => { DeleteDocument(option, parentId) }} onMouseEnter={(e: any) => setActiveItem("delete")} style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? "white" : ""}` }} className={`text-right p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف</span></li>
                      <li dir='rtl' onClick={() => { activeStore.setState((state) => ({ ...state, activeSubLink: "New Document" })), window.open(`/Home/NewDocument?docheapid=${option.docHeapId}&doctypeid=${option.docTypeId}`) }} onMouseEnter={(e: any) => setActiveItem("view")} style={{ background: `${activeItem == "view" ? color?.color : ""}`, color: `${activeItem == "view" ? "white" : ""}` }} className={`text-right p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><VisibilityIcon /><span className='mx-2'>مشاهده مدرک</span></li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </>
            }
          />
        );
      }
      )
    );
  }

  const FindDocument = (id: number, parentId: number, array: ArchiveAutomationModel[]) => {
    let isExist = array.find(p => p.id == parentId);
    if (isExist != null) {
      isExist.archiveDocs = [...isExist.archiveDocs!.filter(p => p.id != id)]
      setArchiveAutomationState([...archiveAutomationState])
      return
    } else {
      array.map((option: ArchiveAutomationModel, index: number) => {
        if (option.subArchives != null) {
          FindDocument(id, parentId, option.subArchives!);
        }
      })
    };
  };

  const DeleteDocument = async (removedDocument: ArchiveDocsModels, parentId: number) => {
    setSelectedDoc(removedDocument)
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removedoc`;
    let method = "delete";
    let data = {
      "id": removedDocument.id,
      "indicator": removedDocument.docIndicatorId
    }
    Swal.fire({
      background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Delete Document!",
      text: "Are you sure you want to Delete this Document?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }))
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }))
          if (response.data.data != 0 && response.data.status == true) {
            FindDocument(removedDocument.id, parentId, archiveAutomationState)
          } else {
            Swal.fire({
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
              background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Delete Document!",
              text: response.data.message,
              icon: (response.data.status) ? "warning" : "error"
            });
          }
        }
      }
    });
  }

  const [allArchive, setAllArchive] = useState<GroupedOption[]>([{
    label: 'مرجع',
    options: [{
      label: 'ندارد',
      value: 0
    }]
  }])
  const [folders, setFolders] = useState<SelectOptionModel[]>([])
  const FormAllArchive = useCallback((parentName: string = "پوشه های مرجع", archives: ArchiveAutomationModel[] = archiveAutomationState) => {
    if (archives.length > 0) {
      allArchive.push({
        label: parentName,
        options: archives!.map((i: ArchiveAutomationModel) => {
          if (folders.some(p => p.value == i.id)) {
            setFolders([...folders])
          } else {
            folders.push({
              label: i.archiveName,
              value: i.id
            })
          }
          return {
            label: i.archiveName,
            value: i.id,
          }
        })
      })
    }
    archives.map((i: ArchiveAutomationModel) => {
      if (i.subArchives != null && i.subArchives!.length > 0) {
        FormAllArchive(parentName == "پوشه های مرجع" ? i.archiveName : parentName + " --> " + i.archiveName, i.subArchives)
      }
    })
  }, [archiveAutomationState])

  useEffect(() => {
    FormAllArchive()
  }, [FormAllArchive])

  useEffect(() => {
    async function GetArchiveAutomation() {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/GetArchive`;
      let method = "get";
      let data = {};
      let response: AxiosResponse<Response<ArchiveAutomationModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
      if (response) {
        if (response.data.status && response.data.data.length > 0) {
          setArchiveAutomationState(response.data.data.map((folder) => {
            return {
              archiveDocs: folder.archiveDocs,
              archiveName: folder.archiveName,
              id: folder.id,
              parentId: folder.parentId ?? null,
              subArchives: folder.subArchives,
            }
          }))
        }
      }
    }
    GetArchiveAutomation()
  }, [])

  const AddDocumentArchive = async (folderArchive: ArchiveAutomationModel) => {
    addDocument()
    setSelectedFolder(folderArchive)
  }

  const ArchiveDocument = async (selectedDoc: UnArchiveDocList) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/adddocarchive`;
    let method = "put";
    let data = { "docHeapId": selectedDoc.docHeapId, "archiveId": selectedFolder?.id, "documentName": selectedDoc.subject }
    Swal.fire({
      background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Add Archive!",
      text: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }))
        let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }))
          if (response.data.data && response.data.status == true) {
            addDocument()
            selectedFolder!.archiveDocs.push({
              id: response.data.data.docArchiveId,
              docIndicatorId: selectedDoc.indicator,
              docHeapId: selectedDoc.docHeapId,
              docSubject: selectedDoc.subject,
              docTypeId: selectedDoc.docTypeId
            })
            setArchiveAutomationState([...archiveAutomationState])
          } else {
            Swal.fire({
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
              background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Add Archive!",
              text: response.data.message,
              icon: (response.data.status && response.data.data == 0) ? "warning" : "error"
            });
          }
        }
      }
    })
  }

  const AddFolderArchive = (folderArchive: ArchiveAutomationModel) => {
    setSelectedArchive(folderArchive.id ?? 0)
    setSelectedFolder(folderArchive)
    handleAddFolderArchive()
  }

  const AddFolder = async () => {
    setLoadings((state) => ({ ...state, loadingResponse: true }))
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/addarchive`;
    let method = "put";
    let data = { "name": folderName, "archiveId": selectedArchive };
    let response: AxiosResponse<Response<number>> = (folderName != "") ? await AxiosRequest({ url, method, data, credentials: true }) : null;
    if (response) {
      setLoadings((state) => ({ ...state, loadingResponse: false }))
      if (response.data.data != 0 && response.data.status == true) {
        if (selectedFolder!.subArchives != null) {
          selectedFolder?.subArchives?.push({
            id: response.data.data,
            archiveName: folderName,
            parentId: selectedArchive,
            subArchives: null,
            archiveDocs: []
          })
        } else {
          selectedFolder!.subArchives = [
            {
              id: response.data.data,
              archiveName: folderName,
              parentId: selectedArchive,
              subArchives: null,
              archiveDocs: []
            }
          ]
        }
        setFolders((state) => [{
          ...state,
          label: folderName,
          value: response.data.data
        }])
        setArchiveAutomationState([...archiveAutomationState])
        handleAddFolderArchive()
      } else {
        Swal.fire({
          background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
          color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
          allowOutsideClick: false,
          title: "Add Archive!",
          confirmButtonColor: "#22c55e",
          confirmButtonText: "OK!",
          text: response.data.message,
          icon: (response.data.status) ? "warning" : "error"
        });
      }
    }
  }


  const AddParentFolder = async () => {
    setLoadings((state) => ({ ...state, loadingResponse: true }))
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/addarchive`;
    let method = "put";
    let data = { "name": folderName, "archiveId": 0 };
    let response: AxiosResponse<Response<number>> = (folderName != "") ? await AxiosRequest({ url, method, data, credentials: true }) : null;
    if (response) {
      setLoadings((state) => ({ ...state, loadingResponse: false }))
      if (response.data.data != 0 && response.data.status == true) {
        if (typeof (archiveAutomationState) !== 'undefined' && archiveAutomationState != null) {
          archiveAutomationState.push(
            {
              id: response.data.data,
              archiveName: folderName,
              parentId: null,
              subArchives: null,
              archiveDocs: []
            }
          )
        } else {
          archiveAutomationState = [{
            id: response.data.data,
            archiveName: folderName,
            parentId: null,
            subArchives: null,
            archiveDocs: []
          }]
        }
        handleAddparentFolderArchive()
        setArchiveAutomationState([...archiveAutomationState])
      } else {
        Swal.fire({
          background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
          color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
          allowOutsideClick: false,
          title: "Add Archive!",
          confirmButtonColor: "#22c55e",
          confirmButtonText: "OK!",
          text: response.data.message,
          icon: (response.data.status) ? "warning" : "error"
        });
      }
    }
  }

  const SearchDocument = async (page: number) => {
    setLoadings((state) => ({ ...state, loadingSearch: true }))
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/SearchDocs?searchKey=${searchValue}&pageNo=${page}&count=10`;
    let method = "get";
    let data = {};
    if (searchValue != null) {
      let response: AxiosResponse<Response<UnArchiveSraechDocs>> = await AxiosRequest({ url, method, data, credentials: true });
      if (response) {
        setLoadings((state) => ({ ...state, loadingSearch: false }))
        if (response.data.status) {
          setSearchDocTable(response.data.data?.docList);
          let paginationCount = Math.ceil(Number(response.data.data?.totalCount) / Number(10));
          setCount(paginationCount)
          return
        }
        Swal.fire({
          background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
          color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
          allowOutsideClick: false,
          title: "جستجوی مدرک",
          confirmButtonColor: "#22c55e",
          confirmButtonText: "OK!",
          text: response.data.status ? "موردی یافت نشد" : response.data.message,
          icon: response.data.status ? "warning" : "error",
        });
      }
    }
  }

  const [idShow, setIdShow] = useState<any>(null)
  const [showData, setShowData] = useState<any>(null);
  let resultData: any[] = []

  const SearchsubArchives = (subArchive: ArchiveAutomationModel,) => {
    if (subArchive.archiveName.includes(searchText)) {
      return subArchive
    } else {
      if ((subArchive.subArchives != null && subArchive.subArchives.length > 0) || (subArchive.archiveDocs != null && subArchive.archiveDocs.length > 0)) {
        let archives: ArchiveAutomationModel = { ...subArchive, subArchives: null, archiveDocs: [] }
        subArchive.subArchives?.forEach((item) => {
          let result = SearchsubArchives(item)
          if (result != null) {
            archives.subArchives == null ? archives.subArchives = [result] : archives.subArchives.push(result)
          } else {
            return null
          }
        })
        subArchive.archiveDocs.forEach((document) => {
          if (document.docSubject.includes(searchText)) {
            archives.archiveDocs == null ? archives.archiveDocs = [document] : archives.archiveDocs.push(document)
          }
        })
        return ((archives.subArchives != null && archives.subArchives.length > 0) || (archives.archiveDocs != null && archives.archiveDocs.length > 0)) ? archives : null
      } else {
        return null
      }
    }
  }

  const SearchArchives = (array: ArchiveAutomationModel[] = archiveAutomationState) => {
    array.forEach((folder: ArchiveAutomationModel) => {
      if ((folder.subArchives == null || folder.subArchives?.length == 0 || !folder.subArchives) && (folder.archiveDocs == null || folder.archiveDocs?.length == 0 || !folder.archiveDocs)) {

        if (folder.archiveName.includes(searchText)) {
          resultData.push(folder)
        }
      } else {
        let newResult: ArchiveAutomationModel = { ...folder, subArchives: null, archiveDocs: [] }
        folder.subArchives != null && folder.subArchives!.forEach((archive) => {
          let searchResult = SearchsubArchives(archive);
          if (searchResult != null) {
            newResult.subArchives == null ? newResult.subArchives = [searchResult] : newResult.subArchives.push(searchResult)
          }
        })
        folder.archiveDocs!.forEach((document) => {
          if (document.docSubject.includes(searchText)) {
            newResult.archiveDocs == null ? newResult.archiveDocs = [document] : newResult.archiveDocs.push(document)
          }
        })
        if ((newResult.subArchives != null && newResult.subArchives.length > 0) || (newResult.archiveDocs != null && newResult.archiveDocs.length > 0)) {
          resultData.push(newResult)
          return
        }
        if (folder.archiveName.includes(searchText)) {
          resultData.push(folder)
        }

      }
    })
  };

  const EditedArchives = (newFolder: ArchiveAutomationModel, allArchives: ArchiveAutomationModel[] = archiveAutomationState) => {
    if (newFolder.parentId == null) {
      allArchives.push(newFolder)
      return;
    }
    let isExist = allArchives.find(p => p.id == newFolder.parentId);
    if (isExist && isExist != null) {
      if (isExist.subArchives?.length == 0) {
        isExist.subArchives = [{ ...newFolder }]
      } else {
        isExist.subArchives!.push(newFolder);
      }
      return;
    } else {
      allArchives.map((archive: ArchiveAutomationModel) => {
        if (archive.subArchives != null && archive.subArchives!.length > 0) {
          EditedArchives(newFolder, archive.subArchives)
        }
      })
    }
  }

  const UpdateArchiveState = (archives: ArchiveAutomationModel[]) => {
    let isExist = archives.find(p => p.id == selectedFolder!.parentId)
    let newFolder: ArchiveAutomationModel = {
      archiveDocs: selectedFolder.archiveDocs,
      archiveName: selectedFolder.archiveName,
      id: selectedFolder.id,
      parentId: selectedFolder.parentId == 0 ? null : selectedFolder.parentId,
      subArchives: selectedFolder.subArchives
    };
    if (isExist && isExist != null) {
      let changedItem = isExist.subArchives?.find((item) => item.id == selectedFolder?.id)!
      let index = isExist.subArchives?.indexOf(changedItem)!;
      if (isExist.id == newFolder.parentId) {
        isExist.subArchives?.splice(index, 1, newFolder);
        return;
      }
      else {
        isExist.subArchives!.splice(index, 1);
        EditedArchives(newFolder);
        return;
      }
    }
    else {
      if (selectedFolder!.parentId == null) {
        let index = archives.indexOf(archives.find(p => p.id == selectedFolder!.id)!)
        archives.splice(index, 1);
        EditedArchives(newFolder);
      } else {
        for (let archive of archives) {
          if (archive.subArchives != null && archive.subArchives!.length > 0) {
            UpdateArchiveState(archive.subArchives);
          }

        }
      }
    }
  }

  const EditFolderArchives = async () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/updatearchive`;
    let method = "patch";
    let data = {
      "id": selectedFolder?.id,
      "name": selectedFolder?.archiveName,
      "parentId": selectedFolder?.parentId == 0 ? null : selectedFolder?.parentId
    }
    Swal.fire({
      background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
      color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
      allowOutsideClick: false,
      title: "Update Archive",
      text: "Are you sure you want to update this Archive?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadings((state) => ({ ...state, loadingResponse: true }))
        let response: AxiosResponse<Response<UpdateArchiveResponseModel>> = await AxiosRequest({ url, method, data, credentials: true })
        if (response) {
          setLoadings((state) => ({ ...state, loadingResponse: false }))
          if (response.data.data && response.data.status) {
            UpdateArchiveState(archiveAutomationState)
            let findOption = allArchive.find(i => i.options.find(i => i.value == selectedFolder.id));
            let indexOption = allArchive.indexOf(findOption!)
            let all = allArchive
            let newOption = {
              label: selectedFolder.archiveName,
              options: selectedFolder.subArchives != undefined ? selectedFolder.subArchives?.map((item: ArchiveAutomationModel) => {
                return {
                  label: item.archiveName,
                  value: item.id
                }
              }) : []
            };
            all.splice(indexOption, 1);
            all.push(newOption)
            setAllArchive([...allArchive, ...all])
          } else {
            Swal.fire({
              background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
              color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
              allowOutsideClick: false,
              title: "Edit Archive!",
              confirmButtonColor: "#22c55e",
              confirmButtonText: "OK!",
              text: response.data.message,
              icon: (response.data.status && response.data.data == null) ? "warning" : "error"
            })
          }
        }
      }
    })
  }

  return (
    <>
      {loadings.loadingResponse == true && <ResLoading />}
      <CardBody className={`w-[98%] my-3 mx-auto  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'carDLight'} rounded-lg shadow-md `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <div className="w-full">
          <div className="container-fluid mx-auto">
            <div className="flex flex-col md:flex-row justify-end md:justify-between items-center">
              <div className='w-full flex justify-start my-2 md:my-0'>
                <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content="افزودن پوشه" placement="top">
                  <IconButton onClick={handleAddparentFolderArchive} style={{ background: color?.color }} size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}><i className=" bi bi-plus-lg"></i>
                  </IconButton>
                </Tooltip>
              </div>
              <div className="relative w-[90%] flex">
                <Input
                  dir='ltr'
                  crossOrigin=""
                  style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
                  type="text"
                  label="search"
                  className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} pr-10 p-2`}
                  containerProps={{
                    className: !themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'
                  }}
                  onBlur={(e: any) => { setSearchText(e.target.value), e.target.value.toString().trim() == "" && setShowData(null); }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                <Button
                  size="sm"
                  className="!absolute right-1 top-1 rounded p-1"
                  style={{ background: color?.color }}
                  onClick={() => { SearchArchives(), setShowData(resultData); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
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
      </CardBody>
      <CardBody dir='rtl' className='w-[98%]  mx-auto relative rounded-lg overflow-auto p-0' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <TreeView
          aria-label="AsiaApp"
          defaultExpanded={idShow}
          defaultCollapseIcon={<ArrowDropDownIcon style={{ color: `${color?.color}` }} />}
          defaultExpandIcon={<ArrowRightIcon style={{ color: `${color?.color}` }} />}
          defaultEndIcon={<div style={{ width: 24 }} />}
          sx={{ height: "100%", flexGrow: 1, maxWidth: "100%", overflowY: 'auto', padding: "10px" }}
        >
          {
            (showData == null) ?
              archiveAutomationState?.filter((val: ArchiveAutomationModel) => val.parentId == null).map((option: ArchiveAutomationModel, index: number) => {
                if (option.subArchives != undefined || option.archiveDocs?.length > 0) {
                  return (
                    <StyledTreeItem

                      key={index}
                      nodeId={option.id.toString()}
                      labelText={option.archiveName}
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
                              <li dir='rtl' onClick={() => DeleteFolder(option)} onMouseEnter={(e: any) => setActiveItem("delete")} style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف</span></li>
                              <li dir='rtl' onClick={() => AddFolderArchive(option)} onMouseEnter={(e: any) => setActiveItem("folder")} style={{ background: `${activeItem == "folder" ? color?.color : ""}`, color: `${activeItem == "folder" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><CreateNewFolderIcon /> <span className='mx-2'>افزودن پوشه</span></li>
                              <li dir='rtl' onClick={() => AddDocumentArchive(option)} onMouseEnter={(e: any) => setActiveItem("file")} style={{ background: `${activeItem == "file" ? color?.color : ""}`, color: `${activeItem == "file" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <NoteAddIcon /> <span className='mx-2'>افزودن مدرک</span></li>
                              <li dir='rtl' onClick={() => { setSelectedFolder(option), handleEditFolder() }} onMouseEnter={(e: any) => setActiveItem("edit")} style={{ background: `${activeItem == "edit" ? color?.color : ""}`, color: `${activeItem == "edit" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <EditIcon /> <span className='mx-2'>ویرایش پوشه</span></li>
                            </ul>
                          </PopoverContent>
                        </Popover>

                      }
                    >
                      {option.subArchives && CreateFolderChild(option.subArchives)}
                      {option.archiveDocs && CreateFileChild(option.archiveDocs, option.id)}
                    </StyledTreeItem>
                  );
                }
                else {
                  return (
                    <StyledTreeItem
                      key={index}
                      nodeId={option.id.toString()}
                      labelText={option.archiveName}
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
                              <li onClick={() => DeleteFolder(option)} dir='rtl' onMouseEnter={(e: any) => setActiveItem("delete")} style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف</span></li>
                              <li onClick={() => AddFolderArchive(option)} dir='rtl' onMouseEnter={(e: any) => setActiveItem("folder")} style={{ background: `${activeItem == "folder" ? color?.color : ""}`, color: `${activeItem == "folder" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><CreateNewFolderIcon /> <span className='mx-2'>افزودن پوشه</span></li>
                              <li dir='rtl' onClick={() => AddDocumentArchive(option)} onMouseEnter={(e: any) => setActiveItem("file")} style={{ background: `${activeItem == "file" ? color?.color : ""}`, color: `${activeItem == "file" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <NoteAddIcon /> <span className='mx-2'>افزودن مدرک</span></li>
                              <li dir='rtl' onClick={() => { handleEditFolder(), setSelectedFolder(option) }} onMouseEnter={(e: any) => setActiveItem("edit")} style={{ background: `${activeItem == "edit" ? color?.color : ""}`, color: `${activeItem == "edit" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <EditIcon /> <span className='mx-2'>ویرایش پوشه</span></li>
                            </ul>
                          </PopoverContent>
                        </Popover>
                      }
                    />
                  );
                }
              })
              :
              showData?.filter((val: ArchiveAutomationModel) => (val.parentId == null)).map((option: ArchiveAutomationModel, index: number) => {
                if (option.subArchives != undefined || option.archiveDocs?.length > 0) {
                  return (
                    <StyledTreeItem
                      key={index}
                      nodeId={option.id.toString()}
                      labelText={option.archiveName}
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
                            <ul >
                              <li dir='rtl' onClick={() => DeleteFolder(option)} onMouseEnter={(e: any) => setActiveItem("delete")} style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف</span></li>
                              <li dir='rtl' onClick={() => AddFolderArchive(option)} onMouseEnter={(e: any) => setActiveItem("folder")} style={{ background: `${activeItem == "folder" ? color?.color : ""}`, color: `${activeItem == "folder" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><CreateNewFolderIcon /> <span className='mx-2'>افزودن پوشه</span></li>
                              <li dir='rtl' onClick={() => AddDocumentArchive(option)} onMouseEnter={(e: any) => setActiveItem("file")} style={{ background: `${activeItem == "file" ? color?.color : ""}`, color: `${activeItem == "file" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <NoteAddIcon /> <span className='mx-2'>افزودن مدرک</span></li>
                              <li dir='rtl' onClick={() => { handleEditFolder(), setSelectedFolder(option) }} onMouseEnter={(e: any) => setActiveItem("edit")} style={{ background: `${activeItem == "edit" ? color?.color : ""}`, color: `${activeItem == "edit" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <EditIcon /> <span className='mx-2'>ویرایش پوشه</span></li>

                            </ul>
                          </PopoverContent>
                        </Popover>

                      }
                    >
                      {option.subArchives && CreateFolderChild(option.subArchives)}
                      {option.archiveDocs && CreateFileChild(option.archiveDocs, option.id)}
                    </StyledTreeItem>
                  )
                }
                else {
                  return (
                    <StyledTreeItem
                      key={index}
                      nodeId={option.id.toString()}
                      labelText={option.archiveName}
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
                            <ul >
                              <li onClick={() => DeleteFolder(option)} dir='rtl' onMouseEnter={(e: any) => setActiveItem("delete")} style={{ background: `${activeItem == "delete" ? color?.color : ""}`, color: `${activeItem == "delete" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><DeleteIcon /><span className='mx-2'>حذف</span></li>
                              <li onClick={() => AddFolderArchive(option)} dir='rtl' onMouseEnter={(e: any) => setActiveItem("folder")} style={{ background: `${activeItem == "folder" ? color?.color : ""}`, color: `${activeItem == "folder" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}><CreateNewFolderIcon /> <span className='mx-2'>افزودن پوشه</span></li>
                              <li dir='rtl' onClick={() => AddDocumentArchive(option)} onMouseEnter={(e: any) => setActiveItem("file")} style={{ background: `${activeItem == "file" ? color?.color : ""}`, color: `${activeItem == "file" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <NoteAddIcon /> <span className='mx-2'>افزودن مدرک</span></li>
                              <li dir='rtl' onClick={() => { handleEditFolder(), setSelectedFolder(option) }} onMouseEnter={(e: any) => setActiveItem("edit")} style={{ background: `${activeItem == "edit" ? color?.color : ""}`, color: `${activeItem == "edit" ? "white" : ""}` }} className={`text-right my-2 p-2 rounded-md text-sm font-thin cursor-pointer ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}> <EditIcon /> <span className='mx-2'>ویرایش پوشه</span></li>
                            </ul>
                          </PopoverContent>
                        </Popover>
                      }
                    />
                  )
                }
              })
          }
        </TreeView>
        <Dialog className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleAddFolderArchive} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>افزودن پوشه</DialogHeader>
          <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <section className='flex flex-col gap-6'>
              <Input dir="rtl" crossOrigin="" size="md" label="نام" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onBlur={(e: any) => { setFolderName(e.currentTarget.value); }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </section>
          </DialogBody>
          <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <section className='flex justify-center'>
              <ButtonComponent onClick={() => { handleAddFolderArchive() }}>انصراف</ButtonComponent>
            </section>
            <section className='flex justify-center'>
              <ButtonComponent onClick={() => AddFolder()}>تائید</ButtonComponent>
            </section>
          </DialogFooter>
        </Dialog>
        <Dialog className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={addParent} handler={handleAddparentFolderArchive} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>افزودن پوشه</DialogHeader>
          <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <section className='flex flex-col gap-6'>
              <Input dir="rtl" crossOrigin="" size="md" label="نام" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onBlur={(e: any) => { setFolderName(e.currentTarget.value); }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </section>
          </DialogBody>
          <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <section className='flex justify-center'>
              <ButtonComponent onClick={handleAddparentFolderArchive}>انصراف</ButtonComponent>
            </section>
            <section className='flex justify-center'>
              <ButtonComponent onClick={() => AddParentFolder()}>تائید</ButtonComponent>
            </section>
          </DialogFooter>
        </Dialog>

        <Dialog size='xxl' className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openDocument} handler={addDocument} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>انتخاب مدرک</DialogHeader>
          <DialogBody className='overflow-scroll' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <section className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} w-[95%] md:w-[90%] my-3 mx-auto`}>
              <div className="relative flex  mx-auto ">
                <Input
                  crossOrigin=""
                  style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
                  type="text"
                  label="search"
                  value={searchValue}
                  onChange={(event: any) => {
                    setSearchDocTable(undefined);
                    setCount(0);
                    setSearchValue(event.target.value);
                  }}
                  className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} pr-20`}
                  containerProps={{
                    className: !themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'
                  }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                <Button
                  onClick={() => { SearchDocument(1); }}
                  size="sm"
                  className="!absolute right-1 top-1 rounded"
                  style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  <i className={"bi bi-search"}></i>
                </Button>
              </div>
              {(searchDocTable != undefined && searchDocTable.length > 0) &&
                <section className='my-3 w-[95%] md:w-[90%] mx-auto'>
                  {loadings.loadingSearch == false ? <table dir="rtl" className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[400px]`}>
                    <thead >
                      <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                        <th style={{ borderBottomColor: color?.color }}
                          className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            color="blue-gray"
                            className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                          >
                            #
                          </Typography>
                        </th>
                        <th style={{ borderBottomColor: color?.color }}
                          className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            color="blue-gray"
                            className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                          >
                            شماره مدرک
                          </Typography>
                        </th>
                        <th style={{ borderBottomColor: color?.color }}
                          className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography

                            color="blue-gray"
                            className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                          >
                            موضوع
                          </Typography>
                        </th>
                        <th style={{ borderBottomColor: color?.color }}
                          className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                          <Typography
                            color="blue-gray"
                            className={`font-normal p-1.5 leading-none opacity-70 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                          >
                            عملیات
                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                      {searchDocTable?.map((item: UnArchiveDocList, index: number) => {
                        return (
                          <tr key={index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none  hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                            <td style={{ width: '5%' }} className='p-1'>
                              <Typography

                                color="blue-gray"
                                className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                              >
                                {Number(index) + Number(1)}
                              </Typography>
                            </td>
                            <td style={{ width: '10%' }} className='p-1'>
                              <Typography

                                color="blue-gray"
                                className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                              >
                                {item.indicator}
                              </Typography>
                            </td>
                            <td className='p-1'>
                              <Typography

                                color="blue-gray"
                                className={`font-normal p-0.5 whitespace-nowrap ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}
                              >
                                {item.subject}
                              </Typography>
                            </td>
                            <td style={{ width: '4%' }} className='p-1'>
                              <div className='container-fluid mx-auto p-0.5'>
                                <div className="flex flex-row justify-evenly">
                                  <Button
                                    onClick={() => ArchiveDocument(item)}
                                    size="sm"
                                    className="p-1 mx-1"
                                    style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                  >
                                    <TaskIcon
                                      fontSize="small"
                                      className='p-1'
                                      onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                      onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                    />
                                  </Button>

                                  <Button onClick={() => { activeStore.setState((state) => ({ ...state, activeSubLink: "New Document" })), window.open(`/Home/NewDocument?docheapid=${item.docHeapId}&doctypeid=${item.docTypeId}`); }}
                                    size="sm"
                                    className="p-1 mx-1"
                                    style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                  >
                                    <VisibilityIcon
                                      fontSize="small"
                                      className='p-1'
                                      onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                      onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                    />
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table> : <TableSkeleton />}
                </section>
              }
            </section>
            {count != 0 && (<section className='flex justify-center mb-0 mt-3'>
              <Stack onClick={(e: any) => SearchDocument(e.target.innerText)} spacing={1}>
                <Pagination hidePrevButton hideNextButton count={count} variant="outlined" size="small" shape="rounded" />
              </Stack>
            </section>)}
          </DialogBody>
          <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <ButtonComp onClick={addDocument}>بستن</ButtonComp>
          </DialogFooter>
        </Dialog>
      </CardBody>
      <Dialog size="sm" className={`absolute top-0 ' ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={editOpen} handler={handleEditFolder} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>ویرایش پوشه</DialogHeader>
        <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex flex-col gap-6'>
            <Input dir="rtl" defaultValue={selectedFolder?.archiveName} onBlur={(e: any) => setSelectedFolder((state) => ({ ...state, archiveName: e.target.value }))} crossOrigin="" size="md" label="نام" style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            <Select2 isRtl isSearchable
              maxMenuHeight={220}
              options={allArchive}
              className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] z-[50]`} placeholder="آرشیو مرجع"
              onChange={(option: SingleValue<SelectOptionModel>, actionMeta: ActionMeta<SelectOptionModel>) => { setSelectedFolder((state) => ({ ...state, parentId: option!.value })) }}
              defaultValue={folders.find(p => p.value == selectedFolder.parentId) ? folders.find(p => p.value == selectedFolder.parentId) : { label: "ندارد", value: null }}
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
                  neutral80: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}`
                },
              })}
            />
          </section>
        </DialogBody>
        <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='flex justify-center'>
            <ButtonComponent onClick={handleEditFolder}>انصراف</ButtonComponent>
          </section>
          <section className='flex justify-center'>
            <ButtonComponent onClick={() => { EditFolderArchives(), handleEditFolder() }}>تائید</ButtonComponent>
          </section>
        </DialogFooter>
      </Dialog>
    </>
  );
}
export default SubsetArchive;



