
import React, { useEffect, useState } from 'react'
import { Button, Card, Dropdown, Flex, Image, Space, Typography } from 'antd'
import { SwitchAccount } from './SwitchAccount';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGOUT } from '../../../graphql/mutation/login';

import { client } from '../../../config';

const UserDropdown = ()=> {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const [logout, { loading }] = useMutation(LOGOUT, {
    onCompleted: () => {
      localStorage.removeItem("accessToken"); 
localStorage.removeItem("refreshToken");
localStorage.removeItem("userId");
client.resetStore(); 
window.location.reload();
    },
    onError: (err) => message.error("Logout error:", err.message)
  });
  
  const handleLogout = () => {
    logout(); 
  };
  
  const items = [
    {
      key: 'setting',
      label: <Text className='fw-500'>{'Settings'}</Text>,
      onClick: () => navigate('/setting', { state: { user } }),
    },
    {
      key: 'logout',
      label: (<Text className='fw-500' >{'Logout'}</Text>),
      onClick: handleLogout,
    },
  ];

  const dropdownContent = (
    <Card className='radius-12 shadow-c card-cs'>
      <Space direction='vertical'> 
        <Flex align='center' gap={10}>
          <img src="/assets/images/av-1.png" style={{width: 40,height:40,borderRadius:50}} alt="" />
          <Flex vertical gap={1}>
            <Typography.Text strong className='fs-13'>Abdullah</Typography.Text>
            <Typography.Text className='text-gray fs-13'>example@gmail.com</Typography.Text>
          </Flex>
        </Flex>
        <Button className='btnsave w-100'
          type='primary' 
          loading={loading}
          onClick={logout}>
            Logout
        </Button>
      </Space>
    </Card>
);
  return (
    <div>
      <Dropdown
          overlay={dropdownContent}
          trigger={['click']}
          className='p-0'
      >
        <Flex align='center' gap={5}>
          <Flex vertical gap={0} align='end'>
            <Typography.Text strong className='fs-12'>Abdullah</Typography.Text>
            <Typography.Text className='text-gray fs-12'>Admin</Typography.Text>
          </Flex>
          <img src='/assets/images/av-1.png' width={40} style={{borderRadius:50}}/>
        </Flex>
      </Dropdown>
      {/* <SwitchAccount 
          visible={switchAccount}
          onClose={()=>{setSwitchAccount(false)}}
        /> */}
    </div>
  )
}

export {UserDropdown}