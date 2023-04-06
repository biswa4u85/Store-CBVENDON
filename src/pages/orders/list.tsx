import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
    useExport,
    useNavigation,
    HttpError,
    getDefaultFilter,
} from "@pankod/refine-core";
import common from "common";

import {
    List,
    Table,
    TextField,
    useTable,
    getDefaultSortOrder,
    DateField,
    Popover,
    Space,
    Card,
    Grid,
    Icons,
    Form,
    DatePicker,
    Select,
    NumberField,
    useSelect,
    Button,
    FormProps,
    Row,
    Col,
    CreateButton,
    ExportButton,
} from "@pankod/refine-antd";
import RefineReactRouter from "@pankod/refine-react-router-v6";
import dayjs from "dayjs";

import { OrderStatus, OrderActions } from "components";
import { IOrder, IStore, IOrderFilterVariables } from "interfaces";
import { useMemo } from "react";
export const USERS_DETAILS = "user details";

export const OrderList: React.FC<IResourceComponentsProps> = () => {
    let user = localStorage.getItem(USERS_DETAILS);
    let users: any = user ? JSON.parse(user) : {}
    const { tableProps, sorter, searchFormProps, filters } = useTable<
        IOrder,
        HttpError,
        IOrderFilterVariables
    >({
        resource: 'orders',
        initialFilter: [{
            field: "store",
            operator: "eq",
            value: users?.id,
        }],
        onSearch: (params) => {
            const filters: any = [];
            const { orderStatus, isPaid, order } = params;
            filters.push({
                field: "orderStatus",
                operator: "in",
                value: orderStatus ? orderStatus == 'Not Delivered' ? ['Out for Delivery', 'Order Packaged', 'Order Received'] : [orderStatus] : '',
            });
            filters.push({
                field: "id",
                operator: "id",
                value: order,
            });
            filters.push({
                field: "isPaid",
                operator: "boolean",
                value: isPaid,
            });
            return filters;
        },
    });

    const t = useTranslate();
    const { show, edit } = useNavigation();
    const { Link } = RefineReactRouter;
    const { isLoading, triggerExport } = useExport<IOrder>({
        sorter,
        filters,
        pageSize: 50,
        maxItemCount: 50,
        mapData: (item: any) => {
            return {
                id: item.id,
                paymentConfirmation: item.paymentConfirmation,
                serviceType: item.serviceType,
                products: item.products,
                servicePrice: item.servicePrice,
                employeeID: item.employeeID,
                store: item.store,
                bags: item.bags,
                logisticCompanyProvider: item.logisticCompanyProvider,
                isPaid: item.isPaid,
                logisticConfirmationNumber: item.logisticConfirmationNumber,
                orderStatus: item.orderStatus
            };
        },
    });

    const Actions: React.FC = () => (
        <Space>
            <CreateButton />
            {/* <ExportButton onClick={triggerExport} loading={isLoading} /> */}
        </Space>
    );

    return (
        <Row gutter={[16, 16]}>
            <Col
                xl={6}
                lg={24}
                xs={24}
                style={{
                    marginTop: "52px",
                }}
            >
                <Card title={t("orders.filter.title")}>
                    <Filter
                        formProps={searchFormProps}
                        filters={filters || []}
                    />
                </Card>
            </Col>
            <Col xl={18} xs={24}>
                <List
                    headerProps={{
                        extra: <Actions />,
                    }}
                >
                    <Table
                        {...tableProps}
                        rowKey="id"
                    >
                        {/* <Table.Column dataIndex="id" title="ID" align="center" /> */}
                        <Table.Column
                            key="id"
                            dataIndex="id"
                            title={t("orders.fields.orderNumber")}
                            render={(value) => <Popover
                                title={value}
                                trigger="hover"
                            >
                                <Button onClick={() => show("orders", value)} type="link">Order ID</Button>
                            </Popover>}
                        />
                        <Table.Column<IOrder>
                            key="orderStatus"
                            dataIndex={"orderStatus"}
                            title={t("orders.fields.status")}
                            render={(value) => {
                                return <OrderStatus status={value} />;
                            }}
                            sorter
                        />
                        <Table.Column
                            align="right"
                            key="servicePrice"
                            dataIndex="servicePrice"
                            title={'Service Price'}
                            render={(value) => {
                                return `${common.currency}${value}`
                            }}
                        />
                        <Table.Column
                            align="right"
                            key="serviceType"
                            dataIndex="serviceType"
                            title={'Service Type'}
                        />
                        <Table.Column
                            key="store.id"
                            dataIndex={'store'}
                            title={t("orders.fields.store")}
                            render={(value) => <Popover
                                title={value}
                                trigger="hover"
                            >
                                <Link to={`/stores/edit/${value}`} type="link">Store ID</Link>
                            </Popover>}
                        />
                        <Table.Column
                            key="user.fullName"
                            dataIndex={"user"}
                            title={t("orders.fields.user")}
                            render={(value) => <Popover
                                title={value}
                                trigger="hover"
                            >
                                <Link to={`/users/show/${value}`} type="link">User ID</Link>
                            </Popover>}
                        />
                        <Table.Column<IOrder>
                            key="products"
                            dataIndex="products"
                            title={t("orders.fields.products")}
                            render={(_, record) => (
                                <Popover
                                    title="Products"
                                    trigger="hover"
                                >
                                    {t("orders.fields.itemsAmount", {
                                        amount: record?.products?.length,
                                    })}
                                </Popover>
                            )}
                        />
                        <Table.Column
                            key="createDate"
                            dataIndex="createDate"
                            title={'Order Date'}
                            render={(value) => (
                                <DateField value={value} format="LL" />
                            )}
                            sorter
                        />
                        <Table.Column<IOrder>
                            fixed="right"
                            title={t("table.actions")}
                            dataIndex="actions"
                            key="actions"
                            align="center"
                            render={(_value, record) => (
                                <OrderActions record={record} />
                            )}
                        />
                    </Table>
                </List>
            </Col>
        </Row>
    );
};

const Filter: React.FC<{ formProps: FormProps; filters: CrudFilters }> = (
    props,
) => {
    const t = useTranslate();
    const { formProps, filters } = props;
    let user = localStorage.getItem(USERS_DETAILS);
    let users: any = user ? JSON.parse(user) : {}
    const { selectProps: orderSelectProps } = useSelect<IStore>({
        resource: "orders",
        optionLabel: "id",
        filters: [{
            field: "store",
            operator: "eq",
            value: users?.id,
        }],
        defaultValue: getDefaultFilter("order.id", filters),
    });
    const { selectProps: storeSelectProps } = useSelect<IStore>({
        resource: "stores",
        optionLabel: "id",
        defaultValue: getDefaultFilter("store.id", filters),
    });

    const { selectProps: userSelectProps } = useSelect<IStore>({
        resource: "users",
        optionLabel: "id",
        defaultValue: getDefaultFilter("user.id", filters),
    });

    const createdAt = useMemo(() => {
        const start = getDefaultFilter("createdAt", filters, "gte");
        const end = getDefaultFilter("createdAt", filters, "lte");

        const startFrom = dayjs(start);
        const endAt = dayjs(end);

        if (start && end) {
            return [startFrom, endAt];
        }
        return undefined;
    }, [filters]);

    return (
        <Form
            layout="vertical"
            {...formProps}
            initialValues={{
                q: getDefaultFilter("q", filters),
                store: getDefaultFilter("store.id", filters),
                user: getDefaultFilter("user.id", filters),
                status: getDefaultFilter("status.text", filters, "in"),
                createdAt,
            }}
        >
            <Row gutter={[10, 0]} align="bottom">
                <Col xl={24} md={8} sm={12} xs={24}>
                    <Form.Item
                        label={"Order Status"}
                        name="orderStatus"
                    >
                        <Select
                            options={[{ label: 'Delivered', value: 'Delivered' }, { label: 'Not Delivered', value: 'Not Delivered' }, { label: 'Out for Delivery', value: 'Out for Delivery' }, { label: 'Order Packaged', value: 'Order Packaged' }, { label: 'Order Received', value: 'Order Received' }]}
                            allowClear
                            placeholder={t("orders.filter.status.placeholder")}
                        >
                        </Select>
                    </Form.Item>
                </Col>
                <Col xl={24} md={8} sm={12} xs={24}>
                    <Form.Item
                        label={'Paid'}
                        name="isPaid"
                    >
                        <Select
                            options={[{ label: 'Done', value: 'true' }, { label: 'Not Done', value: 'false' }]}
                            allowClear
                            placeholder={'Payment Status'}
                        >

                        </Select>
                    </Form.Item>
                </Col>
                <Col xl={24} md={8} sm={12} xs={24}>
                    <Form.Item
                        label={'Order'}
                        name="order"
                    >
                        <Select
                            {...orderSelectProps}
                            allowClear
                            placeholder={'Search Orders'}
                        />
                    </Form.Item>
                </Col>
                <Col xl={24} md={8} sm={12} xs={24}>
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            type="primary"
                            size="large"
                            block
                        >
                            {t("orders.filter.submit")}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
