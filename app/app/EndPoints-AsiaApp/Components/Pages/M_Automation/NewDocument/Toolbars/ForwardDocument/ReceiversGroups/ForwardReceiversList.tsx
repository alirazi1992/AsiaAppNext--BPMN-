'use client';
import { Card, CardBody, Checkbox, DialogFooter, Typography } from '@material-tailwind/react';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from "@/app/hooks/useStore";
import SelectOption from '@/app/EndPoints-AsiaApp/Components/Shared/SelectOption';
import { useReceiveTypes } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchReceiveTypes';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetRecieveTypesModel } from '@/app/Domain/M_Automation/NewDocument/NewDocument';
import { ActionMeta, SingleValue } from 'react-select';
import { ActionButton, Icon, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import { ReceiversContext } from './MainContainer';
import { ReceiverGroupMembersModel } from '@/app/Domain/M_Automation/NewDocument/toolbars';
import { TextField } from '@mui/material';
import { DataContext } from '../../../NewDocument-MainContainer';
import ForwardDropzone from '@/app/EndPoints-AsiaApp/Components/Shared/ForwardDropzone';
import AcceptedAttachments from './AcceptedAttachments';
import { DropzoneFileModel } from '@/app/Domain/shared';
import { ForwrdDocumentContext } from '../Forward-MainContainer';
import { ToolbarContext } from '../../../NewDocument-Toolbar';

export const ForwardReceiverContext = createContext<any>(null)
const ForwardReceiverList = () => {
    const { ConfirmForwardRef, ForwardRef } = useContext(ToolbarContext)
    const { docTypeId } = useContext(DataContext)
    const { setValue, register, FileState, ReceiversState, getValues, trigger } = useContext(ForwrdDocumentContext)
    const themeMode = useStore(themeStore, (state) => state);
    const { forwardReceivers } = useContext(ReceiversContext)
    const [receiveTypes, setReceiveTypes] = useState<GetRecieveTypesModel[]>([])
    const { fetchReceiveTypes } = useReceiveTypes()
    const [file, setFile] = useState<DropzoneFileModel[]>([])
    const attachmentRef = useRef<any>(null)

    useEffect(() => {
        const loadInitialReceiveTypes = async () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const response = await fetchReceiveTypes(docTypeId).then((result) => {
                if (result) {
                    if (Array.isArray(result) && result.length > 0) {
                        setReceiveTypes(result)
                    }
                }
            });
        };
        loadInitialReceiveTypes()
    }, [docTypeId])



    const DeleteFile = (index: number) => {
        forwardReceivers.splice(index, 1)
        ReceiversState.remove(index)
    }

    useEffect(() => {
        setValue(`Forward.AddReceiver`, forwardReceivers.map((option: ReceiverGroupMembersModel, index: number) => {
            return {
                receiverActorId: option.actorId,
                title: option.actorName,
                receiveTypeId: option.receiveTypeId ?? 1,
                personalDesc: '',
                isHidden: false
            }
        }))
    }, [forwardReceivers])

    return (
        <ForwardReceiverContext.Provider value={{ file, setFile }}>
            {forwardReceivers.length > 0 && <CardBody className='w-full' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {/* <CardBody className={`${forwardReceivers.length > 0 ? `h-[${(10 * (forwardReceivers.length + 1))}vh]` : 'h-auto'} m-0 p-0 md:my-3  mx-auto relative rounded-lg overflow-y-scroll `} > */}
                <table dir='rtl' className={`${forwardReceivers.length > 0 ? `max-h-[${(15 * (forwardReceivers.length + 1))}vh]` : 'h-auto'} w-full relative text-center ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                    <thead className='sticky border-b-2 z-[88888888] top-0 left-0 w-full'>
                        <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <Th value='#' />
                            <Th value='عنوان' />
                            <Th value='جهت ' />
                            <Th value='توضیحات شخصی' />
                            <Th value='مخفی' />
                            <Th value='عملیات' />
                        </tr>
                    </thead>
                    {forwardReceivers.map((receiver: ReceiverGroupMembersModel, index: number) => {
                        return (
                            <tr style={{ height: "40px" }} key={'receivers' + index} className={(index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight') + ' border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75'}>
                                <Td style={{ width: '3%' }} value={Number(index + 1)} />
                                <Td style={{ width: '30%' }} value={receiver.actorName} />
                                <Td style={{ minWidth: '120px', width: '25%' }} value={
                                    <SelectOption
                                        isRtl={true}
                                        {...register(`Forward.AddReceiver.${index}.receiveTypeId`)}
                                        placeholder={'جهت'}
                                        loading={receiveTypes == undefined}
                                        className={`z-[${(index + 1) * 11}]`}
                                        maxMenuHeight={300}
                                        value={receiveTypes.find((p) => p.value == getValues(`Forward.AddReceiver.${index}.receiveTypeId`)) ? receiveTypes.find((p) => p.value == getValues(`Forward.AddReceiver.${index}.receiveTypeId`)) : receiveTypes.find((p) => p.value == 1)}
                                        onChange={(option: SingleValue<GetRecieveTypesModel>, actionMeta: ActionMeta<GetRecieveTypesModel>) => {
                                            setValue(`Forward.AddReceiver.${index}.receiveTypeId`, option!.id);
                                            trigger(`Forward.AddReceiver.${index}.receiveTypeId`)
                                        }}
                                        options={receiveTypes?.length ? receiveTypes : [{
                                            id: 0, value: 0, label: 'no option found',
                                            faName: 'no option found',
                                            name: 'no option found'
                                        }]}
                                    />
                                } />
                                <Td style={{ width: '45%' }} value={
                                    <TextField size='small' {...register(`Forward.AddReceiver.${index}.personalDesc`)}
                                        className='w-full lg:my-0 font-[FaLight]'
                                        InputProps={{
                                            style: { color: !themeMode || themeMode?.stateMode ? 'white' : '#463b2f' }
                                        }} />
                                } />
                                <Td style={{ width: '3%' }} value={
                                    <Checkbox crossOrigin={undefined} {...register(`Forward.AddReceiver.${index}.isHidden`)}
                                        onChange={(e) => {
                                            setValue(`Forward.AddReceiver.${index}.isHidden`, e.target.checked);
                                            trigger(`Forward.AddReceiver.${index}.isHidden`);
                                        }}
                                        color='blue-gray'
                                        className="size-3 p-0 transition-all hover:before:opacity-0" />
                                } />
                                <Td style={{ width: '7%' }} value={
                                    <div className='container-fluid mx-auto p-0.5'>
                                        <div className="flex flex-row justify-evenly">
                                            <ActionButton onClick={() => DeleteFile(index)}>
                                                <Icon Name={DeleteIcon} />
                                            </ActionButton>
                                        </div>
                                    </div>
                                } />
                            </tr>
                        );
                    })}
                </table>
                {/* </CardBody> */}
            </CardBody>}
            <Card shadow className={`${!themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight'} py-6 px-3 my-3`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Typography dir='rtl' variant="h5" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} py-4 px-6 text-right font-[500] whitespace-nowrap `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    ضمائم ارجاع
                </Typography>
                <ForwardDropzone />
                <AcceptedAttachments />
            </Card>
            <section className='my-4'>
                <textarea
                    dir='rtl'
                    onFocus={(e) => e.target.rows = 4} rows={3}
                    style={{ textIndent: '10px' }}
                    {...register(`Forward.forwardDesc`)}
                    className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused`}
                    placeholder="توضیحات ارجاع..."
                />
            </section>
        </ForwardReceiverContext.Provider>
    )
}

export default ForwardReceiverList