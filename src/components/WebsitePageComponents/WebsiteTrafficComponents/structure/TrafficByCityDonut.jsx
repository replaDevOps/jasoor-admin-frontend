import React from 'react';
import { Avatar, Card, Col, Flex, Row, Typography } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { ModuleTopHeading } from '../../../PageComponents';

const { Text } = Typography
const TrafficByCityDonut = () => {

  const chartData = {
    series: [15, 18, 20, 16, 28, 10, 12, 14, 16, 18],
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
        '#FF4C00', '#D024B1', '#FFA600', '#953DCA', '#1D4ED8',
        '#FF5C4E', '#FF3470', '#FF5C4E', '#14AE5C', '#D00000',
        '#FF822D', '#8A38F5', '#F71691'
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
      color:'#1D4ED8',
      title:'Riyadh'
    },
    {
      id:2,
      color:'#953DCA',
      title:'Makkah'
    },
    {
      id:3,
      color:'#FFA600',
      title:'Eastern'
    },
    {
      id:4,
      color:'#D024B1',
      title:'Al-Madinah'
    },
    {
      id:5,
      color:'#FF4C00',
      title:'Asir'
    },
    {
      id:6,
      color:'#D00000',
      title:'Tabuk'
    },
    {
      id:7,
      color:'#14AE5C',
      title:'Hail'
    },
    {
      id:8,
      color:'#FF5C4E',
      title:'Al-Jouf'
    },
    {
      id:9,
      color:'#FF3470',
      title:' Al-Bahah'
    },
    {
      id:10,
      color:'#FF5C4E',
      title:'Jazan'
    },
    {
      id:11,
      color:'#FF822D',
      title:'Najran'
    },
    {
      id:12,
      color:'#8A38F5',
      title:'Northern Borders'
    },
    {
      id:13,
      color:'#F71691',
      title:'Al-Qassim'
    },
  ]

  return (
    <Card className='shadow-d radius-12 h-100'>
        <Flex className='pb-2'>
            <ModuleTopHeading level={4} name='Traffic by City' />
        </Flex>
        <Row gutter={[24,24]} align={'middle'}>
            <Col span={24}>
                <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="donut"
                    width="100%"
                    height={250}
                />
            </Col>
            <Col span={24}>
                <Row gutter={[24, 16]} justify={'center'}>
                    <Col lg={{span: 12}} md={{span: 12}} xs={{span: 24}} sm={{span: 24}}>
                        {data.slice(0, 7).map((item, index) => (
                            <Flex gap={5} align='center' className='mb-3' key={index}>
                                <Avatar size={12} style={{backgroundColor: item?.color}} />
                                <Text className='fs-16 fw-500'>{item.title}</Text>
                            </Flex>
                        ))}
                    </Col>
                    <Col lg={{span: 12}} md={{span: 12}} xs={{span: 24}} sm={{span: 24}}>
                            {data.slice(7).map((item, index) => (
                                <Flex gap={5} align='center' className='mb-3' key={index}>
                                    <Avatar size={12} style={{backgroundColor: item?.color}} />
                                    <Text className='fs-16 fw-500'>{item.title}</Text>
                                </Flex>
                            ))}
                    </Col>
                </Row>
            </Col>
        </Row>
    </Card>
  );
};

export { TrafficByCityDonut };
