import React from 'react'
import { Card, Col, Flex, Row, Typography } from 'antd'
import { ModuleTopHeading } from '../../../PageComponents'

const { Title, Text } = Typography
const WebsiteTrafficCards = () => {

    const data = [
        {
            id:1,
            icon:'totalvisitor.png',
            title:'784',
            subtitle:'Total Visitors (Last 7 days)',
        },
        {
            id:2,
            icon:'returnvisitor.png',
            title:'424',
            subtitle:'Returning Visitors',
        },
        {
            id:3,
            icon:'avgsession.png',
            title:'8m 22s',
            subtitle:'Avg. Session Duration',
        },
        {
            id:4,
            icon:'desktopuser.png',
            title:'56%',
            subtitle:'Desktop Users',
        },
    ]


  return (
    <Card className='border-gray radius-12'>
        <Row gutter={[14,14]}>
            <Col span={24}>
                <ModuleTopHeading  level={4} name='Traffic Insights' />
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
                            <img src={"/assets/icons/mobileuser.png"} width={45} alt="" />
                        </div>
                        <Text className='fs-14 text-gray'>Mobile Users</Text>
                        <Title level={5} className='fw-600 text-black m-0'>44%</Title>
                    </Flex>
                </Card>
            </Col>
        </Row>
    </Card>
  )
}

export {WebsiteTrafficCards}