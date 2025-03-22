import { useWindowSize } from "./useWindowSize";

export const useColumnCount = () => {
  const { width } = useWindowSize();

  if (typeof width !== "number") return 3;
  if (width < 640) return 2;
  if (width < 1024) return 3;
  return 4;
};
