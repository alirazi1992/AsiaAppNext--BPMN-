'use client';
import React from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { Button, CardBody, Popover, PopoverContent, PopoverHandler, Tooltip, Typography } from '@material-tailwind/react';
import moment from 'jalali-moment';
import EditIcon from '@mui/icons-material/Edit';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { EducationalCourseProgramsModel, ProgramsTableProps } from '@/app/Domain/M_Education/Programs';

const ProgramsTable: React.FC<ProgramsTableProps> = ({ programs, removeProgramId, selectedProgram }) => {
    const themeMode = useStore(themeStore, (state) => state);
    const color = useStore(colorStore, (state) => state);
    return (
        <>
            <CardBody className='w-[98%] mx-auto relative rounded-lg overflow-auto p-0 mt-3 h-[35vh]'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                <table dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} w-full relative text-center max-h-[30vh]`}>
                    <thead>
                        <tr className={!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'}>
                            <th style={{ width: "3%", minWidth: '10px', borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    #
                                </Typography>
                            </th>
                            <th style={{ width: "7%", borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    کد دوره
                                </Typography>
                            </th>
                            <th style={{ width: "7%", borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    نام دوره
                                </Typography>
                            </th>
                            <th style={{ width: "7%", borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    نام دسته بندی
                                </Typography>
                            </th>

                            <th style={{ width: "7%", borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    نام موسسه
                                </Typography>
                            </th>
                            <th style={{ width: "7%", borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    نام مدرس
                                </Typography>
                            </th>
                            <th style={{ width: "7%", borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    ایجاد کننده
                                </Typography>
                            </th>
                            <th style={{ width: "10%", borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    تاریخ ایجاد
                                </Typography>
                            </th>
                            <th style={{ width: "10%", borderBottomColor: color?.color }}
                                className={`${!themeMode ||themeMode?.stateMode ? 'themeDark' : 'themeLight'} p-3 sticky top-0 border-b-2 `}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-[700] text-[12px] p-1.5 leading-none ${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'}`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                >
                                    تاریخ پایان
                                </Typography>
                            </th>
                            <th style={{ width: "5%", borderBottomColor: color?.color }}
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
                        {programs?.map((item: EducationalCourseProgramsModel, index: number) => {
                            return (
                                <tr key={"cms" + index} className={`${index % 2 ? !themeMode ||themeMode?.stateMode ? 'breadDark' : 'breadLight' : !themeMode ||themeMode?.stateMode ? 'tableDark' : 'tableLight'} border-none hover:bg-blue-gray-50/30 hover:bg-opacity-75`} >
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {index + 1}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.courseCode == null ? '' : item.courseCode}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] whitespace-nowrap text-center p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.faName}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.categoryFaName}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.faInstitute}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.faCouchName}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.creatorFaName}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.creationDate != null ? moment(item.creationDate, 'YYYY/MM/DD HH:mm:ss').locale('fa').format(" HH:mm:ss  jYYYY/jMM/jDD ") : ''}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-[13px] p-0.5 `}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                        >
                                            {item.finishDate != null ? moment(item.finishDate, 'YYYY/MM/DD').locale('fa').format("jYYYY/jMM/jDD ") : ''}
                                        </Typography>
                                    </td>
                                    <td className='p-1'>
                                        <div className='container-fluid mx-auto p-0.5'>
                                            <div className="flex flex-row justify-evenly">
                                                <Popover placement="bottom">
                                                    <PopoverHandler>
                                                        <Button
                                                            size="sm"
                                                            className="p-1 mx-1"
                                                            style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >

                                                            <Tooltip content='اطلاعات تکمیلی' className={!themeMode ||themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'}>
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
                                                        <Typography dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[FaBold]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >نام مدرس : </Typography><Typography dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[EnUltraLight]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >{item.couchName}</Typography>
                                                        <br></br>
                                                        <Typography dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[FaBold]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >نام موسسه : </Typography><Typography dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[EnUltraLight]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >{item.institute}</Typography>
                                                        <br></br>
                                                        <Typography dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[FaBold]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >نام ایجاد کننده : </Typography><Typography dir='ltr' className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} text-sm font-[EnUltraLight]`}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >{item.creatorName}</Typography>
                                                        <br></br>
                                                        ضمائم صفحه دوم : {item.faPage2Desc != null ? <div dir='rtl' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-thin`} dangerouslySetInnerHTML={{ __html: item.faPage2Desc.replaceAll('\r\n', '<br>') }}></div> : ''}
                                                        <br></br>
                                                        ضمائم انگلیسی صفحه دوم :{item.page2Desc != null ? <div dir='ltr' className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'} font-thin`} dangerouslySetInnerHTML={{ __html: item.page2Desc.replaceAll('\r\n', '<br>') }}></div> : ''}
                                                        <br></br>
                                                    </PopoverContent>
                                                </Popover>
                                                <Button
                                                    onClick={() => selectedProgram(item, 'edit')}
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
                                                    onClick={() => selectedProgram(item, 'participants')}
                                                    size="sm"
                                                    className="p-1 mx-1"
                                                    style={{ background: color?.color }}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                >
                                                    <Diversity3Icon
                                                        fontSize='small'
                                                        sx={{ color: 'white' }}
                                                        className='p-1'
                                                        onMouseEnter={(event: React.MouseEvent<any>) => event.currentTarget.classList.add("menuIconStyle")}
                                                        onMouseLeave={(event: React.MouseEvent<any>) => event.currentTarget.classList.remove("menuIconStyle")}
                                                    />
                                                </Button>
                                                <Button
                                                    onClick={() => removeProgramId(item.id)}
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

export default ProgramsTable