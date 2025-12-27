import './App.css'
import { useConfig } from './hooks/useConfig.ts';
import {useApi} from "./hooks/useApi.ts";
import {useEffect, useState} from "react";

function App() {
    const config = useConfig()
    const api = useApi()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<unknown>(null)

    useEffect(() => {
        (async () => {
            try {
                const testResponse = await api.test()

                console.log(testResponse)

                setError(null)
            } catch (e) {
                setError(e)
            }

            setIsLoading(false)
        })()
    }, [config, api])

    if(error) {
        return (
            <div>Error: {error + ""}</div>
        )
    }

    if(isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div>Result</div>
    )
}

async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
        console.log("Copied to clipboard");
    } catch (err) {
        console.error("Failed to copy:", err);
    }
}

export default App
