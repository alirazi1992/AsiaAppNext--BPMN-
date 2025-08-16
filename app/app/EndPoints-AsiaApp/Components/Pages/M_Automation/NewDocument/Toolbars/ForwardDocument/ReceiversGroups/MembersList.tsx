'use client'
import { CardBody, Checkbox, Tooltip } from '@material-tailwind/react'
import React, { forwardRef, useContext, useImperativeHandle } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore'
import { Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import { ReceiversContext } from './MainContainer';
import { ReceiverGroupMembersModel } from '@/app/Domain/M_Automation/NewDocument/toolbars';

const MembersList = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const { members, setMembers, setForwardReceivers } = useContext(ReceiversContext)

    useImperativeHandle(ref, () => ({
        SetMembers: (item: ReceiverGroupMembersModel[]) => {
            setMembers((prev: ReceiverGroupMembersModel[]) => ([...prev, ...item]))
        }
    }))

    return (
        <CardBody className={'h-auto w-full mx-auto relative rounded-lg p-0 overflow-hidden'}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
            <table dir="rtl" className={`w-full relative text-center h-auto max-h-[41vh] ${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                <thead className='sticky z-[30] top-0 left-0 w-full'>
                    <tr className={!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}>
                        <Th style={{ width: '3%' }} value='#' />
                        <Th style={{ width: '94%' }} value='عنوان' />
                        <Th style={{ width: '3%' }} value={
                            <Tooltip content="انتخاب تمام موارد" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                                <Checkbox
                                    onChange={(e) => {
                                        members.forEach((receiver: ReceiverGroupMembersModel) => {
                                            receiver.isChecked = e.target.checked;
                                        });
                                        setMembers([...members]);
                                        setForwardReceivers((prev: ReceiverGroupMembersModel[]) => {
                                            const existingActorIds = prev.map((receiver: ReceiverGroupMembersModel) => receiver.actorId);
                                            return [...prev.filter((item) => item.IsGroup == false), ...members.filter((item: ReceiverGroupMembersModel) => !existingActorIds.includes(item.actorId))
                                                .filter((item: ReceiverGroupMembersModel) => item.isChecked)
                                            ];
                                        });
                                    } }
                                    crossOrigin=""
                                    name="type"
                                    color='blue-gray'
                                    className="p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                />
                            </Tooltip>
                        } />
                    </tr>
                </thead>
                <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                    {members.map((item: ReceiverGroupMembersModel, index: number) => {
                        return (
                            <tr key={item.id.toString()} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                <Td style={{ width: '3%' }} value={Number(index + 1)} />
                                <Td style={{ width: '94%' }} value={item.actorName} />
                                <Td style={{ width: '3%' }} value={<>
                                    <Checkbox
                                        onChange={(e) => {
                                            item.isChecked = e.target.checked;
                                            setMembers([...members]);
                                            setForwardReceivers((prev: ReceiverGroupMembersModel[]) => ([...prev.filter((item) => item.IsGroup == false), ...members.filter((item: ReceiverGroupMembersModel) => item.isChecked)]));
                                        } }
                                        checked={item.isChecked}
                                        crossOrigin=""
                                        name="type"
                                        color='blue-gray'
                                        className="size-3 p-0 transition-all hover:before:opacity-0" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    />
                                </>} />
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </CardBody>
    )
})
MembersList.displayName = 'MembersList'
export default MembersList