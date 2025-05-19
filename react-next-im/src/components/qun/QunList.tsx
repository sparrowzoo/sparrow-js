import Group from "@/lib/protocol/contact/Group";
import GroupItem from "@/components/contact/GroupItem";
import { Button } from "@/components/ui/button";
import QunAPI from "@/api/QunApi";
import { useTranslations } from "next-intl";

interface QunListProps {
  quns: Group[];
  link?: boolean;
}

export default function QunList(qunListProps: QunListProps) {
  const t = useTranslations("ButtonText");

  function handleClick(qun: Group) {
    QunAPI.joinQun(qun.qunId);
  }

  return (
    <div className={"flex flex-col gap-4"}>
      {qunListProps.quns.map((qun) => (
        <div
          key={qun.qunId}
          className={"flex flex-row gap-4 justify-between items-center"}
        >
          <GroupItem link={qunListProps.link} qun={qun} />
          <div>
            <Button
              className={"cursor-pointer"}
              onClick={() => handleClick(qun)}
              variant="outline"
            >
              {t("apply-join-group")}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
