"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/dict-item-i18n";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import DictItemI18nApi from "@/api/auto/dict-item-i18n";
import {DictItemI18n} from "@/components/dict-item-i18n/columns";
import toast from "react-hot-toast";
import {useTranslations} from "next-intl";
import * as v from "valibot";
import {CellContextProps,MyTableMeta} from "@/common/lib/table/DataTableProperty";
import useNavigating from "@/common/hook/NavigatingHook";
import {PagerResult} from "@/common/lib/protocol/Result";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableSelect} from "@/common/components/forms/validatable-select";


export default function EditPage({cellContext,callbackHandler}: CellContextProps<DictItemI18n>) {
     const globalTranslate = useTranslations("GlobalForm");
        const errorTranslate = useTranslations("ErrorMessage")
        const pageTranslate = useTranslations("DictItemI18n")
        const validateTranslate = useTranslations("DictItemI18n.validate")
        const FormSchema = crateScheme(validateTranslate);
        type FormData = v.InferOutput<typeof FormSchema>;
        const original = cellContext.row.original;
        const  Navigations=useNavigating();
        
        const meta = cellContext.table.options.meta as MyTableMeta<DictItemI18n>;
        const pageResult=(meta.result.data as PagerResult<DictItemI18n>)
        



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        DictItemI18nApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
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
<ValidatableSelect dictionary={pageResult.dictionary["dictItemId"]} pageTranslate={pageTranslate} defaultValue={String(original.dictItemId)}  setValue={setValue} errorMessage={errors.dictItemId?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"dictItemId"}/>
<ValidatableSelect dictionary={pageResult.dictionary["locale"]} pageTranslate={pageTranslate} defaultValue={String(original.locale)}  setValue={setValue} errorMessage={errors.locale?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"locale"}/>
<ValidatableInput readonly={false} defaultValue={String(original.itemLabel)}  {...register("itemLabel")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.itemLabel?.message} fieldPropertyName={"itemLabel"}/>
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