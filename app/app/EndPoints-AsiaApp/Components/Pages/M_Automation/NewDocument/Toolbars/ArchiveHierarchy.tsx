"use client";
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { CardBody, Checkbox, Dialog, DialogBody, DialogHeader, Input } from '@material-tailwind/react';
import { HierarchyModels, SubsetFoldersHierarchyModels } from '@/app/models/Automation/NewDocumentModels';
import useStore from "@/app/hooks/useStore";
import { DataContext } from '../NewDocument-MainContainer';
import { useArchiveHierarchy } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchArchiveHierachy';
import { InsertingDocArchive } from '@/app/Application-AsiaApp/M_Automation/NewDocument/InsertDocumenttoArchives';
import { RemovingArchive } from '@/app/Application-AsiaApp/M_Automation/NewDocument/RemoveArchive';
import { StyledTreeItem } from '@/app/EndPoints-AsiaApp/Components/Shared/StyledTreeItem';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import { CloseIcon } from '@/app/EndPoints-AsiaApp/Components/Shared/IconComponent';
import CustomizedSearched from '@/app/EndPoints-AsiaApp/Components/Shared/SearchComponent';

const ArchiveHierarchy = forwardRef((props: any, ref) => {
    const { docheapId } = useContext(DataContext)
    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open)
    const color = useStore(colorStore, (state) => state);
    const themeMode = useStore(themeStore, (state) => state);
    const [showData, setShowData] = useState<any>(null);
    const { fetchArchiveHierarchy } = useArchiveHierarchy()
    const { InsertDocument } = InsertingDocArchive()
    const { UnArchive } = RemovingArchive()
    let resultData: any[] = []
    let initialState = {
        archiveFolders: []
    }
    let [hierarchyFolders, setHierarchyFolders] = useState<HierarchyModels>(initialState)

    useImperativeHandle(ref, () => ({
        handleOpenArchives: () => {
            handleOpen()
        }
    }))
    useEffect(() => {
        const loadArchiveHierarchy = async () => {
            const res = await fetchArchiveHierarchy(docheapId).then((result) => {
                if (result) {
                    if (Array.isArray(result)) {
                        setHierarchyFolders((state) => ({ ...state, archiveFolders: result }))
                    }
                }
            })
        }
        loadArchiveHierarchy()
    }, [docheapId])

    const AddDocumentArchive = async (docheapId: string, id: number, name: string) => {
        const res = await InsertDocument(docheapId, id, name).then((result) => {
            if (result) {
                return result
            }
        })
    }

    function CreateFolderChild(subArchives: SubsetFoldersHierarchyModels[]) {
        return (
            subArchives.map((item: SubsetFoldersHierarchyModels, index: number) => {
                return (
                    <StyledTreeItem
                        id={"folder_" + item.Id}
                        key={"folder_" + item.Id}
                        nodeId={item.Id.toString()}
                        labelText={item.ArchiveName}
                        labelIcon={FolderIcon}
                        labelInfo={
                            (item.IsArchived === false) ? (<Checkbox
                                onClick={(e: any) => AddDocumentArchive(docheapId, item.Id, item.ArchiveName)}
                                crossOrigin=""
                                name="type"
                                color='blue-gray'
                                className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />) : (<Checkbox
                                    onClick={(e: any) => RemoveDocumentArchive(docheapId, item.Id)}
                                    defaultChecked
                                    crossOrigin=""
                                    name="type"
                                    color='blue-gray'
                                    className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />

                            )
                        }
                    >
                        {item.SubArchives != null ? CreateFolderChild(item.SubArchives) : null}
                    </StyledTreeItem>
                );
            }
            )
        );
    }

    const RemoveDocumentArchive = async (docheapId: string, id: number) => {
        const res = await UnArchive(docheapId, id).then((result) => {
            if (result) {
                return result
            }
        })
    }

    const SearchsubArchives = (searchText: string, subArchive: SubsetFoldersHierarchyModels,) => {
        if (subArchive.ArchiveName.includes(searchText)) {
            return subArchive
        } else {
            if ((subArchive.SubArchives != null && subArchive.SubArchives.length > 0)) {
                let archives: any = { ...subArchive, SubArchives: null }
                subArchive.SubArchives?.forEach((item) => {
                    let result = SearchsubArchives(searchText, item)
                    if (result != null) {
                        archives.SubArchives == null ? archives.SubArchives = [result] : archives.SubArchives.push(result)
                    } else {
                        return null
                    }
                })
                return ((archives.SubArchives != null && archives.SubArchives.length > 0)) ? archives : null
            } else {
                return null
            }
        }
    }

    const SearchArchives = (searchText: string, array: SubsetFoldersHierarchyModels[] = hierarchyFolders.archiveFolders) => {
        array.forEach((folder: SubsetFoldersHierarchyModels) => {
            if ((folder.SubArchives == null || folder.SubArchives?.length == 0 || !folder.SubArchives)) {

                if (folder.ArchiveName.includes(searchText)) {
                    resultData.push(folder)
                }
            } else {
                let newResult: any = { ...folder, SubArchives: null }
                folder.SubArchives != null && folder.SubArchives!.forEach((archive) => {
                    let searchResult: SubsetFoldersHierarchyModels = SearchsubArchives(searchText, archive)!;
                    if (searchResult != null) {
                        newResult.SubArchives == null ? newResult.SubArchives = [searchResult] : newResult.SubArchives.push(searchResult)
                    }
                })
                if ((newResult.SubArchives != null && newResult.SubArchives.length > 0)) {
                    resultData.push(newResult)
                    return
                }
                if (folder.ArchiveName.includes(searchText)) {
                    resultData.push(folder)
                }

            }
        })
    };

    const handleGetSearchKey = async (data: string) => {
        SearchArchives(data)
        setShowData(resultData) 
    }

    return (
        <MyCustomComponent>
            <>
                <Dialog dir='rtl'
                    dismiss={{
                        escapeKey: true, referencePress: true, referencePressEvent: 'click', outsidePress: false, outsidePressEvent: 'click', ancestorScroll: false, bubbles: true
                    }} size='xl' className={`absolute top-0 bottom-0 overflow-y-scroll  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                    <DialogHeader className={` flex justify-between sticky top-0 left-0 z-[555555] ${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'} `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        بایگانی
                        <CloseIcon onClick={() => handleOpen()} />
                    </DialogHeader>
                    <DialogBody className='w-full overflow-y-auto' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <CustomizedSearched searchKey={handleGetSearchKey} />
                        <TreeView
                            aria-label="AsiaApp"
                            defaultExpanded={['']}
                            className='rounded-lg overflow-hidden shadow-lg'
                            defaultCollapseIcon={<ArrowDropDownIcon style={{ color: `${color?.color}` }} />}
                            defaultExpandIcon={<ArrowRightIcon style={{ color: `${color?.color}` }} />}
                            defaultEndIcon={<div style={{ width: 24 }} />}
                            sx={{ height: "100%", flexGrow: 1, maxWidth: "100%", overflowY: 'auto', padding: "10px", background: themeMode?.stateMode ? '#15202c' : '#cbc5c0' }}
                        >
                            {(showData == null) ?
                                (hierarchyFolders.archiveFolders.filter((val: SubsetFoldersHierarchyModels) => val.ParentId == null).map((option: SubsetFoldersHierarchyModels, index: number) => {
                                    if (option.SubArchives != null) {
                                        return (
                                            <StyledTreeItem
                                                key={index}
                                                nodeId={option.Id.toString()}
                                                labelText={option.ArchiveName}
                                                labelIcon={FolderIcon}
                                                labelInfo={

                                                    (option.IsArchived === false) ? (<Checkbox
                                                        onClick={(e: any) => AddDocumentArchive(docheapId, option.Id, option.ArchiveName)}
                                                        crossOrigin=""
                                                        name="type"
                                                        color='blue-gray'
                                                        className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />) : (<Checkbox
                                                            onClick={(e: any) => RemoveDocumentArchive(docheapId, option.Id)}
                                                            defaultChecked
                                                            crossOrigin=""
                                                            name="type"
                                                            color='blue-gray'
                                                            className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                                    )
                                                }
                                            >
                                                {option.SubArchives && CreateFolderChild(option.SubArchives)}
                                            </StyledTreeItem>
                                        );
                                    }
                                    else {
                                        return (
                                            <StyledTreeItem
                                                key={index}
                                                nodeId={option.Id.toString()}
                                                labelText={option.ArchiveName}
                                                labelIcon={FolderIcon}
                                                labelInfo={
                                                    (option.IsArchived === false) ? (<Checkbox
                                                        onClick={(e: any) => AddDocumentArchive(docheapId, option.Id, option.ArchiveName)}
                                                        crossOrigin=""
                                                        name="type"
                                                        color='blue-gray'
                                                        className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />) : (<Checkbox
                                                            onClick={(e: any) => RemoveDocumentArchive(docheapId, option.Id)}
                                                            defaultChecked
                                                            crossOrigin=""
                                                            name="type"
                                                            color='blue-gray'
                                                            className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />

                                                    )
                                                }
                                            />
                                        );
                                    }
                                })) : (
                                    showData?.filter((val: SubsetFoldersHierarchyModels) => (val.ParentId == null)).map((option: SubsetFoldersHierarchyModels, index: number) => {
                                        if (option.SubArchives != undefined) {
                                            return (
                                                <StyledTreeItem
                                                    key={index}
                                                    nodeId={option.Id.toString()}
                                                    labelText={option.ArchiveName}
                                                    labelIcon={FolderIcon}
                                                    labelInfo={
                                                        (option.IsArchived === false) ? (<Checkbox
                                                            onClick={(e: any) => AddDocumentArchive(docheapId, option.Id, option.ArchiveName)}
                                                            crossOrigin=""
                                                            name="type"
                                                            color='blue-gray'
                                                            className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />) : (<Checkbox
                                                                onClick={(e: any) => RemoveDocumentArchive(docheapId, option.Id)}
                                                                defaultChecked
                                                                crossOrigin=""
                                                                name="type"
                                                                color='blue-gray'
                                                                className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />

                                                        )
                                                    }
                                                >
                                                    {option.SubArchives && CreateFolderChild(option.SubArchives)}
                                                </StyledTreeItem>
                                            )
                                        }
                                        else {
                                            return (
                                                <StyledTreeItem
                                                    key={index}
                                                    nodeId={option.Id.toString()}
                                                    labelText={option.ArchiveName}
                                                    labelIcon={FolderIcon}
                                                    labelInfo={
                                                        (option.IsArchived === false) ? (<Checkbox
                                                            onClick={(e: any) => AddDocumentArchive(docheapId, option.Id, option.ArchiveName)}
                                                            crossOrigin=""
                                                            name="type"
                                                            color='blue-gray'
                                                            className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />) : (<Checkbox
                                                                onClick={(e: any) => RemoveDocumentArchive(docheapId, option.Id)}
                                                                defaultChecked
                                                                crossOrigin=""
                                                                name="type"
                                                                color='blue-gray'
                                                                className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                                        )
                                                    }
                                                />
                                            )
                                        }
                                    })
                                )
                            }
                        </TreeView>
                    </DialogBody>
                </Dialog>
            </>
        </MyCustomComponent>
    );
})
ArchiveHierarchy.displayName = 'ArchiveHierarchy'
export default ArchiveHierarchy;



