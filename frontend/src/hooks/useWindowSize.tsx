import { useState, useEffect } from "react";

// https://stackoverflow.com/questions/75059741/tanstack-react-table-column-hidden-on-mobile-screeen
function getBreakPoint(windowWidth: any) {
  if (windowWidth) {
    if (windowWidth < 640) {
      return "sm";
    } else if (windowWidth < 768) {
      return "md";
    } else if (windowWidth < 1024) {
      return "lg";
    } else if (windowWidth < 1280) {
      return "xl";
    } else {
      return "2xl";
    }
  } else {
    return undefined;
  }
}

export default function useWindowSize() {
  const isWindowClient =
    typeof window === "object" && typeof window !== "undefined";
  const [windowSize, setWindowSize] = useState(
    isWindowClient ? getBreakPoint(window.innerWidth) : undefined
  );
  useEffect(() => {
    function setSize() {
      setWindowSize(getBreakPoint(window.innerWidth));
    }
    if (isWindowClient) {
      window.addEventListener("resize", setSize);
      return () => window.removeEventListener("resize", setSize);
    }
  }, [isWindowClient, setWindowSize]);
  return windowSize;
}
