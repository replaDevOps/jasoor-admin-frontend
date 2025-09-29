import { Card, Col, Flex, Row, Typography } from 'antd'
import { ModuleTopHeading } from '../../../PageComponents'
import axios from "axios";
import { useEffect, useState } from "react";

const { Title, Text } = Typography
const WebsiteTrafficCards = () => {

    const [stats, setStats] = useState({
    totalVisitors: 0,
    returningVisitors: 0,
    avgSession: "0s",
    desktopUsers: "0%",
    mobileUsers: "0%",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://verify.jusoor-sa.co/api/trefficinsights`
        );

        if (data.success) {
          const records = data.data;
          setStats({
            totalVisitors: records?.totalVisitors,
            returningVisitors: records?.returningVisitors,
            avgSession: `${records?.avgSession} min`,
            desktopUsers: `${records?.desktopUsers}%`,
            mobileUsers: `${records?.mobileUsers}%`,
          });
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
      }
    };

    fetchData();
  }, []);

  const data = [
    {
      id: 1,
      icon: "totalvisitor.png",
      title: stats.totalVisitors,
      subtitle: "Total Visitors",
    },
    {
      id: 2,
      icon: "returnvisitor.png",
      title: stats.returningVisitors,
      subtitle: "Returning Visitors",
    },
    {
      id: 3,
      icon: "avgsession.png",
      title: stats.avgSession,
      subtitle: "Avg. Session Duration",
    },
    {
      id: 4,
      icon: "desktopuser.png",
      title: stats.desktopUsers,
      subtitle: "Desktop Users",
    },
  ];


  return (
    <Card className='border-gray radius-12'>
        <Row gutter={[14,14]}>
            <Col span={24}>
                <ModuleTopHeading  level={4} name='Traffic Insights' />
            </Col>
            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 19}}>
                <Row gutter={[14,24]} className='h-100'>
                    {
                        data?.map((data,index)=>
                            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 6}} key={index}>
                                <Card className={`shadow-d radius-12 h-100 border-gray`}>
                                    <Flex gap={8} vertical>
                                        <div>
                                            <img src={"/assets/icons/"+data?.icon} width={45} alt="icon" fetchPriority="high"/>
                                        </div>
                                        <Text className='fs-14 text-gray'>{data?.subtitle}</Text>
                                        <Title level={5} className='fw-600 text-black m-0'>{data?.title}</Title>
                                    </Flex>
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </Col>
            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 5}}>
                <Card className={`shadow-d radius-12 h-100 border-gray`}>
                    <Flex gap={8} vertical>
                        <div>
                            <img src={"/assets/icons/mobileuser.png"} width={45} alt="user icon" fetchPriority="high"/>
                        </div>
                        <Text className='fs-14 text-gray'>Mobile Users</Text>
                        <Title level={5} className='fw-600 text-black m-0'>{stats.mobileUsers}</Title>
                    </Flex>
                </Card>
            </Col>
        </Row>
    </Card>
  )
}

export {WebsiteTrafficCards}