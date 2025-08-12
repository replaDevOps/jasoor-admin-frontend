import React from 'react'
import { Row, Col, Flex, Card, Typography } from 'antd'
import { ModuleTopHeading } from '../../components'
import { alertsData } from '../../data'
const {Text, Title} = Typography;
const Alerts = () => {
    return (
        <>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <ModuleTopHeading level={4} name='Alerts' />
                </Col>
                <Col span={24}>
                    <Card className='overflow-style'>
                       {
                        alertsData?.map((alert, index) =>(
                             <Flex vertical className='mt-2' key={index}>
                            <Text>{alert?.date}</Text>
                            {
                                    alert?.alertsdetails.map((details, i) => (
                                        <Flex vertical className='mt-2' gap={4} style={{marginLeft: 15}} key={i}>
                                            <Flex  justify='space-between' >
                                                <Title level={5} className='m-0 fw-500'> {details?.title}</Title>
                                                <Text className='text-gray fs-12'> {details?.time}</Text>
                                            </Flex>
                                            <Text className='text-justify text-gray'>
                                                {details?.desc}
                                            </Text>
                                        </Flex>
                                    ))
                                }
                        </Flex>
                        ))
                       }
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export { Alerts } 
