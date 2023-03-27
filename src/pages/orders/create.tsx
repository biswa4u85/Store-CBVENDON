import { IResourceComponentsProps } from "@pankod/refine-core";
import {
    Create,
    Form,
    Button,
    useForm,
} from "@pankod/refine-antd";

import { FormList } from "./form";
import { IOrder } from "interfaces";

export const OrderCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm<IOrder>();

    return (
        <Create
            isLoading={queryResult?.isFetching}
            saveButtonProps={saveButtonProps}
            headerButtons={
                <Button onClick={() => history.back()}>Back</Button>
            }
        >
            <Form
                {...formProps}
                layout="vertical"
                initialValues={{
                    isActive: true,
                }}
            >
                <FormList formProps={formProps} type="create" />
            </Form>
        </Create>
    );
};
