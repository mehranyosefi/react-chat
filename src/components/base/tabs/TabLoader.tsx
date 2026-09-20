import { Suspense } from "react";
import { TabLoaderProps } from "./tabs.type";
import Loader from "../Loader";

function TabLoader({component:Component , props}:TabLoaderProps){
    return(
        <Suspense fallback = {<Loader />}>
            <Component {...(props??{})}/>
        </Suspense>
    )
}
export default TabLoader