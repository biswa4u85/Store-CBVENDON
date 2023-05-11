import React, { useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    useShow,
    useOne,
    useExport,
    IResourceComponentsProps,
} from "@pankod/refine-core";
import moment from "moment";
import html2pdf from 'html2pdf.js';
import {
    List,
    ExportButton,
    Space,
    notification,
    Timeline, Button, Descriptions
} from "@pankod/refine-antd";
import { QRCodes } from 'components'
import { OrderStatus, Loader } from "components";
import { IOrder } from "interfaces";
import common from "common";

export const OrderShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<IOrder>();
    const { data, isLoading } = queryResult;
    const order: any = data?.data ? data?.data : {};
    const componentRef = useRef<any>(null);
    let orderStatusArray = order.orderStatusArray ? order.orderStatusArray.map((item: any) => { return { ...item, label: moment(item.label).format('MMMM Do YYYY, h:mm:ss a') } }) : []

    const userDetails = useOne<any>({
        resource: "users",
        id: order?.user,
    });
    const users = userDetails?.data?.data;

    const storeDetails = useOne<any>({
        resource: "stores",
        id: order?.store,
    });
    const store = storeDetails?.data?.data;

    const exportData = () => {
        if (!order?.user) {
            notification.error({
                message: "Error",
                description: "User not assigned",
            })
            return
        }
        const html = componentRef.current.innerHTML;
        html2pdf()
            .from(html)
            .outputPdf('datauristring')
            .then((pdf: any) => {
                const base64EncodedData = pdf.split(";base64,").pop();
                const arrayBuffer = Uint8Array.from(atob(base64EncodedData), c => c.charCodeAt(0));
                const storage = getStorage();
                const storageRef = ref(storage);
                const filePath = `invoices/order_${order.id}.pdf`;
                const fileRef = ref(storageRef, filePath);
                uploadBytes(fileRef, arrayBuffer).then((snapshot) => {
                    getDownloadURL(fileRef).then((url) => {
                        fetch('https://us-central1-cbuserapp.cloudfunctions.net/emailSend', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            body: JSON.stringify({
                                "to": users?.email,
                                "subject": "Order Details",
                                "text": "Order",
                                "html": `<p><a href="${url}">Download PDF</a></p>`
                            })
                        })
                            .then(response => response.text())
                            .then(data => notification.success({
                                message: "Success",
                                description: data,
                            }))
                            .catch(error => notification.error({
                                message: "Error",
                                description: "Email Error",
                            }));
                    }).catch((error) => {
                        notification.error({
                            message: "Error",
                            description: "PDF Generate error",
                        })
                    });
                }).catch((error) => {
                    notification.error({
                        message: "Error",
                        description: "PDF Generate error",
                    })
                });
            })
            .catch((err: any) => notification.error({
                message: "Error",
                description: "PDF Generate error",
            }));
    }

    if (isLoading)
        return <Loader />

    return (
        <List
            title={"Order Details"}
            headerButtons={
                <Space>
                    <Button onClick={() => history.back()}>Back</Button>
                    <ExportButton onClick={() => exportData()} />
                </Space>
            }
        >
            <div id="exportSpace" ref={componentRef}>
                <Descriptions title="Order Info" bordered column={2}>
                    <Descriptions.Item label="Order Number">{order.id}</Descriptions.Item>
                    <Descriptions.Item label="Service Type">{order.serviceType}</Descriptions.Item>
                    <Descriptions.Item label="Bags">{order.bags}</Descriptions.Item>
                    <Descriptions.Item label="Paid">{order.isPaid ? 'Done' : 'Not Done'}</Descriptions.Item>
                    <Descriptions.Item label="Logistic Company Provider">{order.logisticCompanyProvider}</Descriptions.Item>
                    <Descriptions.Item label="Logistic Confirmation Number">{order.logisticConfirmationNumber}</Descriptions.Item>
                    <Descriptions.Item label="Payment Confirmation">{order.paymentConfirmation}</Descriptions.Item>
                    <Descriptions.Item label="Service Price">{common.currency}{order.servicePrice}</Descriptions.Item>
                    <Descriptions.Item label="QR Code">
                        <QRCodes text={JSON.stringify({
                            id: String(order.id),
                            itemQuantity: order?.products?.length ? Number(order?.products?.length) : null,
                            bagCount: order.bags ? Number(order.bags) : null,
                            storeID: String(order.store),
                            storeName: String(store?.title),
                            price: order.servicePrice ? Number(order.servicePrice) : null,
                            isPaid: order.isPaid ? order.isPaid : false, // default to false.
                            paymentConfirmation: order.paymentConfirmation ? String(order.paymentConfirmation) : "", // can leave it empty
                            customerId: "", // can leave it empty.
                            deliveryStatus: order.orderStatus ? String(order.orderStatus) : "",
                            logisticCompanyProvider: order.logisticCompanyProvider ? String(order.logisticCompanyProvider) : "",
                            logisticCompanyNumber: order.logisticConfirmationNumber ? String(order.logisticConfirmationNumber) : "",
                            orderType: order.serviceType ? String(order.serviceType) : "",
                            invoice: ""
                        })} size={150} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Order Status"><OrderStatus status={order.orderStatus} /></Descriptions.Item>
                </Descriptions>
                <Descriptions title="Order Status Info" bordered>
                    <Descriptions.Item>
                        <Timeline
                            mode={'left'}
                            items={orderStatusArray}
                        />
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </List>
    );
};
