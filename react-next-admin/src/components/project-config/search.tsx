
import * as React from "react";
import {useState} from "react";
import {ProjectConfig} from "@/components/project-config/columns";
import {MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import ProjectConfigApi from "@/api/auto/project-config";
import {useTranslations} from "next-intl";
import SearchInput from "@/common/components/forms/SearchInput";


type ProjectConfigQuery = {
    name: string;
frontendName: string;
chineseName: string;git 
}

export default function Search({table}: TableOperationProps<ProjectConfig>) {
    const meta = table.options.meta as MyTableMeta<ProjectConfig>;
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage")
    const pageTranslate = useTranslations("ProjectConfig")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [projectConfigQuery, setProjectConfigQuery] = useState<ProjectConfigQuery>()

    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = () => {
        ProjectConfigApi.search(projectConfigQuery, errorTranslate).then(
            (res) => {
                setDataState(res)
            }
        ).catch(() => {
        });
    };


    return (<>
            <SearchInput value={projectConfigQuery?.name||""} 
propertyName={"name"} pageTranslate={pageTranslate} 
setSearchCondition={setProjectConfigQuery}/>
<SearchInput value={projectConfigQuery?.frontendName||""} 
propertyName={"frontendName"} pageTranslate={pageTranslate} 
setSearchCondition={setProjectConfigQuery}/>
<SearchInput value={projectConfigQuery?.chineseName||""} 
propertyName={"chineseName"} pageTranslate={pageTranslate} 
setSearchCondition={setProjectConfigQuery}/>
            <Button onClick={() => searchHandler()} variant="ghost" className="ml-2">{globalTranslate('search')}</Button>
        </>
    );
}