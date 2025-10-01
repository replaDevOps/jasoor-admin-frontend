import React, { useEffect, useState } from "react";
import { Card, Flex, Typography,DatePicker } from "antd";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import dayjs from "dayjs";
import { t } from "i18next";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const WebsiteVisitBarChart = () => {
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(7, "day"),
        dayjs(),
    ]);
    const [labels, setLabels] = useState([]);
    const [series, setSeries] = useState([]);
    const [totalVisitors, setTotalVisitors] = useState(0);

    const fetchData = async (startDate, endDate) => {
        try {
          const { data } = await axios.get(
            `https://verify.jusoor-sa.co/api/analytics?start=${startDate}&end=${endDate}`
          );
          if (data.success) {
            const apiLabels = data.data.labels || [];
            const apiSeries = data.data.series || [];
          
            // Convert API into a map { "DD/MM/YYYY": value }
            const seriesMap = apiLabels.reduce((acc, label, i) => {
              acc[label] = apiSeries[i];
              return acc;
            }, {} );
          
            // Generate full date range
            const start = dayjs(startDate);
            const end = dayjs(endDate);
            const allLabels = [];
            const allSeries = [];
          
            let current = start.clone();
            while (current.isBefore(end) || current.isSame(end)) {
              const formatted = current.format("DD/MM/YYYY");
              allLabels.push(formatted);
              allSeries.push(seriesMap[formatted] || 0); // ✅ fill 0 if missing
              current = current.add(1, "day");
            }
          
            setLabels(allLabels);
            setSeries(allSeries);
            setTotalVisitors(allSeries.reduce((a, b) => a + b, 0));
          }
          
        } catch (err) {
          console.error("Failed to load analytics:", err);
        }
      };

  // ✅ Load initial data with default date range
  useEffect(() => {
    const start = dateRange[0].format("YYYY-MM-DD");
    const end = dateRange[1].format("YYYY-MM-DD");
    fetchData(start, end);
  }, []);


  // ✅ Handle date change
  const onChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
      const start = dates[0].format("YYYY-MM-DD");
      const end = dates[1].format("YYYY-MM-DD");
      fetchData(start, end);
    }
  };

  const chartData = {
    series: [
      {
        name: t("No. of Website Visitors"),
        data: series,
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      xaxis: {
        categories: labels,
        labels: {
          style: { colors: "#000" },
        },
      },
      yaxis: {
        min: 0,
        tickAmount: 5,
        labels: {
          formatter: function (value) {
            return value.toString();
          },
          style: { colors: "#000" },
        },
      },
      fill: { opacity: 1 },
      grid: { show: false },
      colors: ["#3B82F6"],
      legend: {
        show: true,
        showForSingleSeries: true,
      },
    },
  };

  return (
    <Card className="radius-12 border-gray">
      <Flex justify="space-between" align="center" wrap gap={10}>
        <Flex vertical gap={3}>
          <Title level={4} className="fw-600 text-black m-0">
            {t("Website Visits")}
          </Title>
          <Title level={4} className="fw-600 text-black m-0">
            {totalVisitors.toLocaleString()}
          </Title>
        </Flex>
        <Flex justify="end" gap={10}>
           <RangePicker
            className="datepicker-cs"
            value={dateRange}
            onChange={onChange}
            format="YYYY-MM-DD"
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
