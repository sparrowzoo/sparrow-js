import { useEffect, useState } from "react";
import CrosStorage from "@/common/lib/CrosStorage";

export default function useCrosStorage() {
  const [crosStorage, setCrosStorage] = useState<CrosStorage>();
  useEffect(() => {
    setCrosStorage(CrosStorage.getCrosStorage());
    return () => {
      crosStorage?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return crosStorage;
}
