import * as React from "react";
import ContactItem from "@/components/ContactItem";
import Link from "next/link";

interface ContactsProps {
  currentUserId: string;
}

export default function Contacts(params: ContactsProps) {
  return (
    <>
      <div className={"bg-cyan-500 text-white p-2 rounded-xl cursor-pointer"}>
        <Link href="/chat">联系人</Link>
      </div>
      <div className={"flex flex-col gap-2"}>
        <ContactItem friendId={"1"} />
        <ContactItem friendId={"2"} />
        <ContactItem friendId={"3"} />
        <ContactItem friendId={"4"} />
      </div>
    </>
  );
}
