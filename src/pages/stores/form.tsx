import { useTranslate } from "@pankod/refine-core";
import {
    Form,
    Input,
    getValueFromEvent,
    Row,
    useSelect,
    Space,
    Select,
    InputNumber,
    Button,
    Col
} from "@pankod/refine-antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Files, PImg, Address, VenderTimes } from 'components'
import { IProduct } from "interfaces";
import { useEffect, useState } from "react";
import code from "./code";
const handleGetValueFromEventNumber = (e: any) => Math.round(e)
const { Option } = Select;
const { TextArea } = Input;

export const FormList = ({ formProps, type }: any) => {
    const t = useTranslate();
    const [data, setData] = useState([]);
    const productList = Form.useWatch("products", formProps.form);

    const { selectProps: productSelectProps } = useSelect<IProduct>({
        resource: "categories"
    });


    const prefixSelector = (
        <Form.Item name="phoneCode" noStyle>
            <Select style={{ width: 80 }}>
                {code.map((item: any, key: any) => <Option key={key} value={item.dial_code}>{item.dial_code}</Option>)}
            </Select>
        </Form.Item>
    );

    return <Row gutter={[64, 0]} wrap>
        <Col xs={24} lg={6}>
            <Form.Item
                name="avatar"
                valuePropName="fileList"
                getValueFromEvent={getValueFromEvent}
                rules={[
                    {
                        required: true,
                        message: 'Store Logo is required!'
                    },
                ]}
            >
                <Files folder={'stores'} name="avatar" lable={'Store Logo'} formProps={formProps} />
            </Form.Item>
            <Form.Item
                label={'Categories'}
                name={"categories"}
                rules={[
                    {
                        required: true,
                        message: 'Categories are required!'
                    }
                ]}
            >
                <Select {...productSelectProps}
                    mode="multiple"
                    allowClear
                />
            </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
            <Form.Item
                label={t("stores.fields.title")}
                name="title"
                rules={[
                    {
                        required: true,
                        message: 'Store Name is required!'
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={t("stores.fields.email")}
                name="email"
                rules={[
                    {
                        required: true,
                        type: "email",
                        message: 'Management Email is required!'
                    },
                ]}
            >
                <Input disabled={type === "edit"} />
            </Form.Item>
            {type === "create" && (
                <Form.Item
                    label={'Password'}
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Password is required!'
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>)}
            <Form.Item
                label={t("stores.fields.phone")}
                name="phone"
                rules={[
                    {
                        required: true,
                        message: 'Management Phone is required!'
                    },
                ]}
                getValueFromEvent={handleGetValueFromEventNumber}
            >
                <InputNumber step="0" style={{ width: 340 }} addonBefore={prefixSelector} type="number" />
            </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
            <Form.Item
                label={'Store Location'}
                name={["address"]}
                rules={[
                    {
                        required: true,
                        message: 'Store Location is required!'
                    },
                ]}
            >
                <Address name="address" formProps={formProps} />
            </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
            <Form.Item>

            </Form.Item>
            <Form.Item
                label={'Store Representative Name'}
                name="representativeName"
                rules={[
                    {
                        required: true,
                        message: 'Store Representative Name is required!'
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={'Store Representative Email'}
                name="representativeEmail"
                rules={[
                    {
                        required: true,
                        type: "email",
                        message: 'Store Representative Email is required!'
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={'Store Representative Phone Number'}
                name="representativePhone"
                rules={[
                    {
                        required: true,
                        message: 'Store Representative Phone is required!'
                    }
                ]}
                getValueFromEvent={handleGetValueFromEventNumber}
            >
                <InputNumber
                    step={0}
                    type="number"
                    style={{ width: 340 }} addonBefore={prefixSelector}
                />
            </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
            <Form.Item>

            </Form.Item>
            <Form.Item
                label={'Store Description'}
                name={"notes"}
                rules={[
                    {
                        required: true,
                        message: 'Store Description is required!'
                    },
                ]}
            >
                <Input.TextArea rows={8} />
            </Form.Item>
        </Col>
        <Col xs={24} lg={6}>
            <Form.Item
                name="images"
                valuePropName="fileList"
                getValueFromEvent={getValueFromEvent}
                rules={[
                    {
                        required: true,
                        message: 'Store Image required!'
                    },
                ]}
            >
                <Files count={5} folder={'storeImages'} lable={'Store Image'} name="images" formProps={formProps} />
            </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
            <Form.Item
                label={'Best Seller Items'}
                name="products"
                rules={[
                    {
                        required: true,
                        message: 'Products are required!'
                    }
                ]}
            >
                <Form.List name="products"
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        marginBottom: 8,
                                    }}
                                    align="baseline"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'description']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing Description',
                                            },
                                        ]}
                                    >
                                        <TextArea style={{ height: 150 }} placeholder="Description" />
                                    </Form.Item>
                                    {(productList && productList[name] && (productList[name] as any).description) && (<Form.Item
                                        {...restField}
                                        name={[name, 'image']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing Image',
                                            },
                                        ]}
                                    >
                                        <PImg folder={'products'} name={name} lable={'Product Image'} formProps={formProps} />
                                    </Form.Item>)}
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            {fields.length < 5 && (
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add New
                                    </Button>
                                </Form.Item>)}
                        </>
                    )}
                </Form.List>
            </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
            <Form.Item
                label={'Store Operational Hours'}
                name={"operationalHours"}
                rules={[
                    {
                        required: true,
                        message: 'Operational Hours are required!'
                    },
                ]}
            >
                <VenderTimes name="operationalHours" formProps={formProps} />
            </Form.Item>
        </Col>
    </Row>
}