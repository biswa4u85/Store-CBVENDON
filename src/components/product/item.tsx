import { useTranslate, BaseKey } from "@pankod/refine-core";

import {
    Avatar,
    Card,
    Divider,
    InputNumber,
    Icons,
    Dropdown,
    Menu,
    NumberField,
    Typography,
} from "@pankod/refine-antd";
import common from "common";
const { Text, Paragraph } = Typography;
const { CloseCircleOutlined, FormOutlined } = Icons;

import { IProduct } from "interfaces";

type ProductItemProps = {
    item: IProduct;
    updateStock?: (changedValue: number, clickedProduct: IProduct) => void;
    editShow: (id?: BaseKey) => void;
};

export const ProductItem: React.FC<ProductItemProps> = ({
    item,
    updateStock,
    editShow,
}) => {
    const t = useTranslate();

    return (
        <Card
            style={{
                margin: "8px",
                opacity: item.stock <= 0 ? 0.5 : 1,
            }}
            bodyStyle={{ height: "500px" }}
        >
            <div style={{ position: "absolute", top: "10px", right: "5px" }}>
                <Dropdown
                    overlay={
                        <Menu mode="vertical">
                            {updateStock && (
                                <Menu.Item
                                    key="1"
                                    disabled={item.stock <= 0}
                                    style={{
                                        fontWeight: 500,
                                    }}
                                    icon={
                                        <CloseCircleOutlined
                                            style={{
                                                color: "red",
                                            }}
                                        />
                                    }
                                    onClick={() => updateStock(0, item)}
                                >
                                    {t("stores.buttons.outOfStock")}
                                </Menu.Item>
                            )}
                            <Menu.Item
                                key="2"
                                style={{
                                    fontWeight: 500,
                                }}
                                icon={
                                    <FormOutlined
                                        style={{
                                            color: "green",
                                        }}
                                    />
                                }
                                onClick={() => editShow(item.id)}
                            >
                                {t("stores.buttons.edit")}
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={["click"]}
                >
                    <Icons.MoreOutlined
                        style={{
                            fontSize: 24,
                        }}
                    />
                </Dropdown>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <Avatar
                        size={128}
                        shape="square"
                        src={item.images ? item.images[0].url : ''}
                        alt={item.title}
                    />
                </div>
                <Divider />
                <Paragraph
                    ellipsis={{ rows: 2, tooltip: true }}
                    style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        marginBottom: "8px",
                    }}
                >
                    {item.title}
                </Paragraph>
                <Paragraph
                    ellipsis={{ rows: 3, tooltip: true }}
                    style={{ marginBottom: "8px" }}
                >
                    {item.description}
                </Paragraph>
                <Paragraph
                    ellipsis={{ rows: 3, tooltip: true }}
                    style={{
                        fontSize: "24px",
                        fontWeight: 500,
                        marginBottom: "8px",
                    }}
                >
                    {common.currency}{item.price}
                </Paragraph>
                {updateStock && (
                    <div id="stock-number">
                        <InputNumber
                            size="large"
                            keyboard
                            min={0}
                            value={item.stock || 0}
                            onChange={(value: number | null) =>
                                updateStock(value ?? 0, item)
                            }
                            style={{ width: "100%" }}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};
