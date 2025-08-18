import React, { useState } from 'react';
import { Card, Flex, Typography, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { yearOp } from '../../../shared';
import { ModuleTopHeading } from '../../PageComponents';
import {GET_FINANCE_GRAPH} from '../../../graphql/query';
import { useQuery } from '@apollo/client';

const { Title } = Typography;

const FinanceAreaChart = () => {
  const [selectedStatus, setSelectedStatus] = useState('2025');

  const { data, loading, error } = useQuery(GET_FINANCE_GRAPH, {
    variables: { year: Number(selectedStatus) },
    fetchPolicy: 'cache-and-network',
  });

  const handleStatusClick = ({ key }) => {
    const selectedItem = yearOp.find(item => item.key === key);
    if (selectedItem) {
      setSelectedStatus(selectedItem.label);
    }
  };

  const chartData = {
    series: [
      {
        name: 'Revenue',
        data: data?.getRenenueGraph?.map(item => Number(item.revenue.toFixed(2))) || Array(12).fill(0),
      },
    ],
    options: {
      chart: {
        type: 'area',
        toolbar: { show: false },
      },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.05, stops: [0, 100] },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: { style: { colors: '#000' } },
      },
      yaxis: { labels: { formatter: val => `${val}k`, style: { colors: '#000' } } },
      markers: { size: 4, colors: ['#2563EB'], strokeWidth: 2, strokeColors: '#fff', hover: { size: 6 } },
      tooltip: { y: { formatter: val => `SAR ${val}` } },
      grid: { borderColor: '#eee', strokeDashArray: 4 },
      colors: ['#2563EB'],
      legend: { show: false },
    },
  };

    return (
        <Card className='radius-12 border-gray'>
            <Flex justify='space-between' align='center' wrap gap={10}>
                <Flex vertical gap={3}>
                    <ModuleTopHeading level={4} name='Revenue' />
                    <Title level={4} className='fw-600 text-black m-0'>SAR 120,784</Title>
                </Flex>
                <Dropdown
                    menu={{
                        items: yearOp,
                        onClick: handleStatusClick,
                    }}
                    trigger={['click']}
                >
                    <Button className="btncancel px-3 filter-bg fs-13 text-black">
                        <Flex justify='space-between' align='center' gap={30}>
                            {selectedStatus}
                            <DownOutlined />
                        </Flex>
                    </Button>
                </Dropdown>
            </Flex>
            <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="area"
                height={260}
            />
        </Card>
    );
};

export { FinanceAreaChart };
