export type ChatType = 0 | 1;
export type MessageType = 0 | 1;
export default class Chat {
  /**
   * 文本消息
   */
  public static readonly TEXT_MESSAGE: MessageType = 0;
  /**
   * 图片消息
   */
  public static readonly IMAGE_MESSAGE: MessageType = 1;
  /**
   * 一对一聊天
   */
  public static readonly CHAT_TYPE_1_TO_1: ChatType = 0;
  /**
   * 群聊
   */
  public static readonly CHAT_TYPE_GROUP: ChatType = 1;

  public static readonly HORIZON_LINE: string = "-";
}
