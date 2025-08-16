import React, { useContext, useRef, useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { Button, CardBody, Popover, PopoverContent, PopoverHandler, Tooltip, Typography } from '@material-tailwind/react';
import { ActionButton, Icon, ListItem, Th } from '../../../Shared/TableComponent';
import { ArchiveSerachContext } from './Archive-MainContainer';
import { Td } from '../../../Shared/TableComponent';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import CloudDownload from '@mui/icons-material/CloudDownload';
import useLoginUserInfo from '@/app/zustandData/useLoginUserInfo';
import moment from 'jalali-moment';
import ViewArchive from './ViewArchive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LoadingModel } from '@/app/Domain/shared';
import { ArchivesModel, GetHArchiveFileModel, SearchArchiveModels } from '@/app/Domain/M_History/Archive';
import { useArchiveFile } from '@/app/Application-AsiaApp/M_History/fetchHArchiveFile';
import { RemovingHArchiveFromList } from '@/app/Application-AsiaApp/M_History/RemoveHArchivefromlist';
import UpdateHArchive from './UpdateHArchive';
import PopovelListItem from '../../../Shared/PopovelListItem';
import { ConvertBase64toBlob } from '@/app/Application-AsiaApp/Utils/blob';
import { ImageTypes, PDFTypes } from '@/app/Application-AsiaApp/Utils/shared';

const ArchiveList = () => {
    const CurrentUser = useLoginUserInfo.getState();
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const ArchiveRef = useRef<{ handleOpenTab: () => void, setData: (data: GetHArchiveFileModel) => void }>(null)
    const UpdateRef = useRef<{ handleOpen: () => void, setItem: (data: ArchivesModel) => void }>(null);
    const { state, setLoadings, loadings, setState } = useContext(ArchiveSerachContext)
    const { fetchFileData } = useArchiveFile()
    const { DeleteHArchive } = RemovingHArchiveFromList()

    const Download = async (id: number) => {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        const res = await fetchFileData(id).then((result) => {
            if (result) {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                if (typeof result == 'object' && 'file' in result && typeof window !== 'undefined') {
                    let blob = ConvertBase64toBlob({ b64Data: result.file.substring(result.file.lastIndexOf(",") + 1), contentType: result.fileType, sliceSize: 512 });
                    var fileDownload = require('js-file-download');
                    fileDownload(blob, result.fileName);
                }
            }
        })
    }

    const ViewAttachment = async (id: number) => {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        const res = await fetchFileData(id).then((result) => {
            if (result) {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                if (typeof result == 'object' && 'file' in result && typeof window !== 'undefined') {
                    if (ArchiveRef.current) {
                        let blob = ConvertBase64toBlob({ b64Data: result.file.substring(result.file.lastIndexOf(",") + 1), contentType: result.fileType, sliceSize: 512 });
                        let blobUrl = URL.createObjectURL(blob);
                        if (ArchiveRef.current) {
                            ArchiveRef.current.setData({ file: blobUrl, fileName: result.fileName.split(".")[0], fileType: result.fileType })
                            ArchiveRef.current.handleOpenTab()
                        }
                    };
                }
            }
        })
        setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
    }

    const RemoveHArchive = async (id: number) => {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        const res = await DeleteHArchive(id).then((result) => {
            if (result) {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                if (typeof result == 'boolean' && result == true) {
                    let newArchives = state.hArchives.filter((item: ArchivesModel) => item.id !== id)
                    setState((prev: SearchArchiveModels) => ({ ...prev, hArchives: [...newArchives], totalCount: prev.totalCount - 1 }))
                }
            }
        })
    }

    return (
        <>
            {state && state.hArchives.length >= 0 && <CardBody className='w-[98%] mx-auto relative rounded-lg overflow-auto p-0' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <table dir="rtl" className={`w-full relative text-center ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} `}>
                    <thead>
                        <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <Th value={'#'} />
                            <Th value={'نام شناور'} />
                            <Th value={'شماره مدرک'} />
                            <Th value={'دسته بندی'} />
                            <Th value={'موضوع'} />
                            <Th value={'AsiaCode'} />
                            <Th value={'تاریخ آرشیو'} />
                            <Th value={'عملیات'} />
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {state !== undefined && state.hArchives.map((item: ArchivesModel, index: number) => {
                            return (
                                <tr key={index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                    <Td style={{ width: '3%' }} value={Number(index) + Number(1)} />
                                    <Td style={{ width: '15%' }} value={item.vesselNameF} />
                                    <Td style={{ width: '15%' }} value={item.docNo} />
                                    <Td style={{ width: '15%' }} value={item.archiveCategory} />
                                    <Td style={{ width: '15%' }} value={item.subject} />
                                    <Td style={{ width: '15%' }} value={item.asiaCode} />
                                    <Td style={{ width: '15%' }} value={moment(item.createDate).format('jYYYY/jMM/jDD')} />
                                    <Td style={{ width: '12%' }} value={
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <Popover placement="bottom">
                                                    <PopoverHandler>
                                                        <Button
                                                            size="sm"
                                                            className="p-1 mx-1"
                                                            style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                            <Tooltip content='اطلاعات تکمیلی' className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                                                                <InfoIcon
                                                                    fontSize="small"
                                                                    className='p-1'
                                                                    onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                    onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                />
                                                            </Tooltip>
                                                        </Button>
                                                    </PopoverHandler>
                                                    <PopoverContent className={` z-[9999] border-none py-[10px] ${!themeMode || themeMode?.stateMode ? " bg-[#2e4b64] lightText" : " bg-[#efe7e2] darkText"}`} dir="rtl" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                        <ListItem title={'نام انگلیسی شناور:'} content={item.vesselNameE} /><br></br>
                                                        <ListItem title={'نام فایل:'} content={item.fileName} /><br></br>
                                                        <ListItem title={'RegNo :'} content={item.regNo} /><br></br>
                                                        <ListItem title={'گیرنده:'} content={item.receiver} /><br></br>
                                                        <ListItem title={'فرستنده:'} content={item.sender} />
                                                        <ListItem title={'توضیحات:'} content={item.comment} />
                                                    </PopoverContent>
                                                </Popover>
                                                {/* <Popover placement="right" >
                                                    <PopoverHandler>
                                                        <Button
                                                            size="sm"
                                                            className="p-1 mx-1"
                                                            style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                            <VisibilityIcon
                                                                fontSize="small"
                                                                className='p-1'
                                                                onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                            />
                                                        </Button>
                                                    </PopoverHandler>
                                                    <PopoverContent className={`${themeMode?.stateMode ? 'cardDark' : 'cardLight'} z-[4646464568746]`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                        <ul>
                                                            <PopovelListItem Name={DownloadForOfflineIcon} activate={'High'} onClick={() => ViewArchiveFile(item.id, 1)} item={'دانلود با حجم بالا'} />
                                                            <PopovelListItem Name={DownloadForOfflineIcon} activate={'Medium'} onClick={() => ViewArchiveFile(item.id, 2)} item={'دانلود با حجم متوسط'} />
                                                            <PopovelListItem Name={DownloadForOfflineIcon} activate={'Low'} onClick={() => ViewArchiveFile(item.id, 3)} item={'دانلود با حجم پائین'} />
                                                        </ul>
                                                    </PopoverContent>
                                                </Popover> */}
                                                {PDFTypes.includes(item.fileName.split('.')[1]) || ImageTypes.filter(op => !op.includes('tiff')).includes(item.fileName.split('.')[1]) ?
                                                    <ActionButton onClick={() => { ViewAttachment(item.id) }}>
                                                        <Icon Name={VisibilityIcon} />
                                                    </ActionButton>
                                                    :
                                                    <ActionButton onClick={() => { Download(item.id) }}>
                                                        <Icon Name={CloudDownload} />
                                                    </ActionButton>
                                                }
                                                {CurrentUser && CurrentUser.userInfo && CurrentUser.userInfo.actors.some((actor: any) => actor.claims.some((claim: any) => (claim.key == "History" && claim.value == "HArchiveEdit"))) &&
                                                    <>
                                                        <ActionButton onClick={() => { if (UpdateRef.current) { UpdateRef.current.handleOpen(), UpdateRef.current.setItem(item) } }}>
                                                            <Icon Name={EditIcon} />
                                                        </ActionButton>
                                                        <ActionButton onClick={() => RemoveHArchive(item.id)}>
                                                            <Icon Name={DeleteIcon} />
                                                        </ActionButton>
                                                    </>}

                                            </div>
                                        </div>
                                    }
                                    />
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardBody >}
            <ViewArchive ref={ArchiveRef} />
            <UpdateHArchive ref={UpdateRef} />
        </>
    )
}

export default ArchiveList
