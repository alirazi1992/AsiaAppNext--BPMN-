'use client';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Button, Tooltip } from '@material-tailwind/react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import useStore from '@/app/hooks/useStore';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField'; // Replaced Textarea with TextField
import * as yup from "yup";
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui'
import { AddParaphModel } from '@/app/Domain/M_Automation/NewDocument/Paraph';
// SubmitAddParaphProps
const AddParaph = forwardRef(({ onSubmit }: any, ref) => {
    const themeMode = useStore(themeStore, (state) => state)
    const color = useStore(colorStore, (state) => state)
    const schema = yup.object().shape({
        AppParaph: yup.object(({
            paraph: yup.string().required('درج متن اجباری')
        })).required(),
    })

    const {
        register,
        handleSubmit,
        reset,
        formState,
    } = useForm<AddParaphModel>(
        {
            defaultValues: {
                AppParaph: {
                    paraph: ''
                },
            },
            mode: 'all',
            resolver: yupResolver(schema)
        }
    );
    const errors = formState.errors;
    const OnSubmit = (data: AddParaphModel) => {
        if (!errors.AppParaph) {
            onSubmit(data.AppParaph)
        }
    }
    useImperativeHandle(ref, () => ({
        ResetMethod: () => {
            reset()
        },
    }));

    return (
        <MyCustomComponent>
            <>
            <form
                dir='rtl'
                onSubmit={handleSubmit(OnSubmit)}
                className='relative w-full md:w-11/12 z-[10]'>
                <div className="w-max">
                    <Tooltip className={!themeMode ||themeMode?.stateMode ? 'lightText cardDark' : 'darkText cardLight'} content='Add Paraph' placement="top">
                        <Button type='submit' size='sm' style={{ background: color?.color }} className='text-white capitalize p-1'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <AddIcon className='p-1' />
                        </Button>
                    </Tooltip>
                </div>
                <div className='p-1 relative my-2'>
                    <TextField size="small"
                        autoComplete='off'
                        {...register(`AppParaph.paraph`)}
                        tabIndex={1}
                        multiline
                        rows={3}
                        error={errors?.AppParaph && errors?.AppParaph?.paraph && true}
                        className='w-full'
                        dir='rtl'
                        label='متن پاراف'
                        InputProps={{
                            style: { color: errors?.AppParaph?.paraph ? '#b91c1c' : !themeMode ||themeMode?.stateMode ? 'white' : '#463b2f' },
                        }}
                    />
                    <label className='text-xs flex w-full absolute top-full left-0 justify-end font-[FaBold] text-start text-red-400' >{errors?.AppParaph && errors?.AppParaph!.paraph?.message}</label>
                </div>
            </form>
            </>
        </MyCustomComponent >
    )
})
AddParaph.displayName = 'AddParaph'

export default AddParaph
