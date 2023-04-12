import { useState, useEffect } from "react";
import {
    useGetLocale,
    useSetLocale,
    useGetIdentity,
    useTranslate,
    useList,
} from "@pankod/refine-core";

import {
    Button,
    Modal,
    Avatar,
    Typography,
    Space,
    Grid,
    notification,
    Row,
    Col,
    Form,
    Input,
    AntdLayout,
} from "@pankod/refine-antd";

import RefineReactRouter from "@pankod/refine-react-router-v6";

import { QuestionOutlined } from "@ant-design/icons";

const USERS_DETAILS = "user details";
const { Header: AntdHeader } = AntdLayout;
const { Link } = RefineReactRouter;
const { Text } = Typography;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

import { IOrder, IStore } from "interfaces";
import { HeaderTitle } from "./styled";

interface IOptionGroup {
    value: string;
    label: string | React.ReactNode;
}

interface IOptions {
    label: string | React.ReactNode;
    options: IOptionGroup[];
}

export const Header: React.FC = () => {
    const locale = useGetLocale();
    const changeLanguage = useSetLocale();
    const screens = useBreakpoint();
    const t = useTranslate();
    const [users, setUsers] = useState<any>({})
    const user = localStorage.getItem(USERS_DETAILS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            let users1 = JSON.parse(user)
            setUsers(users1)
        }
    }, [user]);

    const help = (values: any) => {
        setLoader(true)
        fetch('https://us-central1-cbuserapp.cloudfunctions.net/emailSend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "to": "support@wecarrybags.co.uk",
                "subject": `${values.subject}`,
                "text": `From ${users?.email}`,
                "html": values.message
            })
        })
            .then((response) => response.text())
            .then((data: any) => {
                form.resetFields();
                setIsModalOpen(false)
                setLoader(false)
                notification.success({
                    message: "Success",
                    description: data,
                })
            }
            )
            .catch((error) => {
                setLoader(false)
                notification.error({
                    message: "Error",
                    description: "Email Error",
                })
            });
    };

    const renderTitle = (title: string) => (
        <HeaderTitle>
            <Text style={{ fontSize: "16px" }}>{title}</Text>
            <Link to={`/${title.toLowerCase()}`}>{t("search.more")}</Link>
        </HeaderTitle>
    );

    const renderItem = (title: string, imageUrl: string, link: string) => ({
        value: title,
        label: (
            <Link to={link} style={{ display: "flex", alignItems: "center" }}>
                <Avatar shape="square" size={64} src={imageUrl} style={{ minWidth: "64px" }} />
                <Text style={{ marginLeft: "16px" }}>{title}</Text>
            </Link>
        ),
    });

    const [value, setValue] = useState<string>("");
    const [options, setOptions] = useState<IOptions[]>([]);

    const { refetch: refetchOrders } = useList<IOrder>({
        resource: "orders",
        config: {
            filters: [{ field: "q", operator: "contains", value }],
        },
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const orderOptionGroup = data.data.map((item) =>
                    renderItem(
                        `${item.store.title} / #${item.orderNumber}`,
                        "/images/default-order-img.png",
                        `/orders/show/${item.id}`,
                    ),
                );
                if (orderOptionGroup.length > 0) {
                    setOptions((prevOptions) => [
                        ...prevOptions,
                        {
                            label: renderTitle(t("orders.orders")),
                            options: orderOptionGroup,
                        },
                    ]);
                }
            },
        },
    });

    const { refetch: refetchStores } = useList<IStore>({
        resource: "stores",
        config: {
            filters: [{ field: "q", operator: "contains", value }],
        },
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const storeOptionGroup = data.data.map((item) =>
                    renderItem(
                        item.title,
                        "/images/default-store-img.png",
                        `/stores/edit/${item.id}`,
                    ),
                );
                if (storeOptionGroup.length > 0) {
                    setOptions((prevOptions) => [
                        ...prevOptions,
                        {
                            label: renderTitle(t("stores.stores")),
                            options: storeOptionGroup,
                        },
                    ]);
                }
            },
        },
    });

    useEffect(() => {
        setOptions([]);
        refetchOrders();
        refetchStores();
    }, [value]);


    return (
        <AntdHeader
            style={{
                padding: "0 24px",
                background: "white",
            }}
        >
            <Row
                align="middle"
                style={{
                    justifyContent: screens.sm ? "space-between" : "end",
                }}
            >
                <Col xs={0} sm={12}>

                </Col>
                <Col>
                    <Space size="middle" align="center">
                        <Text
                            ellipsis
                            strong
                            style={{
                                display: "flex",
                            }}
                        >
                            {users?.fullName}
                        </Text>
                        <a onClick={() => setIsModalOpen(true)}>
                            <QuestionOutlined
                                style={{ fontSize: 20, color: '#ff0000' }}
                            />
                        </a>
                        {users?.id && (<Link to={`/stores/edit/${users?.id}`}>
                            <Avatar
                                size="large"
                                src={users?.avatar ? users?.avatar[0]?.url : ''}
                                alt={users?.fullName}
                            />
                        </Link>)}
                    </Space>
                </Col>
            </Row>
            <Modal title="User Feedback" open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)}>
                <Form
                    name="basic"
                    form={form}
                    layout="vertical"
                    onFinish={help}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Subject"
                        name="subject"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Subject!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Message"
                        name="message"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Message!',
                            },
                        ]}
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button loading={loader} type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </AntdHeader>
    );
};
