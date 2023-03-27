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
} from "@pankod/refine-antd";
import { IUser, IStore, IProduct } from "interfaces";
import { QRCodes, Dates } from 'components'
import common from "common";

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
            {
                field: "store.id",
                operator: "eq",
                value,
            }
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
                <Select>
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
                <Select>
                    {stores?.options?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </Form.Item>
            {formProps.form.getFieldsValue().store && (<Form.Item
                label={'Products'}
                name={"products"}
                rules={[
                    {
                        required: true,
                        message: 'Products are required!'
                    },
                ]}
            >
                <Select
                    mode="multiple"
                    allowClear>
                    {options?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </Form.Item>)}
            <Form.Item
                label={'Status'}
                name="status"
            >
                <Radio.Group>
                    <Radio value={true}>{t("status.enable")}</Radio>
                    <Radio value={false}>
                        {t("status.disable")}
                    </Radio>
                </Radio.Group>
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
                <Select options={[{ label: 'Normal', value: 'normal' }, { label: 'Express', value: 'express' }, { label: 'Day Pass', value: 'dayPass' }]} />
            </Form.Item>
            <Form.Item
                style={{ display: 'none' }}
                name="orderStatusArray"
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={'Service Price'}
                name="servicePrice"
                rules={[
                    {
                        required: true,
                        message: 'Service Price required!'
                    },
                ]}
            >
                <Input prefix={common.currency} type="number" />
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
                <Input type="number" />
            </Form.Item>
            <Form.Item
                label={'Employee ID'}
                name="employeeID"
                rules={[

                ]}
            >
                <Input />
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
                <Dates name={'createDate'} formProps={formProps} />
            </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
            <Form.Item
                label={'Paid'}
                name="isPaid"
                rules={[
                    {
                        required: true,
                        message: 'Paid Status required!'
                    },
                ]}
            >
                <Radio.Group>
                    <Radio value={true}>Done</Radio>
                    <Radio value={false}>Not Done</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label={'Payment Confirmation'}
                name="paymentConfirmation"
                rules={[
                    {
                        required: true,
                        message: 'Payment Confirmation required!'
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={'Order Status'}
                name="orderStatus"
                rules={[

                ]}
            >
                <Select options={[{ label: 'Delivered', value: 'Delivered' }, { label: 'Out for Delivery', value: 'Out for Delivery' }, { label: 'Order Packaged', value: 'Order Packaged' }, { label: 'Order Received', value: 'Order Received' }]} />
            </Form.Item>
            <Form.Item
                label={'Logistic Confirmation Number'}
                name="logisticConfirmationNumber"
                rules={[

                ]}
            >
                <Input type="number" />
            </Form.Item>
            <Form.Item
                label={'Logistic Company Provider'}
                name="logisticCompanyProvider"
                rules={[

                ]}
            >
                <Input />
            </Form.Item>
        </Col>
    </Row>
}