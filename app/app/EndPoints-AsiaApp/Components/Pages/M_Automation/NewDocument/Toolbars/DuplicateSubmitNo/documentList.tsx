'use client'
import { CardBody } from '@material-tailwind/react'
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from 'jalali-moment';
import { ActionButton, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import { Icon } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import { ExistDocListModel } from '@/app/Domain/M_Automation/NewDocument/toolbars';
import { ExistContext } from './mainContainer';
import { useContext } from 'react';

const DocumentList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const {docs} = useContext(ExistContext)
    return (
        <CardBody className={'h-auto max-h-[40vh] mx-auto relative rounded-lg p-0 overflow-hidden '}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
            {docs.length > 0 && (
                <table dir="rtl" className={`w-full relative text-center h-auto max-h-[41vh] ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                    <thead className='sticky z-[30] top-0 left-0 w-full'>
                        <tr className={!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}>
                            <Th value='#' />
                            <Th value='تاریخ ایجاد' />
                            <Th value='تاریخ صادره' />
                            <Th value='فرستنده' />
                            <Th value='موضوع' />
                            <Th value='عملیات' />
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {docs.map((item: ExistDocListModel, index: number) => {
                            return (
                                <tr key={'ExistDoc' + index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                    <Td style={{ width: '3%' }} value={Number(index + 1)} />
                                    <Td style={{ width: '21%' }} value={item.createDate !== '' ? moment(item.createDate, 'YYYY/MM/DD HH:mm:ss').format("jYYYY/jMM/jDD HH:mm:ss") : ''} />
                                    <Td style={{ width: '21%' }} value={item.submitDate !== '' ? moment(item.submitDate, 'YYYY/MM/DD HH:mm:ss').format("jYYYY/jMM/jDD HH:mm:ss") : ''} />
                                    <Td style={{ width: '21%' }} value={item.sender} />
                                    <Td style={{ width: '21%' }} value={item.subject} />
                                    <Td style={{ width: '3%' }} value={<>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <ActionButton onClick={() => window.open(`/Home/NewDocument?docheapid=${item.docHeapId}&doctypeid=4`)} >
                                                    <Icon Name={VisibilityIcon} />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    </>} />
                                </tr>
                            )
                        })}
                    </tbody>
                </table>)}
        </CardBody>
    )
}
export default DocumentList