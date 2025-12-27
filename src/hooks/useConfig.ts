import {useContext} from "react";
import {ConfigContext} from "../providers/ConfigContext.ts";
import type { Config } from "../config/config.ts";

export function useConfig(): Config {
    const ctx = useContext(ConfigContext)
    if (!ctx) {
        throw new Error("useConfig должен вызываться внутри <ConfigProvider>")
    }

    return ctx
}
