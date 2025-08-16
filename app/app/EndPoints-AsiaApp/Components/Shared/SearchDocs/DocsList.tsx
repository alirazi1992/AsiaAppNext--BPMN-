'use client'
import React, { useContext, useRef } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import { CardBody } from '@material-tailwind/react';
import TaskIcon from '@mui/icons-material/Task';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DocListModel, DocsListProps } from '@/app/Domain/searchDocs';
import { ActionButton, Icon, Td, Th } from '../TableComponent';
import SelectRelationType from '../../Pages/M_Automation/NewDocument/Keyword-RelatedDocuments/RelationType';
import { SearchDocContext } from './MainContainer';

const DocsList = () => {
    const themeMode = useStore(themeStore, (state) => state);
    const RelationRef = useRef<{ handleOpen: () => void, setDocHeapId: (docheapId: number) => void }>(null);
    const { state } = useContext(SearchDocContext)

    return (
        <>
            {state.docs.length > 0 && <CardBody className={'h-auto  mx-auto relative rounded-lg p-0 overflow-hidden '}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <table dir='rtl' className={`${!themeMode || !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center`}>
                    <thead >
                        <tr className={!themeMode || !themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <Th value='#' />
                            <Th value='شماره مدرک' />
                            <Th value='موضوع' />
                            <Th value='عملیات' />
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode || !themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {state.docs.map((item: DocListModel, index: number) => {
                            return (
                                <tr key={"docTable" + index} className={(index % 2 ? !themeMode || !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight') + ' border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75'}>
                                    <Td style={{ width: "5%" }} value={Number(index) + Number(1)} />
                                    <Td style={{ width: '15%' }} value={item.indicator} />
                                    <Td value={item.subject} />
                                    <Td style={{ width: '7%' }} value={
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <ActionButton onClick={() => { if (RelationRef.current) { RelationRef.current.handleOpen(), RelationRef.current.setDocHeapId(item.docHeapId) } }}>
                                                    <Icon Name={TaskIcon} />
                                                </ActionButton>
                                                <ActionButton onClick={() => typeof window !== "undefined" ? window.open(`/Home/NewDocument?docheapid=${item.docHeapId}&doctypeid=${item.docTypeId}`) : null}>
                                                    <Icon Name={VisibilityIcon} />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    } />
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </CardBody >}
            <SelectRelationType ref={RelationRef} />
        </>
    )
}


export default DocsList