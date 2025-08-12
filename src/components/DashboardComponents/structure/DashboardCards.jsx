import React from 'react'
import { Card, Col, Flex, Image, Row, Typography } from 'antd'
import { ModuleTopHeading } from '../../PageComponents'

const { Title, Text } = Typography
const DashboardCards = () => {

    const data = [
        {
            id:1,
            icon:'dc-1.png',
            title:'6,784',
            subtitle:'Total Businesses',
        },
        {
            id:2,
            icon:'dc-2.png',
            title:'424',
            subtitle:'Completed Deals',
        },
        {
            id:3,
            icon:'dc-3.png',
            title:'28',
            subtitle:'Request for Meetings',
        },
        {
            id:4,
            icon:'dc-4.png',
            title:'17',
            subtitle:'Schedule Meeting',
        },
    ]


  return (
    <Card className='border-gray radius-12'>
        <Row gutter={[14,14]}>
            <Col span={24}>
                <ModuleTopHeading  level={4} name='Business Statistics' />
            </Col>
            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 19}}>
                <Row gutter={[14,24]} className='h-100'>
                    {
                        data?.map((data,index)=>
                            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 6}} key={index}>
                                <Card className={`shadow-d radius-12 h-100 border-gray`}>
                                    <Flex gap={8} vertical>
                                        <div>
                                            <img src={"/assets/icons/"+data?.icon} width={45} alt="" />
                                        </div>
                                        <Text className='fs-14 text-gray'>{data?.subtitle}</Text>
                                        <Title level={5} className='fw-600 text-black m-0'>{data?.title}</Title>
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
                        <Text className='fs-14 text-gray'>Schedule Meeting</Text>
                        <Title level={5} className='fw-600 text-black m-0'>17</Title>
                    </Flex>
                </Card>
            </Col>
        </Row>
    </Card>
  )
}

export {DashboardCards}