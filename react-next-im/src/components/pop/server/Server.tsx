"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupedSessions } from "@/lib/im/SessionContainer";
import Sessions from "@/components/pop/Sessions";

export interface ServerProps {
  groupedSessions: GroupedSessions;
}

export default function Server(serverProps: ServerProps) {
  const { clientSessions, agentSessions, visitorSessions } =
    serverProps.groupedSessions;
  return (
    <Tabs defaultValue="account" className="w-[300px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="visitor">游客</TabsTrigger>
        <TabsTrigger value="agent">中介</TabsTrigger>
        <TabsTrigger value="client">客户</TabsTrigger>
      </TabsList>
      <TabsContent value="visitor">
        <Sessions sessions={visitorSessions} />
      </TabsContent>
      <TabsContent value="agent">
        <Sessions sessions={agentSessions} />
      </TabsContent>
      <TabsContent value="client">
        <Sessions sessions={clientSessions} />
      </TabsContent>
    </Tabs>
  );
}
