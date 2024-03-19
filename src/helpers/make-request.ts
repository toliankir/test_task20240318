import { getApiUrl } from "./get-apiurl";

export const makeRequest = async <T>(opts: {
    path: string;
    method: "POST" | "GET" | "DELETE" | "PUT";
    data?: { [key: string]: unknown }
    token?: string;
    role?: string;
}): Promise<T> => {

    const apiUrl = getApiUrl();
    const options: RequestInit = {
        method: opts.method,
        headers: {
            "Content-Type": "application/json"
        }
    };
    if (opts.data) {
        options.body = JSON.stringify(opts.data);
    }

    if (opts.token) {
        options.headers = {
            "Authorization": `Bearer ${opts.token}`,
            ...options.headers,
        }
    }

    if (opts.role) {
        options.headers = {
            "user-role": opts.role,
            ...options.headers,
        }
    }

    const req = await fetch(`${apiUrl}${opts.path}`, options);
    if (req.status >= 300) {
        throw new Error(`${req.status}: ${req.statusText}`);
    }
    
    const obj = await req.json();
    return obj;
}