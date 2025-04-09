import {Checkbox} from "@/components/ui/checkbox";
import * as React from "react";

export default function Page() {
    return (
        <div>
            <h1>Checkbox Page</h1>
            <p>This is the Checkbox page</p>
            <form>
                <Checkbox
                    className={"peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"}>
                </Checkbox>
            </form>
        </div>
    );
};