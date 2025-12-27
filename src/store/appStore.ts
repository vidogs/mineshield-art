import {create} from "zustand";
import type {TestResponse} from "../api/ApiClient.ts";

type AppState = {
    isLoading: boolean;
    error: string | null;
    testResponse: TestResponse | null;
    setError: (value: string | null) => void;
    setIsLoading: (value: boolean) => void;
    setTestResponse: (value: TestResponse | null) => void;
    resetAppState: () => void;
};

export const useAppState = create<AppState>((set) => ({
    isLoading: false,
    error: null,
    testResponse: null,
    setError: (value) => set(() => ({error: value})),
    setIsLoading: (value) => set(() => ({isLoading: value})),
    setTestResponse: (value) => set(() => ({testResponse: value})),
    resetAppState: () =>
        set(() => ({
            isLoading: false,
            error: null,
            testResponse: null,
        })),
}));

