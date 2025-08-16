import React, { useContext, useRef } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import { CardBody } from '@material-tailwind/react';
import { ActionButton, Icon, Th } from '../../../Shared/TableComponent';
import { HistorySerachContext } from './MainContainer';
import { Td } from '../../../Shared/TableComponent';
import { TabsModel } from '@/app/Domain/M_History/Tabs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from 'jalali-moment';
import ViewTab from './ViewTab';
import { useTab } from '@/app/Application-AsiaApp/M_History/fetchTabPdf';
import { LoadingModel } from '@/app/Domain/shared';
import Loading from '@/app/components/shared/loadingResponse';

const HistoryList = () => {
    const { state, setLoadings, loadings } = useContext(HistorySerachContext)
    const themeMode = useStore(themeStore, (state) => state)
    const { fetchPdfData } = useTab()
    const TabRef = useRef<{ handleOpenTab: () => void, setData: (data: string) => void }>(null)

    const ViewTabPdf = async (id: number) => {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        const res = await fetchPdfData(id).then((result) => {
            if (result) {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                if (typeof result == 'string' && TabRef.current) {
                    TabRef.current.setData(result)
                    TabRef.current.handleOpenTab()
                }
            }
        })
    }
    enum CurrencyType {
        Rial = 0,
        Dollar = 1,
        Euro = 2,
        Dirham = 3,
        Pond = 4,
        Yuan = 5,
    }

    const getCurrenyF = (stateId: number) => {
        switch (stateId) {
            case CurrencyType.Rial:
                return "ریال";
            case CurrencyType.Dirham:
                return 'درهم';
            case CurrencyType.Dollar:
                return 'دلار';
            case CurrencyType.Euro:
                return 'یورو';
            case CurrencyType.Pond:
                return 'پوند';
            case CurrencyType.Yuan:
                return 'یوآن';
            default:
                return "-";
        }
    }


    return (
        <>
            {state && state.tabs.length >= 0 && <CardBody className='w-[98%] mx-auto relative rounded-lg overflow-auto p-0'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                {/* {loadings.response == true && <Loading />} */}
                <table dir="rtl" className={`w-full relative text-center ${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} `}>
                    <thead>
                        <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <Th value={'#'} />
                            <Th value={'شماره صورتحساب'} />
                            <Th value={'نام مالک'} />
                            <Th value={'کد ملی'} />
                            <Th value={'مبلغ صورتحساب'} />
                            <Th value={'تاریخ صورتحساب'} />
                            <Th value={'عملیات'} />
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {state !== undefined && state.tabs.map((item: TabsModel, index: number) => {
                            return (
                                <tr key={index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                    <Td style={{ width: '5%' }} value={Number(index) + Number(1)} />
                                    <Td style={{ width: '15%' }} value={item.tabCodeId} />
                                    <Td style={{ width: '15%' }} value={item.owner} />
                                    <Td style={{ width: '20%' }} value={item.nationalCode} />
                                    <Td style={{ width: '20%' }} value={item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '  ' + getCurrenyF(item.currencyTypeId)} />
                                    <Td style={{ width: '20%' }} value={moment(item.tabDate).format('HH:mm:ss jYYYY/jMM/jDD')} />
                                    <Td style={{ width: '3%' }} value={<>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <ActionButton onClick={() => ViewTabPdf(item.id)}>
                                                    <Icon Name={VisibilityIcon} />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    </>} />
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardBody >}
            <ViewTab ref={TabRef} />

        </>
    )
}

export default HistoryList