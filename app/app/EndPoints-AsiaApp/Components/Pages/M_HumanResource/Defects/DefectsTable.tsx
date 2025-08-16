'use client';
import React from 'react';
import { CardBody, Typography } from '@material-tailwind/react';
import moment from 'jalali-moment';
import Loading from '@/app/components/shared/loadingResponse';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { DefectsTableModal, listDefacsUserModal } from '@/app/Domain/M_HumanRecourse/Defects';

interface Props extends DefectsTableModal {
    loading?: boolean;
}

const DefectsTable: React.FC<Props> = ({ data, loading = false }) => {
    const themeMode = useStore(themeStore, (state) => state?.stateMode);
    const color = useStore(colorStore, (state) => state?.color);

    const tableTheme = themeMode ? 'tableDark' : 'tableLight';
    const headerTheme = themeMode ? 'themeDark' : 'themeLight';
    const textColor = themeMode ? 'lightText' : 'darkText';
    const rowAlt = themeMode ? 'breadDark' : 'breadLight';
    const rowBase = tableTheme;

    const sharedProps = {
        placeholder: '',
        onPointerEnterCapture: () => { },
        onPointerLeaveCapture: () => { },
    };

    return (
      <CardBody className="w-[98%] mx-auto relative rounded-lg overflow-auto p-0 mt-3 h-[70vh]" {...sharedProps} dir='rtl'>
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <Loading />
                </div>
            ) : (
                <table dir="rtl" className={`${tableTheme} w-full text-center max-h-[45vh]`}>
                    <thead>
                        <tr className={headerTheme}>
                            {['#', , 'نام,نام خانوادگی', 'عنوان فارسی', 'عنوان انگلیسی', 'تاریخ انقضاء'].map((title, index) => (
                                <th
                                    key={index}
                                    style={{ borderBottomColor: color }}
                                    className={`${headerTheme} p-3 sticky top-0 border-b-2 min-w-[130px]`}
                                >
                                    <Typography variant="small" color="blue-gray" className={`font-normal text-sm p-1.5 ${textColor}`} {...sharedProps}>
                                        {title}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center">
                                    <Typography variant="small" className={`text-sm ${textColor}`} {...sharedProps}>
                                        داده‌ای برای نمایش وجود ندارد.
                                    </Typography>
                                </td>
                            </tr>
                        ) : (
                            data?.map((item: listDefacsUserModal, index: number) => {
                                const prevItem = data[index - 1];
                                const isNewUser =
                                    index === 0 ||
                                    `${item.faFirstName} ${item.faLastName}` !== `${prevItem?.faFirstName} ${prevItem?.faLastName}`;

                                const rowStyle = index % 2 === 0 ? rowBase : rowAlt;

                                return (
                                    <React.Fragment key={`cms-${index}`}>
                                        {isNewUser && (
                                            <tr className="bg-blue-gray-100">
                                                <td colSpan={6} className="text-right p-2 font-bold text-blue-gray-700">
                                                    👤 {`${item.faFirstName ? item.faFirstName : ''} ${item.faLastName ? item.faLastName : ''}`}
                                                </td>
                                            </tr>
                                        )}
                                        <tr className={`${rowStyle} border-none hover:bg-blue-gray-50/30`}>
                                            <td style={{ width: '3%', minWidth: '10px' }} className="p-1">
                                                <Typography variant="small" color="blue-gray" className={`font-[EnRegular] text-sm p-0.5 ${textColor}`} {...sharedProps}>
                                                    {index + 1}
                                                </Typography>
                                            </td>
                                            <td className="p-1">
                                                <Typography variant="small" color="blue-gray" className={`font-[EnRegular] text-sm p-0.5 ${textColor}`} {...sharedProps}>
                                                    {`${item?.faFirstName ?? ''} ${item?.faLastName ?? ''}`}
                                                </Typography>
                                            </td>
                                            <td className="p-1">
                                                <Typography variant="small" color="blue-gray" className={`font-[EnRegular] text-sm p-0.5 ${textColor}`} {...sharedProps}>
                                                    {item.title}
                                                </Typography>
                                            </td>
                                            <td className="p-1">
                                                <Typography variant="small" color="blue-gray" className={`font-[EnRegular] text-sm p-0.5 ${textColor}`} {...sharedProps}>
                                                    {item.description}
                                                </Typography>
                                            </td>
                                            <td className="p-1">
                                                <Typography variant="small" color="blue-gray" className={`font-[EnRegular] text-sm p-0.5 ${textColor}`} {...sharedProps}>
                                                    {/* {item.expiration
                                                        ? moment(item.expiration, 'YYYY/MM/DD HH:mm:ss')
                                                            .locale('fa')
                                                            .format('HH:mm:ss jYYYY/jMM/jDD')
                                                        : '-'} */}
                                                    {'-'}
                                                </Typography>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            )}
        </CardBody>


    );
};

export default DefectsTable;
