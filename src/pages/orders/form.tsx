import { useEffect } from "react";
import { useTranslate, useSelect } from "@pankod/refine-core";
import {
    Form,
    Input,
    Row,
    DatePicker,
    Select,
    Image,
    Col,
    Radio,
    InputNumber,
} from "@pankod/refine-antd";
import { IUser, IStore, IProduct } from "interfaces";
import { QRCodes, Dates } from 'components'

export const FormList = ({ formProps, type }: any) => {
    const t = useTranslate();
    const users = useSelect<IUser>({
        resource: "users",
    });

    const stores = useSelect<IStore>({
        resource: "stores",
    });

    const { options, onSearch } = useSelect<IProduct>({
        resource: "products",
        onSearch: (value) => [
            // {
            //     field: "store.id",
            //     operator: "eq",
            //     value,
            // }
        ]
    });

    useEffect(() => {
        onSearch(formProps.form.getFieldsValue().store)
    }, [formProps.form.getFieldsValue().store])

    return <Row gutter={[64, 0]} wrap>
        <Col xs={24} lg={6}>
            <Form.Item
                label={t("stores.fields.user")}
                name="user"
                rules={[
                    // {
                    //     required: true,
                    //     message: 'User is required!'
                    // },
                ]}
            >
                <Select disabled={type == 'edit'}>
                    <option value={''}>Select User</option>
                    {users?.options?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label={t("stores.fields.store")}
                name="store"
                rules={[
                    {
                        required: true,
                        message: 'Store is required!'
                    },
                ]}
            >
                <Select disabled>
                    {stores?.options?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </Form.Item>
            {type == 'edit' && (<Form.Item label={'QR Code'}>
                <QRCodes text={formProps?.initialValues ? formProps?.initialValues['id'] : ''} size={150} />
            </Form.Item>)}
        </Col>
        <Col xs={24} lg={8}>
            <Form.Item
                label={'Service Type'}
                name="serviceType"
                rules={[
                    {
                        required: true,
                        message: 'Service Type required!'
                    },
                ]}
            >
                <Select disabled={formProps?.initialValues?.isPaid} options={[{ label: 'Normal', value: 'normal' }, { label: 'Express', value: 'express' }]} />
            </Form.Item>
            <Form.Item
                style={{ display: 'none' }}
                name="orderStatusArray"
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={'Number of Bags'}
                name="bags"
                rules={[
                    {
                        required: true,
                        message: 'Number of Bags required!'
                    },
                ]}
            >
                <InputNumber style={{ width: "100%" }} min={1}
                    disabled={formProps?.initialValues?.isPaid}
                    formatter={(value: any) => {
                        if (value === undefined) {
                            return '';
                        } else {
                            return value.replace('.', '')
                        }
                    }}
                    type="number" />
            </Form.Item>
            <Form.Item
                label={'Employee ID'}
                name="employeeID"
                rules={[

                ]}
            >
                <Input disabled={type == 'edit'} />
            </Form.Item>
            <Form.Item
                label={'Order Date'}
                name="createDate"
                rules={[
                    {
                        required: true,
                        message: 'Order Date required!'
                    },
                ]}
            >
                <Dates disabled={type == 'edit'} name={'createDate'} formProps={formProps} />
            </Form.Item>
        </Col>
    </Row>
}