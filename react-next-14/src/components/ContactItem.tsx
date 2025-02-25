import Link from "next/link";
import * as React from "react";

interface ContactProps {
  friendId: string;
}

export default function ContactItem(contactProps: ContactProps) {
  const headSrc = `/columns/${contactProps.friendId}.jpg`;
  const contactUrl = `/chat/friends/contact?friendId=${contactProps.friendId}`;
  return <div className="flex items-center text-left">
    <Link href={contactUrl}>
      <img className={"w-16 h-16 rounded-full mr-4"} src={headSrc} /></Link>
    <div>
      <Link href={contactUrl}>
        <strong>Andrew Alfred</strong><br/>
        <span>Technical advisor</span>
      </Link>
    </div>
  </div>;
}
