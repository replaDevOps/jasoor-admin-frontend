import React from 'react'
import { Button, Card, Checkbox, Col, Flex, Image, Row, Typography } from 'antd'

const { Text } = Typography
const DigitalSaleAgreement = ({form,completedeal}) => {

    return (
        <Row gutter={[16, 24]}>
            <Col span={24}>
                <Flex vertical gap={0} className='mb-3'>
                    <Text className='fw-600 fs-14'>Downloads Digital Sale Agreement</Text>
                    <Text className='fs-13 text-gray'>
                        This agreement outlines the final terms of the business transfer. Please review the details carefully before proceeding.
                    </Text>
                </Flex>
                <Card className='card-cs border-gray rounded-12' >
                    <Flex justify='space-between' align='center'>
                        <Flex gap={15}>
                            <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                            <Flex vertical>
                                <Text className='fs-13 text-gray'>
                                    Digital Sale Agreement.pdf
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
                <Flex vertical gap={3}>
                    <Checkbox className='fit-content'>
                        I confirm the business details are correct.
                    </Checkbox>
                    <Checkbox className='fit-content'>
                        I accept the terms of the agreement and agree to proceed.
                    </Checkbox>
                </Flex>
            </Col>
            {/* <>
                {
                    !completedeal && (
                        <>
                            <Col span={24}>
                                <Flex vertical gap={3}>
                                    <Checkbox>
                                        I have read and agree to the terms of the sale agreement.
                                    </Checkbox>
                                    <Checkbox>
                                        I agree to pay the Jusoor platform commission.
                                    </Checkbox>
                                </Flex>
                            </Col>
                            <Col span={24}>
                                <Flex>
                                    <Button type="primary" className='btn bg-brand'>
                                        Mark as Accepted
                                    </Button>
                                </Flex>
                            </Col>
                        </>
                    )
                }
            </> */}
        </Row>
    )
}

export {DigitalSaleAgreement}