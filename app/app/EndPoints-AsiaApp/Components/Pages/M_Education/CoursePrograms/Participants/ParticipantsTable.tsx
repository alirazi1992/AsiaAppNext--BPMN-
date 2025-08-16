'use client';
import React, { createContext, useContext, useRef, useState } from 'react';
import { GetCertificateAttachment, InitializeParticipantsState, ProgramParticipantsModel } from '@/app/Domain/M_Education/Participant'
import { CardBody, Tooltip } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import PrintIcon from '@mui/icons-material/Print';
import PublishIcon from '@mui/icons-material/Publish';
import { useCerificates } from '@/app/Application-AsiaApp/M_Education/fetchCertificatePdf';
import DeleteIcon from '@mui/icons-material/Delete';
import { loading } from '@/app/Application-AsiaApp/Utils/shared';
import DialogLoading from '@/app/components/shared/DialogLoadings';
import ViewCertificate from './ViewCertificate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import { useCertificate } from '@/app/Application-AsiaApp/M_Education/AddParticipantCertificate';
import { ActionButton, Icon, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import { ParticipantContext } from './Participants';
import * as yup from "yup";
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ViewCertificateAttachment from './ViewCerificateAttachment';
import { useCertificateAttachment } from '@/app/Application-AsiaApp/M_Education/fetchCertificateAttachment';
export const ParticipantsListContext = createContext<any>(null)
const ParticipantsTable: React.FC<any> = ({ data, IssueCerificate, RemoveParticipant }) => {
    const themeMode = useStore(themeStore, (state) => state);
    const [loadings, setLoadings] = useState(loading);
    const { fetchCertificatePdf } = useCerificates()
    const { fetchCertificateAttachments } = useCertificateAttachment()
    const { AddCertificate } = useCertificate()
    const schema = yup.object().shape({
        participantsId: yup.number().required()
    })
    const {
        register,
        handleSubmit,
        reset,
        trigger,
        getValues,
        watch,
        setValue,
        formState,
    } = useForm<{ participantsId: number }>(
        {
            defaultValues: {
                participantsId: 0
            }, mode: 'all',
            resolver: yupResolver(schema) as Resolver<{ participantsId: number }>
        }
    );
    const errors = formState.errors;

    const { state, setState } = useContext(ParticipantContext)
    const [certData, setCertData] = useState<string>('')

    const Ref = useRef<{ handleOpen: () => void }>(null);
    const AttachmentRef = useRef<{ handleOpenAttachment: () => void }>(null);
    const GetPdfCertificates = async (id: number) => {
        setLoadings((state) => ({ ...state, response: true }))
        const res = await fetchCertificatePdf(id).then((res) => {
            if (res != null) {
                setLoadings((state) => ({ ...state, response: false }))
                if (Ref && Ref.current) {
                    setCertData(res)
                    Ref.current.handleOpen()
                }
            }
            return
        })
    }
    const [result, setResult] = useState<GetCertificateAttachment | null>(null)
    const GetCertificateAttachment = async (id: number) => {
        setLoadings((state) => ({ ...state, response: true }))
        const res = await fetchCertificateAttachments(id).then((res) => {
            if (res) {
                setLoadings((state) => ({ ...state, response: false }))
                if (typeof res == 'object') {
                    if (AttachmentRef && AttachmentRef.current) {
                        setResult(res)
                        AttachmentRef.current.handleOpenAttachment()
                    }
                }
            }
            return
        })
    }

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop: (incomingFiles) => handleDrop(incomingFiles),
        accept: {
            'application/pdf': []
        }
    });

    const handleDrop = async (incomingFiles: File[]) => {
        if (incomingFiles.length > 0) {
            const file = incomingFiles[0];
            const fileContent = await ReadFileAsync(file);
            const res = await AddCertificate(fileContent.split(',')[1], file.name, file.type, getValues('participantsId')).then((result) => {
                if (result) {
                    let newParticipents = [...state.participants]
                    let select = newParticipents.find((item) => item.id == getValues('participantsId'))
                    let index = newParticipents.indexOf(select)
                    newParticipents.splice(index, 1, {
                        ...select, attachmentId: result
                    })
                    setState((prev: InitializeParticipantsState) => ({ ...prev, participants: [...newParticipents] }))
                }
            }
            )
        }
    }

    async function ReadFileAsync(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result as string);
            };
            fr.onerror = (error) => {
                reject(error);
            };
            fr.readAsDataURL(file);
        });
    }

    return (
        <>   {loadings.response == true && <DialogLoading />}
            <CardBody className='relative rounded-lg overflow-auto p-0 h-[50vh] ' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <table dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[45vh] `}>
                    <thead>
                        <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <Th value={'#'} />
                            <Th value={'نام شرکت کننده'} />
                            <Th value={'نام انگلیسی شرکت کننده'} />
                            <Th value={' شماره ملی'} />
                            <Th value={'عملیات'} />
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {data?.map((item: ProgramParticipantsModel, index: number) => {
                            return (
                                <tr key={index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`} >
                                    <Td style={{ width: '3%' }} value={index + 1} />
                                    <Td value={item.faName} />
                                    <Td value={item.name} />
                                    <Td style={{ width: '15%' }} value={item.nationalCode} />
                                    <Td style={{ width: '10%' }} value={<>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                {item.certNo == null && item.attachmentId == null ?
                                                    <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} placement='top' content='issue'>
                                                        <ActionButton onClick={() => IssueCerificate(item.id)}>
                                                            <Icon Name={PublishIcon} />
                                                        </ActionButton>
                                                    </Tooltip>
                                                    : item.certNo !== null &&
                                                    <ActionButton onClick={() => GetPdfCertificates(item.certNo!)}>
                                                        <Icon Name={PrintIcon} />
                                                    </ActionButton>
                                                }
                                                {item.attachmentId == null && item.certNo == null ? <div {...getRootProps({ className: 'dropzone' })}>
                                                    <input {...getInputProps()} />
                                                    <ActionButton onClick={() => {
                                                        setValue('participantsId', item.id),
                                                            open()
                                                    }}>
                                                        <Icon Name={CloudUploadIcon} />
                                                    </ActionButton>
                                                </div> : item.attachmentId !== null &&
                                                <ActionButton onClick={() => GetCertificateAttachment(item.attachmentId!)}>
                                                    <Icon Name={PrintIcon} />
                                                </ActionButton>}
                                                <ActionButton onClick={() => RemoveParticipant(item.id!)}>
                                                    <Icon Name={DeleteIcon} />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    </>} />
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </CardBody>
            <ViewCertificate data={certData} ref={Ref} />
            <ViewCertificateAttachment data={result} ref={AttachmentRef} />
        </>
    )
}

export default ParticipantsTable