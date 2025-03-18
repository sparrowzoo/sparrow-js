import ChatLayout from "@/components/ChatLayout";
import { Toaster } from "react-hot-toast";
import Login from "@/components/Login";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-center" reverseOrder={true} />
      <div
        className={
          "flex text-center justify-center items-center w-full h-20 bg-indigo-500 text-white"
        }
      >
        <h1>Welcome to Sparrow Chat!</h1>
        <Login />
      </div>
      <div className="flex flex-row flex-1 w-full">
        <ChatLayout>{children}</ChatLayout>
      </div>
    </div>
  );
}
