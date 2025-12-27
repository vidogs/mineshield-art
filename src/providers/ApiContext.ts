import {type Context, createContext} from "react";
import type {ApiClient} from "../api/ApiClient.ts";

type ApiContextValue = ApiClient

export const ApiContext: Context<ApiContextValue | undefined> =
    createContext<ApiContextValue | undefined>(undefined)
