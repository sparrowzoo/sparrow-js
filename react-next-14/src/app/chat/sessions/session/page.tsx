// https://nextjs.org/docs/app/api-reference/functions/use-search-params
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ChatItem from "@/components/ChatItem";

function Session() {
  const searchParams = useSearchParams();
  const sessionKey = searchParams?.get("sessionKey");
  return <div className={"flex flex-col w-full h-full"}>
    <div>
      <h2>Welcome to: {sessionKey}</h2>
    </div>
    <div className={"overflow-y-scroll h-[25rem] p-4 border-2 border-red-700"}>
      <ChatItem img={undefined} align={"left"} message={"Hello, how are you?"} sender={"user1"} timestamp={"12:00"} />
      <ChatItem img={undefined} align={"right"} message={"Hello, how are you?"} sender={"user2"} timestamp={"12:00"} />
      <ChatItem img={undefined} align={"left"} message={"Hello, how are you?"} sender={"user1"} timestamp={"12:00"} />
      <ChatItem img={undefined} align={"right"} message={"Hello, how are you?"} sender={"user1"} timestamp={"12:00"} />

      <ChatItem img={"/columns/1.jpg"}  align={"right"} message={"Hello, how are you?"} sender={"user1"} timestamp={"12:00"} />
      <ChatItem img={"/columns/1.jpg"}  align={"right"} message={"Hello, how are you?"} sender={"user1"} timestamp={"12:00"} />
      <ChatItem img={"/columns/1.jpg"}  align={"right"} message={"Hello, how are you?"} sender={"user1"} timestamp={"12:00"} />

    </div>
    <textarea className={"w-full flex-1"}></textarea>
  </div>;
}

//https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export default function SessionPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <Session />
    </Suspense>
  );
}
