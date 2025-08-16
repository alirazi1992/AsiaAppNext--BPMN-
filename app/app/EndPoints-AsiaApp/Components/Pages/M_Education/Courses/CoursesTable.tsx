'use client';
import React from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { Button, CardBody, Popover, PopoverContent, PopoverHandler, Tooltip, Typography } from '@material-tailwind/react';
import moment from 'jalali-moment';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { EducationCoursesModel } from '@/app/Domain/M_Education/Courses';

const CoursesTable: React.FC<any> = ({ courses, removeCourseId, selectedCourse }) => {
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state);

    return (
        <>
            <CardBody className='w-[98%] mx-auto mt-3 relative rounded-lg overflow-auto p-0  h-[30vh]'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <table dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[25vh] `}>
                    <thead>
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    #
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    کد دوره
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    نام دوره
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    نام دسته بندی
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    تاریخ ایجاد
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    نام ایجاد کننده
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    نوع قالب
                                </Typography>
                            </th>
                            <th style={{ borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    عملیات
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}`}>
                        {courses?.map((item: EducationCoursesModel, index: number) => {
                            return (
                                <tr key={"cms" + index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`} >
                                    <td style={{ width: "3%", minWidth: '10px' }} className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {index + 1}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.courseCode == null ? '' : item.courseCode}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.faName}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.categoryFaName}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {moment(item.creationDate, 'YYYY/MM/DD HH:mm:ss').locale('fa').format(" HH:mm:ss  jYYYY/jMM/jDD ")}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.creator}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} font-[EnRegular] whitespace-nowrap text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.templateName}
                                        </Typography>
                                    </td>
                                    <td style={{ width: '7%' }} className='p-1'>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <Popover placement="bottom">
                                                    <PopoverHandler>
                                                        <Button
                                                            size="sm"
                                                            className="p-1 mx-1"
                                                            style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >

                                                            <Tooltip content="توضیحات دوره" className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
                                                                <InfoIcon
                                                                    fontSize="small"
                                                                    className='p-1'
                                                                    onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                                    onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                                />
                                                            </Tooltip>
                                                        </Button>
                                                    </PopoverHandler>
                                                    <PopoverContent className={` z-[9999] border-none py-[10px] ${!themeMode || themeMode?.stateMode ? " bg-[#2e4b64] lightText" : " bg-[#efe7e2] darkText"}`} dir="rtl"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                        <Typography dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[FaBold]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >نام دوره : </Typography><Typography dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[EnUltraLight]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >{item.name}</Typography>
                                                        <br></br>
                                                        <Typography dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[FaBold]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >نام دسته بندی : </Typography><Typography dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[EnUltraLight]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >{item.categoryName}</Typography>
                                                        <br></br>
                                                        <Typography dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[FaBold]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >توضیحات :</Typography> <div className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-thin`} dangerouslySetInnerHTML={{ __html: item.courseFaDesc.replaceAll('\r\n', '<br>') }}></div>
                                                        <br></br>
                                                        <Typography dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[FaBold]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >توضیحات انگلیسی :</Typography> <div dir='ltr' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} EnFont`} dangerouslySetInnerHTML={{ __html: item.courseDesc.replaceAll('\r\n', '<br>') }}></div>
                                                        <br></br>
                                                    </PopoverContent>
                                                </Popover>
                                                <Button
                                                    onClick={() => selectedCourse(item)}
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
                                                    onClick={() => removeCourseId(item.id)}
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

export default CoursesTable