export default interface ItemProps {
  id: string;
  name: string;
  description: string;
  unread: number;
  unreadPosition: Position;
  link: string;
  avatar: string;
  nationality: string;
}

export enum Position {
  header,
  tail,
}
