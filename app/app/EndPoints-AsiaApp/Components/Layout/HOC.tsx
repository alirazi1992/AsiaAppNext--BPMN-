
'use client'
import { useEffect, useRef, useState } from 'react';
import cookies from 'js-cookie';
import Login from '../Shared/Login';
import AuthorizeStore from '@/app/zustandData/Authorization'
import useStore from '@/app/hooks/useStore';
const WithAuth = (WrappedComponent: any) => {
    return function X(props: any) {
        const LoginRef = useRef<{ handleOpen: (data: boolean) => void }>(null);
        const [isLoginOpen, setIsLoginOpen] = useState(false)
        const AuthorizationState = useStore(AuthorizeStore, (state) => state)

        useEffect(() => {
            const test = cookies.get('Session');
            if (test == null || AuthorizationState?.Unauthorized === true) {
                if (LoginRef.current && !isLoginOpen) {
                    LoginRef.current.handleOpen(true);
                    setIsLoginOpen(true)
                }
                return
            } else {
                const SessionCookie = JSON.parse(test);
                const Expirationdate = new Date(SessionCookie.expirationDate);
                if (Expirationdate < new Date()) {
                    if (LoginRef.current && !isLoginOpen) {
                        LoginRef.current.handleOpen(true);
                        setIsLoginOpen(true);
                    }
                }
                return
            }
        }, [AuthorizationState?.Unauthorized]);

        return (
            <>
                <WrappedComponent {...props} />
                <Login ref={LoginRef} />
            </>
        );
    };
};

export default WithAuth;