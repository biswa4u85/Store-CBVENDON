import { useTranslate } from "@pankod/refine-core";
import {
    Form,
    Select,
    Input,
    getValueFromEvent,
    useSelect,
    InputNumber,
    Radio,
} from "@pankod/refine-antd";
import { ICategory, IStore } from "interfaces";
import { Files } from 'components'
import common from "common";

export const FormList = ({ formProps }: any) => {
    const t = useTranslate();

    const { selectProps: categorySelectProps } = useSelect<ICategory>({
        resource: "categories",
    });

    const { selectProps: storeSelectProps } = useSelect<IStore>({
        resource: "stores",
    });


    return <Form {...formProps} layout="vertical">
        <Form.Item>
            <Form.Item
                name="images"
                valuePropName="fileList"
                getValueFromEvent={getValueFromEvent}
                rules={[
                    {
                        required: true,
                        message: 'Image is required!'
                    },
                ]}
            >
                <Files folder={'products'} name="images" lable={'Product Image'} formProps={formProps} />
            </Form.Item>
        </Form.Item>
        <Form.Item
            label={t("products.fields.name")}
            name="title"
            rules={[
                {
                    required: true,
                    message: 'Name is required!'
                },
            ]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label={t("products.fields.description")}
            name="description"
            rules={[
                {
                    required: true,
                    message: 'Description is required!'
                },
            ]}
        >
            <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item
            label={t("products.fields.price")}
            name="price"
            rules={[
                {
                    required: true,
                    message: 'Price is required!'
                },
            ]}
        >
            <InputNumber
                formatter={(value) => `${common.currency} ${value}`}
                style={{ width: "150px" }}
            />
        </Form.Item>
        <Form.Item
            label={t("products.fields.category")}
            name={["category", "id"]}
            rules={[
                {
                    required: true,
                    message: 'Category is required!'
                },
            ]}
        >
            <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item
            label={t("products.fields.store")}
            name={["store", "id"]}
            rules={[
                {
                    required: true,
                    message: 'Store is required!'
                },
            ]}
        >
            <Select {...storeSelectProps} />
        </Form.Item>
        <Form.Item
            label={'Status'}
            name="isActive"
        >
            <Radio.Group>
                <Radio value={true}>{t("status.enable")}</Radio>
                <Radio value={false}>{t("status.disable")}</Radio>
            </Radio.Group>
        </Form.Item>
    </Form>
}