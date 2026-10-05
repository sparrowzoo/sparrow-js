import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import EditPage from "@/components/table-config/edit";
import ColumnEditor from "@/components/table-config/coder/column-editor";
import {CellContextProps} from "@/common/lib/table/DataTableProperty";
import {TableConfig} from "@/components/table-config/columns";

export default function TableEdit({cellContext}: CellContextProps<TableConfig>) {
    return <Tabs defaultValue="basic" className="admin-table-editor min-w-0 w-full">
        <TabsList>
            <TabsTrigger value="basic">基础信息</TabsTrigger>
            <TabsTrigger value="columns">列配置</TabsTrigger>
        </TabsList>
        <TabsContent className="min-w-0" value="basic">
            <EditPage cellContext={cellContext}/>
        </TabsContent>
        <TabsContent className={"h-fit"} value="columns">
            <ColumnEditor cellContext={cellContext}/>
        </TabsContent>
    </Tabs>
}
