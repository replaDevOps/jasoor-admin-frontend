import { Card, Col, Flex, Row, Typography } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { ModuleTopHeading } from '../../PageComponents';
import { GET_BUSINESS_CATEGORY_COUNT } from '../../../graphql/query/business'
import { useQuery } from '@apollo/client'
import { Spin } from "antd";

const { Text } = Typography
const BusinessCategoryDonut = () => {
  const { data:categoryData, loading, error } = useQuery(GET_BUSINESS_CATEGORY_COUNT);
  const chartData = {
    series: categoryData?.getCountByEachCategory.map((item) => item.count) || [],
    options: {
      chart: {
        type: 'donut',
      },
      labels: [
        'Restaurants & Cafes',
        'Retail Services',
        'Health, Beauty & Fitness',
        'Tech & Software',
        'Digital Businesses',
        'Education Services',
        'Consulting & Professional Services',
        'Real Estate & Construction',
        'Industrial Businesses',
        'Automotive, & Logistics',
      ],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      legend: {
        show: false,
      },
      colors: [
        '#FF822D', '#FFA600', '#FF4D00', '#D00000', '#1D4ED8',
        '#FF5C4E', '#FF3470', '#F71691', '#D024B1', '#953DCA'
      ],
      plotOptions: {
        pie: {
          donut: {
            size: '40%',
          },
        },
      },
    },
  };

  const data = [
    {
      id:1,
      icon:'rc.png',
      title:'Restaurants & Cafes'
    },
    {
      id:2,
      icon:'rs.png',
      title:'Retail Services'
    },
    {
      id:3,
      icon:'hbf.png',
      title:'Health, Beauty & Fitness'
    },
    {
      id:4,
      icon:'ts.png',
      title:'Tech & Software'
    },
    {
      id:5,
      icon:'db.png',
      title:'Digital Businesses'
    },
    {
      id:6,
      icon:'es.png',
      title:'Education Services'
    },
    {
      id:7,
      icon:'cps.png',
      title:'Consulting & Professional Services'
    },
    {
      id:8,
      icon:'rec.png',
      title:'Real Estate & Construction'
    },
    {
      id:9,
      icon:'ib.png',
      title:'Industrial Businesses'
    },
    {
      id:10,
      icon:'al.png',
      title:'Automotive, & Logistics'
    },
  ]

  if (loading) {
          return (
            <Flex justify="center" align="center" className='h-200'>
              <Spin size="large" />
            </Flex>
         );
      }

  return (
    <div>
      <Card className='shadow-d radius-12'>
        <Flex className='pb-2'>
          <ModuleTopHeading level={4} name='Business Categories' />
        </Flex>
        <Row gutter={[24,24]} align={'middle'}>
          <Col lg={{span: 10}} md={{span: 24}} xs={{span: 24}} sm={{span: 24}}>
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="donut"
              width="100%"
              height={300}
            />
          </Col>
          <Col lg={{span: 14}} md={{span: 24}} xs={{span: 24}} sm={{span: 24}}>
            <Row gutter={[16, 16]}>
              <Col lg={{span: 12}} md={{span: 12}} xs={{span: 24}} sm={{span: 24}}>
                {data.slice(0, 5).map((item, index) => (
                  <Flex gap={5} align='center' className='mb-3' key={index}>
                    <img src={"/assets/icons/categoryicons/" + item.icon} width={24} alt="category icon" fetchPriority="high" />
                    <Text className='fs-16 fw-500'>{item.title}</Text>
                  </Flex>
                ))}
              </Col>
              <Col lg={{span: 12}} md={{span: 12}} xs={{span: 24}} sm={{span: 24}}>
                {data.slice(5).map((item, index) => (
                  <Flex gap={5} align='center' className='mb-3' key={index}>
                    <img src={"/assets/icons/categoryicons/" + item.icon} width={24} alt="category icon" fetchPriority="high"/>
                    <Text className='fs-16 fw-500'>{item.title}</Text>
                  </Flex>
                ))}
              </Col>
            </Row>
          </Col>
        </Row>
        
      </Card>
    </div>
  );
};

export { BusinessCategoryDonut };
