'use client';
import { Button, CardBody, Typography } from '@material-tailwind/react';
import React, { useContext, useEffect, useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from "@/app/hooks/useStore";
import SelectOption from '@/app/EndPoints-AsiaApp/Components/Shared/SelectOption';
import { useReceiveTypes } from '@/app/Application-AsiaApp/M_Automation/NewDocument/fetchReceiveTypes';
import { DataContext, ReceiversType } from '../NewDocument-MainContainer';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetDocumentDataModel, GetRecieveTypesModel } from '@/app/Domain/M_Automation/NewDocument/NewDocument';
import { ActionMeta, SingleValue } from 'react-select';
import { ActionButton, Icon, Td, Th } from '@/app/EndPoints-AsiaApp/Components/Shared/TableComponent';
import { GetMainReceiver } from '@/app/Domain/M_Automation/NewDocument/Receivers';

const MainReceiverList = () => {
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state);
  const [receiveTypes, setReceiveTypes] = useState<GetRecieveTypesModel[]>([])
  const { fetchReceiveTypes } = useReceiveTypes()
  const { docTypeId, state, setState, receivers, setReceivers } = useContext(DataContext)

  useEffect(() => {
    const loadInitialReceiveTypes = async () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const response = await fetchReceiveTypes(docTypeId).then((result) => {
        if (result) {
          if (Array.isArray(result)) {
            setReceiveTypes(result)
          }
        }
      })
    };
    loadInitialReceiveTypes()
  }, [docTypeId])


  const DeleteReceiverItem = (receiver: GetMainReceiver, index: number) => {
    setReceivers((prev: ReceiversType) => ({ ...prev, mainReceivers: [...prev.mainReceivers.filter(item => item.Id !== receiver.Id)] }))
  }
  const ConvertReceiveType = (item: GetRecieveTypesModel, option: GetMainReceiver) => {
    let index = receivers.mainReceivers?.indexOf(option);
    if (index !== -1) {
      let newOption: GetMainReceiver = {
        ...option,
        ActionId: item!.id,
        ActionName: item.faTitle,
      };
      const updatedReceivers = [...receivers.mainReceivers];
      updatedReceivers[index] = newOption;
      setReceivers((prev: ReceiversType) => ({ ...prev, mainReceivers: updatedReceivers }));
    }
  }

  return (
    <CardBody className={'h-[50vh] m-0 p-0 md:my-3  mx-auto relative rounded-lg overflow-y-scroll '} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
      <table dir='rtl' className={`w-full relative text-center max-h-[55vh] ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}`}>
        <thead className=' border-b-2 z-[999] top-0 left-0 w-full'>
          <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
            <Th value='#' />
            <Th value='عنوان' />
            <Th value='جهت ' />
            <Th value='عملیات' />
          </tr>
        </thead>
        <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
          {receivers.mainReceivers.map((option: GetMainReceiver, index: number) => {
            return (
              <>
                <tr style={{ height: "40px" }} key={option.Id} className={(index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight') + ' border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75'}>
                  <Td style={{ width: '3%' }} value={Number(index + 1)} />
                  <Td style={{ width: '45%' }} value={option.Value} />
                  <Td style={{ minWidth: '120px', width: '25%' }} value={<>
                    <SelectOption
                      isRtl
                      placeholder={'جهت'}
                      loading={receiveTypes != undefined ? false : true}
                      className={`z-[${(index + 1) * 11}]`}
                      maxMenuHeight={300}
                      value={receiveTypes.find((p) => p.value == option.ActionId) ? receiveTypes.find((p) => p.value == option.ActionId) : receiveTypes.find((p) => p.value == 1)}
                      onChange={(item: SingleValue<GetRecieveTypesModel>, actionMeta: ActionMeta<GetRecieveTypesModel>) => {
                        ConvertReceiveType(item!, option)
                      }}
                      options={receiveTypes == undefined ? [{
                        id: 0, value: 0, label: 'no option found',
                        faName: 'no option found',
                        name: 'no option found'
                      }] : receiveTypes}
                    />
                  </>} />
                  <Td style={{ width: '4%' }} value={<>
                    <div className='container-fluid mx-auto p-0.5'>
                      <div className="flex flex-row justify-evenly">
                        <ActionButton onClick={() => DeleteReceiverItem(option, index)} >
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