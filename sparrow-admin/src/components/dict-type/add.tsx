"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/dict-type";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import DictTypeApi from "@/api/auto/dict-type";
import toast from "react-hot-toast";
import * as v from "valibot";
import {useTranslations} from "next-intl";
import {TableOperationProps,CellContextProps} from "@/common/lib/table/DataTableProperty";
import {DictType} from "@/components/dict-type/columns";
import useNavigating from "@/common/hook/NavigatingHook";

import {ValidatableInput} from "@/common/components/forms/validatable-input";



export default function AddPage({
                                 callbackHandler
                                 
                             }: Partial<TableOperationProps<DictType>> & Partial<CellContextProps<DictType>>)  {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ErrorMessage")
    const pageTranslate = useTranslations("DictType")
    const validateTranslate = useTranslations("DictType.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;
    const  Navigations=useNavigating();
    

    



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        DictTypeApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
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
<ValidatableInput readonly={false} defaultValue={""}  {...register("typeCode")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.typeCode?.message} fieldPropertyName={"typeCode"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("remark")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.remark?.message} fieldPropertyName={"remark"}/>
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