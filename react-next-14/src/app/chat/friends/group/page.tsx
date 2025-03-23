"use client";
import * as React from "react";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ContactItem from "@/components/ContactItem";
import { NEXT_ASSET_PREFIX } from "@/lib/EnvUtils";
import { DynamicImage } from "@/components/img/DynamicImage";

function Group() {
  const searchParams = useSearchParams();
  const groupId = searchParams?.get("groupId");
  useEffect(() => {
    console.log("groupId", groupId);
  }, [groupId]);

  const headSrc = `${NEXT_ASSET_PREFIX}/avatar/${groupId}.jpg`;
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return (
    <div className={"flex flex-col p-4 bg-white shadow-md"}>
      <div className="flex flex-row items-center text-left">
        <DynamicImage
          className={"w-16 h-16 rounded-full mr-4"}
          src={headSrc}
          alt={"Contact Avatar"}
          width={50}
          height={50}
        />
        <div>
          <strong>Andrew Alfred {groupId}</strong>
          <br />
          <span>Technical advisor</span>
        </div>
      </div>
      <p className={"mt-2 text-gray-500 text-left"}>
        中国共产党的优秀党员,忠诚的共产主义战士,享誉海内外的杰出科学家和我国航天事业的奠基人,中国科学院、中国工程院资深院士,中国人民政治协商会议第六
      </p>
      <div className={"flex flex-col gap-2"}>
        <h2>Group members</h2>
        <ContactItem friendId={"6"} />
        <ContactItem friendId={"7"} />
        <ContactItem friendId={"8"} />
        <ContactItem friendId={"9"} />
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <Group />
    </Suspense>
  );
}
