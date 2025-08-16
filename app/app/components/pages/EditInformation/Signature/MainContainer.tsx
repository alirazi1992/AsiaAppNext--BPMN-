'use client';
import Loading from '@/app/components/shared/loadingResponse';
import React, { createContext, useEffect, useRef, useState } from 'react'
import AddSignature from './AddSignature';
import SignatureList from './SignatureList';
import { useSignatures } from '@/app/Application-AsiaApp/M_HumanRecourse/fetchUserSignatures';
import useLoginUserInfo from '@/app/zustandData/useLoginUserInfo';
import UpdateUserStore from '@/app/zustandData/updateUsers';
import { GetUserSignaturesResulltModel } from '@/app/Domain/M_HumanRecourse/UserProfile';
export const SignatureContext = React.createContext<any>(null)

const MainContainer = () => {

    const CurrentUser = useLoginUserInfo.getState();
    const User = UpdateUserStore.getState();
    const { fetchUserSignatures } = useSignatures()
    const [loading, setLoading] = useState<boolean>(false)
    const [list, setList] = useState<GetUserSignaturesResulltModel[]>([])

    useEffect(() => {
        const loadInitialSignatures = async () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            let id = User && User.userId ? User.userId : CurrentUser.userInfo.actors[0].userId
            const res = await fetchUserSignatures(id).then((result) => {
                if (result)
                    if (Array.isArray(result) && result!.length > 0) {
                        setList(result)
                    } else {
                        setList([])
                    }
            })
        };
        loadInitialSignatures();
    }, [CurrentUser, User, User.userId])



    return (
        <section className='w-full'>
            {loading && <Loading />}
            <SignatureContext.Provider value={{ list, setList, setLoading }}>
                <AddSignature />
                <SignatureList />
            </SignatureContext.Provider>
        </section>
    )
}

export default MainContainer