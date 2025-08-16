import Background from "@/app/components/shared/DatePicker/Background";
import { LoadingModel } from "@/app/Domain/shared";

export let loading: LoadingModel = {
    response: false,
    table: false,
    iframeLoading: false
}


export let initializeStateSearchDocs = {
    searchKey: '',
    totalCount: 0,
    isNext: false,
    docs: []
}


export const thumbsContainer: any = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};
export const thumb: any = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    width: 50,
    height: 50,
    padding: 4,
    boxSizing: 'border-box'
};
export const thumbInner: any = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};
export const img: any = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

export const ImageTypes: string[] = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    // "image/tiff",
    "image/svg+xml",
    "image/x-icon",
    'jpg',
    'jpeg',
    'png'
]

export const DocumentTypes: string[] = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.text",
    "application/rtf",
    "text/plain",
    "application/vnd.ms-word.document.macroEnabled.12",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document.macroEnabled.12",
    'doc',
    'docx'
];

export const PDFTypes: string[] = [
    "application/pdf",
    "application/x-pdf",
    "application/x-download",
    "application/octet-stream",
    "application/vnd.pdf",
    "application/x-bzpdf",
    "application/x-gzpdf",
    "application/pdfa",
    "application/x-pdf",
    "application/x-unknown",
    'pdf'
];


export const VideoTypes: string[] = [
    "video/ogg",
    "video/mp4",
    "video/x-matroska",
    "video/webm",
    "video/wmv",
    "audio/wmv",
    "audio/mp4",
    "audio/mpeg",
    "audio/aac",
    "audio/x-caf",
    "audio/flac",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
    "application/x-mpegURL",
]
export const PowerPointTypes: string[] = [
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.ms-powerpoint.presentation.macroEnabled.12", // .pptm
    "application/vnd.ms-powerpoint.slideshow", // .pps
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow", // .ppsx
    "application/vnd.ms-powerpoint.template.macroEnabled.12", // .potm
    "application/vnd.openxmlformats-officedocument.presentationml.template", // .potx
    "application/vnd.ms-powerpoint.addin.macroEnabled.12", // .ppam
];

export const ExcelTypes: string[] = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/x-excel",
    "application/x-msexcel",
    "application/x-dos_ms_excel",
    "application/x-excel",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.macroEnabled.12",
];

export const AccessTypes: string[] = [
    "application/vnd.ms-access",
    "application/x-msaccess",
    "application/x-access",
    "application/vnd.ms-access.database",
    "application/vnd.ms-access.application",

];

export interface AxiosProps {
    url: string,
    method: string,
    data: {},
    credentials: boolean;
}

export interface GetBranchListModel {
    id: number,
    faName: string,
    faTitle: string,
    name: string,
    title: string,
    isMain: boolean
}