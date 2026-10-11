import { format } from "util";
import { AVATAR_URL } from "@/common/lib/Env";

export function resolveAvatar(avatar: string | undefined, userId: string | number): string {
    if (avatar) {
        return avatar;
    }
    return format(AVATAR_URL, Number(userId) % 10);
}
