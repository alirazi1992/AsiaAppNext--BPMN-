import { Response } from '@/app/Domain/shared';
import useAxios from '@/app/hooks/useAxios';
import { AxiosResponse } from 'axios';
import { ProfileDefectanceAllModel } from '@/app/Domain/M_HumanRecourse/Defects';

const GetAllProfileDefectances = () => {

    const { AxiosRequest } = useAxios();

    const Function = async (): Promise<AxiosResponse<Response<ProfileDefectanceAllModel[]>>> => {
        const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetAllProfilesDefectances`;
        const url = baseUrl;
        const method = 'get';
        const data = {};

        const response = await AxiosRequest({ url, method, data, credentials: true });
        return response;
    };

    return { Function };
};

export default GetAllProfileDefectances;
