import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Props {
  src: string;
  fallback: string;
  url?: string;
  unread: number;
  showUnread?: boolean;
}

export default function MyAvatar(props: Props) {
  return (
    <>
      {props.unread > 0 && props.showUnread && (
        <Badge
          className={
            "im-avatar-badge absolute bg-red-500 p-1  text-white z-50 font-bold top-[-6px] left-[36px] rounded-full"
          }
        >
          {props.unread > 99 ? "99+" : props.unread}
        </Badge>
      )}
      <Avatar className={"im-avatar w-10 h-10 rounded-full"}>
        <AvatarImage className="im-avatar-image" src={props.src} />
        <AvatarFallback className={"im-avatar-fallback text-sm"}>{props.fallback}</AvatarFallback>
      </Avatar>
    </>
  );
}
