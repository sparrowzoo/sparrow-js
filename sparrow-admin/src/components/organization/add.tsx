"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/organization";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import OrganizationApi from "@/api/auto/organization";
import toast from "react-hot-toast";
import * as v from "valibot";
import {useTranslations} from "next-intl";
import {TableOperationProps,MyTableMeta,CellContextProps} from "@/common/lib/table/DataTableProperty";
import {Organization} from "@/components/organization/columns";
import useNavigating from "@/common/hook/NavigatingHook";
import {PagerResult} from "@/common/lib/protocol/Result";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableSelect} from "@/common/components/forms/validatable-select";



export default function AddPage({
                                 callbackHandler
                                 
                                 ,table,
                                 cellContext
                             }: Partial<TableOperationProps<Organization>> & Partial<CellContextProps<Organization>>)  {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ErrorMessage")
    const pageTranslate = useTranslations("Organization")
    const validateTranslate = useTranslations("Organization.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;
    const  Navigations=useNavigating();
    
    const currentTable = table ?? cellContext!.table;
    const meta = currentTable.options.meta as MyTableMeta<Organization>;
    const pageResult=(meta.result.data as PagerResult<Organization>)
    

    
       const original = cellContext ? cellContext.row.original : null;
    



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        OrganizationApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
            () => {
                callbackHandler?.();
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
        }
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
                                           <DialogTitle>{globalTranslate("add")}</DialogTitle>
                                           <DialogDescription>
                                           </DialogDescription>
                                       </DialogHeader>
                <div className="admin-form-fields">
                <ValidatableInput readonly={false} defaultValue={""}  {...register("code")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.code?.message} fieldPropertyName={"code"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("name")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.name?.message} fieldPropertyName={"name"}/>
<ValidatableInput defaultValue={""}  {...register("id")} type={"hidden"} fieldPropertyName={"id"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("level")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.level?.message} fieldPropertyName={"level"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("tenantId")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.tenantId?.message} fieldPropertyName={"tenantId"}/>
<ValidatableSelect dictionary={pageResult.dictionary["parentId"]} pageTranslate={pageTranslate}  defaultValue={String(original ? original.id :0)}  setValue={setValue} errorMessage={errors.parentId?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"parentId"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("manager")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.manager?.message} fieldPropertyName={"manager"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("telephone")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.telephone?.message} fieldPropertyName={"telephone"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("sort")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.sort?.message} fieldPropertyName={"sort"}/>
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