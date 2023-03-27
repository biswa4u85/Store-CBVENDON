import { IResourceComponentsProps } from "@pankod/refine-core";
import {
    Create,
    Form,
    useForm,
} from "@pankod/refine-antd";

import { FormList } from "./form";
import { IStore } from "interfaces";

export const StoreCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm<IStore>();

    return (
        <Create
            isLoading={queryResult?.isFetching}
            saveButtonProps={saveButtonProps}
        >
            <Form
                {...formProps}
                layout="vertical"
                initialValues={{
                    // isActive: true,
                }}
            >
                <FormList formProps={formProps} type="create" />
            </Form>
        </Create>
    );
};
