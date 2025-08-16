// "use client";
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { styled, useTheme } from '@mui/material/styles';
// import themeStore from '../../../../zustandData/theme.zustand';
// import colorStore from '../../../../zustandData/color.zustand';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import FolderIcon from '@mui/icons-material/Folder';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';
// import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// import { SvgIconProps } from '@mui/material/SvgIcon';
// import { TreeView } from '@mui/x-tree-view/TreeView';
// import { TreeItem, TreeItemProps, treeItemClasses } from '@mui/x-tree-view/TreeItem';
// import useAxios from '@/app/hooks/useAxios';
// import { Button, Card, CardBody, Checkbox, Collapse, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, List, ListItem, Popover, PopoverContent, PopoverHandler } from '@material-tailwind/react';
// import { AxiosResponse } from 'axios';
// import { HierarchyModels, SubsetFoldersHierarchyModels, ResponseArchive, ResponseAddDocArchive, Response } from '@/app/models/Automation/NewDocumentModels';
// import Swal from 'sweetalert2';
// import useStore from "./../../../../hooks/useStore";
// // Icons
// import SearchIcon from '@mui/icons-material/Search';
// import { ArchiveAutomationModel } from '@/app/models/Automation/ArchiveAutomationModel';

// declare module 'react' {
//   interface CSSProperties {
//     '--tree-view-color'?: string;
//     '--tree-view-bg-color'?: string;
//   }
// }

// type StyledTreeItemProps = TreeItemProps & {
//   bgColor?: string;
//   bgColorForDarkMode?: string;
//   color?: string;
//   colorForDarkMode?: string;
//   labelIcon: React.ElementType<SvgIconProps>;
//   labelInfo?: any;
//   labelText: string;
// };

// const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
//   color: theme.palette.text.secondary,
//   [`& .${treeItemClasses.content}`]: {
//     color: theme.palette.text.secondary,
//     borderTopRightRadius: theme.spacing(2),
//     borderBottomRightRadius: theme.spacing(2),
//     paddingRight: theme.spacing(1),
//     fontWeight: theme.typography.fontWeightMedium,
//     '&.Mui-expanded': {
//       fontWeight: theme.typography.fontWeightRegular,
//     },
//     '&:hover': {
//       backgroundColor: theme.palette.action.hover,
//     },
//     '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
//       backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
//       color: 'var(--tree-view-color)',
//     },
//     [`& .${treeItemClasses.label}`]: {
//       fontWeight: 'inherit',
//       color: 'dark',
//     },
//   },
//   [`& .${treeItemClasses.group}`]: {
//     marginLeft: 0,
//     paddingRight: theme.spacing(1),
//     [`& .${treeItemClasses.content}`]: {
//       paddingRight: theme.spacing(3),
//     },
//   },
// })) as unknown as typeof TreeItem;

// const StyledTreeItem = React.forwardRef(function StyledTreeItem(
//   props: StyledTreeItemProps,
//   ref: React.Ref<HTMLLIElement>,
// ) {

//   const theme = useTheme();
//   const {
//     bgColor,
//     labelIcon: LabelIcon,
//     labelInfo,
//     labelText,
//     colorForDarkMode,
//     bgColorForDarkMode,
//     ...other
//   } = props;

//   const styleProps = {
//     '--tree-view-color': theme.palette.mode !== 'dark' ? "" : "",
//     '--tree-view-bg-color':
//       theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
//   };

//   const color = useStore(colorStore, (state) => state)
//   const themeMode = useStore(themeStore, (state) => state)
//   return (
//     <StyledTreeItemRoot
//       label={
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             p: 0.5,
//             pr: 0.5,
//           }}
//         >
//           <Box component={LabelIcon} style={{ color: `${LabelIcon == InsertDriveFileIcon ? "#667dd1e5" : "#ffc107"}` }} sx={{ mr: 1 }} />
//           <Typography className='pr-2' style={{ color: `${!themeMode ||themeMode?.stateMode ? "white" : "#463b2f"}` }} variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
//             {labelText}
//           </Typography>
//           <Typography variant="caption" style={{ color: `${color?.color}` }}>
//             {labelInfo}
//           </Typography>
//         </Box>
//       }
//       style={styleProps}
//       {...other}
//       ref={ref}
//     />
//   );
// });

// interface FoldersHierarchy {
//   docHeapId: string | null;
// }

// const SubsetFoldersHierarchy: React.FC<FoldersHierarchy> = (props) => {
//   const color = useStore(colorStore, (state) => state);
//   const themeMode = useStore(themeStore, (state) => state);
//   const [showData, setShowData] = useState<any>(null);
//   const [searchText, setSearchText] = useState<string>("");
//   let resultData: any[] = []
//   let initialState = {
//     archiveFolders: []
//   }
//   let [hierarchyFolders, setHierarchyFolders] = useState<HierarchyModels>(initialState)
//   const GetArchiveHierarch = useCallback(async () => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getarchivehierarchy?docHeapId=${props.docHeapId}`;
//     let method = "get";
//     let data = {};
//     let resArchiveFolders: AxiosResponse<ResponseArchive<SubsetFoldersHierarchyModels[]>> = await AxiosRequest({ url, method, data, credentials: true });
//     if (resArchiveFolders.data.Data != null) {
//       setHierarchyFolders((state) => ({ ...state, archiveFolders: resArchiveFolders.data.Data }))
//     }
//   }, [props.docHeapId]
//   )

//   useEffect(() => {
//     GetArchiveHierarch()
//   }, [GetArchiveHierarch])

//   function CreateFolderChild(subArchives: SubsetFoldersHierarchyModels[]) {
//     return (
//       subArchives.map((item: SubsetFoldersHierarchyModels, index: number) => {
//         return (
//           <StyledTreeItem
//             id={"folder_" + item.Id}
//             key={"folder_" + item.Id}
//             nodeId={item.Id.toString()}
//             labelText={item.ArchiveName}
//             labelIcon={FolderIcon}
//             labelInfo={
//               (item.IsArchived === false) ? (<Checkbox
//                 onClick={(e: any) => AddDocumentArchive(item)}
//                 crossOrigin=""
//                 name="type"
//                 color='blue-gray'
//                 className="size-3 p-0 transition-all hover:before:opacity-0"
//               />) : (<Checkbox
//                 onClick={(e: any) => RemoveDocumentArchive(item)}
//                 defaultChecked
//                 crossOrigin=""
//                 name="type"
//                 color='blue-gray'
//                 className="size-3 p-0 transition-all hover:before:opacity-0"
//               />

//               )
//             }
//           >
//             {item.SubArchives != null ? CreateFolderChild(item.SubArchives) : null}
//           </StyledTreeItem>
//         );
//       }
//       )
//     );
//   }

//   const AddDocumentArchive = async (document: SubsetFoldersHierarchyModels) => {
//     Swal.fire({
//       background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//       color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
//       allowOutsideClick: false,
//       title: "بایگانی مدرک",
//       text: "آیا از بایگانی مدرک اطمینان دارید!؟",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes!"
//     })
//       .then(async (result) => {
//         if (result.isConfirmed) {
//           let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/adddocarchive`;
//           let method = "put";
//           let data = {
//             "docHeapId": props.docHeapId,
//             "archiveId": document.Id,
//             "documentName": document.ArchiveName
//           }
//           let response: AxiosResponse<Response<ResponseAddDocArchive>> = await AxiosRequest({ url, method, data, credentials: true })
//           if (response.data.data == null) {
//             Swal.fire({
//               background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//               color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
//               allowOutsideClick: false,
//               title: "بایگانی مدرک",
//               text: response.data.message,
//               confirmButtonColor: "#22c55e",
//               confirmButtonText: "OK!",
//               icon: response.data.status == true ? "warning" : "error",
//             })
//           }
//         }
//       })
//   };
//   const RemoveDocumentArchive = async (document: SubsetFoldersHierarchyModels) => {
//     Swal.fire({
//       background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//       color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
//       allowOutsideClick: false,
//       title: "بایگانی مدرک",
//       text: "آیا از حذف آرشیو اطمینان دارید!؟",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes!"
//     })
//       .then(async (result) => {
//         if (result.isConfirmed) {
//           let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/unarchiveDocument`;
//           let method = "Delete";
//           let data = {
//             "docHeapId": props.docHeapId,
//             "archiveId": document.Id,
//           }
//           let response: AxiosResponse<Response<ResponseAddDocArchive>> = await AxiosRequest({ url, method, data, credentials: true })
//           if (response.data.data == null) {
//             Swal.fire({
//               background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//               color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
//               allowOutsideClick: false,
//               title: "بایگانی مدرک",
//               confirmButtonColor: "#22c55e",
//               confirmButtonText: "OK!",
//               text: response.data.message,
//               icon: response.data.status == true ? "warning" : "error",
//             })
//           }
//         }
//       })
//   };

//   const SearchsubArchives = (subArchive: SubsetFoldersHierarchyModels) => {
//     if (subArchive.ArchiveName.includes(searchText)) {
//       return subArchive
//     } else {
//       if ((subArchive.SubArchives != null && subArchive.SubArchives.length > 0)) {
//         let archives: SubsetFoldersHierarchyModels = { ...subArchive, SubArchives: [] }
//         subArchive.SubArchives?.forEach((item) => {
//           let result = SearchsubArchives(item)
//           if (result != null) {
//             archives.SubArchives == null ? archives.SubArchives = [result] : archives.SubArchives.push(result)
//           } else {
//             return null
//           }
//         })
//         return ((archives.SubArchives != null && archives.SubArchives.length > 0)) ? archives : null
//       } else {
//         return null
//       }
//     }
//   }

//   const SearchArchives = (array: SubsetFoldersHierarchyModels[] = hierarchyFolders.archiveFolders) => {
//     array.forEach((folder: SubsetFoldersHierarchyModels) => {
//       // if ((folder.SubArchives == null || folder.SubArchives?.length == 0 || !folder.SubArchives) && (folder.SubArchives == null)) {
//       if (folder.ArchiveName.includes(searchText)) {
//         resultData.push(folder)
//       }
//       // } 
//       else {
//         let newResult: SubsetFoldersHierarchyModels = { ...folder, SubArchives: [] }
//         folder.SubArchives!.forEach((archive) => {
//           let searchResult = SearchsubArchives(archive);
//           if (searchResult != null) {
//             newResult.SubArchives == null ? newResult.SubArchives = [searchResult] : newResult.SubArchives.push(searchResult)
//           }
//         })
//         if (newResult.SubArchives != null && newResult.SubArchives.length > 0) {
//           resultData.push(newResult)
//           return
//         }
//       }
//     })
//   };


//   return (
//     <>
//       <CardBody dir='rtl' className='w-[95%]  md:w-[90%] mx-auto relative rounded-lg overflow-auto p-0'>
//         <div className="mt-3 flex flex-col md:flex-row justify-end md:justify-between items-center">
//           <div dir='ltr' className="relative w-[90%] md:w-[35%] flex">
//             <Input
//               dir='rtl'
//               crossOrigin=""
//               style={{ color: `${!themeMode ||themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
//               type="text"
//               label="search"
//               className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} pr-10 p-2`}
//               containerProps={{
//                 className: !themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'
//               }}
//               onBlur={(e: any) => { setSearchText(e.target.value), e.target.value.toString().trim() == "" && setShowData(null) }}
//             />
//             <Button
//               size="sm"
//               className="!absolute right-1 top-1 rounded p-1"
//               style={{ background: color?.color }}
//               onClick={() => { SearchArchives(), setShowData(resultData) }}
//             >
//               <SearchIcon
//                 fontSize='small'
//                 className='p-1'
//                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//               />
//             </Button>
//           </div>
//         </div>
//         <TreeView
//           aria-label="AsiaApp"
//           defaultExpanded={['']}
//           defaultCollapseIcon={<ArrowDropDownIcon style={{ color: `${color?.color}` }} />}
//           defaultExpandIcon={<ArrowRightIcon style={{ color: `${color?.color}` }} />}
//           defaultEndIcon={<div style={{ width: 24 }} />}
//           sx={{ height: "100%", flexGrow: 1, maxWidth: "100%", overflowY: 'auto', padding: "10px" }}
//         >
//           {(showData == null) ?
//             (hierarchyFolders.archiveFolders.filter((val: SubsetFoldersHierarchyModels) => val.ParentId == null).map((option: SubsetFoldersHierarchyModels, index: number) => {
//               if (option.SubArchives != null) {
//                 return (
//                   <StyledTreeItem
//                     key={index}
//                     nodeId={option.Id.toString()}
//                     labelText={option.ArchiveName}
//                     labelIcon={FolderIcon}
//                     labelInfo={

//                       (option.IsArchived === false) ? (<Checkbox
//                         onClick={(e: any) => AddDocumentArchive(option)}
//                         crossOrigin=""
//                         name="type"
//                         color='blue-gray'
//                         className="size-3 p-0 transition-all hover:before:opacity-0"
//                       />) : (<Checkbox
//                         onClick={(e: any) => RemoveDocumentArchive(option)}
//                         defaultChecked
//                         crossOrigin=""
//                         name="type"
//                         color='blue-gray'
//                         className="size-3 p-0 transition-all hover:before:opacity-0"
//                       />
//                       )
//                     }
//                   >
//                     {option.SubArchives && CreateFolderChild(option.SubArchives)}
//                   </StyledTreeItem>
//                 );
//               }
//               else {
//                 return (
//                   <StyledTreeItem
//                     key={index}
//                     nodeId={option.Id.toString()}
//                     labelText={option.ArchiveName}
//                     labelIcon={FolderIcon}
//                     labelInfo={
//                       (option.IsArchived === false) ? (<Checkbox
//                         onClick={(e: any) => AddDocumentArchive(option)}
//                         crossOrigin=""
//                         name="type"
//                         color='blue-gray'
//                         className="size-3 p-0 transition-all hover:before:opacity-0"
//                       />) : (<Checkbox
//                         onClick={(e: any) => RemoveDocumentArchive(option)}
//                         defaultChecked
//                         crossOrigin=""
//                         name="type"
//                         color='blue-gray'
//                         className="size-3 p-0 transition-all hover:before:opacity-0"
//                       />

//                       )
//                     }
//                   />
//                 );
//               }
//             })) : (
//               showData?.filter((val: SubsetFoldersHierarchyModels) => (val.ParentId == null)).map((option: SubsetFoldersHierarchyModels, index: number) => {
//                 if (option.SubArchives != undefined) {
//                   return (
//                     <StyledTreeItem
//                       key={index}
//                       nodeId={option.Id.toString()}
//                       labelText={option.ArchiveName}
//                       labelIcon={FolderIcon}
//                       labelInfo={
//                         (option.IsArchived === false) ? (<Checkbox
//                           onClick={(e: any) => AddDocumentArchive(option)}
//                           crossOrigin=""
//                           name="type"
//                           color='blue-gray'
//                           className="size-3 p-0 transition-all hover:before:opacity-0"
//                         />) : (<Checkbox
//                           onClick={(e: any) => RemoveDocumentArchive(option)}
//                           defaultChecked
//                           crossOrigin=""
//                           name="type"
//                           color='blue-gray'
//                           className="size-3 p-0 transition-all hover:before:opacity-0"
//                         />

//                         )
//                       }
//                     >
//                       {option.SubArchives && CreateFolderChild(option.SubArchives)}
//                     </StyledTreeItem>
//                   )
//                 }
//                 else {
//                   return (
//                     <StyledTreeItem
//                       key={index}
//                       nodeId={option.Id.toString()}
//                       labelText={option.ArchiveName}
//                       labelIcon={FolderIcon}
//                       labelInfo={
//                         (option.IsArchived === false) ? (<Checkbox
//                           onClick={(e: any) => AddDocumentArchive(option)}
//                           crossOrigin=""
//                           name="type"
//                           color='blue-gray'
//                           className="size-3 p-0 transition-all hover:before:opacity-0"
//                         />) : (<Checkbox
//                           onClick={(e: any) => RemoveDocumentArchive(option)}
//                           defaultChecked
//                           crossOrigin=""
//                           name="type"
//                           color='blue-gray'
//                           className="size-3 p-0 transition-all hover:before:opacity-0"
//                         />

//                         )
//                       }
//                     />
//                   )
//                 }
//               })
//             )

//           }
//         </TreeView>
//       </CardBody>
//     </>
//   );
// }
// export default SubsetFoldersHierarchy;



