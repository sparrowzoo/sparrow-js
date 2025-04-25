import { ThreeDots } from "react-loader-spinner";
import { useEffect, useState } from "react";

export default function ThreeDotLoading() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (window) {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <></>;
  }
  return (
    <ThreeDots
      visible={true}
      height="80"
      width="80"
      color="grey"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}
