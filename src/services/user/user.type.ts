type User = {
    id: string;
    email: string;
    name: string
}

export interface UserResponse {
    status: "success" | "error" | "fale";
    data?: {
        user: User
    }
}