import { Row, Col } from 'antd'
import { ModuleTopHeading, UserManagementTable } from '../../components'
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <ModuleTopHeading level={4} name='User Management' />
                </Col>
                <Col span={24}>
                    <UserManagementTable />
                </Col>
            </Row>
        </>
    )
}

export { UserManagement }; 