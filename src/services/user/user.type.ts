type User = {
    id: string;
    email: string;
    name: string
}

export interface UserResponse {
    status: "success" | "error" | "false";
    data?: {
        user: User
    }
}