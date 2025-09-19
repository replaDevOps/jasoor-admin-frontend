import { useState,useEffect } from 'react';
import { Card, Flex, Typography} from 'antd';
import ReactApexChart from 'react-apexcharts';
import { ModuleTopHeading } from '../../PageComponents';
import { MyDatepicker } from '../../Forms';
import { GET_BUSINESS_STATS_GRAPH } from '../../../graphql/query/business'
import { useQuery } from '@apollo/client'
import { Spin } from "antd";
import moment from 'moment';

const { Title } = Typography

const BusinessListBarChart = () => {

    const [selectedYear, setSelectedYear] = useState(moment());

    const { data, loading, error, refetch } = useQuery(GET_BUSINESS_STATS_GRAPH, {
        variables: { year: selectedYear.year() }, // get year as number
      });
      const maxCount = Math.max(...(data?.getBusinessStatsGraph?.monthlyStats.map((m) => m.businessCount) || [0]));

        // Determine Y-axis max based on largest count
        let yAxisMax = 100; // default

        if (maxCount >= 1000) {
        yAxisMax = Math.ceil(maxCount / 1000) * 1000;
        } else if (maxCount >= 100) {
        yAxisMax = Math.ceil(maxCount / 100) * 100;
        } else {
        yAxisMax = 100; // for 2 digits or less
        }
    
      // Prepare chart data
      const chartData = {
        series: [
            {
              name: 'Avg. Annual Profit',
              data: data?.getBusinessStatsGraph?.monthlyStats.map((m) => m.businessCount) || Array(12).fill(0),
            },
          ],
        options: {
          chart: {
            type: 'bar',
            toolbar: { show: false },
          },
          dataLabels: { enabled: false },
          stroke: { curve: 'smooth', width: 2 },
          xaxis: {
            categories: data?.getBusinessStatsGraph?.monthlyStats.map((m) => m.month) || [
              'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
            ],
            labels: { style: { colors: '#000' } },
          },
          yaxis: {
            min: 0,
            max: yAxisMax, // or any upper bound you want for the chart
            tickAmount: 5,
            labels: {
              formatter: (value) => (value),
              style: { colors: '#000' },
            },
          },
          fill: { opacity: 1 },
          grid: { show: false },
          colors: ['#3B82F6'],
          legend: { show: true, showForSingleSeries: true },
        },
      };
    
      // Refetch when year changes
      useEffect(() => {
        refetch({ year: selectedYear.year() });
      }, [selectedYear, refetch]);

      if (loading) {
        return (
          <Flex justify="center" align="center" className='h-200'>
            <Spin size="large" />
          </Flex>
        );
      }

  return (
    <Card className='radius-12 border-gray'>
        <Flex justify='space-between' align='center' wrap gap={10}>
            <Flex vertical gap={3}>
                <ModuleTopHeading level={4} name='Business Listing Stats' />
                <Title level={4} className='fw-600 text-black m-0'>{data?.getBusinessStatsGraph?.totalBusinesses}</Title>
            </Flex>
            <Flex justify='end' gap={10}>
            <MyDatepicker
                withoutForm
                className="datepicker-cs"
                picker="year"
                placeholder="Select Year"
                value={selectedYear}
                onChange={(year) => setSelectedYear(year)}
            />
            </Flex>
        </Flex>
        <div className='w-100 h-300'>
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={'100%'}
            width={'100%'}
            className='bar-width'
          />
        </div>
      </Card>
  );
};

export { BusinessListBarChart };
