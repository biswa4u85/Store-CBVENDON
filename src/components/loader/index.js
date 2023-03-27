import React from "react";
import { Spin } from "@pankod/refine-antd"

export const Loader = (props) => (
  <div style={{ width: '100%', textAlign: 'center' }}><Spin tip="Loading..."></Spin></div>
);