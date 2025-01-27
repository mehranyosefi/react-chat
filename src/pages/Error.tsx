import { useRouteError } from "react-router";

function Error() {
    // const navigate = useNavigate();
    const error = useRouteError();
    return (
        <div className="flex items-center justify-center h-full">
            <div className="p-10 bg-gray-900/80 rounded-xl">
                <h1 className="text-3xl">Something went wrong</h1>
                <p className="mt-3">{error.data || error.message}</p>
                {/* <button className="mx-auto block mt-3 bg-gray-800 py-2 px-6 rounded-xl cursor-pointer hover:bg-gray-900" onClick={() => navigate(-1)}>بازگشت</button> */}
            </div>
        </div>
    );
}

export default Error;