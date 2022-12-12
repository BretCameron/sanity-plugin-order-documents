import { useEffect } from "react";

export function useOnClickOutside(refs, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!refs.map((ref) => ref?.current.contains(event.target)).some(Boolean)) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, handler]);
}
