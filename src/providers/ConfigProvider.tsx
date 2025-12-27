import React, {useMemo, type ReactNode} from "react";
import { ConfigContext } from "./ConfigContext.ts";
import type {Config} from "../config/config.ts";

type ConfigProviderProps = {
    config: Config
    children: ReactNode
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({config, children}) => {
    const configValue = useMemo(() => {
        return config
    }, [config])

    return <ConfigContext.Provider value={configValue}>{children}</ConfigContext.Provider>
}
