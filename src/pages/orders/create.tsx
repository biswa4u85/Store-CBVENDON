import { useState, useEffect } from "react";
import { IResourceComponentsProps } from "@pankod/refine-core";
import {
    Create,
    Form,
    Button,
    useForm,
} from "@pankod/refine-antd";
import { FormList } from "./form";
import { IOrder } from "interfaces";
const USERS_DETAILS = "user details";

export const OrderCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm<IOrder>();
    const [users, setUsers] = useState<any>({})
    const user = localStorage.getItem(USERS_DETAILS);

    useEffect(() => {
        if (user) {
            let users1 = JSON.parse(user)
            setUsers(users1)
        }
    }, [user]);

    return (
        <Create
            isLoading={queryResult?.isFetching}
            saveButtonProps={saveButtonProps}
            headerButtons={
                <Button onClick={() => history.back()}>Back</Button>
            }
        >
            {users?.id && (<Form
                {...formProps}
                layout="vertical"
                initialValues={{
                    isActive: true,
                    store: users?.id
                }}
            >
                <FormList formProps={formProps} type="create" />
            </Form>)}

        </Create>
    );
};
