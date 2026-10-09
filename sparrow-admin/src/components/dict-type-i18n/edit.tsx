"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/dict-type-i18n";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import DictTypeI18nApi from "@/api/auto/dict-type-i18n";
import {DictTypeI18n} from "@/components/dict-type-i18n/columns";
import toast from "react-hot-toast";
import {useTranslations} from "next-intl";
import * as v from "valibot";
import {CellContextProps,MyTableMeta} from "@/common/lib/table/DataTableProperty";
import useNavigating from "@/common/hook/NavigatingHook";
import {PagerResult} from "@/common/lib/protocol/Result";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableSelect} from "@/common/components/forms/validatable-select";


export default function EditPage({cellContext,callbackHandler}: CellContextProps<DictTypeI18n>) {
     const globalTranslate = useTranslations("GlobalForm");
        const errorTranslate = useTranslations("ErrorMessage")
        const pageTranslate = useTranslations("DictTypeI18n")
        const validateTranslate = useTranslations("DictTypeI18n.validate")
        const FormSchema = crateScheme(validateTranslate);
        type FormData = v.InferOutput<typeof FormSchema>;
        const original = cellContext.row.original;
        const  Navigations=useNavigating();
        
        const meta = cellContext.table.options.meta as MyTableMeta<DictTypeI18n>;
        const pageResult=(meta.result.data as PagerResult<DictTypeI18n>)
        



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        DictTypeI18nApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
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
<ValidatableSelect dictionary={pageResult.dictionary["dictTypeId"]} pageTranslate={pageTranslate} defaultValue={String(original.dictTypeId)}  setValue={setValue} errorMessage={errors.dictTypeId?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"dictTypeId"}/>
<ValidatableSelect dictionary={pageResult.dictionary["locale"]} pageTranslate={pageTranslate} defaultValue={String(original.locale)}  setValue={setValue} errorMessage={errors.locale?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"locale"}/>
<ValidatableInput readonly={false} defaultValue={String(original.typeName)}  {...register("typeName")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.typeName?.message} fieldPropertyName={"typeName"}/>
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