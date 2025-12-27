import React, {useMemo, type ReactNode} from "react";
import { ApiContext } from "./ApiContext.ts";
import {ApiClient} from "../api/ApiClient.ts";

type ApiProviderProps = {
    baseUrl: string
    children: ReactNode
}

export const ApiProvider: React.FC<ApiProviderProps> = ({baseUrl, children}) => {
    const apiClient = useMemo(() => {
        return new ApiClient({
            baseUrl: baseUrl,
        })
    }, [baseUrl])

    return <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
}
