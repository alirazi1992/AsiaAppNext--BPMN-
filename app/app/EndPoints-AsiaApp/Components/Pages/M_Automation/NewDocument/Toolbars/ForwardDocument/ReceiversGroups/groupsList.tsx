'use client';
import { ActionButton, Icon, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import React, { useContext, useEffect } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore'
import { CardBody } from '@material-tailwind/react';
import { useGroupList } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchGroups';
import { GetGroupsModel, ReceiverGroupMembersModel } from '@/app/Domain/M_Automation/NewDocument/toolbars';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ReceiversContext } from './MainContainer';

const GroupsList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { setGroups, groups, members, setMembers } = useContext(ReceiversContext)
    const { fetchGroupsList } = useGroupList()

    useEffect(() => {
        const loadGroups = () => {
            const res = fetchGroupsList().then((result) => {
                if (result) {
                    if (Array.isArray(result)) {
                        setGroups(result)
                    }
                }
            })
        }
        loadGroups()
    }, [])

    const TotalMemebers = (items: ReceiverGroupMembersModel[]) => {
        const objectsToAdd = items.splice(0);
        members.push(...objectsToAdd);
        if (members.length > 0) {
            let f = [...items?.map((x: ReceiverGroupMembersModel) => ({ ...x, IsGroup: true }))];
            setMembers((state: ReceiverGroupMembersModel[]) => ([...state, ...items.map((x: ReceiverGroupMembersModel) => ({ ...x, IsGroup: true }))]));
        } else {
            let f = [...items?.map((x: ReceiverGroupMembersModel) => ({ ...x, IsGroup: true }))];
            setMembers([...f]);
        }
        const key = 'actorName';
        const UniqueMember = [...Array.from(new Map<string, ReceiverGroupMembersModel>(members?.map((item: ReceiverGroupMembersModel) => [item[key], item])).values())];
        setMembers(() => ([...UniqueMember]));
    }


    return (
        <CardBody className={'h-auto w-full mx-auto relative rounded-lg p-0 overflow-hidden '}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
            <table dir="rtl" className={`w-full relative text-center h-auto max-h-[41vh] ${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                <thead style={{height:'80px'}} className='sticky z-[30] top-0 left-0 w-full'>
                    <tr className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} h-full`}>
                        <Th value='#' />
                        <Th value='عنوان' />
                        <Th />
                    </tr>
                </thead>
                <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                    {groups.map((item: GetGroupsModel, index: number) => {
                        return (
                            <tr key={item.id.toString()} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                <Td style={{ width: '3%' }} value={Number(index + 1)} />
                                <Td value={item.name} />
                                <Td style={{ width: '3%' }} value={<>
                                    <div className='container-fluid mx-auto p-0.5'>
                                        <div className="flex flex-row justify-evenly">
                                            <ActionButton onClick={() => { TotalMemebers(item.receiverGroupMembers) }} >
                                                <Icon Name={ArrowBackIcon} />
                                            </ActionButton>
                                        </div>
                                    </div>
                                </>} />
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </CardBody>
    )
}

export default GroupsList