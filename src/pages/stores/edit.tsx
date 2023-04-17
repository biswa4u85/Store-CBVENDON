import { IResourceComponentsProps } from "@pankod/refine-core";
import {
    Edit,
    Form,
    Button,
    useForm,
} from "@pankod/refine-antd";

import { FormList } from "./form";
import { IStore } from "interfaces";

export const StoreEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm<IStore>();
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
                    ...formProps.initialValues,
                }}
            >
                <FormList formProps={formProps} type="edit" />
            </Form>
        </Edit>
    );
};
