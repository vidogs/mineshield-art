export interface ApiClientParams {
    baseUrl: string
}

export interface BaseParams {
    requestInfo?: RequestInfo
    requestInit?: RequestInit
}

export interface ApiResponse<T> {
    response?: T
}

export type ApiResponsePromise<T> = Promise<ApiResponse<T>>

export interface TestResponse {

}

export class ApiClient {
    protected baseUrl: string

    constructor(params: ApiClientParams) {
        this.baseUrl = params.baseUrl
    }

    async test(): ApiResponsePromise<TestResponse> {
        return await this.makeRequest("/test")
    }

    protected async makeRequest<T>(uri: string, params: BaseParams = {}): ApiResponsePromise<T> {
        const requestUrl = this.baseUrl + uri

        const requestInit: RequestInit = {
            ...params.requestInit,
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json',
            }),
        }

        try {
            let response = await fetch(requestUrl, requestInit)
            let json = await response.json()

            return {
                response: json as T,
            }
        } catch (error: unknown) {
            throw error
        }
    }

    protected addHeader(req: RequestInit, key: string, value: string) {
        if (!req.headers) {
            req.headers = new Headers()
        }

        if (req.headers instanceof Headers) {
            req.headers.append(key, value)

            return
        }

        if (Array.isArray(req.headers)) {
            req.headers.push([key, value])

            return
        }

        if (typeof req.headers === "object") {
            req.headers[key] = value

            return
        }

        throw new Error("Unknown headers type in RequestInit")
    }
}
