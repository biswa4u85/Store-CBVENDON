import React, { Fragment, useState, useEffect } from "react";
import dayjs from 'dayjs';
import {
    Row,
    Col,
    TimePicker,
} from "@pankod/refine-antd";

const options: any = {
    Mon: [{ open_at: "00:00", close_at: "00:00" }],
    Tue: [{ open_at: "00:00", close_at: "00:00" }],
    Wed: [{ open_at: "00:00", close_at: "00:00" }],
    Thu: [{ open_at: "00:00", close_at: "00:00" }],
    Fri: [{ open_at: "00:00", close_at: "00:00" }],
    Sat: [{ open_at: "00:00", close_at: "00:00" }],
    Sun: [{ open_at: "00:00", close_at: "00:00" }],
};

type VenderTimesProps = {
    name: any
    formProps: any
};

export const VenderTimes: React.FC<VenderTimesProps> = ({ formProps, name }) => {
    const [checkedList, setCheckedList] = useState<any>(options);

    useEffect(() => {
        if (formProps?.initialValues && formProps?.initialValues[name]) {
            if (typeof (formProps?.initialValues[name]) == 'object') {
                let values = formProps.form.getFieldValue(name)
                if (values) {
                    let newValues: any = {}
                    for (let key in options) {
                        newValues[key] = values[key] ? values[key] : options[key]
                    }
                    setCheckedList(newValues);
                }
            }
        }
    }, [formProps.initialValues])


    const onChangeValue = (key: any, type: any, time?: any, timeString?: any) => {
        let tempCheckedList = JSON.parse(JSON.stringify(checkedList));
        tempCheckedList[key][type].open_at = timeString[0];
        tempCheckedList[key][type].close_at = timeString[1];
        setCheckedList(tempCheckedList);
        if (tempCheckedList) {
            (formProps as any).form.setFieldsValue({
                [name]: tempCheckedList,
            });
        }
    };

    return (
        <Fragment>
            <div style={{ width: "100%", display: "block" }}>
                {Object.keys(checkedList).map((item, key) => {
                    return (
                        <>
                            <Row key={key} style={{ padding: 5 }}>
                                <Col span={5} style={{ paddingTop: 5 }}>
                                    <h3>{item}</h3>
                                </Col>
                                <Col span="18">
                                    {checkedList[item].map((val: any, k: any) => (
                                        <Row key={k} style={{ paddingBottom: 20 }}>
                                            <Col span={12}>
                                                <TimePicker.RangePicker
                                                    value={[
                                                        dayjs(val.open_at, "HH:mm"),
                                                        dayjs(val.close_at, "HH:mm"),
                                                    ]}
                                                    onChange={onChangeValue.bind(this, item, k)}
                                                    format="HH:mm"
                                                    order={false}
                                                    disabled={val?.is_close}
                                                    allowClear={false}
                                                    minuteStep={10}
                                                    placeholder={["Start time", "End time"]}
                                                />
                                            </Col>
                                        </Row>
                                    ))}
                                </Col>
                            </Row>
                        </>
                    );
                })}
            </div>
        </Fragment>
    );
};
