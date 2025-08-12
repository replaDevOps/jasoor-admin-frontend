import { Row, Col, Flex, Button } from 'antd'
import { BusinesslistCards, BusinessListingTable, ModuleTopHeading } from '../../components'
import { PlusOutlined } from '@ant-design/icons';

const BusinesslIstingPage = () => {
    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Flex justify='space-between'>
                        <ModuleTopHeading level={4} name='Business Listing' />
                        <Button type='primary' className='btnsave'> 
                            <PlusOutlined /> Add Business
                        </Button>
                    </Flex>
                </Col>
                <Col span={24}>
                    <BusinesslistCards />
                </Col>
                <Col span={24}>
                    <BusinessListingTable />
                </Col>
            </Row>
        </>
    )
}

export { BusinesslIstingPage }; 