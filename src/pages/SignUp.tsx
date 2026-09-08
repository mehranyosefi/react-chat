import { FormEvent, useState } from "react";
import BaseButton from "../components/base/BaseButton";
import BaseInput from "../components/base/BaseInput";
import { useFetch } from "../features/hooks/useFetch";
import { Link, useNavigate } from "react-router";
import { setUserInfo } from "../features/user/userSlice";
import { useDispatch } from "react-redux";

function SignUp() {
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchData, loading } = useFetch("/signup", undefined, false);

  async function formSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors("");

    const formData = new FormData(e.target as HTMLFormElement);
    const { name, email, password, passwordConfirm } =
      Object.fromEntries(formData);
    if (password !== passwordConfirm) {
      setErrors("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    const res = await fetchData({
      method: "POST",
      body: { name, email, password, passwordConfirm },
    });

    if (res.error) {
      if ("status" in res.error && res.error.status === 400) {
        setErrors("ایمیل قبلا ثبت شده است");
      } else {
        setErrors("خطایی رخ داد. دوباره تلاش کنید.");
      }
      return;
    }
    const session = res.data.data.session;
    localStorage.setItem("access_token", session.access_token);
    localStorage.setItem("refresh_token", session.refresh_token);
    dispatch(setUserInfo({
      email: res.data.data.user.email,
      session: res.data.data.session
    }));
    navigate('/')
}


    return (
      <div className="flex items-center justify-center h-screen">
        <div className="rounded-xl p-10 bg-gray-900/90">
          <h1 className="font-semibold text-xl">Create Account</h1>

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

            <BaseButton type="submit" className="btn__outline w-full" isLoading={loading}>
              SignUp
            </BaseButton>

            <p>
                آیا حساب کاربری دارید؟ <Link to="/login" className="text-purple-500">ورود</Link>
            </p>

            {errors && <span className="text-sm text-red-500">{errors}</span>}
          </form>
        </div>
      </div>
    );
  }


export default SignUp;
