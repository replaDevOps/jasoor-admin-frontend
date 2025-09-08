import React from 'react'
import { Card, Col, Flex, Image, Row, Typography } from 'antd'
import { ModuleTopHeading } from '../../PageComponents'
import { GET_BUSINESS_STATS } from '../../../graphql/query/business'
import { useQuery } from '@apollo/client'
import { message,Spin } from "antd";

const { Title, Text } = Typography
const DashboardCards = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { data, loading, error } = useQuery(GET_BUSINESS_STATS);

    // Show loader while fetching
    if (loading) {
      return (
        <Flex justify="center" align="center" style={{ height: 200 }}>
          <Spin size="large" />
        </Flex>
      );
    }
  
    if (error) {
      return (
        <Card>
          <Text type="danger">Error loading business stats: {error.message}</Text>
        </Card>
      );
    }
  
    // Destructure API response safely
    const stats = data?.getBusinessStats || {};
  
    const cardsData = [
      {
        id: 1,
        icon: 'dc-1.png',
        title: stats.totalBusinesses || 0,
        subtitle: 'Total Businesses',
      },
      {
        id: 2,
        icon: 'dc-2.png',
        title: stats.completedDeals || 0,
        subtitle: 'Completed Deals',
      },
      {
        id: 3,
        icon: 'dc-3.png',
        title: stats.requestMeetings || 0,
        subtitle: 'Request for Meetings',
      },
      {
        id: 4,
        icon: 'dc-4.png',
        title: stats.scheduleMeetings || 0,
        subtitle: 'Schedule Meeting',
      },
    ];

  return (
    <>
    {contextHolder}
    <Card className='border-gray radius-12'>
        <Row gutter={[14,14]}>
            <Col span={24}>
                <ModuleTopHeading  level={4} name='Business Statistics' />
            </Col>
            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 19}}>
                <Row gutter={[14,24]} className='h-100'>
                    {
                        cardsData?.map((item,index)=>
                            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 6}} key={index}>
                                <Card className={`shadow-d radius-12 h-100 border-gray`}>
                                    <Flex gap={8} vertical>
                                        <div>
                                            <img src={"/assets/icons/"+item?.icon} width={45}  alt="stats icon" />
                                        </div>
                                        <Text className='fs-14 text-gray'>{item?.subtitle}</Text>
                                        <Title level={5} className='fw-600 text-black m-0'>{item?.title}</Title>
                                    </Flex>
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </Col>
            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 5}}>
                <Card className={`shadow-d radius-12 h-100 border-gray`}>
                    <Flex gap={8} vertical>
                        <div>
                            <img src={"/assets/icons/dc-5.png"} width={45} alt="" />
                        </div>
                        <Text className='fs-14 text-gray'>Today's Meeting</Text>
                        <Title level={5} className='fw-600 text-black m-0'>{stats.todaysMeetings || 0}</Title>
                    </Flex>
                </Card>
            </Col>
        </Row>
    </Card>
    </>
  )
}

export {DashboardCards}