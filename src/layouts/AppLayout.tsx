import DetailInfo from "@/components/detailInfo/DetailInfo";
import { Outlet, redirect, useLoaderData, useNavigation, useParams } from "react-router";
import MainSideBar from "../components/mainSideBar/mainSideBar";
// import type { RootState } from "../store";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../features/user/userSlice";
import { getAccessToken } from "../utility/auth/tokenStorage";
import { getMe } from "../services/user/user.api";
import { useEffect } from "react";
import { pushTab, setIntitailTab } from "../features/tab/tabSlice";
import { useMediaQuery } from "../features/media/useMediaQuery";

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const dispatch = useDispatch();
  const data = useLoaderData();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { contactId } = useParams();
  const isChatOpen = Boolean(contactId);

  useEffect(() => {
    if (data) {
      dispatch(
        setUserInfo({
          id: data.id,
          email: data.email,
          session: {
            access_token: localStorage.getItem("access_token"),
            refresh_token: localStorage.getItem("refresh_token"),
          },
        })
      );
    }
  }, [data, dispatch]);
  
  useEffect(() => {
    if (!isDesktop && contactId) {
      dispatch(pushTab("chatroom"));
    } else if (!isDesktop && !contactId) {
      dispatch(setIntitailTab("conversations"));
    }
  }, [contactId, isDesktop, dispatch]);

  // useEffect(()=> {
  //   const targetTab = userId ? 'contacts': 'conversations'
  //   dispatch(setIntitailTab(targetTab))
  // }, [userId, dispatch])

  return (
    <div className="app w-screen h-screen overflow-hidden backdrop-blur-sm bg-black/50">
      <div className="mx-auto max-w-[2150px] h-screen p-0 md:p-8">
        <div className="flex h-full md:h-[calc(100vh-64px)]">
          <div
            className={`w-full md:w-96 h-full md:rounded-3xl p-5 bg-gray-800 flex-col ${
              isChatOpen ? "hidden md:flex" : "flex"
            }`}
          >
            <MainSideBar />
          </div>
          <div className={`w-full h-full grow-[3] ${isChatOpen ? "flex" : "hidden md:flex"}`}>
            <div className="grow h-full flex flex-col">
              <Outlet />
            </div>

            <div className="w-96 hidden lg:flex">
              <DetailInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export async function loader() {
  const access_token = getAccessToken();
  if (access_token) {
    const res = await getMe();
    if (res.status === "success") {
      return res.data?.user;
    }
    return null;
  } else {
    return redirect("/login");
  }
}

export default AppLayout;
