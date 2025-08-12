import { Card, Flex } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { ModuleTopHeading } from '../../PageComponents';

const ListingRevenueBar = () => {


    const chartData = {
        series: [
        {
            name: 'Business Revenue',
            data: [100, 110, 150, 120, 190],
        },
        ],
        options: {
            plotOptions: {
                bar: {
                    columnWidth: '60%',
                    dataLabels: {
                        position: 'top',
                    },
                }
            },

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
            'SAR (0-50k)',
            'SAR (50k-100k)',
            'SAR (100k-250k)',
            'SAR (250k-500k)',
            'SAR (500k+)',
            ],
            labels: {
                style: {
                    colors: '#000',
                    fontSize: '11px',
                },
            },
        },
        yaxis: {
            min: 0,
            max: 400,
            tickAmount: 5,
            labels: { 
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
        colors: ['#2E2E65'],
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
        <Flex align='center' wrap gap={10}>
            <ModuleTopHeading level={4} name='Listings by Revenue' />
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

export { ListingRevenueBar };
