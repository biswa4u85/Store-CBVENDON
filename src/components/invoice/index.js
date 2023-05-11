import React, { useEffect, useRef } from "react";
import { Spin, notification } from "@pankod/refine-antd"
import html2pdf from 'html2pdf.js';
import {
  useShow,
  useOne,
  useExport,
  IResourceComponentsProps,
} from "@pankod/refine-core";
import common from "common";
export const Invoice = ({ order, setOpenPdf }) => {
  const show = useRef(true)
  const userDetails = useOne({
    resource: "users",
    id: order?.user,
  });
  const users = userDetails?.data?.data;

  useEffect(() => {
    if (users && show.current) {
      exportData()
      show.current = false
      setOpenPdf(false)
    }
  }, [users])

  const exportData = () => {
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
        "html": `<!DOCTYPE html>
        <html>
          <head>
            <title>Invoice from Wecarrybags</title>
            <style>
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                text-align: left;
                padding: 8px;
                border-bottom: 1px solid #ddd;
              }
              th {
                background-color: #4CAF50;
                color: white;
              }
            </style>
          </head>
          <body>
            <h1>Invoice from Wecarrybags</h1>
            <p>Dear ${users.name},</p>
            <p>Thank you for your order.</p>
            <table>
              <tr>
                <th>Order ID</th>
                <th>Bags</th>
                <th>Service Type</th>
                <th>Service Price</th>
                <th>Status</th>
                <th>Paid</th>
              </tr>
              <tr>
                <td>${order.id}</td>
                <td>${order.bags}</td>
                <td>${order.serviceType}</td>
                <td>${common.currency}${order.servicePrice}</td>
                <td>${order.orderStatus}</td>
                <td>${order.isPaid ? 'Done' : 'Not Done'}</td>
              </tr>
            </table>
            <p>Regards,</p>
            <p>Wecarrybags</p>
          </body>
        </html>
        `
      })
    })
      .then(response => response.text())
      .then(data => {
        setOpenPdf(false)
        notification.success({
          message: "Success",
          description: data,
        })
      })
      .catch(error => {
        setOpenPdf(false)
        notification.error({
          message: "Error",
          description: "Email Error",
        })
      });
  }

  return <div></div>
};