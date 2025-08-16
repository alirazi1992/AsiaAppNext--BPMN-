'use client';
import React, { useContext, useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CardBody, Typography } from '@material-tailwind/react';
import AddIcon from '@mui/icons-material/Add';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from "@/app/hooks/useStore";
import { KeywordsContext } from './MainContainers';
import { RelatedDocsModel } from '@/app/Domain/M_Automation/NewDocument/Keywords';
import { RemovingRelation } from '@/app/Application-AsiaApp/M_Automation/NewDocument/RemoveRelation';
import { DataContext } from '../NewDocument-MainContainer';
import { LoadingModel } from '@/app/Domain/shared';
import { ActionButton, Icon, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import SearchDocs from '@/app/EndPoints-AsiaApp/Components/Shared/SearchDocs/MainContainer';

export const RelatedDocsTable: React.FC<any> = ({ title, isNext }) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const { RemoveRelationfromList } = RemovingRelation()
    const { relatedDocs, setLoadings } = useContext(KeywordsContext)
    const { docheapId } = useContext(DataContext)
    const DialogRef = useRef<{ handleOpen: () => void, setItems: (isNext: boolean) => void }>(null);

    const handleRemoveRelation = async (id: number) => {
        let index = relatedDocs!.indexOf(relatedDocs!.find((item: RelatedDocsModel) => item.id == id)!)
        const res = await RemoveRelationfromList(id, docheapId).then((res) => {
            setLoadings((state: LoadingModel) => ({ ...state, response: true }))
            if (res) {
                setLoadings((state: LoadingModel) => ({ ...state, response: false }));
                if (typeof res == 'boolean' && res == true) {
                    relatedDocs?.splice(index, 1)
                }
            }
        })
    }

    return (
        <>
            <CardBody className={'h-[45vh] 2xl:h-[65vh] mx-auto relative rounded-lg p-0 overflow-auto '} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <table dir='rtl' className={`w-full relative text-center max-h-[46vh] 2xl:max-h-[67vh]  ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                    <thead>
                        <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <Th value={title} />
                            <Th style={{ minWidth: '80px', width: '10%' }} value={<>
                                <ActionButton onClick={() => { if (DialogRef.current) { DialogRef.current.handleOpen(), DialogRef.current.setItems(isNext) } }} style={{ background: color?.color }}>
                                    <Icon Name={AddIcon} />
                                </ActionButton>
                            </>} />
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {relatedDocs?.filter((item: RelatedDocsModel) => item.isNext == isNext).map((item: RelatedDocsModel, num: number) => (
                            <tr key={num} className={(num % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight') + ' border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75'}>
                                <Td value={<div className="flex flex-row justify-around">
                                    <Typography variant="small" color="blue-gray" className={`font-body text-sm whitespace-nowrap p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        {item.docTypeTitle}
                                    </Typography>
                                    <Typography variant="small" color="blue-gray" className={`font-body text-sm whitespace-nowrap p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        {item.relatedDocIndicator}
                                    </Typography>
                                    <Typography variant="small" color="blue-gray" className={`font-body text-sm whitespace-nowrap p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        {item.docRelationType}
                                    </Typography>
                                </div>} />
                                <Td style={{ minWidth: '80px', width: '10%' }} value={
                                    <div className='container-fluid mx-auto p-0.5'>
                                        <div className="flex flex-row justify-evenly">
                                            <ActionButton onClick={() => handleRemoveRelation(item.id)}>
                                                <Icon Name={DeleteIcon} />
                                            </ActionButton>
                                            <ActionButton onClick={() => window.open(`/Home/NewDocument?docheapid=${item.relatedDocHeapId}&doctypeid=${item.docTypeId}`)}>
                                                <Icon Name={VisibilityIcon} />
                                            </ActionButton>
                                        </div>
                                    </div>
                                } />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>
            <SearchDocs ref={DialogRef} />
        </>
    );
};
