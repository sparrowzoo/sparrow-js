import { ThreeDots } from "react-loader-spinner";

export default function ThreeDotLoading() {
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
