import { useEffect, MutableRefObject } from "react";

export function useOutsideClick(
  ref: MutableRefObject<null | Element>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
// export default function OutsideAlerter(props) {
//   const wrapperRef:5 = useRef(null);
//   useOutsideAlerter(wrapperRef);

//   return <div ref={wrapperRef}>{props.children}</div>;
// }
