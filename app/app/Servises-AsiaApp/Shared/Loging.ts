import { LoginData, LoginModel, Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const Login = async (dataItem: LoginData) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/account`;
//     let data = { "username": dataItem.User.username, "password": dataItem.User.password };
//     let method = 'post';
//     var response: AxiosResponse<Response<LoginModel>> = await useAxios({ url, method, data, credentials: true });
//     return response;
// }
// export default Login;

const Login = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItem: LoginData) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/identity/account`;
        let data = { "username": dataItem.User.username, "password": dataItem.User.password };
        let method = 'post';
        let response: AxiosResponse<Response<LoginModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default Login