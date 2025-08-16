'use client';
import React, { createContext, useState } from 'react'
import AddSender from './AddSender';
import SendersList from './SendersList';

export const SenderContext = createContext<any>(null)
const SendersMainContainer = () => {
    return (
        <section className='my-4'>
            <AddSender />
            <SendersList />
        </section>
    )
}

export default SendersMainContainer