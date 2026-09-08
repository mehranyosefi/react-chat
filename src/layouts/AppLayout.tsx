import DetailInfo from "../components/detailInfo/DetailInfo";
import { Outlet, useNavigate,} from "react-router";
import LeftSideBar from "../components/leftSideBar/LeftSideBar";
// import type { RootState } from "../store";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../features/user/userSlice";
import { useFetch } from "../features/hooks/useFetch";
import { useEffect } from "react";

function AppLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const accessToken = localStorage.getItem("access_token");
    const {data , loading , error} = useFetch("/me", undefined , !!accessToken, true);

    useEffect(() => {
        if(!accessToken){
            navigate("/login" , {replace : true})
        }
    }, [accessToken , navigate]);

   useEffect(() => {
    if(data?.data?.user){
        dispatch(setUserInfo({
            email: data.data.user.email,
            session: {
                access_token: localStorage.getItem('access_token'),
                refresh_token: localStorage.getItem('refresh_token')
            }
        }))
    }
   },[data , dispatch])
   
   useEffect(() => {
    if(error && "status" in error && (error.status === 401 || error.status === 403)){
        navigate("/login" , {replace : true});
    }
   }, [error, navigate]);
    

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


export default AppLayout;