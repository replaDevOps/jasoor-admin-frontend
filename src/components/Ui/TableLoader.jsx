import { SyncOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export const CustomSpin = ({ size = "large", containerHeight = "250px" }) => (
  <div
    style={{
      height: containerHeight,
    }}
    className="center"
  >
    <Spin
      size={size}
      indicator={<SyncOutlined spin className="text-brand fs-24" />}
    />
  </div>
);
export const TableLoader = {
  indicator: <SyncOutlined spin className="text-brand fs-24" />,
};
