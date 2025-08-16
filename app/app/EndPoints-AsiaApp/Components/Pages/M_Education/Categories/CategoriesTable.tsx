'use client';
import React from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { Button, CardBody, Typography } from '@material-tailwind/react';
import { CategoriesTableProps, CourseCategoriesModels } from '@/app/Domain/M_Education/Categories';
import moment from 'jalali-moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoriesTable: React.FC<CategoriesTableProps> = ({ categories, removeCategoryId, selectedCategory }) => {
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state);

    return (
        <>
            <CardBody className='w-[98%] mx-auto relative rounded-lg overflow-auto p-0 mt-3 h-[50vh]'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <table dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[45vh] `}>
                    <thead>
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography variant="small" color="blue-gray" className={`font-normal text-sm p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    #
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography variant="small" color="blue-gray" className={`font-normal text-sm p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    عنوان فارسی
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography variant="small" color="blue-gray" className={`font-normal text-sm p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    عنوان انگلیسی
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography variant="small" color="blue-gray" className={`font-normal text-sm p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    تاریخ ایجاد
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography variant="small" color="blue-gray" className={`font-normal text-sm p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    نام ایجاد کننده
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography variant="small" color="blue-gray" className={`font-normal text-sm p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    عملیات
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {categories?.map((item: CourseCategoriesModels, index: number) => {
                            return (
                                <tr key={"cms" + index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`} >
                                    <td style={{ width: "3%", minWidth: '10px' }} className='p-1'>
                                        <Typography variant="small" color="blue-gray" className={` font-[EnRegular] text-sm p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                            {index + 1}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography variant="small" color="blue-gray" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-sm p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                            {item.faName}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography variant="small" color="blue-gray" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-sm p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                            {item.name}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography variant="small" color="blue-gray" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-sm p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                            {moment(item.creationDate, 'YYYY/MM/DD HH:mm:ss').locale('fa').format(" HH:mm:ss  jYYYY/jMM/jDD ")}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                    <Typography variant="small" color="blue-gray" className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-sm p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                            {item.creator}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '7%' }} className='p-1'>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <Button
                                                    onClick={() => selectedCategory(item)}
                                                    size="sm"
                                                    className="p-1 mx-1"
                                                    style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    <EditIcon
                                                        fontSize='small'
                                                        sx={{ color: 'white' }}
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                    />
                                                </Button>
                                                <Button
                                                    onClick={() => removeCategoryId(item.id)}
                                                    size="sm"
                                                    className="p-1 mx-1"
                                                    style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    <DeleteIcon
                                                        fontSize='small'
                                                        sx={{ color: 'white' }}
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </CardBody>
        </>
    )
}

export default CategoriesTable