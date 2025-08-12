import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography } from 'antd'
import { buyerdealsData, inprogressdealData } from '../../../data'
import { useNavigate, useParams } from 'react-router-dom'
import { SingleInprogressSteps } from './SingleInprogressSteps'

const { Title, Text } = Typography
const BusinessDealsDetails = () => {

    const {id} = useParams();
    const navigate = useNavigate()
    const details = inprogressdealData?.find((item) => item.key == id);
 
    return (
        <Flex vertical gap={20}>
            <Flex vertical gap={25}>
                <Breadcrumb
                    separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                    items={[
                        {
                            title: <Text className='fs-13 text-gray cursor' onClick={() => navigate('/businessdeal')}>Business Deals</Text>,
                        },
                        {
                            title: <Text className='fw-500 fs-13 text-black'>{details?.businessTitle}</Text>,
                        },
                    ]}
                />
            </Flex>
            <Flex justify='space-between' align='center'>
                <Flex gap={15} align='center'>
                    <Button className='border0 p-0 bg-transparent' onClick={() => navigate('/businessdeal')}>
                        <ArrowLeftOutlined />
                    </Button>
                    <Title level={4} className='m-0'>
                        {details?.businessTitle}
                    </Title>
                </Flex>
                <Button type='button' className='btnsave border0 text-white bg-red'>
                    Cancel Deal
                </Button>
            </Flex>
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={40}>
                    <div className='deals-status'>
                        <Row gutter={[16, 16]}>
                            {
                                buyerdealsData?.map((list,index)=>
                                    <Col xs={24} sm={12} md={6} lg={6} key={index}>
                                        <Flex vertical gap={3}>
                                            <Text className='text-gray fs-14'>{list?.title}</Text>
                                            {
                                            (list?.title === 'Status') ? (
                                                list.desc === 'In-progress' ?
                                                <Text className='brand-bg text-white fs-12 sm-pill'>{list?.desc}</Text>:
                                                <Text className='bg-green fs-12 sm-pill'>{list?.desc}</Text>
                                            ) : (
                                                <Text className='fs-15 fw-500'>{list?.desc}</Text>
                                            )}
                                        </Flex>
                                    </Col>
                                )
                            }
                        </Row>
                    </div>
                    <SingleInprogressSteps />
                </Flex>
            </Card>
        </Flex>
    )
}

export {BusinessDealsDetails}