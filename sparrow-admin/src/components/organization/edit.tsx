
"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/organization";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import OrganizationApi from "@/api/auto/organization";
import {Organization} from "@/components/organization/columns";
import toast from "react-hot-toast";
import {useTranslations} from "next-intl";
import * as v from "valibot";
import {CellContextProps,MyTableMeta} from "@/common/lib/table/DataTableProperty";
import useNavigating from "@/common/hook/NavigatingHook";
import {PagerResult} from "@/common/lib/protocol/Result";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableSelect} from "@/common/components/forms/validatable-select";


export default function EditPage({cellContext,callbackHandler}: CellContextProps<Organization>) {
     const globalTranslate = useTranslations("GlobalForm");
        const errorTranslate = useTranslations("Organization.ErrorMessage")
        const pageTranslate = useTranslations("Organization")
        const validateTranslate = useTranslations("Organization.validate")
        const FormSchema = crateScheme(validateTranslate);
        type FormData = v.InferOutput<typeof FormSchema>;
        const original = cellContext.row.original;
        const  Navigations=useNavigating();
        const meta = cellContext.table.options.meta as MyTableMeta<Organization>;
       const pageResult=(meta.result.data as PagerResult<Organization>)




    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        OrganizationApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
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
<ValidatableInput readonly={false} defaultValue={original.level} {...register("level")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.level?.message}                                  fieldPropertyName={"level"}/>
<ValidatableSelect dictionary={pageResult.dictionary["parentId"]} pageTranslate={pageTranslate} defaultValue={original.parentId}setValue={setValue}
fieldPropertyName={"parentId"}/>
<ValidatableInput readonly={false} defaultValue={original.code} {...register("code")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.code?.message}                                  fieldPropertyName={"code"}/>
<ValidatableInput readonly={false} defaultValue={original.name} {...register("name")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.name?.message}                                  fieldPropertyName={"name"}/>
<ValidatableInput readonly={false} defaultValue={original.manager} {...register("manager")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.manager?.message}                                  fieldPropertyName={"manager"}/>
<ValidatableInput readonly={false} defaultValue={original.telephone} {...register("telephone")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.telephone?.message}                                  fieldPropertyName={"telephone"}/>
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