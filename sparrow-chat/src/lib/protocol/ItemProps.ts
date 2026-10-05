export default interface ItemProps {
  id: string;
  name: string;
  description: string;
  link: any;
  avatar: string;
  nationality: string;
}

export enum Position {
  HEADER,
  TAIL,
}
