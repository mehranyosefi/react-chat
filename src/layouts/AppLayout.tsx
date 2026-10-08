import DetailInfo from "@/components/detailInfo/DetailInfo";
import { Outlet, redirect, useLoaderData, useNavigation } from "react-router";
import LeftSideBar from "../components/leftSideBar/LeftSideBar";
// import type { RootState } from "../store";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../features/user/userSlice";
import { getAccessToken } from "../utility/auth/tokenStorage";
import { getMe } from "../services/user/user.api";

function AppLayout() {
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";
    const dispatch = useDispatch();
    const data = useLoaderData();
    if (data?.user) {
        dispatch(setUserInfo({
            email: data.user.email,
            session: {
                access_token: localStorage.getItem('access_token'),
                refresh_token: localStorage.getItem('refresh_token')
            }
        }))
    }

    return (
        <div className="app w-screen h-screen overflow-hidden backdrop-blur-sm bg-black/50">
            <div className="mx-auto max-w-[2150px] h-screen p-0 md:p-8">
                <div className="flex h-full md:h-[calc(100vh-64px)]">
                    <div className="w-full md:w-96 h-full md:rounded-3xl p-5 bg-gray-800">
                        <LeftSideBar />
                    </div>
                    <div className="hidden md:flex grow-[3]">
                        <div className="grow">
                            <Outlet />
                        </div>
                        <div className="w-96 hidden lg:flex">
                            <DetailInfo></DetailInfo>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export async function loader() {
    const access_token = getAccessToken()
    if(access_token) {
        const res = await getMe()
        if(res.status === 'success') return res.data?.user
        return null
    }else {
        return redirect('/login')
    }
}

export default AppLayout;