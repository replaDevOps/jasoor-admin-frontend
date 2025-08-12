import React, { useState } from 'react';
import { Card, Flex, Typography} from 'antd';
import ReactApexChart from 'react-apexcharts';
import { ModuleTopHeading } from '../../PageComponents';
import { MyDatepicker } from '../../Forms';

const { Title } = Typography

const BusinessListBarChart = () => {

    const [dateRange, setDateRange] = useState();

    const chartData = {
        series: [
        {
            name: 'Avg. Annual Profit',
            data: [0, 13, 17, 10, 15, 16, 25,14,17,24,26,30],
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
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'July',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
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

  return (
    <Card className='radius-12 border-gray'>
        <Flex justify='space-between' align='center' wrap gap={10}>
            <Flex vertical gap={3}>
                <ModuleTopHeading level={4} name='Business Listing Stats' />
                <Title level={4} className='fw-600 text-black m-0'>6,784</Title>
            </Flex>
            <Flex justify='end' gap={10}>
                <MyDatepicker 
                    withoutForm
                    rangePicker
                    className='datepicker-cs'
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates)}
                />
            </Flex>
        </Flex>
        <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={300}
        />
      </Card>
  );
};

export { BusinessListBarChart };
