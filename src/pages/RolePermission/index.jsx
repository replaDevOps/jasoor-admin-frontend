import { Row, Col, Flex, Button } from 'antd';
import { ModuleTopHeading, RolePermissionTable } from '../../components';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const RolePermission = () => {
  const navigate = useNavigate();
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Flex justify='space-between'>
            <ModuleTopHeading level={4} name='Role & Permissions' />
            <Button aria-labelledby='Add New Role' type='primary' className='btnsave' onClick={() => navigate('/addrolepermission')}>
              <PlusOutlined /> Add New Role
            </Button>
          </Flex>
        </Col>
        <Col span={24}>
          <RolePermissionTable/>
        </Col>
      </Row>
    </>
  )
}

export { RolePermission } 
