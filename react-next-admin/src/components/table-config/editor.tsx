import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import EditPage from "@/components/table-config/edit";
import ColumnEditor from "@/components/table-config/coder/column-editor";
import {CellContextProps} from "@/common/lib/table/DataTableProperty";

export default function Editor({cellContext}: CellContextProps<any, any>) {
    return <Tabs defaultValue="basic" className="w-[1000px]">
        <TabsList>
            <TabsTrigger value="basic">基础信息</TabsTrigger>
            <TabsTrigger value="columns">列配置</TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
            <EditPage cellContext={cellContext}/>
        </TabsContent>
        <TabsContent value="columns">
            <ColumnEditor/>
        </TabsContent>
    </Tabs>
}
