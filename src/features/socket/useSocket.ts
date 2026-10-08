import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useCallback, useEffect } from "react";

const useAppDispatch = ()=> useDispatch<AppDispatch>()
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useSocket(enable: boolean = true) {
    const dispatch = useAppDispatch()
    // useAppSelector((state) => state.socket)

    useEffect(()=>{
        if(!enable) return
    })
    //  const refresh = useCallback(
    //     (force: boolean = false) => {
    //       return dispatch(getContactsThunk({ force }));
    //     },
    //     [dispatch],
    //   );

}