import DetailInfo from "@/components/detailInfo/DetailInfo";
import { Outlet, useLoaderData, useNavigate, useNavigation } from "react-router";
import LeftSideBar from "../components/leftSideBar/LeftSideBar";
// import type { RootState } from "../store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { supabase } from "../services/supbase";

function AppLayout() {
    const navigate = useNavigate();
    const navigation = useNavigation()
    const isLoading = navigation.state === "loading"
    useEffect(onLoad)
    const dispatch = useDispatch();
    const data = useLoaderData();
    if (data.user) {
        dispatch(setUser({
            email: data.user.email
        }))
    }

    function onLoad() {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login')
            return
        }
    }

    return (
        <div className="app w-screen h-screen overflow-hidden backdrop-blur-sm bg-black/50">
            <div className="2xl:container mx-auto">
                {isLoading && <span>...loading</span>}
                <div className="flex h-screen">
                    <div className="w-96 h-full border-r border-gray-500">
                        <LeftSideBar />
                    </div>
                    <div className="hidden lg:flex grow-[3]">
                        <div className="grow">
                            <Outlet />
                        </div>
                        <div className="w-96 border-l border-gray-500">
                            <DetailInfo></DetailInfo>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export async function loader() {
    const { data, error } = await supabase.auth.getUser()
    console.log(error)
    if (!error) return data
    throw Error(error.message)
}
// export async function action() {


// }

export default AppLayout;