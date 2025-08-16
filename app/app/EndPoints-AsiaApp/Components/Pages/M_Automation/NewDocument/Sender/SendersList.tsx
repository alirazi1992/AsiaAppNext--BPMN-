'use client';
import { CardBody } from '@material-tailwind/react';
import React, { useContext } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { DataContext, ReceiversType } from '../NewDocument-MainContainer';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetMainReceiver } from '@/app/Domain/M_Automation/NewDocument/Receivers';
import { ActionButton, Icon, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';

const MainReceiverList = () => {
    const themeMode = useStore(themeStore, (state) => state);
    const { receivers, setReceivers } = useContext(DataContext)

    const DeleteSenderItem = (sender: GetMainReceiver) => {
        setReceivers((prev: ReceiversType) => ({ ...prev, senders: [...prev.senders!.filter(item => item.Id !== sender.Id)] }))
    }

    return (
        <CardBody className={'h-[50vh] m-0 p-0 md:my-3  mx-auto relative rounded-lg overflow-y-scroll '} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
            <table dir='rtl' className={`w-full relative text-center max-h-[55vh] ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                <thead className=' border-b-2 z-[999] top-0 left-0 w-full'>
                    <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                        <Th value='#' />
                        <Th value='عنوان' />
                        <Th value='عملیات' />
                    </tr>
                </thead>
                <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                    {receivers?.senders?.map((option: GetMainReceiver, index: number) => {
                        return (
                            <>
                                <tr style={{ height: "40px" }} key={'receivers' + index} className={(index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight') + ' border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75'}>
                                    <Td style={{ width: '3%' }} value={Number(index + 1)} />
                                    <Td value={option.Value} />
                                    <Td style={{ width: '4%' }} value={<>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <ActionButton onClick={() => DeleteSenderItem(option)} >
                                                    <Icon Name={DeleteIcon} />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    </>} />
                                </tr>
                            </>
                        );
                    })}
                </tbody>
            </table>
        </CardBody>
    )
}

export default MainReceiverList