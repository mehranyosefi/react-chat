import { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
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
            <div className="rounded-xl p-10 bg-gray-900/80">
                <h1 className="font-semibold  text-xl">Your welcome</h1>
                <form onSubmit={formSubmit} className="pt-4 mt-5">
                    <div>
                        <label>email:</label>
                        <input className="ml-2 p-2 outline outline-gray-400 rounded-xl placeholder:text-xs" type="email" name="email" placeholder="email" />
                    </div>
                    <div className="mt-5">
                        <label>password:</label>
                        <input className="ml-2 mt-2 p-2 outline outline-gray-400 rounded-xl placeholder:text-xs" type="password" name="password" placeholder="password" />
                    </div>
                    <div className="text-center mt-10 ">
                        <button type="submit" className="bg-gray-700 py-2 px-12 rounded-xl cursor-pointer hover:bg-gray-900/80 transition-colors duration-300">signIn</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login;