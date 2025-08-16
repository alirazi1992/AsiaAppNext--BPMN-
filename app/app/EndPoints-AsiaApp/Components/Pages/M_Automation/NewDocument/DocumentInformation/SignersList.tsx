'use client';
import React, { useContext, useEffect } from 'react';
import { GetSignersModel } from '@/app/Domain/M_Automation/NewDocument/DocumentInformation';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataContext } from '../NewDocument-MainContainer';
import { ActionButton, Icon, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import { RemovingSignerfromList } from '@/app/Application-AsiaApp/M_Automation/NewDocument/SigneDocument';
import { LoadingModel } from '@/app/Domain/shared';
import { GetDocumentDataModel } from '@/app/Domain/M_Automation/NewDocument/NewDocument';
import { CardBody } from '@material-tailwind/react';

const SignersList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { RemoveSigner } = RemovingSignerfromList()
    const { state, setLoadings, docheapId, docTypeId, setState } = useContext(DataContext)

    const UnSigner = async (id: number) => {
        let index: number = state.signers.indexOf(state.signers.find((signer: GetSignersModel) => signer.Id == id)!)
        setLoadings((state: LoadingModel) => ({ ...state, response: true }))
        const res = await RemoveSigner(id, docheapId!, docTypeId!).then((res) => {
            setLoadings((state: LoadingModel) => ({ ...state, response: false }))
            if (res && res !== null) {
                index != -1 && state.signers?.splice(index, 1)
            }
        })
    }

    return (
        <CardBody className={`w-[99%] mx-auto p-0 rounded-lg overflow-hidden `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <table dir="rtl" className={`w-full relative text-center max-h-[400px] ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
                <thead>
                    <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                        <Th value='#' />
                        <Th value='امضاء کنندگان' />
                        <Th value='عملیات' />
                    </tr>
                </thead>
                <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                    {state.signers.length > 0 && state.signers?.map((item: GetSignersModel, index: number) => {
                        return (<tr key={index + "signers"} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                            <Td style={{ width: '5%' }} value={Number(1 + index)} />
                            <Td value={item.SignerName} />
                            <Td style={{ width: '3%' }} value={<>
                                <div className='container-fluid mx-auto p-0.5'>
                                    <div className="flex flex-row justify-evenly">
                                        {index == state.signers.length - 1 &&
                                            <ActionButton onClick={() => UnSigner(item.Id)}>
                                                <Icon Name={DeleteIcon} />
                                            </ActionButton>
                                        }
                                    </div>
                                </div>
                            </>} />
                        </tr>)
                    })}
                </tbody>
            </table>
        </CardBody>
    )
}
export default SignersList

