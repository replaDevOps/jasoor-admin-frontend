import { useState } from 'react';
import { Row, Col, Button, Flex } from 'antd';
import { AddNotification, ArticleCards, DeleteModal, ModuleTopHeading } from '../../components';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ArticlePage = () => {

    const [ visible, setVisible ] = useState(false)
    const [ viewnotify, setViewNotify ] = useState(null)
    const [ edititem, setEditItem ] = useState(null)
    const [ deleteitem, setDeleteItem ] = useState(false)
    const navigate = useNavigate()
    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Flex justify='space-between'>
                        <ModuleTopHeading level={4} name='Articles' />
                        <Button type='primary' className='btnsave' onClick={()=>navigate('/articles/add')}> 
                            <PlusOutlined /> Add New Article
                        </Button>
                    </Flex>
                </Col>
                <Col span={24}>
                    <ArticleCards setDeleteItem={setDeleteItem}/>
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
                subtitle='This action cannot be undone. Are you sure you want to delete this article?'
                type='danger'
            />
        </>
    )
}

export { ArticlePage }; 