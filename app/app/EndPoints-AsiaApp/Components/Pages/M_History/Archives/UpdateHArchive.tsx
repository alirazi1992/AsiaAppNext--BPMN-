'use client'
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import themeStore from '@/app/zustandData/theme.zustand'
import colorStore from '@/app/zustandData/color.zustand'
import useStore from '@/app/hooks/useStore'
import { Button, Dialog, DialogBody, DialogHeader, Tooltip } from '@material-tailwind/react'
import { CloseIcon } from '../../../Shared/IconComponent'
import { ArchivesModel, GetCategoriesModel, SearchArchiveModels, UpdateArchiveModel } from '@/app/Domain/M_History/Archive'
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectOption from '../../../Shared/SelectOption'
import { useList } from '@/app/Application-AsiaApp/M_History/fetchCategoriesList';
import { ActionMeta, SingleValue } from 'react-select'
import SaveIcon from '@mui/icons-material/Save';
import { ArchiveSerachContext } from './Archive-MainContainer'
import { LoadingModel } from '@/app/Domain/shared'
import { UpdatingHArchive } from '@/app/Application-AsiaApp/M_History/UpdateHArchive'
import MyCustomComponent from '../../../Shared/CustomTheme_Mui'
import TextFieldItem from '../../../Shared/TextFieldItem'

const UpdateHArchive = forwardRef((props: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const { state, setLoadings, setState } = useContext(ArchiveSerachContext)

    const color = useStore(colorStore, (state) => state)
    const [open, setOpen] = useState<boolean>(false)
    const { updateHArchive } = UpdatingHArchive()
    const handleOpen = () => setOpen(!open)
    const [categories, setCategories] = useState<GetCategoriesModel[]>([])
    const { fetchCategoriesList } = useList()
    const schema = yup.object().shape({
        UpdateArchive: yup.object(({
            vesselNameF: yup.string().required('اجباری').matches(/^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف فارسی هستید'),
            vesselNameE: yup.string().required('اجباری').matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`]+$/, 'فقط مجاز به استفاده از حروف لاتین هستید'),
            AsiaCode: yup.string().required('اجباری'),
            subject: yup.string().required('اجباری'),
            RegNo: yup.string().required('اجباری'),
            archiveCategoryId: yup.number().required('اجباری').min(1, 'اجباری'),
            sender: yup.string().optional().nullable(),
            comment: yup.string().optional().nullable(),
            receiver: yup.string().optional().nullable(),
            DocNo: yup.string().optional().nullable(),
            id: yup.number().required(),
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
    } = useForm<UpdateArchiveModel>(
        {
            defaultValues: {
                UpdateArchive: {
                    vesselNameF: '',
                    vesselNameE: '',
                    AsiaCode: '',
                    subject: '',
                    RegNo: '',
                    id: 0,
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

    const OnSubmit = async (data: UpdateArchiveModel) => {
        setLoadings((prev: LoadingModel) => ({ ...prev, response: true }))
        const res = await updateHArchive(data).then((result) => {
            if (result && result == true) {
                setLoadings((prev: LoadingModel) => ({ ...prev, response: false }))
                let option: ArchivesModel | undefined = state.hArchives.find((item: ArchivesModel) => item.id === data.UpdateArchive.id);
                if (option) {
                    let updatedArchives = state.hArchives.map((item: ArchivesModel) => {
                        if (item.id === option.id) {
                            return {
                                ...option,
                                archiveCategory: categories.find((cat: GetCategoriesModel) => cat.id == getValues('UpdateArchive.archiveCategoryId'))!.faTitle,
                                asiaCode: getValues('UpdateArchive.AsiaCode'),
                                comment: getValues('UpdateArchive.comment'),
                                subject: getValues('UpdateArchive.subject'),
                                docNo: getValues('UpdateArchive.DocNo'),
                                sender: getValues('UpdateArchive.sender'),
                                receiver: getValues('UpdateArchive.receiver'),
                                regNo: getValues('UpdateArchive.RegNo'),
                                vesselNameF: getValues('UpdateArchive.vesselNameF'),
                                vesselNameE: getValues('UpdateArchive.vesselNameE'),
                            };
                        }
                        return item;
                    });
                    setState((prev: SearchArchiveModels) => ({ ...prev, hArchives: updatedArchives }));
                }
            }
        })
    }

    useImperativeHandle(ref, () => ({
        handleOpen: () => {
            handleOpen()
        },
        setItem: (data: ArchivesModel) => {
            setValue('UpdateArchive.vesselNameE', data.vesselNameE!)
            setValue('UpdateArchive.vesselNameF', data.vesselNameF!)
            setValue('UpdateArchive.DocNo', data.docNo!)
            setValue('UpdateArchive.comment', data.comment!)
            setValue('UpdateArchive.archiveCategoryId', categories.find((item: GetCategoriesModel) => item.faTitle == data.archiveCategory)!.id)
            setValue('UpdateArchive.subject', data.subject!)
            setValue('UpdateArchive.sender', data.sender)
            setValue('UpdateArchive.receiver', data.receiver)
            setValue('UpdateArchive.AsiaCode', data.asiaCode)
            setValue('UpdateArchive.RegNo', data.regNo)
            setValue('UpdateArchive.id', data.id)
        }
    }));

    return (
        <MyCustomComponent>
            <Dialog className={` ${!themeMode || themeMode?.stateMode ? 'cardDark' : 'cardLight'} overflow-x-auto m-auto`} size="sm" open={open} handler={handleOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <DialogHeader dir='rtl' className={`${!themeMode || themeMode?.stateMode ? 'cardDark lightText' : 'cardLight darkText'} flex justify-between sticky top-0 left-0`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Update History File
                    <CloseIcon onClick={() => { handleOpen() }} />
                </DialogHeader>
                <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                        <section className='grid grid-cols-1 gap-y-4 my-2'>
                            <div className='p-1 relative col-span-1 '>
                                <TextFieldItem
                                    label='نام فارسی شناور' register={{ ...register(`UpdateArchive.vesselNameF`) }} tabIndex={1}
                                    error={errors && errors?.UpdateArchive?.vesselNameF && true}
                                />
                                <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UpdateArchive && errors?.UpdateArchive.vesselNameF?.message}</label>
                            </div>
                            <div className='p-1 relative col-span-1 '>
                                <TextFieldItem
                                    label='نام انگلیسی شناور' register={{ ...register(`UpdateArchive.vesselNameE`) }} tabIndex={2}
                                    error={errors && errors?.UpdateArchive?.vesselNameE && true}
                                />
                                <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UpdateArchive && errors?.UpdateArchive.vesselNameE?.message}</label>
                            </div>
                            <div className='p-1 relative col-span-1 '>
                                <TextFieldItem
                                    label='RegNo' register={{ ...register(`UpdateArchive.RegNo`) }} tabIndex={3}
                                    error={errors && errors?.UpdateArchive?.RegNo && true}
                                />
                                <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UpdateArchive && errors?.UpdateArchive.RegNo?.message}</label>
                            </div>
                            <div className='p-1 relative col-span-1 '>
                                <TextFieldItem
                                    label='AsiaCode' register={{ ...register(`UpdateArchive.AsiaCode`) }} tabIndex={4}
                                    error={errors && errors?.UpdateArchive?.AsiaCode && true}
                                />
                                <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UpdateArchive && errors?.UpdateArchive.AsiaCode?.message}</label>
                            </div>
                            <div className='p-1 relative col-span-1 '>
                                <TextFieldItem
                                    label='موضوع' register={{ ...register(`UpdateArchive.subject`) }} tabIndex={5}
                                    error={errors && errors?.UpdateArchive?.subject && true}
                                />
                                <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UpdateArchive && errors?.UpdateArchive.subject?.message}</label>
                            </div>
                            <div className='p-1 relative col-span-1 '>
                                <TextFieldItem
                                    label='شماره مدرک' register={{ ...register(`UpdateArchive.DocNo`) }} tabIndex={6}
                                    error={errors && errors?.UpdateArchive?.DocNo && true}
                                />
                            </div>
                            <div className='p-1 relative col-span-1 '>
                                <TextFieldItem
                                    label='فرستنده' register={{ ...register(`UpdateArchive.sender`) }} tabIndex={7}
                                    error={errors && errors?.UpdateArchive?.sender && true}
                                />
                            </div>
                            <div className='p-1 relative col-span-1 '>
                                <TextFieldItem
                                    label='گیرنده' register={{ ...register(`UpdateArchive.receiver`) }} tabIndex={8}
                                    error={errors && errors?.UpdateArchive?.receiver && true}
                                />
                            </div>
                            <div className='p-1 relative col-span-1 '>
                                <TextFieldItem
                                    label='توضیحات' register={{ ...register(`UpdateArchive.comment`) }} tabIndex={9}
                                    error={errors && errors?.UpdateArchive?.comment && true}
                                />
                            </div>
                            <div className='p-1 relative col-span-1'>
                                <SelectOption
                                    {...register(`UpdateArchive.archiveCategoryId`)}
                                    placeholder={'Categories'}
                                    className='z-[7468465436154635464]'
                                    loading={categories != undefined ? false : true}
                                    value={categories == undefined ? null : categories!.find((item: GetCategoriesModel) => item.id == getValues('UpdateArchive.archiveCategoryId')) ? categories!.find((item: GetCategoriesModel) => item.id == getValues('UpdateArchive.archiveCategoryId')) : null}
                                    errorType={errors?.UpdateArchive?.archiveCategoryId}
                                    onChange={(option: SingleValue<GetCategoriesModel>, actionMeta: ActionMeta<GetCategoriesModel>) => {
                                        setValue(`UpdateArchive.archiveCategoryId`, option!.id);
                                        trigger(`UpdateArchive.archiveCategoryId`);
                                    }}
                                    options={categories == undefined ? [{
                                        id: 0, value: 0, label: 'no option found',
                                        faName: 'no option found',
                                        name: 'no option found'
                                    }] : categories}
                                />
                                <label className='absolute bottom-[-15px] left-0 text-[11px] font-[FaBold] text-start text-red-900' >{errors?.UpdateArchive && errors?.UpdateArchive.archiveCategoryId?.message}</label>
                            </div>
                        </section>
                    </form>
                </DialogBody>
            </Dialog>
        </MyCustomComponent>
    )
})
UpdateHArchive.displayName = 'UpdateHArchive'
export default UpdateHArchive