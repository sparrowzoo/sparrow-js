import Link from "next/link";
import * as React from "react";
import { NEXT_ASSET_PREFIX } from "@/lib/EnvUtils";
import { DynamicImage } from "@/components/img/DynamicImage";

interface ContactProps {
  friendId: string;
}

export default function ContactItem(contactProps: ContactProps) {
  const headSrc = `${NEXT_ASSET_PREFIX}/avatar/${contactProps.friendId}.jpg`;
  const contactUrl = `${NEXT_ASSET_PREFIX}/chat/friends/contact?friendId=${contactProps.friendId}`;
  return (
    <div className="flex items-center text-left">
      <Link href={contactUrl}>
        <DynamicImage
          src={headSrc}
          alt={"header"}
          width={50}
          height={50}
          className={"w-16 h-16 rounded-full mr-4"}
        />
      </Link>
      <div>
        <Link href={contactUrl}>
          <strong>Andrew Alfred</strong>
          <br />
          <span>Technical advisor</span>
        </Link>
      </div>
    </div>
  );
}
