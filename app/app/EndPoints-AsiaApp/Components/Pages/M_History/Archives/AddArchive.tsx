'use client';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button, CardBody, Tooltip } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import { TextField } from '@mui/material';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingModel } from '@/app/Domain/shared';
import { ArchiveSerachContext } from './Archive-MainContainer';
import { AddArchiveModel, GetCategoriesModel, SearchArchiveModel } from '@/app/Domain/M_History/Archive';
import SelectOption from '../../../Shared/SelectOption';
import { useList } from '@/app/Application-AsiaApp/M_History/fetchCategoriesList';
import { ActionMeta, SingleValue } from 'react-select';
import { useHArchives } from '@/app/Application-AsiaApp/M_History/AddHArchivetolist';
import TextFieldItem from '../../../Shared/TextFieldItem';


const AddHArchive = forwardRef((props: any, ref) => {
    const { AddArchiveDoc } = useHArchives()
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const { setState, setLoadings } = useContext(ArchiveSerachContext)
    const [categories, setCategories] = useState<GetCategoriesModel[]>([])
    const { fetchCategoriesList } = useList()
    const [page, setPage] = useState<number>(0)
    const schema = yup.object().shape({
        AddHArchive: yup.object(({
            vesselNameF: yup.string().required('اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            vesselNameE: yup.string().required('اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            AsiaCode: yup.string().required('اجباری'),
            subject: yup.string().required('اجباری'),
            file: yup.string().required('اجباری'),
            fileName: yup.string().required('اجباری'),
            fileType: yup.string().required('اجباری'),
            RegNo: yup.string().required('اجباری'),
            archiveCategoryId: yup.number().required('اجباری').min(1, 'اجباری'),
            sender: yup.string().optional().nullable(),
            comment: yup.string().optional().nullable(),
            receiver: yup.string().optional().nullable(),
            DocNo: yup.string().optional().nullable(),
        })).required(),
    })

    const {
        register,
        handleSubmit,
        reset,
        trigger,
        getValues,
        watch,
        setValue,
        formState,
    } = useForm<AddArchiveModel>(
        {
            defaultValues: {
                AddHArchive: {
                    vesselNameF: '',
                    vesselNameE: '',
                    AsiaCode: '',
                    subject: '',
                    RegNo: '',
                    file: '',
                    fileName: '',
                    fileType: '',
                    archiveCategoryId: 0,
                    comment: null,
                    sender: null,
                    receiver: null,
                    DocNo: null,
                },
            }, mode: 'all',
            resolver: yupResolver(schema)
        }
    );

    const errors = formState.errors;
    useImperativeHandle(ref, () => ({
        setPage: (num: number) => {
            setPage(num)
        }
    }))

    const OnSubmit = async (data: AddArchiveModel) => {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        const res = await AddArchiveDoc(data).then((result) => {
            if (result) {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                reset()
            }
        })
    }

    useEffect(() => {
        const loadCategories = async () => {
            const res = await fetchCategoriesList().then((result) => {
                if (result) {
                    if (Array.isArray(result)) {
                        setCategories(result);
                    } else {
                        setCategories([]);
                    }
                }
            })
        };
        loadCategories();
    }, [])

    const fileRef = useRef() as any;
    const handleFile = async () => {
        const file = fileRef.current?.files && fileRef.current?.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                let base64String = reader!.result!.toString();
                base64String = base64String.split(",")[1];
                setValue(`AddHArchive.fileName`, fileRef.current.files[0]?.name);
                setValue(`AddHArchive.fileType`, file.type);
                setValue(`AddHArchive.file`, base64String);
                trigger()
            };
        }
    }

    return (
        <MyCustomComponent>
            <CardBody className={`${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} p-0`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <form
                    dir='rtl'
                    onSubmit={handleSubmit(OnSubmit)}
                    className='relative z-[10] w-full'>
                    <div className="w-max ">
                        <Tooltip className={!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} content='Add History Archive' placement="top">
                            <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <SaveIcon className='p-1' />
                            </Button>
                        </Tooltip>
                    </div>
                    <section className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-x-1 w-full gap-y-4 my-2'>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='نام فارسی شناور' register={{ ...register(`AddHArchive.vesselNameF`) }} tabIndex={1}
                                error={errors && errors?.AddHArchive?.vesselNameF && true}
                            />
                            <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddHArchive && errors?.AddHArchive.vesselNameF?.message}</label>
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='نام انگلیسی شناور' register={{ ...register(`AddHArchive.vesselNameE`) }} tabIndex={2}
                                error={errors && errors?.AddHArchive?.vesselNameE && true}
                            />
                            <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddHArchive && errors?.AddHArchive.vesselNameE?.message}</label>
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='RegNo' register={{ ...register(`AddHArchive.RegNo`) }} tabIndex={3}
                                error={errors && errors?.AddHArchive?.RegNo && true}
                            />
                            <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddHArchive && errors?.AddHArchive.RegNo?.message}</label>
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='AsiaCode' register={{ ...register(`AddHArchive.AsiaCode`) }} tabIndex={4}
                                error={errors && errors?.AddHArchive?.AsiaCode && true}
                            />
                            <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddHArchive && errors?.AddHArchive.AsiaCode?.message}</label>
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='موضوع' register={{ ...register(`AddHArchive.subject`) }} tabIndex={5}
                                error={errors && errors?.AddHArchive?.subject && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='شماره مدرک' register={{ ...register(`AddHArchive.DocNo`) }} tabIndex={6}
                                error={errors && errors?.AddHArchive?.DocNo && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='فرستنده' register={{ ...register(`AddHArchive.sender`) }} tabIndex={7}
                                error={errors && errors?.AddHArchive?.sender && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='گیرنده' register={{ ...register(`AddHArchive.receiver`) }} tabIndex={8}
                                error={errors && errors?.AddHArchive?.receiver && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1 '>
                            <TextFieldItem
                                label='توضیحات' register={{ ...register(`AddHArchive.comment`) }} tabIndex={9}
                                error={errors && errors?.AddHArchive?.comment && true}
                            />
                        </div>
                        <div className='p-1 relative col-span-1'>
                            <SelectOption
                                {...register(`AddHArchive.archiveCategoryId`)}
                                placeholder={'Categories'}
                                loading={categories != undefined ? false : true}
                                value={categories == undefined ? null : categories!.find((item: GetCategoriesModel) => item.id == getValues('AddHArchive.archiveCategoryId')) ? categories!.find((item: GetCategoriesModel) => item.id == getValues('AddHArchive.archiveCategoryId')) : null}
                                errorType={errors?.AddHArchive?.archiveCategoryId}
                                className='z-[85858585]'
                                onChange={(option: SingleValue<GetCategoriesModel>, actionMeta: ActionMeta<GetCategoriesModel>) => {
                                    setValue(`AddHArchive.archiveCategoryId`, option!.id);
                                    trigger(`AddHArchive.archiveCategoryId`);
                                }}
                                options={categories == undefined ? [{
                                    id: 0, value: 0, label: 'no option found',
                                    faName: 'no option found',
                                    name: 'no option found'
                                }] : categories}
                            />
                            <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddHArchive && errors?.AddHArchive.archiveCategoryId?.message}</label>
                        </div>
                        <div className='p-1 relative col-span-1'>
                            <input type='file'
                                autoComplete='off'
                                accept='.pdf, .doc, .docx, .xls, .xlsx, .png, .jpeg, .jpg, .tiff'
                                {...register(`AddHArchive.file`)}
                                ref={fileRef}
                                onChange={async () => await handleFile()}
                                className={errors?.AddHArchive && errors?.AddHArchive?.file ? `${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} border-red-400 border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused text-red-400 ` : `${themeMode?.stateMode ? 'lightText' : 'darkText'} border-[#607d8b] border border-opacity-70 font-[FaLight] h-[40px] p-1 w-full rounded-md text-[13px] rinng-0 outline-none shadow-none bg-inherit focused `} />
                            <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.AddHArchive && errors?.AddHArchive.file?.message}</label>
                        </div>
                    </section>
                </form>
            </CardBody>
        </MyCustomComponent >
    )
})
AddHArchive.displayName = 'AddHArchive'
export default AddHArchive