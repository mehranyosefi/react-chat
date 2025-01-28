import { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import BaseButton from "../components/base/BaseButton";
import BaseInput from "../components/base/BaseInput";
import { setUser } from "../features/user/userSlice";
import { supabase } from "../services/supbase";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    async function formSubmit(e: FormEvent) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const { email, password } = Object.fromEntries(formData);
        try {
            const { data } = await supabase.auth.signUp({
                email: email as string,
                password: password as string,
            })
            if (data) {
                const { data: loginData } = await supabase.auth.signInWithPassword({
                    email: email as string,
                    password: password as string,
                })
                if (loginData.session) {
                    localStorage.setItem('access_token', loginData.session.access_token)
                    localStorage.setItem('refresh_token', loginData.session.refresh_token)
                    dispatch(setUser({
                        email: loginData.user.email as string
                    }))
                    navigate('/')
                }
                // const { data: dataVerify, error: errorVerify } = await supabase.auth.verifyOtp({ email: data.user.email, token: data.user.id, type: 'email' })
                // console.log(dataVerify, errorVerify)
            }

        } catch (e) {
            console.log(e)
        }

    }
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="rounded-xl p-10 bg-gray-900/90">
                <h1 className="font-semibold  text-xl">Your welcome</h1>
                <form onSubmit={formSubmit} className="pt-4 mt-5 flex flex-col gap-y-7">
                    <BaseInput label="email" name="email" className="w-full flex items-center gap-x-3" type="email" required></BaseInput>
                    <BaseInput label="password" name="password" className="w-full flex items-center gap-x-3" required></BaseInput>
                    <BaseButton type="submit" className="btn__outline w-full">SignIn</BaseButton>
                </form>
            </div>
        </div>
    );
}
export default Login;