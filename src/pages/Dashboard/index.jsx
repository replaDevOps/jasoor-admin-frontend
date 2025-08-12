import { Col, Flex, Row, Typography } from 'antd'
import { BusinessCategoryDonut, BusinessListBarChart, DashboardCards, ListingPriceBar, ListingRevenueBar } from '../../components'

const { Text, Title } = Typography
const Dashboard = () => {
  return (
    <div>
      <Flex vertical gap={24}>
        <Flex vertical gap={2}>
          <Text className='text-gray fs-13'>Thursday, 20th, July</Text>
          <Title level={3} className='m-0'>Hi Abdullah!</Title>
        </Flex>
        <DashboardCards />
        <BusinessListBarChart />
        <Row gutter={[24,24]}>
          <Col lg={{span:12}} xs={{span: 24}} sm={{span: 24}} md={{span: 24}}>
            <ListingPriceBar />
          </Col>
          <Col lg={{span:12}} xs={{span: 24}} sm={{span: 24}} md={{span: 24}}>
            <ListingRevenueBar />
          </Col>
        </Row>
        <BusinessCategoryDonut />
      </Flex>
    </div>
  )
}

export {Dashboard}