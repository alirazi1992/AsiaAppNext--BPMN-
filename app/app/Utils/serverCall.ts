import axios, { AxiosRequestConfig } from "axios";
import cookies from "js-cookie";
import AuthorizationStore from "@/app/zustandData/Authorization";

async function serverCall<T = unknown>(entity: string, config?: AxiosRequestConfig) {
  const Authorization = AuthorizationStore.getState();

  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${entity}`,
      method: config?.method || "GET",
      data: config?.data,
      withCredentials: config?.withCredentials ?? true,
      ...config,
    });

    // Extend session
    const expirationDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // +2 hours
    cookies.set("Session", JSON.stringify({ expirationDate }));

    return response.data as ServerResponse<T>;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      Authorization?.changeState?.(); // Logout user
      throw new Error("Unauthorized");
    }

    // Let SWR handle retry logic
    throw error?.response?.data || error?.message || "Unknown error";
  }
}

export default serverCall;
