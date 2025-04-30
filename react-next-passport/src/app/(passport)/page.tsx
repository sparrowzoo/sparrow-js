import { useEffect } from "react";
import {redirectToIndex, redirectToLogin} from "@/common/lib/Navigating";

export default function Page() {
  useEffect(() => {
    redirectToIndex();
  }, []);
  return <></>;
}
