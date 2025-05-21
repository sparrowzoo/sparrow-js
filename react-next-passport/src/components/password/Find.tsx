import { SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import * as React from "react";
import PasswordApi from "@/api/password";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function FindPassword() {
  const t = useTranslations("Passport.find-password");
  const [email, setEmail] = React.useState("");
  const [sending, setSending] = React.useState(false);

  function findPasswordHandler(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!email) {
      toast.error(t("input-email-to-find-password"));
      return;
    }
    setSending(true);
    PasswordApi.findPassword(email, t)
      .then(() => {
        toast.success(t("password-reset-email-sent"));
      })
      .finally(() => setSending(false));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Link href="#" className="ml-auto inline-block text-sm underline">
          {t("forgot-password")}
        </Link>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("find-password")}</DialogTitle>
          <DialogDescription>
            {t("input-email-to-find-password")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <Button
            onClick={findPasswordHandler}
            type="button"
            size="sm"
            className="px-3"
          >
            <span className="sr-only">{t("send-find-password-email")}</span>
            {sending ? <ThreeDotLoading /> : <SendIcon />}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t("close")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
