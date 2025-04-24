"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupedSession } from "@/lib/im/SessionContainer";
import Sessions from "@/components/session/Sessions";

export interface ServerProps {
  groupedSessions: Map<number, GroupedSession>;
}

export default function TabSessions(serverProps: ServerProps) {
  const { groupedSessions } = serverProps;

  return (
    <Tabs
      defaultValue="account"
      className="w-[300px] h-[600px] overflow-y-scroll"
    >
      <TabsList className="grid w-full grid-cols-3">
        {Array.from(groupedSessions).map(([category, groupedSession]) => (
          <TabsTrigger key={category} value={groupedSession.name}>
            {groupedSession.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {Array.from(groupedSessions).map(([category, groupedSession]) => (
        <TabsContent key={category} value={groupedSession.name}>
          <Sessions triggerType={"POP"} sessions={groupedSession.sessions} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
