import Contact from "@/lib/protocol/contact/Contact";
import Group from "@/lib/protocol/contact/Group";

export default class ContactGroup {
  public contacts: Contact[];
  public quns: Group[];
  public userMap: Map<string, Contact>;
}
