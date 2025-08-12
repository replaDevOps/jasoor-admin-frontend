import { Card, Col, Flex, Row, Typography } from 'antd'
import { ModuleTopHeading } from '../../PageComponents'

const { Title, Text } = Typography
const FinanceCard = () => {

    const data = [
        {
            id:1,
            icon:'totalbusinessprice.png',
            title:'SAR 2,209,456,865',
            subtitle:'Total Businesses Price',
        },
        {
            id:2,
            icon:'revgen.png',
            title:'SAR 36,784,000',
            subtitle:'Revenue Generated',
        },
        {
            id:3,
            icon:'revgen.png',
            title:'SAR 4240',
            subtitle:'Revenue Generated (This Month)',
        },
    ]


    return (
        <Row gutter={[14,14]}>
            {
                data?.map((data,index)=>
                    <Col span={24} md={{span: 12}} lg={{span: 8}} key={index}>
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
    )   
}

export {FinanceCard}