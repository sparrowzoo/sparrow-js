import { useEffect, useState } from "react";
import CrosStorage from "@/common/lib/CrosStorage";

export default function useCrosStorage() {
  const [crosStorage, setCrosStorage] = useState<CrosStorage>();
  useEffect(() => {
    const storage = CrosStorage.getCrosStorage();
    setCrosStorage(storage);
    return () => {
      storage.destroy();
    };
  }, []);
  return crosStorage;
}
