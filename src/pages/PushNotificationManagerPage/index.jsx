import { useState } from 'react';
import { Row, Col, Button, Flex } from 'antd';
import { AddNotification, DeleteModal, ModuleTopHeading, PushNotificationTable } from '../../components';
import { PlusOutlined } from '@ant-design/icons';
import { t } from 'i18next';

const PushNotificationManagerPage = () => {

    const [ visible, setVisible ] = useState(false)
    const [ viewnotify, setViewNotify ] = useState(null)
    const [ edititem, setEditItem ] = useState(null)
    const [ deleteitem, setDeleteItem ] = useState(false)
    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Flex justify='space-between'>
                        <ModuleTopHeading level={4} name={t('Campaign Manager')} />
                        <Button aria-labelledby='Add Campaign' type='primary' className='btnsave' onClick={()=>setVisible(true)}> 
                            <PlusOutlined /> {t("Add Campaign")}
                        </Button>
                    </Flex>
                </Col>
                <Col span={24}>
                    <PushNotificationTable
                        setVisible={setVisible}
                        setViewNotify={setViewNotify}
                        setEditItem={setEditItem}
                        setDeleteItem={setDeleteItem}
                        viewnotify={viewnotify}
                    />
                </Col>
            </Row>
            <AddNotification 
                visible={visible}
                viewnotify={viewnotify}
                edititem={edititem}
                onClose={()=>{setVisible(false);setViewNotify(null);setEditItem(null)}}
            />
            <DeleteModal 
                visible={deleteitem}
                onClose={()=>setDeleteItem(false)}
                title='Are you sure?'
                subtitle='This action cannot be undone. Are you sure you want to delete this staff member?'
                type='danger'
            />
        </>
    )
}

export { PushNotificationManagerPage }; 