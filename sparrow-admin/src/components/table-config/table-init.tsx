import React, {useState} from "react";
import {MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {TableConfig} from "@/components/table-config/columns";
import {Label} from "@/components/ui/label";
import KeyValue from "@/common/lib/protocol/KeyValue";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import CoderApi from "@/api/manual/coder";
import {useTranslations} from "next-intl";
import useNavigating from "@/common/hook/NavigatingHook";
import {DialogTitle} from "@/components/ui/dialog";

export default function TableInit({table}: TableOperationProps<TableConfig>) {
    const meta = table.options.meta as MyTableMeta<TableConfig>;
    const initHandler = meta?.initHandler;
    const parent = meta?.parent as KeyValue;
    const [localFullClassName, setLocalFullClassName] = useState("");
    const errorTranslate = useTranslations("ErrorMessage")
    const Navigations = useNavigating();

    return <div className="admin-init min-w-0 space-y-5">
        <DialogTitle className="pr-8 text-base">项目：{parent.value}</DialogTitle>
        <div className="min-w-0 space-y-4">
            <div className="min-w-0 space-y-2">
                <Label
                    className="block text-sm font-medium text-muted-foreground">全限定类名</Label>
                <div className="min-w-0">
                    <Input value={localFullClassName} onChange={(e) => setLocalFullClassName(e.target.value)}
                           className="w-full min-w-0"
                           onKeyDown={(e) => {
                               e.stopPropagation();
                           }
                           }
                           name={"fullClassName"}
                           type={"text"}
                    />
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <Button onClick={() => {
                    CoderApi.initByLocal(parent.key, localFullClassName, errorTranslate, Navigations.redirectToLogin)
                        .then(() => {
                            initHandler?.();
                        }).catch(() => {
                    });
                }}>生成</Button>
            </div>
        </div>
    </div>
}
