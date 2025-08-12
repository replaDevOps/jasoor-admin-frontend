import { Col, Flex, Row, Typography } from 'antd'
import { FinanceAreaChart, FinanceCard, FinanceTable, TopPagesTable, TrafficByCityDonut, WebsiteVisitBarChart } from '../../components'

const { Title } = Typography
const FinancePage = () => {
  return (
    <div>
        <Flex vertical gap={24}>
            <Flex vertical gap={2}>
                <Title level={4} className='m-0'>Finance</Title>
            </Flex>
            <FinanceCard />
            <FinanceAreaChart />
            <FinanceTable />
        </Flex>
    </div>
  )
}

export {FinancePage}