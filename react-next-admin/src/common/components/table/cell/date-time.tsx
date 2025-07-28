import * as React from "react";
import dayjs from "dayjs";


/**
 *
 * @param field 字段
 * @param category
 * 时间戮 timestamp
 * yyyy-MM-dd HH:mm:ss  datetime
 * yyyy-MM-dd  date
 * HH:mm:ss time
 * @constructor
 */
const DateTimeCell = (field: string, category: string = "timestamp") => {
    return ({row}) => {
        const fieldValue = row.getValue(field);
        switch (category) {
            case "timestamp":
                const formattedDate = dayjs(fieldValue).format('yyyy-MM-dd HH:mm:ss');
                return <div className="font-medium">{formattedDate}</div>;
            case "datetime":
                const formattedDateTime = dayjs(fieldValue).format('yyyy-MM-dd HH:mm:ss');
                return <div className="font-medium">{formattedDateTime}</div>;
        }
    }
}
export default DateTimeCell;

