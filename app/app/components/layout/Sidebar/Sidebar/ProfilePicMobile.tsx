import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import profile from '@/app/assets/images/userPhoto.svg';
import UpdateUserStore, { UpdateUserData } from './../../../../zustandData/updateUsers';
import activeStore from '@/app/zustandData/activate.zustand';
import useStore from "../../../../hooks/useStore";

export default function ProfilePic(props: any) {
    let base64String = props.props.userInfo?.profilePicture == null ? "" : `data:image/png;base64,${props.props.userInfo?.profilePicture}`;
    const User = useStore(UpdateUserStore, (state) => state)
    const router = useRouter();
    const activeState = activeStore();
    return (
        <>
            <figure className='w-[55px] h-[55px]  overflow-hidden rounded-full'>
                <Image onClick={() => { User?.setState((state : UpdateUserData)=> ({...state , userName : null, userId:null })), router.push('/Home/EditInformation'), activeStore.setState((state) => ({ ...state, activate: "HR", activeSubLink: "Edit Information" })) }} className="cursor-pointer" width={100} height={100} alt="asiaApp-user" src={props.props.userInfo?.profilePicture != null ? base64String : profile} />
            </figure>

        </>
    )
}
