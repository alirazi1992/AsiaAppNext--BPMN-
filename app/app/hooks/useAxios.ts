import { useStore } from "zustand";
import { AxiosProps } from "../Application-AsiaApp/Utils/shared";
import AuthorizationStore from '@/app/zustandData/Authorization'
import axios from "axios";
import cookies from 'js-cookie';

function useAxios() { 
    const Authorization = useStore(AuthorizationStore, (state) => state)
    const AxiosRequest = async ({ url, method, data, credentials }: AxiosProps) => {
        try {
            let response = await axios({
                url: url,
                method: method,
                data: data,
                withCredentials: credentials,
            })
            let currentDateTime = new Date()
            currentDateTime = new Date(currentDateTime.setHours(currentDateTime.getHours() + 2))
            if (response.status == 401) {
                return 'UnAuthorized...'
            } else {
                if (response.status !== 401) { cookies.set('Session', `{"expirationDate" : "${currentDateTime}"}`) }
                return response;
            }
        } catch (error: any) {
            if (error.response.status == 401) { Authorization?.changeState() }
            if (error.response) {
                return error.response
            } else if (error.request) {
                return error.requet
            } else if (error.message) {
                return (error.message)
            }
        }
    };
    return { AxiosRequest };
}

export default useAxios;