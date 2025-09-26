import { useEffect, useState } from "react";
import { Avatar, Card, Col, Flex, Row, Typography } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { ModuleTopHeading } from '../../../PageComponents';
import axios from "axios";

const { Text } = Typography
const TrafficByCityDonut = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [labelData, setLableData] = useState([]);
  const colorPalette = [
    '#FF4C00', '#D024B1', '#FFA600', '#953DCA', '#1D4ED8',
    '#FF5C4E', '#FF3470', '#14AE5C', '#D00000',
    '#FF822D', '#8A38F5', '#F71691', '#00BFFF',
    '#32CD32', '#FF1493', '#FFD700'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("https://verify.jusoor-sa.co/api/trefficbycity");
        if (data.success) {
          setSeriesData(data.data.series);
          setLableData(data.data.labels);
        }
      } catch (err) {
        console.error("Failed to load traffic by city:", err);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    series: seriesData,
    options: {
      chart: {
        type: 'donut',
      },
      labels: labelData,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      legend: {
        show: false,
      },
      colors: colorPalette.slice(0, labelData?.length),
      plotOptions: {
        pie: {
          donut: {
            size: '40%',
          },
        },
      },
    },
  };

  const data = labelData.map((title, idx) => ({
    id: idx + 1,
    color: colorPalette[idx % colorPalette.length],
    title,
  }));

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
