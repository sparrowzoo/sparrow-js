import React, {useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {TableConfig} from "@/components/table-config/columns";
import {Label} from "@/components/ui/label";
import KeyValue from "@/common/lib/protocol/KeyValue";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import CoderApi from "@/api/manual/coder";
import {useTranslations} from "next-intl";
import {DialogTitle} from "@/components/ui/dialog";

export default function TableInit({table}: TableOperationProps<TableConfig>) {
    const meta = table.options.meta as MyTableMeta<TableConfig>;
    const initHandler = meta?.initHandler;
    const parent = meta?.parent as KeyValue;
    const [localFullClassName, setLocalFullClassName] = useState("");
    const [jpaFullClassName, setJpaFullClassName] = useState("");
    const [sourceCode, setSourceCode] = useState("");
    const errorTranslate = useTranslations("ErrorMessage")
    debugger;
    return <>
        <DialogTitle> 项目：{parent.value}
        </DialogTitle>
        <Tabs defaultValue="local" className="w-fit">
            <TabsList>
                <TabsTrigger value="class">本地类</TabsTrigger>
                <TabsTrigger value="jpa">JPA类</TabsTrigger>
            </TabsList>
            <TabsContent value="class">
                <div className="flex flex-row justify-start items-center mb-4 gap-2">
                    <Label
                        className={"justify-end w-[8rem]"}>全限定类名</Label>
                    <div className={"flex-1"}>
                        <Input value={localFullClassName} onChange={(e) => setLocalFullClassName(e.target.value)}
                               onKeyDown={(e) => {
                                   e.stopPropagation();
                               }
                               }
                               name={"fullClassName"}
                               type={"text"}
                        />
                    </div>
                </div>
                <Button onClick={() => {
                    debugger;
                    CoderApi.initByLocal(parent.key, localFullClassName, errorTranslate)
                        .then((result) => {
                            initHandler && initHandler();
                        }).catch(() => {
                    });
                }}>生成</Button>
            </TabsContent>
            <TabsContent value="jpa">
                <div className="flex flex-row justify-start items-center mb-4 gap-2">
                    <Label
                        className={"justify-end w-[8rem]"}>全限定类名</Label>
                    <div className={"flex-1"}>
                        <Input value={jpaFullClassName} onChange={(e) => setJpaFullClassName(e.target.value)}
                               onKeyDown={(e) => {
                                   e.stopPropagation();
                               }
                               }
                               name={"jpaFullClassName"}
                               type={"text"}
                        />
                    </div>
                </div>

                <div className="flex flex-row justify-start items-center mb-4 gap-2">
                    <Label
                        className={"justify-end w-[8rem]"}>源代码</Label>
                    <div className={"flex-1"}>
                        <Textarea value={sourceCode} onChange={(e) => setSourceCode(e.target.value)}
                                  onKeyDown={(e) => {
                                      e.stopPropagation();
                                  }
                                  }
                                  name={"fullClassName"}
                        />
                    </div>
                </div>
                <Button onClick={() => {
                    CoderApi.initByJpa(parent.key, jpaFullClassName, sourceCode, errorTranslate)
                        .then((result) => {
                            initHandler && initHandler();
                        }).catch(() => {
                    });
                }}>生成</Button>
            </TabsContent>
        </Tabs>
    </>
}
