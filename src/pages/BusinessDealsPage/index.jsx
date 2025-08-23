import { Row, Col, Tabs, Card } from 'antd'
import { CompleteDealsTable, InprogressDealTable, ModuleTopHeading } from '../../components'

const BusinessDealsPage = ({setCompleteDeal}) => {

    const tabs = [
        {
            key: '1',
            label: 'In-progress Deals',
            children: <InprogressDealTable />,
        },
        {
            key: '2',
            label: 'Completed Deals',
            children: <CompleteDealsTable setCompleteDeal={setCompleteDeal} />,
        },
    ]
    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <ModuleTopHeading level={4} name='Business Deals' />
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

export { BusinessDealsPage }; 