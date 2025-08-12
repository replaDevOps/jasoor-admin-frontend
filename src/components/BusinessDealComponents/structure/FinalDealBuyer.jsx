import { Button, Card, Col, Flex, Image, Row, Typography } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const { Text } = Typography
const FinalDealBuyer = () => {

    return (
        <Row gutter={[16, 24]}>
            <Col span={24}>
                {
                    ['Commercial Registration (CR).png','Notarized Ownership Transfer Letter.png']?.map((items,index)=>
                        <Card className='card-cs border-gray rounded-12 mb-3' key={index} >
                            <Flex justify='space-between' align='center'>
                                <Flex gap={15}>
                                    <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                                    <Flex vertical>
                                        <Text className='fs-13 text-gray'>
                                            {items}
                                        </Text>
                                        <Text className='fs-13 text-gray'>
                                            5.3 MB
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Image src={'/assets/icons/download.png'} preview={false} width={20} />
                            </Flex>
                        </Card>
                    )
                }
            </Col>
            <Col span={24}>
                <Flex vertical gap={10}>
                    <Flex gap={5} className='badge-cs pending fs-12 fit-content' align='center'>
                        <CheckCircleOutlined className='fs-14' /> Waiting for seller to mark the deal as "Finalized".
                    </Flex>
                    <Flex gap={5} className='badge-cs pending fs-12 fit-content' align='center'>
                        <CheckCircleOutlined className='fs-14' /> Waiting for seller to mark the deal as "Finalized".
                    </Flex>
                    <Flex>
                        <Button type="button" className='btnsave bg-gray border0 text-white'>
                            Mark Deal as Completed
                        </Button>
                    </Flex>
                </Flex>
            </Col>
        </Row>
    )
}

export {FinalDealBuyer}