'use client';
import React, { useContext, useRef, useState } from 'react';
import useStore from '@/app/hooks/useStore';
import colorStore from '@/app/zustandData/color.zustand';
import themeStore from '@/app/zustandData/theme.zustand';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, CardBody, Typography } from '@material-tailwind/react';
import { SignatureContext } from './MainContainer';
import b64toBlob from '@/app/Utils/Automation/convertImageToBlob';
import { GetUserSignatureResultModel, GetUserSignaturesResulltModel } from '@/app/Domain/M_HumanRecourse/UserProfile';
import { RemovingSignatureFromList } from '@/app/Application-AsiaApp/M_HumanRecourse/removeUserSignature';
import { useSignatureFile } from '@/app/Application-AsiaApp/M_HumanRecourse/fetchSignaturePdf';
import ViewSignaturePdf from './ViewSignaturePdf';

const SignatureList = () => {
    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    const { RemoveSignature } = RemovingSignatureFromList()
    const { fetchSignaturePdf } = useSignatureFile()
    const [data, setData] = useState<string>('')
    const Ref = useRef<{ handleOpen: () => void }>(null);
    const { list, setList, setLoading } = useContext(SignatureContext)

    const removeSignature = async (id: number) => {
        // setLoading(true)
        const res = await RemoveSignature(id).then((result) => {
            if (result) {
                // setLoading(false)
                if (result == id) {
                    setList((prev: GetUserSignaturesResulltModel[]) => [...prev.filter((prev: GetUserSignaturesResulltModel) => prev.id !== id)])
                }
            }
        })
    }

    const viewSignatureFile = async (id: number) => {
        const res = await fetchSignaturePdf(id).then((result) => {
            if (result) {
                if (typeof result == 'object' && 'file' in result) {
                    let blob = b64toBlob({ b64Data: result.file.substring(result.file.lastIndexOf(",") + 1), contentType: result.fileType, sliceSize: 512 });
                    let blobUrl = URL.createObjectURL(blob);
                    if (Ref && Ref.current) {
                        setData(blobUrl)
                        Ref.current.handleOpen()
                    }
                }
            }
            return
        })
    }

    return (
        <>
            <CardBody className={'h-auto max-h-[60vh] my-3 mx-auto relative rounded-lg p-0 overflow-hidden '} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <table dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[61vh] `}>
                    <thead>
                        <tr className={!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th style={{ borderBottomColor: color?.color }} className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}>
                                <Typography variant="small" color="blue-gray" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-bold text-sm p-1.5 leading-none`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                    #
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }} className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}>
                                <Typography variant="small" color="blue-gray" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-bold text-sm p-1.5 leading-none`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                    اسم فایل
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }} className={`${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}>
                                <Typography variant="small" color="blue-gray" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-bold text-sm p-1.5 leading-none`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                    عملیات
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode || themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {list.map((item: GetUserSignaturesResulltModel, index: number) => {
                            return (
                                <>
                                    <tr style={{ height: "40px" }} key={index} className={`${index % 2 ? !themeMode || themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode || themeMode?.stateMode ? 'tableDark' : 'tableLight'}  border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                        <td style={{ width: '3%' }} className='p-1'>
                                            <Typography variant="small" color="blue-gray" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}font-body text-sm p-1.5 leading-none`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                                {Number(index + 1)}
                                            </Typography>
                                        </td>
                                        <td style={{ width: "90%" }} className='p-1'>
                                            <Typography variant="small" color="blue-gray" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}font-body text-sm p-1.5 leading-none`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                                {item.title}
                                            </Typography>
                                        </td>
                                        <td style={{ width: "7%" }} className='p-1'>
                                            <div className='container-fluid mx-auto p-0.5'>
                                                <div className="flex flex-row justify-evenly">
                                                    <Button size="sm" className="p-1 mx-1" style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                        <DeleteIcon
                                                            onClick={() => removeSignature(item.id)}
                                                            fontSize="small"
                                                            className='p-1'
                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                    </Button>
                                                    <Button size="sm" className="p-1 mx-1" style={{ background: color?.color }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                        <VisibilityIcon
                                                            onClick={() => viewSignatureFile(item.id)}
                                                            fontSize="small"
                                                            className='p-1'
                                                            onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                            onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                                    </Button>


                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </CardBody>
            <ViewSignaturePdf data={data} ref={Ref} />
        </>
    )
}

export default SignatureList