import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
    useNavigation,
    HttpError,
} from "@pankod/refine-core";

import {
    List,
    Table,
    Avatar,
    useTable,
    DateField,
    BooleanField,
    Dropdown,
    Card,
    Input,
    Space,
    Icons,
    Form,
    Menu,
    Button,
    Select,
    FormProps,
    Row,
    Col,
    ShowButton,
    EditButton,
} from "@pankod/refine-antd";

import { IStore } from "interfaces";
const { FormOutlined } = Icons;

export const StoreList: React.FC<IResourceComponentsProps> = () => {
    const { edit } = useNavigation();

    const moreMenu = (id: number) => (
        <Menu mode="vertical">
            <Menu.Item
                key="1"
                style={{
                    fontSize: 15,
                    fontWeight: 500,
                }}
                icon={
                    <FormOutlined
                        style={{ color: "green", fontSize: "15px" }}
                    />
                }
                onClick={() => edit("stores", id)}
            >
                {t("buttons.edit")}
            </Menu.Item>
        </Menu>
    );

    const { tableProps, searchFormProps } = useTable<
        IStore,
        HttpError
    >({
        onSearch: (params: any) => {
            const filters: any = [];
            const { title, isActive } = params;
            filters.push({
                field: "title",
                operator: "eq",
                value: title,
            });
            filters.push({
                field: "isActive",
                operator: "boolean",
                value: isActive,
            });
            return filters;
        },
        syncWithLocation: false,
    });

    const t = useTranslate();

    return (
        <Row gutter={[16, 16]}>
            <Col
                xl={6}
                lg={24}
                xs={24}
                style={{
                    marginTop: "48px",
                }}
            >
                <Card title={t("users.filter.title")}>
                    <Filter formProps={searchFormProps} />
                </Card>
            </Col>

            <Col xl={18} xs={24}>
                <List title="Stores / Vendors">
                    <Table {...tableProps} rowKey="id">
                        <Table.Column
                            align="center"
                            key="avatar"
                            dataIndex={["avatar"]}
                            title={t("stores.fields.avatar")}
                            render={(value) => <Avatar shape="square" src={value ? value[0].url : ''} />}
                        />
                        <Table.Column
                            dataIndex="title"
                            title={t("stores.fields.title")}
                        />
                        <Table.Column
                            dataIndex="email"
                            title={t("stores.fields.email")}
                        />
                        <Table.Column
                            dataIndex="phone"
                            title={t("stores.fields.phone")}
                            render={(_, value: any) => `${value.phoneCode} ${value.phone}`}
                        />
                        <Table.Column
                            dataIndex={["address", "addres1"]}
                            title={t("stores.fields.address")}
                        />
                        <Table.Column
                            dataIndex="isActive"
                            title={'Status'}
                            align="center"
                            render={(value) => <BooleanField value={value}
                                valueLabelTrue="Approved"
                                valueLabelFalse="Pending"
                            />}
                        />
                        <Table.Column
                            dataIndex="updateAt"
                            title={'Update At'}
                            render={(value) => (
                                <DateField value={value} format="LL" />
                            )}
                            sorter
                        />
                        <Table.Column<IStore>
                            fixed="right"
                            title={t("table.actions")}
                            dataIndex="actions"
                            key="actions"
                            align="center"
                            render={(_, record) => (
                                <Space>
                                    {/* <ShowButton hideText recordItemId={record.id} /> */}
                                    <EditButton hideText recordItemId={record.id} />
                                </Space>
                            )}
                        />
                    </Table>
                </List>
            </Col>
        </Row>
    );
};

const Filter: React.FC<{ formProps: FormProps }> = (props) => {
    const t = useTranslate();
    return (
        <Form layout="vertical" {...props.formProps}>
            <Row gutter={[10, 0]} align="bottom">
                <Col xs={24} xl={24} md={12}>
                    <Form.Item label={t("users.filter.search.label")} name="title">
                        <Input
                            placeholder={"Name"}
                            prefix={<Icons.SearchOutlined />}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} xl={24} md={8}>
                    <Form.Item
                        label={"Status"}
                        name="isActive"
                    >
                        <Select
                            allowClear
                            placeholder={t("users.filter.isActive.placeholder")}
                            options={[
                                {
                                    label: 'Approved',
                                    value: "true",
                                },
                                {
                                    label: 'Pending',
                                    value: "false",
                                },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} xl={24} md={8}>
                    <Form.Item>
                        <Button
                            style={{ width: "100%" }}
                            htmlType="submit"
                            type="primary"
                        >
                            {t("users.filter.submit")}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};