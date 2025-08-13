import React, { useState } from 'react';
import { Card, Flex, Typography} from 'antd';
import ReactApexChart from 'react-apexcharts';
import { ModuleTopHeading } from '../../PageComponents';
import { GET_BUSINESS_PRICE_TIER } from '../../../graphql/query/business'
import { useQuery } from '@apollo/client'
import { message,Spin } from "antd";

const { Title } = Typography
const ListingPriceBar = () => {
    const { data, loading, error } = useQuery(GET_BUSINESS_PRICE_TIER);
  
    // Prepare chart series and categories dynamically
    const counts = data?.getBusinessByPriceTier.map((item) => item.count) || [];
    const categories = data?.getBusinessByPriceTier.map((item) => item.priceTier) || [];
  
    // Optionally calculate dynamic Y-axis max
    const maxCount = Math.max(...counts, 10); // fallback to 10 if all zero
    const yAxisMax = Math.ceil(maxCount / 10) * 10; // round up to nearest 10 for nice scale
  
    const chartData = {
        series: [
        { name: 'Business Price', data:counts  }],
        options: {plotOptions: { bar: { columnWidth: '60%', dataLabels: { position: 'top', }, } },
        chart: { type: 'bar', toolbar:{ show: false,  } },
        dataLabels: {  enabled: false, },
        stroke: { curve: 'smooth',  width: 2, },
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
                },
              style: { colors: '#000', fontSize: '11px' },
            },
          },
        yaxis: {
            min: 0,
            max: yAxisMax,
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

    if (loading) {
        return (
          <Flex justify="center" align="center" style={{ height: 200 }}>
            <Spin size="large" />
          </Flex>
       );
    }

  return (
    <Card className='radius-12 border-gray'>
        <Flex align='center' wrap gap={10}>
            <ModuleTopHeading level={4} name='Listings by Price Tier' />
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

export { ListingPriceBar };
