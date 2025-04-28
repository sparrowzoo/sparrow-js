import Group from "@/lib/protocol/contact/Group";
import GroupItem from "@/components/contact/GroupItem";
import { Button } from "@/components/ui/button";
import QunAPI from "@/api/QunApi";

interface QunListProps {
  quns: Group[];
}

export default function QunList(qunListProps: QunListProps) {
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
          <GroupItem qun={qun} />
          <div>
            <Button
              className={"cursor-pointer"}
              onClick={() => handleClick(qun)}
              variant="outline"
            >
              申请加入
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
