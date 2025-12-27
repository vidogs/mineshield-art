import './App.css'
import {useApi} from "./hooks/useApi.ts";
import {useConfig} from "./hooks/useConfig.ts";
import {useAppState} from "./store/appStore.ts";
import {useEffect} from "react";

function formatError(value: unknown): string {
    if (typeof value === "string") {
        return value
    }

    if (value instanceof Error) {
        return value.message
    }

    try {
        return JSON.stringify(value)
    } catch {
        return "Unknown error"
    }
}

function App() {
    const config = useConfig()
    const api = useApi()
    const {
        error,
        isLoading,
        testResponse,
        setError,
        setIsLoading,
        setTestResponse,
    } = useAppState()

    useEffect(() => {
        let isCancelled = false

        const loadData = async () => {
            setIsLoading(true)
            setError(null)
            setTestResponse(null)

            try {
                const response = await api.test()

                if (isCancelled) {
                    return
                }

                setTestResponse(response.response ?? null)
            } catch (e) {
                if (isCancelled) {
                    return
                }

                setError(formatError(e))
            } finally {
                if (!isCancelled) {
                    setIsLoading(false)
                }
            }
        }

        void loadData()

        return () => {
            isCancelled = true
        }
    }, [api, setError, setIsLoading, setTestResponse])

    if (error) {
        return <div>Error: {error}</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <p>Base API: {config.baseApiUrl}</p>
            <p>
                Result:{" "}
                {testResponse ? (
                    <code>{JSON.stringify(testResponse)}</code>
                ) : (
                    "No data returned yet"
                )}
            </p>
        </div>
    )
}

export default App
