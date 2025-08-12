import React, { useState } from 'react';
import { Card, Flex, Typography} from 'antd';
import ReactApexChart from 'react-apexcharts';
import { ModuleTopHeading } from '../../../PageComponents';
import { MyDatepicker } from '../../../Forms';

const { Title } = Typography

const WebsiteVisitBarChart = () => {

    const [dateRange, setDateRange] = useState();

    const chartData = {
        series: [
        {
            name: 'No. of Website Visitors',
            data: [15, 16, 25,14,17,24,30],
        },
        ],
        options: {
        chart: {
            type: 'bar',
            toolbar:{
                show: false,
            }
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        xaxis: {
            categories: [
            '11/02/2025',
            '12/02/2025',
            '13/02/2025',
            '14/02/2025',
            '15/02/2025',
            '16/02/2025',
            '17/02/2025',
            ],
            labels: {
            style: {
                colors: '#000',
            },
            },
        },
        yaxis: {
            min: 0,
            max: 25,
            tickAmount: 5,
            labels: { 
                formatter: function (value) {
                return value + 'K';
                },
            style: {
                colors: '#000',
            },
            },
        },
        fill: {
            opacity: 1,
        },
        grid: {
            show: false,
        },
        colors: ['#3B82F6'],
        legend: {
            show: true,
            showForSingleSeries: true,
            // markers:{
            //     shape: "circle"
            // }
        },
        },
    };

    const onChange = (date) => {
        setDateRange(date?.format('YYYY-MM-DD'));
    };

  return (
    <Card className='radius-12 border-gray'>
        <Flex justify='space-between' align='center' wrap gap={10}>
            <Flex vertical gap={3}>
                <ModuleTopHeading level={4} name='Website Visits' />
                <Title level={4} className='fw-600 text-black m-0'>6,784</Title>
            </Flex>
            <Flex justify='end' gap={10}>
                <MyDatepicker 
                    datePicker
                    withoutForm
                    className='datepicker-cs'
                    value={dateRange}
                    onChange={onChange}
                />
            </Flex>
        </Flex>
        <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={250}
        />
      </Card>
  );
};

export { WebsiteVisitBarChart };
