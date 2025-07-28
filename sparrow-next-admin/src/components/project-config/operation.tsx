import * as React from "react";
import {ProjectConfig} from "@/components/project-config/columns";
import {TableOperationProps,MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import AddPage from "@/components/project-config/add";
import ProjectConfigApi from "@/api/auto/project-config";
import toast from "react-hot-toast";
import TableUtils from "@/common/lib/table/TableUtils";
import {useTranslations} from "next-intl";



export default function Operation({table}: TableOperationProps<ProjectConfig>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage")
    const [open, setOpen] = React.useState(false);
    const meta=table.options.meta as MyTableMeta<ProjectConfig>;

    const initHandler=meta.initHandler;
    const setData=meta.setData;
    const result=meta.result;

    const callbackHandler = () => {
        setOpen(false);
        initHandler();
    }

    return (<div className="flex justify-between gap-4">
            <Dialog onOpenChange={setOpen} open={open}>
                <DialogTrigger asChild>
                    <Button onClick={() => setOpen(true)}  variant="outline">{globalTranslate("add")}</Button>
                </DialogTrigger>
                <DialogContent className="w-[800px] sm:max-w-[625px]">
                     <AddPage callbackHandler={callbackHandler}/>
                </DialogContent>
            </Dialog>
            <Button onClick={() => {
                const selectedIds = TableUtils.getSelectedIds(table);
                if (selectedIds.length === 0) {
                                    toast(globalTranslate("no-record-checked"));
                                    return;
                }
                ProjectConfigApi.batchDelete(selectedIds, errorTranslate).then(
                    (res) => {
                                            const datas= TableUtils.removeRowByPrimary(selectedIds,table);
                                            result.data.list=datas;
                                            result.data.recordTotal-=selectedIds.length;
                                            setData(TableUtils.cloneResult(result));
                        toast.success(globalTranslate("delete")+globalTranslate("operation-success"));
                    }
                )
            }} variant="outline">{globalTranslate("delete")}</Button>

            <Button onClick={() => {
                            const selectedIds = TableUtils.getSelectedIds(table);
                            if (selectedIds.length === 0) {
                                                toast(globalTranslate("no-record-checked"));
                                                return;
                            }
                            ProjectConfigApi.enable(selectedIds, errorTranslate).then(
                                (res) => {
                                   const datas= TableUtils.batchEnable(selectedIds,table,"status");
                                   result.data.list=datas;
                                   result.data.recordTotal-=selectedIds.length;
                                   setData(TableUtils.cloneResult(result));
                                   toast.success(globalTranslate("enable")+globalTranslate("operation-success"));
                                }
                            )
                        }} variant="outline">{globalTranslate("enable")}</Button>


                        <Button onClick={() => {
                                        const selectedIds = TableUtils.getSelectedIds(table);
                                        if (selectedIds.length === 0) {
                                                            toast(globalTranslate("no-record-checked"));
                                                            return;
                                        }
                                        ProjectConfigApi.disable(selectedIds, errorTranslate).then(
                                            (res) => {
                                                 const datas= TableUtils.batchDisable(selectedIds,table,"status");
                                                 result.data.list=datas;
                                                 result.data.recordTotal-=selectedIds.length;
                                                 setData(TableUtils.cloneResult(result));
                                                toast.success(globalTranslate("disable")+globalTranslate("operation-success"));
                                            }
                                        )
                                    }} variant="outline">{globalTranslate("disable")}</Button>
        </div>
    );
}