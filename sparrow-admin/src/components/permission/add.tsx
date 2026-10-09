"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/permission";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import PermissionApi from "@/api/auto/permission";
import toast from "react-hot-toast";
import * as v from "valibot";
import {useTranslations} from "next-intl";
import {TableOperationProps,MyTableMeta,CellContextProps} from "@/common/lib/table/DataTableProperty";
import {Permission} from "@/components/permission/columns";
import useNavigating from "@/common/hook/NavigatingHook";
import {PagerResult} from "@/common/lib/protocol/Result";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableSelect} from "@/common/components/forms/validatable-select";



export default function AddPage({
                                 callbackHandler
                                 
                                 ,table,
                                 cellContext
                             }: Partial<TableOperationProps<Permission>> & Partial<CellContextProps<Permission>>)  {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ErrorMessage")
    const pageTranslate = useTranslations("Permission")
    const validateTranslate = useTranslations("Permission.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;
    const  Navigations=useNavigating();
    
    const currentTable = table ?? cellContext!.table;
    const meta = currentTable.options.meta as MyTableMeta<Permission>;
    const pageResult=(meta.result.data as PagerResult<Permission>)
    

    
       const original = cellContext ? cellContext.row.original : null;
    



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        PermissionApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
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
                <ValidatableInput defaultValue={""}  {...register("id")} type={"hidden"} fieldPropertyName={"id"}/>
<ValidatableInput readonly={false} defaultValue={"0"}  {...register("tenantId")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.tenantId?.message} fieldPropertyName={"tenantId"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("permissionCode")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.permissionCode?.message} fieldPropertyName={"permissionCode"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("permissionName")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.permissionName?.message} fieldPropertyName={"permissionName"}/>
<ValidatableSelect dictionary={pageResult.dictionary["permissionType"]} pageTranslate={pageTranslate} defaultValue={""}  setValue={setValue} errorMessage={errors.permissionType?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"permissionType"}/>
<ValidatableSelect dictionary={pageResult.dictionary["appId"]} pageTranslate={pageTranslate} defaultValue={""}  setValue={setValue} errorMessage={errors.appId?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"appId"}/>
<ValidatableSelect dictionary={pageResult.dictionary["microServiceId"]} pageTranslate={pageTranslate} defaultValue={""}  setValue={setValue} errorMessage={errors.microServiceId?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"microServiceId"}/>
<ValidatableSelect dictionary={pageResult.dictionary["parentId"]} pageTranslate={pageTranslate}  defaultValue={String(original ? original.id :0)}  setValue={setValue} errorMessage={errors.parentId?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"parentId"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("operation")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.operation?.message} fieldPropertyName={"operation"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("object")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.object?.message} fieldPropertyName={"object"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("url")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.url?.message} fieldPropertyName={"url"}/>
<ValidatableSelect dictionary={pageResult.dictionary["method"]} pageTranslate={pageTranslate} defaultValue={""}  setValue={setValue} errorMessage={errors.method?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"method"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("icon")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.icon?.message} fieldPropertyName={"icon"}/>
<ValidatableSelect dictionary={pageResult.dictionary["target"]} pageTranslate={pageTranslate} defaultValue={""}  setValue={setValue} errorMessage={errors.target?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"target"}/>
<ValidatableInput readonly={false} defaultValue={"0"}  {...register("sort")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.sort?.message} fieldPropertyName={"sort"}/>
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