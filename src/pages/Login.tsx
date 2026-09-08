import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router";
import BaseButton from "../components/base/BaseButton";
import BaseInput from "../components/base/BaseInput";
import { useFetch } from "../features/hooks/useFetch";
import { setUserInfo } from "../features/user/userSlice";

function Login() {
    const { session } = useSelector(store => store.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState('');

    const { fetchData, loading } = useFetch('/login', undefined, false)

    async function formSubmit(e: FormEvent) {
        setErrors('')
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const { email, password } = Object.fromEntries(formData);
        //TODO set Validation
        const res = await fetchData({
            method: "POST",
            body: { email, password }
        });
        if(res.error) {
            if("status" in res.error &&res.error.status === 401){
              setErrors("ایمیل یا رمز عبور اشتباه است")
            }else{
              setErrors("خطایی رخ داد. دوباره تلاش کنید.")
            }
            return
        }
        const session = res.data.data.session
        localStorage.setItem('access_token', session.access_token)
        localStorage.setItem('refresh_token', session.refresh_token)
        dispatch(setUserInfo({
            email: res.data.data.user.email,
            session: res.data.data.session
        }))
        navigate('/')
    }
    //if user is logged in
    if (session.access_token) return <Navigate to="/" replace />
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="rounded-xl p-10 bg-gray-900/90">
                <h1 className="font-semibold  text-xl">Your welcome</h1>
                <form onSubmit={formSubmit} className="pt-4 mt-5 flex flex-col gap-y-7">
                    <BaseInput label="email" name="email" className="w-full flex items-center gap-x-3" type="email" required></BaseInput>
                    <BaseInput label="password" name="password" className="w-full flex items-center gap-x-3" required minLength={8}></BaseInput>
                    <BaseButton type="submit" className="btn__outline w-full" isLoading={loading}>SignIn</BaseButton>
                    <p>
                        آیا حساب کاربری ندارید؟ <Link to="/signup" className="text-purple-500">ثبت نام</Link>
                    </p>
                    {errors && <span className="text-sm text-red-500">{errors}</span>}
                </form>
            </div>
        </div>
    );
}
export default Login;