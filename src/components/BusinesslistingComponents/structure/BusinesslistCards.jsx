import { Card, Row, Col, Flex, Typography } from 'antd'

const { Title, Text } = Typography
const BusinesslistCards = () => {

    const data = [
        {
            id:1,
            icon:'dc-1.png',
            title:'6,784',
            subtitle:'Total Listing',
        },
        {
            id:2,
            icon:'abl.png',
            title:'678',
            subtitle:'Total Active Listing',
        },
        {
            id:3,
            icon:'pbl.png',
            title:'424',
            subtitle:'Total Pending Lisitng',
        },
    ]

    return (
        <Row gutter={[14,24]} className='h-100'>
            {
                data?.map((data,index)=>
                    <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 8}} key={index}>
                        <Card className={`shadow-d radius-12 h-100 border-gray`}>
                            <Flex gap={8} vertical>
                                <div>
                                    <img src={"/assets/icons/"+data?.icon} width={45} alt="" />
                                </div>
                                <Text className='fs-14 text-gray'>{data?.subtitle}</Text>
                                <Title level={4} className='fw-600 text-black m-0'>{data?.title}</Title>
                            </Flex>
                        </Card>
                    </Col>
                )
            }
        </Row>
    )
}

export {BusinesslistCards}