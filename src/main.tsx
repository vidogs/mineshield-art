import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ApiProvider} from "./providers/ApiProvider.tsx";
import {ConfigProvider} from "./providers/ConfigProvider.tsx";
import type {Config} from "./config/config.ts";

if (!('Config' in window)) {
    throw new Error('Config not found in window')
}

const windowConfig = window.Config as Config

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider config={windowConfig}>
            <ApiProvider baseUrl={windowConfig.baseApiUrl}>
                <App/>
            </ApiProvider>
        </ConfigProvider>
    </StrictMode>,
)
