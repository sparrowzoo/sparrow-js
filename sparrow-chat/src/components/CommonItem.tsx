import MyAvatar from "@/components/MyAvatar";
import * as React from "react";
import ItemProps from "@/lib/protocol/ItemProps";
import { cn } from "@/lib/utils";
import { Link } from "@/common/i18n/navigation";

export default function CommonItem(itemProps: ItemProps) {
  return (
    <Link className={cn("im-contact-link block w-fit h-fit p-0")} href={itemProps.link}>
      <div className="im-contact-content flex flex-row h-10">
        <MyAvatar
          unread={0}
          showUnread={false}
          fallback={itemProps.name as string}
          src={itemProps.avatar}
        />
        <div className={"im-contact-copy flex flex-1 flex-col justify-center items-start ml-2"}>
          <span className={"im-contact-name text-xs"}>
            {itemProps.name}-{itemProps.id}
            {itemProps.nationality && <>【{itemProps.nationality}】</>}
          </span>
          <span
            title={itemProps.description}
            className={"im-contact-description text-gray-400 text-xs truncate  w-[10rem]"}
          >
            {itemProps.description}
          </span>
        </div>
      </div>
    </Link>
  );
}
