"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/position";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import PositionApi from "@/api/auto/position";
import toast from "react-hot-toast";
import * as v from "valibot";
import {useTranslations} from "next-intl";
import {TableOperationProps,MyTableMeta,CellContextProps} from "@/common/lib/table/DataTableProperty";
import {Position} from "@/components/position/columns";
import useNavigating from "@/common/hook/NavigatingHook";
import {PagerResult} from "@/common/lib/protocol/Result";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableSelect} from "@/common/components/forms/validatable-select";



export default function AddPage({
                                 callbackHandler
                                 
                                 ,table,
                                 cellContext
                             }: Partial<TableOperationProps<Position>> & Partial<CellContextProps<Position>>)  {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ErrorMessage")
    const pageTranslate = useTranslations("Position")
    const validateTranslate = useTranslations("Position.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;
    const  Navigations=useNavigating();
    
    const currentTable = table ?? cellContext!.table;
    const meta = currentTable.options.meta as MyTableMeta<Position>;
    const pageResult=(meta.result.data as PagerResult<Position>)
    

    



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        PositionApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
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
<ValidatableSelect dictionary={pageResult.dictionary["organizationId"]} pageTranslate={pageTranslate} defaultValue={"0"}  setValue={setValue} errorMessage={errors.organizationId?.message} isSubmitted={isSubmitted} setError={setError} fieldPropertyName={"organizationId"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("code")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.code?.message} fieldPropertyName={"code"}/>
<ValidatableInput readonly={false} defaultValue={""}  {...register("name")} type={"text"} isSubmitted={isSubmitted} pageTranslate={pageTranslate} errorMessage={errors.name?.message} fieldPropertyName={"name"}/>
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