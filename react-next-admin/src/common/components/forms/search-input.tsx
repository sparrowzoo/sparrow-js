import {Input} from "@/components/ui/input";
import {SearchInputProps} from "@/common/lib/table/DataTableProperty";

export default function SearchInput<T>({value, propertyName, pageTranslate, setSearchCondition}: SearchInputProps<T>) {
    return (
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
