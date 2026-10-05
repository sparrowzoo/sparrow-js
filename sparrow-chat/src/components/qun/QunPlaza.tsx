import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import Group from "@/lib/protocol/contact/Group";
import React, { useEffect, useState } from "react";
import QunApi from "@/api/QunApi";
import QunPlaza from "@/lib/protocol/contact/QunPlaza";
import { Category } from "@/lib/protocol/contact/Category";
import QunList from "@/components/qun/QunList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface QunPlazaComProps {
  link?: boolean;
}

export default function QunPlazaCom(qunPlazaComProps: QunPlazaComProps) {
  const t = useTranslations("Contact.Audit");
  const [qunPlaza, setQunPlaza] = useState<QunPlaza>();
  useEffect(() => {
    QunApi.getQunList(t).then((qunPlaza) => {
      setQunPlaza(qunPlaza);
    });
  }, []);
  if (!qunPlaza) {
    return <ThreeDotLoading />;
  }

  const quns: Map<number, Group[]> = qunPlaza.qunMap;
  const categories: Map<number, Category> = qunPlaza.categoryDicts;
  return (
    <div className={"im-group-plaza w-full h-fit flex flex-row gap-4 p-4"}>
      {Array.from(categories).map(([categoryId, category]) => (
        <Card key={categoryId} className="im-group-card w-[400px]">
          <CardHeader className="im-group-card-header">
            <CardTitle className="im-group-card-title">{category.categoryName}</CardTitle>
            <CardDescription className="im-group-card-description">{category.description}</CardDescription>
          </CardHeader>
          <CardContent className="im-group-card-content">
            <QunList
              link={qunPlazaComProps.link}
              quns={quns.get(categoryId) || []}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
