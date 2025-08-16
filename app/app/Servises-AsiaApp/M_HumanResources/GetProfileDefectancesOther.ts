import { buildQueryString } from '@/app/Utils/buildQueryString';
import { Response } from '@/app/Domain/shared';
import useAxios from '@/app/hooks/useAxios';
import { AxiosResponse } from 'axios';
import { ProfileDefectanceOtherModel } from '@/app/Domain/M_HumanRecourse/Defects';

const GetProfileDefectancesOther = () => {

    const { AxiosRequest } = useAxios();

    const Function = async (payload: any): Promise<AxiosResponse<Response<ProfileDefectanceOtherModel[]>>> => {
        const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetOtherProfileDefectances`;
        const url = buildQueryString(baseUrl, payload?.query);
        const method = 'get';
        const data = {};

        const response = await AxiosRequest({ url, method, data, credentials: true });
        return response;
    };

    return { Function };
};

export default GetProfileDefectancesOther;
