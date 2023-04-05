import { useTranslate } from "@pankod/refine-core";
import {
    Form,
    Input,
    getValueFromEvent,
    Row,
    useSelect,
    Select,
    InputNumber,
    Col,
    Radio,
    InputProps,
} from "@pankod/refine-antd";
import { Files, Address, VenderTimes } from 'components'
import { IProduct } from "interfaces";
const { Option } = Select;

export const FormList = ({ formProps, type }: any) => {
    const t = useTranslate();

    const { selectProps: productSelectProps } = useSelect<IProduct>({
        resource: "products",
        filters: [
            // {
            //     field: "store.id",
            //     operator: "eq",
            //     value: formProps?.initialValues?.id,
            // },
        ],
    });

    const prefixSelector = (
        <Form.Item name="phoneCode" noStyle>
            <Select style={{ width: 80 }}>
                <Option value="+91">+91</Option>
                <Option value="+01">+01</Option>
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
                <Input readOnly />
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
            >
                <InputNumber style={{ width: 340 }} addonBefore={prefixSelector} type="number" />
            </Form.Item>
            <Form.Item
                label={"Status"}
                name="isActive"
                rules={[
                    {
                        required: true,
                        message: 'Status is required!'
                    },
                ]}
            >
                <Radio.Group>
                    <Radio value={true}>{t("status.enable")}</Radio>
                    <Radio value={false}>
                        {t("status.disable")}
                    </Radio>
                </Radio.Group>
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
                    },
                ]}
            >
                <InputNumber style={{ width: 340 }} addonBefore={prefixSelector} type="number" />
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
        {/* {type === "edit" && (<Col xs={24} lg={12}> */}
        <Col xs={24} lg={12}>
            <Form.Item
                label={'Best Seller Items'}
                name={"bestSellerItems"}
                rules={[
                    {
                        required: true,
                        message: 'Products are required!'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (value) {
                                if (value.length > 5) {
                                    callback("No more than 5 items");
                                } else if (value.length <= 5) {
                                    callback();
                                }
                            }
                            return;
                        }
                    }
                ]}
            >
                <Select {...productSelectProps}
                    mode="multiple"
                    allowClear
                />
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