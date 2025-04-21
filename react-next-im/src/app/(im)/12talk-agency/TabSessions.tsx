"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupedSessions } from "@/lib/im/SessionContainer";
import Sessions from "@/components/session/Sessions";

export interface ServerProps {
  groupedSessions: GroupedSessions;
}

export default function TabSessions(serverProps: ServerProps) {
  const { clientSessions, agentSessions, visitorSessions } =
    serverProps.groupedSessions;
  return (
    <Tabs defaultValue="account" className="w-[300px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="visitor">游客</TabsTrigger>
        <TabsTrigger value="client">客户</TabsTrigger>
      </TabsList>
      <TabsContent value="visitor">
        <Sessions triggerType={"POP"} sessions={visitorSessions} />
      </TabsContent>
      <TabsContent value="client">
        <Sessions triggerType={"POP"} sessions={clientSessions} />
      </TabsContent>
    </Tabs>
  );
}
