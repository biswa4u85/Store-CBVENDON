import React, { useState, useEffect } from "react";
import {
    DatePicker,
} from "@pankod/refine-antd";
import dayjs from "dayjs";

type FilesProps = {
    name: any
    formProps: any
    disabled?: any
};

export const Dates: React.FC<FilesProps> = ({ formProps, name, disabled }) => {

    const [d, setD] = useState<any>(null)

    useEffect(() => {
        if (formProps?.initialValues && formProps?.initialValues[name]) {
            setD(dayjs(formProps?.initialValues[name]))
        }
    }, [formProps.initialValues])


    const onDateChange = (date: any, dateS: any) => {
        if (dateS) {
            (formProps as any).form.setFieldsValue({
                [name]: dateS
            })
            setD(date)
        }
    }

    return (
        <DatePicker disabled={disabled} allowClear={false} value={d} onChange={onDateChange} />
    );
};
