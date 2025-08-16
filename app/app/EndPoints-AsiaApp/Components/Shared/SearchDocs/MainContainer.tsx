'use client';
import React, { createContext, forwardRef, useImperativeHandle, useState } from 'react'
import CustomizedSearched from '../SearchComponent';
import { initializeStateSearchDocs, loading } from '@/app/Application-AsiaApp/Utils/shared';
import { useDocs } from '@/app/Application-AsiaApp/Shared/fetchSearchDocs';
import { InitializeStateModel } from '@/app/Domain/searchDocs';
import DocsList from './DocsList';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import CustomizedPagination from '../Pagination';
import TableSkeleton from '@/app/components/shared/TableSkeleton';
import { Dialog, DialogBody, DialogHeader, IconButton } from '@material-tailwind/react';
import { CloseIcon } from '../IconComponent';


export const SearchDocContext = createContext<any>(null)
const SearchDocsComponents = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const [loadings, setLoadings] = useState(loading)
    const { fetchSearchDocs } = useDocs()
    const [state, setState] = useState<InitializeStateModel>(initializeStateSearchDocs)
    const [open, setOpen] = useState<boolean>(false)
    const handleOpen = () => setOpen(!open)

    const handleGetSearchKey = async (data: string) => {
        setLoadings((state) => ({ ...state, table: true }))
        const result = await fetchSearchDocs(data, 1).then(res => {
            if (res) {
                setLoadings((state) => ({ ...state, table: false }))
                if (typeof res == 'object' && 'docList' in res) {
                    setState((state) => ({ ...state, searchKey: data, totalCount: Math.ceil(Number(res!.totalCount) / 10), docs: res!.docList }))
                } else {
                    setState((state) => ({ ...state, searchKey: '', totalCount: 0, docs: [] }))
                }
            }
        })
    }

    const handleGetPageNo = async (page: number) => {
        setLoadings((state) => ({ ...state, table: true }))
        const res = await fetchSearchDocs(state.searchKey, page).then(result => {
            if (result) {
                if (typeof result == 'object' && result !== null) {
                    setLoadings((state) => ({ ...state, table: false }))
                    if ('docList' in result) {
                        setState((prev) => ({ ...prev, docs: result.docList }))
                    }
                }
            }
        })
    }
    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            handleOpen()
        },
        setItems: (isNext: boolean) => {
            setState((prev) => ({ ...prev, isNext: isNext }))
        }
    }));

    return (
        <SearchDocContext.Provider value={{ state, DialogRef: ref }}>
            <Dialog style={{ outline: 'none' }} dismiss={{ escapeKey: true, referencePress: true, referencePressEvent: 'click', outsidePress: false, outsidePressEvent: 'click', ancestorScroll: false, bubbles: true }}
                size='xl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} absolute top-0 min-h-[50vh] `} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'} flex justify-between sticky top-0 left-0`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    انتخاب مدرک
                    <CloseIcon onClick={() => { handleOpen(), setState((prev) => ({ ...prev, docs: [] })) }} />
                </DialogHeader>
                <DialogBody className='w-full' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <CustomizedSearched searchKey={handleGetSearchKey} />
                    {loadings.table ? <TableSkeleton /> : <DocsList />}
                    {state.docs.length > 0 && <CustomizedPagination count={state.totalCount} handlePage={handleGetPageNo} />}
                </DialogBody>
            </Dialog>
        </SearchDocContext.Provider>
    )
})
SearchDocsComponents.displayName = 'SearchDocsComponents'
export default SearchDocsComponents
