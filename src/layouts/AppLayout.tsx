import DetailInfo from "@/components/detailInfo/DetailInfo";
import { Outlet, redirect, useLoaderData, useNavigation } from "react-router";
import LeftSideBar from "../components/leftSideBar/LeftSideBar";
// import type { RootState } from "../store";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../features/user/userSlice";
import { supabase } from "../services/supbase";

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
            <div className="2xl:container mx-auto">
                <div className="flex h-screen">
                    <div className="w-full md:w-96 h-full border-r border-gray-500">
                        <LeftSideBar />
                    </div>
                    <div className="hidden md:flex grow-[3]">
                        <div className="grow">
                            <Outlet />
                        </div>
                        <div className="w-96 hidden lg:flex border-l border-gray-500">
                            <DetailInfo></DetailInfo>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export async function loader() {
    if (localStorage.getItem('access_token')) {
        const { data, error } = await supabase.auth.getUser(localStorage.getItem('access_token')!)
        if (!error && data.user) return data
        else if (error.status === 403 || error?.status === 400) {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: localStorage.getItem('refresh_token')! })
            console.log('refreshData', refreshData)
            if (refreshError?.code === "refresh_token_already_used" || refreshError?.code === "refresh_token_not_found") {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                return redirect('/login')
            }
            else if (refreshData.session) {
                localStorage.setItem('access_token', refreshData.session.access_token)
                localStorage.setItem('refresh_token', refreshData.session.refresh_token)
                await supabase
                    .from('users')
                    .update({ token: refreshData.session.access_token })
                    .eq('email', refreshData.user?.email)
            }
        }
    } else return redirect('/login')
}

export default AppLayout;