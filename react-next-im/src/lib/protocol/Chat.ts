export enum ChatType {
  CHAT_1_TO_1 = 0,
  GROUP = 1,
}

export enum MessageType {
  TEXT_MESSAGE = 0,
  IMAGE_MESSAGE = 1,
}

export default class Chat {
  public static readonly HORIZON_LINE: string = "-";
}
