import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  src: string;
  fallback: string;
  url?: string;
}

export default function MyAvatar(props: Props) {
  return (
    <Avatar>
      <AvatarImage src={props.src} />
      <AvatarFallback>{props.fallback}</AvatarFallback>
    </Avatar>
  );
}
