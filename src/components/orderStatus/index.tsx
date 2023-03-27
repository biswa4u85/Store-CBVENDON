import { useTranslate } from "@pankod/refine-core";

import { Tag } from "@pankod/refine-antd";

type OrderStatusProps = {
    status: "Delivered" | "Out for Delivery" | "Order Packaged" | "Order Received" | "Cancelled";
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
    const t = useTranslate();
    let color;

    switch (status) {
        case "Delivered":
            color = "orange";
            break;
        case "Out for Delivery":
            color = "cyan";
            break;
        case "Order Packaged":
            color = "green";
            break;
        case "Order Received":
            color = "blue";
            break;
        case "Cancelled":
            color = "red";
            break;
    }

    return <Tag color={color}>{status}</Tag>;
};
