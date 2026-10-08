import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router";

import BaseButton from "../components/base/BaseButton";
import BaseInput from "../components/base/BaseInput";

import { signup } from "../services/auth/auth.api";
import { getAccessToken, setTokens } from "../utility/auth/tokenStorage";
import { setUserInfo } from "../features/user/userSlice";
import { ApiError } from "../features/api/apiClient.type";

function SignUp() {
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const access_token = getAccessToken()
    async function formSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors("");

        const formData = new FormData(e.currentTarget);

        const name = String(formData.get("name") ?? "");
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");
        const passwordConfirm = String(
            formData.get("passwordConfirm") ?? ""
        );

        // Client-side validation
        if (password !== passwordConfirm) {
            setErrors("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await signup({
                name,
                email,
                password,
                passwordConfirm,
            });

            const { user, session } = res.data;
            setTokens(session);
            dispatch(
                setUserInfo({
                    email: user.email,
                    name: user.name,
                })
            );
            navigate("/", { replace: true });
        } catch (error) {
            // if (error instanceof ApiError) {
            const apiError = error as ApiError;
            setErrors(apiError.message);
        } finally {
            setLoading(false);
        }
    }
    if (access_token) {
        return <Navigate to="/" replace />;
    }


    return (
        <div className="flex items-center justify-center h-screen">
            <div className="rounded-xl p-5 md:p-10 bg-gray-900/90">
                <h1 className="font-semibold text-xl">
                    Create Account
                </h1>

                <form
                    onSubmit={formSubmit}
                    className="pt-4 mt-5 flex flex-col gap-y-7"
                >
                    <BaseInput
                        label="name"
                        name="name"
                        className="w-full flex items-center gap-x-3"
                        type="text"
                        required
                        autoFocus
                    />

                    <BaseInput
                        label="email"
                        name="email"
                        className="w-full flex items-center gap-x-3"
                        type="email"
                        required
                    />

                    <BaseInput
                        label="password"
                        name="password"
                        className="w-full flex items-center gap-x-3"
                        type="password"
                        required
                        minLength={8}
                    />

                    <BaseInput
                        label="confirm password"
                        name="passwordConfirm"
                        className="w-full flex items-center gap-x-3"
                        type="password"
                        required
                        minLength={8}
                    />

                    <BaseButton
                        type="submit"
                        variant="outline"
                        isLoading={loading}
                    >
                        SignUp
                    </BaseButton>

                    <p>
                       Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-purple-500"
                        >
                            Log in
                        </Link>
                    </p>

                    {errors && (
                        <span className="text-sm text-red-500">
                            {errors}
                        </span>
                    )}
                </form>
            </div>
        </div>
    );
}

export default SignUp;