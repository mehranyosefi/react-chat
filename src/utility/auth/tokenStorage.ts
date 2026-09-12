// features/auth/tokenStorage.ts

export function setTokens(tokens: {
    access_token: string;
    refresh_token: string;
}) {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
}

export function clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}

export function getAccessToken() {
    return localStorage.getItem("access_token");
}

export function getRefreshToken() {
    return localStorage.getItem("refresh_token");
}