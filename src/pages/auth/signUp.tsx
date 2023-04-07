import { IResourceComponentsProps, useRouterContext } from "@pankod/refine-core";
import {
    Button,
    Form,
    useForm,
} from "@pankod/refine-antd";
import { FormList } from "../stores/form";
import { authProvider } from "../../authProvider";

export const SignUp: React.FC<IResourceComponentsProps> = () => {
    const { Link } = useRouterContext();
    const { formProps } = useForm<any>();
    const createNew = async (values: any) => {
        let respond = await (authProvider as any).register(values)
    };

    return (
        <div
            style={{
                width: "90%",
                textAlign: 'center',
                margin: "0 auto",
            }}
        >
            <Link to="/">
                <img
                    src="/images/logo.png"
                    alt="Logo"
                    width="200"
                />
            </Link>
            <div
                style={{
                    padding: 20,
                    textAlign: 'left',
                    border: "solid 1px #ccc",
                    borderRadius: 10,
                    margin: "0 auto",
                }}
            >
                <Form
                    {...formProps}
                    layout="vertical"
                    initialValues={{}}
                    onFinish={(values) => {
                        createNew(values);
                    }}
                >
                    <FormList formProps={formProps} type="create" />
                    <Form.Item style={{ textAlign: "right" }}>
                        <Link to="/login" style={{ marginRight: 10 }}>
                            Login
                        </Link>
                        <Button htmlType="submit" type="primary">
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};
