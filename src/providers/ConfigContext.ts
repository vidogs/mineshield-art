import {type Context, createContext} from "react";
import type {Config} from "../config/config.ts";

type ConfigContextValue = Config

export const ConfigContext: Context<ConfigContextValue | undefined> =
    createContext<ConfigContextValue | undefined>(undefined)
