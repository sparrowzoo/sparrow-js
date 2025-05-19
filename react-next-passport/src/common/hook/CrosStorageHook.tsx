import { useEffect, useState } from "react";
import CrosStorage from "@/common/lib/CrosStorage";

export default function useCrosStorage() {
  let [crosStorage, setCrosStorage] = useState<CrosStorage>();
  useEffect(() => {
    setCrosStorage(CrosStorage.getCrosStorage());
    return () => {
      crosStorage?.destroy();
    };
  }, []);
  return crosStorage;
}
