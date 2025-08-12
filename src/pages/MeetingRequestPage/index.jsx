import { Row, Col, Tabs, Card } from 'antd'
import { MeetingReqCards, MeetingRequestTable, ModuleTopHeading, ScheduleMeetingTable } from '../../components'

const MeetingRequestPage = () => {

    const tabs = [
        {
            key: '1',
            label: 'Meeting Requests',
            children: <MeetingRequestTable />,
        },
        {
            key: '2',
            label: 'Schedule Meetings',
            children: <ScheduleMeetingTable />,
        },
    ]
    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <ModuleTopHeading level={4} name='Meeting Requests' />
                </Col>
                <Col span={24}>
                    <MeetingReqCards />
                </Col>
                <Col span={24}>
                    <Card className='radius-12 border-gray'>
                        <Tabs 
                            className='tabs-fill'
                            defaultActiveKey="1" 
                            items={tabs}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export { MeetingRequestPage }; 