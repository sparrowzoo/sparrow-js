import GroupItem from "@/components/GroupItem";
import * as React from "react";
import Group from "@/lib/protocol/contact/Group";
import LoadingSpinner from "@/common/components/LoadingSpinner";

interface GroupsProps {
  quns: Group[] | undefined;
}

export default function Groups(groupProps: GroupsProps) {
  if (!groupProps.quns) {
    return <LoadingSpinner />;
  }
  if (groupProps.quns.length === 0) {
    return <div className={"text-center text-gray-500"}>暂无群组</div>;
  }
  return (
    <div className={"flex flex-col gap-2"}>
      {groupProps?.quns?.map((qun) => (
        <GroupItem qun={qun} key={qun.qunId + ""} />
      ))}
    </div>
  );
}
