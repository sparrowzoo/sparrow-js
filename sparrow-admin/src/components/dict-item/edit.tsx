"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/dict-item";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import DictItemApi from "@/api/auto/dict-item";
import {DictItem} from "@/components/dict-item/columns";
import toast from "react-hot-toast";
import {useTranslations} from "next-intl";
import * as v from "valibot";
import {CellContextProps,MyTableMeta} from "@/common/lib/table/DataTableProperty";
import useNavigating from "@/common/hook/NavigatingHook";
import {PagerResult} from "@/common/lib/protocol/Result";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableSelect} from "@/common/components/forms/validatable-select";


export default function EditPage({cellContext,callbackHandler}: CellContextProps<DictItem>) {
     const globalTranslate = useTranslations("GlobalForm");
        const errorTranslate = useTranslations("ErrorMessage")
        const pageTranslate = useTranslations("DictItem")
        const validateTranslate = useTranslations("DictItem.validate")
        const FormSchema = crateScheme(validateTranslate);
        type FormData = v.InferOutput<typeof FormSchema>;
        const original = cellContext.row.original;
        const  Navigations=useNavigating();
        
        const meta = cellContext.table.options.meta as MyTableMeta<DictItem>;
        const pageResult=(meta.result.data as PagerResult<DictItem>)
        



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        DictItemApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
            () => {
                if(callbackHandler){callbackHandler();}
                toast.success(globalTranslate("save")+globalTranslate("operation-success"));
            }
        ).catch(()=>{});
    };

    const {
        register,
        handleSubmit,
        
        setValue,
        setError,
        
        formState: {
            errors,
            isSubmitted
        },
    } = useForm<FormData>({
        //相当于v.parse
        resolver: valibotResolver(
            FormSchema,
            //https://valibot.dev/guides/parse-data/
            {abortEarly: false, lang: "zh-CN"}
        ),
    });


    return (
             <form className="admin-form admin-form-wide" onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{globalTranslate("edit")}</DialogTitle>
                            <DialogDescription>
                            </DialogDescription>
                        </DialogHeader>
            <div className="admin-form-fields">
            <ValidatableInput defaultValue={String(original.id)}  {...register("id")} type={"hidden"} fieldPropertyName={"id"}/>
<ValidatableInput readonly={false} defaultValue={String(original.tenantId)}  {...register("tenantId")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.tenantId?.message} fieldPropertyName={"tenantId"}/>
<ValidatableSelect dictionary={pageResult.dictionary["parentId"]} pageTranslate={pageTranslate} defaultValue={String(original.parentId)}  setValue={setValue} errorMessage={errors.parentId?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"parentId"}/>
<ValidatableSelect dictionary={pageResult.dictionary["dictTypeId"]} pageTranslate={pageTranslate} defaultValue={String(original.dictTypeId)}  setValue={setValue} errorMessage={errors.dictTypeId?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"dictTypeId"}/>
<ValidatableInput readonly={false} defaultValue={String(original.itemCode)}  {...register("itemCode")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.itemCode?.message} fieldPropertyName={"itemCode"}/>
<ValidatableInput readonly={false} defaultValue={String(original.itemValue)}  {...register("itemValue")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate}  fieldPropertyName={"itemValue"}/>
<ValidatableInput readonly={false} defaultValue={String(original.sort)}  {...register("sort")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.sort?.message} fieldPropertyName={"sort"}/>
<ValidatableInput readonly={false} defaultValue={String(original.remark)}  {...register("remark")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate}  fieldPropertyName={"remark"}/>
             </div>
           <DialogFooter>
                                       <DialogClose asChild>
                                           <Button variant="outline">{globalTranslate("cancel")}</Button>
                                       </DialogClose>
                                       <Button type="submit">{globalTranslate("save")}</Button>
                        </DialogFooter>
        </form>
    );
};