import React, { Fragment, useState, useEffect } from "react";
import dayjs from 'dayjs';
import {
    Row,
    Col,
    Checkbox,
    TimePicker,
} from "@pankod/refine-antd";

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const dateListD = [['00:00', '00:00'], ['00:00', '00:00'], ['00:00', '00:00'], ['00:00', '00:00'], ['00:00', '00:00'], ['00:00', '00:00'], ['00:00', '00:00']]
const format = 'HH:mm';

type VenderTimesProps = {
    name: any
    formProps: any
};

export const VenderTimes: React.FC<VenderTimesProps> = ({ formProps, name }) => {

    const [checkedList, setCheckedList] = useState<any>([])
    const [dateList, setDateList] = useState<any>(dateListD)
    const [indeterminate, setIndeterminate] = useState<any>(true)
    const [checkAll, setCheckAll] = useState<any>(false)

    useEffect(() => {
        if (formProps?.initialValues && formProps?.initialValues[name]) {
            let data = formProps?.initialValues[name] ? formProps?.initialValues[name] : null
            if (data) {
                let newData = JSON.parse(data)
                setCheckedList(newData[0])
                setDateList(newData[1])
                setCheckAll(newData[0].length === plainOptions.length)
            }
        }
    }, [formProps.initialValues])

    const onChange = (checkedList: any) => {
        setCheckedList(checkedList)
        setIndeterminate(!!checkedList.length && checkedList.length < plainOptions.length)
        setCheckAll(checkedList.length === plainOptions.length)
        if (checkedList) {
            (formProps as any).form.setFieldsValue({
                [name]: JSON.stringify([checkedList, dateList])
            })
        }
    };

    const onCheckAllChange = (e: any) => {
        setCheckedList(e.target.checked ? plainOptions : [])
        setIndeterminate(false)
        setCheckAll(e.target.checked)
        if (dateList) {
            (formProps as any).form.setFieldsValue({
                [name]: JSON.stringify([e.target.checked ? plainOptions : [], dateList])
            })
        }
    };

    const onChangeTime = (key: any, type: any, time: any, timeString: any) => {
        let tempDateList = JSON.parse(JSON.stringify(dateList))
        tempDateList[key][type] = String(timeString)
        setDateList(tempDateList)
        if (tempDateList) {
            (formProps as any).form.setFieldsValue({
                [name]: JSON.stringify([checkedList, tempDateList])
            })
        }
    }

    return (
        <Fragment>
            <div>
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                    <Checkbox
                        indeterminate={indeterminate}
                        onChange={onCheckAllChange}
                        checked={checkAll}>
                        Every Day
                    </Checkbox>
                </div>
                <br />
                {checkAll ? <Row>
                    <Col span={8}>
                        {dateList ? <TimePicker onChange={(time: any, timeString: any) => onChangeTime(0, 0, time, timeString)} value={dayjs(dateList[0][0], format)} format={format} /> : null}

                    </Col>
                    <Col span={8}>
                        {dateList ? <TimePicker onChange={(time: any, timeString: any) => onChangeTime(0, 1, time, timeString)} value={dayjs(dateList[0][1], format)} format={format} /> : null}
                    </Col>
                </Row> : <CheckboxGroup style={{ width: '100%', display: 'block' }} value={checkedList} onChange={onChange}>
                    {plainOptions.map((item, key) => {
                        return (
                            <Row key={key} style={{ padding: 5 }}>
                                <Col span={4} style={{ paddingTop: 5 }}>
                                    <Checkbox value={item}>{item}</Checkbox>
                                </Col>
                                <Col span={8}>
                                    {dateList ? <TimePicker onChange={onChangeTime.bind(this, key, 0)} value={dayjs(dateList[key][0], format)} format={format} /> : null}
                                </Col>
                                <Col span={8}>
                                    {dateList ? <TimePicker onChange={onChangeTime.bind(this, key, 1)} value={dayjs(dateList[key][1], format)} format={format} /> : null}
                                </Col>
                            </Row>
                        );
                    })}
                </CheckboxGroup>}
            </div>
        </Fragment>
    );
};
