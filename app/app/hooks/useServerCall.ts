import { useStore } from "zustand";
import AuthorizationStore from "@/app/zustandData/Authorization";
import axios from "axios";
import cookies from "js-cookie";

type ServerCall = {
  entity: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  data?: unknown;
};

function useServerCall() {
  const Authorization = useStore(AuthorizationStore, (state) => state);
  const serverCall = async ({ entity, method, data = null }: ServerCall) => {
    try {
      let response = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/${entity}`,
        method: method,
        data: data,
        withCredentials: true,
      });
      let currentDateTime = new Date();
      currentDateTime = new Date(
        currentDateTime.setHours(currentDateTime.getHours() + 2)
      );
      if (response.status == 401) {
        return "UnAuthorized...";
      } else {
        if (response.status !== 401) {
          cookies.set("Session", `{"expirationDate" : "${currentDateTime}"}`);
        }
        return response.data;
      }
    } catch (error: any) {
      if (error.response.status == 401) {
        Authorization?.changeState();
      }
      if (error.response) {
        return error.response;
      } else if (error.request) {
        return error.requet;
      } else if (error.message) {
        return error.message;
      }
    }
  };
  return serverCall;
}

export default useServerCall;
