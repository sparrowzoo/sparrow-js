"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/admin-user";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import AdminUserApi from "@/api/auto/admin-user";
import toast from "react-hot-toast";
import * as v from "valibot";
import {useTranslations} from "next-intl";
import {TableOperationProps,MyTableMeta,CellContextProps} from "@/common/lib/table/DataTableProperty";
import {AdminUser} from "@/components/admin-user/columns";
import useNavigating from "@/common/hook/NavigatingHook";
import {PagerResult} from "@/common/lib/protocol/Result";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableSelect} from "@/common/components/forms/validatable-select";



export default function AddPage({
                                 callbackHandler
                                 
                                 ,table,
                                 cellContext
                             }: Partial<TableOperationProps<AdminUser>> & Partial<CellContextProps<AdminUser>>)  {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ErrorMessage")
    const pageTranslate = useTranslations("AdminUser")
    const validateTranslate = useTranslations("AdminUser.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;
    const  Navigations=useNavigating();
    
    const currentTable = table ?? cellContext!.table;
    const meta = currentTable.options.meta as MyTableMeta<AdminUser>;
    const pageResult=(meta.result.data as PagerResult<AdminUser>)
    

    



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        AdminUserApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
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
<ValidatableInput readonly={false} defaultValue={"0"}  {...register("userId")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.userId?.message} fieldPropertyName={"userId"}/>
<ValidatableSelect dictionary={pageResult.dictionary["organizationId"]} pageTranslate={pageTranslate} defaultValue={"0"}  setValue={setValue} errorMessage={errors.organizationId?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"organizationId"}/>
<ValidatableSelect dictionary={pageResult.dictionary["positionId"]} pageTranslate={pageTranslate} defaultValue={"0"}  setValue={setValue} errorMessage={errors.positionId?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"positionId"}/>
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