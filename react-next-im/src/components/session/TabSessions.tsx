"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupedSession } from "@/lib/im/SessionContainer";
import Sessions from "@/components/session/Sessions";
import { useTranslations } from "next-intl";

export interface ServerProps {
  groupedSessions: Map<number, GroupedSession>;
}

export default function TabSessions(serverProps: ServerProps) {
  const { groupedSessions } = serverProps;
  const t = useTranslations("ClientServer");

  return (
    <Tabs
      defaultValue="account"
      className="w-[300px] h-[500px] overflow-y-scroll"
    >
      <TabsList className="grid w-full grid-cols-3">
        {Array.from(groupedSessions).map(([category, groupedSession]) => (
          <TabsTrigger key={category} value={groupedSession.name}>
            {t(groupedSession.name.toLowerCase())}
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
