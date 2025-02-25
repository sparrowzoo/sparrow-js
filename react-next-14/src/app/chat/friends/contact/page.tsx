"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import * as React from "react";

function Contact() {
  const searchParams = useSearchParams();
  const friendId = searchParams?.get("friendId");

  const headSrc = `/columns/${friendId}.jpg`;
  const contactUrl = `/chat/sessions/session?sessionKey=${friendId}`;
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <div className={"flex flex-col p-4 bg-white shadow-md"}><div className="flex flex-row items-center text-left">
    <Link href={contactUrl}>
      <img className={"w-16 h-16 rounded-full mr-4"} src={headSrc} /></Link>
    <div>
      <Link href={contactUrl}>
        <strong>Andrew Alfred {friendId}</strong><br/>
        <span>Technical advisor</span>
      </Link>
    </div>
  </div>
  <p className={"mt-2 text-gray-500 text-left"}>
    中国共产党的优秀党员,忠诚的共产主义战士,享誉海内外的杰出科学家和我国航天事业的奠基人,中国科学院、中国工程院资深院士,中国人民政治协商会议第六
  </p>

  </div>;
}

export default function ContactPage() {
  return<Suspense>
    <Contact />
  </Suspense>;
}
