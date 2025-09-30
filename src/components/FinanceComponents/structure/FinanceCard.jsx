import { Card, Col, Flex, Row, Typography } from 'antd'
import { GET_FINANCE_COUNT } from '../../../graphql/query/'
import { useQuery } from '@apollo/client'
import { t } from 'i18next'

const { Title, Text } = Typography
const FinanceCard = () => {
    const { data:count, loading, error } = useQuery(GET_FINANCE_COUNT, {fetchPolicy: 'cache-and-network',});

    const data = [
        {
            id: 1,
            icon: 'totalbusinessprice.png',
            title: count?.getFinanceCount?.totalPrice
                ? `SAR ${count.getFinanceCount.totalPrice.toFixed(2)}`
                : 'SAR 0.00',
            subtitle: 'Total Businesses Price',
        },
        {
            id: 2,
            icon: 'revgen.png',
            title: count?.getFinanceCount?.revenueGenerated
                ? `SAR ${count.getFinanceCount.revenueGenerated.toFixed(2)}`
                : 'SAR 0.00',
            subtitle: 'Revenue Generated',
        },
        {
            id: 3,
            icon: 'revgen.png',
            title: count?.getFinanceCount?.thisMonthRevenue
                ? `SAR ${count.getFinanceCount.thisMonthRevenue.toFixed(2)}`
                : 'SAR 0.00',
            subtitle: 'Revenue Generated (This Month)',
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
                                    <img src={"/assets/icons/"+data?.icon} width={45} alt="icon" fetchPriority="high"/>
                                </div>
                                <Text className='fs-14 text-gray'>{t(data?.subtitle)}</Text>
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