import { Card, Col, Flex, Image, Row, Typography } from 'antd'
import { documentsData } from '../../../data'

const { Title, Text } = Typography
const DocumentTab = () => {
    return (
        <Card className='radius-12 border-gray'>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Title level={5} className='m-0'>
                        Documents
                    </Title>
                </Col>
                {
                    documentsData?.map((items,i)=>
                        <Col lg={{span:12}} md={{span:24}} sm={{span:24}} xs={{span:24}} key={i}>
                            <Card className='card-cs border-gray rounded-12 mb-2'  >
                                <Flex justify='space-between' align='center'>
                                    <Flex gap={15}>
                                        <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                                        <Flex vertical>
                                            <Text className='fs-13 text-gray'>
                                                {items?.title}
                                            </Text>
                                            <Text className='fs-13 text-gray'>
                                                5.3 MB
                                            </Text>
                                        </Flex>
                                    </Flex>
                                    <Image src={'/assets/icons/download.png'} preview={false} width={16} />
                                </Flex>
                            </Card>
                        </Col>
                    )
                }
            </Row>
        </Card>
    )
}

export {DocumentTab}