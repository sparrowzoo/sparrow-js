import Contact from "@/lib/protocol/contact/Contact";
import Group from "@/lib/protocol/contact/Group";

export default class ContactGroup {
    private _contacts: Contact[];
    private _quns: Group[];


    get contacts(): Contact[] {
        return this._contacts;
    }

    set contacts(value: Contact[]) {
        this._contacts = value;
    }

    get quns(): Group[] {
        return this._quns;
    }

    set quns(value: Group[]) {
        this._quns = value;
    }
}