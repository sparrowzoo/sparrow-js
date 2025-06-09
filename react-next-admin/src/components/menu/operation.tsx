import * as React from "react";
import {Payment} from "@/components/menu/columns";
import {TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import AddPage from "@/components/menu/add";
import MenuApi from "@/api/auto/menu";
import toast from "react-hot-toast";
import {getSelectedIds} from "@/common/lib/table/TableUtils";

export default function Operation({table}: TableOperationProps<Payment>) {
    return (<div className="flex justify-between gap-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">新增</Button>
                </DialogTrigger>
                <DialogContent className="w-[800px] sm:max-w-[625px]">
                    <AddPage/>
                </DialogContent>
            </Dialog>
            <Button onClick={() => {
                const translate = () => "";
                const selectedIds = getSelectedIds(table);
                MenuApi.save(selectedIds, translate).then(
                    (res) => {
                        toast.success("操作成功！");
                    }
                )
            }} variant="outline">删除</Button>
        </div>
    );
}
