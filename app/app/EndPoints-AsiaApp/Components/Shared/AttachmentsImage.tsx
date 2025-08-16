import { AccessTypes, DocumentTypes, ExcelTypes, ImageTypes, img, PDFTypes, PowerPointTypes, VideoTypes } from "@/app/Application-AsiaApp/Utils/shared";
import { DropzoneFileModel } from "@/app/Domain/shared";
import Image from "next/image";
import DocFile from '@/app/assets/svgIcons/word.svg'
import VidFile from '@/app/assets/svgIcons/video.svg'
import PowerPoint from '@/app/assets/svgIcons/ppt.svg'
import PDF from '@/app/assets/svgIcons/pdf.svg'
import Xls from '@/app/assets/svgIcons/xls.svg'
import Access from '@/app/assets/svgIcons/access.png'

export const FileImage = ({ file }: { file: DropzoneFileModel }) => {
    const getImageSrc = () => {
        if (ImageTypes.includes(file.file.type)) {
            return { src: file.preview, alt: "putFile" };
        } else if (DocumentTypes.includes(file.file.type)) {
            return { src: DocFile, alt: "document" };
        } else if (VideoTypes.includes(file.file.type)) {
            return { src: VidFile, alt: "video" };
        } else if (PowerPointTypes.includes(file.file.type)) {
            return { src: PowerPoint, alt: "presentation" };
        } else if (PDFTypes.includes(file.file.type)) {
            return { src: PDF, alt: "pdf" };
        } else if (ExcelTypes.includes(file.file.type)) {
            return { src: Xls, alt: "excel" };
        } else if (AccessTypes.includes(file.file.type)) {
            return { src: Access, alt: "access" };
        } else if (VideoTypes.map(type => type.split('/').pop()).includes(file.file.name.split('.')[1])) {
            return { src: VidFile, alt: "video" };
        }
        return { src: '', alt: 'unknown' };
    };

    const { src, alt } = getImageSrc();

    return (
        <Image
            width={100}
            height={100}
            src={src}
            style={img}
            alt={alt}
        />
    );
};
