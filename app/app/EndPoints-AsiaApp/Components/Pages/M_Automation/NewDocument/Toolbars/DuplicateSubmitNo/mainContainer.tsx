import ButtonComponent from '@/app/components/shared/ButtonComponent'
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui'
import { CloseIcon } from '@/app/EndPoints-AsiaApp/Components/Shared/IconComponent'
import { Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react'
import React, { createContext, forwardRef, useContext, useImperativeHandle, useState } from 'react'

import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';
import DocumentList from './documentList'
import { ExistDocListModel } from '@/app/Domain/M_Automation/NewDocument/toolbars'
import { ToolbarContext } from '../../NewDocument-Toolbar'

export const ExistContext = createContext<any>(null)
const ExistDocument = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const [open, setOpen] = useState<boolean>(false)
    const [docs, setDocs] = useState<ExistDocListModel[]>([])
    const { SaveImportDocument } = useContext(ToolbarContext)
    const handleOpen = () => setOpen(!open)

    useImperativeHandle(ref, () => ({
        handleOpenExist: () => {
            handleOpen()
        },
        setItems: (items: ExistDocListModel[]) => {
            setDocs(items)
        }
    }))




    return (
        <MyCustomComponent>
            <ExistContext.Provider value={{ docs }}>
                <Dialog
                    dismiss={{
                        escapeKey: true, referencePress: true, referencePressEvent: 'click', outsidePress: false, outsidePressEvent: 'click', ancestorScroll: false, bubbles: true
                    }} size='xl' className={`absolute top-0 bottom-0 overflow-y-scroll  ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                    <DialogHeader dir='rtl' className={` flex justify-between sticky top-0 left-0 z-[555555] ${!themeMode || themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'} `} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        مدارک با شماره صادره های تکراری
                        <CloseIcon onClick={() => handleOpen()} />
                    </DialogHeader>
                    <DialogBody className='w-full overflow-y-auto' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <DocumentList />
                    </DialogBody>
                    <DialogFooter className={`flex flex-col sticky bottom-0 left-0 z-[8998989889889989] + ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        <ButtonComponent onClick={() => { SaveImportDocument().then((res: any) => handleOpen()) }} >تائید</ButtonComponent>
                    </DialogFooter>
                </Dialog>
            </ExistContext.Provider>
        </MyCustomComponent>


    )
})
ExistDocument.displayName = 'ExistDocument'
export default ExistDocument