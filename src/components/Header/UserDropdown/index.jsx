
import React, { useEffect, useState } from 'react'
import { Button, Card, Dropdown, Flex, Image, Space, Typography } from 'antd'
import { SwitchAccount } from './SwitchAccount';

const UserDropdown = ()=> {
  const [ switchAccount , setSwitchAccount] = useState(false)
  const [loading, setLoading]= useState(false)
  // const dispatch = useDispatch()
  //   const { profiledata } = useSelector(state => state?.profilegetApi)
  //   useEffect(() => {
  //       dispatch(actionsApi?.getUpdateProfile())
  //   }, [dispatch])

  // const logout = () => {
  //     setLoading(true)
  //     const {userToken}= checkAuthorization()
  //     var myHeaders = new Headers();
  //     myHeaders.append("Authorization", userToken)
  //     var requestOptions = {
  //       method: 'GET',
  //       headers: myHeaders,
  //       redirect: 'follow'
  //     }
  //     fetch(domainUrl + '/logout', requestOptions)
  //     .then(response => response.json())
  //     .then(result => {
  //     if (result?.success)
  //         {
  //             localStorage.clear()
  //             window.location.href = '/'
  //         }
  //     else
  //         throw 'error'
  //     })
  //     .catch(() => {
  //         setLoading(false)
  //         localStorage.clear()
  //         window.location.href = '/'
  //     })
  // }

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
          // onClick={logout}>
          >
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
      <SwitchAccount 
          visible={switchAccount}
          onClose={()=>{setSwitchAccount(false)}}
        />
    </div>
  )
}

export {UserDropdown}