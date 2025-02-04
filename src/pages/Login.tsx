import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import BaseButton from "../components/base/BaseButton";
import BaseInput from "../components/base/BaseInput";
import { setUserInfo } from "../features/user/userSlice";
import { supabase } from "../services/supbase";

function Login() {
    const { session } = useSelector(store => store.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState('');
    const [loading, setLoading] = useState(false)
    async function formSubmit(e: FormEvent) {
        setErrors('')
        e.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const { email, password } = Object.fromEntries(formData);
            //TODO set Validation
            const { data, error } = await supabase.auth.signUp({
                email: email as string,
                password: password as string,
            })
            if ((error?.status === 422 && error?.code === "user_already_exists") || data.user) {
                const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                    email: email as string,
                    password: password as string,
                })
                if (loginData.session) {
                    localStorage.setItem('access_token', loginData.session.access_token)
                    localStorage.setItem('refresh_token', loginData.session.refresh_token)
                    dispatch(setUserInfo({
                        email: loginData.user.email as string,
                        session: {
                            access_token: loginData.session.access_token,
                            refresh_token: loginData.session.refresh_token,
                        }
                    }))
                    const { data: dataInsert, error: errorInsert } = await supabase.from('users').insert({ email, password, token: loginData.session.access_token })
                    if (errorInsert) {
                        await supabase
                            .from('users')
                            .update({ token: loginData.session.access_token })
                            .eq('email', email)

                    }
                    navigate('/')
                }
                else if (loginError) setErrors(loginError.message)

            } else if (error) setErrors(error.message)
        } finally {
            setLoading(false)
        }
    }
    if (session.access_token) return <Navigate to="/" replace />
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="rounded-xl p-10 bg-gray-900/90">
                <h1 className="font-semibold  text-xl">Your welcome</h1>
                <form onSubmit={formSubmit} className="pt-4 mt-5 flex flex-col gap-y-7">
                    <BaseInput label="email" name="email" className="w-full flex items-center gap-x-3" type="email" required></BaseInput>
                    <BaseInput label="password" name="password" className="w-full flex items-center gap-x-3" required minLength={6}></BaseInput>
                    <BaseButton type="submit" className="btn__outline w-full" isLoading={loading}>SignIn</BaseButton>
                    {errors && <span className="text-sm text-red-500">{errors}</span>}
                </form>
            </div>
        </div>
    );
}
export default Login;