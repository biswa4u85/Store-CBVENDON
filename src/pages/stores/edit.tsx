import { IResourceComponentsProps } from "@pankod/refine-core";
import {
    Edit,
    Form,
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
        >
            <Form
                {...formProps}
                layout="vertical"
                initialValues={{
                    // isActive: true,
                    ...formProps.initialValues,
                }}
            >
                <FormList formProps={formProps} type="edit" />
            </Form>
        </Edit>
    );
};
