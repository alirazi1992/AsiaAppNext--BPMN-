'use client';
import { JobOptionProps, PartnersItemsList, Response } from '@/app/models/ProjectManagement/InitialProjectModels';
import { Button, CardBody, Input, Typography } from '@material-tailwind/react';
import React, { useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
// icons
import DeleteIcon from '@mui/icons-material/Delete';

const PartnersTable = (props: any) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    return (
        <CardBody className='w-full mx-auto h-[220px] relative rounded-lg overflow-auto p-0 my-3'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <table dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative max-h-[300px] text-center `}>
                <thead>
                    <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                        <th style={{ borderBottomColor: color?.color }}
                            className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                #
                            </Typography>
                        </th>
                        <th style={{ borderBottomColor: color?.color }}
                            className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                نام مشتری
                            </Typography>
                        </th>
                        <th style={{ borderBottomColor: color?.color }}
                            className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                درصد سهم
                            </Typography>
                        </th>
                        <th style={{ borderBottomColor: color?.color }}
                            className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                عملیات
                            </Typography>
                        </th>
                    </tr>
                </thead>
                <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                    {props.partnerList.length > 0 && props.partnerList.filter((item: PartnersItemsList) => item.isOrginalOwner == false).map((partner: PartnersItemsList, index: number) => {
                        return (
                            <tr key={index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`}>
                                <td style={{ width: '3%' }} className='p-1'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`font-normal p-0.5 ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        {Number(index + 1)}
                                    </Typography>
                                </td>
                                <td className='p-1'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-normal whitespace-nowrap  p-0.5`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    >
                                        {partner.title}
                                    </Typography>
                                </td>

                                <td style={{ width: "10%" }} className='p-1'>
                                    <Input
                                        className="!border !border-gray-500 bg-inherit  ring-0 ring-transparent focus:!border-gray-500 focus:!border-t-gray-500 focus:ring-gray-900/10"
                                        defaultValue={partner.sharePercent}
                                        style={{ color: `${!themeMode || themeMode?.stateMode ? 'white' : ''}` }} color="blue-gray"
                                        size='md'
                                        crossOrigin=""
                                        type="number"
                                        labelProps={{
                                            className: "hidden",
                                        }}
                                        containerProps={{ className: "min-w-[100px]" }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                    />
                                </td>
                                <td style={{ width: '3%' }} className='p-1'>
                                    <div className='container-fluid mx-auto p-0.5'>
                                        <div className="flex flex-row justify-evenly">
                                            <Button 
                                                style={{ background: color?.color }}
                                                size="sm"
                                                className="p-1 mx-1"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                <DeleteIcon 
                                                    fontSize='small'
                                                    className='p-1'
                                                    onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                    onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")} />
                                            </Button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>
        </CardBody>

    )
}

export default PartnersTable