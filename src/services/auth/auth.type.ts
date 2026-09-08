export interface LoginPayload {
    email: string;
    password: string;
}
export interface SignupPayload {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export interface LoginResponse {
    status: string;
    data: {
        user: {
            email: string;
            name: string;
        };
        session: {
            access_token: string;
            refresh_token: string;
        };
    };
}
