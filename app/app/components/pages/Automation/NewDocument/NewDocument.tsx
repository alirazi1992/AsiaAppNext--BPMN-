// 'use client';
// import {
//     Accordion, AccordionBody,
//     AccordionHeader, Button,
//     Card,
//     CardBody, Checkbox, Chip,
//     Dialog, DialogBody, DialogFooter,
//     DialogHeader, IconButton, Input,
//     ListItemSuffix, Popover,
//     PopoverContent, PopoverHandler,
//     Tab, TabPanel, Tabs,
//     TabsBody, TabsHeader, Textarea,
//     Tooltip, Typography
// } from '@material-tailwind/react';
// import React, {
//     MutableRefObject, useCallback,
//     useEffect, useMemo,
//     useRef, useState
// } from 'react';
// import themeStore from '@/app/zustandData/theme.zustand';
// import colorStore from '@/app/zustandData/color.zustand';
// import Select2, { ActionMeta, InputActionMeta, MultiValue, SingleValue, } from 'react-select';
// import CreatableSelect from 'react-select/creatable';
// import AsyncSelect from 'react-select/async';
// import ButtonComponent from '@/app/components/shared/ButtonComponent';
// import ButtonComp from '@/app/components/shared/ButtonComp';
// import Swal from 'sweetalert2';
// import { useSearchParams } from 'next/navigation';
// import { AxiosResponse } from 'axios';
// import useAxios from '@/app/hooks/useAxios';
import {
    DropzoneFileModel, GetDocumentDataModel,
    Response, DateInputs,
    NewDocumentStateModels, AttachmentsTableListModel,
    ParaphTableListModel, GetRecieversModel,
    ForwardsListModel, ForwardTargetModel, ForwardAttachmentsModel,
    KeywordModel, RelatedDocListTableModel,
    RelatedDocsModel, LayoutsModel,
    ForwardRecieversModel, RecieveTypes,
    RecieversTableListItem, SignersModel,
    SignDocumentModel, TotalMembar, FileModel,
    FilesModel, GetdocTypeModel, GetImportImageModel,
    UploadImageResponse, GetSendersModel,
    ResponseGetToolbarsModel, ResponseSaveKeywords, UpdateDocumentIssued,
    PassageModel, GetRepositoryModel,
    CopyRecieversTableListItem, SelectedValuToForward,
    SaveImportType, SaveImportTablesItemsModels,
    LoadingNewDocument,
    ResponseUploadAllAttachments
} from '@/app/models/Automation/NewDocumentModels';
// import DateTimePicker from "@/app/components/shared/DatePicker/DateTimePicker";
// import moment from 'jalali-moment';
// import { ViewAttachmentModel } from '@/app/models/Automation/CartableAutomationModel';
// import Image from 'next/image';
// import { UnArchiveDocList, UnArchiveSraechDocs } from '@/app/models/Archive/AddDocumentUnArchiveTable';
// import { FormControl, FormControlLabel, Pagination, RadioGroup } from '@mui/material';
// import { Stack } from '@mui/system';
// import { useDropzone } from 'react-dropzone';
// import {
//     GroupManagementModel,
// } from '@/app/models/Automation/GroupManagementModel';
// import TitleComponent from '@/app/components/shared/TitleComponent';
// import SubsetFoldersHierarchy from './SubsetFoldersHierarchy';
// import b64toBlob from '@/app/Utils/Automation/convertImageToBlob';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import SaveIcon from '@mui/icons-material/Save';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
// import CloudDownload from '@mui/icons-material/CloudDownload';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import AddIcon from '@mui/icons-material/Add';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import AccountTreeIcon from '@mui/icons-material/AccountTree';
// import ReplyIcon from '@mui/icons-material/Reply';
// import ReplyAllIcon from '@mui/icons-material/ReplyAll';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import RedoIcon from '@mui/icons-material/Redo';
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// import PrintIcon from '@mui/icons-material/Print';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import GroupsIcon from '@mui/icons-material/Groups';
// import InfoIcon from '@mui/icons-material/Info';
// import useStore from "@/app/hooks/useStore";
// import Loading from '@/app/components/shared/loadingGetData';
// import ResLoading from '@/app/components/shared/loadingResponse';
// import { useRouter } from 'next/navigation';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import TaskIcon from '@mui/icons-material/Task';
// import Print from './Print';
// import ChartNewDocument from './newChart';
// import TableSkeleton from '@/app/components/shared/TableSkeleton';
// import InputSkeleton from '@/app/components/shared/InputSkeleton';
// import IframeSkeleton from '@/app/components/shared/IframeSkeleton';
// import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
// import SelectOption from '@/app/EndPoints-AsiaApp/Components/Shared/SelectOption';
// import { usePermits } from '@/app/Application-AsiaApp/M_Automation/fetchPersonnalWorkPermits';
// import { GetPersonnelWorkPermitsInitial, GetSubstituteColleagues } from '@/app/Domain/M_Automation/formManagement';
// import { DateObject } from 'react-multi-date-picker';
// import DatePickare from '@/app/EndPoints-AsiaApp/Components/Shared/DatePickareComponent';
// import { CustomRadio } from '@/app/EndPoints-AsiaApp/Components/Shared/CustomizeRadioButton';


// const NewDocumentComponent = () => {
//     const router = useRouter()
//     const searchParams = useSearchParams();
//     const [para, setPara] = useState<string>("")
//     const themeMode = useStore(themeStore, (state) => state);
//     const color = useStore(colorStore, (state) => state);
//     const docTypeId = useRef<string | null>(searchParams.get('doctypeid'));
//     const [activate, setActivate] = useState<string>((docTypeId.current == '1') ? "documentResult" : 'documentInfo')
//     const [openAttachment, setOpenAttachment] = useState<boolean>(false)
//     const [open, setOpen] = useState<boolean>(false)
//     const [openKeywordModal, setOpenKeywordModal] = useState<boolean>(false)
//     const [openRevoked, setOpenRevoked] = useState<boolean>(false)
//     const [searchValue, setSearchValue] = useState<string>('');
//     const [searchDocTable, setSearchDocTable] = useState<UnArchiveDocList[]>();
//     const [count, setCount] = useState<number>(0)
//     const [openRelatedType, setOpenRelatedType] = useState<boolean>(false);
//     const [openSaveDraft, setOpenSaveDraft] = useState<boolean>(false);
//     let [saveDraftName, setSaveDraftName] = useState<string>("")
//     const [openConfirmForward, setOpenConfirmForward] = useState<boolean>(false);
//     const [openForward, setOpenForward] = useState<boolean>(false)
//     const [openRejectDocument, setOpenRejectDocument] = useState<boolean>(false);
//     const [openConfirmDocument, setOpenConfirmDocument] = useState<boolean>(false);
//     const [openReturnedtoSender, setOpenReturnedtoSender] = useState<boolean>(false);
//     const [openPrintDocument, setOpenPrintDocument] = useState<boolean>(false);
//     const [openPdfDocument, setOpenPdfDocument] = useState<boolean>(false);
//     const [openIssuedModal, setOpenIssuedModal] = useState<boolean>(false);
//     const [showPdf, setShowPdf] = useState<boolean>(false);
//     const [showArchiveHierarchy, setShowArchiveHierarchy] = useState<boolean>(false);
//     const [openTreeModal, setOpenTreeModal] = useState<boolean>(false);
//     const [folderHierarchy, setFolderHierarchy] = useState<boolean>(false);
//     const [Groups, SetGroups] = useState<GroupManagementModel[]>();
//     const [activeTabReciever, setActiveTabReciever] = useState<string>("MainReciever");
//     const [accordion, setAccordion] = React.useState(0);
//     const [showPrint, setShowPrint] = useState<boolean>(false);
//     let [revokedDesc, setRevokedDesc] = useState<string>("");
//     const [showImport, setShowImport] = useState<boolean>(false);
//     const [openVideo, setOpenVideo] = useState<boolean>(false)
//     const handleOpenConfirmForward = () => setOpenConfirmForward(!openConfirmForward);
//     const handleAttachment = () => setOpenAttachment(!openAttachment)
//     const handleViewAttachment = () => setOpen(!open)
//     const handleOpenRecovedDocument = () => setOpenRevoked(!openRevoked)
//     const handleAddKeyword = () => setOpenKeywordModal(!openKeywordModal)
//     const handleRelatedType = () => setOpenRelatedType(!openRelatedType)
//     const handleOpenSavedraft = () => setOpenSaveDraft(!openSaveDraft);
//     const handleOpenForward = () => setOpenForward(!openForward)
//     const handleOpenRejectDocument = () => setOpenRejectDocument(!openRejectDocument);
//     const handleOpenConfirmDocument = () => setOpenConfirmDocument(!openConfirmDocument);
//     const handleOpenReturnedtoSender = () => setOpenReturnedtoSender(!openReturnedtoSender);
//     const handleOpenPrintDocument = () => setOpenPrintDocument(!openPrintDocument);
//     const handleOpenPdfDocument = () => setOpenPdfDocument(!openPdfDocument);
//     const handleOpenIssuedModal = () => setOpenIssuedModal(!openIssuedModal);
//     const handleOpenShowPdf = () => setShowPdf(!showPdf);
//     const handleOpenShowPrint = () => setShowPrint(!showPrint);
//     const handleShowArchiveHierarchy = () => setShowArchiveHierarchy(!showArchiveHierarchy);
//     const handleOpenTreeModal = () => setOpenTreeModal(!openTreeModal);
//     const handleShowArchiveFoldersHierarchy = () => setFolderHierarchy(!folderHierarchy);
//     const handleAccordion = (value: any) => setAccordion(accordion === value ? 0 : value)
//     const handleShowImportType = () => setShowImport(!showImport)
//     const handleViewVideoAttachment = () => setOpenVideo(!openVideo);

//     let loading = {
//         loadingResponse: false,
//         loadingGetDocumentData: false,
//         loadingPriority: false,
//         loadingFlowType: false,
//         loadingClassification: false,
//         loadingHasAttachment: false,
//         loadingFowardReceivers: false,
//         loadingKeywords: false,
//         loadingParaphList: false,
//         loadingForwardsList: false,
//         loadingRelatedDocList: false,
//         loadingGroupsList: false,
//         loadingAttachmentList: false,
//         loadingSignersList: false,
//         loadingMainReceiversList: false,
//         loadingCopyReceiversList: false,
//         loadingSendersList: false,
//         loadingImageImport: false,
//         loadingSearch: false,
//         loadingGetDocumentresult: false
//     }

//     const test = 'تست';
//     const { fetchPersonnelWorkPermits } = usePermits()
//     const [permits, setPermits] = useState<GetPersonnelWorkPermitsInitial | undefined>(undefined)
//     const [state, setState] = useState<{
//         format: string;
//         gregorian?: string;
//         persian?: string;
//         date?: DateObject | null;
//     }>({ format: "MM/DD/YYYY" });

//     useEffect(() => {
//         const loadData = async () => {
//             const res = await fetchPersonnelWorkPermits(15).then((result) => {
//                 if (result) {
//                     setPermits(result)
//                 }
//             })
//         }
//         loadData()
//     }, [])

//     const [loadings, setLoadings] = useState<LoadingNewDocument>(loading)
//     const VideoTypes: string[] = ["video/ogg", "video/mp4", "video/x-matroska", "video/webm", "audio/mp4", "audio/mpeg",
//         "audio/aac", "audio/x-caf", "audio/flac", "audio/ogg", "audio/wav", "audio/webm", "application/x-mpegURL",
//     ];
//     let videoRef = useRef(null) as MutableRefObject<AttachmentsTableListModel | null>;
//     interface selectedAppendices {
//         isActive: boolean
//     }
//     const [selectedAppendices, setSelectedAppendices] = useState<selectedAppendices>({ isActive: false })
//     const SaveDraft = async () => {
//         Swal.fire({
//             title: "ذخیره پیش فرض",
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             text: "آیا از ذخیره این پیش فرض اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes!",
//             allowOutsideClick: false,
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savedraft`;
//                 let method = "put";
//                 let data = {
//                     "fileId": JSON.parse(newDocumentState.getDocumentData.find((item) => item.fieldName == "Passage")?.fieldValue as string).FileId,
//                     "title": saveDraftName,
//                     "saveDate": new Date().toDateString(),
//                     "editState": true
//                 };
//                 let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
//                 if (response) {
//                     setLoadings((state) => ({ ...state, loadingResponse: false }))
//                     if (response.data.data == false) {
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             title: "ذخیره پیش فرض",
//                             text: response.data.message,
//                             icon: !response.data.status ? "error" : "warning",
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                             allowOutsideClick: false,
//                         })
//                     }
//                 }
//             }
//         })
//     }

//     let recieversTimeOut: any;

//     const templateId = searchParams.get('templateId');
//     const InitialsState: NewDocumentStateModels = useMemo(() => {
//         return {
//             documentResult: '',
//             getDocumentData: [],
//             templateId: 0,
//             optionPriority: [],
//             optionClassification: [],
//             optionFlowType: [],
//             optionHasAttachments: [],
//             recievers: [],
//             creationPersioanDate: "",
//             signPersianDate: "",
//             isuuedPersianDate: "",
//             paraphTableListItems: [],
//             paraphLength: 0,
//             addParaph: '',
//             forwardsTableListItems: [],
//             attachments: [],
//             attachmentImg: "",
//             file: null,
//             keywords: [],
//             relatedDocsTableListItems: null,
//             attachmentsTableListItems: [],
//             relationType: null,
//             selectedRelation: null,
//             NextRelation: false,
//             selectedkey: [],
//             layoutSize: [],
//             forwardRecievers: [],
//             forwardRecieversTableitems: [],
//             recieveTypes: [],
//             setFormat: 0,
//             pdfString: "",
//             RecieversTableListItems: [],
//             SendersTableListItems: [],
//             CopyRecieversTableListItems: [],
//             SignersName: [],
//             printString: "",
//             HierarchyItems: [],
//             docTypeState: null,
//             importImage: "",
//             toolbars: null,
//             SubjectValue: "",
//             SubmitNoValue: "",
//             ShowPassageIframe: true,
//             PassageDocument: null,
//             ImportTables: []
//         }
//     }, [])
//     const [newDocumentState, setNewDocumentState] = useState<NewDocumentStateModels>(InitialsState)
//     const [docHeapId, setDocHeapId] = useState<string | null>(searchParams.get('docheapid'))
//     const forwardParentId = useRef<string | null>(searchParams.get('forwardparentid'));
//     const layoutSize = useRef<string | null>(searchParams.get('layoutsize'));
//     const id = useRef<string | null>(searchParams.get('id'));
//     const parentForwardTargetId = useRef<string | null>(searchParams.get('parentforwardtaretid'));
//     const [totalMembers, setTotalMembers] = useState<TotalMembar[]>([])
//     const [files, setFiles] = useState<FilesModel[]>([]);
//     const [filesAppendices, setFilesAppendices] = useState<FilesModel[]>([])
//     const [description, setDescription] = useState<string>("");
//     const [images, setImages] = useState<FilesModel[]>([]);
//     const [toolbarTab, setToolbarTab] = useState<string>("");

//     const InitialDates: DateInputs = {
//         CreationDate: "",
//         DateSign: "",
//         IssuedDate: newDocumentState && newDocumentState.getDocumentData.length > 0 && docHeapId && newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate') ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')!.fieldValue : '',
//         ChangeDate: ""
//     }
//     const [gregorianDate, setGregorianDate] = useState<DateInputs>(InitialDates)
//     const onDrop = useCallback((acceptedFiles: any, rejectedFiles: any) => {
//         const newFiles = acceptedFiles.map((file: any) => {
//             return {
//                 file: file,
//                 preview: URL.createObjectURL(file),
//             };
//         });
//         if (activate == "appendices") {
//             setFilesAppendices(prevFiles => [...prevFiles, ...newFiles])
//             if (toolbarTab == "forward" || toolbarTab == "confirmForward") {
//                 setFiles(prevFiles => [...prevFiles, ...newFiles]);
//             }
//         } else if (activate == "letterImage") {
//             setImages(prevFiles => [...prevFiles, ...newFiles])
//             if (toolbarTab == "foeward" || toolbarTab == "confirmForward") {
//                 setFiles(prevFiles => [...prevFiles, ...newFiles]);
//             }
//         } else {
//             setFiles(prevFiles => [...prevFiles, ...newFiles]);
//         }
//     },
//         [activate, toolbarTab]);
//     const { getRootProps, getInputProps } = useDropzone({
//         onDrop, multiple: true,
//     });

//     const TotalGrounps = (items: TotalMembar[]) => {
//         const objectsToAdd = items.splice(0);
//         totalMembers.push(...objectsToAdd);
//         if (totalMembers.length > 0) {
//             let f = [...items?.map((x: TotalMembar) => ({ ...x, IsGroup: true }))];
//             setTotalMembers((state) => ([...state, ...items.map((x: TotalMembar) => ({ ...x, IsGroup: true }))]));
//         } else {
//             let f = [...items?.map((x: TotalMembar) => ({ ...x, IsGroup: true }))];
//             setTotalMembers([...f]);
//         }
//         const key = 'actorName';
//         const UniqueMember = [...Array.from(new Map<string, TotalMembar>(totalMembers?.map((item: TotalMembar) => [item[key], item])).values())];
//         setTotalMembers(() => ([...UniqueMember]));
//     };

//     const GetPriorityItems = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getfieldrepository?fieldId=8`;
//         let method = "get";
//         let data = {};
//         let response: AxiosResponse<Response<GetRepositoryModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response) {
//             setLoadings((state) => ({
//                 ...state, loadingPriority: false
//             }))
//             if (response.data.status == true && response.data.data.length > 0) {
//                 setNewDocumentState((state: NewDocumentStateModels) => ({
//                     ...state, optionPriority: response.data.data.map((item: GetRepositoryModel) => {
//                         return {
//                             Id: item.Id,
//                             Value: item.Value,
//                             value: item.Id,
//                             label: item.Value,
//                         }
//                     })
//                 }))
//             }
//         }
//     }, [])

//     const GetFlowTypeItems = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getfieldrepository?fieldId=11`;
//         let method = "get";
//         let data = {};
//         let response = await AxiosRequest({ url, method, data, credentials: true })
//         if (response) {
//             setLoadings((state) => ({ ...state, loadingFlowType: false }))
//             setNewDocumentState((state: NewDocumentStateModels) => ({
//                 ...state, optionFlowType: response.data.data.map((item: GetRepositoryModel) => {
//                     return {
//                         Id: item.Id,
//                         value: item.Id,
//                         Value: item.Value,
//                         label: item.Value
//                     }
//                 })
//             }))

//         }
//     }, [])

//     const GetHasAttachments = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getfieldrepository?fieldId=12`;
//         let method = "get";
//         let data = {};
//         let response: AxiosResponse<Response<GetRepositoryModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response) {
//             setLoadings((state) => ({
//                 ...state, loadingHasAttachment: false
//             }))
//             if (response.data.data.length > 0) {
//                 setNewDocumentState((state: NewDocumentStateModels) => ({
//                     ...state, optionHasAttachments: response.data.data.map((item: GetRepositoryModel, index: number) => {
//                         return {
//                             Id: item.Id,
//                             value: item.Id,
//                             Value: item.Value,
//                             label: item.Value
//                         }
//                     })
//                 }))
//             }
//         }
//     }, [])

//     const GetClassification = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getfieldrepository?fieldId=9`;
//         let method = "get";
//         let data = {};
//         let response: AxiosResponse<Response<GetRepositoryModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response) {
//             setLoadings((state) => ({
//                 ...state, loadingClassification: false
//             }))
//             if (response.data.data.length > 0) {
//                 setNewDocumentState((state: NewDocumentStateModels) => ({
//                     ...state, optionClassification: response.data.data.map((item: GetRepositoryModel, index: number) => {
//                         return {
//                             label: item.Value,
//                             value: item.Id,
//                             Id: item.Id,
//                             Value: item.Value,
//                         }
//                     })
//                 }))
//             }
//         }
//     }, []
//     )

//     const ChangePriority = (option: SingleValue<GetRepositoryModel>) => {
//         let optionSelect = newDocumentState.getDocumentData.find((option: GetDocumentDataModel) => option.fieldName === "Priority")!;
//         let index = newDocumentState.getDocumentData.indexOf(optionSelect);
//         let data: GetDocumentDataModel[] = newDocumentState.getDocumentData
//         let newOption: GetDocumentDataModel = {
//             fieldId: optionSelect.fieldId,
//             fieldName: optionSelect.fieldName,
//             fieldValue: option!.Id.toString(),
//             isUpdatable: optionSelect!.isUpdatable,
//             recordId: optionSelect!.recordId,
//         }
//         data.splice(index, 1);
//         data.push(newOption)
//         setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, getDocumentData: data }))
//     }

//     const ChangeClassification = (option: SingleValue<GetRepositoryModel>) => {
//         let optionSelect = newDocumentState.getDocumentData.find((option: GetDocumentDataModel) => option.fieldName === "Classification")!;
//         let index = newDocumentState.getDocumentData.indexOf(optionSelect);
//         let data: GetDocumentDataModel[] = newDocumentState.getDocumentData
//         let newOption: GetDocumentDataModel = {
//             fieldId: optionSelect.fieldId,
//             fieldName: optionSelect.fieldName,
//             fieldValue: option!.Id.toString(),
//             isUpdatable: optionSelect!.isUpdatable,
//             recordId: optionSelect!.recordId,
//         }
//         data.splice(index, 1);
//         data.push(newOption)
//         setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, getDocumentData: data }))
//     }

//     const ChangeActionCopyReceiver = (option: SingleValue<RecieveTypes>, item: CopyRecieversTableListItem) => {
//         let optionSelect = newDocumentState.CopyRecieversTableListItems.find((p: CopyRecieversTableListItem) => p.Id === item.Id)!;
//         let index = newDocumentState.CopyRecieversTableListItems.indexOf(optionSelect);
//         let data: CopyRecieversTableListItem[] = newDocumentState.CopyRecieversTableListItems;
//         let newOption: CopyRecieversTableListItem = {
//             ActionId: option!.value,
//             ActionName: option!.label,
//             Description: item.Description,
//             EnValue: item.EnValue,
//             Id: item.Id,
//             label: item.label,
//             Level: item.Level,
//             Value: item.Value,
//             value: item.value
//         }
//         data.splice(index, 1);
//         data.push(newOption)
//         setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, CopyRecieversTableListItems: data }))
//     }
//     const ChangeActionReceiver = (option: SingleValue<RecieveTypes>, item: RecieversTableListItem) => {
//         let optionSelect = newDocumentState.RecieversTableListItems.find((p: RecieversTableListItem) => p.Id === item.Id)!;
//         let index = newDocumentState.RecieversTableListItems.indexOf(optionSelect);
//         let data: RecieversTableListItem[] = newDocumentState.RecieversTableListItems;
//         let newOption: RecieversTableListItem = {
//             ActionId: option!.value,
//             ActionName: option!.label,
//             Description: item.Description,
//             EnValue: item.EnValue,
//             Id: item.Id,
//             label: item.label,
//             Level: item.Level,
//             Value: item.Value,
//             value: item.value
//         }
//         data.splice(index, 1);
//         data.push(newOption)
//         setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, RecieversTableListItems: data }))
//     }

//     const ChangeFlowType = (option: SingleValue<GetRepositoryModel>) => {
//         let optionSelect = newDocumentState.getDocumentData.find((option: GetDocumentDataModel) => option.fieldName === "FlowType")!;
//         let index = newDocumentState.getDocumentData.indexOf(optionSelect);
//         let data: GetDocumentDataModel[] = newDocumentState.getDocumentData
//         let newOption: GetDocumentDataModel = {
//             fieldId: optionSelect.fieldId,
//             fieldName: optionSelect.fieldName,
//             fieldValue: option!.Id.toString(),
//             isUpdatable: optionSelect!.isUpdatable,
//             recordId: optionSelect!.recordId,
//         }
//         data.splice(index, 1);
//         data.push(newOption)
//         setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, getDocumentData: data }))
//     }

//     const ChangeHasAttachments = (option: SingleValue<GetRepositoryModel>) => {
//         let optionSelect = newDocumentState.getDocumentData.find((option: GetDocumentDataModel) => option.fieldName === "HasAttachments")!;
//         let index = newDocumentState.getDocumentData.indexOf(optionSelect);
//         let data: GetDocumentDataModel[] = newDocumentState.getDocumentData
//         let newOption: GetDocumentDataModel = {
//             fieldId: optionSelect.fieldId,
//             fieldName: optionSelect.fieldName,
//             fieldValue: option!.Id.toString(),
//             isUpdatable: optionSelect!.isUpdatable,
//             recordId: optionSelect!.recordId,
//         }
//         data.splice(index, 1);
//         data.push(newOption)
//         setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, getDocumentData: data }))
//     }

//     const ChangeSubject = (e: any) => {
//         let optionSelect = newDocumentState.getDocumentData.find((option: GetDocumentDataModel) => option.fieldName === "Subject")!;
//         let index = newDocumentState.getDocumentData.indexOf(optionSelect);
//         let data: GetDocumentDataModel[] = newDocumentState.getDocumentData;
//         let newOption: GetDocumentDataModel = {
//             fieldId: optionSelect.fieldId,
//             fieldName: optionSelect.fieldName,
//             fieldValue: e.target.value,
//             isUpdatable: optionSelect!.isUpdatable,
//             recordId: optionSelect!.recordId,
//         }
//         data.splice(index, 1);
//         data.push(newOption)
//         setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, getDocumentData: data }))
//     }

//     const ChangeSubmitNo = (e: any) => {
//         let optionSelect = newDocumentState.getDocumentData.find((option: GetDocumentDataModel) => option.fieldName === "SubmitNo")!;
//         let index = newDocumentState.getDocumentData.indexOf(optionSelect);
//         let data: GetDocumentDataModel[] = newDocumentState.getDocumentData;
//         let newOption: GetDocumentDataModel = {
//             fieldId: optionSelect.fieldId,
//             fieldName: optionSelect.fieldName,
//             fieldValue: e.target.value,
//             isUpdatable: optionSelect!.isUpdatable,
//             recordId: optionSelect!.recordId,
//         }
//         data.splice(index, 1);
//         data.push(newOption)
//         setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, getDocumentData: data }))
//     }

//     const filterSearchRecievers = async (searchinputValue: string) => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getfieldrepository?searchKey=${searchinputValue}&fieldId=${docTypeId.current == "1" ? 1 : 22}`;
//         let method = "get";
//         let data = {};
//         if (searchinputValue && searchinputValue != null && searchinputValue.trim() != '') {
//             let response: AxiosResponse<Response<GetRecieversModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
//             let options: any = response.data.data.map((item: GetRecieversModel, index: number) => {
//                 return {
//                     value: item.Id,
//                     label: item.Value,
//                     EnValue: item.EnValue,
//                     Level: item.Level,
//                     FaName: item.FaName,
//                     Name: item.Name,
//                 }
//             });
//             return options
//         } else {
//             return []
//         }
//     };

//     const filterSearchRecieversTranscript = async (searchinputValue: string) => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getfieldrepository?searchKey=${searchinputValue}&fieldId=${docTypeId.current == "1" ? 2 : 23}`;
//         let method = "get";
//         let data = {};
//         if (searchinputValue && searchinputValue != null && searchinputValue.trim() != '') {
//             let response: AxiosResponse<Response<GetRecieversModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
//             let options: any = response.data.data.map((item: GetRecieversModel, index: number) => {
//                 return {
//                     value: item.Id,
//                     label: item.Value,
//                     EnValue: item.EnValue,
//                     Level: item.Level,
//                     Name: item.Name,
//                     FaName: item.FaName


//                 }
//             });
//             return options
//         } else {
//             return []
//         }
//     };

//     const loadSearchedRecieversTranscriptOptions = (
//         searchinputValue: string,
//         callback: (options: GetRecieversModel[]) => void
//     ) => {
//         clearTimeout(recieversTimeOut);
//         recieversTimeOut = setTimeout(async () => {
//             callback(await filterSearchRecieversTranscript(searchinputValue));
//         }, 1000);
//     };

//     const loadSearchedRecieversOptions = (
//         searchinputValue: string,
//         callback: (options: GetRecieversModel[]) => void
//     ) => {
//         clearTimeout(recieversTimeOut);
//         recieversTimeOut = setTimeout(async () => {
//             callback(await filterSearchRecievers(searchinputValue));
//         }, 1000);
//     };

//     const GetParaphListTable = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getparaphslist?docHeapId=${docHeapId}`;
//         let method = "get";
//         let data = {};
//         if (docHeapId != null) {
//             let response: AxiosResponse<Response<ParaphTableListModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
//             if (response) {
//                 setLoadings((state) => ({ ...state, loadingParaphList: false }))
//                 if (response.data.data != null, response.data.status == true) {
//                     setNewDocumentState((state) => ({ ...state, paraphTableListItems: response.data.data, paraphLength: response.data.data.length }))
//                 }
//             }
//         }
//     }, [docHeapId])

//     const GetForwardsList = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getforwardslist?docHeapId=${docHeapId}`;
//         let method = "get";
//         let data = {};
//         if (docHeapId != null) {
//             let response: AxiosResponse<Response<ForwardsListModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
//             if (response) {
//                 setLoadings((state) => ({ ...state, loadingForwardsList: false }))
//                 if (response.data.data != null, response.data.status == true) {
//                     setNewDocumentState((state) => ({
//                         ...state, forwardsTableListItems: response.data.data
//                     }))
//                 }
//             }
//         }
//     }, [docHeapId])

//     const DeleteReference = async (reference: ForwardsListModel) => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "حذف ارجاع",
//             text: "آیا از حذف این ارجاع اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes, Delete it!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/deleteforward?forwardSrcId=${reference.id}`;
//                 let method = "delete";
//                 let data = {};
//                 let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
//                 if (response) {
//                     setLoadings((state) => ({ ...state, loadingResponse: false }))
//                     if (response.data.status && response.data.data != 0) {
//                         let index = newDocumentState.forwardsTableListItems.indexOf(newDocumentState.forwardsTableListItems.find(p => p.id == reference.id)!);
//                         if (index !== -1) {
//                             let Array = [...newDocumentState.forwardsTableListItems]
//                             Array.splice(index, 1)
//                             setNewDocumentState((state) => ({ ...state, forwardsTableListItems: [...Array] }))
//                         };
//                     } else {
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             allowOutsideClick: false,
//                             title: "حذف ارجاع",
//                             text: response.data.message,
//                             icon: response.data.status && response.data.data == null ? "warning" : "error",
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                         })
//                     }
//                 }
//             }
//         });
//     }

//     const GetDocType = useCallback(async () => {
//         if (docHeapId != null) {
//             let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdoctype?docHeapId=${docHeapId}`;
//             let method = "get";
//             let data = {};
//             let response: AxiosResponse<Response<GetdocTypeModel>> = await AxiosRequest({ url, method, data, credentials: true });
//             if (response.data.data != null && response.data.status) {
//                 setNewDocumentState((state) => ({ ...state, docTypeState: response.data.data }))
//             }
//         } else {
//             let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdoctypebytypeid?typeId=${docTypeId.current}`
//             let method = "get";
//             let data = {};
//             let response: AxiosResponse<Response<GetdocTypeModel>> = await AxiosRequest({ url, method, data, credentials: true });
//             if (response.data.data != null && response.data.status) {
//                 setNewDocumentState((state) => ({ ...state, docTypeState: response.data.data }))
//             }
//         }
//     }, [docHeapId, docTypeId])

//     const GetImportImage = useCallback(async () => {
//         setLoadings((state) => ({ ...state, loadingResponse: true }))
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getimportimage?docHeapId=${docHeapId}`;
//         let method = "get";
//         let data = {};
//         let response: AxiosResponse<Response<GetImportImageModel>> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response) {
//             setLoadings((state) => ({ ...state, loadingResponse: false }))
//             if (response.data.data && response.data.status == true) {
//                 let blob = b64toBlob({ b64Data: response.data.data.file.substring(response.data.data.file.lastIndexOf(",") + 1), contentType: response.data.data.fileType, sliceSize: 512 });
//                 let blobUrl = URL.createObjectURL(blob);
//                 setNewDocumentState((state) => ({ ...state, importImage: blobUrl }))
//             }
//         }
//     }, [docHeapId])


//     const ViewAttachmentsList = (attachmentOption: ForwardAttachmentsModel[]) => {
//         setNewDocumentState((state) => ({ ...state, attachments: attachmentOption }))
//         handleAttachment()
//     }

//     const ViewReferenceAttachment = async (itemAttachment: ForwardAttachmentsModel) => {
//         handleAttachment()
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/downloadattachment?id=${itemAttachment.attachmentId}&attachmentType=2`;
//         let method = "get";
//         let data = {};
//         let resViewAttachment: AxiosResponse<Response<ViewAttachmentModel>> = await AxiosRequest({ url, method, data, credentials: true })
//         if (resViewAttachment.data.data != null && resViewAttachment.data.status == true) {
//             const base64String = `data:${resViewAttachment.data.data.fileType};base64,${resViewAttachment.data.data.file}`;
//             let blob = b64toBlob({ b64Data: resViewAttachment.data.data.file.substring(resViewAttachment.data.data.file.lastIndexOf(",") + 1), contentType: resViewAttachment.data.data.fileType, sliceSize: 512 });
//             let blobUrl = URL.createObjectURL(blob);
//             setNewDocumentState((state: any) => ({
//                 ...state, attachmentImg: blobUrl,
//                 file: { file: base64String, fileName: resViewAttachment.data.data.fileName, fileType: resViewAttachment.data.data.fileType }
//             }))
//             handleViewAttachment()
//         } else {
//             Swal.fire({
//                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                 allowOutsideClick: false,
//                 title: "Reference attachments!",
//                 text: resViewAttachment.data.message,
//                 icon: (resViewAttachment.data.status == false) ? "error" : "warning",
//                 confirmButtonColor: "#22c55e",
//                 confirmButtonText: "OK!",
//             })
//         }
//     }
//     const [selectedKeywords, setSelectedKeywords] = useState<KeywordModel[]>([])
//     const GetKeywords = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getkeywordslist?docHeapId=${docHeapId}`;
//         let method = "get";
//         let data = {};
//         if (docHeapId != null) {
//             let response: AxiosResponse<Response<KeywordModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
//             if (response) {
//                 setLoadings((state) => ({ ...state, loadingKeywords: false }))
//                 if (response.data.data != null && response.data.data.length > 0) {
//                     setNewDocumentState((state: any) => ({
//                         ...state,
//                         keywords: response.data.data.map((item: KeywordModel, index: number) => {
//                             return {
//                                 docKeword: item.docKeword,
//                                 isAssigned: item.isAssigned,
//                                 label: item.title,
//                                 id: item.id,
//                                 value: item.value,
//                                 title: item.title
//                             }
//                         })
//                     }))
//                     setSelectedKeywords(response.data.data.filter(p => p.isAssigned).map((item: KeywordModel, index: number) => {
//                         return {
//                             docKeword: item.docKeword,
//                             isAssigned: item.isAssigned,
//                             label: item.title,
//                             id: item.id,
//                             value: item.id,
//                             title: item.title
//                         }
//                     }));
//                 }
//             }
//         }
//     }, [docHeapId])

//     const GetRelatedDocTableList = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getRelatedDocslist?docHeapId=${docHeapId}`;
//         let method = "get";
//         let data = {};
//         if (docHeapId != null) {
//             let response: AxiosResponse<Response<RelatedDocListTableModel>> = await AxiosRequest({ url, method, data, credentials: true })
//             if (response) {
//                 setLoadings((state) => ({ ...state, loadingRelatedDocList: false }))
//                 if (response.data.data != null && response.data.status == true) {
//                     setNewDocumentState((state) => ({ ...state, relatedDocsTableListItems: response.data.data }))
//                 }
//             }
//         }
//     }, [docHeapId])
//     const AddRelation = async () => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "افزودن ارتباط",
//             text: "آیاازافزودن ارتباط اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Yes!"
//         })
//             .then(async (result) => {
//                 if (result.isConfirmed) {
//                     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/addrelation`;
//                     let method = "put";
//                     let data = {
//                         "documentId": docHeapId,
//                         "relatedDocHeapId": newDocumentState.selectedRelation!.docHeapId,
//                         "relationTypeId": newDocumentState.relationType!.value,
//                         "isNextRelation": newDocumentState.NextRelation
//                     };
//                     if (newDocumentState.relationType && newDocumentState.selectedRelation!.docHeapId && newDocumentState.selectedRelation!.docTypeId) {
//                         let resAddRelation = await AxiosRequest({ url, method, data, credentials: true })
//                         if (resAddRelation.data.status == true && resAddRelation.data.data != null) {

//                             newDocumentState.relatedDocsTableListItems ? newDocumentState.relatedDocsTableListItems.relatedDocs!.push({
//                                 isNext: newDocumentState.NextRelation,
//                                 createDate: new Date().getTime().toString(),
//                                 docRelationType: resAddRelation.data.data.relationType,
//                                 docTypeId: newDocumentState.selectedRelation!.docTypeId,
//                                 docTypeTitle: resAddRelation.data.data.docTypeTitle,
//                                 id: resAddRelation.data.data.relationId,
//                                 relatedDocHeapId: newDocumentState.selectedRelation!.docHeapId,
//                                 relatedDocIndicator: newDocumentState.selectedRelation!.indicator,
//                             }) : newDocumentState.relatedDocsTableListItems = {
//                                 relatedDocs: [
//                                     {
//                                         isNext: newDocumentState.NextRelation,
//                                         createDate: new Date().getTime().toString(),
//                                         docRelationType: resAddRelation.data.data.relationType,
//                                         docTypeId: newDocumentState.selectedRelation!.docTypeId,
//                                         docTypeTitle: resAddRelation.data.data.docTypeTitle,
//                                         id: resAddRelation.data.data.relationId,
//                                         relatedDocHeapId: newDocumentState.selectedRelation!.docHeapId,
//                                         relatedDocIndicator: newDocumentState.selectedRelation!.indicator,
//                                     }
//                                 ],
//                                 documentIndicator: newDocumentState.getDocumentData.find((item) => item.fieldName === "Indicator")!.fieldValue
//                             }

//                             let newItems = { ...newDocumentState.relatedDocsTableListItems }
//                             setNewDocumentState((state) => ({ ...state, relatedDocsTableListItems: { ...newItems }, relationType: null }))
//                         } else {
//                             Swal.fire({
//                                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                                 allowOutsideClick: false,
//                                 title: "افزودن ارتباط",
//                                 text: resAddRelation.data.message,
//                                 icon: (resAddRelation.data.data == null && resAddRelation.data.status == true) ? "warning" : "error",
//                                 confirmButtonColor: "#22c55e",
//                                 confirmButtonText: "OK!",
//                             })
//                         }
//                     }
//                 }
//             })
//     }
//     const GetAttachmentList = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getattachmentslist?docHeapId=${docHeapId}`;
//         let method = "get";
//         let data = {};
//         if (docHeapId != null) {
//             let response: AxiosResponse<Response<AttachmentsTableListModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
//             if (response) {
//                 setLoadings((state) => ({ ...state, loadingAttachmentList: false }))
//                 if (response.data.data != null, response.data.status == true) {
//                     setNewDocumentState((state) => ({
//                         ...state, attachmentsTableListItems: response.data.data
//                     }))
//                 }
//             }
//         }
//     }, [docHeapId])

//     const GetForwardRecievers = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getforwardrecievers`;
//         let method = "get";
//         let data = {};
//         let response: AxiosResponse<Response<ForwardRecieversModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
//         if (response) {
//             setLoadings((state) => ({
//                 ...state, loadingFowardReceivers: false
//             }))
//             if (response.data.data.length > 0 && response.data.status) {
//                 setNewDocumentState((state: any) => ({
//                     ...state, forwardRecievers: response.data.data.map((item: ForwardRecieversModel, index: number) => {
//                         return {
//                             label: item.title,
//                             value: item.actorId,
//                             level: item.level,
//                             actorId: item.actorId,
//                             title: item.title
//                         }
//                     })
//                 }))
//             }
//         }
//     }, [])

//     const GetGroups = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getgroups`;
//         let method = "get";
//         let data = {};
//         let response: AxiosResponse<Response<GroupManagementModel[]>> =
//             await AxiosRequest({ url, method, data, credentials: true });
//         if (response) {
//             setLoadings((state) => ({ ...state, loadingGroupsList: false }))
//             SetGroups(response.data.data);
//         }
//     }, [])

//     const GetNewDocumentData = useCallback(async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getnewdocument`;
//         let method = "post";
//         let data = {
//             "docTypeId": docTypeId.current,
//             "draftId": id.current,
//             "layoutType": layoutSize.current
//         }
//         let response: AxiosResponse<Response<GetDocumentDataModel[]>> = docTypeId.current !== '15' ? await AxiosRequest({ url, method, data, credentials: true }) : undefined
//         if (response !== undefined && response.data.data && response.data.status) {
//             setNewDocumentState((state) => ({
//                 ...state, getDocumentData: response.data.data,
//                 RecieversTableListItems: [],
//                 CopyRecieversTableListItems: [],
//                 SendersTableListItems: [],
//                 SubjectValue: "",
//                 SubmitNoValue: "",

//             }))
//         }
//     }, [docTypeId, id, layoutSize])

//     const DeleteRelated = (relatedDocId: number) => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "حذف ارتباط",
//             text: "آیا از حذف این ارتباط اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes, Remove relation!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removerelation?id=${relatedDocId}&docHeapId=${docHeapId}`;
//                 let method = "delete";
//                 let data = {};
//                 let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
//                 if (response.data.status && response.data.data != 0) {
//                     let index = newDocumentState.relatedDocsTableListItems!.relatedDocs!.indexOf(newDocumentState.relatedDocsTableListItems!.relatedDocs!.find(p => p.id == relatedDocId)!);
//                     if (index !== -1) {
//                         let Array = { ...newDocumentState.relatedDocsTableListItems }
//                         Array.relatedDocs!.splice(index, 1)
//                         setNewDocumentState((state: any) => ({ ...state, relatedDocsTableListItems: { ...Array } }))
//                     }
//                 } else {
//                     Swal.fire({
//                         background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                         color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                         allowOutsideClick: false,
//                         title: "حذف ارتباط",
//                         text: response.data.message,
//                         icon: !response.data.status ? "error" : "warning",
//                         confirmButtonColor: "#22c55e",
//                         confirmButtonText: "OK!",
//                     });
//                 }
//             }
//         });
//     }

//     const SearchDocument = async (pageNo: number) => {
//         setLoadings((state) => ({ ...state, loadingSearch: true }))
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/SearchDocs?searchKey=${searchValue}&pageNo=${pageNo}&count=10`;
//         let method = "get";
//         let data = {}
//         if (searchValue != null) {
//             let response: AxiosResponse<Response<UnArchiveSraechDocs>> = await AxiosRequest({ url, method, data, credentials: true });
//             if (response) {
//                 setLoadings((state) => ({ ...state, loadingSearch: false }))
//                 setSearchDocTable(response.data.data?.docList);
//                 let paginationCount = Math.ceil(Number(response.data.data?.totalCount) / Number(10));
//                 setCount(paginationCount)
//             }
//         }
//     }

//     function Icon() {
//         return (
//             <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 className="h-full w-full scale-105"
//             >
//                 <path
//                     fillRule="evenodd"
//                     d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
//                     clipRule="evenodd"
//                 />
//             </svg>
//         );
//     }
//     const AddParaph = async () => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "افزودن پاراف",
//             text: "آیا از افزودن پاراف اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Yes, Add paraph!"
//         })
//             .then(async (result) => {
//                 if (result.isConfirmed) {
//                     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/addparaph`;
//                     let method = "put";
//                     let data = {
//                         "docHeapId": docHeapId,
//                         "description": newDocumentState.addParaph
//                     }
//                     if (newDocumentState.addParaph != null) {
//                         let response = await AxiosRequest({ url, method, data, credentials: true })
//                         newDocumentState.paraphTableListItems.push({
//                             id: response.data.data.docParaphId,
//                             paraphDate: response.data.data.date,
//                             writer: response.data.data.writer,
//                             paraphType: response.data.data.paraphType,
//                             desc: response.data.data.desc,
//                             personalDesc: "",
//                             contact: "",
//                             forwardDesc: ""
//                         })
//                         setNewDocumentState((state) => ({ ...state, paraphTableListItems: [...newDocumentState.paraphTableListItems], paraphLength: [...newDocumentState.paraphTableListItems].length }))
//                         if (response.data.status == true && response.data.data != null) {
//                             setNewDocumentState((state) => ({ ...state, addParaph: "" }))
//                         } else {
//                             Swal.fire({
//                                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                                 allowOutsideClick: false,
//                                 title: "افزودن پاراف",
//                                 text: response.data.message,
//                                 icon: (response.data.data == null && response.data.status == true) ? "warning" : "error",
//                                 confirmButtonColor: "#22c55e",
//                                 confirmButtonText: "OK!",
//                             })
//                         }
//                     }
//                 }
//             })
//     };

//     const
//         SaveLetterType = async () => {
//             setLoadings((state) => ({ ...state, loadingResponse: true }))
//             let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savedoc`;
//             let method = "put";
//             newDocumentState.getDocumentData.filter((item: GetDocumentDataModel) => item.fieldName == "Passage")?.map((
//                 option: GetDocumentDataModel
//             ) => {
//                 let passage: PassageModel = JSON.parse(option.fieldValue)
//                 passage.SaveDate = GetCSharpDateType(new Date())
//                 option.fieldValue = JSON.stringify(passage)
//                 let index = newDocumentState.getDocumentData.indexOf(option);
//                 newDocumentState.getDocumentData.splice(index, 1);
//                 newDocumentState.getDocumentData.push(option)
//             })
//             setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, ShowPassageIframe: false }))
//             let data = {
//                 docTypeId: docTypeId.current,
//                 content:
//                     JSON.stringify(newDocumentState.getDocumentData.filter((item: GetDocumentDataModel) => item.isUpdatable).map((option: GetDocumentDataModel) => {
//                         switch (option.fieldName) {
//                             case "MainReceiver":
//                                 return {
//                                     FieldId: option.fieldId,
//                                     Name: option.fieldName,
//                                     RecordId: option.recordId,
//                                     Value: newDocumentState.RecieversTableListItems.map((item: RecieversTableListItem) => (
//                                         {
//                                             Actor: {
//                                                 Level: item.Level,
//                                                 Action: item.ActionId,
//                                                 Id: item.Id
//                                             }
//                                         }
//                                     ))
//                                 }
//                             case "Sender":
//                                 return {
//                                     FieldId: option.fieldId,
//                                     Name: option.fieldName,
//                                     RecordId: option.recordId,
//                                     Value: newDocumentState.SendersTableListItems.map((item: RecieversTableListItem) => (
//                                         {
//                                             Actor: {
//                                                 Level: item.Level,
//                                                 Action: item.ActionId,
//                                                 Id: item.Id
//                                             }
//                                         }
//                                     ))
//                                 }
//                             case "CopyReceiver":
//                                 return {
//                                     FieldId: option.fieldId,
//                                     Name: option.fieldName,
//                                     RecordId: option.recordId,
//                                     Value: newDocumentState.CopyRecieversTableListItems?.map((item: CopyRecieversTableListItem) => (
//                                         {
//                                             Actor: {
//                                                 Level: item.Level,
//                                                 Action: item.ActionId,
//                                                 Id: item.Id,
//                                                 Desc: item.Description
//                                             }
//                                         }
//                                     ))
//                                 }
//                             default:
//                                 return {
//                                     FieldId: option.fieldId,
//                                     Name: option.fieldName,
//                                     RecordId: option.recordId,
//                                     Value: option.fieldValue
//                                 }
//                         }
//                     }
//                     )),
//                 templateId: templateId
//             }
//             let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
//             if (response) {
//                 setLoadings((state) => ({ ...state, loadingResponse: false }))
//                 if (response.data.status && response.data.data) {
//                     setDocHeapId(response.data.data)
//                     router.push(`/Home/NewDocument?doctypeid=${docTypeId.current}&docheapid=${response.data.data}`, { scroll: false });
//                 } else {
//                     Swal.fire({
//                         background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                         color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                         allowOutsideClick: false,
//                         title: "ذخیره مدرک",
//                         text: response.data.message,
//                         icon: response.data.status ? "warning" : "error",
//                         confirmButtonColor: "#22c55e",
//                         confirmButtonText: "OK!",
//                     })
//                 }
//             }
//         }




//     const SaveImportDocument = async () => {

//         setLoadings((state) => ({ ...state, loadingResponse: true }))
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savedoc`;
//         let method = "put";
//         let optionSelect = newDocumentState.getDocumentData.find((option: GetDocumentDataModel) => option.fieldName === "SubmitDate")!;
//         let index = newDocumentState.getDocumentData.indexOf(optionSelect);
//         let dataa: GetDocumentDataModel[] = newDocumentState.getDocumentData;
//         let newOption: GetDocumentDataModel = {
//             fieldId: optionSelect.fieldId,
//             fieldName: optionSelect.fieldName,
//             fieldValue: gregorianDate.IssuedDate,
//             isUpdatable: optionSelect!.isUpdatable,
//             recordId: optionSelect!.recordId,
//         }
//         dataa.splice(index, 1);
//         dataa.push(newOption)
//         setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, getDocumentData: dataa }))

//         let data = {
//             docTypeId: docTypeId.current,
//             content:
//                 JSON.stringify(newDocumentState.getDocumentData.filter((item: GetDocumentDataModel) => item.isUpdatable).map((option: GetDocumentDataModel) => {
//                     switch (option.fieldName) {
//                         case "MainReceiver":
//                             return {
//                                 FieldId: option.fieldId,
//                                 Name: option.fieldName,
//                                 RecordId: option.recordId,
//                                 Value: newDocumentState.RecieversTableListItems.map((item: RecieversTableListItem) => (
//                                     {
//                                         Actor: {
//                                             Level: item.Level,
//                                             Action: item.ActionId,
//                                             Id: item.Id
//                                         }
//                                     }
//                                 ))
//                             }
//                         case "Sender":
//                             return {
//                                 FieldId: option.fieldId,
//                                 Name: option.fieldName,
//                                 RecordId: option.recordId,
//                                 Value: newDocumentState.SendersTableListItems.map((item: RecieversTableListItem) => (
//                                     {
//                                         Actor: {
//                                             Level: item.Level,
//                                             Action: item.ActionId,
//                                             Id: item.Id
//                                         }
//                                     }
//                                 ))
//                             }
//                         case "CopyReceiver":
//                             return {
//                                 FieldId: option.fieldId,
//                                 Name: option.fieldName,
//                                 RecordId: option.recordId,
//                                 Value: newDocumentState.CopyRecieversTableListItems?.map((item: CopyRecieversTableListItem) => (
//                                     {
//                                         Actor: {
//                                             Level: item.Level,
//                                             Action: item.ActionId,
//                                             Id: item.Id,
//                                             Desc: item.Description
//                                         }
//                                     }
//                                 ))
//                             }
//                         default:
//                             return {
//                                 FieldId: option.fieldId,
//                                 Name: option.fieldName,
//                                 RecordId: option.recordId,
//                                 Value: option.fieldValue
//                             }
//                     }
//                 }
//                 )),
//             templateId: templateId
//         }
//         let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response) {
//             setLoadings((state) => ({ ...state, loadingResponse: false }))
//             if (response.data.status && response.data.data) {
//                 setDocHeapId(response.data.data)
//                 router.push(`/Home/NewDocument?doctypeid=${docTypeId.current}&docheapid=${response.data.data}`, { scroll: false });
//             } else {
//                 Swal.fire({
//                     background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                     color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                     allowOutsideClick: false,
//                     title: "ذخیره مدرک",
//                     text: response.data.message,
//                     icon: ((response.data.data == null && response.data.status == true) ? "warning" : "error"),
//                     confirmButtonColor: "#22c55e",
//                     confirmButtonText: "OK!",
//                 })
//             }
//         }
//     }




//     const SaveImportType = async () => {
//         if (newDocumentState.getDocumentData.find((option: GetDocumentDataModel) => option.fieldName === "SubmitNo")!.fieldValue == null ||
//             newDocumentState.getDocumentData.find((option: GetDocumentDataModel) => option.fieldName === "SubmitNo")!.fieldValue.trim() == ""
//         ) {
//             Swal.fire({
//                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                 allowOutsideClick: false,
//                 title: "ذخیره مدرک",
//                 text: "شماره صادره نامه وارده نمیتواند خالی باشد ",
//                 icon: "warning",
//                 confirmButtonColor: "#22c55e",
//                 confirmButtonText: "OK!",
//             })
//             return
//         }
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getissameimportExists?indicatorNumber=${newDocumentState.getDocumentData.find((option: GetDocumentDataModel) => option.fieldName === "SubmitNo")!.fieldValue}`
//         let method = "get";
//         let data = {};
//         let response: AxiosResponse<Response<SaveImportType>> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response.data.status == true && response.data.data != null) {
//             response.data.data.isExists == false ? SaveImportDocument() : handleShowImportType();
//             response.data.data.docsList != null && response.data.data.docsList.length > 0 && setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, ImportTables: response.data.data.docsList }))
//         }
//     }

//     const SaveDocument = async () => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "ذخیره مدرک",
//             text: "آیا از ذخیره تغییرات اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 if (docHeapId) {
//                     setLoadings((state) => ({ ...state, loadingResponse: true }))
//                     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/updatedoc`;
//                     let method = "patch";
//                     if (!newDocumentState.docTypeState!.isImportType) {
//                         newDocumentState.getDocumentData.filter((item: GetDocumentDataModel) => item.fieldName == "Passage")?.map((
//                             option: GetDocumentDataModel
//                         ) => {
//                             let passage: PassageModel = JSON.parse(option.fieldValue)
//                             passage.SaveDate = GetCSharpDateType(new Date())
//                             option.fieldValue = JSON.stringify(passage)
//                             let index = newDocumentState.getDocumentData.indexOf(option);
//                             newDocumentState.getDocumentData.splice(index, 1);
//                             newDocumentState.getDocumentData.push(option)


//                         })
//                         setNewDocumentState((state: NewDocumentStateModels) => ({ ...state, ShowPassageIframe: false }))
//                     }
//                     let data: UpdateDocumentIssued = {
//                         content:
//                             JSON.stringify(newDocumentState.getDocumentData.filter((item: GetDocumentDataModel) => item.isUpdatable).map((option: GetDocumentDataModel) => {
//                                 switch (option.fieldName) {
//                                     case "MainReceiver":
//                                         return {
//                                             FieldId: option.fieldId,
//                                             Name: option.fieldName,
//                                             RecordId: option.recordId,
//                                             Value: newDocumentState.RecieversTableListItems?.map((item: RecieversTableListItem) => (
//                                                 {
//                                                     Actor: {
//                                                         Level: item.Level,
//                                                         Action: item.ActionId,
//                                                         Id: item.Id
//                                                     }
//                                                 }
//                                             ))
//                                         }
//                                     case "Sender":
//                                         return {
//                                             FieldId: option.fieldId,
//                                             Name: option.fieldName,
//                                             RecordId: option.recordId,
//                                             Value: newDocumentState.SendersTableListItems.map((item: RecieversTableListItem) => (
//                                                 {
//                                                     Actor: {
//                                                         Level: item.Level,
//                                                         Action: item.ActionId,
//                                                         Id: item.Id,
//                                                     }
//                                                 }
//                                             ))
//                                         }

//                                     case "CopyReceiver":
//                                         return {
//                                             FieldId: option.fieldId,
//                                             Name: option.fieldName,
//                                             RecordId: option.recordId,
//                                             Value: newDocumentState.CopyRecieversTableListItems?.map((item: CopyRecieversTableListItem) => (
//                                                 {
//                                                     Actor: {
//                                                         Level: item.Level,
//                                                         Action: item.ActionId,
//                                                         Id: item.Id,
//                                                         Desc: item.Description
//                                                     }
//                                                 }
//                                             ))
//                                         }
//                                     default:
//                                         return {
//                                             FieldId: option.fieldId,
//                                             Name: option.fieldName,
//                                             RecordId: option.recordId,
//                                             Value: option.fieldValue
//                                         }
//                                 }
//                             }
//                             )),
//                         docHeapId: docHeapId,
//                         docTypeId: docTypeId.current,
//                         indicator: newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'Indicator')!.fieldValue
//                     }
//                     let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
//                     if (response) {
//                         setLoadings((state) => ({ ...state, loadingResponse: false }))
//                         setNewDocumentState((state) => ({ ...state, ShowPassageIframe: true }))
//                         if (response.data.data == null) {
//                             Swal.fire({
//                                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                                 allowOutsideClick: false,
//                                 title: "ذخیره مدرک",
//                                 text: response.data.message,
//                                 icon: (response.data.status == true) ? "warning" : "error",
//                                 confirmButtonColor: "#22c55e",
//                                 confirmButtonText: "OK!",
//                             })
//                         }
//                     }
//                 }
//                 else {
//                     setNewDocumentState((state) => ({ ...state, ShowPassageIframe: true }))
//                     if (docTypeId.current == '1') {
//                         SaveLetterType()
//                         setNewDocumentState((state) => ({ ...state, ShowPassageIframe: true }))
//                     }
//                     else {
//                         SaveImportType()
//                     }
//                 }
//             }
//         })
//     }

//     const DeleteParaph = async (paraph: ParaphTableListModel) => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "حذف پاراف",
//             text: "آیا از حذف این پاراف اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes, Remove it!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removeparaph?docHeapId=${docHeapId}&ParaphId=${paraph.id}`;
//                 let method = "delete";
//                 let data = {};
//                 let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true });
//                 if (response) {
//                     setLoadings((state) => ({ ...state, loadingResponse: false }))
//                     if (response.data.status && response.data.data != null) {
//                         let index = newDocumentState.paraphTableListItems.indexOf(newDocumentState.paraphTableListItems.find(p => p.id == paraph.id)!);
//                         if (index !== -1) {
//                             let Array = [...newDocumentState.paraphTableListItems]
//                             Array.splice(index, 1)
//                             setNewDocumentState((state) => ({ ...state, paraphTableListItems: [...Array], paraphLength: [...Array].length }))
//                         }
//                     } else {
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             allowOutsideClick: false,
//                             title: "حذف پاراف",
//                             text: response.data.message,
//                             icon: ((response.data.data == null && response.data.status == true) ? "warning" : "error"),
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                         })
//                     }
//                 }
//             }
//         });
//     }

//     const DatePickerInput = (props: any) => {
//         return (
//             <div dir='ltr'>
//                 <Input className="popo rounded-l-none  focus:rounded-l-none" {...props} dir="rtl" type='text' crossOrigin="" size="md" label={props.label} style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" />
//             </div>)
//     }

//     const DatePickerInputMobile = (props: any) => {
//         return (
//             <div dir='ltr'>
//                 <Input className="popo " {...props} dir="rtl" type='text' crossOrigin="" size="md" label={props.label} style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" />
//             </div>)
//     }
//     const setIssuedDate = (unix: any, formatted: any) => {
//         setGregorianDate((prev) => ({ ...prev, IssuedDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss') }))
//         setNewDocumentState((prev) => {
//             const updatedDocumentData = prev.getDocumentData.map(item => item.fieldName === 'SubmitDate' ? { ...item, fieldValue: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss') } : item);
//             return { ...prev, getDocumentData: updatedDocumentData };
//         })
//     }
//     const setChangeDate = (unix: any, formatted: any) => {
//         setGregorianDate((prev) => ({ ...prev, ChangeDate: moment.from(formatted, 'fa', 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss') }))
//     }


//     const DeleteForwardRecieversTableitems = (option: TotalMembar | any) => {
//         let index = newDocumentState.forwardRecieversTableitems.indexOf(option);

//         if (index !== -1) {
//             let Array = [...newDocumentState.forwardRecieversTableitems]
//             Array.splice(index, 1)
//             setNewDocumentState((state) => ({ ...state, forwardRecieversTableitems: [...Array] }))
//         }

//         totalMembers.find((item: TotalMembar) => item.actorId == option.actorId && item.level == option.level)!.isChecked = false;
//         setTotalMembers([...totalMembers])

//         let finalizeSelectedValue = selectRef.current?.getValue();
//         let index1 = finalizeSelectedValue.indexOf(finalizeSelectedValue.find((item: any) => item.actorId == option.actorId && item.level == option.level));
//         if (index1 !== -1) {
//             finalizeSelectedValue.splice(index, 1);
//             selectRef.current.setValue(finalizeSelectedValue)
//         }
//     }

//     const thumbsContainer: any = {
//         display: 'flex',
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         marginTop: 16
//     };
//     const thumb: any = {
//         display: 'inline-flex',
//         borderRadius: 2,
//         border: '1px solid #eaeaea',
//         width: 50,
//         height: 50,
//         padding: 4,
//         boxSizing: 'border-box'
//     };
//     const thumbInner: any = {
//         display: 'flex',
//         minWidth: 0,
//         overflow: 'hidden'
//     };
//     const img: any = {
//         display: 'block',
//         width: 'auto',
//         height: '100%'
//     };

//     const UploadFileDocument = (file: FilesModel) => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "آپلود مدرک",
//             text: "آیا از آپلود مدرک اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#21af5a",
//             cancelButtonColor: "#b53535",
//             confirmButtonText: "Yes,Upload it!"
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/uploadattachment`;
//                 let method = "put";
//                 let data = {
//                     "file": await ReadFileAsync(file.file),
//                     "type": file.file.type,
//                     "title": file.file.name,
//                     "desc": file.fileDesc,
//                     "docHeapId": docHeapId,
//                     "docTypeId": docTypeId.current
//                 }
//                 let response: AxiosResponse<Response<UploadImageResponse>> = await AxiosRequest({ url, method, data, credentials: true })
//                 if (response) {
//                     setLoadings((state) => ({ ...state, loadingResponse: false }));
//                     if (response.data.data != null && response.data.status == true) {
//                         if (newDocumentState.attachmentsTableListItems.length > 0) {
//                             newDocumentState.attachmentsTableListItems.push({
//                                 attachmentType: {
//                                     description: "فایل مستندات پیوستی به نامه اصلی",
//                                     id: 3,
//                                     title: "پیوست"
//                                 },
//                                 attachmentTypeId: 3,
//                                 createDate: response.data.data.createDate,
//                                 creator: response.data.data.creator,
//                                 description: file.fileDesc,
//                                 fileTitle: response.data.data.title,
//                                 fileType: response.data.data.fileType,
//                                 id: response.data.data.id,
//                                 lockDate: null,
//                                 name: response.data.data.title,
//                             })
//                         } else {
//                             newDocumentState.attachmentsTableListItems = [{
//                                 attachmentType: {
//                                     description: "فایل مستندات پیوستی به نامه اصلی",
//                                     id: 3,
//                                     title: "پیوست"
//                                 },
//                                 attachmentTypeId: 3,
//                                 createDate: response.data.data.createDate,
//                                 creator: response.data.data.creator,
//                                 description: file.fileDesc,
//                                 fileTitle: response.data.data.title,
//                                 fileType: response.data.data.fileType,
//                                 id: response.data.data.id,
//                                 lockDate: null,
//                                 name: response.data.data.title,
//                             }]
//                         }
//                         setNewDocumentState((state) => ({ ...state, attachmentsTableListItems: [...newDocumentState.attachmentsTableListItems] }))
//                     } else {
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             allowOutsideClick: false,
//                             title: "آپلود مدرک",
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                             text: response.data.message,
//                             icon: ((response.data.data == null && response.data.status == true) ? "warning" : "error"),

//                         });
//                     }
//                 }
//             }
//         })
//     }

//     const UploadImageImport = (image: FilesModel, index: number) => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "آپلود تصویر",
//             text: "آیا از آپلود تصویر اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#21af5a",
//             cancelButtonColor: "#b53535",
//             confirmButtonText: "Yes,Upload it!"
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingImageImport: true }))
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savemainimage`;
//                 let method = "put";
//                 let data: DropzoneFileModel = {
//                     file: await ReadFileAsync(image.file),
//                     desc: image.fileDesc != undefined ? image.fileDesc : "",
//                     title: image.file.name,
//                     type: image.file.type,
//                     docHeapId: searchParams.get('docheapid')!,
//                     docTypeId: docTypeId.current!
//                 };
//                 let response: AxiosResponse<Response<UploadImageResponse>> = await AxiosRequest({ url, method, data, credentials: true })
//                 if (response) {
//                     setLoadings((state) => ({ ...state, loadingImageImport: false }))
//                     if (response.data.data != null && response.data.status == true) {
//                         let blob = b64toBlob({ b64Data: data.file.substring(data.file.lastIndexOf(",") + 1), contentType: data.type, sliceSize: 512 });
//                         let blobUrl = URL.createObjectURL(blob);
//                         setImages(images.filter((file: FilesModel) => images.indexOf(file) !== index))
//                         setNewDocumentState((state) => ({ ...state, importImage: blobUrl }))
//                     } else {
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             allowOutsideClick: false,
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                             title: "آپلود تصویر",
//                             text: response.data.message,
//                             icon: ((response.data.data == null && response.data.status == true) ? "warning" : "error"),
//                         });
//                     }
//                 }
//             }
//         })
//     }

//     const DeleteAttachment = async (attachmentOption: AttachmentsTableListModel) => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "حذف ضمیمه",
//             text: "آیا از حذف این ضمیمه اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes, Remove it!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removeappendix?docHeapId=${docHeapId}&id=${attachmentOption.id}&docTypeId=${docTypeId.current}`;
//                 let method = "delete";
//                 let data = {};
//                 let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
//                 if (response) {
//                     setLoadings((state) => ({ ...state, loadingResponse: false }))
//                     if (response.data.status && response.data.data) {
//                         let index = newDocumentState.attachmentsTableListItems.indexOf(newDocumentState.attachmentsTableListItems.find(p => p.id == attachmentOption.id)!);
//                         if (index !== -1) {
//                             let Array = [...newDocumentState.attachmentsTableListItems]
//                             Array.splice(index, 1)
//                             setNewDocumentState((state) => ({ ...state, attachmentsTableListItems: [...Array] }))
//                         }
//                     } else {
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             allowOutsideClick: false,
//                             title: "حذف ضمیمه",
//                             text: response.data.message,
//                             icon: ((response.data.data == null && response.data.status == true) ? "warning" : "error"),
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                         })
//                     }
//                 }
//             }
//         });
//     }

//     const SetFileDesciption = (option: FilesModel, e: any) => {
//         const updatedFiles = files.map((item: FilesModel) => {
//             if (item.preview === option.preview) {
//                 return { ...item, fileDesc: e.target ? e.target.value : " " }
//             }
//             return item;
//         });
//         setFiles(updatedFiles);
//     };

//     const filesList = files.map((file: FilesModel, index: number) => (
//         <tr className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`} key={"file" + index}>
//             <td className='p-1 w-[70px]' style={thumb} key={file.file.name}>
//                 <div style={thumbInner}>
//                     <figure className='h-[50px] w-[50px]'>
//                         <Image
//                             width={100}
//                             height={100}
//                             src={file.preview}
//                             style={img}
//                             onLoad={() => { URL.revokeObjectURL(file.preview) }}
//                             alt="putFile"
//                         />
//                     </figure>
//                 </div>
//             </td>
//             <td className='p-1'>
//                 <Typography
//                     dir='ltr'
//                     variant="small"
//                     color="blue-gray"
//                     className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
//                     {`${file.file.name}-${file.file.size}`}bytes
//                 </Typography>
//             </td>
//             <td dir='ltr' className='p-1'>
//                 <Input
//                     dir="rtl"
//                     onBlur={(e: any) => SetFileDesciption(file, e)}
//                     className='whitespace-nowrap'
//                     style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color='blue-gray' crossOrigin="" type='text' label='توضیحات' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//             </td>
//             <td style={{ width: '4%' }} className='p-1'>
//                 <div className='container-fluid mx-auto p-0.5'>
//                     <div className="flex flex-row justify-evenly">
//                         <Button
//                             style={{ background: color?.color }} size="sm"
//                             className="p-1 mx-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <DeleteIcon
//                                 onClick={() => { DeleteReceiverAttachment(index) }}
//                                 fontSize='small'
//                                 className='p-1'
//                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                             />
//                         </Button>

//                     </div>
//                 </div>
//             </td>
//         </tr>
//     ))

//     const filesListAppendices = filesAppendices.map((file: FilesModel, index: number) => (
//         <tr className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`} key={"file" + index}>
//             <td className='p-1 w-[70px]' style={thumb} key={file.file.name}>
//                 <div style={thumbInner}>
//                     <figure className='h-[50px] w-[50px]'>
//                         <Image
//                             width={100}
//                             height={100}
//                             src={file.preview}
//                             style={img}
//                             onLoad={() => { URL.revokeObjectURL(file.preview) }}
//                             alt="putFile"
//                         />
//                     </figure>
//                 </div>
//             </td>
//             <td className='p-1'>
//                 <Typography
//                     dir='ltr'
//                     variant="small"
//                     color="blue-gray"
//                     className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
//                     {`${file.file.name}-${file.file.size}`}bytes
//                 </Typography>
//             </td>
//             <td dir='ltr' className='p-1'>
//                 <Input dir='rtl' onBlur={(e: any) => { filesAppendices.splice(index, 1, { ...file, desc: e.target.value }), setFilesAppendices([...filesAppendices]); }}
//                     className='whitespace-nowrap '
//                     style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color='blue-gray' crossOrigin="" type='text' label='توضیحات' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//             </td>
//             <td style={{ width: '7%' }} className='p-1'>
//                 <div className='container-fluid mx-auto p-0.5'>
//                     <div className="flex flex-row justify-evenly">
//                         <Button onClick={() => DeleteAppendices(index)}
//                             style={{ background: color?.color }} size="sm"
//                             className="p-1 mx-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <DeleteIcon
//                                 fontSize='small'
//                                 className='p-1'
//                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                             />
//                         </Button>
//                         <Button onClick={() => { UploadFileDocument(file), setFilesAppendices(filesAppendices.filter((item: FilesModel) => item !== file)); }}
//                             style={{ background: color?.color }} size="sm"
//                             className="p-1 mx-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <CloudUploadIcon
//                                 fontSize='small'
//                                 className='p-1'
//                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                             />
//                         </Button>
//                     </div>
//                 </div>
//             </td>
//         </tr>
//     ));

//     const Images = images.map((file: FilesModel, index: number) => (
//         <tr className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75 py-1`} key={"file" + index}>
//             <td className='p-1 w-[70px]' style={thumb} key={file.file.name}>
//                 <div style={thumbInner}>
//                     <figure>
//                         <Image
//                             width={100}
//                             height={100}
//                             src={file.preview}
//                             style={img}
//                             onLoad={() => { URL.revokeObjectURL(file.preview) }}
//                             alt="putFile"
//                         />
//                     </figure>
//                 </div>
//             </td>
//             <td className='p-1'>
//                 <Typography
//                     dir='ltr'
//                     variant="small"
//                     color="blue-gray"
//                     className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
//                     {`${file.file.name}-${file.file.size}`}bytes
//                 </Typography>
//             </td>
//             <td dir='ltr' className='p-1'>
//                 <Input
//                     onBlur={(e: any) => SetFileDesciption(file, e)}
//                     className='whitespace-nowrap'
//                     style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color='blue-gray' crossOrigin="" type='text' label='توضیحات' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//             </td>
//             <td style={{ width: '7%' }} className='p-1'>
//                 <div className='container-fluid mx-auto p-0.5'>
//                     <div className="flex flex-row justify-evenly">
//                         <Button
//                             style={{ background: color?.color }} size="sm"
//                             className="p-1 mx-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <DeleteIcon onClick={() => DeleteImageImport(index)}
//                                 fontSize='small'
//                                 className='p-1'
//                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                             />
//                         </Button>
//                         <Button
//                             style={{ background: color?.color }} size="sm"
//                             className="p-1 mx-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <CloudUploadIcon onClick={() => UploadImageImport(file, index)} fontSize='small'
//                                 className='p-1'
//                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                             />
//                         </Button>
//                     </div>
//                 </div>
//             </td>
//         </tr>
//     ))

//     const DeleteReceiverAttachment = (rowIndex: number) => {
//         setFiles(files.filter((file: FilesModel) => files.indexOf(file) !== rowIndex))
//     }
//     const DeleteAppendices = (rowIndex: number) => {
//         setFilesAppendices(filesAppendices.filter((file: FilesModel) => filesAppendices.indexOf(file) !== rowIndex))
//     }

//     const DeleteSenderItem = (rowIndex: number) => {
//         let data = newDocumentState.SendersTableListItems;
//         let newData = data.splice(rowIndex, 1);
//         setNewDocumentState((state) => ({ ...state }))
//     }
//     const DeleteReceiverItem = (rowIndex: number) => {
//         let data = newDocumentState.RecieversTableListItems
//         let newData = data.splice(rowIndex, 1);
//         setNewDocumentState((state) => ({ ...state }))
//     }
//     const DeleteCopyReceiverItem = (copyReceiverIndex: number) => {
//         let data = newDocumentState.CopyRecieversTableListItems
//         let newData = data.splice(copyReceiverIndex, 1);
//         setNewDocumentState((state) => ({ ...state }))
//     }


//     const DeleteImageImport = (index: number) => {
//         setImages(images.filter((file: FilesModel) => images.indexOf(file) !== index))
//     }

//     async function ReadFileAsync(file: any): Promise<string> {
//         return new Promise((resolve, reject) => {
//             var fr = new FileReader();
//             fr.onload = async () => {
//                 resolve(fr.result as string);
//             };
//             fr.onerror = async (error) => { };
//             fr.readAsDataURL(file);
//         });
//     }

//     const ForwardDocument = async () => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "ارجاع مدرک",
//             text: "آیا از ارجاع این مدرک اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingImageImport: true }))
//                 let promises = files.map(async (file: any) => {
//                     return {
//                         "attachment": await ReadFileAsync(file.file),
//                         "description": file.fileDesc,
//                         "fileTitle": file.file.name,
//                         "type": file.file.type
//                     }
//                 })
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/forward`;
//                 let method = "put";
//                 let data = {
//                     "forwardDoc": {
//                         "receivers":
//                             newDocumentState.forwardRecieversTableitems.map((receivers: ForwardRecieversModel) => {
//                                 return {
//                                     "receiverActorId": receivers.actorId,
//                                     "receiveTypeId": receivers.receiveTypeId,
//                                     "personalDesc": receivers.desc,
//                                     "isHidden": receivers.isHidden,
//                                 }
//                             })
//                         ,
//                         "forwardDesc": forwardDocumentDesc,
//                         "files": (await Promise.all(promises))
//                         ,
//                         "docHeapId": docHeapId,
//                         "parentForwardTargetId": forwardParentId.current != null ? forwardParentId.current : 0,
//                         "subject": newDocumentState.getDocumentData.length > 0 ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'Subject')!.fieldValue : "",
//                         "docIndicator": newDocumentState.getDocumentData.length > 0 ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'Indicator')!.fieldValue : "",
//                     },
//                     "recipientTitles":
//                         newDocumentState.forwardRecieversTableitems.map((receiver: ForwardRecieversModel) => {
//                             return receiver.title
//                         })
//                 };
//                 let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true });
//                 if (response) {
//                     setLoadings((state) => ({ ...state, loadingImageImport: true }))
//                     if (response.data.data && response.data.status) {
//                         setFiles([])
//                         if (newDocumentState.forwardsTableListItems.length > 0) {
//                             newDocumentState.forwardsTableListItems.push({
//                                 createDate: response.data.data.createDate,
//                                 desc: response.data.data.desc,
//                                 forwardAttachments: response.data.data.forwardAttachments,
//                                 forwardTarget: response.data.data.forwardTarget,
//                                 fromActorId: response.data.data.fromActorId,
//                                 id: response.data.data.id,
//                                 senderFaName: response.data.data.senderFaName,
//                                 senderFaRoleName: response.data.data.senderFaRoleName,
//                                 senderName: response.data.data.senderName,
//                                 senderRoleName: response.data.data.senderRoleName
//                             })
//                             handleOpenForward()
//                         }
//                         else {
//                             newDocumentState.forwardsTableListItems = [{
//                                 createDate: response.data.data.createDate,
//                                 desc: response.data.data.desc,
//                                 forwardAttachments: response.data.data.forwardAttachments,
//                                 forwardTarget: response.data.data.forwardTarget,
//                                 fromActorId: response.data.data.fromActorId,
//                                 id: response.data.data.id,
//                                 senderFaName: response.data.data.senderFaName,
//                                 senderFaRoleName: response.data.data.senderFaRoleName,
//                                 senderName: response.data.data.senderName,
//                                 senderRoleName: response.data.data.senderRoleName
//                             }]

//                             handleOpenForward()
//                         }
//                         setForwardDocumentDesc("")
//                         setFiles([])
//                         setNewDocumentState((state) => ({ ...state, forwardsTableListItems: [...newDocumentState.forwardsTableListItems], forwardRecieversTableitems: [] }))
//                     } else {
//                         handleOpenForward()
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             allowOutsideClick: false,
//                             title: "ارجاع مدرک",
//                             text: response.data.message,
//                             icon: (response.data.data == null && response.data.status == true) ? "warning" : "error",
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                         })
//                     }
//                 }
//             }
//         })
//     };

//     const ForwardConfirmDocument = async () => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: " تائید و ارجاع مدرک",
//             text: "آیا از تائید و ارجاع این مدرک اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let promises = files.map(async (file: any) => {
//                     return {
//                         "attachment": await ReadFileAsync(file.file),
//                         "description": file.fileDesc,
//                         "fileTitle": file.file.name,
//                         "type": file.file.type
//                     }
//                 })
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/forwardconfirm`;
//                 let method = "Put";
//                 let data = {
//                     "receivers":
//                         newDocumentState.forwardRecieversTableitems.map((receivers: ForwardRecieversModel) => {
//                             return {
//                                 "receiverActorId": receivers.actorId,
//                                 "receiveTypeId": receivers.receiveTypeId,
//                                 "personalDesc": receivers.desc,
//                                 "isHidden": receivers.isHidden,
//                             }
//                         })
//                     ,
//                     "forwardDesc": forwardDocumentDesc,
//                     "files": (await Promise.all(promises))
//                     ,
//                     "docHeapId": Number(docHeapId),
//                     "parentForwardTargetId": Number(forwardParentId.current),
//                     "subject": newDocumentState.getDocumentData.length > 0 ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'Subject')!.fieldValue : "",
//                     "docIndicator": newDocumentState.getDocumentData.length > 0 ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'Indicator')!.fieldValue : "",
//                 };
//                 let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true });
//                 if (response) {
//                     setLoadings((state) => ({ ...state, loadingResponse: false }))
//                     if (response.data.data && response.data.status) {
//                         setFiles([])
//                         setNewDocumentState((state) => ({ ...state, forwardRecieversTableitems: [] }))
//                         setForwardDocumentDesc("")
//                         setFiles([])
//                         handleOpenConfirmForward()
//                     } else {
//                         handleOpenConfirmForward()
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             allowOutsideClick: false,
//                             title: " تائید و ارجاع مدرک",
//                             text: response.data.message,
//                             icon: (response.data.data == null && response.data.status == true) ? "warning" : "error",
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                         })
//                     }
//                 }
//             }
//         });
//     }

//     const GetToolbars = async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdoctoolbars?docTypeId=${docTypeId.current}`;
//         let method = 'get';
//         let data = {};
//         let response: AxiosResponse<Response<ResponseGetToolbarsModel>> = await AxiosRequest({ url, method, data, credentials: true });
//         if (response.data.data, response.data.status) {
//             setNewDocumentState((state) => ({
//                 ...state, toolbars: {
//                     archive: response.data.data?.archive,
//                     confirm: response.data.data?.confirm,
//                     confirmForward: response.data.data?.confirmForward,
//                     deny: response.data.data?.deny,
//                     forward: response.data.data?.forward,
//                     forwardTree: response.data.data?.forwardTree,
//                     pdfExport: response.data.data?.pdfExport,
//                     print: response.data.data?.print,
//                     return: response.data.data?.return,
//                     revock: response.data.data?.revock,
//                     save: response.data.data?.save,
//                     saveDraft: response.data.data?.saveDraft,
//                     secretariateExport: response.data.data?.secretariateExport
//                 }
//             }))
//         }
//     }

//     const GetLayoutSize = async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdocLayouts?docTypeId=${docTypeId.current}`;
//         let method = "get";
//         let data = {};
//         let response: AxiosResponse<Response<LayoutsModel[]>> = await AxiosRequest({ url, method, data, credentials: true });
//         if (response.data.data != null && response.data.data.length > 0) {
//             setNewDocumentState((state: any) => ({
//                 ...state, layoutSize: response.data.data.map((item: LayoutsModel) => {
//                     return {
//                         label: item.name,
//                         value: item.id,
//                         path: item.path,
//                         isMain: item.isMain
//                     }
//                 }), setFormat: response.data.data.find((item: LayoutsModel) => item.value == Number(templateId))
//             }))
//         }
//     }

//     const GetRecieveTypes = async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getreceivetypes?doctypeid=${docTypeId.current}`;
//         let method = "get";
//         let data = {};
//         let response: AxiosResponse<Response<RecieveTypes[]>> = await AxiosRequest({ url, method, data, credentials: true });
//         if (response.data.data != null && response.data.data.length > 0 && response.data.status) {
//             setNewDocumentState((state: any) => ({
//                 ...state, recieveTypes: response.data.data.map((item: RecieveTypes, index: number) => {
//                     return {
//                         label: item.faTitle,
//                         value: item.id,
//                         isDefault: item.isDefault,
//                         title: item.title
//                     }
//                 })
//             }))
//         }
//     }

//     const UnCheckedOption = (option: TotalMembar) => {
//         totalMembers.find((item) => item.id == option.id)!.isChecked = !option.isChecked;
//         setTotalMembers([...totalMembers])
//     }
//     const selectRef = useRef(null) as any;
//     const MainReciever = useRef(null) as any;
//     const Sender = useRef(null) as any;
//     const CopyReciever = useRef(null) as any;


//     const [menuIsOpen, setMenuIsOpen] = React.useState<boolean>();
//     const onInputChange = (
//         inputValue: string,
//         { action, prevInputValue }: InputActionMeta
//     ) => {
//         if (action === 'input-change') return inputValue;
//         if (action === 'menu-close') {
//             if (prevInputValue) setMenuIsOpen(true);
//             else setMenuIsOpen(undefined);
//         }
//         return prevInputValue;
//     };
//     const handleAddKeywordSelected = (label: string) => {
//         let isSaved = selectedKeywords.find(p => p.label == label)
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: isSaved == null ? "افزودن کلیدواژه" : "حذف کلیدواژه",
//             text: isSaved == null ? "آیا از افزودن این کلیدواژه اطمینان دارید!؟" : "آیا از حذف این کلیدواژه اطمینان دارید!؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let url = isSaved == null ? `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savekeyword` : `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removekeyword`
//                 let method = isSaved == null ? "put" : "delete";
//                 let data = isSaved == null ? {
//                     "keyword": label,
//                     "docHeapId": docHeapId,
//                     "docTypeId": docTypeId.current
//                 } : {
//                     "id": isSaved.docKeword!.id,
//                     "docHeapId": docHeapId,
//                     "docTypeId": docTypeId.current
//                 }
//                 if (isSaved == null) {
//                     let response: AxiosResponse<Response<ResponseSaveKeywords>> = await AxiosRequest({ url, method, data, credentials: true });
//                     if (response) {
//                         setLoadings((state) => ({ ...state, loadingResponse: false }))
//                         if (response.data.status && response.data.data) {
//                             let existedKeyword = newDocumentState.keywords.find((item: KeywordModel) => item.id == response.data.data.keywordId)
//                             if (existedKeyword) {
//                                 existedKeyword.isAssigned = true
//                                 let values: KeywordModel[] = newDocumentState.keywords.filter((p: KeywordModel) => p.id != existedKeyword!.id)
//                                 setNewDocumentState((state) => ({ ...state, keywords: values }))
//                                 let selecteds = selectedKeywords;
//                                 selecteds.push({
//                                     docKeword: {
//                                         id: response.data.data.docKeywordId,
//                                         docHeap: null,
//                                         docHeapId: Number(docHeapId!),
//                                         frequentlyUsingKeyWord: null,
//                                         frequentlyUsingKeyWordId: 0,
//                                         isDelete: false,
//                                         deleteDate: "",
//                                         deleteActorId: 0,
//                                         deleteActor: null,
//                                         actorId: 0,
//                                         actor: "",
//                                         createDate: ""
//                                     },
//                                     id: existedKeyword.id,
//                                     isAssigned: true,
//                                     label: existedKeyword.title,
//                                     title: existedKeyword.title,
//                                     value: existedKeyword.id
//                                 });
//                                 setSelectedKeywords(selecteds);
//                             } else {
//                                 newDocumentState.keywords.push({
//                                     docKeword: null,
//                                     id: response.data.data.keywordId,
//                                     isAssigned: true,
//                                     label: response.data.data.title,
//                                     title: response.data.data.title,
//                                     value: response.data.data.keywordId
//                                 })
//                                 setSelectedKeywords((state: KeywordModel[]) => ([...state, {
//                                     docKeword: null,
//                                     id: response.data.data.keywordId,
//                                     isAssigned: true,
//                                     label: response.data.data.title,
//                                     title: response.data.data.title,
//                                     value: response.data.data.keywordId
//                                 }]))
//                             }
//                         } else {
//                             Swal.fire({
//                                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                                 allowOutsideClick: false,
//                                 title: "افزودن کلیدواژه",
//                                 text: response.data.message,
//                                 icon: response.data.status == true && response.data.data == null ? "warning" : "error",
//                                 confirmButtonColor: "#22c55e",
//                                 confirmButtonText: "OK!",
//                             })
//                         }
//                     }
//                 } else {
//                     let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
//                     if (response) {
//                         setLoadings((state) => ({ ...state, loadingResponse: false }))
//                         if (response.data.data, response.data.status) {
//                             let x = newDocumentState.keywords.find(((p: KeywordModel) => p == isSaved))
//                             if (x) {
//                                 x.isAssigned = false
//                             }
//                             setNewDocumentState((state) => ({ ...state, keywords: [...newDocumentState.keywords] }))
//                             setSelectedKeywords(selectedKeywords.filter((item: KeywordModel) => item != isSaved))
//                         } else {
//                             Swal.fire({
//                                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                                 allowOutsideClick: false,
//                                 title: "حذف کلیدواژه",
//                                 text: response.data.message,
//                                 icon: (response.data.status && !response.data.data) ? "warning" : "error",
//                                 confirmButtonColor: "#22c55e",
//                                 confirmButtonText: "OK!",
//                             })
//                         }
//                     }
//                 }
//             }
//         });
//     }

//     const [forwardDocumentDesc, setForwardDocumentDesc] = useState<string>("");
//     const setForwardDesc = (e: any) => {
//         setForwardDocumentDesc(e.target.value)
//     }

//     const handleAddForwardReceivers = () => {
//         let selectedValues: SelectedValuToForward[] = selectRef.current?.getValue();
//         let tableItems: ForwardRecieversModel[] = newDocumentState.forwardRecieversTableitems ?? [];
//         totalMembers.filter((item) => item.isChecked == true).map((item) => {
//             if (tableItems.find(i => i.actorId == item.actorId && i.level == item.level) === undefined) {
//                 tableItems.push({
//                     actorId: item.actorId,
//                     title: item.actorName,
//                     desc: item.desc,
//                     isHidden: item.isHidden,
//                     receiveTypeId: item.receiveTypeId,
//                     level: item.level,
//                     IsGroup: true,
//                     isChecked: item.isChecked!
//                 }
//                 )
//             }
//         })

//         selectedValues.map((item: SelectedValuToForward) => {
//             if (tableItems.find(i => i.actorId == item.actorId && i.level == item.level) === undefined) {
//                 tableItems.push({
//                     actorId: item.actorId,
//                     desc: "",
//                     isHidden: false,
//                     level: item.level,
//                     receiveTypeId: 1,
//                     title: item.title,
//                     IsGroup: false,
//                     isChecked: true
//                 })
//             }
//         })
//         setNewDocumentState((state) => ({ ...state, forwardRecieversTableitems: tableItems.filter((item) => item.isChecked == true) }))
//     }

//     const handleAddReciever = () => {
//         let selectedValues = MainReciever.current?.getValue();
//         let tableItems = newDocumentState.RecieversTableListItems ?? [];
//         selectedValues.map((item: RecieversTableListItem, index: number) => {
//             if (tableItems.find(i => i.Id == item.value && i.Level == item.Level) === undefined) {
//                 tableItems.push({
//                     ActionName: (item.ActionName) ?? 'جهت اقدام',
//                     Description: '',
//                     ActionId: (item.ActionId) ?? 1,
//                     EnValue: item.EnValue,
//                     Id: item.value,
//                     Level: item.Level,
//                     Value: item.label,
//                     label: item.label,
//                     value: item.value
//                 })
//             }
//         })
//         let values = newDocumentState.getDocumentData;
//         let value = values.find((p: GetDocumentDataModel) => p.fieldName == "MainReceiver");
//         let index = values.indexOf(value!);
//         values.splice(index, 1);
//         values.push({
//             isUpdatable: value!.isUpdatable,
//             fieldId: value!.fieldId,
//             fieldName: value!.fieldName,
//             recordId: value!.recordId,
//             fieldValue: JSON.stringify({
//                 Selected: newDocumentState.RecieversTableListItems.map((i: RecieversTableListItem) => (
//                     {
//                         Actor: {
//                             EnValue: i.EnValue,
//                             Level: i.Level,
//                             Id: i.Id,
//                             Value: i.Value,
//                             ActionName: i.ActionName,
//                             Description: i.Description,
//                             ActionId: i.ActionId
//                         }
//                     }
//                 ))
//             }),
//         });
//         setNewDocumentState((state: NewDocumentStateModels) => ({
//             ...state,
//             getDocumentData: values, RecieversTableListItems: tableItems
//         }));
//     }
//     const handleAddSender = () => {
//         let selectedValues = Sender.current?.getValue();
//         let tableItems = newDocumentState.SendersTableListItems ?? [];
//         selectedValues.map((item: GetSendersModel, index: number) => {
//             if (tableItems.find(i => i.Id == item.value && i.Level == item.Level) === undefined) {
//                 tableItems.push({
//                     ActionName: '',
//                     ActionId: item.ActionId,
//                     EnValue: item.EnValue,
//                     Description: '',
//                     Id: item.value,
//                     label: item.label,
//                     Level: item.Level,
//                     Value: item.label,
//                     value: item.value
//                 })
//             }
//         })
//         let values = newDocumentState.getDocumentData;
//         let value = values.find((p: GetDocumentDataModel) => p.fieldName == "Sender");
//         let index = values.indexOf(value!);
//         values.splice(index, 1);
//         values.push({
//             isUpdatable: value!.isUpdatable,
//             fieldId: value!.fieldId,
//             fieldName: value!.fieldName,
//             recordId: value!.recordId,
//             fieldValue: JSON.stringify({
//                 Selected: newDocumentState.SendersTableListItems.map((i: GetSendersModel) => (
//                     {
//                         Actor: {
//                             EnValue: i.EnValue,
//                             Level: i.Level,
//                             Id: i.Id,
//                             Value: i.Value,
//                             ActionName: i.ActionName,
//                             Description: i.Description,
//                             ActionId: i.ActionId
//                         }
//                     }
//                 ))
//             }),
//         });

//         setNewDocumentState((state: NewDocumentStateModels) => ({
//             ...state,
//             getDocumentData: values, SendersTableListItems: tableItems
//         }));
//     }

//     const handleAddCopyReciever = () => {
//         let selectedValues = CopyReciever.current?.getValue();
//         let tableItems = newDocumentState.CopyRecieversTableListItems ?? [];
//         selectedValues.map((item: CopyRecieversTableListItem, index: number) => {
//             // if (tableItems.length > 0) {
//             if (tableItems.find(i => i.Id == item.value && i.Level == item.Level) === undefined) {
//                 newDocumentState.CopyRecieversTableListItems.push({
//                     ActionName: item.ActionName ?? "جهت استحضار",
//                     Description: item.Description ?? "",
//                     ActionId: (item.ActionId) ?? 5,
//                     EnValue: item.EnValue,
//                     Id: item.value,
//                     Level: item.Level,
//                     Value: item.label,
//                     label: item.label,
//                     value: item.value
//                 })
//             }
//         })
//         let values = newDocumentState.getDocumentData;
//         let value = values.find((p: GetDocumentDataModel) => p.fieldName == "CopyReceiver");
//         let index = values.indexOf(value!);
//         values.splice(index, 1);
//         values.push({
//             isUpdatable: value!.isUpdatable,
//             fieldId: value!.fieldId,
//             fieldName: value!.fieldName,
//             recordId: value!.recordId,
//             fieldValue: JSON.stringify({
//                 Selected: newDocumentState.CopyRecieversTableListItems.map((i: CopyRecieversTableListItem) => (
//                     {
//                         Actor: {
//                             EnValue: i.EnValue,
//                             Level: i.Level,
//                             Id: i.Id,
//                             Value: i.Value,
//                             ActionName: i.ActionName,
//                             Desc: i.Description,
//                             ActionId: i.ActionId
//                         }
//                     }
//                 ))
//             }),
//         });
//         setNewDocumentState((state: NewDocumentStateModels) => ({
//             ...state,
//             getDocumentData: values, CopyRecieversTableListItems: tableItems
//         }));
//     };
//     const SetAllChecked = (isChecked: boolean) => {
//         totalMembers.map((receiver: TotalMembar) => {
//             return (receiver.isChecked = isChecked)
//         })
//         setTotalMembers([...totalMembers])
//     }

//     const SubmitDocument = () => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "ثبت صادره مدرک",
//             text: "آیااز ثبت صادره این مدرک اطمینان دارید؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/submitdocument`;
//                 let method = "post";
//                 let data = {
//                     "docHeapId": docHeapId,
//                     "submitDate": gregorianDate.ChangeDate != '' ? moment(gregorianDate.ChangeDate, 'YYYY/MM/DD HH:mm:ss').format("YYYY/MM/DD HH:mm:ss") : moment(new Date(), 'YYYY/MM/DD HH:mm:ss').format("YYYY/MM/DD HH:mm:ss")
//                 };
//                 let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true });
//                 if (response) {
//                     setGregorianDate((state: DateInputs) => ({ ...state, ChangeDate: '' }))
//                     setLoadings((state) => ({ ...state, loadingResponse: false }))
//                     if (response.data.data == '' || response.data.data == null) {
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             allowOutsideClick: false,
//                             title: "ثبت صادره مدرک",
//                             text: response.data.message,
//                             icon: !response.data.status ? "error" : "warning",
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                         })
//                     }
//                 }
//             }
//         });
//     };

//     const GetDocumentResult = useCallback(async () => {
//         setNewDocumentState((state: any) => ({ ...state, documentResult: '' }))
//         if (newDocumentState.templateId != 0 && activate == 'documentResult') {
//             setLoadings((state) => ({ ...state, loadingGetDocumentresult: true }))
//             let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getpdf`;
//             let method = "post";
//             let data = {
//                 "docHeapId": docHeapId,
//                 "docLayoutId": newDocumentState.templateId,
//                 "docTypeId": 1
//             }
//             let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true })
//             if (response) {
//                 setLoadings((state) => ({ ...state, loadingGetDocumentresult: false }))
//                 if (response.data.data != null && response.data.status) {
//                     setNewDocumentState((state: any) => ({ ...state, documentResult: response.data.data }))
//                 } else {
//                     Swal.fire({
//                         background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                         color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                         allowOutsideClick: false,
//                         title: "مشاهده تصویر مدرک",
//                         text: response.data.message,
//                         icon: (response.data.status == false) ? "error" : "warning",
//                         confirmButtonColor: "#22c55e",
//                         confirmButtonText: "OK!",
//                     });
//                 }
//             } else {
//                 setLoadings((state) => ({ ...state, loadingGetDocumentresult: false }))
//                 Swal.fire({
//                     background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                     color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                     allowOutsideClick: false,
//                     title: "مشاهده تصویر مدرک",
//                     text: 'لطفا از درستی موارد خواسته شده اطمینان حاصل فرمایید',
//                     icon: "warning",
//                     confirmButtonColor: "#22c55e",
//                     confirmButtonText: "OK"
//                 })
//             }
//         }
//     }, [activate, docHeapId, newDocumentState.templateId, themeMode?.stateMode])

//     useEffect(() => {
//         docTypeId.current == '1' && docHeapId && GetDocumentResult()
//     }, [GetDocumentResult, docHeapId])

//     const GetPdf = async () => {
//         setLoadings((state) => ({ ...state, loadingGetDocumentresult: true }))
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getpdf`;
//         let method = "post";
//         let data = {
//             "docHeapId": docHeapId,
//             "docLayoutId": newDocumentState.setFormat,
//             "docTypeId": docTypeId.current
//         }
//         if (newDocumentState.templateId && docTypeId.current && docHeapId) {
//             let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true })
//             if (response) {
//                 setLoadings((state) => ({ ...state, loadingGetDocumentresult: false }))
//                 if (response.data.data != null && response.data.status) {
//                     setNewDocumentState((state: any) => ({ ...state, pdfString: response.data.data }))
//                 } else {
//                     Swal.fire({
//                         background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                         color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                         allowOutsideClick: false,
//                         title: "مشاهده مدرک",
//                         text: response.data.message,
//                         icon: (response.data.status == false) ? "error" : "warning",
//                         confirmButtonColor: "#22c55e",
//                         confirmButtonText: "OK!",
//                     });
//                 }
//             } else {
//                 setLoadings((state) => ({ ...state, loadingGetDocumentresult: false }))
//                 Swal.fire({
//                     background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                     color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                     allowOutsideClick: false,
//                     title: "مشاهده مدرک",
//                     text: 'لطفا از درستی موارد خواسته شده اطمینان حاصل فرمایید',
//                     icon: "warning",
//                     confirmButtonColor: "#22c55e",
//                     confirmButtonText: "OK"
//                 })
//             }
//         }
//     }



//     const GetPrint = async () => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getpdf`;
//         let method = "post";
//         let data = {
//             "docHeapId": docHeapId,
//             "docLayoutId": newDocumentState.setFormat,
//             "docTypeId": docTypeId.current
//         }
//         let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true });
//         if (response) {
//             if (response.data.data != '' && response.data.status) {
//                 setNewDocumentState((state: any) => ({ ...state, printString: response.data.data }))
//                 handleOpenPrintDocument()
//                 handle()
//             } else {
//                 Swal.fire({
//                     background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                     color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                     allowOutsideClick: false,
//                     title: "چاپ مدرک",
//                     text: response.data.message,
//                     icon: (response.data.status == false) ? "error" : "warning",
//                     confirmButtonColor: "#22c55e",
//                     confirmButtonText: "OK!",
//                 })
//             }
//         }
//         else {
//             Swal.fire({
//                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                 allowOutsideClick: false,
//                 title: "چاپ مدرک",
//                 text: 'لطفا از درستی موارد خواسته شده اطمینان حاصل فرمایید',
//                 icon: "warning",
//                 confirmButtonColor: "#22c55e",
//                 confirmButtonText: "OK"
//             })
//         }
//     }

//     const DeleteSignersName = (signerOption: SignersModel) => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "حذف امضاء کننده",
//             text: "آیا از حذف امضاء کننده اطمینان دارید؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/unsigndocument`;
//                 let method = "Delete";
//                 let data = {
//                     "signatureId": signerOption.Id,
//                     "docHeapId": docHeapId,
//                     "docTypeId": docTypeId.current
//                 }
//                 let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
//                 if (response) {
//                     setLoadings((state) => ({ ...state, loadingResponse: false }))
//                     if (response.data.status && response.data.data) {
//                         let index = newDocumentState.SignersName!.indexOf(newDocumentState.SignersName!.find(p => p.Id == signerOption.Id)!);
//                         if (index !== -1) {
//                             let Array = [...newDocumentState.SignersName!]
//                             Array.splice(index, 1)
//                             setNewDocumentState((state: any) => ({ ...state, SignersName: [...Array] }))
//                         }
//                     } else {
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             allowOutsideClick: false,
//                             title: "حذف امضاء کننده",
//                             text: response.data.message,
//                             icon: response.data.status && response.data.data == null ? "warning" : "error",
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                         })
//                     }
//                 }
//             }
//         });
//     }

//     const SignDocument = () => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "امضاء مدرک",
//             text: "آیا از امضاء مدرک اطمینان دارید؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/signdocument`;
//                 let method = "put";
//                 let data = {
//                     "docHeapId": docHeapId,
//                     "docTypeId": docTypeId.current,
//                     "forwardSourceId": Number(forwardParentId.current)
//                 }
//                 let response: AxiosResponse<Response<SignDocumentModel>> = await AxiosRequest({ url, method, data, credentials: true })
//                 if (response) {
//                     setLoadings((state) => ({ ...state, loadingResponse: false }))
//                     if (response.data.status && response.data.data) {
//                         newDocumentState.SignersName ? newDocumentState.SignersName!.push({
//                             Id: response.data.data.signatureId,
//                             SignDate: response.data.data.signDate,
//                             SignerName: response.data.data.signer
//                         })
//                             : newDocumentState.SignersName = [{

//                                 Id: response.data.data.signatureId,
//                                 SignDate: response.data.data.signDate,
//                                 SignerName: response.data.data.signer
//                             }
//                             ],
//                             setNewDocumentState((state) => ({ ...state, SignersName: [...newDocumentState.SignersName] }))
//                     } else {
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             allowOutsideClick: false,
//                             title: "امضاء مدرک",
//                             text: response.data.message,
//                             icon: (response.data.status && response.data.data == null) ? "warning" : 'error',
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                         })
//                     }
//                 }
//             }
//         });
//     };

//     const SetRecieverIsHidden = (option: ForwardRecieversModel) => {
//         const item: ForwardRecieversModel = newDocumentState.forwardRecieversTableitems.find((item: ForwardRecieversModel) => item.actorId == option.actorId && item.level == option.level)!;
//         if (item) {
//             item.isHidden = !item.isHidden;
//         }
//         setNewDocumentState((state) => ({ ...state }))
//     }

//     const GetCSharpDateType = (date: Date) => {
//         var day = date.getDate();
//         var month = date.getMonth() + 1;
//         var year = date.getFullYear();
//         var hour = date.getHours();
//         var minute = date.getMinutes();
//         var second = date.getSeconds();
//         var secondfloat = date.getMilliseconds();
//         return year + "-" + month + "-" + day + " " + hour + ':' + minute + ':' + second + '.' + secondfloat;
//     }


//     const DownloadAllAttschments = () => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "دانود ضمائم",
//             text: "آیا از دانلود تمام ضمائم اطمینان دارید؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let allSelected = newDocumentState.attachmentsTableListItems.filter((p: AttachmentsTableListModel) => p.isActive)
//                 if (allSelected.length > 0) {
//                     allSelected.map(async (p: AttachmentsTableListModel) => {
//                         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/downloadattachment?id=${p.id}&attachmentType=3`;
//                         let method = "get";
//                         let data = {};
//                         let response: AxiosResponse<Response<FileModel>> = await AxiosRequest({ url, method, data, credentials: true });
//                         if (response) {
//                             setLoadings((state) => ({ ...state, loadingResponse: false }))
//                             if (response.data.status && response.data.data) {
//                                 let blob = b64toBlob({ b64Data: response.data.data.file.substring(response.data.data.file.lastIndexOf(",") + 1), contentType: response.data.data.fileType, sliceSize: 512 });
//                                 let blobUrl = URL.createObjectURL(blob);
//                                 var fileDownload = require('js-file-download');
//                                 fileDownload(blob, response.data.data.fileName);
//                             } else {
//                                 Swal.fire({
//                                     background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                                     color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                                     allowOutsideClick: false,
//                                     title: "دانود ضمائم",
//                                     text: response.data.message,
//                                     icon: response.data.status && response.data.data == null ? "warning" : 'error',
//                                     confirmButtonColor: "#22c55e",
//                                     confirmButtonText: "OK!",
//                                 })
//                             }
//                         }
//                     })
//                 } else {
//                     setLoadings((state) => ({ ...state, loadingResponse: false }))
//                     Swal.fire({
//                         background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                         color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                         allowOutsideClick: false,
//                         title: "دانود ضمائم",
//                         text: 'ضمائم مورد نظر را انتخاب کرده و سپس تلاش کنید ',
//                         icon: "warning",
//                         confirmButtonColor: "#22c55e",
//                         confirmButtonText: "OK"
//                     })
//                 }
//             }
//         })
//     }

//     const UploadAllAttschments = () => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "آپلود ضمائم",
//             text: "آیا از آپلود تمام ضمائم اطمینان دارید؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             confirmButtonText: "yes, upload all attachments!",
//             cancelButtonColor: "#d33",
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 if (filesAppendices.length > 0) {
//                     const UploadFiles: any[] = [];
//                     for (let item of filesAppendices) {
//                         let x = {
//                             "file": await ReadFileAsync(item.file),
//                             "type": item.file.type,
//                             "title": item.file.name,
//                             "desc": item.desc,
//                         }
//                         UploadFiles.push(x);
//                     }
//                     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/UploadListOfAttachment`;
//                     let method = "put";
//                     let data = {
//                         "docHeapId": docHeapId,
//                         "docTypeId": docTypeId.current,
//                         "files": UploadFiles
//                     }
//                     let response: AxiosResponse<Response<ResponseUploadAllAttachments[]>> = await AxiosRequest({ url, method, data, credentials: true });
//                     if (response) {
//                         setLoadings((state) => ({ ...state, loadingResponse: false }))
//                         if (response.data.status && response.data.data.length > 0) {
//                             setFilesAppendices([])
//                             let newItems = response.data.data.map((file: ResponseUploadAllAttachments) => {
//                                 return {
//                                     id: file.id,
//                                     attachmentType: {
//                                         id: file.id,
//                                         title: file.title,
//                                         description: file.desc
//                                     },
//                                     attachmentTypeId: file.id,
//                                     name: file.title,
//                                     fileTitle: file.fileName,
//                                     description: file.desc,
//                                     createDate: file.createDate,
//                                     creator: file.creator,
//                                     fileType: file.fileType,
//                                     lockDate: '',
//                                     isActive: false
//                                 }
//                             })
//                             setNewDocumentState((state) => ({ ...state, attachmentsTableListItems: [...state.attachmentsTableListItems, ...newItems] }))
//                         } else {
//                             Swal.fire({
//                                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                                 allowOutsideClick: false,
//                                 title: "دانود ضمائم",
//                                 text: response.data.message,
//                                 icon: response.data.status && response.data.data == null ? "warning" : 'error',
//                                 confirmButtonColor: "#22c55e",
//                                 confirmButtonText: "OK!",
//                             })
//                         }
//                     }
//                 } else {
//                     setLoadings((state) => ({ ...state, loadingResponse: false }))
//                     Swal.fire({
//                         background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                         color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                         allowOutsideClick: false,
//                         title: "دانود ضمائم",
//                         text: 'ضمائم مورد نظر را انتخاب کرده و سپس تلاش کنید ',
//                         icon: "warning",
//                         confirmButtonColor: "#22c55e",
//                         confirmButtonText: "OK"
//                     })
//                 }
//             }
//         })
//     }


//     const DownloadFile = (fileOption: AttachmentsTableListModel) => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "دانلود ضمیمه",
//             text: "آیا از دانلود این مدرک اطمینان دارید؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Yes!"
//         })
//             .then(async (result) => {
//                 if (result.isConfirmed) {
//                     setLoadings((state) => ({ ...state, loadingResponse: true }))
//                     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/downloadattachment?id=${fileOption.id}&attachmentType=3`;
//                     let method = "get";
//                     let data = {};
//                     let response: AxiosResponse<Response<FileModel>> = await AxiosRequest({ url, method, data, credentials: true })
//                     if (response) {
//                         setLoadings((state) => ({ ...state, loadingResponse: false }))
//                         if (typeof window !== 'undefined' && response.data.data != null && response.data.status) {
//                             let blob = b64toBlob({ b64Data: response.data.data.file.substring(response.data.data.file.lastIndexOf(",") + 1), contentType: response.data.data.fileType, sliceSize: 512 });
//                             let blobUrl = URL.createObjectURL(blob);
//                             setNewDocumentState((state: NewDocumentStateModels) => ({
//                                 ...state, attachmentImg: blobUrl,
//                                 file: {
//                                     file: response.data.data.file,
//                                     fileName: response.data.data.fileName,
//                                     fileType: response.data.data.fileType
//                                 }
//                             }))
//                             var fileDownload = require('js-file-download');
//                             fileDownload(blob, response.data.data.fileName);
//                         } else {
//                             Swal.fire({
//                                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                                 allowOutsideClick: false,
//                                 title: "دانود ضمیمه",
//                                 text: response.data.message,
//                                 icon: (response.data.status == false) ? "error" : "warning",
//                                 confirmButtonColor: "#22c55e",
//                                 confirmButtonText: "OK!",
//                             })
//                         }
//                     }
//                 }
//             })
//     }

//     const SetDocumentState = (stateId: number) => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "پاسخ مدرک",
//             text: "آیا از پاسخ این مدرک اطمینان دارید؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Yes!"
//         })
//             .then(async (result) => {
//                 if (result.isConfirmed) {
//                     setLoadings((state) => ({ ...state, loadingResponse: true }))
//                     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/setdocumentstate`;
//                     let method = "patch";
//                     let data = {
//                         "forwardTargetId": forwardParentId.current,
//                         "stateId": stateId,
//                         "desc": description,
//                         "docheapId": docHeapId
//                     };
//                     let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
//                     if (response) {
//                         setLoadings((state) => ({ ...state, loadingResponse: false }))
//                         if (response.data.data == null) {
//                             Swal.fire({
//                                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                                 allowOutsideClick: false,
//                                 title: "پاسخ مدرک",
//                                 text: response.data.message,
//                                 icon: (response.data.data == 0 || response.data.data == null) && response.data.status ? "warning" : 'error',
//                                 confirmButtonColor: "#22c55e",
//                                 confirmButtonText: "OK!",
//                             })
//                         }

//                     }
//                 }
//             })
//     }

//     const ViewFile = async (fileOption: AttachmentsTableListModel) => {
//         let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/downloadattachment?id=${fileOption.id}&attachmentType=3`;
//         let method = "get";
//         let data = {};
//         let response: AxiosResponse<Response<FileModel>> = await AxiosRequest({ url, method, data, credentials: true })
//         if (response.data.data != null && response.data.status == true) {
//             handleViewAttachment()
//             let blob = b64toBlob({ b64Data: response.data.data.file.substring(response.data.data.file.lastIndexOf(",") + 1), contentType: response.data.data.fileType, sliceSize: 512 });
//             let blobUrl = URL.createObjectURL(blob);
//             setNewDocumentState((state) => ({
//                 ...state, attachmentImg: blobUrl,
//                 file: {
//                     file: response.data.data.file,
//                     fileName: response.data.data.fileName,
//                     fileType: response.data.data.fileType
//                 }
//             }))
//         } else {
//             Swal.fire({
//                 background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                 color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                 allowOutsideClick: false,
//                 title: "مشاهده مدرک",
//                 text: response.data.message,
//                 icon: (response.data.status == false) ? "error" : "warning",
//                 confirmButtonColor: "#22c55e",
//                 confirmButtonText: "OK!",
//             })
//         }
//     }

//     const RevokedDocument = () => {
//         Swal.fire({
//             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//             allowOutsideClick: false,
//             title: "ابطال نامه",
//             text: "آیا از ابطال این مدرک اطمینان دارید؟",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Yes!"
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoadings((state) => ({ ...state, loadingResponse: true }))
//                 let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/revokedocument`;
//                 let method = "delete";
//                 let data = {
//                     "DocTypeId": docTypeId.current, "DocHeapId": docHeapId, "RevokedDesc": revokedDesc
//                 };
//                 let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
//                 if (response) {
//                     setLoadings((state) => ({ ...state, loadingResponse: false }))
//                     if (response.data.data == 0 || response.data.data == null) {
//                         Swal.fire({
//                             background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
//                             color: themeMode?.stateMode == true ? "white" : "#463b2f",
//                             allowOutsideClick: false,
//                             title: "ابطال نامه",
//                             text: response.data.message,
//                             icon: !response.data.status ? "error" : "warning",
//                             confirmButtonColor: "#22c55e",
//                             confirmButtonText: "OK!",
//                         })
//                     }
//                     setNewDocumentState((state) => ({ ...state }))
//                     setRevokedDesc("")
//                 }
//             }
//         })

//     }

//     useEffect(() => {
//         setLoadings((state) => ({
//             ...state,
//             loadingGetDocumentData: true
//         }))
//     }, [])


    // const GetDocumentData = useCallback(async () => {
    //     setLoadings((state) => ({
    //         ...state, loadingPriority: true, loadingClassification: true,
    //         loadingHasAttachment: true, loadingFowardReceivers: true, loadingFlowType: true
    //     }))
    //     if (searchParams.get('docheapid')) {
    //         (async () => {
    //             setLoadings((state) => ({
    //                 ...state, loadingKeywords: true, loadingParaphList: true, loadingForwardsList: true,
    //                 loadingAttachmentList: true, loadingRelatedDocList: true, loadingSignersList: true,
    //             }))
    //             let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdocumentdata?docheapId=${searchParams.get('docheapid')}&docTypeId=${docTypeId.current}`;
    //             let method = "post";
    //             let data = {}
    //             if (searchParams.get('docheapid')) {
    //                 let response: AxiosResponse<Response<GetDocumentDataModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
    //                 if (response) {
    //                     setLoadings((state) => ({
    //                         ...state,
    //                         loadingSignersList: false,
    //                         loadingGetDocumentData: false,
    //                     }))
    //                     if (response.data.data.length > 0 && response.data.status == true) {
    //                         if (searchParams.get('forwardparentid')) {
    //                             let setStateUrl = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/setforwardseen`;
    //                             let setStateMethod = "Patch";
    //                             let setStateData = { "targetId": forwardParentId.current, "docHeapId": docHeapId };
    //                             var setSeenResult: AxiosResponse<Response<GetDocumentDataModel[]>> = await AxiosRequest({ url: setStateUrl, method: setStateMethod, data: setStateData, credentials: true });
    //                             if (!setSeenResult.status) {
    //                                 Swal.fire({
    //                                     background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
    //                                     color: themeMode?.stateMode == true ? "white" : "#463b2f",
    //                                     title: "ثبت وضعیت مشاهده مدرک",
    //                                     text: "ثبت وضعیت مشاهده مدرک به حالت مشاهده شده با مشکل مواجه شد",
    //                                     icon: "error",
    //                                     allowOutsideClick: false,
    //                                     confirmButtonColor: "#22c55e",
    //                                     confirmButtonText: "OK!",
    //                                 })
    //                             }
    //                         }
    //                         setNewDocumentState((state: NewDocumentStateModels) => ({
    //                             ...state, getDocumentData: response.data.data,
    //                             RecieversTableListItems: JSON.parse(response.data.data.find((item: GetDocumentDataModel) => item.fieldName === "MainReceiver")!.fieldValue).Selected.map((i: any) => { return i.Actor }),
    //                             CopyRecieversTableListItems: JSON.parse(response.data.data.find((item: GetDocumentDataModel) => item.fieldName === "CopyReceiver")!.fieldValue)!.Selected.length > 0 ? JSON.parse(response.data.data.find((item: GetDocumentDataModel) => item.fieldName === "CopyReceiver")!.fieldValue).Selected.map((i: any) => { return i.Actor }) : [],
    //                             SignersName: response.data.data.find((item: GetDocumentDataModel) => item.fieldName === "signers-container") && JSON.parse(response.data.data.find((item: GetDocumentDataModel) => item.fieldName === "signers-container")!.fieldValue),
    //                             SendersTableListItems: response.data.data.find((item: GetDocumentDataModel) => item.fieldName === "Sender") ? JSON.parse(response.data.data.find((item: GetDocumentDataModel) => item.fieldName === "Sender")!.fieldValue).Selected.map((i: any) => { return i.Actor }) : [],
    //                             SubjectValue: response.data.data.find((item: GetDocumentDataModel) => item.fieldName === "Subject")!.fieldValue!,
    //                             SubmitNoValue: response.data.data.find((item: GetDocumentDataModel) => item.fieldName === "SubmitNo")?.fieldValue!,
    //                             templateId: Number(response.data.data.find((item: GetDocumentDataModel) => item.fieldName === "TemplateId")?.fieldValue!),
    //                         }));
    //                     }
    //                 }
    //             }
    //         })();
    //         GetParaphListTable();
    //         GetForwardsList();
    //         GetKeywords();
    //         GetAttachmentList();
    //         GetRelatedDocTableList();
    //     }
    //     else {
    //         setLoadings((state) => ({ ...state, loadingGetDocumentData: false }))
    //         GetNewDocumentData();
    //     }
    //     GetDocType();
    //     GetPriorityItems();
    //     GetHasAttachments();
    //     GetClassification();
    //     GetForwardRecievers();
    //     GetGroups();
    //     if (docTypeId.current == '4') {
    //         GetImportImage()
    //     } else {
    //         GetFlowTypeItems();
    //     }
    // }, [GetClassification, GetAttachmentList, GetDocType, GetFlowTypeItems, GetForwardRecievers, GetForwardsList, GetGroups, GetHasAttachments, GetImportImage, GetKeywords, GetNewDocumentData,
    //     GetParaphListTable, GetPriorityItems, GetRelatedDocTableList, docTypeId, searchParams, themeMode?.stateMode, docHeapId]
    // )

//     useEffect(() => {
//         setNewDocumentState(InitialsState);
//         setDocHeapId(searchParams.get('docheapid'));
//         docTypeId.current = searchParams.get('doctypeid');
//         forwardParentId.current = searchParams.get('forwardparentid');
//         layoutSize.current = searchParams.get('layoutsize');
//         id.current = searchParams.get('id');
//         parentForwardTargetId.current = searchParams.get('parentforwardtaretid');
//         GetDocumentData();
//         GetLayoutSize();
//         GetRecieveTypes();
//         GetToolbars();
//     }, [searchParams, InitialsState, GetDocumentData])

//     const [handlePrint, setHandlePrint] = useState<boolean>(false);
//     const handle = () => { setHandlePrint(!handlePrint) }

//     return (
//         <>
//             {/* {loadings.loadingGetDocumentData == true && <Loading />} */}
//             {(loadings.loadingGetDocumentData == true || loadings.loadingResponse == true && activate !== 'documentResult') && <ResLoading />}
//             {(loadings.loadingGetDocumentresult == true && activate == 'documentResult') && <ResLoading />}
//             <Dialog className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={handlePrint} handler={handle} size='xxl' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>ِ
//                 <DialogBody className='overflow-y-scroll' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                     <Print props={newDocumentState.printString} />
//                 </DialogBody>
//                 <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                     <section className='flex grow justify-end'>
//                         <ButtonComp onClick={handle}>بستن</ButtonComp>
//                     </section>
//                 </DialogFooter>
//             </Dialog>
//             <Tabs value={docTypeId.current == '1' && docHeapId ? 'documentResult' : 'documentInfo'} className="p-2/4 m-3 h-full">
//                 <TabsHeader
//                     dir='rtl'
//                     className={`${themeMode?.stateMode ? 'contentDark' : 'contentLight'}  flex relative z-[100] flex-col md:flex-row`}
//                     indicatorProps={{
//                         style: {
//                             background: color?.color,
//                         },
//                         className: `shadow !text-gray-900`,
//                     }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
//                     {(docTypeId.current == '1' && docHeapId) && (<Tab className='min-w-max' value="documentResult" onClick={() => { setActivate("documentResult"), GetDocumentResult(); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                         <Typography variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`} style={{ color: `${activate == "documentResult" ? "white" : ""}` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>تصویر مدرک</Typography>
//                     </Tab>)}
//                     <Tab className='min-w-max' value="documentInfo" onClick={() => setActivate("documentInfo")} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                         <Typography variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`} style={{ color: `${activate == "documentInfo" ? "white" : ""}` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>اطلاعات مدرک</Typography>
//                     </Tab>
//                     {docTypeId.current != '15' && <Tab className='min-w-max' value="recievers" onClick={() => setActivate("recievers")} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                         <Typography variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`} style={{ color: `${activate == "recievers" ? "white" : ""}` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>گیرندگان</Typography>
//                     </Tab>}
//                     {docHeapId != null && docTypeId.current != '15' && (
//                         <Tab className='min-w-max' value="paraph" onClick={() => setActivate("paraph")} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                             <Typography variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} flex justify-around text-[13px]`} style={{ color: `${activate == "paraph" ? "white" : ""}` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                 پاراف ها
//                                 <ListItemSuffix placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                     <Chip
//                                         value={newDocumentState.paraphLength}
//                                         variant="ghost"
//                                         size="sm"
//                                         style={{ color: `${activate == "paraph" ? "white" : color?.color}` }}
//                                         className={`rounded-full ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                     />
//                                 </ListItemSuffix>
//                             </Typography>

//                         </Tab>)}
//                     {(docTypeId.current == '4') && (<Tab className='min-w-max' value="sender" onClick={() => setActivate("sender")} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                         <Typography variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`} style={{ color: `${activate == "sender" ? "white" : ""}` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>فرستنده</Typography>
//                     </Tab>)}
//                     {docHeapId != null && docTypeId.current !== '15' && (<Tab className='min-w-max' value="appendices" onClick={() => { setActivate("appendices"), setPara("appendices"); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                         <Typography variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`} style={{ color: `${activate == "appendices" ? "white" : ""}` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>ضمائم</Typography>
//                     </Tab>)}
//                     {docHeapId != null && docTypeId.current !== '15' && (<Tab className='min-w-max' value="relatedDocument" onClick={() => setActivate("relatedDocument")} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                         <Typography variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`} style={{ color: `${activate == "relatedDocument" ? "white" : ""}` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>کلیدواژه و اسناد مرتبط</Typography>
//                     </Tab>)}
//                     {docHeapId != null && docTypeId.current !== '15' && (<Tab className='min-w-max' value="references" onClick={() => setActivate("references")} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                         <Typography variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`} style={{ color: `${activate == "references" ? "white" : ""}` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>ارجاعات</Typography>
//                     </Tab>)}
//                     {(docTypeId.current == '1') && (<Tab className='min-w-fit' value="content" onClick={() => setActivate("content")} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                         <Typography variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`} style={{ color: `${activate == "content" ? "white" : ""}` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>متن نامه</Typography>
//                     </Tab>)}
//                     {newDocumentState.docTypeState?.isImportType == true && docTypeId.current == "4" && docHeapId && (<Tab value="letterImage" onClick={() => { setActivate("letterImage"), setPara("letterImage"); }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                         <Typography variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`} style={{ color: `${activate == "letterImage" ? "white" : ""}` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>تصویر نامه</Typography>
//                     </Tab>)}
//                 </TabsHeader>
//                 <div className='relative z-[101] w-full flex flex-col items-end justify-between md:flex-row md:items-center md:justify-around my-3'>
//                     <div dir='rtl' className='w-[100%] overflow-x-scroll whitespace-nowrap flex flex-row justify-start'>
//                         <Tooltip content="ذخیره" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 onClick={() => SaveDocument()}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
//                                 <SaveIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                                 />
//                             </Button>
//                         </Tooltip>
//                         {newDocumentState.toolbars != null && newDocumentState.toolbars!.forwardTree && docHeapId && (<Tooltip content="درخت ارجاعات" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 onClick={handleOpenTreeModal}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                 style={{ background: color?.color }}
//                             >
//                                 <AccountTreeIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                                 />
//                             </Button>
//                         </Tooltip>)}
//                         {newDocumentState.toolbars != null && newDocumentState.toolbars!.forward && docHeapId && (<Tooltip content="ارجاع" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                 onClick={() => { setToolbarTab("forward"), handleOpenForward() }}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 style={{ background: color?.color }}
//                             >
//                                 <ReplyIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                                 />
//                             </Button>
//                         </Tooltip>)}
//                         {newDocumentState.toolbars != null && newDocumentState.toolbars!.confirmForward && forwardParentId.current != '0' && forwardParentId.current != null && docHeapId && (<Tooltip content="تائید و ارجاع" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                 onClick={() => { setToolbarTab("confirmForward"), handleOpenConfirmForward() }}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 style={{ background: color?.color }}
//                             >
//                                 <ReplyAllIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                                 />
//                             </Button>
//                         </Tooltip>)}
//                         {newDocumentState.toolbars != null && newDocumentState.toolbars!.confirm && forwardParentId.current != '0' && forwardParentId.current != null && docHeapId && (<Tooltip content="تائید مدرک" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                 onClick={handleOpenConfirmDocument}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 style={{ background: color?.color }}
//                             >
//                                 <CheckCircleIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                                 />
//                             </Button>
//                         </Tooltip>)}
//                         {newDocumentState.toolbars != null && newDocumentState.toolbars!.deny && forwardParentId.current != '0' && forwardParentId.current != null && docHeapId && (<Tooltip content="رد مدرک" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                 onClick={handleOpenRejectDocument}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 style={{ background: color?.color }}
//                             >
//                                 <CancelIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                             </Button>
//                         </Tooltip>)}
//                         {newDocumentState.toolbars != null && newDocumentState.toolbars!.return && forwardParentId.current != '0' && forwardParentId.current != null && docHeapId && (<Tooltip content="بازگشت به فرستنده" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                 onClick={handleOpenReturnedtoSender}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 style={{ background: color?.color }}
//                             >
//                                 <RedoIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                             </Button>
//                         </Tooltip>)}
//                         {newDocumentState.toolbars != null && newDocumentState.toolbars!.pdfExport && docHeapId && (<Tooltip content="Pdf خروجی" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                 onClick={handleOpenPdfDocument}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 style={{ background: color?.color }}
//                             >
//                                 <PictureAsPdfIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                             </Button>
//                         </Tooltip>)}
//                         {newDocumentState.toolbars != null && newDocumentState.toolbars!.print && docHeapId && (<Tooltip content="چاپ" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                 onClick={handleOpenPrintDocument}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 style={{ background: color?.color }}
//                             >
//                                 <PrintIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                             </Button>
//                         </Tooltip>)}
//                         {newDocumentState.toolbars != null && newDocumentState.toolbars!.archive && docHeapId &&
//                             (<Tooltip content="بایگانی" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                                 <Button
//                                     placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                     onClick={handleShowArchiveFoldersHierarchy}
//                                     size="sm"
//                                     className="p-1 mx-1"
//                                     style={{ background: color?.color }}
//                                 >
//                                     <InventoryIcon
//                                         fontSize='small'
//                                         className='p-1'
//                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                 </Button>
//                             </Tooltip>)}
//                         {newDocumentState.toolbars != null && newDocumentState.toolbars!.secretariateExport && docHeapId && (<Tooltip content="ثبت صادره مدرک" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                 onClick={handleOpenIssuedModal}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 style={{ background: color?.color }}
//                             >
//                                 <ExitToAppIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                             </Button>
//                         </Tooltip>)}
//                         {docTypeId.current == '1' && (<Tooltip content="ذخیره پیش نویس" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                 onClick={handleOpenSavedraft}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 style={{ background: color?.color }}
//                             >
//                                 <ContentCopyIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                             </Button>
//                         </Tooltip>)}
//                         {docHeapId && (<Tooltip content="ابطال نامه" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                             <Button
//                                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                 onClick={handleOpenRecovedDocument}
//                                 size="sm"
//                                 className="p-1 mx-1"
//                                 style={{ background: "#912329" }}
//                             >
//                                 <DeleteForeverIcon
//                                     fontSize='small'
//                                     className='p-1'
//                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                             </Button>
//                         </Tooltip>)}
//                     </div>

//                     <Dialog onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={showArchiveHierarchy} handler={handleShowArchiveHierarchy} size='xxl' placeholder={undefined}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>درخت بایگانی</DialogHeader>ِ
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <section className='flex flex-col gap-6'>
//                             </section>

//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-full flex flex-row flex-nowrap justify-between items-center'>
//                             <section className='flex grow justify-end'>
//                                 <ButtonComp onClick={handleShowArchiveHierarchy}>بستن</ButtonComp>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>
//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={showImport} handler={handleShowImportType} size='lg'>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>شماره صادره تکراری</DialogHeader>ِ
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='mx-auto relative rounded-lg overflow-auto p-0' >
//                                 <table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center `}>
//                                     <thead>
//                                         <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                     variant="small"
//                                                     color="blue-gray"
//                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                 >
//                                                     شماره
//                                                 </Typography>
//                                             </th>
//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                     variant="small"
//                                                     color="blue-gray"
//                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                 >
//                                                     تاریخ ایجاد
//                                                 </Typography>
//                                             </th>
//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                     variant="small"
//                                                     color="blue-gray"
//                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                 >
//                                                     تاریخ صادره
//                                                 </Typography>
//                                             </th>
//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                     variant="small"
//                                                     color="blue-gray"
//                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                 >
//                                                     موضوع
//                                                 </Typography>
//                                             </th>
//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                     variant="small"
//                                                     color="blue-gray"
//                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                 >
//                                                     فرستنده
//                                                 </Typography>
//                                             </th>
//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                     variant="small"
//                                                     color="blue-gray"
//                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                 >
//                                                     عملیات
//                                                 </Typography>
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                         {newDocumentState.ImportTables?.map((item: SaveImportTablesItemsModels, index: number) => {
//                                             return (
//                                                 <tr key={"saveImport" + index} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                     <td style={{ width: "4%" }} className='p-1'>
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             {index + 1}
//                                                         </Typography>
//                                                     </td>
//                                                     <td className='p-1'>
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             {item.createDate}
//                                                         </Typography>
//                                                     </td>
//                                                     <td className='p-1'>
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             {item.submitDate}
//                                                         </Typography>
//                                                     </td>
//                                                     <td className='p-1'>
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             {item.subject}
//                                                         </Typography>
//                                                     </td>
//                                                     <td style={{ width: "50%" }} className='p-1'>
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             {item.sender}
//                                                         </Typography>
//                                                     </td>
//                                                     <td style={{ width: '4%' }} className='p-1'>
//                                                         <div className='container-fluid mx-auto p-0.5'>
//                                                             <div className="flex flex-row justify-evenly">
//                                                                 <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     size="sm"
//                                                                     className="p-1 mx-1"
//                                                                     onClick={() => window.open(`/Home/NewDocument?docheapid=${item.docHeapId}&doctypeid=4`)}
//                                                                     style={{ background: color?.color }}>
//                                                                     <VisibilityIcon
//                                                                         fontSize='small'
//                                                                         className='p-1'
//                                                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                 </Button>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                 </tr>)
//                                         }
//                                         )
//                                         }
//                                     </tbody>
//                                 </table>
//                             </CardBody>
//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-full flex flex-row flex-nowrap justify-between items-center'>
//                             <section className='flex grow justify-start'>
//                                 <ButtonComponent onClick={handleShowImportType}>انصراف</ButtonComponent>
//                             </section>
//                             <section className='flex grow justify-end'>
//                                 <ButtonComp onClick={() => SaveImportDocument()}>تائید</ButtonComp>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>
//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size="sm" className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openRevoked} handler={handleOpenRecovedDocument}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>ابطال نامه</DialogHeader>ِ
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <section className='flex flex-col gap-6'>
//                                 <Input dir='rtl' crossOrigin="" value={revokedDesc} onChange={(e: any) => { setRevokedDesc(e.target.value); }} style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" variant="outlined" label="توضیحات ابطال نامه" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                             </section>
//                         </DialogBody>
//                         <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <section className='flex grow justify-start'>
//                                 <ButtonComponent onClick={handleOpenRecovedDocument}>انصراف</ButtonComponent>
//                             </section>
//                             <section className='flex grow justify-end'>
//                                 <ButtonComp onClick={() => RevokedDocument()}>تائید</ButtonComp>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>

//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size="sm" className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openSaveDraft} handler={handleOpenSavedraft}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>ذخیره پیش نویس</DialogHeader>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <section className='flex flex-col gap-6'>
//                                 <Input dir="rtl" crossOrigin="" size="md" label="عنوان" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} value={saveDraftName} color="blue-gray" onChange={(e: any) => { setSaveDraftName(e.currentTarget.value); }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                             </section>
//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-full flex flex-row flex-nowrap justify-between items-center'>
//                             <section className='flex justify-center'>
//                                 <ButtonComponent onClick={handleOpenSavedraft}>انصراف</ButtonComponent>
//                             </section>
//                             <section className='flex justify-center'>
//                                 <ButtonComponent onClick={() => SaveDraft()}>تائید</ButtonComponent>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>
//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size="sm" className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openIssuedModal} handler={handleOpenIssuedModal}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>ثبت صادره</DialogHeader>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <section className='flex flex-col gap-6'>
//                                 <div className="relative flex w-full datePicker grow">
//                                     <Input dir="rtl" className='rounded-r-none focus:rounded-r-none' value={gregorianDate.ChangeDate != "" ? gregorianDate.ChangeDate : moment(new Date(), 'YYYY/MM/DD HH:mm:ss').format("YYYY/MM/DD HH:mm:ss")} type='text' crossOrigin="" size="md" label="تاریخ صادره(میلادی)" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                     <div dir='rtl'>
//                                         <DateTimePicker
//                                             inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ صادره" })}
//                                             placeholder=""
//                                             format="jYYYY/jMM/jDD HH:mm:ss"
//                                             id="dateTimePickerSignFrom"
//                                             onChange={setChangeDate}
//                                             cancelOnBackgroundClick={false}
//                                             customClass='p-6'
//                                             preSelected={gregorianDate.ChangeDate != "" ? moment(gregorianDate.ChangeDate, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : moment(new Date(), 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss")}
//                                             currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss")}
//                                         />
//                                     </div>
//                                 </div>
//                             </section>
//                         </DialogBody>
//                         <DialogFooter className='w-full flex flex-row flex-nowrap justify-between items-center' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <section className='flex grow justify-start'>
//                                 <ButtonComponent onClick={handleOpenIssuedModal}>انصراف</ButtonComponent>
//                             </section>
//                             <section className='flex grow justify-end'>
//                                 <ButtonComp onClick={() => SubmitDocument()}>تائید</ButtonComp>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>
//                     <Dialog size="sm" className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openPrintDocument} handler={handleOpenPrintDocument} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                         <DialogHeader dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>چاپ مدرک</DialogHeader>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <section className='flex flex-col gap-6'>
//                                 <Select2 isRtl
//                                     maxMenuHeight={220}
//                                     options={newDocumentState.layoutSize}
//                                     className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] z-50`} placeholder="انتخاب فرمت"
//                                     defaultValue={newDocumentState.layoutSize.find((item: LayoutsModel) => item.value == newDocumentState.templateId)}
//                                     onChange={(option: any) => { setNewDocumentState((state) => ({ ...state, setFormat: option.value })) }}
//                                     theme={(theme) => ({
//                                         ...theme,
//                                         height: 10,
//                                         borderRadius: 5,
//                                         colors: {
//                                             ...theme.colors,
//                                             color: '#607d8b',
//                                             neutral10: `${color?.color}`,
//                                             primary25: `${color?.color}`,
//                                             primary: '#607d8b',
//                                             neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                             neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                         },
//                                     })}
//                                 />
//                             </section>
//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-full flex flex-row flex-nowrap justify-between items-center'>
//                             <section className='flex grow justify-end'>
//                                 <ButtonComponent onClick={() => { handleOpenPrintDocument(), setNewDocumentState((state) => ({ ...state, setFormat: state.layoutSize.find((op) => op.isMain == true)!.value })) }}>انصراف</ButtonComponent>
//                             </section>
//                             <section className='flex grow justify-startF'>
//                                 <ButtonComp onClick={() => GetPrint()}>تائید</ButtonComp>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>
//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size='xxl' className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={showPrint} handler={handleOpenShowPrint} >

//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-full flex flex-row flex-nowrap justify-between items-center'>
//                             <section className='flex grow justify-end'>
//                                 <ButtonComp onClick={() => { setNewDocumentState((state) => ({ ...state, pdfString: "" })), handleOpenShowPrint() }}>بستن</ButtonComp>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>

//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size="sm" className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openPdfDocument} handler={handleOpenPdfDocument}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>مشاهده Pdf</DialogHeader>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <section className='flex flex-col gap-6'>
//                                 <Select2 isRtl
//                                     maxMenuHeight={220}
//                                     options={newDocumentState.layoutSize}
//                                     onChange={(option: any) => { setNewDocumentState((state) => ({ ...state, setFormat: option.value })) }}
//                                     defaultValue={newDocumentState.layoutSize.find((item: LayoutsModel) => item.value == newDocumentState.templateId)}
//                                     className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} placeholder="فرمت"
//                                     theme={(theme) => ({
//                                         ...theme,
//                                         height: 10,
//                                         borderRadius: 5,
//                                         colors: {
//                                             ...theme.colors,
//                                             color: '#607d8b',
//                                             neutral10: `${color?.color}`,
//                                             primary25: `${color?.color}`,
//                                             primary: '#607d8b',
//                                             neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                             neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                         },
//                                     })}
//                                 />
//                             </section>
//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-full flex flex-row flex-nowrap justify-between items-center'>
//                             <section className='flex grow justify-end'>
//                                 <ButtonComponent onClick={() => { handleOpenPdfDocument(), setNewDocumentState((state) => ({ ...state, setFormat: state.layoutSize.find((op) => op.isMain == true)!.value })) }}>انصراف</ButtonComponent>
//                             </section>
//                             <section className='flex grow justify-startF'>
//                                 <ButtonComp onClick={() => { GetPdf().then(() => handleOpenShowPdf()) }}>تائید</ButtonComp>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>
//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={showPdf} handler={handleOpenShowPdf} size='xxl'>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             {loadings.loadingGetDocumentresult == false ? <section className='flex flex-col gap-6'>
//                                 <iframe className="w-[800px] lg:w-[97%] min-h-[83vh] whitespace-nowrap overflow-x-scroll mx-auto" src={'data:application/pdf;base64,' + newDocumentState.pdfString.toString()} >
//                                 </iframe>
//                             </section> : <IframeSkeleton />}
//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-full flex flex-row flex-nowrap justify-between items-center'>
//                             <section className='flex grow justify-end'>
//                                 <ButtonComp onClick={handleOpenShowPdf}>بستن</ButtonComp>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>
//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size="sm" className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openConfirmDocument} handler={handleOpenConfirmDocument}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>تائید مدرک</DialogHeader>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                             <section className='flex flex-col gap-6'>
//                                 <Textarea dir='rtl' onBlur={(e: any) => setDescription(e.target.value)} style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" variant="outlined" label="توضیحات" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                             </section>
//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-full flex flex-row flex-nowrap justify-between items-center'>
//                             <section className='flex justify-center'>
//                                 <ButtonComponent onClick={handleOpenConfirmDocument}>انصراف</ButtonComponent>
//                             </section>
//                             <section className='flex justify-center'>
//                                 <ButtonComponent onClick={() => SetDocumentState(4)}>تائید</ButtonComponent>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>
//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size="sm" className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openRejectDocument} handler={handleOpenRejectDocument}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>رد مدرک</DialogHeader>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <section className='flex flex-col gap-6'>
//                                 <Textarea placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' onBlur={(e: any) => setDescription(e.target.value)} style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" variant="outlined" label="توضیحات" />
//                             </section>
//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-full flex flex-row flex-nowrap justify-between items-center'>
//                             <section className='flex justify-center'>
//                                 <ButtonComponent onClick={handleOpenRejectDocument}>انصراف</ButtonComponent>
//                             </section>
//                             <section className='flex justify-center'>
//                                 <ButtonComponent onClick={() => SetDocumentState(6)}>تائید</ButtonComponent>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>
//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size="sm" className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openReturnedtoSender} handler={handleOpenReturnedtoSender}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>بازگشت مدرک</DialogHeader>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <section className='flex flex-col gap-6'>
//                                 <Textarea placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' onBlur={(e: any) => setDescription(e.target.value)} style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" variant="outlined" label="توضیحات" />
//                             </section>
//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-full flex flex-row flex-nowrap justify-between items-center'>
//                             <section className='flex justify-center'>
//                                 <ButtonComponent onClick={handleOpenReturnedtoSender}>انصراف</ButtonComponent>
//                             </section>
//                             <section className='flex justify-center'>
//                                 <ButtonComponent onClick={() => SetDocumentState(5)}>تائید</ButtonComponent>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>

//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size='xxl' className={`${themeMode?.stateMode ? 'cardDark' : 'cardLight'} absolute top-0 h-auto overflow-scroll`} open={openTreeModal} handler={handleOpenTreeModal}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>درخت ارجاعات</DialogHeader>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                             <section className='flex justify-start'>
//                                 <ButtonComponent onClick={handleOpenTreeModal}>انصراف</ButtonComponent>
//                             </section>
//                             {/* <Chart docHeapId={docHeapId!}></Chart> */}
//                             <ChartNewDocument docHeapId={docHeapId!}></ChartNewDocument>
//                         </DialogBody>
//                     </Dialog>
//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size='xxl' className={`${themeMode?.stateMode ? 'cardDark' : 'cardLight'} absolute top-0 h-[100vh]`} open={folderHierarchy} handler={handleShowArchiveFoldersHierarchy}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>بایگانی</DialogHeader>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="overflow-y-scroll">
//                             <SubsetFoldersHierarchy docHeapId={docHeapId!}></SubsetFoldersHierarchy>
//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-[95%] md:w-[90%] mx-auto flex flex-row flex-nowrap justify-between items-center'>
//                             <section className='flex  justify-start'>
//                                 <ButtonComponent onClick={handleShowArchiveFoldersHierarchy}>انصراف</ButtonComponent>
//                             </section>
//                         </DialogFooter>
//                     </Dialog>
//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                         dismiss={{
//                             escapeKey: true,
//                             referencePress: true,
//                             referencePressEvent: 'click',
//                             outsidePress: false,
//                             outsidePressEvent: 'click',
//                             ancestorScroll: false,
//                             bubbles: true
//                         }}
//                         size='xl' className={`absolute top-0 bottom-0 overflow-y-scroll  ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openForward} handler={handleOpenForward}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex flex-col sticky top-0 left-0 z-[999999] `}>
//                             <section className='flex flex-row justify-between w-full'>
//                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} font-bold text-xl`}> ارجاع مدرک</Typography>
//                                 <IconButton placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} variant="text" color="blue-gray" onClick={() => { setFiles([]), setNewDocumentState((state) => ({ ...state, forwardRecieversTableitems: [] })), handleOpenForward() }}>
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         strokeWidth={2}
//                                         stroke="currentColor"
//                                         className="h-5 w-5"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             d="M6 18L18 6M6 6l12 12"
//                                         />
//                                     </svg>
//                                 </IconButton>
//                             </section>
//                         </DialogHeader>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="w-full overflow-y-scroll">
//                             <section className=' flex flex-col gap-6 w-full'>
//                                 <Accordion open={accordion === 1} className='w-[98%] mx-auto' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                     <AccordionHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='h-[50px] flex justify-end' onClick={() => handleAccordion(1)}>
//                                         <TitleComponent>
//                                             گروه های گیرندگان
//                                         </TitleComponent>
//                                         <IconButton style={{ background: color?.color }} size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                             <GroupsIcon />
//                                         </IconButton>
//                                     </AccordionHeader>
//                                     <AccordionBody>
//                                         <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-around md:items-start my-3 ">
//                                             <CardBody className="w-[98%]  my-4 md:my-0 p-0 rounded-2xl overflow-hidden" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                                 {loadings.loadingGroupsList == false ? Groups && <table dir="rtl" className={"w-full relative text-center max-h-[400px] rounded-lg"}>
//                                                     <thead>
//                                                         <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                >
//                                                                     عنوان
//                                                                 </Typography>
//                                                             </th>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Checkbox
//                                                                     onClick={(e) => SetAllChecked(e.currentTarget.checked)}
//                                                                     crossOrigin=""
//                                                                     name="type"
//                                                                     color='blue-gray'
//                                                                     className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                             </th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                         {totalMembers.map((option: TotalMembar, num: number) => {
//                                                             return (
//                                                                 <tr key={"member" + num} id={(option.id).toString()} className={`${num % 2 ? themeMode?.stateMode ? 'braedDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                                     <td style={{ width: '100%' }} className='p-1'>
//                                                                         <Typography
//                                                                             variant="small"
//                                                                             color="blue-gray"
//                                                                             className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                        >
//                                                                             {option.actorName}
//                                                                         </Typography>
//                                                                     </td>
//                                                                     <td style={{ width: "4%" }} className='p-1'>

//                                                                         <Checkbox
//                                                                             onClick={() => UnCheckedOption(option)}
//                                                                             checked={option.isChecked}
//                                                                             crossOrigin=""
//                                                                             name="type"
//                                                                             color='blue-gray'
//                                                                             className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                                     </td>
//                                                                 </tr>
//                                                             );
//                                                         })}
//                                                     </tbody>
//                                                 </table> : <TableSkeleton />}
//                                             </CardBody>
//                                             <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="w-[95%] mx-auto md:w-[39%] my-4 md:my-0 p-0 rounded-2xl overflow-hidden">
//                                                 {loadings.loadingGroupsList == false ? <table dir="rtl" className={"w-full relative text-center max-h-[400px] rounded-lg"}>
//                                                     <thead>
//                                                         <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     عنوان
//                                                                 </Typography>
//                                                             </th>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                             </th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                         {Groups?.map((option: GroupManagementModel, num: number) => {
//                                                             return (
//                                                                 <tr key={"Goup" + num} id={(option.id).toString()} className={`${num % 2 ? themeMode?.stateMode ? 'braedDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                                     <td className='p-1'>
//                                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             variant="small"
//                                                                             color="blue-gray"
//                                                                             className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                         >
//                                                                             {option.name}
//                                                                         </Typography>
//                                                                     </td>
//                                                                     <td style={{ width: '4%' }} className='p-1'>
//                                                                         <div className='container-fluid mx-auto p-0.5'>
//                                                                             <div className="flex flex-row justify-evenly">
//                                                                                 <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     size="sm"
//                                                                                     className="p-1 mx-1"
//                                                                                     onClick={() => TotalGrounps(option.receiverGroupMembers)}
//                                                                                     style={{ background: color?.color }}>
//                                                                                     <ArrowBackIcon
//                                                                                         fontSize='small'
//                                                                                         className='p-1'
//                                                                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />                                                                                </Button>

//                                                                             </div>
//                                                                         </div>
//                                                                     </td>
//                                                                 </tr>
//                                                             );
//                                                         })}
//                                                     </tbody>
//                                                 </table> : <TableSkeleton />}
//                                             </CardBody>
//                                         </div>
//                                     </AccordionBody>
//                                 </Accordion>
//                                 <div className='w-[95%] md:w-[90%] mx-auto'>
//                                     {loadings.loadingFowardReceivers == false ? <Select2 isRtl isMulti
//                                         maxMenuHeight={220}
//                                         className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] z-[888888] `} placeholder="گیرندگان ارجاع"
//                                         options={newDocumentState.forwardRecievers}
//                                         ref={selectRef}
//                                         theme={(theme) => ({
//                                             ...theme,
//                                             height: 10,
//                                             borderRadius: 5,
//                                             colors: {
//                                                 ...theme.colors,
//                                                 color: '#607d8b',
//                                                 neutral10: `${color?.color}`,
//                                                 primary25: `${color?.color}`,
//                                                 primary: '#607d8b',
//                                                 neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                 neutral80: "white"
//                                             },
//                                         })}
//                                     /> : < InputSkeleton />}
//                                 </div>
//                                 <ButtonComp onClick={handleAddForwardReceivers}>انتخاب</ButtonComp>
//                                 {newDocumentState.forwardRecieversTableitems.length > 0 && (
//                                     <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='mx-0 relative h-[380px] rounded-lg overflow-auto p-0'>
//                                         <table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-[98%] mx-auto relative text-center max-h-[400px]`}>
//                                             <thead className='sticky border-b-2 z-[9999] top-0 left-0 w-full'>
//                                                 <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>

//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             عنوان
//                                                         </Typography>
//                                                     </th>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             جهت
//                                                         </Typography>
//                                                     </th>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             توضیحات شخصی
//                                                         </Typography>
//                                                     </th>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             مخفی
//                                                         </Typography>
//                                                     </th>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             عملیات
//                                                         </Typography>
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                 {newDocumentState.forwardRecieversTableitems.length > 0 && newDocumentState.forwardRecieversTableitems.map((item: ForwardRecieversModel, index: number) => {
//                                                     return (
//                                                         <tr key={"Attachment" + index} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                             <td className='p-1'>
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     {item.title}
//                                                                 </Typography>
//                                                             </td>
//                                                             <td className='p-1'>
//                                                                 <Select2 isRtl
//                                                                     maxMenuHeight={220}
//                                                                     className={`w-[80%] mx-auto whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                     options={newDocumentState.recieveTypes}
//                                                                     defaultValue={(item.receiveTypeId != null) ? newDocumentState.recieveTypes.find((p) => p.value == item.receiveTypeId)! : newDocumentState.recieveTypes.find((item) => item.isDefault == true)!}
//                                                                     onChange={(option: SingleValue<RecieveTypes>, actionMeta: ActionMeta<RecieveTypes>) => { newDocumentState.forwardRecieversTableitems.find((p) => p.actorId == item.actorId && p.level == item.level)!.receiveTypeId = option!.value, setNewDocumentState((state) => ({ ...state })) }}
//                                                                     value={newDocumentState.recieveTypes?.find((p) => p.id == item.receiveTypeId)}
//                                                                     theme={(theme) => ({
//                                                                         ...theme,
//                                                                         height: 10,
//                                                                         borderRadius: 5,
//                                                                         colors: {
//                                                                             ...theme.colors,
//                                                                             color: '#607d8b',
//                                                                             neutral10: `${color?.color}`,
//                                                                             primary25: `${color?.color}`,
//                                                                             primary: '#607d8b',
//                                                                             neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                                             neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                                         },
//                                                                     })}
//                                                                 />
//                                                             </td>
//                                                             <td dir="ltr" style={{ width: '25%' }} className='p-1'>
//                                                                 <Input label="توضیحات"
//                                                                     dir="rtl" type='text' defaultValue={item.desc} crossOrigin="" onBlur={(e: any) => { newDocumentState.forwardRecieversTableitems.find((p) => p.actorId == item.actorId && p.level == item.level)!.desc = e.target.value, setNewDocumentState((state) => ({ ...state })); }} size="md" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                             </td>
//                                                             <td style={{ width: "4%" }} className='p-1'>
//                                                                 <Checkbox
//                                                                     checked={item.isHidden ? true : false}
//                                                                     onClick={(e: any) => SetRecieverIsHidden(item)}
//                                                                     crossOrigin=""
//                                                                     name="type"
//                                                                     color='blue-gray'
//                                                                     className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                             </td>
//                                                             <td style={{ width: '4%' }} className='p-1'>
//                                                                 <div className='container-fluid mx-auto p-0.5'>
//                                                                     <div className="flex flex-row justify-evenly">
//                                                                         <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             onClick={() => DeleteForwardRecieversTableitems(item)}
//                                                                             size="sm"
//                                                                             className="p-1 mx-1"
//                                                                             style={{ background: color?.color }}
//                                                                         >
//                                                                             <DeleteIcon
//                                                                                 fontSize="small"
//                                                                                 className='p-1'
//                                                                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                         </Button>
//                                                                     </div>
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     )
//                                                 })}
//                                             </tbody>
//                                         </table>
//                                     </CardBody>
//                                 )}

//                                 <div dir="ltr" className='w-[95%] md:w-[90%] mx-auto'>
//                                     <Textarea dir="rtl" onInput={(e: any) => setForwardDesc(e)} style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" variant="outlined" label="توضیحات ارجاع" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                     <TitleComponent>ضمائم ارجاع</TitleComponent>
//                                     <section className="container mx-auto">
//                                         <div style={{ border: `1px dashed ${color?.color}` }} {...getRootProps({ className: 'dropzone' })}>
//                                             <input {...getInputProps()} />
//                                             <div className='flex flex-row justify-around items-center'>
//                                                 <IconButton placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} style={{ background: color?.color }} size="sm"
//                                                     className='p-1'
//                                                 >
//                                                     <AddIcon
//                                                         fontSize="small"
//                                                         className='p-1'
//                                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                                                     />
//                                                 </IconButton>
//                                                 <p dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} p-3 text-[13px] font-thin `}>انتخاب فایل مورد نظر</p>
//                                             </div>
//                                         </div>
//                                         <aside style={thumbsContainer}>
//                                             {files.length > 0 && (<table dir="rtl" className={"w-full relative text-center max-h-[400px] rounded-lg"}>
//                                                 <thead>
//                                                     <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                         <th style={{ borderBottomColor: color?.color }}
//                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                         >
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 تصویر مدرک
//                                                             </Typography>
//                                                         </th>
//                                                         <th style={{ borderBottomColor: color?.color }}
//                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                         >
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 اطلاعات مدرک
//                                                             </Typography>
//                                                         </th>
//                                                         <th style={{ borderBottomColor: color?.color }}
//                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                         >
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 توضیحات
//                                                             </Typography>
//                                                         </th>
//                                                         <th style={{ borderBottomColor: color?.color }}
//                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                         >
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 عملیات
//                                                             </Typography>
//                                                         </th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>

//                                                     {filesList}
//                                                 </tbody>
//                                             </table>)}
//                                         </aside>
//                                     </section>
//                                 </div>
//                             </section>
//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={`flex flex-col sticky bottom-0 left-0 z-[999999] + ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} >
//                             <ButtonComp onClick={() => { ForwardDocument() }}>تائید</ButtonComp>
//                         </DialogFooter>
//                     </Dialog>
//                     <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size='xl' className={`absolute top-0 bottom-0 overflow-y-scroll  ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openConfirmForward} handler={handleOpenConfirmForward}>
//                         <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex flex-col sticky top-0 left-0 z-[999999] `}>
//                             <section className='flex flex-row justify-between w-full'>
//                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} font-bold text-xl`}>تائید و ارجاع مدرک</Typography>
//                                 <IconButton placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} variant="text" color="blue-gray" onClick={() => { setFiles([]), setNewDocumentState((state) => ({ ...state, forwardRecieversTableitems: [] })), handleOpenConfirmForward() }}>
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         strokeWidth={2}
//                                         stroke="currentColor"
//                                         className="h-5 w-5"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             d="M6 18L18 6M6 6l12 12"
//                                         />
//                                     </svg>
//                                 </IconButton>
//                             </section>
//                         </DialogHeader>
//                         <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="overflow-y-scroll w-full">
//                             <section className=' flex flex-col gap-6 w-full'>
//                                 <Accordion placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} open={accordion === 1} className='w-[98%] mx-auto'>
//                                     <AccordionHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='h-[50px] flex justify-end' onClick={() => handleAccordion(1)}>
//                                         <TitleComponent>
//                                             گروه های گیرندگان
//                                         </TitleComponent>
//                                         <IconButton placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="p-1" style={{ background: color?.color }} size="sm">
//                                             <GroupsIcon fontSize='small' className="p-1" />
//                                         </IconButton>
//                                     </AccordionHeader>
//                                     <AccordionBody>
//                                         <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-around md:items-start  my-3 ">
//                                             <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="w-[95%] mx-auto md:w-[59%]  my-4 md:my-0 p-0 rounded-2xl overflow-hidden">
//                                                 <table dir="rtl" className={"w-full relative text-center max-h-[400px] rounded-lg"}>
//                                                     <thead>
//                                                         <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     عنوان
//                                                                 </Typography>
//                                                             </th>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >


//                                                                 <Checkbox
//                                                                     onClick={(e) => SetAllChecked(e.currentTarget.checked)}
//                                                                     crossOrigin=""
//                                                                     name="type"
//                                                                     color='blue-gray'
//                                                                     className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />


//                                                             </th>

//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                         {totalMembers.map((option: TotalMembar, num: number) => {
//                                                             return (
//                                                                 <tr key={"table" + num} id={(option.id).toString()} className={`${num % 2 ? themeMode?.stateMode ? 'braedDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                                     <td style={{ width: '100%' }} className='p-1'>
//                                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             variant="small"
//                                                                             color="blue-gray"
//                                                                             className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                         >
//                                                                             {option.actorName}
//                                                                         </Typography>
//                                                                     </td>
//                                                                     <td style={{ width: "4%" }} className='p-1'>

//                                                                         <Checkbox
//                                                                             onClick={() => UnCheckedOption(option)}
//                                                                             checked={option.isChecked}
//                                                                             crossOrigin=""
//                                                                             name="type"
//                                                                             color='blue-gray'
//                                                                             className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />

//                                                                     </td>
//                                                                 </tr>

//                                                             );
//                                                         })}

//                                                     </tbody>
//                                                 </table>
//                                             </CardBody>
//                                             <CardBody className="w-[95%] mx-auto md:w-[39%] my-4 md:my-0 p-0 rounded-2xl overflow-hidden" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                                 <table dir="rtl" className={"w-full relative text-center max-h-[400px] rounded-lg"}>
//                                                     <thead>
//                                                         <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     عنوان
//                                                                 </Typography>
//                                                             </th>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                             </th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                         {Groups?.map((option: GroupManagementModel, num: number) => {
//                                                             return (
//                                                                 <tr key={"Goup" + num} id={(option.id).toString()} className={`${num % 2 ? themeMode?.stateMode ? 'braedDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                                     <td className='p-1'>
//                                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             variant="small"
//                                                                             color="blue-gray"
//                                                                             className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                         >
//                                                                             {option.name}
//                                                                         </Typography>
//                                                                     </td>
//                                                                     <td style={{ width: '4%' }} className='p-1'>
//                                                                         <div className='container-fluid mx-auto p-0.5'>
//                                                                             <div className="flex flex-row justify-evenly">
//                                                                                 <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     size="sm"
//                                                                                     className="mx-1 p-1"
//                                                                                     onClick={() => TotalGrounps(option.receiverGroupMembers)}
//                                                                                     style={{ background: color?.color }} >
//                                                                                     <ArrowBackIcon fontSize="small"
//                                                                                         className='p-1'
//                                                                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                                 </Button>
//                                                                             </div>
//                                                                         </div>
//                                                                     </td>
//                                                                 </tr>
//                                                             );
//                                                         })}
//                                                     </tbody>
//                                                 </table>
//                                             </CardBody>
//                                         </div>
//                                     </AccordionBody>
//                                 </Accordion>
//                                 <div className='w-[95%] md:w-[90%] mx-auto'>
//                                     {loadings.loadingFowardReceivers == false ? <Select2 isRtl isMulti
//                                         maxMenuHeight={220}
//                                         className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%] z-[888888]`} placeholder="گیرندگان ارجاع"
//                                         options={newDocumentState.forwardRecievers}
//                                         ref={selectRef}
//                                         theme={(theme) => ({
//                                             ...theme,
//                                             height: 10,
//                                             borderRadius: 5,
//                                             colors: {
//                                                 ...theme.colors,
//                                                 color: '#607d8b',
//                                                 neutral10: `${color?.color}`,
//                                                 primary25: `${color?.color}`,
//                                                 primary: '#607d8b',
//                                                 neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                 neutral80: "white"
//                                             },
//                                         })}
//                                     /> : < InputSkeleton />}
//                                 </div>
//                                 <ButtonComp onClick={handleAddForwardReceivers}>انتخاب</ButtonComp>
//                                 {newDocumentState.forwardRecieversTableitems.length > 0 && (
//                                     <table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-[95%] md:w-[90%] mx-auto relative text-center max-h-[400px]`}>
//                                         <thead>
//                                             <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>

//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                     >
//                                                         عنوان
//                                                     </Typography>
//                                                 </th>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                     >
//                                                         جهت
//                                                     </Typography>
//                                                 </th>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                     >
//                                                         توضیحات شخصی
//                                                     </Typography>
//                                                 </th>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                     >
//                                                         مخفی
//                                                     </Typography>
//                                                 </th>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>
//                                                         عملیات
//                                                     </Typography>
//                                                 </th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                             {newDocumentState.forwardRecieversTableitems.length > 0 && newDocumentState.forwardRecieversTableitems.map((item: any, index: number) => {
//                                                 return (
//                                                     <tr key={"Attachment" + index} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                         <td className='p-1'>
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 {item.title}
//                                                             </Typography>
//                                                         </td>
//                                                         <td className='p-1'>

//                                                             <Select2 isRtl
//                                                                 maxMenuHeight={220}
//                                                                 className={`w-[80%] mx-auto whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 options={newDocumentState.recieveTypes}
//                                                                 defaultValue={item.receiveTypeId != null ? newDocumentState.recieveTypes[newDocumentState.recieveTypes.indexOf(newDocumentState.recieveTypes.find((p) => p.value == item.receiveTypeId)!)] : newDocumentState.recieveTypes[newDocumentState.recieveTypes.indexOf(newDocumentState.recieveTypes.find((item) => item.isDefault == true)!)]}
//                                                                 onChange={(option: SingleValue<RecieveTypes>, actionMeta: ActionMeta<RecieveTypes>) => { newDocumentState.forwardRecieversTableitems.find((p) => p.actorId == item.actorId && p.level == item.level)!.receiveTypeId = option!.value, setNewDocumentState((state) => ({ ...state })) }}
//                                                                 value={newDocumentState.recieveTypes?.find((p) => p.id == item.receiveTypeId)}
//                                                                 theme={(theme) => ({
//                                                                     ...theme,
//                                                                     height: 10,
//                                                                     borderRadius: 5,
//                                                                     colors: {
//                                                                         ...theme.colors,
//                                                                         color: '#607d8b',
//                                                                         neutral10: `${color?.color}`,
//                                                                         primary25: `${color?.color}`,
//                                                                         primary: '#607d8b',
//                                                                         neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                                         neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                                     },
//                                                                 })}
//                                                             />
//                                                         </td>
//                                                         <td dir="ltr" style={{ width: '25%' }} className='p-1'>
//                                                             <Input label="توضیحات"
//                                                                 dir="rtl" type='text' crossOrigin="" defaultValue={item.desc} onBlur={(e: any) => { newDocumentState.forwardRecieversTableitems.find((p) => p.actorId == item.actorId && p.level == item.level)!.desc = e.target.value, setNewDocumentState((state) => ({ ...state })); }} size="md" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                         </td>
//                                                         <td style={{ width: "4%" }} className='p-1'>
//                                                             <Checkbox
//                                                                 checked={item.isHidden ? true : false}
//                                                                 onClick={(e: any) => SetRecieverIsHidden(item)}
//                                                                 crossOrigin=""
//                                                                 name="type"
//                                                                 color='blue-gray'
//                                                                 className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                         </td>
//                                                         <td style={{ width: '4%' }} className='p-1'>
//                                                             <div className='container-fluid mx-auto p-0.5'>
//                                                                 <div className="flex flex-row justify-evenly">
//                                                                     <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                         size="sm"
//                                                                         onClick={() => DeleteForwardRecieversTableitems(item)}
//                                                                         className="p-1 mx-1"
//                                                                         style={{ background: color?.color }}
//                                                                     >
//                                                                         <DeleteIcon
//                                                                             fontSize='small'
//                                                                             className='p-1'
//                                                                             onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                             onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                     </Button>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 )
//                                             })}
//                                         </tbody>
//                                     </table>
//                                 )}

//                                 <div dir='rtl' className='w-[95%] md:w-[90%] mx-auto'>
//                                     <Textarea dir="ltr" onInput={(e: any) => setForwardDesc(e)} style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" variant="outlined" label="توضیحات ارجاع" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                     <TitleComponent>ضمائم ارجاع</TitleComponent>
//                                     <section className="container mx-auto">
//                                         <div style={{ border: `1px dashed ${color?.color}` }} {...getRootProps({ className: 'dropzone' })}>
//                                             <input {...getInputProps()} />
//                                             <div className='flex flex-row justify-around items-center'>
//                                                 <IconButton style={{ background: color?.color }} size="sm" className="mx-1 p-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                                     <AddIcon
//                                                         className='p-1'
//                                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                                                         fontSize="small" />
//                                                 </IconButton>
//                                                 <p dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} p-3 text-[13px] font-thin `}>انتخاب فایل مورد نظر</p>
//                                             </div>
//                                         </div>
//                                         <aside style={thumbsContainer}>
//                                             {files.length > 0 && (<table dir="rtl" className={"w-full relative text-center max-h-[400px] rounded-lg"}>
//                                                 <thead>
//                                                     <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                         <th style={{ borderBottomColor: color?.color }}
//                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                         >
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 تصویر مدرک
//                                                             </Typography>
//                                                         </th>
//                                                         <th style={{ borderBottomColor: color?.color }}
//                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                         >
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 اطلاعات مدرک
//                                                             </Typography>
//                                                         </th>
//                                                         <th style={{ borderBottomColor: color?.color }}
//                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                         >
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 توضیحات
//                                                             </Typography>
//                                                         </th>
//                                                         <th style={{ borderBottomColor: color?.color }}
//                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                         >
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 عملیات
//                                                             </Typography>
//                                                         </th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                     {filesList}
//                                                 </tbody>
//                                             </table>)}
//                                         </aside>
//                                     </section>
//                                 </div>
//                             </section>
//                         </DialogBody>
//                         <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
//                             <ButtonComp onClick={() => { ForwardConfirmDocument() }}>تائید</ButtonComp>
//                         </DialogFooter>
//                     </Dialog>
//                 </div>
//                 <TabsBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='h-full '
//                 >
//                     <TabPanel className='h-full md:min-h-[600px] ' value="documentInfo">
//                         {docTypeId.current == '15' ?
//                             (<MyCustomComponent>
//                                 <Card placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} shadow className={`w-full h-[80vh] rounded-md my-3 mx-auto ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`}>
//                                     <form
//                                         dir='rtl'
//                                         // onSubmit={handleSubmit(OnSubmit)}
//                                         className='relative z-[10] grid grid-cols-1 gap-3 p-4'>
//                                         <div className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} flex w-full`}>
//                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className=' mx-4 font-extralight'>مدیریت محترم</Typography>
//                                             <input
//                                                 readOnly
//                                                 value={permits?.getDailyLeaveInitial.data.getParentRole.faTitle}
//                                                 type="text" style={{ borderColor: '#607d8b' }} className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[400px] border-dashed text-center border-opacity-90 border-b font-[FaLight] rinng-0 outline-none shadow-none bg-inherit focused `} />
//                                         </div>
//                                         <div className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} flex`}>
//                                             <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className=' mx-4 '>خواهشمند است با استفاده از مرخصی  </Typography>
//                                             <FormControl>
//                                                 <RadioGroup
//                                                     className='mx-4 flex'
//                                                     row
//                                                     aria-labelledby="demo-row-radio-buttons-group-label"
//                                                     name="row-radio-buttons-group"
//                                                 >
//                                                     <FormControlLabel value="PaidLeave" control={<CustomRadio />} label="استحقاقی" />
//                                                     <FormControlLabel value="sickLeave" control={<CustomRadio />} label="استعلاجی" />
//                                                     <FormControlLabel value="noSalary" control={<CustomRadio />} label="بدون حقوق" />
//                                                 </RadioGroup>
//                                             </FormControl>
//                                             اینجانب به مدت
//                                             <input
//                                                 type="number" min={1} style={{ borderColor: '#607d8b' }} className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-16 mx-4 h-[40px] text-center border font-[FaLight] rinng-0 outline-none shadow-none bg-inherit focused rounded-md `} />
//                                             روز, از تاریخ
//                                             <div className='mx-4'>
//                                                 <DatePickare
//                                                     multiple={true}
//                                                     // {...register(`AddProgram.finishDate`)}
//                                                     // label='تاریخ پایان دوره'
//                                                     value={state.date}
//                                                     onChange={(date: DateObject) => console.log('test')}
//                                                     // error={errors?.AddProgram && errors?.AddProgram?.finishDate && true}
//                                                     focused={true} // or true based on your logic
//                                                 />
//                                             </div>
//                                             لغایت

//                                             <div className='mx-4'>
//                                                 <DatePickare
//                                                     multiple={true}
//                                                     // {...register(`AddProgram.finishDate`)}
//                                                     // label='تاریخ پایان دوره'
//                                                     value={state.date}
//                                                     onChange={(date: DateObject) => console.log('test')}
//                                                     // error={errors?.AddProgram && errors?.AddProgram?.finishDate && true}
//                                                     focused={true} // or true based on your logic
//                                                 />
//                                             </div>
//                                             موافقت فرمایید.
//                                         </div>
//                                         <div className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-full`}>
//                                             <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className=' mx-4 font-extralight'>دلایل استفاده از مرخصی بدون حقوق</Typography>
//                                             <textarea
//                                                 onFocus={(e) => e.target.rows = 4} rows={1}
//                                                 // {...register(`UpdateRelatedJobs.activityDesc`)}
//                                                 className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border-dashed border-b border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused`} />
//                                         </div>
//                                         <div className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} flex w-full `}>
//                                             <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className=' mx-4 font-extralight'>در مدت مرخصی,</Typography>
//                                             <div className='w-80  mx-4'>
//                                                 <SelectOption
//                                                     isRtl={false}
//                                                     className='w-full'
//                                                     // {...register(`AddProgram.educationalCourseId`)}
//                                                     loading={permits?.getDailyLeaveInitial.data.getSubstituteColleagues != undefined ? false : true}
//                                                     // value={courses == undefined ? null : courses!.find((item: GetCategoriesListModel) => item.id == getValues('AddProgram.educationalCourseId')) ? courses!.find((item: GetCategoriesListModel) => item.id == getValues('AddProgram.educationalCourseId')) : null}
//                                                     // errorType={errors?.AddProgram?.educationalCourseId}
//                                                     onChange={(option: SingleValue<GetSubstituteColleagues>, actionMeta: ActionMeta<GetSubstituteColleagues>) => {
//                                                         // setValue(`AddProgram.educationalCourseId`, option!.id);
//                                                         // trigger(`AddProgram.educationalCourseId`);

//                                                         console.log('option', option)
//                                                     }}
//                                                     options={permits?.getDailyLeaveInitial.data.getSubstituteColleagues == undefined ? [{
//                                                         id: 0, value: 0, label: 'no option found',
//                                                         faName: 'no option found',
//                                                         name: 'no option found'
//                                                     }] : permits?.getDailyLeaveInitial.data.getSubstituteColleagues.map((item) => {
//                                                         return {
//                                                             userId: item.userId,
//                                                             firstName: item.firstName,
//                                                             lastName: item.lastName,
//                                                             faFirstName: item.faFirstName,
//                                                             faLastName: item.faLastName,
//                                                             nationalCode: item.nationalCode,
//                                                             label: item.faFirstName + '' + item.faLastName,
//                                                             value: item.userId
//                                                         }
//                                                     })}
//                                                 />
//                                             </div>
//                                             به عنوان جانشین وظایف محوله اینجانب را به عهده خواهد گرفت.
//                                         </div>
//                                         <div className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} flex w-full `}>
//                                             <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className=' mx-4 font-extralight'>مرخصی استفاده شده در سال جاری استحقاقی : </Typography>
//                                             <input
//                                                 type="text" style={{ borderColor: '#607d8b' }} className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} border-dashed text-center border-opacity-90 border-b font-[FaLight] rinng-0 outline-none shadow-none bg-inherit focused `} />
//                                             <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className=' mx-4 font-extralight'>استعلاجی : </Typography>
//                                             <input
//                                                 type="text" style={{ borderColor: '#607d8b' }} className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} border-dashed text-center border-opacity-90 border-b font-[FaLight] rinng-0 outline-none shadow-none bg-inherit focused `} />
//                                             <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className=' mx-4 font-extralight'>بدون حقوق : </Typography>
//                                             <input
//                                                 type="text" style={{ borderColor: '#607d8b' }} className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} border-dashed text-center border-opacity-90 border-b font-[FaLight] rinng-0 outline-none shadow-none bg-inherit focused `} />
//                                             <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className=' mx-4 font-extralight'>روز میباشد.</Typography>
//                                         </div>
//                                     </form>
//                                 </Card>
//                             </MyCustomComponent >)
//                             : newDocumentState != null && newDocumentState.getDocumentData.length > 0 ? (<form className="w-full h-full">
//                                 <div className="mb-1 w-full flex flex-col justify-center gap-2 ">
//                                     <section className="w-full">
//                                         <div className="container-fluid">
//                                             <div className="flex flex-row flex-wrap md:flex-nowrap justify-around items-center gap-3">
//                                                 <div className="relative hidden lg:flex w-full datePicker grow">
//                                                     <Input readOnly
//                                                     value={newDocumentState.getDocumentData.length > 0 ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'CreateDate')?.fieldValue : " "}
//                                                     // disabled:rounded-r-none disabled:opacity-95 disabled:bg-gray-500/10 disabled:border-blue-gray-200
//                                                     dir="rtl" className='focused rounded-r-none focus:rounded-r-none focus:bg-gray-500/10 cursor-none ' type='text' crossOrigin="" size="md" label="تاریخ ایجاد(میلادی)" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                     <div>
//                                                         <Input readOnly
//                                                         value={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'CreateDate') != null ? moment(newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'CreateDate')?.fieldValue, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : ""}
//                                                         dir="rtl" className='focused rounded-l-none focus:rounded-l-none focus:bg-gray-500/10 cursor-none ' type='text' crossOrigin="" size="md" label="تاریخ ایجاد" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="relative lg:hidden flex-col w-full datePicker ">
//                                                     <div className='my-2' >
//                                                         <Input readOnly
//                                                         value={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'CreateDate') != null ? moment(newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'CreateDate')?.fieldValue, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : ""}
//                                                         dir="rtl" className='focused focus:bg-gray-500/10 cursor-none ' type='text' crossOrigin="" size="md" label="تاریخ ایجاد" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                     </div>
//                                                     <Input
//                                                         className='focused cursor-none focus:bg-gray-500/10 '
//                                                         readOnly defaultValue={newDocumentState.getDocumentData.length > 0 ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'CreateDate')?.fieldValue : " "}
//                                                         dir="rtl" type='text' crossOrigin="" size="md" label="تاریخ ایجاد(میلادی)" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                 </div>
//                                                 <Input readOnly defaultValue={newDocumentState.getDocumentData.length > 0 ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'Indicator')?.fieldValue : " "} dir="rtl" type='text' crossOrigin="" size="md" label="شماره مدرک" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                             </div>
//                                         </div>
//                                     </section>
//                                     <section className="w-full">
//                                         <div className="container-fluid">
//                                             <div className="flex flex-row flex-wrap md:flex-nowrap justify-around items-center gap-3">
//                                                 <Input onBlur={(e) => ChangeSubject(e)} defaultValue={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'Subject')!.fieldValue} dir="rtl" crossOrigin="" size="md" label="موضوع" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                             </div>
//                                         </div>
//                                     </section>
//                                     {newDocumentState != null && newDocumentState.getDocumentData.length > 0 && <section className="w-full">
//                                         <div className="container-fluid">
//                                             <div className="flex flex-row flex-wrap md:flex-nowrap justify-around items-center gap-3">
//                                                 <div className="relative hidden lg:flex w-full datePicker grow">
//                                                     {docTypeId.current == '1' && docHeapId && (<Input readOnly className="focused select-none focus:bg-gray-500/10 rounded-r-none focus:rounded-r-none cursor-none" dir="rtl" value={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate') ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')!.fieldValue : gregorianDate.IssuedDate} type='text' crossOrigin="" size="md" label="تاریخ صادره(میلادی)" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />)}
//                                                     {docTypeId.current == '4' && (<Input dir="rtl" className="rounded-r-none" value={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')?.fieldValue} type='text' crossOrigin="" size="md" label="تاریخ صادره(میلادی)" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />)}
//                                                     <div dir={docTypeId.current == "4" ? 'rtl' : "ltr"}>
//                                                         {docTypeId.current == "4" && (<DateTimePicker
//                                                             inputComponent={(props) => DatePickerInput({ ...props, label: "تاریخ صادره" })}
//                                                             placeholder=""
//                                                             format="jYYYY/jMM/jDD HH:mm:SS"
//                                                             id="dateTimePickerSignFrom"
//                                                             onChange={setIssuedDate}
//                                                             cancelOnBackgroundClick={false}
//                                                             customClass='p-6'
//                                                             currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss")}
//                                                             preSelected={gregorianDate.IssuedDate != '' ? moment(gregorianDate.IssuedDate, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')?.fieldValue != '' ? moment(newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')?.fieldValue, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : ''}
//                                                         // newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate') != null ? moment(newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')?.fieldValue, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : ''}
//                                                         />)}
//                                                         {(docTypeId.current == "1" && docHeapId) &&
//                                                             <Input readOnly
//                                                         value={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate') != null ? moment(newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')?.fieldValue, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : ""}
//                                                         dir="rtl" className='focused focus:bg-gray-500/10 cursor-none rounded-l-none focus:rounded-l-none ' type='text' crossOrigin="" size="md" label="تاریخ صادره" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                         }
//                                                     </div>
//                                                 </div>
//                                                 <div className="relative lg:hidden w-full datePicker">
//                                                     <div dir={docTypeId.current == "4" ? 'rtl' : "ltr"} className='my-2'>
//                                                         {docTypeId.current == '4' && (<DateTimePicker
//                                                             inputComponent={(props) => DatePickerInputMobile({ ...props, label: "تاریخ صادره" })}
//                                                             placeholder=""
//                                                             format="jYYYY/jMM/jDD HH:mm:SS"
//                                                             id="dateTimePickerSignFrom"
//                                                             onChange={setIssuedDate}
//                                                             cancelOnBackgroundClick={false}
//                                                             customClass='p-6'
//                                                             currentDate={moment(new Date(), 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss")}
//                                                             // preSelected={
//                                                             preSelected={gregorianDate.IssuedDate != '' ? moment(gregorianDate.IssuedDate, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')?.fieldValue != '' ? moment(newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')?.fieldValue, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : ''}
//                                                         // newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate') != null ? moment(newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')?.fieldValue, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : ''}
//                                                         />)}
//                                                         {docTypeId.current == "1" && docHeapId && (<Input readOnly
//                                                         value={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate') != null ? moment(newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')?.fieldValue, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : ""}
//                                                         dir="rtl" className='focused focus:bg-gray-500/10 cursor-none ' type='text' crossOrigin="" size="md" label="تاریخ صادره" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />)}
//                                                     </div>
//                                                     {docTypeId.current == '1' && docHeapId && (
//                                                         <Input readOnly className="focused select-none focus:bg-gray-500/10 cursor-none" dir="rtl" value={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate') ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')!.fieldValue : gregorianDate.IssuedDate} type='text' crossOrigin="" size="md" label="تاریخ صادره(میلادی)" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                     )}
//                                                     {docTypeId.current == '4' && (<Input dir="rtl" value={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitDate')?.fieldValue} type='text' crossOrigin="" size="md" label="تاریخ صادره(میلادی)" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />)}
//                                                 </div>
//                                                 {docTypeId.current == '1' ?
//                                                     (<Input
//                                                         dir="rtl" type='text' readOnly defaultValue={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitIndicatorNumber') && newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitIndicatorNumber')!.fieldValue} crossOrigin="" size="md" label="شماره صادره" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />)
//                                                     : (<Input
//                                                         dir="rtl" type='text'
//                                                         onBlur={(e) => ChangeSubmitNo(e)}
//                                                         defaultValue={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitNo') && newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SubmitNo')!.fieldValue}
//                                                         crossOrigin="" size="md" label="شماره صادره" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />)}
//                                             </div>
//                                         </div>
//                                     </section>}
//                                     <section className="w-full">
//                                         <div className="container-fluid">
//                                             <div className="flex flex-row flex-wrap md:flex-nowrap justify-around items-center gap-3">
//                                                 <div className="relative hidden lg:flex w-full datePicker grow">
//                                                     <Input readOnly
//                                                     value={newDocumentState.getDocumentData.length > 0 ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SignDate')?.fieldValue : " "}
//                                                     // disabled:rounded-r-none disabled:opacity-95 disabled:bg-gray-500/10 disabled:border-blue-gray-200
//                                                     dir="rtl" className='focused rounded-r-none focus:rounded-r-none cursor-none  focus:bg-gray-500/10 ' type='text' crossOrigin="" size="md" label="تاریخ امضاء(میلادی)" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                     <div>
//                                                         <Input readOnly
//                                                         value={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SignDate') != null ? moment(newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SignDate')?.fieldValue, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : ""}
//                                                         dir="rtl" className='focused rounded-l-none focus:rounded-l-none cursor-none  focus:bg-gray-500/10 ' type='text' crossOrigin="" size="md" label="تاریخ امضاء" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="relative lg:hidden flex-col w-full datePicker ">
//                                                     <div className='my-2' >
//                                                         <Input readOnly
//                                                         value={newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SignDate') != null ? moment(newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SignDate')?.fieldValue, 'YYYY/MM/DD HH:mm:ss').locale('fa').format("jYYYY/jMM/jDD HH:mm:ss") : ""}
//                                                         dir="rtl" className='focused  focus:bg-gray-500/10 cursor-none ' type='text' crossOrigin="" size="md" label="تاریخ امضاء" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                     </div>
//                                                     <Input
//                                                         className='focused  focus:bg-gray-500/10 cursor-none '
//                                                         readOnly defaultValue={newDocumentState.getDocumentData.length > 0 ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'SignDate')?.fieldValue : " "}
//                                                         dir="rtl" type='text' crossOrigin="" size="md" label="تاریخ امضاء(میلادی)" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                 </div>
//                                                 <Input
//                                                     readOnly defaultValue={newDocumentState.getDocumentData.length > 0 ? newDocumentState.getDocumentData.find((item: GetDocumentDataModel) => item.fieldName === 'Creator')?.fieldValue : " "}
//                                                     dir="rtl" type='text' crossOrigin="" size="md" label="ایجاد کننده" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                             </div>
//                                         </div>
//                                     </section>
//                                     <section className="w-full">
//                                         <div className="container-fluid">
//                                             <div className="lg:flex ld:flex-row lg:flex-nowrap justify-around items-center gap-3">
//                                                 <section className="w-full lg:w-[50%] md:flex gap-x-4">
//                                                     <div className="flex flex-nowrap w-[100%] items-center">
//                                                         <Select2 isRtl
//                                                             maxMenuHeight={220}
//                                                             onChange={(option: SingleValue<GetRepositoryModel>, actionMeta: ActionMeta<GetRepositoryModel>) => ChangePriority(option)}
//                                                             className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} placeholder="اولویت"
//                                                             options={newDocumentState.optionPriority}
//                                                             defaultValue={newDocumentState.optionPriority.find((item: GetRepositoryModel) => item.Id == 1)}
//                                                             value={newDocumentState.optionPriority.find((item: GetRepositoryModel) => item.Id == Number(newDocumentState.getDocumentData.find((i: GetDocumentDataModel) => i.fieldName == "Priority")!.fieldValue))}
//                                                             theme={(theme) => ({
//                                                                 ...theme,
//                                                                 height: 10,
//                                                                 borderRadius: 5,
//                                                                 colors: {
//                                                                     ...theme.colors,
//                                                                     color: '#607d8b',
//                                                                     neutral10: `${color?.color}`,
//                                                                     primary25: `${color?.color}`,
//                                                                     primary: '#607d8b',
//                                                                     neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                                     neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                                 },
//                                                             })}
//                                                         />
//                                                         <label className={`whitespace-nowrap text-[13px] font-[300] mx-1 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>اولویت</label>
//                                                     </div>
//                                                     <div className="flex flex-nowrap w-[100%] items-center">
//                                                         <Select2 isRtl
//                                                             maxMenuHeight={220}
//                                                             className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} placeholder="پیوست"
//                                                             onChange={(option: SingleValue<GetRepositoryModel>, actionMeta: ActionMeta<GetRepositoryModel>) => ChangeHasAttachments(option)}
//                                                             options={newDocumentState.optionHasAttachments}
//                                                             defaultValue={newDocumentState.optionHasAttachments.find((item: GetRepositoryModel) => item.Id == 1)}
//                                                             value={newDocumentState.optionHasAttachments.find((item: GetRepositoryModel) => item.Id == Number(newDocumentState.getDocumentData.find((i: GetDocumentDataModel) => i.fieldName == "HasAttachments")!.fieldValue))}
//                                                             theme={(theme) => ({
//                                                                 ...theme,
//                                                                 height: 10,
//                                                                 borderRadius: 5,
//                                                                 colors: {
//                                                                     ...theme.colors,
//                                                                     color: '#607d8b',
//                                                                     neutral10: `${color?.color}`,
//                                                                     primary25: `${color?.color}`,
//                                                                     primary: '#607d8b',
//                                                                     neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                                     neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                                 },
//                                                             })}
//                                                         />
//                                                         <label className={`whitespace-nowrap text-[13px] font-[300] mx-1 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>پیوست</label>
//                                                     </div>
//                                                 </section>
//                                                 <section className="w-full lg:w-[50%] md:flex my-2 gap-x-4">
//                                                     {(docTypeId.current == '1') && (
//                                                         <div className="flex flex-nowrap w-[100%] items-center">
//                                                             <Select2 isRtl
//                                                                 maxMenuHeight={220}
//                                                                 onChange={(option: SingleValue<GetRepositoryModel>, actionMeta: ActionMeta<GetRepositoryModel>) => ChangeFlowType(option)}
//                                                                 className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} placeholder="نوع مدرک"
//                                                                 options={newDocumentState.optionFlowType}
//                                                                 defaultValue={newDocumentState.optionFlowType.find((item: GetRepositoryModel) => item.Id == 1)}
//                                                                 value={newDocumentState.optionFlowType.find((item: GetRepositoryModel) => item.Id == (newDocumentState.getDocumentData.find((i: GetDocumentDataModel) => i.fieldName == "FlowType")?.fieldValue == "" ? 1 : Number(newDocumentState.getDocumentData.find((i: GetDocumentDataModel) => i.fieldName == "FlowType")?.fieldValue)))} theme={(theme) => ({
//                                                                     ...theme,
//                                                                     height: 10,
//                                                                     borderRadius: 5,
//                                                                     colors: {
//                                                                         ...theme.colors,
//                                                                         color: '#607d8b',
//                                                                         neutral10: `${color?.color}`,
//                                                                         primary25: `${color?.color}`,
//                                                                         primary: '#607d8b',
//                                                                         neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                                         neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                                     },
//                                                                 })}
//                                                             />
//                                                             <label className={`whitespace-nowrap text-[13px] font-[300] mx-1 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>نوع مدرک</label>
//                                                         </div>
//                                                     )}

//                                                     <div className="flex flex-nowrap w-[100%] items-center">
//                                                         {loadings.loadingClassification == false ? < Select2 isRtl
//                                                             maxMenuHeight={220}
//                                                             className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} placeholder="محرمانگی"
//                                                             onChange={(option: SingleValue<GetRepositoryModel>, actionMeta: ActionMeta<GetRepositoryModel>) => ChangeClassification(option)}
//                                                             options={newDocumentState.optionClassification}
//                                                             defaultValue={newDocumentState.optionClassification.find((item: GetRepositoryModel) => item.Id == 1)}
//                                                             value={newDocumentState.optionClassification.find((item: GetRepositoryModel) => item.Id == (newDocumentState.getDocumentData.find((i: GetDocumentDataModel) => i.fieldName == "Classification")?.fieldValue == "" ? 1 : Number(newDocumentState.getDocumentData.find((i: GetDocumentDataModel) => i.fieldName == "Classification")?.fieldValue)))}
//                                                             theme={(theme) => ({
//                                                                 ...theme,
//                                                                 height: 10,
//                                                                 borderRadius: 5,
//                                                                 colors: {
//                                                                     ...theme.colors,
//                                                                     color: '#607d8b',
//                                                                     neutral10: `${color?.color}`,
//                                                                     primary25: `${color?.color}`,
//                                                                     primary: '#607d8b',
//                                                                     neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                                     neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                                 },
//                                                             })}

//                                                         /> : < InputSkeleton />}
//                                                         <label className={`whitespace-nowrap text-[13px] font-[300] mx-1 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>محرمانگی</label>
//                                                     </div>

//                                                 </section>
//                                             </div>
//                                         </div>
//                                     </section>
//                                     {docHeapId != null && docTypeId.current == '1' && (<ButtonComp onClick={() => SignDocument()}>امضاء مدرک</ButtonComp>)}
//                                     {loadings.loadingSignersList == false ? docHeapId != null && docTypeId.current == '1' && newDocumentState.SignersName?.length > 0 && (
//                                         <table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[400px]`}>
//                                             <thead>
//                                                 <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             #
//                                                         </Typography>
//                                                     </th>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             امضاء کنندگان
//                                                         </Typography>
//                                                     </th>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             عملیات
//                                                         </Typography>
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                 {newDocumentState.SignersName.map((item: SignersModel, index: number) => {
//                                                     return (<tr key={index + "signers"} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                         <td style={{ width: '5%' }} className='p-1'>
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[700] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 {Number(1 + index)}
//                                                             </Typography>
//                                                         </td>
//                                                         <td className='p-1'>
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[13px] whitespace-nowrap`}
//                                                             >
//                                                                 {item.SignerName}
//                                                             </Typography>
//                                                         </td>
//                                                         <td style={{ width: '4%' }} className='p-1'>
//                                                             <div className='container-fluid mx-auto p-0.5'>
//                                                                 <div className="flex flex-row justify-evenly">
//                                                                     {index == newDocumentState.SignersName.length - 1 && !newDocumentState.getDocumentData.find((item) => item.fieldName === "SubmitIndicatorNumber") &&
//                                                                         (<Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={() => DeleteSignersName(item)}
//                                                                             size="sm"
//                                                                             className="p-1 mx-1"
//                                                                             style={{ background: color?.color }}
//                                                                         >
//                                                                             <DeleteIcon
//                                                                                 fontSize='small'
//                                                                                 className='p-1'
//                                                                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                         </Button>)
//                                                                     }
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                     </tr>)
//                                                 })}
//                                             </tbody>
//                                         </table>
//                                     ) : <TableSkeleton />}
//                                     {docHeapId != null && (<section className="h-[80px] w-[95%] md:w-[90%] mx-auto flex justify-end items-center py-3">
//                                         <Checkbox
//                                             checked={newDocumentState.getDocumentData.find((item) => item.fieldName == "IsRevoked")?.fieldValue!.toLowerCase() == "true"}
//                                             crossOrigin=""
//                                             disabled
//                                             name="type"
//                                             color='blue-gray'
//                                             className="p-0 transition-all hover:before:opacity-0"
//                                             label={<Typography
//                                                 color="blue-gray"
//                                                 className={`font-normal ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
//                                                 وضعیت ابطال
//                                             </Typography>} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        />
//                                     </section>)}
//                                 </div>
//                             </form>) : <Loading />}
//                     </TabPanel>
//                     <TabPanel className='h-full md:min-h-[600px]' value="documentResult">
//                         {loadings.loadingResponse == false && newDocumentState.documentResult != '' ? <section className='flex flex-col gap-6'>
//                             <iframe className="w-[800px] lg:w-[97%] min-h-[83vh] whitespace-nowrap overflow-x-scroll mx-auto" src={'data:application/pdf;base64,' + newDocumentState.documentResult.toString()} >
//                             </iframe>
//                         </section> : <IframeSkeleton />}
//                     </TabPanel>

//                     <TabPanel className='h-full' value="recievers">
//                         <section className="w-full">
//                             <div className="container-fluid">
//                                 <div className="flex flex-row flex-wrap">

//                                     <Tabs dir="rtl" className="w-full" id="custom-animation" value="MainReciever">
//                                         <TabsHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                             dir='rtl'
//                                             className={`${themeMode?.stateMode ? 'contentDark' : 'contentLight'} w-full md:w-[40%] lg:w-[30%] flex flex-col md:flex-row `}
//                                             indicatorProps={{
//                                                 style: {
//                                                     background: color?.color,
//                                                 },
//                                                 className: `shadow !text-gray-900`,
//                                             }}
//                                         >
//                                             <Tab placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={() => setActiveTabReciever("MainReciever")} value="MainReciever">
//                                                 <Typography variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`} style={{ color: `${activeTabReciever == "MainReciever" ? "white" : ""}` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>گیرندگان اصلی</Typography>
//                                             </Tab>
//                                             <Tab placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={() => setActiveTabReciever("CopyReciever")} value="CopyReciever">
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} variant='h6' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px]`} style={{ color: `${activeTabReciever == "CopyReciever" ? "white" : ""}` }}>گیرندگان رونوشت</Typography>
//                                             </Tab>
//                                         </TabsHeader>
//                                         <TabsBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                             className='w-full p-0'
//                                         >
//                                             <TabPanel className='min-h-[550px] w-full p-3' value="MainReciever">
//                                                 <section className='w-full '>
//                                                     <AsyncSelect isMulti isRtl className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-full  z-50 `} cacheOptions defaultOptions placeholder="گیرندگان اصلی"
//                                                         maxMenuHeight={250}
//                                                         loadOptions={loadSearchedRecieversOptions}
//                                                         ref={MainReciever}
//                                                         theme={(theme) => ({
//                                                             ...theme,
//                                                             height: 10,
//                                                             borderRadius: 5,
//                                                             colors: {
//                                                                 ...theme.colors,
//                                                                 color: '#607d8b',
//                                                                 neutral10: `${color?.color}`,
//                                                                 primary25: `${color?.color}`,
//                                                                 primary: '#607d8b',
//                                                                 neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                                 neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                             },
//                                                         })}
//                                                     />
//                                                     <ButtonComponent onClick={handleAddReciever}>انتخاب</ButtonComponent>
//                                                     {newDocumentState.RecieversTableListItems?.length! > 0 && (
//                                                         <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='h-[350px] mx-auto relative rounded-lg overflow-auto p-0' >
//                                                             <table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[320px] `}>
//                                                                 <thead className='sticky z-[30] top-0 left-0 w-full'>
//                                                                     <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                                         <th style={{ borderBottomColor: color?.color }}
//                                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                         >
//                                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                 variant="small"
//                                                                                 color="blue-gray"
//                                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                             >
//                                                                                 عنوان
//                                                                             </Typography>
//                                                                         </th>
//                                                                         <th style={{ borderBottomColor: color?.color }}
//                                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                         >
//                                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                 variant="small"
//                                                                                 color="blue-gray"
//                                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                             >
//                                                                                 جهت
//                                                                             </Typography>
//                                                                         </th>
//                                                                         <th style={{ borderBottomColor: color?.color }}
//                                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                         >
//                                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                 variant="small"
//                                                                                 color="blue-gray"
//                                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                             >
//                                                                                 عملیات
//                                                                             </Typography>
//                                                                         </th>

//                                                                     </tr>
//                                                                 </thead>
//                                                                 <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                                     {newDocumentState.RecieversTableListItems?.map((item: RecieversTableListItem, index: number) => {
//                                                                         return (
//                                                                             <tr key={item.Id} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                                                 <td style={{ width: "50%" }} className='p-1'>
//                                                                                     <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                         variant="small"
//                                                                                         color="blue-gray"
//                                                                                         className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                                     >
//                                                                                         {item.Value}
//                                                                                     </Typography>
//                                                                                 </td>
//                                                                                 <td className='p-1 '>

//                                                                                     <Select2 isRtl
//                                                                                         maxMenuHeight={220}
//                                                                                         className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} p-0.5 w-[400px] mx-auto whitespace-nowrap`}
//                                                                                         options={newDocumentState.recieveTypes}
//                                                                                         onChange={(option: SingleValue<RecieveTypes>, actionMeta: ActionMeta<RecieveTypes>) => ChangeActionReceiver(option, item)}
//                                                                                         defaultValue={newDocumentState.recieveTypes?.find((p) => p.value == 2)}
//                                                                                         value={newDocumentState.recieveTypes?.find((p) => p.value == item.ActionId)}
//                                                                                         theme={(theme) => ({
//                                                                                             ...theme,
//                                                                                             height: 10,
//                                                                                             borderRadius: 5,
//                                                                                             colors: {
//                                                                                                 ...theme.colors,
//                                                                                                 color: '#607d8b',
//                                                                                                 neutral10: `${color?.color}`,
//                                                                                                 primary25: `${color?.color}`,
//                                                                                                 primary: '#607d8b',
//                                                                                                 neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                                                                 neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                                                             },
//                                                                                         })}
//                                                                                     />

//                                                                                 </td>
//                                                                                 <td style={{ width: '4%' }} className='p-1'>
//                                                                                     <div className='container-fluid mx-auto p-0.5'>
//                                                                                         <div className="flex flex-row justify-evenly">
//                                                                                             <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                                 onClick={() => DeleteReceiverItem(index)}
//                                                                                                 className="p-1 mx-1"
//                                                                                                 size="sm"
//                                                                                                 style={{ background: color?.color }}
//                                                                                             >
//                                                                                                 <DeleteIcon
//                                                                                                     fontSize="small"
//                                                                                                     className='p-1'
//                                                                                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                                             </Button>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </td>
//                                                                             </tr>)
//                                                                     }
//                                                                     )
//                                                                     }
//                                                                 </tbody>
//                                                             </table>
//                                                         </CardBody>
//                                                     )}
//                                                 </section>
//                                             </TabPanel>
//                                             <TabPanel className='min-h-[550px] w-full p-3' value="CopyReciever">

//                                                 <section className='w-full'>
//                                                     <AsyncSelect isRtl isMulti className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-full z-50`} cacheOptions defaultOptions placeholder="گیرندگان رونوشت"
//                                                         loadOptions={loadSearchedRecieversTranscriptOptions}
//                                                         maxMenuHeight={250}
//                                                         ref={CopyReciever}

//                                                         theme={(theme) => ({
//                                                             ...theme,
//                                                             height: 10,
//                                                             borderRadius: 5,
//                                                             colors: {
//                                                                 ...theme.colors,
//                                                                 color: '#607d8b',
//                                                                 neutral10: `${color?.color}`,
//                                                                 primary25: `${color?.color}`,
//                                                                 primary: '#607d8b',
//                                                                 neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                                 neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                             },
//                                                         })}
//                                                     />
//                                                     <ButtonComponent onClick={() => handleAddCopyReciever()}>انتخاب</ButtonComponent>
//                                                     {newDocumentState.CopyRecieversTableListItems.length > 0 && (
//                                                         <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='h-[320px] mx-auto relative rounded-lg overflow-auto p-0' >
//                                                             <table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[350px]`}>
//                                                                 <thead className='sticky z-[30] top-0 left-0 w-full'>
//                                                                     <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                                         <th style={{ borderBottomColor: color?.color }}
//                                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                         >
//                                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                 variant="small"
//                                                                                 color="blue-gray"
//                                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                             >
//                                                                                 عنوان
//                                                                             </Typography>
//                                                                         </th>
//                                                                         <th style={{ borderBottomColor: color?.color }}
//                                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                         >
//                                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                 variant="small"
//                                                                                 color="blue-gray"
//                                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                             >
//                                                                                 جهت
//                                                                             </Typography>
//                                                                         </th>
//                                                                         <th style={{ borderBottomColor: color?.color }}
//                                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                         >
//                                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                 variant="small"
//                                                                                 color="blue-gray"
//                                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                             >
//                                                                                 توضیحات
//                                                                             </Typography>
//                                                                         </th>
//                                                                         <th style={{ borderBottomColor: color?.color }}
//                                                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                         >
//                                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                 variant="small"
//                                                                                 color="blue-gray"
//                                                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                             >
//                                                                                 عملیات
//                                                                             </Typography>
//                                                                         </th>

//                                                                     </tr>
//                                                                 </thead>
//                                                                 <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                                     {newDocumentState.CopyRecieversTableListItems.map((item: CopyRecieversTableListItem, index: number) => {
//                                                                         return (<tr key={index + "copyRecievers"} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                                             <td style={{ width: "50%" }} className='p-1'>
//                                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     variant="small"
//                                                                                     color="blue-gray"
//                                                                                     className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                                 >
//                                                                                     {item.Value}
//                                                                                 </Typography>
//                                                                             </td>
//                                                                             <td className='p-1 '>
//                                                                                 <Select2 isRtl
//                                                                                     maxMenuHeight={220}
//                                                                                     className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} p-0.5 w-[400px] mx-auto whitespace-nowrap`}
//                                                                                     options={newDocumentState.recieveTypes}
//                                                                                     onChange={(option: SingleValue<RecieveTypes>, actionMeta: ActionMeta<RecieveTypes>) => ChangeActionCopyReceiver(option, item)}
//                                                                                     defaultValue={newDocumentState.recieveTypes?.find((p) => p.value == 5)}
//                                                                                     value={newDocumentState.recieveTypes?.find((p) => p.value == item.ActionId)}
//                                                                                     theme={(theme) => ({
//                                                                                         ...theme,
//                                                                                         height: 10,
//                                                                                         borderRadius: 5,
//                                                                                         colors: {
//                                                                                             ...theme.colors,
//                                                                                             color: '#607d8b',
//                                                                                             neutral10: `${color?.color}`,
//                                                                                             primary25: `${color?.color}`,
//                                                                                             primary: '#607d8b',
//                                                                                             neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                                                             neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                                                         },
//                                                                                     })}
//                                                                                 />

//                                                                             </td>

//                                                                             <td dir='ltr' className='p-1'>

//                                                                                 <Input dir="rtl"
//                                                                                 // onBlur={(e: any) => { ChangeCopyReceiverDesc(e.target.value, item) }}
//                                                                                 onChange={(e: any) => { newDocumentState.CopyRecieversTableListItems.find((p) => p.Id == item.Id)!.Description = e.target.value, setNewDocumentState((state) => ({ ...state })); } }
//                                                                                 defaultValue={newDocumentState.CopyRecieversTableListItems.find((p) => p.Id == item.Id)!.Description}
//                                                                                 style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color='blue-gray' crossOrigin="" type='text' label='توضیحات' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                                                             </td>
//                                                                             <td style={{ width: '4%' }} className='p-1'>
//                                                                                 <div className='container-fluid mx-auto p-0.5'>
//                                                                                     <div className="flex flex-row justify-evenly">
//                                                                                         <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                             size="sm"
//                                                                                             onClick={() => DeleteCopyReceiverItem(index)}
//                                                                                             className="p-1 mx-1"
//                                                                                             style={{ background: color?.color }}
//                                                                                         >
//                                                                                             <DeleteIcon
//                                                                                                 fontSize="small"
//                                                                                                 className='p-1'
//                                                                                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                                         </Button>



//                                                                                     </div>
//                                                                                 </div>
//                                                                             </td>

//                                                                         </tr>)

//                                                                     })}
//                                                                 </tbody>
//                                                             </table>
//                                                         </CardBody>
//                                                     )}

//                                                 </section>

//                                             </TabPanel>

//                                         </TabsBody>
//                                     </Tabs>
//                                 </div>
//                             </div>
//                         </section>
//                     </TabPanel>
//                     <TabPanel className='h-full' value="sender">
//                         <section className="w-full">
//                             <div className="container-fluid">
//                                 <div className="flex flex-row flex-wrap">
//                                     <section className='w-full '>
//                                         <AsyncSelect isMulti isRtl className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} cacheOptions defaultOptions placeholder="فرستنده"
//                                             loadOptions={loadSearchedRecieversOptions}
//                                             maxMenuHeight={250}
//                                             ref={Sender}
//                                             theme={(theme) => ({
//                                                 ...theme,
//                                                 height: 10,
//                                                 borderRadius: 5,
//                                                 colors: {
//                                                     ...theme.colors,
//                                                     color: '#607d8b',
//                                                     neutral10: `${color?.color}`,
//                                                     primary25: `${color?.color}`,
//                                                     primary: '#607d8b',
//                                                     neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                     neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                 },
//                                             })}
//                                         />
//                                         <ButtonComp onClick={handleAddSender}>انتخاب</ButtonComp>
//                                         <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='h-[320px] mx-auto relative rounded-lg overflow-auto p-0' >
//                                             {newDocumentState.SendersTableListItems?.length! > 0 &&
//                                                 (<table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[350px]`}>
//                                                     <thead>
//                                                         <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     عنوان
//                                                                 </Typography>
//                                                             </th>
//                                                             {/* <th style={{ borderBottomColor: color?.color }}
//                                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                 >
//                                                                     <Typography
//                                                                         variant="small"
//                                                                         color="blue-gray"
//                                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                     >
//                                                                         توضیحات
//                                                                     </Typography>
//                                                                 </th> */}
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     عملیات
//                                                                 </Typography>
//                                                             </th>

//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                         {newDocumentState.SendersTableListItems?.map((item: GetSendersModel, index: number) => {
//                                                             return (
//                                                                 <tr key={item.Id} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none`}>
//                                                                     <td style={{ width: "90%" }} className='p-1'>
//                                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             variant="small"
//                                                                             color="blue-gray"
//                                                                             className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                         >
//                                                                             {item.Value}
//                                                                         </Typography>
//                                                                     </td>
//                                                                     {/* <td dir='ltr' className='p-1'>
//                                                                             <Input
//                                                                                 dir="rtl"
//                                                                                 onChange={(e: any) => { newDocumentState.SendersTableListItems.find((p) => p.Id == item.Id)!.Description = e.target.value, setNewDocumentState((state) => ({ ...state })) }}
//                                                                                 defaultValue={newDocumentState.SendersTableListItems.find((p) => p.Id == item.Id)!.Description}
//                                                                                 className='whitespace-nowrap'
//                                                                                 style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color='blue-gray' crossOrigin="" type='text' label='توضیحات' />
//                                                                         </td> */}
//                                                                     <td style={{ width: '4%' }} className='p-1'>
//                                                                         <div className='container-fluid mx-auto p-0.5'>
//                                                                             <div className="flex flex-row justify-evenly">
//                                                                                 <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     size="sm"
//                                                                                     className="p-1 mx-1"
//                                                                                     style={{ background: color?.color }}
//                                                                                     onClick={() => DeleteSenderItem(index)}
//                                                                                 >
//                                                                                     <DeleteIcon
//                                                                                         fontSize="small"
//                                                                                         className='p-1'
//                                                                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                                 </Button>
//                                                                             </div>
//                                                                         </div>
//                                                                     </td>
//                                                                 </tr>)
//                                                         }
//                                                         )
//                                                         }
//                                                     </tbody>
//                                                 </table>)}
//                                         </CardBody>
//                                     </section>
//                                 </div>
//                             </div>
//                         </section>
//                     </TabPanel>
//                     <TabPanel className='h-full' value="paraph">
//                         <section className='w-full flex flex-col md:flex-row items-center justify-around md:items-start md:gap-3 my-3'>

//                             <section className='w-full'>
//                                 <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={'h-[68vh] mx-auto relative rounded-lg p-0 ' + (loadings.loadingParaphList == true ? " overflow-hidden" : " overflow-auto")} >
//                                     {loadings.loadingParaphList == false ? newDocumentState.paraphTableListItems.length > 0 && (
//                                         <table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[69vh] `}>
//                                             <thead className='sticky z-[30] top-0 left-0 w-full'>
//                                                 <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             #
//                                                         </Typography>
//                                                     </th>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             تاریخ پاراف
//                                                         </Typography>
//                                                     </th>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             نگارنده
//                                                         </Typography>
//                                                     </th>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             مخاطب
//                                                         </Typography>
//                                                     </th>
//                                                     <th style={{ borderBottomColor: color?.color }}
//                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                     >
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             عملیات
//                                                         </Typography>
//                                                     </th>

//                                                 </tr>
//                                             </thead>
//                                             <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                 {newDocumentState.paraphTableListItems.map((item: ParaphTableListModel, index: number) => {
//                                                     return (
//                                                         <tr key={item.id.toString()} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                             <td style={{ width: '5%' }} className='p-1'>
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     {Number(index + 1)}
//                                                                 </Typography>
//                                                             </td>
//                                                             <td className='p-1'>
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     {item.paraphDate !== '' ? moment(item.paraphDate, 'YYYY/MM/DD HH:mm:ss').format("jYYYY/jMM/jDD HH:mm:ss") : ''}
//                                                                 </Typography>
//                                                             </td>
//                                                             <td className='p-1'>
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[13px] p-0.5 whitespace-nowrape`}
//                                                                 >
//                                                                     {item.writer}
//                                                                 </Typography>
//                                                             </td>
//                                                             <td className='p-1'>
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} font-[500] text-[13px] p-0.5 whitespace-nowrape`}
//                                                                 >
//                                                                     {item.contact}
//                                                                 </Typography>
//                                                             </td>
//                                                             <td style={{ width: '10%' }} className='p-1'>
//                                                                 <div className='container-fluid mx-auto p-0.5'>
//                                                                     <div className="flex flex-row justify-evenly">
//                                                                         {item.contact == "" && (<Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             size="sm"
//                                                                             className="p-1 mx-1"
//                                                                             style={{ background: color?.color }}
//                                                                             onClick={() => DeleteParaph(item)}
//                                                                         >
//                                                                             <DeleteIcon
//                                                                                 fontSize="small"
//                                                                                 className='p-1'
//                                                                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                         </Button>

//                                                                         )}
//                                                                         <Popover placement="bottom">
//                                                                             <PopoverHandler>
//                                                                                 <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     size="sm"
//                                                                                     className="p-1 mx-1"
//                                                                                     style={{ background: color?.color }}
//                                                                                 >

//                                                                                     <Tooltip content="اطلاعات تکمیلی" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                                                                                         <InfoIcon
//                                                                                             fontSize="small"
//                                                                                             className='p-1'
//                                                                                             onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                             onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                                     </Tooltip>
//                                                                                 </Button>
//                                                                             </PopoverHandler>
//                                                                             <PopoverContent placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="flex-col z-[9999] border-none py-[10px] bg-blue-gray-600 text-white" dir="rtl">
//                                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="w-full text-[12px] opacity-90 font-[400]">توضیحات : {item.desc ?? "-"}</Typography>
//                                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="w-full text-[12px] opacity-90 font-[400]">توضیحات شخصی : {item.personalDesc ?? "-"}</Typography>
//                                                                             </PopoverContent>
//                                                                         </Popover>

//                                                                     </div>
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     )
//                                                 })}

//                                             </tbody>
//                                         </table>) : <TableSkeleton />}

//                                 </CardBody>

//                             </section>
//                             <section className="order-first md:order-last">
//                                 <Textarea dir="rtl" value={newDocumentState.addParaph} onChange={(e: any) => setNewDocumentState((state) => ({ ...state, addParaph: e.target.value }))} variant="outlined" label="متن پاراف" style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
//                                 <ButtonComp onClick={() => AddParaph()}>افزودن</ButtonComp>
//                             </section>
//                         </section>
//                         {/* </CardBody> */}
//                     </TabPanel>
//                     <TabPanel className='h-full' value="appendices">
//                         <div>
//                             <section className="container mx-auto">
//                                 <div style={{ border: `1px dashed ${color?.color}` }} {...getRootProps({ className: 'dropzone' })}>
//                                     <input {...getInputProps()} />
//                                     <div className='flex flex-row justify-around items-center'>
//                                         <IconButton placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} style={{ background: color?.color }} size="sm" className="mx-1 p-1">
//                                             <AddIcon
//                                                 fontSize="small"
//                                                 className='p-1'
//                                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                                             />
//                                         </IconButton>
//                                         <p dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} p-3 text-[13px] font-thin `}>انتخاب فایل مورد نظر</p>
//                                     </div>
//                                 </div>
//                                 <aside style={thumbsContainer}>
//                                     {filesAppendices.length > 0 && (
//                                         <>
//                                             <div className='w-full flex flex-col items-end justify-between md:flex-row md:items-center md:justify-around my-3'>
//                                                 <div className='w-[100%] flex flex-row justify-end'>
//                                                     <Tooltip content="آپلود گروهی" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                                                         <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             onClick={() => UploadAllAttschments()}
//                                                             size="sm"
//                                                             className="p-1 mx-1"
//                                                             style={{ background: color?.color }}
//                                                         >
//                                                             <CloudUploadIcon
//                                                                 fontSize="small"
//                                                                 className='p-1'
//                                                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                         </Button>
//                                                     </Tooltip>

//                                                 </div>
//                                             </div>
//                                             <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={'w-[100%] h-[300px] mx-auto relative rounded-lg  p-0 my-3 overflow-auto'}>
//                                                 <table dir="rtl" className={"w-full relative text-center max-h-[350px] rounded-lg"}>
//                                                     <thead className='sticky border-b-2 z-[9999] top-0 left-0 w-full'>
//                                                         <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     تصویر مدرک
//                                                                 </Typography>
//                                                             </th>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     اطلاعات مدرک
//                                                                 </Typography>
//                                                             </th>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     توضیحات
//                                                                 </Typography>
//                                                             </th>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     عملیات
//                                                                 </Typography>
//                                                             </th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>

//                                                         {filesListAppendices}
//                                                     </tbody>
//                                                 </table>

//                                             </CardBody>
//                                         </>
//                                     )}
//                                 </aside>
//                             </section>
//                         </div>
//                         <div className='w-full flex flex-col items-end justify-between md:flex-row md:items-center md:justify-around my-3'>
//                             <div className='w-[100%] flex flex-row justify-end'>
//                                 <Tooltip content="دانلود گروهی" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                                     <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                         onClick={() => DownloadAllAttschments()}
//                                         size="sm"
//                                         className="p-1 mx-1"
//                                         style={{ background: color?.color }}
//                                     >
//                                         <CloudDownload
//                                             fontSize="small"
//                                             className='p-1'
//                                             onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                             onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                     </Button>
//                                 </Tooltip>

//                             </div>
//                         </div>
//                         <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-[98%] lg:w-[96%] md:h-[40vh] h-[350px] mx-auto relative rounded-lg overflow-auto p-0' >
//                             {loadings.loadingAttachmentList == false ? newDocumentState.attachmentsTableListItems.length > 0 && (
//                                 <table dir='rtl' className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-[100%] relative text-center max-h-[360px] md:max-h-[41vh] `}>
//                                     <thead className='sticky border-b-2 z-[9999] top-0 left-0 w-full'>
//                                         <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                     variant="small"
//                                                     color="blue-gray"
//                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                 >
//                                                     #
//                                                 </Typography>
//                                             </th>
//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                     variant="small"
//                                                     color="blue-gray"
//                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                 >
//                                                     تاریخ
//                                                 </Typography>
//                                             </th>

//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                     variant="small"
//                                                     color="blue-gray"
//                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                 >
//                                                     پیوست کننده
//                                                 </Typography>
//                                             </th>

//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                     variant="small"
//                                                     color="blue-gray"
//                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                 >
//                                                     نام
//                                                 </Typography>
//                                             </th>

//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                     variant="small"
//                                                     color="blue-gray"
//                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                 >
//                                                     عملیات
//                                                 </Typography>
//                                             </th>
//                                             <th style={{ borderBottomColor: color?.color }}
//                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                             >
//                                                 <Tooltip content="انتخاب تمام موارد" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                                                     <Checkbox 
//                                                         onChange={() => {
//                                                             setSelectedAppendices((state) => ({ ...state, isActive: !state.isActive })),
//                                                                 setNewDocumentState((state) => ({
//                                                                     ...state,
//                                                                     attachmentsTableListItems: state.attachmentsTableListItems.map((p: AttachmentsTableListModel) => ({
//                                                                         ...p,
//                                                                         isActive: !p.isActive,
//                                                                     }))
//                                                                 }));
//                                                         } }
//                                                         crossOrigin=""
//                                                         name="type"
//                                                         color='blue-gray'
//                                                         className="p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    />
//                                                 </Tooltip>

//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody key={"tbody"} className={`w-[100%] divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                         {newDocumentState.attachmentsTableListItems.length > 0 && newDocumentState.attachmentsTableListItems.map((option: AttachmentsTableListModel, index: number) => {
//                                             return (
//                                                 <>
//                                                     <tr style={{ height: "40px" }} key={"attachTable" + index} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none relative hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                         <td style={{ width: '5%' }} className='p-1'>
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[700] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 {Number(index + 1)}
//                                                             </Typography>
//                                                         </td>
//                                                         <td style={{ width: '15%' }} className='p-1'>
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 {option.createDate !== '' ? moment(option.createDate, 'YYYY/MM/DD HH:mm:ss').format("jYYYY/jMM/jDD HH:mm:ss") : ''}
//                                                             </Typography>
//                                                         </td>
//                                                         <td style={{ width: '5%' }} className='p-1'>
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[500] text-[13px] whitespace-nowrap p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 {option.creator}
//                                                             </Typography>
//                                                         </td>
//                                                         <td className='p-1'>
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[500] text-[13px] whitespace-nowrap p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 {option.fileTitle}
//                                                             </Typography>
//                                                         </td>

//                                                         <td style={{ width: "7%" }} className='p-1'>
//                                                             <div className='container-fluid mx-auto p-0.5'>
//                                                                 <div className="flex flex-row justify-evenly">
//                                                                     <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                         size="sm"
//                                                                         className="p-1 mx-1"
//                                                                         style={{ background: color?.color }}
//                                                                         onClick={() => DeleteAttachment(option)}
//                                                                     >
//                                                                         <DeleteIcon
//                                                                             fontSize="small"
//                                                                             className='p-1'
//                                                                             onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                             onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                     </Button>
//                                                                     <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                         size="sm"
//                                                                         className="p-1 mx-1"
//                                                                         style={{ background: color?.color }}
//                                                                         onClick={() => DownloadFile(option)}
//                                                                     >
//                                                                         <CloudDownload
//                                                                             fontSize="small"
//                                                                             className='p-1'
//                                                                             onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                             onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                     </Button>
//                                                                     {VideoTypes.includes(option.fileType) ? (

//                                                                         <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             size="sm"
//                                                                             className="p-1 mx-1"
//                                                                             style={{ background: color?.color }}
//                                                                             onClick={() => { videoRef.current = option, handleViewVideoAttachment() }}

//                                                                         >
//                                                                             <PlayArrowIcon
//                                                                                 fontSize="small"
//                                                                                 className='p-1'
//                                                                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                         </Button>
//                                                                     )

//                                                                         : (<Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             size="sm"
//                                                                             className="p-1 mx-1"
//                                                                             style={{ background: color?.color }}
//                                                                             onClick={() => ViewFile(option)}
//                                                                         >
//                                                                             <VisibilityIcon
//                                                                                 fontSize="small"
//                                                                                 className='p-1'
//                                                                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                         </Button>)}
//                                                                     <Popover placement="bottom">
//                                                                         <PopoverHandler>
//                                                                             <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                 size="sm"
//                                                                                 className="p-1 mx-1"
//                                                                                 style={{ background: color?.color }}
//                                                                             >

//                                                                                 <Tooltip content="اطلاعات تکمیلی" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                                                                                     <InfoIcon
//                                                                                         fontSize="small"
//                                                                                         className='p-1'
//                                                                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                                 </Tooltip>
//                                                                             </Button>
//                                                                         </PopoverHandler>
//                                                                         <PopoverContent placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="z-[9999] border-none py-[10px] bg-blue-gray-600 text-white" dir="rtl">
//                                                                             توضیحات : {option.description ?? "-"}
//                                                                         </PopoverContent>
//                                                                     </Popover>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                         <td style={{ width: "4%" }} className='p-1'>
//                                                             <Checkbox
//                                                                 onChange={() => { option.isActive = !option.isActive, setNewDocumentState((state) => ({ ...state, attachmentsTableListItems: [...state.attachmentsTableListItems] })); } }
//                                                                 checked={selectedAppendices.isActive || option.isActive}
//                                                                 crossOrigin=""
//                                                                 name="type"
//                                                                 color='blue-gray'
//                                                                 className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            />

//                                                         </td>
//                                                     </tr>
//                                                 </>
//                                             )
//                                         })}
//                                     </tbody>

//                                 </table>) : <TableSkeleton />}
//                         </CardBody>
//                     </TabPanel>
//                     <TabPanel className='h-full' value="references">
//                         <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={'w-[95%] h-[68vh]  md:w-[90%] mx-auto relative rounded-lg p-0 my-3 ' + (loadings.loadingForwardsList == true ? " overflow-hidden" : " overflow-auto")}>
//                             {loadings.loadingForwardsList == false ? newDocumentState.forwardsTableListItems && (<table dir='rtl' className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[69vh] `}>
//                                 <thead >
//                                     <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                         <th style={{ borderBottomColor: color?.color }}
//                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                         >
//                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                 variant="small"
//                                                 color="blue-gray"
//                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                             >
//                                                 #
//                                             </Typography>
//                                         </th>
//                                         <th style={{ borderBottomColor: color?.color }}
//                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                         >
//                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                 variant="small"
//                                                 color="blue-gray"
//                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                             >
//                                                 تاریخ
//                                             </Typography>
//                                         </th>

//                                         <th style={{ borderBottomColor: color?.color }}
//                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                         >
//                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                 variant="small"
//                                                 color="blue-gray"
//                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                             >
//                                                 فرستنده
//                                             </Typography>
//                                         </th>

//                                         <th style={{ borderBottomColor: color?.color }}
//                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                         >
//                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                 variant="small"
//                                                 color="blue-gray"
//                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                             >
//                                                 گیرنده
//                                             </Typography>
//                                         </th>

//                                         <th style={{ borderBottomColor: color?.color }}
//                                             className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                         >
//                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                 variant="small"
//                                                 color="blue-gray"
//                                                 className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                             >
//                                                 عملیات
//                                             </Typography>
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 {newDocumentState.forwardsTableListItems.length > 0 && (<tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                     {newDocumentState.forwardsTableListItems.map((item: ForwardsListModel, index: number) => {
//                                         return (
//                                             <>
//                                                 <tr style={{ height: "40px" }} key={"forward" + index} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                     <td style={{ width: '5%' }} className='p-1'>
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[700] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             {Number(index + 1)}
//                                                         </Typography>
//                                                     </td>
//                                                     <td style={{ width: '15%' }} className='p-1'>
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[500] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             {item.createDate !== '' ? moment(item.createDate, 'YYYY/MM/DD HH:mm:ss').format("jYYYY/jMM/jDD HH:mm:ss") : ""}
//                                                         </Typography>
//                                                     </td>
//                                                     <td style={{ width: '5%' }} className='p-1'>
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[500] text-[13px] whitespace-nowrap p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             {item.senderFaName}
//                                                         </Typography>
//                                                     </td>
//                                                     <td className='p-1'>
//                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                             variant="small"
//                                                             color="blue-gray"
//                                                             className={`font-[500] text-[13px] whitespace-nowrap p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                         >
//                                                             {item.forwardTarget.length > 0 ? item.forwardTarget.map((option: ForwardTargetModel, num: number) => {
//                                                                 return (option.receiverFaName + ` ,`)
//                                                             }) : "-"}
//                                                         </Typography>
//                                                     </td>

//                                                     <td style={{ width: item.forwardAttachments && item.forwardAttachments.length != 0 ? "7%" : "4%" }} className='p-1'>
//                                                         <div className='container-fluid mx-auto p-0.5'>
//                                                             <div className="flex flex-row justify-evenly">
//                                                                 <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     size="sm"
//                                                                     className="p-1 mx-1"
//                                                                     style={{ background: color?.color }}
//                                                                 >
//                                                                     <DeleteIcon onClick={() => DeleteReference(item)}
//                                                                         fontSize="small"
//                                                                         className='p-1'
//                                                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                 </Button>
//                                                                 {item.forwardAttachments && item.forwardAttachments.length != 0 && (<Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     size="sm"
//                                                                     className="p-1 mx-1"
//                                                                     style={{ background: color?.color }}
//                                                                     onClick={() => ViewAttachmentsList(item.forwardAttachments)}
//                                                                 >
//                                                                     <AttachFileIcon
//                                                                         fontSize="small"
//                                                                         className='p-1'
//                                                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                 </Button>)}
//                                                                 <Popover placement="bottom">
//                                                                     <PopoverHandler>
//                                                                         <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             size="sm"
//                                                                             className="p-1 mx-1"
//                                                                             style={{ background: color?.color }}
//                                                                         >

//                                                                             <Tooltip content="اطلاعات تکمیلی" className={themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
//                                                                                 <InfoIcon
//                                                                                     fontSize="small"
//                                                                                     className='p-1'
//                                                                                     onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                     onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                             </Tooltip>
//                                                                         </Button>
//                                                                     </PopoverHandler>
//                                                                     <PopoverContent placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="flex-col z-[9999] border-none py-[10px] bg-blue-gray-600 text-white" dir="rtl">
//                                                                         <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="w-full text-[12px] opacity-90 font-[400]">توضیحات : {item.desc ?? "-"}</Typography>
//                                                                     </PopoverContent>
//                                                                 </Popover>


//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                 </tr>

//                                             </>
//                                         );
//                                     })}
//                                 </tbody>)}

//                             </table>) : <TableSkeleton />}
//                             <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size='lg' className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openAttachment} handler={handleAttachment}>
//                                 <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} text-[25px]`}>ضمائم ارجاع</DialogHeader>
//                                 <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                     <table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-[95%] md:w-[90%] mx-auto relative text-center max-h-[400px]`}>
//                                         <thead >
//                                             <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                     >
//                                                         #
//                                                     </Typography>
//                                                 </th>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                     >
//                                                         عنوان
//                                                     </Typography>
//                                                 </th>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                     >
//                                                         توضیحات
//                                                     </Typography>
//                                                 </th>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                     >
//                                                         عملیات
//                                                     </Typography>
//                                                 </th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                             {newDocumentState.attachments.length > 0 && newDocumentState.attachments.map((item: ForwardAttachmentsModel, index: number) => {
//                                                 return (
//                                                     <tr key={"Attachments" + index} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                         <td style={{ width: '5%' }} className='p-1'>
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[700] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 {Number(index) + Number(1)}
//                                                             </Typography>
//                                                         </td>
//                                                         <td className='p-1'>
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 {item.attachmentTitle}
//                                                             </Typography>
//                                                         </td>
//                                                         <td className='p-1'>
//                                                             <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                 variant="small"
//                                                                 color="blue-gray"
//                                                                 className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                             >
//                                                                 {item.attachmentDesc}
//                                                             </Typography>
//                                                         </td>
//                                                         <td style={{ width: "5%" }} className='p-1'>
//                                                             <div className='container-fluid mx-auto p-0.5'>
//                                                                 <div className="flex flex-row justify-evenly">
//                                                                     <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                         size="sm"
//                                                                         className="p-1 mx-1"
//                                                                         style={{ background: color?.color }}
//                                                                     >
//                                                                         <VisibilityIcon
//                                                                             fontSize="small"
//                                                                             onClick={() => ViewReferenceAttachment(item)}
//                                                                             className='p-1'
//                                                                             onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                             onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                     </Button>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 )
//                                             })}
//                                         </tbody>
//                                     </table>
//                                 </DialogBody>
//                             </Dialog>
//                             <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={` ${themeMode?.stateMode ? 'cardDark' : 'cardLight'} overflow-x-auto m-auto`} size="xxl" open={open} handler={handleViewAttachment}>
//                                 <figure className='h-full w-full'>
//                                     {newDocumentState.file?.fileType == "image/jpg"
//                                         ? (<Image className='w-full h-full' src={newDocumentState.attachmentImg} alt="view-attachment" width={100} height={100} />) : (<iframe className='w-full h-full' src={newDocumentState.attachmentImg} ></iframe>)}
//                                 </figure>

//                                 <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                     <ButtonComp onClick={handleViewAttachment}>بستن</ButtonComp>
//                                 </DialogFooter>
//                             </Dialog>
//                             <Dialog placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className={`${themeMode?.stateMode ? 'cardDark' : 'cardLight'} overflow-x-auto m-auto flex justify-center items-center`} size="xxl" open={openVideo} handler={handleViewVideoAttachment}>
//                                 <video width="960" height="640" autoPlay={true} controls={true}>
//                                     <source src={`${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getappendixvideostream?Id=${videoRef.current?.id}&AttachmentType=${videoRef.current?.attachmentTypeId}`} type="video/mp4" />
//                                     <source src={`${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getappendixvideostream?Id=${videoRef.current?.id}&AttachmentType=${videoRef.current?.attachmentTypeId}`} type="video/mp4" />
//                                 </video>
//                                 <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                     <ButtonComp onClick={handleViewVideoAttachment}>بستن</ButtonComp>
//                                 </DialogFooter>
//                             </Dialog>
//                         </CardBody>
//                     </TabPanel>

//                     <TabPanel className='h-full' value="relatedDocument">
//                         <section className="w-full">
//                             <div className="container-fluid">
//                                 <div className="flex flex-row flex-wrap">
//                                     <section className='w-full mb-3'>
//                                         {loadings.loadingKeywords == false ? <CreatableSelect
//                                             maxMenuHeight={250}
//                                             isRtl
//                                             isMulti
//                                             className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`}
//                                             placeholder="کلیدواژه"
//                                             name="keywords"
//                                             onChange={(newValue: MultiValue<KeywordModel>, actionMeta: ActionMeta<KeywordModel>) => {
//                                                 handleAddKeywordSelected(actionMeta.option ? actionMeta!.option.label : actionMeta!.removedValue!.label)
//                                             }}
//                                             value={selectedKeywords}
//                                             options={newDocumentState.keywords}
//                                             theme={(theme) => ({
//                                                 ...theme,
//                                                 height: 10,
//                                                 borderRadius: 5,
//                                                 colors: {
//                                                     ...theme.colors,
//                                                     color: '#607d8b',
//                                                     neutral10: `${color?.color}`,
//                                                     primary25: `${color?.color}`,
//                                                     primary: '#607d8b',
//                                                     neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                     neutral80: "white"
//                                                 },
//                                             })}
//                                         /> : < InputSkeleton />}
//                                         <section className='flex flex-col md:flex-row gap-3 mt-5'>
//                                             <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-[95%] h-[220px] md:w-[90%] mx-auto relative rounded-lg overflow-auto p-0 my-3'>
//                                                 {loadings.loadingRelatedDocList == false ? <table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[280px] `}>
//                                                     <thead>
//                                                         <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     قبلی
//                                                                 </Typography>
//                                                             </th>

//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     <IconButton placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="flex justify-center items-center mx-auto p-1" onClick={() => { handleAddKeyword(), setNewDocumentState((state) => ({ ...state, NextRelation: false })) }} style={{ background: color?.color }} size="sm">
//                                                                         <AddIcon fontSize='small' className="p-1" />
//                                                                     </IconButton>
//                                                                 </Typography>
//                                                             </th>

//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                         {newDocumentState.relatedDocsTableListItems &&
//                                                             newDocumentState.relatedDocsTableListItems.relatedDocs?.filter((item: RelatedDocsModel) => item.isNext == false).map((item: RelatedDocsModel, index: number) => {

//                                                                 return (
//                                                                     <tr key={"related" + index} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                                         <td className='p-1'>
//                                                                             <div className="flex flex-row justify-around">
//                                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     variant="small"
//                                                                                     color="blue-gray"
//                                                                                     className={`font-[500] text-[13px] whitespace-nowrap p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                                 >
//                                                                                     {item.docTypeTitle}

//                                                                                 </Typography>
//                                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     variant="small"
//                                                                                     color="blue-gray"
//                                                                                     className={`font-[500] text-[13px] whitespace-nowrap p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                                 >
//                                                                                     {item.relatedDocIndicator}
//                                                                                 </Typography>
//                                                                                 <Typography placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     variant="small"
//                                                                                     color="blue-gray"
//                                                                                     className={`font-[500] text-[13px] whitespace-nowrap p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                                 >
//                                                                                     {item.docRelationType}
//                                                                                 </Typography>

//                                                                             </div>
//                                                                         </td>

//                                                                         <td style={{ width: '7%' }} className='p-1'>
//                                                                             <div className='container-fluid mx-auto p-0.5'>
//                                                                                 <div className="flex flex-row justify-evenly">
//                                                                                     <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={() => DeleteRelated(item.id)}
//                                                                                         size="sm"
//                                                                                         className="p-1 mx-1"
//                                                                                         style={{ background: color?.color }}
//                                                                                     >
//                                                                                         <DeleteIcon
//                                                                                             fontSize="small"
//                                                                                             className='p-1'
//                                                                                             onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                             onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                                     </Button>
//                                                                                     <Button placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                         size="sm"
//                                                                                         className="p-1 mx-1"
//                                                                                         style={{ background: color?.color }}
//                                                                                         onClick={() => typeof window !== "undefined" ? window.open(`/Home/NewDocument?docheapid=${item.relatedDocHeapId}&doctypeid=${item.docTypeId}`) : null}
//                                                                                     >
//                                                                                         <VisibilityIcon
//                                                                                             fontSize="small"
//                                                                                             className='p-1'
//                                                                                             onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                             onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                                     </Button>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </td>
//                                                                     </tr>

//                                                                 )

//                                                             })
//                                                         }

//                                                     </tbody>
//                                                 </table> : < TableSkeleton />}
//                                                 <Dialog placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size='xxl' className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openKeywordModal} handler={handleAddKeyword}>
//                                                     <DialogHeader placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>انتخاب مدرک</DialogHeader>
//                                                     <DialogBody placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='overflow-scroll'>
//                                                         <section className={`${themeMode?.stateMode ? 'cardDark' : 'cardLight'} w-[95%] md:w-[90%] my-3 mx-auto`}>
//                                                             <div className="relative flex  mx-auto ">
//                                                                 <Input
//                                                                     crossOrigin=""
//                                                                     style={{ color: `${themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
//                                                                     type="text"
//                                                                     label="search"
//                                                                     value={searchValue}
//                                                                     onChange={(event: any) => {
//                                                                         setSearchDocTable(undefined);
//                                                                         setCount(0);
//                                                                         setSearchValue(event.target.value);
//                                                                     } }
//                                                                     className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} pr-20`}
//                                                                     containerProps={{
//                                                                         className: themeMode?.stateMode ? 'lightText' : 'darkText'
//                                                                     }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                                />
//                                                                 <Button placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     onClick={() => { SearchDocument(1) }}
//                                                                     size="sm"
//                                                                     className="!absolute right-1 top-1 rounded"
//                                                                     style={{ background: color?.color }}
//                                                                 >
//                                                                     <i className={"bi bi-search"}></i>

//                                                                 </Button>
//                                                             </div>
//                                                         </section>
//                                                         {loadings.loadingSearch == false ? searchDocTable != null && searchDocTable.length > 0 && (<table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-[95%] md:w-[90%] mx-auto relative text-center max-h-[400px]`}>
//                                                             <thead >
//                                                                 <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                                     <th style={{ borderBottomColor: color?.color }}
//                                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                     >
//                                                                         <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             variant="small"
//                                                                             color="blue-gray"
//                                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                         >
//                                                                             #
//                                                                         </Typography>
//                                                                     </th>
//                                                                     <th style={{ borderBottomColor: color?.color }}
//                                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                     >
//                                                                         <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             variant="small"
//                                                                             color="blue-gray"
//                                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                         >
//                                                                             شماره مدرک
//                                                                         </Typography>
//                                                                     </th>
//                                                                     <th style={{ borderBottomColor: color?.color }}
//                                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                     >
//                                                                         <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             variant="small"
//                                                                             color="blue-gray"
//                                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                         >
//                                                                             موضوع
//                                                                         </Typography>
//                                                                     </th>
//                                                                     <th style={{ borderBottomColor: color?.color }}
//                                                                         className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                                     >
//                                                                         <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                             variant="small"
//                                                                             color="blue-gray"
//                                                                             className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                         >
//                                                                             عملیات
//                                                                         </Typography>
//                                                                     </th>
//                                                                 </tr>
//                                                             </thead>
//                                                             <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                                 {searchDocTable?.map((item: UnArchiveDocList, index: number) => {
//                                                                     return (
//                                                                         <tr key={"docTable" + index} className={`${index % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                                             <td style={{ width: '5%' }} className='p-1'>
//                                                                                 <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     variant="small"
//                                                                                     color="blue-gray"
//                                                                                     className={`font-[700] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                                 >
//                                                                                     {Number(index) + Number(1)}
//                                                                                 </Typography>
//                                                                             </td>
//                                                                             <td style={{ width: '15%' }} className='p-1'>
//                                                                                 <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     variant="small"
//                                                                                     color="blue-gray"
//                                                                                     className={`font-[700] text-[13px] p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                                 >
//                                                                                     {item.indicator}
//                                                                                 </Typography>
//                                                                             </td>
//                                                                             <td className='p-1'>
//                                                                                 <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     variant="small"
//                                                                                     color="blue-gray"
//                                                                                     className={`font-[500] text-[13px] p-0.5 whitespace-nowrap ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                                 >
//                                                                                     {item.subject}
//                                                                                 </Typography>
//                                                                             </td>
//                                                                             <td style={{ width: '7%' }} className='p-1'>
//                                                                                 <Button placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size='sm' className='p-1 mx-1' onClick={() => { handleRelatedType(), setNewDocumentState((state) => ({ ...state, selectedRelation: item })) }} style={{ background: color?.color }}>
//                                                                                     <TaskIcon fontSize="small"
//                                                                                         className='p-1'
//                                                                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />

//                                                                                 </Button>
//                                                                                 <Button placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={() => typeof window !== "undefined" ? window.open(`/Home/NewDocument?docheapid=${item.docHeapId}&doctypeid=${item.docTypeId}`) : null}
//                                                                                     size="sm"
//                                                                                     className="p-1 mx-1"
//                                                                                     style={{ background: color?.color }}
//                                                                                 >
//                                                                                     <VisibilityIcon
//                                                                                         fontSize="small"
//                                                                                         className='p-1'
//                                                                                         onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                         onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                                 </Button>
//                                                                             </td>
//                                                                         </tr>
//                                                                     )
//                                                                 })}
//                                                             </tbody>


//                                                         </table>) : <TableSkeleton />}
//                                                         {count != 0 && (<section className='flex justify-center mb-0 mt-3'>
//                                                             <Stack onClick={(e: any) => { SearchDocument(e.target.innerText) }} spacing={1}>
//                                                                 <Pagination hidePrevButton hideNextButton count={count} variant="outlined" size="small" shape="rounded" />
//                                                             </Stack>
//                                                         </section>)}
//                                                     </DialogBody>
//                                                     <DialogFooter placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                                         <ButtonComp onClick={() => { handleAddKeyword(), setSearchValue(""), setSearchDocTable([]), setCount(0) }}>بستن</ButtonComp>
//                                                     </DialogFooter>
//                                                 </Dialog>
//                                                 <Dialog placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} size='xs' className={`absolute top-0 ' ${themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={openRelatedType} handler={handleRelatedType}>
//                                                     <DialogHeader placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'}`}>انتخاب نوع ارتباط</DialogHeader>
//                                                     <DialogBody placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                                         <Select2 isRtl
//                                                             maxMenuHeight={220}
//                                                             className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} w-[100%]`} placeholder="نوع ارتباط" options={[{ label: "عطف", value: 1 }, { label: "پیرو", value: 2 }, { label: "پیوست", value: 3 }, { label: "درارتباط", value: 4 }]}
//                                                             onChange={(option: any) => { setNewDocumentState((state) => ({ ...state, relationType: option })) }}
//                                                             theme={(theme) => ({
//                                                                 ...theme,
//                                                                 height: 10,
//                                                                 borderRadius: 5,
//                                                                 colors: {
//                                                                     ...theme.colors,
//                                                                     color: '#607d8b',
//                                                                     neutral10: `${color?.color}`,
//                                                                     primary25: `${color?.color}`,
//                                                                     primary: '#607d8b',
//                                                                     neutral0: `${themeMode?.stateMode ? "#1b2b39" : "#ded6ce"}`,
//                                                                     neutral80: `${themeMode?.stateMode ? "white" : "#463b2f"}`
//                                                                 },
//                                                             })}
//                                                         />
//                                                     </DialogBody>
//                                                     <DialogFooter placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-full flex flex-row flex-nowrap justify-evenly items-center'>
//                                                         <section className='flex justify-center'>
//                                                             <ButtonComponent onClick={handleRelatedType}>انصراف</ButtonComponent>
//                                                         </section>
//                                                         <section className='flex justify-center'>
//                                                             <ButtonComponent onClick={() => AddRelation()}>تائید</ButtonComponent>
//                                                         </section>
//                                                     </DialogFooter>

//                                                 </Dialog>
//                                             </CardBody>
//                                             <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='w-[95%] h-[220px] md:w-[90%] mx-auto relative rounded-lg overflow-auto p-0 my-3'>
//                                                 {loadings.loadingRelatedDocList == false ? <table dir="rtl" className={`${themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[280px] `}>
//                                                     <thead>
//                                                         <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     بعدی
//                                                                 </Typography>
//                                                             </th>

//                                                             <th style={{ borderBottomColor: color?.color }}
//                                                                 className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                             >
//                                                                 <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                 >
//                                                                     <IconButton placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="flex justify-center items-center mx-auto p-1" onClick={() => { handleAddKeyword(), setNewDocumentState((state) => ({ ...state, NextRelation: true })) }} style={{ background: color?.color }} size="sm">
//                                                                         <AddIcon fontSize='small' className="p-1" />
//                                                                     </IconButton>
//                                                                 </Typography>
//                                                             </th>

//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
//                                                         {newDocumentState.relatedDocsTableListItems &&
//                                                             newDocumentState.relatedDocsTableListItems.relatedDocs?.filter((item: RelatedDocsModel) => item.isNext == true).map((item: RelatedDocsModel, num: number) => {
//                                                                 return (
//                                                                     <tr key={num + "relatedNext"} className={`${num % 2 ? themeMode?.stateMode ? 'breadDark' : 'breadLight' : themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
//                                                                         <td className='p-1'>
//                                                                             <div className="flex flex-row justify-around">
//                                                                                 <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     variant="small"
//                                                                                     color="blue-gray"
//                                                                                     className={`font-[500] text-[13px] whitespace-nowrap p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                                 >
//                                                                                     {item.docTypeTitle}

//                                                                                 </Typography>
//                                                                                 <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     variant="small"
//                                                                                     color="blue-gray"
//                                                                                     className={`font-[500] text-[13px] whitespace-nowrap p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                                 >
//                                                                                     {item.relatedDocIndicator}
//                                                                                 </Typography>
//                                                                                 <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                     variant="small"
//                                                                                     color="blue-gray"
//                                                                                     className={`font-[500] text-[13px] whitespace-nowrap p-0.5 ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                                                 >
//                                                                                     {item.docRelationType}
//                                                                                 </Typography>

//                                                                             </div>
//                                                                         </td>

//                                                                         <td style={{ width: '7%' }} className='p-1'>
//                                                                             <div className='container-fluid mx-auto p-0.5'>
//                                                                                 <div className="flex flex-row justify-evenly">
//                                                                                     <Button placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={() => DeleteRelated(item.id)}
//                                                                                         size="sm"
//                                                                                         className="p-1 mx-1"
//                                                                                         style={{ background: color?.color }}
//                                                                                     >
//                                                                                         <DeleteIcon
//                                                                                             fontSize='small'
//                                                                                             className='p-1'
//                                                                                             onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                             onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                                     </Button>
//                                                                                     <Button placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                                                         size="sm"
//                                                                                         className="p-1 mx-1"
//                                                                                         style={{ background: color?.color }}
//                                                                                         onClick={() => typeof window !== "undefined" ? window.open(`/Home/NewDocument?docheapid=${item.relatedDocHeapId}&doctypeid=${item.docTypeId}`) : null}
//                                                                                     >
//                                                                                         <VisibilityIcon
//                                                                                             fontSize="small"
//                                                                                             className='p-1'
//                                                                                             onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                                                             onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
//                                                                                     </Button>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </td>
//                                                                     </tr>
//                                                                 )
//                                                             })}
//                                                     </tbody>
//                                                 </table> : <TableSkeleton />}
//                                             </CardBody>
//                                         </section>

//                                     </section>
//                                 </div>
//                             </div>
//                         </section>

//                     </TabPanel>
//                     <TabPanel value="content" className='overflow-x-scroll whitespace-nowrap'>
//                         {newDocumentState.ShowPassageIframe && (<iframe id="passageIframe" className="w-[800px] lg:w-[97%] min-h-[70vh] whitespace-nowrap overflow-x-scroll mx-auto" src={(newDocumentState.getDocumentData.length > 0 && newDocumentState.getDocumentData.find((item) => item.fieldName == "Passage")) && JSON.parse(newDocumentState.getDocumentData.find((item) => item.fieldName == "Passage")!.fieldValue as string)?.WordDocUrlDto.Urlsrc} >
//                         </iframe>)}
//                     </TabPanel>

//                     {
//                         newDocumentState.docTypeState?.isImportType == true && (<TabPanel value="letterImage" className='overflow-x-scroll whitespace-nowrap'>
//                             <section className="container mx-auto">
//                                 <div style={{ border: `1px dashed ${color?.color}` }} {...getRootProps({ className: 'dropzone' })}>
//                                     <input {...getInputProps()} />
//                                     <div className='flex flex-row justify-around items-center'>
//                                         <IconButton style={{ background: color?.color }} size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//                                             <AddIcon
//                                                 fontSize="small"
//                                                 onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
//                                                 onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
//                                             />
//                                         </IconButton>
//                                         <p dir='rtl' className={`${themeMode?.stateMode ? 'lightText' : 'darkText'} p-3 text-[13px] font-thin `}>انتخاب تصویر مورد نظر</p>
//                                     </div>
//                                 </div>
//                                 <aside style={thumbsContainer}>
//                                     {images.length > 0 && (<table dir="rtl" className={"w-full relative text-center max-h-[400px] rounded-lg"}>
//                                         <thead>
//                                             <tr className={themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
//                                                         تصویر مدرک
//                                                     </Typography>
//                                                 </th>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
//                                                         اطلاعات مدرک
//                                                     </Typography>
//                                                 </th>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                     >
//                                                         توضیحات
//                                                     </Typography>
//                                                 </th>
//                                                 <th style={{ borderBottomColor: color?.color }}
//                                                     className={`${themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
//                                                 >
//                                                     <Typography placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
//                                                         variant="small"
//                                                         color="blue-gray"
//                                                         className={`font-[700] text-[12px] p-1.5 leading-none ${themeMode?.stateMode ? 'lightText' : 'darkText'}`}
//                                                     >
//                                                         عملیات
//                                                     </Typography>
//                                                 </th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className={`divide-y divide-${themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>

//                                             {Images}
//                                         </tbody>
//                                     </table>)}
//                                 </aside>
//                             </section>
//                             <section className="w-[800px] lg:w-full h-[70vh] mx-auto my-2 ">
//                                 {loadings.loadingImageImport == false ?
//                                     <iframe className="w-full h-full " src={newDocumentState.importImage != null ? newDocumentState.importImage : ""} >
//                                     </iframe> : <IframeSkeleton />}
//                             </section>
//                         </TabPanel>)
//                     }
//                 </TabsBody >
//             </Tabs >
//         </>
//     )
// }
// export default NewDocumentComponent