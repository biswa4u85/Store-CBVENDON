import React, { Fragment, useState, useEffect } from "react";
import QRCode from "react-qr-code";
type QRCodeTimesProps = {
    text: any
    size?: any
};
export const QRCodes: React.FC<QRCodeTimesProps> = ({ text, size = 200 }) => {
    return (
        <QRCode size={size} value={text} />
    );
};