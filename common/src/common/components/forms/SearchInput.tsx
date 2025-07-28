import {Dispatch, SetStateAction} from "react";
import {Input} from "@/components/ui/input";

interface SearchInputProps<T>{
    value:string;
    propertyName:string;
    pageTranslate: (key: string) => string;
    setSearchCondition:Dispatch<SetStateAction<T>>;

}
export default function SearchInput<T>({value, propertyName, pageTranslate, setSearchCondition}: SearchInputProps<T>){
    return(
        <Input value={value} onChange={(e) => {
            setSearchCondition((prevState) => {
                return {
                    ...prevState,
                    [propertyName]: e.target.value
                } as T;
            })
        }}
               placeholder={pageTranslate(propertyName)}
               className="max-w-sm"
        />
    )
};
