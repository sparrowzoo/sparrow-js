import Message from "@/lib/protocol/Message";
import Contact from "@/lib/protocol/contact/Contact";
import Group from "@/lib/protocol/contact/Group";

export default class HistoryMessageWrap {
  public historyMessages: Message[] = [];
  public qunMaps: Map<String, Group> = new Map();
  public userMap: Map<string, Contact> = new Map();
}
