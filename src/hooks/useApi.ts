import {useContext} from "react";
import {ApiContext} from "../providers/ApiContext.ts";
import type {ApiClient} from "../api/ApiClient.ts";

export function useApi(): ApiClient {
    const ctx = useContext(ApiContext)
    if (!ctx) {
        throw new Error("useApi должен вызываться внутри <ApiProvider>")
    }

    return ctx
}
