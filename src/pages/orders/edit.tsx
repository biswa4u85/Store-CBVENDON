import { IResourceComponentsProps } from "@pankod/refine-core";
import {
    Edit,
    Form,
    Button,
    useForm,
} from "@pankod/refine-antd";

import { FormList } from "./form";
import { IOrder } from "interfaces";

export const  OrderEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm<IOrder>();
    return (
        <Edit
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
                    ...formProps.initialValues,
                }}
            >
                <FormList formProps={formProps} type="edit" />
            </Form>
        </Edit>
    );
};
