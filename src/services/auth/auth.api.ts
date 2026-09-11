// features/auth/auth.api.ts

import { apiClient } from "../../features/api/apiClient";
import { LoginPayload, LoginResponse, SignupPayload } from "./auth.type";
export function login(payload: LoginPayload) {
    return apiClient<LoginResponse>("/login", {
        method: "POST",
        body: payload,
    });
}

export function signup(payload: SignupPayload) {
    return apiClient<LoginResponse>("/signup", {
        method: "POST",
        body: payload,
    });
}