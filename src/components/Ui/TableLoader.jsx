import { SyncOutlined } from "@ant-design/icons"
import { Spin } from 'antd';

export const CustomSpin = ({ size = 'large', containerHeight = '250px' }) => (
  <div style={{ 
    height: containerHeight, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    <Spin 
      size={size}
      indicator={<SyncOutlined spin style={{ color: 'var(--brand-color)', fontSize: '24px' }} />}
    />
  </div>
);
export const TableLoader={ 
    indicator: <SyncOutlined  spin style={{color:'var(--brand-color)',fontSize: '24px'}}/>
  }