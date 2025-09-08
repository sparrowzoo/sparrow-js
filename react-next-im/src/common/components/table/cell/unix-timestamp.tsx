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
const UnixTimestampCell = (field: string, category: string = "timestamp") => {
    return ({row}) => {
        const fieldValue = row.getValue(field);
        const formattedDate = dayjs(fieldValue).format('YYYY-MM-DD HH:mm:ss');
        return <div className="font-medium">{formattedDate}</div>;
    }
}
export default UnixTimestampCell;

