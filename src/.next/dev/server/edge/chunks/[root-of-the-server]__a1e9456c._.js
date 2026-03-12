(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__a1e9456c._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/www/agro-market/agro-marketplace/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
// ─── TOKEN HELPER ─────────────────────────────────────────────────────────────
function getToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
// ─── BUILD URL WITH QUERY PARAMS ──────────────────────────────────────────────
function buildUrl(endpoint, params) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value])=>{
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }
    return url.toString();
}
// ─── CORE FETCH WRAPPER ───────────────────────────────────────────────────────
async function request(endpoint, config = {}) {
    const { params, headers, ...rest } = config;
    const token = getToken();
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...token ? {
            Authorization: `Bearer ${token}`
        } : {}
    };
    const url = buildUrl(endpoint, params);
    const response = await fetch(url, {
        ...rest,
        headers: {
            ...defaultHeaders,
            ...headers
        }
    });
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    if (!response.ok) {
        const errorBody = isJson ? await response.json() : {
            message: response.statusText
        };
        const apiError = {
            message: errorBody.message || 'An error occurred',
            statusCode: response.status
        };
        throw apiError;
    }
    if (response.status === 204) {
        return undefined;
    }
    return isJson ? response.json() : response.text();
}
const api = {
    get (endpoint, params) {
        return request(endpoint, {
            method: 'GET',
            params
        });
    },
    post (endpoint, body) {
        return request(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined
        });
    },
    put (endpoint, body) {
        return request(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined
        });
    },
    patch (endpoint, body) {
        return request(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined
        });
    },
    delete (endpoint) {
        return request(endpoint, {
            method: 'DELETE'
        });
    },
    // For file uploads (multipart/form-data)
    upload (endpoint, formData) {
        const token = getToken();
        return request(endpoint, {
            method: 'POST',
            headers: token ? {
                Authorization: `Bearer ${token}`
            } : {},
            body: formData
        });
    }
};
const __TURBOPACK__default__export__ = api;
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__a1e9456c._.js.map