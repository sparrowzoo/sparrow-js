import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import EditPage from "@/components/table-config/edit";
import ColumnEditor from "@/components/table-config/coder/column-editor";
import {CellContextProps} from "@/common/lib/table/DataTableProperty";

export default function TableEdit({cellContext}: CellContextProps<any>) {
    return <Tabs defaultValue="basic" className="w-fit h-fit p-4">
        <TabsList>
            <TabsTrigger value="basic">基础信息</TabsTrigger>
            <TabsTrigger value="columns">列配置</TabsTrigger>
        </TabsList>
        <TabsContent className="h-fit" value="basic">
            <EditPage cellContext={cellContext}/>
        </TabsContent>
        <TabsContent className={"h-fit"} value="columns">
            <ColumnEditor cellContext={cellContext}/>
        </TabsContent>
    </Tabs>
}
