import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  src: string;
  fallback: string;
  url?: string;
}

export default function MyAvatar(props: Props) {
  return (
    <Avatar className={" w-8 h-8 rounded-full mr-4"}>
      <AvatarImage src={props.src} />
      <AvatarFallback>{props.fallback}</AvatarFallback>
    </Avatar>
  );
}
