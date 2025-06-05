import * as React from "react";


const CurrencyCell = (field: string, currencyField: string) => {
    return ({row}) => {
        const amount = parseFloat(row.getValue(field));
        debugger;
        let currencyCategory = row.original[currencyField];
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCategory,
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
    }
}
export default CurrencyCell;

