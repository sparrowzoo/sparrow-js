"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/user-group";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import UserGroupApi from "@/api/auto/user-group";
import toast from "react-hot-toast";
import * as v from "valibot";
import {useTranslations} from "next-intl";
import {TableOperationProps,CellContextProps} from "@/common/lib/table/DataTableProperty";
import {UserGroup} from "@/components/user-group/columns";
import useNavigating from "@/common/hook/NavigatingHook";

import {ValidatableTextarea} from "@/common/components/forms/validatable-textarea";
import {ValidatableInput} from "@/common/components/forms/validatable-input";



export default function AddPage({
                                 callbackHandler
                                 
                             }: Partial<TableOperationProps<UserGroup>> & Partial<CellContextProps<UserGroup>>)  {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ErrorMessage")
    const pageTranslate = useTranslations("UserGroup")
    const validateTranslate = useTranslations("UserGroup.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;
    const  Navigations=useNavigating();
    

    



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        UserGroupApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
            () => {
                callbackHandler?.();
                toast.success(globalTranslate("save")+globalTranslate("operation-success"));
            }
        ).catch(()=>{});
    };

    const {
        register,
        handleSubmit,
        
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
<ValidatableInput readonly={false} defaultValue={""}  {...register("code")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.code?.message} fieldPropertyName={"code"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("name")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.name?.message} fieldPropertyName={"name"}/>
<ValidatableInput readonly={false} defaultValue={"0"}  {...register("sort")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.sort?.message} fieldPropertyName={"sort"}/>
<ValidatableTextarea className={"w-80 h-60"} readonly={false} defaultValue={""}  {...register("remark")} isSubmitted={isSubmitted} pageTranslate={pageTranslate}errorMessage={errors.remark?.message} fieldPropertyName={"remark"}/>
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