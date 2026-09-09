import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router";
import BaseButton from "../components/base/BaseButton";
import BaseInput from "../components/base/BaseInput";
import { login } from "../services/auth/auth.api";
import { getAccessToken, setTokens } from "../features/auth/tokenStorage";
import { setUserInfo } from "../features/user/userSlice";

function Login() {
    const access_token = getAccessToken()

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);

    async function formSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors("");
        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");

        try {
            setLoading(true);
            const res = await login({
                email,
                password,
            });
            const { user, session } = res.data;
            setTokens(session);
            dispatch(
                setUserInfo({
                    email: user.email,
                    name: user.name,
                }),
            );
            navigate("/", { replace: true });
        } catch (error) {
            if (error.status === 401) {
                setErrors("Invalid email or password.");
            } else {
                setErrors("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    if (access_token) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="rounded-xl p-10 bg-gray-900/90">
                <h1 className="font-semibold text-xl">
                    Your welcome
                </h1>

                <form
                    onSubmit={formSubmit}
                    className="pt-4 mt-5 flex flex-col gap-y-7"
                >
                    <BaseInput
                        label="email"
                        name="email"
                        className="w-full flex items-center gap-x-3"
                        type="email"
                        required
                        autoFocus
                    />

                    <BaseInput
                        label="password"
                        name="password"
                        className="w-full flex items-center gap-x-3"
                        type="password"
                        required
                        minLength={8}
                    />

                    <BaseButton
                        type="submit"
                        className="btn__outline w-full"
                        isLoading={loading}
                    >
                        SignIn
                    </BaseButton>

                    <p>
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-purple-500"
                        >
                            Sign up
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

export default Login;