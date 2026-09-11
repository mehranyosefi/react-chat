// api/users.api.ts

import { User } from "@supabase/supabase-js";
import { apiClient } from "../../features/api/apiClient";
import { UserResponse } from "./user.type";

export function getMe():Promise<UserResponse> {
  return apiClient<UserResponse>(
    'me',
    {
      authorizationRequired: true,
    },
  );
}
export function getUserByID(id: string):Promise<UserResponse> {
  return apiClient<UserResponse>(
    `users/${id}`,
    {
      authorizationRequired: true,
    },
  );
}

export function getUsers() {
  return apiClient<User[]>(
    "users",
    {
      authorizationRequired: true,
    },
  );
}