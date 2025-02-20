import Link from "next/link";
import * as React from "react";

export default function Contacts() {
  return (
    <div className="relative">
      <div className="fixed top-0 right-0 left-0">联系人</div>
      <div>
        <div>
          <img width={"50"} height={"50"} src="/columns/1.jpg" />
          <strong><Link href="/chat/friends/session">Andrew Alfred</Link></strong>
        </div>
        <div>
          <img width={"50"} height={"50"} src="/columns/2.jpg" />
          <strong><Link href="/chat/friends/session">Debra Houston</Link></strong>
        </div>
        <div>
          <img width={"50"} height={"50"} src="/columns/3.jpg" />
          <strong><Link href="/chat/friends/session">Debra Houston</Link></strong>
        </div>
      </div>
    </div>
  );
}
