import { useCallback } from "react";
import { setUserResponse } from "../types/types";
import { getUser } from "../services/auth";


export function useUser(){

    const GetUser = useCallback(
        async () : Promise<setUserResponse> => {

            const token = localStorage.getItem("accessToken")
            const data = await getUser(token);

            if (!data) throw new Error("Something went wrong in parsing data");
            return data.data;
            
        },
        []
    )
    return {GetUser};
}