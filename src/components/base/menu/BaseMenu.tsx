import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BaseButton from "../BaseButton";

export type BaseMenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

type BaseMenuProps = {
  items: BaseMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
  backdrop?: boolean;
};

const GAP = 8;

// والد منو (مثلاً حباب پیام) باید relative باشد
function BaseMenu({ items, onClose, position, backdrop = true }: BaseMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);

  //with the real menu size into the viewport
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const { offsetWidth: w, offsetHeight: h } = menu;

    const left = Math.min(Math.max(position.x, GAP), window.innerWidth - w - GAP);
    const top = Math.min(Math.max(position.y, GAP), window.innerHeight - h - GAP);
    setCoords({ left, top });
  }, [position.x, position.y]);

  //اسکرول
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  //scroll lock
  useLayoutEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-40 ${backdrop ? " bg-black/20 animate-in fade-in duration-150" : "bg-transparent"}`}
       aria-hidden="true"
        onClick={onClose}
        onContextMenu={(e)=>{
          e.preventDefault();
          onClose();
        }}
        onWheel={(e)=>e.preventDefault()}
        onTouchMove={(e)=>e.preventDefault()}
      ></div>

      <div
        ref={menuRef}
        style={{
          left:coords?.left??0,
          top:coords?.top??0,
          visibility:coords?"visible" : "hidden"
        }}
        className=" fixed z-50 w-40 h-auto bg-gray-800 text-white rounded-xl p-1 flex flex-col gap-1"
      >
        {items.map((item) => (
          <BaseButton
            key={item.label}
            className={`w-full text-left hover:bg-gray-700 ${item.danger ? "text-red-400" : ""}`}
            variant="none"
            rounded="rounded-lg"
            paddingX="px-3"
            paddingY="py-2"
            emitOnClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.label}
          </BaseButton>
        ))}
      </div>
    </>,
    document.getElementById("portals")!
  );
}

export default BaseMenu;
