import { Col, Flex, Row, Typography } from 'antd'
import { BusinessCategoryDonut, BusinessListBarChart, DashboardCards, ListingPriceBar, ListingRevenueBar } from '../../components'
import { useQuery } from '@apollo/client';
import { ME } from '../../graphql/query'
import { t } from 'i18next';

const { Text, Title } = Typography
const Dashboard = () => {
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  
  const today = new Date().toLocaleDateString('en-US', options); 

  const userId = localStorage.getItem("userId"); 
  const { data, loading:isLoading, refetch } = useQuery(ME, {
    variables: { getUserId:userId },
    skip: !userId,
    fetchPolicy: "network-only",
  });
  
  return (
    <div>
      <Flex vertical gap={24}>
        <Flex vertical gap={2}>
          <Text className='text-gray fs-13'>{today}</Text>
          <Title level={3} className='m-0'>{t("Hi")}  {data?.getUser?.name}!</Title>
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