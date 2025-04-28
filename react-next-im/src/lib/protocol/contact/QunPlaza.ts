import { Category } from "@/lib/protocol/contact/Category";
import Group from "@/lib/protocol/contact/Group";

export default class QunPlaza {
  public categoryDicts: Map<number, Category>;
  public qunMap: Map<number, Group[]>;
}
