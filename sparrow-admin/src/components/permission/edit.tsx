
"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/permission";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import PermissionApi from "@/api/auto/permission";
import {Permission} from "@/components/permission/columns";
import toast from "react-hot-toast";
import {useTranslations} from "next-intl";
import * as v from "valibot";
import {CellContextProps,MyTableMeta} from "@/common/lib/table/DataTableProperty";
import useNavigating from "@/common/hook/NavigatingHook";
import {PagerResult} from "@/common/lib/protocol/Result";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableSelect} from "@/common/components/forms/validatable-select";


export default function EditPage({cellContext,callbackHandler}: CellContextProps<Permission>) {
     const globalTranslate = useTranslations("GlobalForm");
        const errorTranslate = useTranslations("Permission.ErrorMessage")
        const pageTranslate = useTranslations("Permission")
        const validateTranslate = useTranslations("Permission.validate")
        const FormSchema = crateScheme(validateTranslate);
        type FormData = v.InferOutput<typeof FormSchema>;
        const original = cellContext.row.original;
        const  Navigations=useNavigating();
        const meta = cellContext.table.options.meta as MyTableMeta<Permission>;
       const pageResult=(meta.result.data as PagerResult<Permission>)




    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        PermissionApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
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
            <ValidatableInput defaultValue={original.id} {...register("id")}
                                  type={"hidden"}
                                  fieldPropertyName={"id"}/>
<ValidatableInput readonly={false} defaultValue={original.tenantId} {...register("tenantId")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.tenantId?.message}                                  fieldPropertyName={"tenantId"}/>
<ValidatableInput readonly={false} defaultValue={original.permissionCode} {...register("permissionCode")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.permissionCode?.message}                                  fieldPropertyName={"permissionCode"}/>
<ValidatableInput readonly={false} defaultValue={original.permissionName} {...register("permissionName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.permissionName?.message}                                  fieldPropertyName={"permissionName"}/>
<ValidatableSelect dictionary={pageResult.dictionary["permissionType"]} pageTranslate={pageTranslate} defaultValue={original.permissionType}setValue={setValue}
fieldPropertyName={"permissionType"}/>
<ValidatableSelect dictionary={pageResult.dictionary["appId"]} pageTranslate={pageTranslate} defaultValue={original.appId}setValue={setValue}
fieldPropertyName={"appId"}/>
<ValidatableSelect dictionary={pageResult.dictionary["microServiceId"]} pageTranslate={pageTranslate} defaultValue={original.microServiceId}setValue={setValue}
fieldPropertyName={"microServiceId"}/>
<ValidatableSelect dictionary={pageResult.dictionary["parentId"]} pageTranslate={pageTranslate} defaultValue={original.parentId}setValue={setValue}
fieldPropertyName={"parentId"}/>
<ValidatableInput readonly={false} defaultValue={original.operation} {...register("operation")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.operation?.message}                                  fieldPropertyName={"operation"}/>
<ValidatableInput readonly={false} defaultValue={original.object} {...register("object")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.object?.message}                                  fieldPropertyName={"object"}/>
<ValidatableInput readonly={false} defaultValue={original.url} {...register("url")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.url?.message}                                  fieldPropertyName={"url"}/>
<ValidatableSelect dictionary={pageResult.dictionary["method"]} pageTranslate={pageTranslate} defaultValue={original.method}setValue={setValue}
fieldPropertyName={"method"}/>
<ValidatableInput readonly={false} defaultValue={original.icon} {...register("icon")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.icon?.message}                                  fieldPropertyName={"icon"}/>
<ValidatableSelect dictionary={pageResult.dictionary["target"]} pageTranslate={pageTranslate} defaultValue={original.target}setValue={setValue}
fieldPropertyName={"target"}/>
<ValidatableInput readonly={false} defaultValue={original.sort} {...register("sort")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.sort?.message}                                  fieldPropertyName={"sort"}/>
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