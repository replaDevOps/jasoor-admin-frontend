
import React, { useState } from 'react'
import { Button, Card, Dropdown, Flex, Spin, Space, Typography,message } from 'antd'
import { useNavigate } from 'react-router-dom';
import { useMutation,useQuery } from '@apollo/client';
import { LOGOUT } from '../../../graphql/mutation/login';
import {ME} from '../../../graphql/query'

import { client } from '../../../config';

const UserDropdown = ()=> {
  const userId = localStorage.getItem("userId"); 
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const { data, loading:isLoading, refetch } = useQuery(ME, {
    variables: { getUserId:userId },
    skip: !userId,
    fetchPolicy: "network-only",
  });
  
  const [logout, { loading }] = useMutation(LOGOUT, {
    onCompleted: () => {
      localStorage.removeItem("accessToken"); 
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      client.resetStore(); 
      window.location.reload();
      },
    onError: (err) => messageApi.error("Logout error:", err)
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
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#4F46E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '16px',
            textTransform: 'uppercase',
          }}
        >
          {data?.getUser?.name?.charAt(0)}
        </div>
          <Flex vertical gap={1}>
            <Typography.Text strong className='fs-13'>{data?.getUser?.name}</Typography.Text>
            <Typography.Text className='text-gray fs-13'>{data?.getUser?.email}</Typography.Text>
          </Flex>
        </Flex>
        <Button className='btnsave w-100'
          type='primary' 
          loading={loading}
          onClick={logout}
          aria-labelledby='logout'
          >
            Logout
        </Button>
      </Space>
    </Card>
  );

  if (isLoading || loading) {
    return (
        <Flex justify="center" align="center" style={{ height: "200px" }}>
            <Spin size="large" />
        </Flex>
    );
  }
  return (
    <>
    {contextHolder}
    <div>
      <Dropdown
          overlay={dropdownContent}
          trigger={['click']}
          className='p-0'
      >
        <Flex align='center' gap={5}>
          <Flex vertical gap={0} align='end'>
            <Typography.Text strong className='fs-12'>{data?.getUser?.name}</Typography.Text>
            <Typography.Text className='text-gray fs-12'>{data?.getUser?.role?.name}</Typography.Text>
          </Flex>
          <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#4F46E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '16px',
            textTransform: 'uppercase',
          }}
        >
          {data?.getUser?.name?.charAt(0)}
        </div>
        </Flex>
      </Dropdown>
      {/* <SwitchAccount 
          visible={switchAccount}
          onClose={()=>{setSwitchAccount(false)}}
        /> */}
    </div>
    </>
  )
}

export {UserDropdown}