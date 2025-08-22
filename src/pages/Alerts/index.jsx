import React from 'react'
import { Row, Col, Flex, Card, Typography } from 'antd'
import { ModuleTopHeading } from '../../components'
import {GET_ALERTS} from '../../graphql/query'
import { MARK_AS_READ } from '../../graphql/mutation';
import { useMutation,useQuery } from '@apollo/client';
import { Spin } from "antd";

const {Text, Title} = Typography;
const Alerts = () => {
    const userId = localStorage.getItem("userId"); 
    const { data, loading, refetch } = useQuery(GET_ALERTS, {
        variables: { userId },
        skip: !userId,
        fetchPolicy: "network-only",
    });

    const [markAsRead] = useMutation(MARK_AS_READ, refetch() );
    
      // Mark single notification as read
      const handleMarkAsRead = (id) => {
        markAsRead({ variables: { markNotificationAsReadId: id } });
      };
    if (loading) {
            return (
                <Flex justify="center" align="center" style={{ height: "200px" }}>
                    <Spin size="large" />
                </Flex>
            );
        }
    const alertsData = data?.getAlerts?.map((day, index) => ({
        key: index,
        date: new Date(day.time).toLocaleDateString(), // format like '02/07/2025'
        alertsdetails: day.notifications.map((notif, i) => ({
            key: i,
            title: notif.name || 'Notification',
            desc: notif.message,
            time: new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            id: notif.id,
            isRead: notif.isRead,
        })),
        })) || [];
    return (
        <>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <ModuleTopHeading level={4} name='Alerts' />
                </Col>
                <Col span={24}>
                    <Card className='overflow-style'>
                       {
                        alertsData?.map((alert, index) =>(
                             <Flex vertical className='mt-2' key={index}>
                            <Text>{alert?.date}</Text>
                            {
                                    alert?.alertsdetails.map((details, i) => (
                                        <Flex vertical className='mt-2' gap={4} style={{marginLeft: 15}} key={i}>
                                            <Flex  justify='space-between' >
                                                <Title level={5} className='m-0 fw-500'> {details?.title}</Title>
                                                <Text className='text-gray fs-12'> {details?.time}</Text>
                                            </Flex>
                                            <Text className='text-justify text-gray'>
                                                {details?.desc}
                                            </Text>
                                        </Flex>
                                    ))
                                }
                        </Flex>
                        ))
                       }
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export { Alerts } 
