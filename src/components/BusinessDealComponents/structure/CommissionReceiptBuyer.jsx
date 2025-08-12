import React from 'react'
import { Button, Card, Col, Flex, Image, Row, Typography } from 'antd'

const { Text } = Typography
const CommissionReceiptBuyer = () => {

    return (
        <Row gutter={[16, 24]}>
            <Col span={24}>
                <Text className='fs-14 text-gray'>
                    Jasoor’s Commission bank statement or screenshot
                </Text>
                <Card className='card-cs border-gray rounded-12' >
                    <Flex justify='space-between' align='center'>
                        <Flex gap={15}>
                            <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                            <Flex vertical>
                                <Text className='fs-13 text-gray'>
                                    Business Transaction Receipt .pdf
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
            <Col span={24}>
                <Flex>
                    <Button type="primary" className='btnsave bg-brand'>
                        Mark as Verified
                    </Button>
                </Flex>
            </Col>
        </Row>
    )
}

export {CommissionReceiptBuyer}