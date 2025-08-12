import { Card, Col, Flex, Image, Row, Switch, Typography } from 'antd'
import { businessstatsData, postsaleColumn, postsaleData } from '../../../data'
import { TableContent } from './TableContent'

const { Title,Text } = Typography
const BusinessStatsTab = () => {
  return (
    <Flex vertical gap={15}>
        <Card className='radius-12 border-gray w-100'>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Flex justify='space-between' align='center' gap={5}>
                        <Title level={5} className="m-0">
                            Business Stats
                        </Title>
                        <Switch 
                            size="small" defaultChecked
                        />
                    </Flex>
                </Col>
                {
                    businessstatsData?.map((stat,i)=>
                        <Col lg={{span: 8}} md={{span: 12}} sm={{span: 12}} xs={{span: 24}} key={i}>
                            <Flex gap={10}>
                                <div className='icon-pre'>
                                    <Image src={stat?.icon} preview={false} width={'100%'}  alt="" />
                                </div>
                                <Flex vertical gap={2}>
                                    <Flex gap={4}>
                                        <Title level={5} className='m-0'>
                                            {stat?.title}
                                        </Title>
                                    </Flex>
                                    <Text className='text-gray fs-13 fw-500'>
                                        {stat?.subtitle}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Col>
                    )
                }
            </Row>
        </Card>
        <Card className='radius-12 border-gray'>
            <Flex vertical gap={10}>
                <Title level={5} className='m-0'>
                    Growth Opportunity
                </Title>
                <Text className='text-gray'>
                    The café has strong potential for growth by introducing an online ordering system, partnering with food delivery apps, and expanding into nearby residential areas. Franchising or launching a second location in a busy district can further increase revenue.
                </Text>
            </Flex>
        </Card>
        <Card className='radius-12 border-gray'>
            <Flex vertical gap={10}>
                <Title level={5} className='m-0'>
                    Reason for Selling
                </Title>
                <Text className='text-gray'>
                    The owner is relocating abroad for personal reasons and is looking for a serious buyer to take over and continue the café’s success.
                </Text>
            </Flex>
        </Card>
        <Card className='radius-12 border-gray'>
            <Flex vertical gap={10}>
                <Flex justify='space-between' align='center' gap={5}>
                    <Title level={5} className="m-0">
                        Post - Sale Support
                    </Title>
                    <Switch 
                        size="small" defaultChecked
                    />
                </Flex>
                <TableContent data={postsaleData} columns={postsaleColumn} />
            </Flex>
        </Card>
    </Flex>
  )
}

export {BusinessStatsTab}