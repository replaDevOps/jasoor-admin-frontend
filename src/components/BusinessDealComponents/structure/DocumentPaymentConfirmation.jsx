import React from 'react'
import { Button, Card, Col, Flex, Image, Row, Typography } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const { Text } = Typography
const DocumentPaymentConfirmation = () => {

    const data = [
        {
            title:'',
            subtitle:'Business Transaction Receipt',
        },
        {
            title:'Updated Commercial Registration (CR)',
            subtitle:'Commercial Registration (CR).png',
        },
        {
            title:'Notarized Ownership Transfer Letter',
            subtitle:'Notarized Ownership Transfer Letter.png',
        },
    ]

    return (
        <Row gutter={[16, 24]}>
            {
                data?.map((list,index)=>
                    <Col span={24} key={index}>
                        <Text className='fw-600 text-medium-gray fs-13'>{list?.title}</Text>
                        <Card className='card-cs border-gray rounded-12 mt-2' >
                            <Flex justify='space-between' align='center'>
                                <Flex gap={15}>
                                    <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                                    <Flex vertical>
                                        <Text className='fs-13 text-gray'>
                                            {list?.subtitle}
                                        </Text>
                                        <Text className='fs-13 text-gray'>
                                            5.3 MB
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Image src={'/assets/icons/download.png'} preview={false} width={20} />
                            </Flex>
                        </Card>
                    </Col>
                )
            }
            <Col span={24}>
                <Flex vertical gap={10}>
                    <Flex gap={5} className='badge-cs success fs-12 fit-content' align='center'>
                        <CheckCircleOutlined className='fs-14' /> Seller marked "Payment Received"
                    </Flex>
                    <Flex>
                        <Button type="primary" className='btnsave bg-brand'>
                            Mark as Verified
                        </Button>
                    </Flex>
                </Flex>
            </Col>
        </Row>
    )
}

export {DocumentPaymentConfirmation}